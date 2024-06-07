import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
// @ts-ignore
import { EventSourcePolyfill } from "event-source-polyfill";
import clipboard from "clipboard-copy";

import { removeHtmlTags } from "../../Parsers/ResponseParser/Basic";

import "./UserInter.css";
import CustomDropdown from "WidgetManager/Items/CustomDropdown/CustomDropdown";
import CustomToggler from "WidgetManager/Items/CustomToggler/CustomToggler";

import ReactDOMServer from "react-dom/server";

//transliterate setup
// @ts-ignore
import { INPUT_OPTIONS_TYPES, MODEL_OPTIONS_TYPES, TRANSLIT_MAPPER } from "extendedVariables";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import "@ai4bharat/indic-transliterate/dist/index.css";

// @ts-ignore
import { motion } from "framer-motion";


import BackgroundBlurredCircles from "components/Decorations/BlurredCricleBack/BlurredCircle";
import ThemeToggler from "WidgetManager/Items/Theme Toggler/ThemeToggler";
import masterParser from "Parsers/MasterParser/MasterParser";
import SpinningLoader from "WidgetManager/loaders/SpinLoader";


const API_BASE = process.env.REACT_APP_API_BASE_URL;
const API_WS_BASE = process.env.REACT_APP_API_WS_BASE_URL;
const PALM2_TRANSLATE_ERROR_TEXT = process.env.REACT_APP_PALM2_TRANSLATE_ERROR_TEXT
const HISTORY_THRESH = process.env.REACT_APP_HISTORY_THRESH;

const END_TOKENS = ["\nUser:", "<|endoftext|>", "</s>", "|e|"]



const UserInterface = () => {
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
    const [profileExpanded, setProfileExpanded] = useState<boolean>(false);
    const [chatStream, setChatStream] = useState<string>("");
    const [chatSummary, setChatSummary] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [generationState, setGenerationState] = useState<string>("default"); // init, complete, default, generating (four value can be given)
    const [isContentLoading, setIsContentLoading] = useState<boolean>(true);
    const [query, setQuery] = useState<string>("");
    const navigate = useNavigate();
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [activeSpeaker, setActiveSpeaker] = useState<any>(null);
    const [sideContent, setSideContent] = useState<any>(null);

    //ui changes 
    const [isDark, setIsDark] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<any>("14");


    //info-tag setup
    const [showTag, setShowTag] = useState<boolean>(false);
    const [tagText, setTagText] = useState<string>("test");
    const [tagPosition, setTagPosition] = useState<any>({ x: 0, y: 0 });

    useEffect(() => {
        console.log("isDark", isDark)
    }, [isDark])

    const handleShowTag = (e: any, infoText: string, horizontalOffset: number = 5) => {
        setShowTag(true);
        const currentRect = e?.target.getBoundingClientRect();
        setTagText(infoText);
        setTagPosition({ x: currentRect.left - (currentRect.width / 2) + horizontalOffset, y: currentRect.top - (currentRect.height / 2) - 5 })
    }

    const handleHideTag = () => {
        setTagText("");
        setShowTag(false);
    }

    //states to place the scroll to bottom button
    const chatContainerRef = useRef<any>(null);
    const scrollBottomRef = useRef<any>(null);

    //advance setting show hide
    const [showAdvanceSetting, setShowAdvanceSetting] = useState<boolean>(false);

    //text to speech audio setup
    const t2sAudioRef = useRef<any>(null);
    const [activeAudioRef, setActiveAudioRef] = useState<any>(null);
    const [audioProgress, setAudioProgress] = useState(0);


    //coverting react element into string format
    const getHTMLString = (element: any) => {
        return ReactDOMServer.renderToString(element)
    }


    //framer animation
    const sideIconVariant = {
        initial: {
            opacity: 0,
            y: "2vh", // Icon starts outside the viewport at the bottom
        },
        animate: {
            opacity: 1,
            y: 0, // Icon slides up to its final position
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    // transliteration setup
    const [translitSuggesions, setTranslitSuggestions] = useState<Array<string>>([]);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [translit, setTranslit] = useState<boolean>(true);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const inputElement = useRef<any>(null);
    const suggestionsElement = useRef<any>(null);


    // input config for model
    const [modelConfig, setModelConfig] = useState<any>({
        model_type: "Gemini Pro",
        input_lang: "english",
        output_lang: "english"
    })

    //show config content
    const showConfig = () => {
        setIsPanelOpen(true);
        setSideContent("show_config");
    }

    // show profile content
    const showProfile = () => {
        setIsPanelOpen(true);
        setSideContent("show_profile");
    }

    // component states 
    const [components, setComponents] = useState<any[]>([]);
    const [bottomScroller, setBottomScroller] = useState<boolean>(false);
    const [activeUid, setActiveUid] = useState<string>("");


    useEffect(() => {
        if (chatContainerRef.current && scrollBottomRef.current) {
            const chatContainerRect = chatContainerRef.current.getBoundingClientRect();
            const scrollBottomRect = scrollBottomRef.current.getBoundingClientRect();
            const newPosition = {
                bottom: chatContainerRect.bottom - scrollBottomRect.height,
                right: chatContainerRect.right - scrollBottomRect.width,
            }
            console.log('new position for bottom scroller >>', newPosition)
            scrollBottomRef.current.style.transform = `translate(${newPosition.right - 10}px, ${newPosition.bottom}px)`;
        }
    }, [chatContainerRef, scrollBottomRef, components])

    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        if (bottomScroller) {
            scrollToBottom();
            setBottomScroller(false);
        }
    }, [bottomScroller, components])


    // change font size 
    const changeFontSize = (e: any) => {
        setFontSize(e.target.value);
    }


    useEffect(() => {
        console.log("font size", fontSize)
        console.log("type of font size", typeof (fontSize));
    }, [fontSize])

    // t2s audio setup code

    useEffect(() => {
        console.log("audio", activeAudioRef)
        console.log("audio src", activeAudioRef?.src)
        console.log("audio ref", t2sAudioRef)
        if (activeAudioRef) {
            if (t2sAudioRef.current) {
                t2sAudioRef.current?.pause();
                t2sAudioRef.current.currentTime = 0;
            }
            activeAudioRef.play()
            t2sAudioRef.current = activeAudioRef
        }
        activeAudioRef?.addEventListener("timeupdate", () => {
            setAudioProgress(activeAudioRef?.currentTime)
        })
    }, [activeAudioRef])


    const updateEnResponse = (uid: string, newResponse: string) => {
        setComponents((prev) => {
            const new_value = prev.map((component) =>
                component.uid === uid ?
                    {
                        ...component,
                        content: [{
                            ...component.content[0],
                            response: {
                                ...component.content[0]["response"],
                                en_response: newResponse
                            }
                        }]
                    } : component
            )
            return new_value;
        }
        );
    }

    const updateEnQuery = (uid: string, newResponse: string) => {
        setComponents((prev) => {
            const new_value = prev.map((component) =>
                component.uid === uid ?
                    {
                        ...component,
                        content: [{
                            ...component.content[0], en_query: newResponse
                        }]
                    } : component
            )
            return new_value;
        }
        );
    }
    const alterEnShow = (index: any) => {
        setComponents((prev) => {
            const new_value = prev.map((component) =>
                component.uid === index ?
                    {
                        ...component,
                        content: [{
                            ...component.content[0],
                            en_show: "en_show" in component.content[0] ? !component.content[0].en_show : false,
                        }
                        ]
                    } : component
            )
            return new_value;
        }
        );
    }


    const handleKeyDown = (e: any) => {
        // setBottomScroller(true);
        if (e.key === "Enter" && !e.ctrlKey) {
            e.preventDefault();
            generateResponse();
        }
        else if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            setQuery(query + "\n");
        }
        else if (e.ctrlKey && e.shiftKey && (e.key === "Z" || e.key === "z")) {
            setTranslit(!translit);
        }
    }


    useEffect(() => {
        setQuery("");
    }, [modelConfig])




    const changeQuery = (text_value: string) => {
        setQuery(query => {
            return query + " " + text_value
        }
        )
    }

    const handleClipboard = async (index: number) => {
        if (components[index].content[0].response.res_content === "") {
            alert("nothing to copy")
        }
        else {
            await clipboard(removeHtmlTags(components[index].content[0].response.res_content)).then(() => {
                alert("text copied to the clipboard")
            }).catch(err => {
                alert(`failed to copy text ${err}`)
            })
        }
    }

    const handlePanelToggle = () => {
        setIsPanelOpen(!isPanelOpen);
        setShowTag(false);
    }


    const updateComponentResponse = (uid: string, newResponse: string) => {
        console.log("new res", uid, newResponse)
        setComponents((prev) => {
            console.log("prev", prev)
            const new_value = prev.map((component) =>
                component.uid === uid ?
                    {
                        ...component,
                        content: [{
                            ...component.content[0], response: {
                                ...component.content[0].response,
                                res_content: newResponse,
                                like: 0,
                            }
                        }]
                    } : component
            )
            return new_value;
        }
        );
    }

    const generateResponse = async () => {
        var requestable: string = "";
        if (translit && translitSuggesions.length > 0) {
            const words = query.split(" ");
            const currentWord = words[words.length - 2]
            console.log("last query word>>", currentWord)
            const residue_text = words.slice(0, -1).join(" ")
            const newText = residue_text + " " + translitSuggesions[0] + " ";
            requestable = newText
            setTranslitSuggestions([]);
        }
        else {
            requestable = query;
        }
        if (requestable.length == 0) {
            alert("Enter some query first to generate response");
        }
        else {
            setChatStream("");
            let cUid = uuidv4();
            let new_comp = {
                "content": [{
                    "query": requestable,
                    "audio_query": null,
                    "en_query": null,
                    "response": {
                        "res_content": "",
                        "res_audio": null,
                        "like": 0,
                        "en_response": null,
                        "en_show": false
                    },
                }],
                "location": null,
                "uid": cUid,
                "config": modelConfig
            }
            setComponents([...components, new_comp])
            setActiveUid(cUid);
        }
    }

    useEffect(() => {
        function handleDocumentKeyDown(event: any) {
            if (event.key === 'Escape') {
                setTranslitSuggestions([]);
                setSelectedSuggestionIndex(-1);
            }
        }

        document.addEventListener('keydown', handleDocumentKeyDown);
        return () => {
            document.removeEventListener('keydown', handleDocumentKeyDown);
        };
    }, []);


    useEffect(() => {
        if (components.length > Number(HISTORY_THRESH)) {
            var conversible_components = components.slice(-Number(HISTORY_THRESH));
        }
        else {
            var conversible_components = components.slice(0, components.length - 1)
        }

        const init_response = async () => {
            await axios.post(API_BASE + "/chat/init_response_stream", {
                "query": query,
                "location": null,
                "summary": chatSummary,
                "uid": activeUid,
                "config": modelConfig,
                "components": conversible_components,
            }).then(async resPoster => {
                // console.log("res",resPoster)
                if (resPoster.data.type === "success") {
                    setGenerationState("init");
                }
            });
        }
        if (activeUid !== "") {
            init_response();
        }
        scrollToBottom();
    }, [activeUid])

    const delHandler = (itemIndex: number) => {
        const delItem = (index: number) => {
            const comp_copy = [...components];
            comp_copy.splice(index, 1);
            setComponents(comp_copy);
        }
        delItem(itemIndex);
    }


    useEffect(() => {
        if (generationState === "init") {
            generateResponseStream(activeUid).then(() => {
                setGenerationState("complete");
            }).catch(err => {
                console.log("error in generating streams", err)
            })
        }
        else if (generationState === "complete") {
            console.log("chat stream", chatStream)
            console.log("components", components)
            console.log("active", activeUid)
        }
        else if (generationState === "default") {
            setActiveUid("");
        }
        console.log("generation state", generationState)
    }
        , [generationState])

    const generateResponseStream = async (cUid: string): Promise<void> => {
        // console.log("gen res is called");
        return new Promise<void>((resolve) => {
            if (!isStreaming) {
                const eventSource = new EventSourcePolyfill(API_BASE + `/chat/stream/${cUid}`);
                // console.log("event source is declared");

                eventSource.onopen = () => {
                    setIsStreaming(true);
                    setIsCompleted(false);
                    setQuery("");
                    setGenerationState("generating")
                }

                eventSource.onmessage = async (event: any) => {
                    if (END_TOKENS.includes(event.data)) {
                        setIsStreaming(false);
                        resolve();
                        console.log("promise is complete")
                        setIsCompleted(true);
                    }
                    else if (event.data.startsWith("[final-res]")) {
                        const final_res = event.data.split('[final-res]')[1];
                        updateEnResponse(cUid, final_res);
                    }
                    else if (event.data.startsWith("[final-query]")) {
                        const final_query = event.data.split('[final-query]')[1];
                        updateEnQuery(cUid, final_query);
                    }
                    else if (event.data.startsWith("<|tag|>")) {
                        var tag_value = event.data.split('<|tag|>')[1];
                        // replace "\" from tag_value
                        tag_value = tag_value.replace(/\\/g, "");
                        // read json object from final_query
                        const tag_json = JSON.parse(tag_value);
                        const loadingHTMLString = getHTMLString(<SpinningLoader isDark={isDark} />);
                        if (tag_json.status == "loading") {
                            setChatStream((prev) => {
                                const newChatStream = prev + `<div className="int-tag pending ${isDark ? "dark" : ""}" ><h1>${tag_json.title}</h1>${loadingHTMLString}</div>`;
                                updateComponentResponse(cUid, newChatStream);
                                return newChatStream;
                            });
                        }
                        else {
                            setChatStream((prev) => {
                                console.log("prev chat stream", prev)
                                // now replacing the <p>Loading...</p> element from previous with ""
                                const newChatStream = prev.replace(
                                    `<div className="int-tag pending ${isDark ? "dark" : ""}" ><h1>${tag_json.title}</h1>${loadingHTMLString}</div>`,
                                    `<div className="int-tag ${isDark ? "dark" : ""}" ><h1>${tag_json.title}</h1></div>`)

                                console.log("mod chat stream", newChatStream)
                                updateComponentResponse(cUid, newChatStream);
                                return newChatStream;
                            });
                        }
                    }
                    else if (event.data === PALM2_TRANSLATE_ERROR_TEXT) {
                        setChatStream(() => {
                            const newChatStream = "Choose a proper input lanuage from configuration !";
                            updateComponentResponse(cUid, newChatStream);
                            return newChatStream;
                        });
                    }
                    else {
                        setChatStream((prev) => {
                            const newChatStream = prev + event.data;
                            updateComponentResponse(cUid, newChatStream);
                            scrollToBottom();
                            return newChatStream;
                        });
                    }
                }

                eventSource.onerror = () => {
                    setIsStreaming(false);
                    eventSource.close();
                }
                setIsStreaming(true);
            }
            else {
                setIsStreaming(false);
            }
        })

    }


    const profileExpandContent = (
        <>
            <motion.div
                variants={sideIconVariant}
                initial="initial"
                animate="animate">
                <div className={`profile-expand-content ${isDark ? "dark" : ""} ${profileExpanded ? "open" : ""}`}>
                    <div className="profile-content">
                        <h1>Theme</h1>
                        <ThemeToggler
                            feature_name={``}
                            isEnabled={isDark}
                            setIsEnabled={setIsDark} />

                        <h1>Adjust Font Size</h1>
                        <div className={`slider-container ${isDark ? "dark" : ""} ${profileExpanded ? "open" : ""}`}>
                            <input type="range" min="12" max="24" value={fontSize} step="4" onChange={changeFontSize} className={`slider ${isDark ? "dark" : ""} ${profileExpanded ? "open" : ""}`} />
                            <div className={`slider-labels ${isDark ? "dark" : ""} ${profileExpanded ? "open" : ""}`}>
                                <span className={fontSize === "12" ? 'slider-active-label' : ''}>Small</span>
                                <span className={fontSize === "16" ? 'slider-active-label' : ''}>Medium</span>
                                <span className={fontSize === "20" ? 'slider-active-label' : ''}>Large</span>
                                <span className={fontSize === "24" ? 'slider-active-label' : ''}>Extra <br />Large</span>
                            </div>
                        </div>

                        <br />
                        <br />
                        <p style={{ fontSize: `${fontSize}px` }}>This text's font size will adjust.</p>
                        <br />
                        <br />
                    </div>
                </div>
            </motion.div>
        </>
    )


    const configContainer = <>
        <motion.div
            variants={sideIconVariant}
            initial="initial"
            animate="animate">
            <div className={`config-container ${isDark ? "dark" : ""}`}>
                <h1>Choose Language</h1>
                <CustomDropdown
                    options={INPUT_OPTIONS_TYPES}
                    configState={modelConfig}
                    configNames={["input_lang", "output_lang"]}
                    setConfig={setModelConfig}
                    isDark={isDark} />
                {/* <h1>Choose Language</h1>
            <CustomDropdown
                options={INPUT_OPTIONS_TYPES}
                configState={modelConfig}
                configName={"output_lang"}
                setConfig={setModelConfig} /> */}
                <br />
                <h1>Transliteration</h1>
                <CustomToggler
                    feature_name="Transliteration"
                    isEnabled={translit}
                    setIsEnabled={setTranslit}
                    isDark={isDark} />

                <div className={`drop-tog-container ${isDark ? "dark" : ""}`}>
                    <h1
                        onClick={() => {
                            setShowAdvanceSetting(!showAdvanceSetting)
                        }}
                        style={{ cursor: "pointer" }}
                    >Advanced Settings</h1>
                    {
                        showAdvanceSetting ?
                            <svg
                                fill="#000000"
                                height="10px"
                                width="10px"
                                viewBox="0 0 330 330"
                                onClick={() => {
                                    setShowAdvanceSetting(!showAdvanceSetting)
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <path

                                    id="XMLID_224_"

                                    d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z" />
                            </svg>
                            :
                            <svg
                                fill="#000000"
                                height="10px"
                                width="10px"
                                viewBox="0 0 330 330"
                                onClick={() => {
                                    setShowAdvanceSetting(!showAdvanceSetting)
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <path

                                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z" />
                            </svg>
                    }

                </div>
                {
                    showAdvanceSetting ?
                        <div>
                            <h1>Choose Model</h1>
                            <CustomDropdown
                                options={MODEL_OPTIONS_TYPES}
                                configState={modelConfig}
                                configNames={["model_type"]}
                                setConfig={setModelConfig}
                                isDark={isDark}
                            />
                        </div>
                        :
                        ""
                }
                <br />
            </div>
        </motion.div>
    </>

    const repeatedChatElements =
        components.map((item, index) => {
            return (<>
                {/* main chat element   */}
                <div className={`chat-elem ${index === (components.length - 1) ? "last-load" : ""}`}>
                    {/* query container */}
                    <motion.div
                        variants={sideIconVariant}
                        initial="initial"
                        animate="animate">
                        <div className="query-container">
                            {/* <div className={`query-space ${isPanelOpen ? "close" : ""}`}>
                        </div> */}
                            <div className={`chat-query ${isContentLoading ? "loading" : ""} ${isDark ? "dark" : ""}`}>
                                {/* upper buttons */}

                                <div className={`btn-container ${isContentLoading ? "loading" : ""} ${isDark ? "dark" : ""}`}>
                                    {index === (components.length - 1) && generationState !== "default" ? "" :
                                        <button className="regen-btn"
                                            onMouseEnter={(e) => { handleShowTag(e, "View / Hide English Version") }}
                                            onMouseLeave={handleHideTag}
                                            onClick={() => { alterEnShow(components[index].uid) }}><img src="/icons/regen.png" /></button>
                                    }
                                    <button className="del-btn"
                                        onMouseEnter={(e) => { handleShowTag(e, "Delete Query and Response") }}
                                        onMouseLeave={handleHideTag}
                                        onClick={() => { delHandler(index) }}><img src="/icons/delete-icon-2.png" /></button>
                                </div>
                                <div>
                                    <p>
                                        {item.content[0].en_show ? item.content[0].en_query : item.content[0].query}
                                    </p>
                                </div>
                            </div>
                            <div className="query-profile">
                                <img src="/icon_second/user-picture_dark.svg"
                                    alt="logo"
                                />
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={sideIconVariant}
                        initial="initial"
                        animate="animate">
                        <div className="response-container">

                            <div className="response-profile">
                                {index === (components.length - 1) ?
                                    <img src="/icon_second/byanjan_cropped_trans.png"
                                        alt="logo"
                                        className={`ai-profile-image ${generationState === "init" || generationState === "generating"
                                            ? "loading" : ""} ${isDark ? "dark" : ""}`}
                                    />
                                    :
                                    <img src="/icon_second/byanjan_cropped_trans.png"
                                        alt="logo"
                                        className={`ai-profile-image ${isDark ? "dark" : ""}`}

                                    />
                                }
                            </div>
                            <div className="indiv-response-div">
                                {index === (components.length - 1) ?
                                    <div className={`chat-response ${generationState === "init" ? "loading" : ""} ${isDark ? "dark" : ""}`}>
                                        <div className="speaker-conatiner">
                                        </div>
                                        <p style={{ fontSize: `${fontSize}px` }}>
                                            {item.content[0].en_show ?
                                                masterParser(item.content[0].response.en_response, isDark) :
                                                masterParser(item.content[0].response.res_content, isDark)}
                                        </p>
                                    </div>
                                    :
                                    <div className={`chat-response ${isDark ? "dark" : ""}`}>
                                        <p>
                                            {item.content[0].en_show ? masterParser(item.content[0].response.en_response) : masterParser(item.content[0].response.res_content)}
                                        </p>
                                    </div>
                                }
                                {index === (components.length - 1) && generationState !== "default" ?
                                    ""
                                    :
                                    <motion.div
                                        variants={sideIconVariant}
                                        initial="initial"
                                        animate="animate">
                                        <div className={`res-btn-container ${isContentLoading ? "loading" : ""} ${isDark ? "dark" : ""}`}>
                                            <button className="copy-btn" onClick={() => { handleClipboard(index) }}
                                                onMouseEnter={(e) => { handleShowTag(e, "Copy Response") }}
                                                onMouseLeave={handleHideTag}
                                            ><img src="/icons/copy to clipboard.png" /></button>
                                        </div>
                                    </motion.div>
                                }
                            </div>
                        </div>
                    </motion.div>
                </div>
            </>)
        })

    useEffect(() => {
        console.log("is record in main>>", isRecording)
    }, [isRecording])

    return (
        <>
            <div className="inter-main-container">
                <div className={`side-pane ${isPanelOpen ? "open" : ""} ${isDark ? "dark" : ""} custom-scrollbar`}>
                    <div className={`side-option ${isPanelOpen ? "open" : ""} custom-scrollbar`}>
                        <div className={`top-side-container ${isPanelOpen ? "open" : ""} ${isDark ? "dark" : ""} custom-scrollbar`}>
                            {isPanelOpen ? <>
                                <motion.div
                                    variants={sideIconVariant}
                                    initial="initial"
                                    animate="animate">
                                    <img src="/icon_second/anchor-left-arrow-white.svg"
                                        alt="logo"
                                        onMouseEnter={(e) => { handleShowTag(e, "Hide Pane") }}
                                        onMouseLeave={handleHideTag}
                                        className={`side-collapser ${isDark ? "dark" : ""}`}
                                        onClick={handlePanelToggle}
                                    />
                                </motion.div>
                            </> : ""}
                        </div>
                        <div className="side-divider"></div>
                        <div className={`side-expand-container ${isPanelOpen ? "open" : ""} custom-scrollbar`}>
                            <div className="side-icon-container">
                                <motion.div
                                    variants={sideIconVariant}
                                    initial="initial"
                                    animate="animate">
                                    <img src="/icon_second/user-picture_dark.svg"
                                        alt="logo"
                                        id="side-profile-image"
                                        onMouseEnter={(e) => { handleShowTag(e, "Profile", 12) }}
                                        onMouseLeave={handleHideTag}
                                        onClick={showProfile}
                                    />
                                </motion.div>
                            </div>
                            <div className={`side-content-container ${isPanelOpen ? "open" : ""} custom-scrollbar`}>
                                <div className={`side-panel ${isPanelOpen ? "open" : ""} custom-scrollbar`}>
                                    <div className="panel-content">
                                        {isPanelOpen && sideContent === "show_profile" ? profileExpandContent : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`inter-inner-container ${isPanelOpen ? "panel-open" : ""} ${profileExpanded ? "profile-open" : ""} ${isDark ? "dark" : ""}`}
                    style={{ fontSize: `${fontSize}px` }}
                >

                    <div
                        ref={chatContainerRef}
                        className={`chat-container ${isPanelOpen ? "panel-open" : ""} ${isDark ? "dark" : ""}`} id="blur-div">
                        {
                            components.length > 0 ?
                                "" :
                                <div className={`intro-sec ${isDark ? "dark" : ""}`}>
                                    <h1>THE LARGE SCALE <br />QUESTION ANSWERING SYSTEM</h1>
                                </div>
                        }
                        {repeatedChatElements}
                        <div ref={bottomRef} id="bottomRef"></div>
                    </div>
                    <motion.div
                        variants={sideIconVariant}
                        initial="initial"
                        animate="animate">
                        <div className="bottom-container"


                        >
                            <div className="query-gen-container">
                                <div className={`query-text-container ${isContentLoading ? "loading" : ""} ${isDark ? 'dark' : ""}`}>
                                    <IndicTransliterate
                                        renderComponent={(props: any) => (
                                            <textarea placeholder="Enter your query here"
                                                style={{ fontSize: fontSize }}
                                                disabled={isRecording || generationState === "generating"}
                                                {...props} />)}
                                        lang={TRANSLIT_MAPPER[modelConfig["input_lang"]]}
                                        value={query}
                                        onChangeText={(value: any) => setQuery(value)}
                                        offsetY={-300}
                                        containerClassName="query-text-object"
                                        enabled={false}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                                <div className={`query-button-container ${isContentLoading ? "loading" : ""} ${isDark ? 'dark' : ""}`}>
                                    <button onClick={() => generateResponse()} disabled={isRecording && generationState === "generating"}>
                                        <img src="/icon_second/send-filled.svg" alt="logo"
                                            onMouseEnter={(e) => { handleShowTag(e, "Generate Resonse") }}
                                            onMouseLeave={handleHideTag}
                                        />
                                    </button>
                                    <button className={`query-button-container-recorder ${isContentLoading ? "loading" : ""}`}
                                        onMouseEnter={(e) => { handleShowTag(e, "Activate Recorder") }}
                                        onMouseLeave={handleHideTag}
                                    >
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div
                    ref={scrollBottomRef}
                    className={`bottom-scroller ${isDark ? "dark" : ""}`}
                    onClick={scrollToBottom}
                    onMouseEnter={(e) => { handleShowTag(e, "Scroll To Bottom", -12) }}
                    onMouseLeave={handleHideTag}
                >{
                        components.length > 0 ?
                            <img src="/icon_second/generate_dark.svg" alt="logo" />
                            : ""
                    }
                </div>

                < BackgroundBlurredCircles isDark={isDark} />
                {
                    showTag ?
                        <div className={`info-tag ${isDark ? "dark " : ""}`}
                            style={{ transform: `translate(${tagPosition.x}px, ${tagPosition.y}px)` }}
                        >
                            <h1>{tagText}</h1>
                        </div>
                        :
                        ""
                }
            </div >
        </>
    )
}
export default UserInterface;