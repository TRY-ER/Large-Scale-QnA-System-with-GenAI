import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import "./MasterParser.css";


const masterParser = (rawResponse: string, isDark: boolean= false) => {
    var html_parsed_value = parse(rawResponse)
    return <>
        <div className={`parsable-div ${isDark? "dark": ""}`}>
            {html_parsed_value}
        </div>
    </>
        ;
}


export default masterParser;    