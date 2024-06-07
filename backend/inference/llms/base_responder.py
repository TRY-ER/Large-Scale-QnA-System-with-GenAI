from xonext.lang.endpoints.vertex_ai.base import RunnableBaseModel 



class BaseResponder():
    def __init__(self,
                 query,
                 summary,
                 location,
                 config:dict,
                 components,
                 responder:RunnableBaseModel,
                 instruction_dict,
                 translator,
                 chat_parsing_function: callable,
                 html_parsing_function: callable):
        self.query = query
        self.summary = summary
        self.location = location
        self.config = config
        self.components = components
        self.responder = responder  #this is the llm model that get the actual response
        self.instruction_dict = instruction_dict # this is the instruction for generating the response
        self.translator = translator
        self.chat_parsing_function = chat_parsing_function
        self.html_parsing_function = html_parsing_function
        self.parsed_conversation = chat_parsing_function(components) 


    def stream_run(self,
                   ):
        trans_query = self.translator(self.query,
                                    src_lang=self.config["input_lang"],
                                    tar_lang="english")


        print("instruct in stream run>>", self.instruction_dict)
        result = self.responder.stream_run(
            prompt=trans_query,
            instruction_dict=self.instruction_dict,
            conversation_sources=self.parsed_conversation
        )

        final_res = ""
        store = ""
        for r in result:
            final_res = final_res + r
            parsed, residue = self.html_parsing_function(
                r,
                self.translator,
                store,
                input_lang="english",
                output_lang=self.config["output_lang"]
            ) 
            if parsed == None:
                store = residue
            else:
                store = residue
                yield f"data: {parsed} \n\n"
        
        yield f"data: {store}\n\n"

        final_query= "[final-query]" + trans_query 
        print("finalquery>>", final_query)
        yield f"data: {final_query}\n\n"

        # if config["output_lang"] == 'english':
        #     final_res = "[final-res]" + "en_response" 
        #     yield f"data: {final_res}\n\n"
        # else:
        final_res = "[final-res]" + final_res 
        final_res= final_res.replace("\n", " ")
        yield f"data: {final_res}\n\n"