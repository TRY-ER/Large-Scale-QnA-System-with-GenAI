import React, { useState, useEffect } from 'react';

const randomized_str_options = [
    'P', 'U', 'C', 'h', '3', 'F', 'X', 'L', 'l', '8', '1', 'v', 'E',
    'D', 'O', 'J', '7', 'H', 'r', 'w', 'R', 'y', '9', 'Z', 'A', 'b',
    'm', 't', 'i', 'B', 'N', '6', 'T', 'x', 'k', 'd', '@', 'e', 's',
    '0', 'o', '4', '#', 'I', 'u', 'M', 'Y', 'g', '$', 'n', 'z', 'V',
    'K', 'q', 'c', 'W', 'Q', 'j', 'S', '2', 'f', '5', 'G', '!', '&'
];



const Iterer = (props: any) => {
    var param = props.letter;
    var delay = Number(props.delay);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const list = randomized_str_options; // Sample list with "D" at an unknown position

    useEffect(() => {
        // Check if the currentIndex is within the bounds of the list and the value is not "D"
        if (currentIndex < list.length && list[currentIndex] !== param) {
            const timer = setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, delay);

            // Clean up the timer to avoid memory leaks when the component unmounts or when "D" is found
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [currentIndex, list]);

    return <span>{list[currentIndex]}</span>;
}


const StrIterator = (props: any) => {
    let word = props.word;
    let delay = props.delay;
    let spacing = props.spacing;
    let wordList = word.split("");
    return (<>
        {wordList.map((letter: string) => {
            return <><Iterer letter={letter} delay={delay} />{spacing}</>
        })}
    </>)
}

export default StrIterator;