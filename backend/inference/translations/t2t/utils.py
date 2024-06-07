


def handle_restircts(word: str,
                     restricts: list)->str:
    returnable = word 
    for r in restricts:
        print("restriction triggered")
        print("before returnable>>",returnable)
        print("value>>",r)
        returnable = returnable.replace(r,"") 
        print("after returnable>>",returnable)
    return returnable