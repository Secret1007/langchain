import { useState } from "react";
import DecisionTree from "./components/DecisionTree";

export default function ChatBox() {
  const [decisionLog, setDecisionLog] = useState(null);

  async function askQuestion(question) {
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setDecisionLog(data.decision_log);
    } catch (error) {
      console.error("API 调用失败:", error);
      setDecisionLog({
        question: question,
        decision: "API 调用失败",
        tool_used: null,
        steps: [],
        final_answer: `错误: ${error.message}`
      });
    }
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => askQuestion("北京今天天气怎么样？")}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        提问：北京天气
      </button>

      <button
        onClick={() => askQuestion("BESIII 是做什么的？")}
        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        提问：BESIII
      </button>

      <DecisionTree decisionLog={decisionLog} />
    </div>
  );
}
