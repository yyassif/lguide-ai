import os

# Run this only when running main.py to debug backend
# You may need to run pip install python-dotenv
if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from logger import get_logger
from middlewares.cors import middleware
from modules.guideai.controller import guideai_router
from modules.misc.controller import misc_router
from packages.utils import handle_request_validation_error
from pyinstrument import Profiler

# Set the logging level for all loggers to WARNING
logging.basicConfig(level=logging.INFO)
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = get_logger(__name__)

def before_send(event, hint):
    # If this is a transaction event
    if event["type"] == "transaction":
        # And the transaction name contains 'healthz'
        if "healthz" in event["transaction"]:
            # Drop the event by returning None
            return None
    # For other events, return them as is
    return event


app = FastAPI(middleware=middleware)

# Routers for different modules
app.include_router(guideai_router)
app.include_router(misc_router)

PROFILING = os.getenv("PROFILING", "false").lower() == "true"
if PROFILING:
    @app.middleware("http")
    async def profile_request(request: Request, call_next):
        profiling = request.query_params.get("profile", False)
        if profiling:
            profiler = Profiler()
            profiler.start()
            await call_next(request)
            profiler.stop()
            return HTMLResponse(profiler.output_html())
        else:
            return await call_next(request)

@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

handle_request_validation_error(app)

if __name__ == "__main__":
    # run main.py to debug backend
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5050, log_level="warning", access_log=False)
