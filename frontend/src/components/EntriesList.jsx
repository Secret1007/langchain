import React from 'react';
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EntryCard } from './EntryCard';

export const EntriesList = ({
  entries,
  search,
  setSearch,
  onEdit,
  onDelete,
  onNew
}) => {
  return (
    <div className="max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Input placeholder="Search entries by title/category/content..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button onClick={onNew}>➕ New</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {entries.length === 0 ? (
              <div className="text-gray-500">No entries yet. Write your first diary!</div>
            ) : (
              entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};