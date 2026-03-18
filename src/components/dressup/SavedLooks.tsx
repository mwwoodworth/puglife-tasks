"use client";

import { motion } from "framer-motion";
import { SavedLook } from "@/lib/types";

interface SavedLooksProps {
  looks: SavedLook[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  canSave: boolean;
}

export default function SavedLooks({ looks, onLoad, onDelete, onSave, canSave }: SavedLooksProps) {
  return (
    <div className="rounded-2xl bg-purple-900/20 border border-purple-500/10 p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-purple-200 flex items-center gap-1">
          <span>💾</span> Saved Looks
        </h4>
        {canSave && (
          <button
            onClick={onSave}
            className="text-[10px] font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2 py-1 rounded-lg"
          >
            + Save Current
          </button>
        )}
      </div>
      {looks.length === 0 ? (
        <p className="text-[10px] text-purple-500 text-center py-2">No saved looks yet</p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {looks.map((look) => (
            <motion.div
              key={look.id}
              className="flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl bg-purple-900/30 border border-purple-500/15 min-w-[70px]"
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-[10px] font-bold text-purple-200 truncate max-w-[60px]">{look.name}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => onLoad(look.id)}
                  className="text-[8px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded"
                >
                  Wear
                </button>
                <button
                  onClick={() => onDelete(look.id)}
                  className="text-[8px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded"
                >
                  X
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {looks.length >= 5 && (
        <p className="text-[9px] text-purple-500 text-center mt-1">Max 5 looks saved</p>
      )}
    </div>
  );
}
