import React from 'react';
import { Badge } from './ui/badge';

interface SentenceDetectionIndicatorProps {
    detectedSentences: number;
    lastDetectedSentence?: string;
}

export const SentenceDetectionIndicator: React.FC<SentenceDetectionIndicatorProps> = ({
    detectedSentences,
    lastDetectedSentence,
}) => {
    if (detectedSentences === 0) return null;

    return (
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <Badge className="bg-green-100 text-green-700 text-xs">
                ✓ 已检测 {detectedSentences} 个句子
            </Badge>
            {lastDetectedSentence && (
                <span className="italic truncate max-w-[200px]">
                    最新: "{lastDetectedSentence}"
                </span>
            )}
        </div>
    );
};

