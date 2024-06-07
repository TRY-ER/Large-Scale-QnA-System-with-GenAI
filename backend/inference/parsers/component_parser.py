import re


def remove_all_html_tags(html):
    clean = re.compile('<.*?>')
    return re.sub(clean, '', html)


def parse_chat_content_from_list(components:list):
    content = []
    for component in components:
        try:
            res_dict = {}
            res_dict["human"] = component["content"][0]["en_query"]
            res_dict["you"] = remove_all_html_tags(component["content"][0]["response"]["en_response"])
            content.append(res_dict)
        except:
            ...
    return content