from typing import Optional, Type
from langchain_core.callbacks import CallbackManagerForToolRun
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.tools import BaseTool
from modules.tools.google_maps_api import GoogleNearbyPlacesAPIWrapper
from logger import get_logger
logger = get_logger(__name__)

# Define the input schema

class GooglePlacesSchema(BaseModel):
    """Input for GoogleNearbyPlacesTool."""
    query: str = Field(..., description="Query for google maps")
    location: str = Field(..., description="User's current location (latitude,longitude)")
    radius: int = Field(..., description="Search radius in meters")

class GooglePlacesTool(BaseTool):
    """Tool that queries the Google Nearby Places API."""
    name: str = "google_places"
    description: str = (
        "A wrapper around Google Nearby Places. "
        "Useful for when you need to validate or "
        "discover addressed from current user location and ambiguous text. "
        "Input should be a location, radius and search query."
    )
    api_wrapper: GoogleNearbyPlacesAPIWrapper = Field(default_factory=GoogleNearbyPlacesAPIWrapper) # type: ignore[arg-type]
    args_schema: Type[BaseModel] = GooglePlacesSchema # type: ignore

    def _run( # type: ignore
        self,
        location: str,
        query: str,
        radius: int,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        """Use the tool."""
        return self.api_wrapper.run(location=location, query=query, radius=radius)