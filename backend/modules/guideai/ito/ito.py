from abc import abstractmethod
from pydantic import BaseModel
from logger import get_logger
from typing import Any

from modules.guideai.dto.inputs import InputGuideAI

logger = get_logger(__name__)

class ITO(BaseModel):
    input: InputGuideAI

    def __init__(
        self,
        input: InputGuideAI,
        **kwargs,
    ):
        super().__init__(input=input, **kwargs)

    @abstractmethod
    def process_assistant(self) -> Any:
        pass
