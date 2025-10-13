import React, { useState, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEnglishAnalyzer } from "../hooks/useEnglishAnalyzer";
import { Navigation } from "./Navigation";
import { Editor } from "./Editor";
import { RevisionPanel } from "./RevisionPanel";
import { EntriesList } from "./EntriesList";

export default function EnglishJournal() {
  const [activeTab, setActiveTab] = useState("write"); // write | entries

  // editor states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Toastmasters");
  const [media, setMedia] = useState([]); // data URLs for quick preview

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

  // search state
  const [search, setSearch] = useState("");
  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) =>
      (e.title || "").toLowerCase().includes(q) ||
      (e.category || "").toLowerCase().includes(q) ||
      (e.content || "").toLowerCase().includes(q)
    );
  }, [entries, search]);

  const handleApplySingleClick = (idx) => {
    const updated = handleApplySingle(idx);
    if (updated) {
      setContent(updated);
    }
  };

  const handleApplyAllClick = () => {
    const updated = handleApplyAll();
    if (updated) {
      setContent(updated);
    }
  };

  const handleReviseClick = async () => {
    await handleRevise();
  };

  const handleAddEntry = () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }
    const newEntry = {
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

  const handleEditEntry = (entry) => {
    setTitle(entry.title || "");
    setCategory(entry.category || "Others");
    setContent(entry.content || "");
    setRevised(entry.revised || "");
    setMedia(entry.media || []);
    setActiveTab("write");
  };

  const handleRemoveEntry = (id) => {
    removeEntry(id);
  };

  const handleUpload = async (files) => {
    const list = Array.from(files || []);
    const urls = await Promise.all(
      list.map(
        (f) =>
          new Promise((res) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <RevisionPanel
            issues={issues}
            revised={revised}
            content={content}
            onApplySingle={handleApplySingleClick}
            onRevise={handleReviseClick}
          />
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