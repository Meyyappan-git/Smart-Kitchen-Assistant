import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Camera, X, MicOff } from 'lucide-react';

export default function SearchBar({ 
  value = '', 
  onChange, 
  onSearch, 
  onOpenPhotoScan,
  placeholder = "Search ingredients..." 
}) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onChange) onChange(transcript);
        if (onSearch) onSearch(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [onChange, onSearch]);

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Voice input is not supported in this browser. You can type directly in the search bar.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition error:", err);
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center bg-white rounded-2xl border border-stone-200/80 shadow-sm px-3.5 py-2.5 transition-all focus-within:border-[#FF6A00] focus-within:ring-2 focus-within:ring-[#FF6A00]/15">
        {/* Left search icon */}
        <Search className="w-5 h-5 text-stone-400 shrink-0 mr-2.5" />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch(value)}
          placeholder={isListening ? "Listening... Speak ingredient name" : placeholder}
          className="w-full bg-transparent text-sm text-slate-800 placeholder:text-stone-400 focus:outline-none"
        />

        {/* Clear text button */}
        {value && (
          <button 
            type="button"
            onClick={() => {
              if (onChange) onChange('');
              if (onSearch) onSearch('');
            }}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-full mr-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Action icons on right: Mic & Camera */}
        <div className="flex items-center gap-1 shrink-0 ml-1 pl-2 border-l border-stone-200">
          {/* Microphone button (Web Speech API) */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? "Stop listening" : "Search by voice"}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isListening 
                ? 'bg-orange-500 text-white voice-listening shadow-md shadow-orange-500/30' 
                : 'text-stone-500 hover:text-[#FF6A00] hover:bg-orange-50'
            }`}
            aria-label="Voice input"
          >
            {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Camera button (Opens fridge photo upload) */}
          <button
            type="button"
            onClick={onOpenPhotoScan}
            title="Scan fridge photo with Gemini AI"
            className="p-2 text-stone-500 hover:text-[#FF6A00] hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
            aria-label="Upload fridge photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Listening indicator toast */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-1.5 px-3 py-1.5 bg-orange-600 text-white text-xs rounded-xl shadow-lg flex items-center justify-between z-10 animate-fadeIn">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Listening to your microphone...
          </span>
          <button onClick={toggleVoiceInput} className="text-white/80 hover:text-white font-bold text-xs">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
