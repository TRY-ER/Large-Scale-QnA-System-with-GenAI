
const MODEL_OPTIONS_TYPES = ["PaLM2","Gemini Pro"]
const INPUT_OPTIONS_TYPES = ['odia', 'english', 'hindi', 'bangla', 'gujarati', 'kannada', 'malayalam', 'marathi', 'nepali', 'panjabi', 'tamil', 'telugu', 'urdu'] 

const TRANSLIT_MAPPER:any = {
    'english': 'en',
    'bangla': 'bn',
    'gujarati': 'gu',
    'hindi': 'hi',
    'kannada': 'kn',
    'malayalam': 'ml',
    'marathi': 'mr',
    'nepali': 'ne',
    'odia': 'or',
    'panjabi': 'pa',
    'tamil': 'ta',
    'telugu': 'te',
    'urdu': 'ur'
}

export {
    MODEL_OPTIONS_TYPES,
    INPUT_OPTIONS_TYPES,
    TRANSLIT_MAPPER
}