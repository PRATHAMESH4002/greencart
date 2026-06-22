import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";

/**
 * 🔒 Feature Flag
 * Set to true when you want to enable chatbot again
 */
const ENABLE_CHATBOT = false;

const quickSuggestions = [
  "What can I cook today?",
  "Suggest healthy groceries",
  "Grocery list for 3 days",
  "Budget grocery under 500",
  "Breakfast ideas",
  "Popular vegetables",
];

const ChatBot = () => {
  // 🚫 Chatbot disabled
  if (!ENABLE_CHATBOT) return null;

  const { axios, fetchUser } = useAppContext();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = async (msg = message) => {
    if (!msg.trim()) return;

    setChat((prev) => [...prev, { sender: "user", text: msg }]);
    setMessage("");

    try {
      const { data } = await axios.post("/api/chat", { message: msg });

      setChat((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);

      await fetchUser();
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border rounded-lg shadow-xl z-50">
      
      {/* Header */}
      <div className="bg-green-600 text-white p-3 font-semibold rounded-t-lg">
        Grocery Assistant 🤖
      </div>

      {/* Quick Suggestions */}
      <div className="flex gap-2 flex-wrap p-2 border-b">
        {quickSuggestions.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="p-3 h-64 overflow-y-auto text-sm bg-gray-50">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`mb-2 flex ${
              c.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`px-3 py-2 rounded-lg max-w-[75%] ${
                c.sender === "user"
                  ? "bg-green-600 text-white"
                  : "bg-white border"
              }`}
            >
              {c.text}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex border-t">
        <input
          className="flex-1 p-2 outline-none text-sm"
          placeholder="Ask about meals, groceries, health..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={() => sendMessage()}
          className="bg-green-600 text-white px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
