import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate } from "react-router-dom";
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!listening && transcript) {
      handleSendMessage(transcript, true);
      resetTranscript();
    }
  }, [listening]);

  /** 💬 Handle Chat Messages */
  const handleSendMessage = async (text, isVoice = false) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("https://notebook-backend-boss.onrender.com/query/", { query: text });
      const botMessage = { text: response.data.answer, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);

      if (isVoice) {
        const utterance = new SpeechSynthesisUtterance(response.data.answer);
        speechUtteranceRef.current = utterance;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { text: "Error fetching response.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  /** 🎙️ Voice Input */
  const handleVoiceInput = () => {
    SpeechRecognition.startListening({ continuous: false });
  };

  /** 🛑 Stop Audio */
  const stopAudio = () => {
    if (speechUtteranceRef.current) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="chat-container">
      <button className="back-button" onClick={() => navigate("/")}>⬅ Go Back</button>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
        {loading && <div className="message bot">Typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input"
          placeholder="Type a message..."
        />
        <button onClick={() => handleSendMessage(input, false)} className="send-button">Send</button>
        <button onClick={handleVoiceInput} className="voice-button">
          {listening ? "🎙️ Listening..." : "🎤 Speak"}
        </button>
        {isSpeaking && (
          <button onClick={stopAudio} className="stop-button">🛑 Stop Audio</button>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
