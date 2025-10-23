import React from "react";
import { ChevronDown } from "lucide-react"; // 箭头图标
import { Card, CardContent } from "./ui/card";

interface DecisionStep {
    tool: string;
    tool_input: string;
    observation: string;
}

interface DecisionLog {
    question: string;
    decision: string;
    tool_used?: string;
    steps: DecisionStep[];
    final_answer: string;
}

interface DecisionTreeProps {
    decisionLog?: DecisionLog | null;
}

export default function DecisionTree({ decisionLog }: DecisionTreeProps): React.ReactElement | null {
    if (!decisionLog) return null;

    return (
        <Card className="p-4 shadow-lg rounded-2xl border border-gray-200 bg-white">
            <CardContent className="space-y-4">
                {/* 问题 */}
                <div>
                    <p className="font-bold text-lg text-gray-800">❓ 用户问题</p>
                    <p className="ml-4 text-gray-700">{decisionLog.question}</p>
                </div>

                {/* 箭头 */}
                <div className="flex justify-center">
                    <ChevronDown className="text-gray-400" />
                </div>

                {/* 判断 */}
                <div>
                    <p className="font-bold text-lg text-gray-800">🤔 AI 判断</p>
                    <p className="ml-4 text-gray-700">
                        {decisionLog.decision}
                        {decisionLog.tool_used && ` → ${decisionLog.tool_used}`}
                    </p>
                </div>

                {decisionLog.steps.length > 0 && (
                    <>
                        <div className="flex justify-center">
                            <ChevronDown className="text-gray-400" />
                        </div>

                        {/* 工具调用过程 */}
                        <div>
                            <p className="font-bold text-lg text-gray-800">🛠️ 工具调用步骤</p>
                            <ul className="ml-6 space-y-2 list-disc text-gray-700">
                                {decisionLog.steps.map((step, i) => (
                                    <li key={i}>
                                        <span className="font-semibold">{step.tool}</span>
                                        <br />
                                        输入：{step.tool_input}
                                        <br />
                                        结果：{step.observation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                <div className="flex justify-center">
                    <ChevronDown className="text-gray-400" />
                </div>

                {/* 最终回答 */}
                <div>
                    <p className="font-bold text-lg text-gray-800">🤖 最终回答</p>
                    <p className="ml-4 text-gray-700">{decisionLog.final_answer}</p>
                </div>
            </CardContent>
        </Card>
    );
}

