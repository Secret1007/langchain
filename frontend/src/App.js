import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const newMessage = { role: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");

    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });
    const data = await res.json();

    // 加入中间步骤
    if (data.steps && data.steps.length > 0) {
      data.steps.forEach((step, i) => {
        setMessages((prev) => [
          ...prev,
          { role: "system", text: `步骤 ${i + 1}: ${step[1]}` },
        ]);
      });
    }

    // 加入最终回答
    const botMessage = { role: "assistant", text: data.answer };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="border rounded-lg p-3 h-96 overflow-y-auto bg-gray-50 mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-1 p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-100 text-blue-800 text-right"
                : msg.role === "assistant"
                ? "bg-green-100 text-green-800"
                : "bg-gray-200 text-gray-700 italic"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded-l px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入问题..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-3 rounded-r"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
