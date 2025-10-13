import { useState, useEffect, useMemo } from 'react';
import { pseudoAnalyze, applySuggestion } from '../utils/englishAnalyzer';

export const useEnglishAnalyzer = (content) => {
  const [issues, setIssues] = useState([]);
  const [revised, setRevised] = useState("");

  // live suggestions (debounced)
  useEffect(() => {
    const t = setTimeout(() => setIssues(pseudoAnalyze(content)), 300);
    return () => clearTimeout(t);
  }, [content]);

  // highlighted preview for issues
  const highlighted = useMemo(() => {
    if (!issues.length) return <span>{content || ""}</span>;
    const parts = [];
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
  const handleRevise = async () => {
    const revisedText = content
      .replace(/\b(I am|I'm)\b/g, "I am")
      .replace(/\bvery\s+good\b/gi, "great")
      .concat("\n\n[AI revision completed]");
    setRevised(revisedText);
  };

  const handleApplySingle = (idx) => {
    const issue = issues[idx];
    if (!issue) return;
    return applySuggestion(content, issue);
  };

  const handleApplyAll = () => {
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