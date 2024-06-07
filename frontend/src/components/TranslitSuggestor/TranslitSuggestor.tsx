import React, { useState, useEffect } from 'react';

const TransliterationInput = () => {
  // const [inputText, setInputText] = useState('');
  // const [suggestions, setSuggestions] = useState([]);
  // const [cursorPosition, setCursorPosition] = useState(0);
  // const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // const transliterationData = {
  //   // Your transliteration data here
  // };

  // const handleInputChange = (event) => {
  //   const text = event.target.value;
  //   setInputText(text);
  //   setCursorPosition(event.target.selectionStart);
  //   const words = text.split(' ');
  //   const currentWord = words[words.length - 1];

  //   if (currentWord in transliterationData) {
  //     const currentSuggestions = transliterationData[currentWord];
  //     setSuggestions(currentSuggestions);
  //     setSelectedSuggestionIndex(-1); // Reset selected suggestion
  //   } else {
  //     setSuggestions([]);
  //     setSelectedSuggestionIndex(-1); // Reset selected suggestion
  //   }
  // };

  // const handleSuggestionClick = (suggestion) => {
  //   const words = inputText.split(' ');
  //   const currentWord = words[words.length - 1];
  //   const newText = inputText.replace(currentWord, suggestion);
  //   setInputText(newText);
  //   setSuggestions([]);
  //   setSelectedSuggestionIndex(-1);
  // };

  // const handleInputKeyDown = (event) => {
  //   if (event.key === ' ' && suggestions.length > 0) {
  //     setSuggestions([]);
  //     setSelectedSuggestionIndex(-1);
  //   } else if (event.key === 'ArrowDown' && selectedSuggestionIndex < suggestions.length - 1) {
  //     setSelectedSuggestionIndex(selectedSuggestionIndex + 1);
  //   } else if (event.key === 'ArrowUp' && selectedSuggestionIndex > 0) {
  //     setSelectedSuggestionIndex(selectedSuggestionIndex - 1);
  //   }
  // };

  // const handleDocumentClick = (event) => {
  //   if (!event.target.classList.contains('suggestion-list-item')) {
  //     setSuggestions([]);
  //     setSelectedSuggestionIndex(-1);
  //   }
  // };

  // useEffect(() => {
  //   function handleDocumentKeyDown(event) {
  //     if (event.key === 'Escape') {
  //       setSuggestions([]);
  //       setSelectedSuggestionIndex(-1);
  //     }
  //   }

  //   document.addEventListener('keydown', handleDocumentKeyDown);
  //   return () => {
  //     document.removeEventListener('keydown', handleDocumentKeyDown);
  //   };
  // }, []);

  // return (
  //   <div className="input-container">
  //     <input
  //       id="transliteration-input"
  //       className="auto-wrap-input"
  //       type="text"
  //       placeholder="Type in English"
  //       value={inputText}
  //       onChange={handleInputChange}
  //       onKeyDown={handleInputKeyDown}
  //     />
  //     {suggestions.length > 0 && (
  //       <ul
  //         id="suggestions"
  //         className="suggestion-list"
  //         style={{
  //           left: `${cursorPosition * 5}px`,
  //           display: 'block',
  //         }}
  //       >
  //         {suggestions.map((suggestion, index) => (
  //           <li
  //             key={index}
  //             className={`suggestion-list-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
  //             onClick={() => handleSuggestionClick(suggestion)}
  //           >
  //             {suggestion}
  //           </li>
  //         ))}
  //       </ul>
  //     )}
  //   </div>
  // );
};

export default TransliterationInput;
