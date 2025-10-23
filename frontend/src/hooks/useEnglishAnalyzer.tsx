import { useState, useEffect, useMemo, ReactNode } from 'react';
import { pseudoAnalyze, applySuggestion, Issue } from '../utils/englishAnalyzer';

interface UseEnglishAnalyzerReturn {
  issues: Issue[];
  revised: string;
  highlighted: ReactNode;
  handleRevise: () => Promise<void>;
  handleApplySingle: (idx: number) => string | undefined;
  handleApplyAll: () => string;
  setRevised: (revised: string) => void;
}

export const useEnglishAnalyzer = (content: string): UseEnglishAnalyzerReturn => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [revised, setRevised] = useState<string>("");

  // live suggestions (debounced)
  useEffect(() => {
    const t = setTimeout(() => setIssues(pseudoAnalyze(content)), 300);
    return () => clearTimeout(t);
  }, [content]);

  // highlighted preview for issues
  const highlighted = useMemo(() => {
    if (!issues.length) return <span>{content || ""}</span>;
    const parts: ReactNode[] = [];
    let last = 0;
    issues.forEach((iss, idx) => {
      parts.push(<span key={"t" + idx + "a"}>{content.slice(last, iss.start)}</span>);
      parts.push(
        <span key={"h" + idx} className="bg-yellow-100 underline decoration-red-500 decoration-2" title={iss.reason}>
          {content.slice(iss.start, iss.end)}
        </span>
      );
      last = iss.end;
    });
    parts.push(<span key="tail">{content.slice(last)}</span>);
    return <>{parts}</>;
  }, [content, issues]);

  // classic Revise button (mock)
  const handleRevise = async (): Promise<void> => {
    const revisedText = content
      .replace(/\b(I am|I'm)\b/g, "I am")
      .replace(/\bvery\s+good\b/gi, "great")
      .concat("\n\n[AI revision completed]");
    setRevised(revisedText);
  };

  const handleApplySingle = (idx: number): string | undefined => {
    const issue = issues[idx];
    if (!issue) return;
    return applySuggestion(content, issue);
  };

  const handleApplyAll = (): string => {
    let updated = content;
    // apply from end to start to avoid shifting indices
    [...issues].reverse().forEach((iss) => {
      updated = updated.slice(0, iss.start) + iss.suggestion + updated.slice(iss.end);
    });
    return updated;
  };

  return {
    issues,
    revised,
    highlighted,
    handleRevise,
    handleApplySingle,
    handleApplyAll,
    setRevised,
  };
};

