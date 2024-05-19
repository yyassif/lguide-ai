import logging
import requests
from typing import Any, Dict, Optional

from langchain_core.pydantic_v1 import BaseModel, Extra, root_validator
from langchain_core.utils import get_from_dict_or_env

from packages.s3_image_upload import uploader


class GoogleNearbyPlacesAPIWrapper(BaseModel):
    """Wrapper Around Google Nearby Places API.

    By default, this will return all the results within the specified radius
    that match the input query. You can use the top_k_results argument to limit 
    the number of results.

    """

    google_maps_api_key: Optional[str] = None
    google_map_client: Any  #: :meta private:
    top_k_results: Optional[int] = None

    class Config:
        """Configuration for this pydantic object."""

        extra = Extra.forbid
        arbitrary_types_allowed = True

    @root_validator()
    def validate_environment(cls, values: Dict) -> Dict:
        """Validate that api key is in your environment variable."""
        google_maps_api_key = get_from_dict_or_env(
            values, "google_maps_api_key", "GOOGLE_MAPS_API_KEY"
        )
        values["google_maps_api_key"] = google_maps_api_key
        try:
            import googlemaps

            values["google_map_client"] = googlemaps.Client(google_maps_api_key)
        except ImportError:
            raise ImportError(
                "Could not import googlemaps python package. "
                "Please install it with `pip install googlemaps`."
            )
        return values

    def run(self, location: str, query: str, radius: int) -> str:
        """Run Nearby Places search and get k number of places that match the query within the given radius."""
        search_results = self.google_map_client.places_nearby(location=location, keyword=query, rank_by="distance")["results"]
        num_to_return = len(search_results)

        print(f"Found {num_to_return} places that match the description within the given radius")
        print("Results: ", search_results)

        places = []

        if num_to_return == 0:
            return "Google Places did not find any places that match the description within the given radius"

        num_to_return = (
            num_to_return
            if self.top_k_results is None
            else min(num_to_return, self.top_k_results)
        )

        for i in range(num_to_return):
            result = search_results[i]
            details = self.fetch_place_details(result["place_id"])

            if details is not None:
                places.append(details)

        return "\n".join([f"{i+1}. {item}" for i, item in enumerate(places)])

    def fetch_place_details(self, place_id: str) -> Optional[str]:
        try:
            place_details = self.google_map_client.place(place_id)
            place_details["place_id"] = place_id
            formatted_details = self.format_place_details(place_details)
            return formatted_details
        except Exception as e:
            logging.error(f"An Error occurred while fetching place details: {e}")
            return None

    def format_place_details(self, place_details: Dict[str, Any]) -> Optional[str]:
        try:
            name = place_details.get("result", {}).get("name", "Unknown")
            address = place_details.get("result", {}).get("formatted_address", "Unknown")
            phone_number = place_details.get("result", {}).get("formatted_phone_number", "Unknown")
            website = place_details.get("result", {}).get("website", "Unknown")
            rating = place_details.get("result", {}).get("rating", "Unknown")
            location = place_details.get("result", {}).get("geometry", {}).get("location", {})
            print("Location: ", location)
            open_now = place_details.get("result", {}).get("opening_hours", {}).get("open_now", "Unknown")
            latitude = location.get("lat", "Unknown")
            longitude = location.get("lng", "Unknown")
            photo_reference = place_details.get("result", {}).get("photos", [{}])[0].get("photo_reference", "Unknown")
            image_base64 = self.get_photo_url(photo_reference, name.replace(" ", "_").lower())
            json_reviews = place_details.get("result", {}).get("reviews", [])
            reviews = [review["text"] + "\n\n" for review in json_reviews[:3] if "text" in review]

            formatted_details = {
                "name": name,
                "address": address,
                "phone": phone_number,
                "website": website,
                "latitude": latitude,
                "longitude": longitude,
                "rating": rating,
                "open_now": open_now,
                "image_url": image_base64,
                "reviews": reviews
            }
            return str(formatted_details)
        except Exception as e:
            logging.error(f"An error occurred while formatting place details: {e}")
            return None
    
    def get_photo_url(self, photo_reference: str, filename: str, max_width=400) -> str:
        url = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth={max_width}&photoreference={photo_reference}&key={self.google_maps_api_key}'
        response = requests.get(url)
        if response.status_code == 200:
            
            return uploader.upload_image(response.content, f"{filename}.jpg")
        else:
            return "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"
