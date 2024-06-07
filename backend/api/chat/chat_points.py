from fastapi import APIRouter 
from fastapi.responses import StreamingResponse
from models.user import User
from inference.llms.base import (
    RESPONSE_DICT,
    generate_stream_response,
    )



router = APIRouter()



@router.post("/init_response_stream")
async def gen_response(data:dict):
    query = data["query"]
    location = data["location"]
    summary = data["summary"]
    uid = data["uid"]
    config = data["config"]
    components = data["components"]
    try:
        response_dict = {"query" : query,
                         "summary": summary,
                         "location": location,
                         "config": config,
                         "response": "",
                         "components": components} 
        RESPONSE_DICT[uid] = response_dict
        response = {"type": "success"}
    except Exception as e:
        print("error >>",e)
        response = {"type": "fail"}
    return response

@router.get("/stream/{stream_id}")
async def stream_response(stream_id: str):
    return StreamingResponse(generate_stream_response(
        stream_id = stream_id,
    ),media_type="text/event-stream")

