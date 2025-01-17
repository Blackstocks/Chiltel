import React, { useState, useEffect } from 'react';

const TypewriterText = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "Expert Appliance\nSolutions at Your Doorstep";
  const typingSpeed = 100;
  const erasingSpeed = 30;
  const delayBeforeErasing = 2000;

  useEffect(() => {
    let timeout;

    if (isTyping) {
      if (text !== fullText) {
        timeout = setTimeout(() => {
          setText(fullText.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayBeforeErasing);
      }
    } else {
      if (text) {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, erasingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(true);
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isTyping]);

  return (
    <div className="relative mb-2 sm:mb-3 md:mb-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-900 whitespace-pre-line leading-tight min-h-[3em] sm:min-h-[2.75em] md:min-h-[3em]">
        {text}
        <span
          className="inline-block w-0.5 h-[1em] ml-[2px] -mb-1 bg-gray-900 animate-pulse"
          style={{ verticalAlign: "baseline" }}
        />
      </h1>
    </div>
  );
};

export default TypewriterText;