# import os
# from xonext.multimodal.speech.translators.t2t.google_translate import GoogleTranslator

# project_id = os.environ.get("VERTEX_PROJECT_ID")
# gc_location = os.environ.get("VERTEX_LOCATION")


# def g_t2t_en_2_or(text:str)->str:
#     translator = GoogleTranslator(
#         project_id=project_id,
#         location = gc_location
#     )
#     value = translator.translate(
#         text= text,
#         src_lang = "en",
#         tar_lang = "or"
#     )
#     return value

# def g_t2t_or_2_en(text:str)->str:
#     translator = GoogleTranslator(
#         project_id=project_id,
#         location = gc_location 
#     )
#     value = translator.translate(
#         text= text,
#         src_lang = "or",
#         tar_lang = "en"
#     )
#     return value