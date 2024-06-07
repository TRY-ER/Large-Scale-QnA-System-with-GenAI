import os
from xonext.multimodal.speech.translators.t2t.nllb_hf_translate import NLLBTranslatorHF
from inference.translations.t2t.utils import handle_restircts
from inference.translations.restrict_words import odia_restricts

API_URL = os.environ.get("HF_NLLB_INF_ENDPOINT") 
HF_AUTH = os.environ.get("HF_API_TOKEN")

translator = NLLBTranslatorHF( 
        API_URL=API_URL, 
        HF_AUTH=HF_AUTH
    )

def main_translator(text,
                    src_lang:str,
                    tar_lang:str,
                    translator = translator):
    if src_lang == tar_lang: return text
    return translator.translate(
        text= text,
        src_lang = src_lang,
        tar_lang = tar_lang 
    )

def nllb_hf_t2t_en_2_or(text:str)->str:
    value = translator.translate(
        text= text,
        src_lang = "english",
        tar_lang = "odia"
    )
    processed = handle_restircts(
        value,
        odia_restricts
    )
    return processed 

def nllb_hf_t2t_or_2_en(text:str)->str:
    value = translator.translate(
        text= text,
        src_lang = "odia",
        tar_lang = "english"
    )
    return value
    