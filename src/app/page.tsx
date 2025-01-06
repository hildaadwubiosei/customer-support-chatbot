"use client";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { FaSpinner } from "react-icons/fa";
import bot from "../../public/ai-assistant.png";
import user from "../../public/user.png";
import Image from "next/image";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

export default function Home() {
  const [history, setHistory] = useState<
    { role: "user" | "model"; content: string; timestamp: string }[]
  >([
    {
      role: "model",
      content:
        "I am Slyme 2.0, your college advisor bot. I'm here to help you with college-related questions like selecting majors, understanding admission processes, and planning your career path.",
      timestamp: "",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [typingIndicator, setTypingIndicator] = useState<boolean>(false);

  // Set the initial timestamp on the client side
  useEffect(() => {
    const initialTimestamp = new Date().toLocaleTimeString();
    setHistory((prevHistory) =>
      prevHistory.map((message, index) =>
        index === 0 ? { ...message, timestamp: initialTimestamp } : message
      )
    );
  }, []);

  async function runChat(prompt: string) {
    setLoading(true); // Start loader
    setTypingIndicator(true); // Show typing indicator
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.6, // Adjusted for more detailed and relevant responses
      topK: 1,
      topP: 0.9,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    try {
      const result = await chat.sendMessage(prompt);
      const response = result.response;

      const timestamp = new Date().toLocaleTimeString();
      const content =
        response.text() ||
        "I'm unable to answer that at the moment. Try rephrasing your question.";

      setHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: prompt, timestamp },
        { role: "model", content, timestamp },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          role: "user",
          content: prompt,
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          role: "model",
          content:
            "I'm currently unable to assist with this specific query. Please try a different question or rephrase your query.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false); // Stop loader
      setTypingIndicator(false); // Hide typing indicator
      setInput(""); // Clear the input field
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim() && !loading) {
      runChat(input);
    }
  };

  // Auto-scroll to the bottom of the chat container when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="w-full max-w-2xl p-6 rounded-lg shadow-2xl glassmorphism">
        <h1 className="text-3xl font-bold mb-6 text-center">
          College Advisor: Slyme 2.0
        </h1>
        <div
          ref={chatContainerRef}
          className="mb-4 max-h-96 overflow-y-auto p-4 rounded-lg bg-opacity-60 glassmorphism custom-scrollbar"
        >
          {history.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                message.role === "model" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl">
                {message.role === "model" ? (
                  <Image src={bot} alt="bot" />
                ) : (
                  <Image src={user} alt="user" />
                )}
              </div>
              <div
                className={`ml-4 mr-4 p-4 rounded-lg max-w-xs ${
                  message.role === "model"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <ReactMarkdown className="prose prose-lg prose-invert">
                  {message.content}
                </ReactMarkdown>
                <div className="text-xs text-gray-500 mt-2">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
          {typingIndicator && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl">
                <Image src={bot} alt="bot" />
              </div>
              <div className="ml-4 p-4 rounded-lg bg-gray-800 text-gray-300 max-w-xs">
                <span>...</span>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={onSubmit} className="mb-4 flex">
          <input
            type="text"
            name="prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about colleges..."
            className="flex-1 p-4 mb-2 border-none rounded-l-lg text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
            disabled={loading}
          />
          <button
            type="submit"
            className={`py-2 px-4 h-14 bg-gray-800 text-white font-bold rounded-r-lg hover:bg-gray-700 transition duration-300 ${
              loading ? "cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
