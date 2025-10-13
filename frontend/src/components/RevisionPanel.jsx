import React from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { motion } from "framer-motion";

export const RevisionPanel = ({
  issues,
  revised,
  content,
  onApplySingle,
  onRevise
}) => {
  return (
    <Card className="shadow-lg bg-white">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">AI Revision Panel</h2>
        <Tabs defaultValue="suggestions">
          <TabsList>
            <TabsTrigger value="suggestions">Inline Suggestions</TabsTrigger>
            <TabsTrigger value="revised">One-click Revise</TabsTrigger>
            <TabsTrigger value="original">Original</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions">
            {issues.length === 0 ? (
              <div className="text-gray-500">No suggestions right now. Keep writing ✨</div>
            ) : (
              <ul className="space-y-3">
                {issues.map((iss, idx) => (
                  <li key={idx} className="p-3 bg-gray-50 rounded-md border">
                    <div className="text-sm"><span className="font-mono bg-white px-1 py-0.5 rounded border mr-2">{iss.text}</span>→ <span className="font-mono bg-green-50 px-1 py-0.5 rounded border">{iss.suggestion}</span></div>
                    <div className="text-xs text-gray-500 mt-1">{iss.reason}</div>
                    <div className="mt-2">
                      <Button size="sm" onClick={() => onApplySingle(idx)}>Apply</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="revised">
            <motion.pre className="bg-green-50 p-4 rounded-md whitespace-pre-wrap text-gray-900 border border-green-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {revised || "Click 'Revise with AI' to see suggestions."}
            </motion.pre>
          </TabsContent>

          <TabsContent value="original">
            <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-gray-800">{content}</pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};