import React from 'react';
import { Button } from "./ui/button";
import { Entry } from '../utils/storage';

interface EntryCardProps {
    entry: Entry;
    onEdit: (entry: Entry) => void;
    onDelete: (id: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit, onDelete }) => {
    return (
        <div className="p-4 border rounded-xl bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-lg font-semibold">{entry.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {new Date(entry.created_at || Date.now()).toLocaleString()} • {entry.category}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onEdit(entry)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(entry.id)}>Delete</Button>
                </div>
            </div>
            <p className="text-sm text-gray-700 mt-3 line-clamp-3">{entry.content}</p>
            {entry.media?.length ? (
                <div className="flex gap-2 mt-3 flex-wrap">
                    {entry.media.slice(0, 3).map((url, i) => (
                        <div key={i} className="w-20 h-14 rounded-md overflow-hidden border">
                            {entry.media && String(url).startsWith("data:video") ? (
                                <video src={url} className="w-full h-full object-cover" />)
                                : (<img src={url} alt="" className="w-full h-full object-cover" />)}
                        </div>
                    ))}
                    {entry.media.length > 3 && (
                        <div className="text-xs text-gray-500 self-center">+{entry.media.length - 3} more</div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

