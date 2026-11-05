import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export const VoiceInput = ({ onTranscription, isListeningExternal = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. You can type your problem description directly!');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English / Hindi mix

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && onTranscription) {
          onTranscription(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Speech recognition exception:', e);
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
        isListening
          ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse shadow-glow-emergency'
          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50'
      }`}
      title={isListening ? 'Listening... click to stop' : 'Click to speak your service issue'}
    >
      {isListening ? (
        <>
          <Mic className="w-5 h-5 text-rose-400 animate-bounce" />
          <span className="text-xs font-medium text-rose-300 hidden sm:inline">Listening...</span>
        </>
      ) : (
        <>
          <Mic className="w-5 h-5" />
          <span className="text-xs text-slate-400 hidden sm:inline">Voice</span>
        </>
      )}
    </button>
  );
};
