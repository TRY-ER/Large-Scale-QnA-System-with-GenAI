
from xonext.lang.endpoints.vertex_ai.vertex_ai_XO import VertexXOEndpoint 
from xonext.lang.endpoints.vertex_ai.base import VertexBaseModel 
from xonext.lang.endpoints.vertex_ai.vertex_ai_XO import GeminiTextXOEndpoint
import os




# vertex text-bizon setup

vertex_kwargs = {
    "max_output_tokens": 1024,
    "temperature": 0,
    "top_p": 0.9,
    "top_k": 40
}

project_id = os.environ.get("VERTEX_PROJECT_ID")
gc_location = os.environ.get("VERTEX_LOCATION")
gc_m_name = "text-bison"

vertex_endpoint = VertexXOEndpoint(
        project_id=project_id,
        location=gc_location,
        m_name=gc_m_name,
        m_kwargs=vertex_kwargs
    )

   
vertex_responder = VertexBaseModel(
        llm=vertex_endpoint,
        streaming=True
    )

# gemini setup
gemini_endpoint = GeminiTextXOEndpoint(
    project_id=os.environ["VERTEX_PROJECT_ID"],
    location=os.environ["VERTEX_LOCATION"])
    

gemini_pro_responder = VertexBaseModel(
    llm=gemini_endpoint,
    streaming=True,
)

responder_mapper = {
    "PaLM2": vertex_responder,
    "Gemini Pro": gemini_pro_responder,
}