from xonext.multimodal.speech.translators.s2t.HF_end_S2T import HF_SeamlessSTTEndpoint 
from scipy.io.wavfile import write as wav_write
import numpy as np
import torchaudio
import os

URL=os.environ.get("HF_SEAMLESS_S2T_URL")
API_KEY=os.environ.get("HF_API_TOKEN")

seamless_translator = HF_SeamlessSTTEndpoint(
    URL=URL,
    API_KEY=API_KEY
)

def get_text_result(audio,input_lang_code,output_lang_code):
    response = seamless_translator.generate(
        audio=audio,
        input_lang_code=input_lang_code,
        output_lang_code=output_lang_code
    )
    return response

