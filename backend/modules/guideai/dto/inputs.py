from typing_extensions import Self
from pydantic import BaseModel, model_validator

class InputGuideAI(BaseModel):
    location: str
    service_type: str
    radius: int
    query: str

    @model_validator(mode='after')
    def verify_attributes(self) -> Self:
        if not isinstance(self.radius, int):
            raise ValueError("Radius must be an integer")
        if not isinstance(self.query, str):
            raise ValueError("Query must be a string")
        if not isinstance(self.service_type, str):
            raise ValueError("Service type must be a string")
        if self.radius <= 0:
            raise ValueError("Radius must be greater than 0")
        if not isinstance(self.location, str):
            raise ValueError("Location must be a string")
        parts = self.location.split(",")
        if len(parts)  != 2:
            raise ValueError("Location must be a latitude,longitude string")
        try:
            _lat, _lon = float(parts[0]), float(parts[1])
        except ValueError:
            raise ValueError("Latitude and longitude must be valid floats")
        return self
    
