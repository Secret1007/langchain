import React from 'react';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface RealtimeFeedbackProps {
    isConnected: boolean;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    lastFeedback: {
        sentence?: string;
        is_complete?: boolean;
        issues?: any[];
        suggestions?: any[];
        score?: number;
        explanation?: string;
    } | null;
    isAnalyzing: boolean;
}

export const RealtimeFeedback: React.FC<RealtimeFeedbackProps> = ({
    isConnected,
    connectionStatus,
    lastFeedback,
    isAnalyzing,
}) => {
    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'bg-green-500';
            case 'connecting':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'AI 助手已连接';
            case 'connecting':
                return '正在连接...';
            case 'error':
                return '连接错误';
            default:
                return '未连接';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 0.9) return 'text-green-600 bg-green-50';
        if (score >= 0.7) return 'text-blue-600 bg-blue-50';
        if (score >= 0.5) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 0.9) return '优秀';
        if (score >= 0.7) return '良好';
        if (score >= 0.5) return '一般';
        return '需要改进';
    };

    return (
        <div className="space-y-4">
            {/* 连接状态指示器 */}
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${isConnected ? 'animate-pulse' : ''}`}></div>
                <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
                {isAnalyzing && (
                    <span className="text-sm text-gray-500 ml-auto">正在分析...</span>
                )}
            </div>

            {/* 实时反馈 */}
            {lastFeedback && (
                <Card className="p-4 space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800">📝 句子分析</h3>
                        {lastFeedback.score !== undefined && (
                            <Badge className={`${getScoreColor(lastFeedback.score)} px-3 py-1`}>
                                {getScoreLabel(lastFeedback.score)} ({(lastFeedback.score * 100).toFixed(0)}分)
                            </Badge>
                        )}
                    </div>

                    {/* 被分析的句子 */}
                    {lastFeedback.sentence && (
                        <div className="p-3 bg-white rounded-md border border-gray-200">
                            <p className="text-sm text-gray-700 italic">"{lastFeedback.sentence}"</p>
                        </div>
                    )}

                    {/* 总体评价 */}
                    {lastFeedback.explanation && (
                        <Alert className="border-blue-300 bg-white">
                            <p className="text-sm text-gray-700">{lastFeedback.explanation}</p>
                        </Alert>
                    )}

                    {/* 问题列表 */}
                    {lastFeedback.issues && lastFeedback.issues.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-700 uppercase">发现的问题：</h4>
                            {lastFeedback.issues.map((issue, idx) => (
                                <Alert key={idx} className="border-yellow-300 bg-yellow-50">
                                    <div className="flex items-start gap-2">
                                        <Badge className="bg-yellow-200 text-yellow-800 text-xs">
                                            {issue.type || '语法'}
                                        </Badge>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700">{issue.message}</p>
                                            {issue.position && (
                                                <p className="text-xs text-gray-500 mt-1">位置: {issue.position}</p>
                                            )}
                                        </div>
                                    </div>
                                </Alert>
                            ))}
                        </div>
                    )}

                    {/* 改进建议 */}
                    {lastFeedback.suggestions && lastFeedback.suggestions.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-700 uppercase">改进建议：</h4>
                            {lastFeedback.suggestions.map((suggestion, idx) => (
                                <div key={idx} className="p-3 bg-white rounded-md border border-green-200 space-y-2">
                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                        {suggestion.type || '建议'}
                                    </Badge>

                                    {suggestion.original && (
                                        <div className="text-sm">
                                            <span className="text-gray-500">原文:</span>
                                            <p className="text-red-600 line-through mt-1">{suggestion.original}</p>
                                        </div>
                                    )}

                                    {suggestion.corrected && (
                                        <div className="text-sm">
                                            <span className="text-gray-500">建议:</span>
                                            <p className="text-green-600 font-medium mt-1">{suggestion.corrected}</p>
                                        </div>
                                    )}

                                    {suggestion.explanation && (
                                        <p className="text-xs text-gray-600 mt-2">💡 {suggestion.explanation}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 如果没有问题 */}
                    {(!lastFeedback.issues || lastFeedback.issues.length === 0) &&
                        (!lastFeedback.suggestions || lastFeedback.suggestions.length === 0) &&
                        lastFeedback.score && lastFeedback.score >= 0.9 && (
                            <Alert className="border-green-300 bg-green-50">
                                <p className="text-sm text-green-700">✅ 这句话写得很好！继续保持！</p>
                            </Alert>
                        )}
                </Card>
            )}

            {/* 使用提示 */}
            {isConnected && !lastFeedback && !isAnalyzing && (
                <Alert className="border-blue-300 bg-blue-50">
                    <p className="text-sm text-blue-700">
                        💡 开始输入吧！完成句子后，请：<br />
                        • 用 <strong>.</strong> <strong>!</strong> <strong>?</strong> 结束句子<br />
                        • 在标点后<strong>加空格</strong>或<strong>换行</strong>，或<strong>停顿 3 秒</strong><br />
                        AI 会自动检查你的语法和表达 ✨
                    </p>
                </Alert>
            )}

            {/* 正在分析提示 */}
            {isAnalyzing && !lastFeedback && (
                <Alert className="border-yellow-300 bg-yellow-50 animate-pulse">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-yellow-700 font-medium">
                            AI 正在分析你的句子...
                        </p>
                    </div>
                </Alert>
            )}
        </div>
    );
};

