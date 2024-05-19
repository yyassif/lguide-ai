from logger import get_logger
from fastapi import APIRouter, HTTPException
from modules.guideai.dto.inputs import InputGuideAI
from modules.guideai.ito.guideai import GuideAIAssistant

guideai_router = APIRouter()

logger = get_logger(__name__)

@guideai_router.post(
    "/guideai",
    # dependencies=[Depends(AuthBearer())],
    tags=["Guide AI"],
)
def ai_guide(
    input: InputGuideAI
):
    guideai_assistant = GuideAIAssistant(input=input)
    try:
        guideai_assistant.check_input()
        return guideai_assistant.process_assistant()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
