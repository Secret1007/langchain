import React from 'react';

export const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-blue-600">English Journey ✍️</h1>
      <div className="space-x-6 text-gray-600 font-medium">
        <button 
          className={`hover:text-blue-500 ${activeTab === "write" ? "text-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("write")}
        >
          Home
        </button>
        <button 
          className={`hover:text-blue-500 ${activeTab === "entries" ? "text-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("entries")}
        >
          Entries
        </button>
        <a href="#" className="hover:text-blue-500">Gallery</a>
        <a href="#" className="hover:text-blue-500">Settings</a>
      </div>
    </nav>
  );
};