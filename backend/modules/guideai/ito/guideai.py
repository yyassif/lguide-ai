from typing import List



from logger import get_logger
from langchain_openai import ChatOpenAI
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_core.output_parsers import JsonOutputParser
from langchain.agents import AgentType, initialize_agent
from langchain_core.prompts import ChatPromptTemplate
from modules.guideai.dto.inputs import InputGuideAI
from modules.guideai.ito.ito import ITO
from modules.tools import GooglePlacesTool

logger = get_logger(__name__)

class PlaceInformationDetails(BaseModel):
    name: str = Field(..., description="Name of the place")
    address: str = Field(..., description="Address of the place")
    phone: str = Field(..., description="Phone number of the place")
    rating: float = Field(..., description="Rating of the place")
    website: str = Field(..., description="Website of the place")
    image_url: str = Field(..., description="Image URL of the place")
    open_now: bool = Field(..., description="Whether the place is open now or not")
    latitude: float = Field(..., description="Latitude of the place")
    longitude: float = Field(..., description="Longitude of the place")
    overview: str = Field(..., description="Overall overview of the place")

    @validator("rating", "latitude", "longitude")
    def verify_rating(cls, field):
        if not isinstance(field, float):
            raise ValueError("Rating, Latitude or Longitude must be a float.")
        if field < 0 or field > 5:
            raise ValueError("Rating, Latitude or Longitude must be between 0 and 5.")
        return field
    
    @validator("name", "address", "phone", "website", "image_url", "overview")
    def verify_name(cls, field):
        if not isinstance(field, str):
            raise ValueError("Name must be a string.")
        return field

class PlacesInformation(BaseModel):
    places: List[PlaceInformationDetails] = Field(..., description="List of places information")
    overview: str = Field(..., description="Overall overview of the places")

    @validator("overview")
    def verify_overview(cls, field):
        if not isinstance(field, str):
            raise ValueError("Overview must be a string.")
        return field

    @validator("places")
    def verify_places(cls, field):
        if not isinstance(field, list):
            raise ValueError("Places must be a list.")
        return field

json_parser_template = """
You are an AI assistant that transforms the query into a structured JSON format.

But first, you need to understand that the overview is a one paragraph summary of what you think about the place based on its review. So, you need to extract the all of reviews from the reviews field and summarize them to generate the ourview.
When you're constructing the structured format, make sure not to miss the following fields:
- name: Name of the place
- address: Address of the place
- latitude: Latitude of the place
- longitude: Longitude of the place
- image_url: Image URL of the place

Here are the instructions to format the structured format:
{format_instructions}

Here is the query you need to transform into the structured format:
{query}
"""

class GuideAIAssistant(ITO):
    def __init__(
        self,
        input: InputGuideAI,
        **kwargs,
    ):
        super().__init__(
            input=input,
            **kwargs,
        )

    def check_input(self):
        if not self.input:
            raise ValueError("Input is required.")
        if not isinstance(self.input.location, str):
            raise ValueError("Location must be a string")
        if not isinstance(self.input.service_type, str):
            raise ValueError("Service type must be a string")
        if not isinstance(self.input.radius, int):
            raise ValueError("Radius must be an integer")
        if self.input.radius <= 0:
            raise ValueError("Radius must be greater than 0")
        if len(self.input.location.split(","))  != 2:
            raise ValueError("Location must be a latitude,longitude string")
        return True

    def process_assistant(self):
        try:
            logger.info("Processing assistant")
            tools = [GooglePlacesTool()]
            llm = ChatOpenAI(model="gpt-4o", temperature=0.1)

            # initialize agent with tools
            agent = initialize_agent(
                agent=AgentType.OPENAI_FUNCTIONS,
                tools=tools,
                llm=llm,
                verbose=True,
                max_iterations=3,
                handle_parsing_errors=True,
            )

            # parser = JsonOutputParser(pydantic_object=PlaceInformationDetails)
            # prompt = PromptTemplate(
            #     template=json_parser_template,
            #     input_variables=["query"],
            #     partial_variables={"format_instructions": parser.get_format_instructions()},
            # )

            # chain = agent | { "query": itemgetter("output") } | prompt | llm | parser
            
            # answer = chain.invoke({
            #     "input": self.input
            # })

            # configure output parser in chain or call parse()
            parser = JsonOutputParser(pydantic_object=PlacesInformation)
            format_instruction = parser.get_format_instructions()
            
            ts = """
            You are an Intelligent assistant who can search nearby places using Google Places Tool and retrieve the necessary information delimited by the format instructions below.
            Take the input below delimited by triple backticks and use it to search and gather information using the Google Places Tool.
            
            Input:```{input}```

            Here are the instructions to format the JSON structured format:
            {format_instruction}
            """

            prompt = ChatPromptTemplate.from_template(ts)
            
            fs = prompt.format_messages(input=self.input, format_instruction=format_instruction)
            
            response = agent.run(fs)
            
            answer = parser.parse(response)

            return answer
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            raise

