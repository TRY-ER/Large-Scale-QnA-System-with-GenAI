from xonext.lang.language_mapper.base import BaseLanuageMapper
from xonext.lang.token_counter.vertex_ai_text import VertexTextTokenCounter, VertexTokenCounterURLEnd
from langchain.embeddings import HuggingFaceInstructEmbeddings
from xonext.lang.endpoints.vertex_ai.vertex_ai_XO import GeminiTextXOEndpoint
import joblib
from ai4bharat.transliteration import XlitEngine
import os

DEFAULT_LANGUAGE_FOR_TRANSLIT = []
translit_engines = {}


def do_vertexai_token_counter_setup():
    project_id = os.environ["VERTEX_PROJECT_ID"]
    model_id = "text-bison"
    auth_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

    token_retriever = VertexTokenCounterURLEnd(
        project_id=project_id, model_id=model_id, auth_json_location=auth_path)
    VERTEX_TOKEN_COUNTER = VertexTextTokenCounter(
        count_retriever=token_retriever)


def do_init_embedder():
    embedder = HuggingFaceInstructEmbeddings(
        model_name="hkunlp/instructor-base",
        model_kwargs={"device": "cpu"}
    )

def get_translit_code(lang: str):
    return BaseLanuageMapper(lang).get_translit_lang_code()


def do_translit_setup(language_list: []):

    # initiating translitetration engines
    for lang in language_list:
        code = get_translit_code(lang)
        print(f"[++] Initiating xlit enging for {lang}")
        translit_engines[lang] = XlitEngine(code, beam_width=10, rescore=True)


def do_setup():
    do_translit_setup(DEFAULT_LANGUAGE_FOR_TRANSLIT)
    # do_vertexai_token_counter_setup()
    # do_init_embedder()
