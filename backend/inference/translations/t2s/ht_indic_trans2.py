from xonext.multimodal.speech.translators.t2s.HF_end_T2S import HF_IndicTTSEndpoint
import os

URL=os.environ.get("HF_INDIC_T2S_URL")
API_KEY=os.environ.get("HF_API_TOKEN")

indic_translator = HF_IndicTTSEndpoint(
    URL=URL,
    API_KEY=API_KEY
)

def get_audio_result(text,input_lang_code,output_lang_code,speaker_gender,return_bytes=False):
    response = indic_translator.generate(
        text=text,
        input_lang_code=input_lang_code,
        output_lang_code=output_lang_code,
        speaker_gender=speaker_gender,
        return_bytes=return_bytes
    )
    return response