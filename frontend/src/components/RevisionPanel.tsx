import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { Issue } from "../utils/englishAnalyzer";
import {
    checkWord,
    checkSentence,
    checkHealth
} from '../api';

interface WordCheckResult {
    word: string;
    suggestion: string;
    reason: string;
    confidence?: number;
    position: number;
}

interface SentenceCheckResult {
    sentence: string;
    issues: any[];
    suggestions: string[];
    overallScore: number;
    explanation: string;
}

interface RevisionPanelProps {
    issues: Issue[];
    revised: string;
    content: string;
    onApplySingle: (idx: number) => void;
    onRevise: () => void;
}

export const RevisionPanel: React.FC<RevisionPanelProps> = ({
    issues,
    revised,
    content,
    onApplySingle,
    onRevise
}) => {
    const [wordCheck, setWordCheck] = useState<WordCheckResult | null>(null);
    const [sentenceCheck, setSentenceCheck] = useState<SentenceCheckResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiConnected, setApiConnected] = useState<boolean>(false);

    // 检查API连接
    useEffect(() => {
        const checkConnection = async () => {
            try {
                await checkHealth();
                setApiConnected(true);
            } catch (error) {
                console.error('API connection failed:', error);
                setApiConnected(false);
            }
        };
        checkConnection();
    }, []);

    // 实时AI检查功能
    const performRealTimeCheck = async (text: string, cursorPos: number): Promise<void> => {
        if (!apiConnected) return;

        try {
            setIsLoading(true);

            // 获取光标前的单词
            const beforeCursor = text.slice(0, cursorPos);
            const wordMatch = beforeCursor.match(/\b\w+$/);
            const currentWord = wordMatch ? wordMatch[0] : '';

            // AI检查单词
            if (currentWord && /[a-zA-Z]/.test(currentWord)) {
                const wordResult = await checkWord(currentWord, text);
                if (wordResult && !wordResult.is_correct) {
                    setWordCheck({
                        word: currentWord,
                        suggestion: wordResult.suggestions?.[0] || '',
                        reason: wordResult.explanation || '',
                        confidence: (wordResult as any).confidence,
                        position: cursorPos - currentWord.length
                    });
                }
            }

            // AI检查句子（如果输入了标点符号）
            const lastChar = text[cursorPos - 1];
            if (lastChar && /[.!?;]/.test(lastChar)) {
                const sentences = beforeCursor.split(/[.!?;]/);
                const currentSentence = sentences[sentences.length - 1].trim();

                if (currentSentence) {
                    const sentenceResult = await checkSentence(currentSentence, text);
                    if (sentenceResult) {
                        setSentenceCheck({
                            sentence: currentSentence,
                            issues: sentenceResult.issues || [],
                            suggestions: sentenceResult.suggestions || [],
                            overallScore: (sentenceResult as any).overall_score || 0,
                            explanation: (sentenceResult as any).explanation || ''
                        });
                    }
                }
            }

        } catch (error) {
            console.error('AI check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 监听内容变化进行实时AI检查
    useEffect(() => {
        if (content && apiConnected) {
            const debounceTimer = setTimeout(() => {
                performRealTimeCheck(content, content.length);
            }, 500);

            return () => clearTimeout(debounceTimer);
        }
    }, [content, apiConnected]);

    // 应用实时建议
    const applyRealTimeSuggestion = (type: string, suggestion: string): void => {
        if (type === 'word' && wordCheck) {
            const beforeWord = content.slice(0, wordCheck.position);
            const afterWord = content.slice(wordCheck.position + wordCheck.word.length);
            const newContent = beforeWord + suggestion + afterWord;
            onApplySingle && onApplySingle(-1); // 特殊处理实时建议
            setWordCheck(null);
        }
    };

    return (
        <Card className="shadow-lg bg-white">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">AI Revision Panel</h2>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={`text-xs ${apiConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                            {apiConnected ? '🤖 AI已连接' : '⚠️ API未连接'}
                        </Badge>
                        {isLoading && (
                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                                🔄 AI检查中...
                            </Badge>
                        )}
                    </div>
                </div>

                {/* AI实时检查反馈 */}
                {(wordCheck || sentenceCheck) && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-700 mb-2">🤖 AI实时检查结果</h3>

                        {wordCheck && (
                            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-700 font-medium text-sm">单词检查:</span>
                                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                                                🤖 AI
                                            </Badge>
                                            {wordCheck.confidence && (
                                                <span className="text-xs text-gray-500">
                                                    置信度: {Math.round(wordCheck.confidence * 100)}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-red-600 text-sm">
                                            "{wordCheck.word}" → "{wordCheck.suggestion}"
                                        </div>
                                        <div className="text-xs text-red-500">
                                            {wordCheck.reason}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => applyRealTimeSuggestion('word', wordCheck.suggestion)}
                                        className="bg-red-600 hover:bg-red-700 text-xs"
                                    >
                                        应用
                                    </Button>
                                </div>
                            </div>
                        )}

                        {sentenceCheck && (
                            <div className="p-2 bg-green-50 border border-green-200 rounded">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-green-700 font-medium text-sm">句子检查:</span>
                                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                                        🤖 AI
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        评分: {Math.round(sentenceCheck.overallScore * 100)}/100
                                    </span>
                                </div>
                                <div className="text-green-600 text-sm mb-1">
                                    "{sentenceCheck.sentence}"
                                </div>
                                <div className="text-xs text-gray-600">
                                    {sentenceCheck.explanation}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <Tabs defaultValue="suggestions">
                    <TabsList>
                        <TabsTrigger value="suggestions">Inline Suggestions</TabsTrigger>
                        <TabsTrigger value="revised">One-click Revise</TabsTrigger>
                        <TabsTrigger value="original">Original</TabsTrigger>
                    </TabsList>

                    <TabsContent value="suggestions">
                        {issues.length === 0 ? (
                            <div className="text-gray-500">No suggestions right now. Keep writing ✨</div>
                        ) : (
                            <ul className="space-y-3">
                                {issues.map((iss, idx) => (
                                    <li key={idx} className="p-3 bg-gray-50 rounded-md border">
                                        <div className="text-sm">
                                            <span className="font-mono bg-white px-1 py-0.5 rounded border mr-2">{iss.text}</span>
                                            →
                                            <span className="font-mono bg-green-50 px-1 py-0.5 rounded border">{iss.suggestion}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{iss.reason}</div>
                                        <div className="mt-2">
                                            <Button size="sm" onClick={() => onApplySingle(idx)}>Apply</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </TabsContent>

                    <TabsContent value="revised">
                        <motion.pre
                            className="bg-green-50 p-4 rounded-md whitespace-pre-wrap text-gray-900 border border-green-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {revised || "Click 'Revise with AI' to see suggestions."}
                        </motion.pre>
                    </TabsContent>

                    <TabsContent value="original">
                        <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-gray-800">{content}</pre>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

