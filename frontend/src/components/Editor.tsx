import React, { ReactNode, ChangeEvent } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Issue } from "../utils/englishAnalyzer";

interface EditorProps {
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
    category: string;
    setCategory: (category: string) => void;
    highlighted: ReactNode;
    issues: Issue[];
    handleApplyAll: () => void;
    handleRevise: () => void;
    onUpload: (files: FileList | null) => void;
    media: string[];
    onAddEntry: () => void;
}

export const Editor: React.FC<EditorProps> = ({
    title,
    setTitle,
    content,
    setContent,
    category,
    setCategory,
    highlighted,
    issues,
    handleApplyAll,
    handleRevise,
    onUpload,
    media,
    onAddEntry
}) => {
    return (
        <Card className="shadow-lg">
            <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                        className="md:col-span-2"
                        placeholder="Diary Title..."
                        value={title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    />
                    <select
                        value={category}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                        className="border rounded-md p-2 w-full text-gray-700"
                    >
                        <option>Toastmasters</option>
                        <option>Travel</option>
                        <option>Books</option>
                        <option>Others</option>
                    </select>
                </div>

                <Textarea
                    placeholder="Write your English diary here..."
                    rows={12}
                    value={content}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                />

                {/* 实时高亮预览 */}
                <div>
                    <div className="text-sm text-gray-500 mb-2">Live Preview with highlights</div>
                    <pre className="bg-white p-4 rounded-md whitespace-pre-wrap border">{highlighted}</pre>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <Button onClick={handleRevise}>✨ Revise with AI</Button>
                    <label className="px-4 py-2 rounded-md border cursor-pointer bg-gray-50 hover:bg-gray-100">
                        📤 Upload Image / Video
                        <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => onUpload(e.target.files)}
                        />
                    </label>
                    <Button onClick={onAddEntry} variant="secondary">📝 Add Entry</Button>
                </div>

                {/* 媒体缩略图 */}
                {media?.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                        {media.map((url, i) => (
                            <div key={i} className="w-28 h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center border">
                                {String(url).startsWith("data:video") ? (
                                    <video src={url} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={url} alt="upload" className="w-full h-full object-cover" />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* 底部状态栏 */}
                <div className="text-sm text-gray-600 flex items-center justify-between pt-2 border-t">
                    <div>
                        {issues.length ? (
                            <span>⚠️ {issues.length} issues found • </span>
                        ) : (
                            <span>✅ No issues found • </span>
                        )}
                        <button className="underline hover:text-blue-600" onClick={handleApplyAll}>Apply all</button>
                    </div>
                    <div>{content.trim().split(/\s+/).filter(Boolean).length} words</div>
                </div>
            </CardContent>
        </Card>
    );
};

