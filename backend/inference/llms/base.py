from xonext.lang.endpoints.huggingface.base import HFBaseModel
from xonext.lang.endpoints.huggingface.huggingface_XO import HuggingfaceXOEndpoint
from xonext.lang.parsers.linear_html_parser import parse_translate_linear_html
from xonext.lang.parsers.main_html_parser import main_translate_linear_html 
from xonext.multimodal.speech.translators.t2t.nllb_hf_translate import NLLBTranslatorHF
from inference.llms.base_responder import BaseResponder
from inference.parsers.component_parser import parse_chat_content_from_list
from inference.llms.responders import responder_mapper

import os
from inference.llms.instructions import instruction_prompts
# from inference.translations.t2t.google_t2t import g_t2t_en_2_or
from inference.translations.t2t.nllb_hf_t2t import (
    nllb_hf_t2t_en_2_or,
    nllb_hf_t2t_or_2_en,
    main_translator
    )

import time

RESPONSE_DICT = {}

# HF Inference Endpoints parameter
endpoint_url = os.environ.get("HF_INF_ENDPOINT") 
hf_token = os.environ.get("HF_API_TOKEN") 



def map_responder_from_config(config):
    if config["model_type"] in responder_mapper.keys():
        return responder_mapper[config["model_type"]]
    else:
        raise f"There is no setup for model {config['model_type']}"


async def generate_stream_response(
        stream_id: str):
    query = RESPONSE_DICT[stream_id]["query"]
    summary = RESPONSE_DICT[stream_id]["summary"]
    location = RESPONSE_DICT[stream_id]["location"]
    config = RESPONSE_DICT[stream_id]["config"]
    components = RESPONSE_DICT[stream_id]["components"]
    responder = map_responder_from_config(config) 
    translator = main_translator 
    chat_parsing_function = parse_chat_content_from_list
    html_parsing_function = main_translate_linear_html 

    generator = BaseResponder(
        query=query,
        summary=summary,
        location=location,
        config=config,
        components=components,
        responder=responder,
        instruction_dict=instruction_prompts,
        translator=translator,
        chat_parsing_function=chat_parsing_function,
        html_parsing_function=html_parsing_function,
    )

    result = generator.stream_run()
    for r in result:
        yield r
        
    end_val = "|e|"
    try:
        del RESPONSE_DICT[stream_id]
        print(f"stream id: {stream_id} is removed!")
    except:
        print(f"stream id: {stream_id} can't be removed!")
        ...
    yield f"data: {end_val}\n\n"


