from ai4bharat.transliteration import XlitEngine
from xonext.lang.language_mapper.base import BaseLanuageMapper 



def translit_from_roman(word:str,
                        lang:str,
                        xlit_container:list):
    if lang in xlit_container.keys():
        e = xlit_container[lang] 
        out = e.translit_word(word, topk=5)
        lang_code = BaseLanuageMapper(lang).get_translit_lang_code() 
        roman = out[lang_code]
        roman.append(word)
        return roman 
    else:
        return [word]