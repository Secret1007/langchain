import React, { useState, useMemo, useEffect, useRef } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEnglishAnalyzer } from "../hooks/useEnglishAnalyzer";
import { useWebSocket } from "../hooks/useWebSocket";
import { Entry } from "../utils/storage";
import { Navigation } from "./Navigation";
import { Editor } from "./Editor";
import { RevisionPanel } from "./RevisionPanel";
import { EntriesList } from "./EntriesList";
import { RealtimeFeedback } from "./RealtimeFeedback";

export default function EnglishJournal(): React.ReactElement {
    const [activeTab, setActiveTab] = useState<"write" | "entries">("write");

    // editor states
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [category, setCategory] = useState<string>("Toastmasters");
    const [media, setMedia] = useState<string[]>([]); // data URLs for quick preview

    // 使用自定义hooks
    const { entries, addEntry, removeEntry } = useLocalStorage();
    const {
        issues,
        revised,
        highlighted,
        handleRevise,
        handleApplySingle,
        handleApplyAll,
        setRevised,
    } = useEnglishAnalyzer(content);

    // WebSocket 实时反馈
    const clientId = useRef(`client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const {
        isConnected,
        lastMessage,
        startSession,
        sendTextUpdate,
        connectionStatus,
    } = useWebSocket(clientId.current);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [lastFeedback, setLastFeedback] = useState<any>(null);
    const [detectedSentencesCount, setDetectedSentencesCount] = useState(0);
    const textUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 当WebSocket连接成功后，启动会话
    useEffect(() => {
        if (isConnected && activeTab === 'write') {
            startSession();
        }
    }, [isConnected, activeTab, startSession]);

    // 监听 WebSocket 消息
    useEffect(() => {
        if (!lastMessage) return;

        switch (lastMessage.type) {
            case 'connected':
            case 'session_started':
                console.log('📝', lastMessage.message);
                break;

            case 'analyzing':
                setIsAnalyzing(true);
                break;

            case 'feedback':
                setIsAnalyzing(false);
                setLastFeedback({
                    sentence: lastMessage.sentence,
                    is_complete: lastMessage.is_complete,
                    issues: lastMessage.issues,
                    suggestions: lastMessage.suggestions,
                    score: lastMessage.score,
                    explanation: lastMessage.explanation,
                });
                break;

            case 'error':
                setIsAnalyzing(false);
                console.error('WebSocket error:', lastMessage.message);
                break;
        }
    }, [lastMessage]);

    // 检测句子结束的辅助函数
    const detectCompleteSentences = (text: string): string[] => {
        // 匹配以句号、问号、感叹号结束的句子（包括中英文标点）
        const sentenceEndPattern = /[.!?。！？]+/g;
        const sentences: string[] = [];

        // 按标点符号分割
        const parts = text.split(sentenceEndPattern);
        const matches = text.match(sentenceEndPattern);

        if (!matches) return sentences;

        // 重组完整句子（包含标点符号）
        for (let i = 0; i < matches.length; i++) {
            if (parts[i]) {
                const sentence = (parts[i] + matches[i]).trim();
                if (sentence) {
                    sentences.push(sentence);
                }
            }
        }

        return sentences;
    };

    // 跟踪已检查的句子
    const checkedSentencesRef = useRef<Set<string>>(new Set());
    // 跟踪上一次的内容
    const previousContentRef = useRef<string>("");

    // 监听内容变化，只在真正完成句子输入后才检查
    useEffect(() => {
        if (!isConnected || !content) return;

        // 清除之前的定时器
        if (textUpdateTimeoutRef.current) {
            clearTimeout(textUpdateTimeoutRef.current);
        }

        // 使用防抖，避免用户快速输入时频繁检查
        textUpdateTimeoutRef.current = setTimeout(() => {
            const previousContent = previousContentRef.current;

            // 检测句子结束符（后面可以跟空格、换行或者是文本末尾）
            const sentenceEndPattern = /[.!?。！？](\s|$)/;
            const hasSentenceEnd = sentenceEndPattern.test(content);

            // 或者检测文本末尾是否是句子结束符（用于最后一句）
            const endsWithPunctuation = /[.!?。！？]$/.test(content.trim());

            // 只有当满足以下条件之一时才检查：
            // 1. 句子结束符后有空格或换行（用户已经开始下一句）
            // 2. 文本以标点结尾且已停止输入超过3秒（给用户充足的思考时间）
            if ((hasSentenceEnd || endsWithPunctuation) && content !== previousContent) {
                const completeSentences = detectCompleteSentences(content);

                if (completeSentences.length > 0) {
                    // 获取最后一个完整句子
                    const lastSentence = completeSentences[completeSentences.length - 1];

                    // 如果这个句子还没被检查过
                    if (!checkedSentencesRef.current.has(lastSentence)) {
                        console.log('🔍 检测到新句子完成，发送检查:', lastSentence);

                        // 标记为已检查
                        checkedSentencesRef.current.add(lastSentence);

                        // 更新检测到的句子数量
                        setDetectedSentencesCount(checkedSentencesRef.current.size);

                        // 发送到后端检查
                        sendTextUpdate(content);
                    }
                }
            }

            // 更新上一次的内容
            previousContentRef.current = content;
        }, 3000); // 3秒防抖，给用户充足时间完成输入和思考

        return () => {
            if (textUpdateTimeoutRef.current) {
                clearTimeout(textUpdateTimeoutRef.current);
            }
        };
    }, [content, isConnected, sendTextUpdate]);

    // 当内容被清空或重置时，清空已检查句子的记录
    useEffect(() => {
        if (!content.trim()) {
            checkedSentencesRef.current.clear();
            previousContentRef.current = "";
            setDetectedSentencesCount(0);
            setLastFeedback(null);
        }
    }, [content]);

    // search state
    const [search, setSearch] = useState<string>("");
    const filteredEntries = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return entries;
        return entries.filter((e) =>
            (e.title || "").toLowerCase().includes(q) ||
            (e.category || "").toLowerCase().includes(q) ||
            (e.content || "").toLowerCase().includes(q)
        );
    }, [entries, search]);

    const handleApplySingleClick = (idx: number): void => {
        const updated = handleApplySingle(idx);
        if (updated) {
            setContent(updated);
        }
    };

    const handleApplyAllClick = (): void => {
        const updated = handleApplyAll();
        if (updated) {
            setContent(updated);
        }
    };

    const handleReviseClick = async (): Promise<void> => {
        await handleRevise();
    };

    const handleAddEntry = (): void => {
        if (!title.trim() || !content.trim()) {
            alert("Title and content are required.");
            return;
        }
        const newEntry: Entry = {
            id: crypto.randomUUID(),
            title: title.trim(),
            category,
            content,
            revised,
            media,
            created_at: new Date().toISOString(),
        };
        addEntry(newEntry);
        // reset editor
        setTitle("");
        setContent("");
        setRevised("");
        setMedia([]);
        // feedback
        alert("✅ Your diary has been added!");
        setActiveTab("entries");
    };

    const handleEditEntry = (entry: Entry): void => {
        setTitle(entry.title || "");
        setCategory(entry.category || "Others");
        setContent(entry.content || "");
        setRevised(entry.revised || "");
        setMedia(entry.media || []);
        setActiveTab("write");
    };

    const handleRemoveEntry = (id: string): void => {
        removeEntry(id);
    };

    const handleUpload = async (files: FileList | null): Promise<void> => {
        const list = Array.from(files || []);
        const urls = await Promise.all(
            list.map(
                (f) =>
                    new Promise<string>((res) => {
                        const reader = new FileReader();
                        reader.onload = () => res(reader.result as string);
                        reader.readAsDataURL(f);
                    })
            )
        );
        setMedia((m) => [...urls, ...m]);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "write" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 编辑器 */}
                    <div className="lg:col-span-1">
                        <Editor
                            title={title}
                            setTitle={setTitle}
                            content={content}
                            setContent={setContent}
                            category={category}
                            setCategory={setCategory}
                            highlighted={highlighted}
                            issues={issues}
                            handleApplyAll={handleApplyAllClick}
                            handleRevise={handleReviseClick}
                            onUpload={handleUpload}
                            media={media}
                            onAddEntry={handleAddEntry}
                        />
                    </div>

                    {/* 实时反馈面板 */}
                    <div className="lg:col-span-1">
                        <div className="space-y-2">
                            {detectedSentencesCount > 0 && (
                                <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-xs text-green-700">
                                        ✓ 已检测 <strong>{detectedSentencesCount}</strong> 个完整句子
                                    </p>
                                </div>
                            )}
                            <RealtimeFeedback
                                isConnected={isConnected}
                                connectionStatus={connectionStatus}
                                lastFeedback={lastFeedback}
                                isAnalyzing={isAnalyzing}
                            />
                        </div>
                    </div>

                    {/* 修订面板 */}
                    <div className="lg:col-span-1">
                        <RevisionPanel
                            issues={issues}
                            revised={revised}
                            content={content}
                            onApplySingle={handleApplySingleClick}
                            onRevise={handleReviseClick}
                        />
                    </div>
                </div>
            ) : (
                <EntriesList
                    entries={filteredEntries}
                    search={search}
                    setSearch={setSearch}
                    onEdit={handleEditEntry}
                    onDelete={handleRemoveEntry}
                    onNew={() => setActiveTab("write")}
                />
            )}

            {/* 页脚 */}
            <footer className="text-center mt-10 text-gray-500">Designed by Secret 🌻 — 2025 English Journal</footer>
        </div>
    );
}

