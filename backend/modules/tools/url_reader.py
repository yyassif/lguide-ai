# Extract and combine content recursively
import os
from typing import Dict, Optional, Type

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.pydantic_v1 import BaseModel, Field
from langchain_community.document_loaders import PlaywrightURLLoader
from langchain_core.tools import BaseTool
from logger import get_logger

logger = get_logger(__name__)


class URLReaderInput(BaseModel):
    url: str = Field(title="url", description="URL to read")


class URLReaderTool(BaseTool):
    name = "url-reader"
    description = "useful for when you need to read the content of a url."
    args_schema: Type[BaseModel] = URLReaderInput # type: ignore
    api_key: str = os.getenv("BRAVE_SEARCH_API_KEY", "")

    def _run( # type: ignore
        self, url: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> Dict:

        loader = PlaywrightURLLoader(urls=[url], remove_selectors=["header", "footer"])
        data = loader.load()

        extracted_content = ""
        for page in data:
            extracted_content += page.page_content

        return {"content": extracted_content}

    async def _arun( # type: ignore
        self, url: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> Dict:
        """Run the tool asynchronously."""
        loader = PlaywrightURLLoader(urls=[url], remove_selectors=["header", "footer"])
        data = loader.load()

        extracted_content = ""
        for page in data:
            extracted_content += page.page_content

        return {"content": extracted_content}