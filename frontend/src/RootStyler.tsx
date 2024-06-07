import { random } from "gsap";
import React from "react";


const getRandom = (min: any, max: any) => {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber
}



const getRootSvg = (numLines: any, windowWidth: any, windowHeight: any) => {

    console.log("height", windowHeight)
    console.log("width", windowWidth)
    const upper_lines = Array.from({ length: numLines }).map((_, index) => {
        const x1 = getRandom(Math.floor(windowWidth * 0.33), Math.floor(windowWidth * 0.66));
        const y1 = getRandom(0, Math.floor(windowHeight * 0.33));

        const x2 = getRandom(Math.floor(windowWidth * 0.66), windowWidth);
        const y2 = getRandom(Math.floor(windowHeight * 0.33), Math.floor(windowHeight * 0.66));

        const random_width: number = getRandom(1, 20);

        return (
            `{
       <path
            d = "M 0 0 C ${x1} ${y1}, ${x2} ${y2}, ${windowWidth} ${windowHeight}"
            fill="none"
            stroke="red"
            stroke-width="${random_width}"
        /> 
        }`
        );
    })

    const lower_lines = Array.from({ length: numLines }).map((_, index) => {
        const x1 = getRandom(0, Math.floor(windowWidth * 0.33));
        const y1 = getRandom(Math.floor(windowHeight * 0.33), windowHeight * 0.66);

        const x2 = getRandom(Math.floor(windowWidth * 0.33), Math.floor(windowWidth * 0.66));
        const y2 = getRandom(Math.floor(windowHeight * 0.66), windowHeight);


        const random_width: number = getRandom(1, 20);

        return (
            `{
       <path
            d = "M 0 0 C ${x1} ${y1}, ${x2} ${y2}, ${windowWidth} ${windowHeight}"
            fill="none"
            stroke= "white"
            stroke-width="${random_width}"
        /> 
        }`
        );
    })

    const svgString = ` 
    <svg width="100%" height="100%"  xmlns="http://www.w3.org/2000/svg" fill="white">
        <rect x="0" y="0" width="${windowWidth}" height="${windowHeight}" fill="white" />
        <circle cx="${windowWidth}" cy="${windowHeight/2}" r="${windowHeight/2}" fill="black" />  
    </svg> 
    `
        ;
    const svgURI = `data:image/svg+xml,${encodeURIComponent(String(svgString))}`

    const rootStyle = {
        background: `black`,
        backgroundSize: 'cover',
    }
    return rootStyle;// 
}

export default getRootSvg;