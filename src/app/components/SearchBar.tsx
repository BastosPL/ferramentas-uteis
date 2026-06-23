"use client";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  tools: Array<{ slug: string; name: string }>;
  onFilter: (filtered: string[]) => void;
}

export default function SearchBar({ tools, onFilter }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (!value.trim()) {
        onFilter(tools.map((t) => t.slug));
        return;
      }

      const normalized = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");

      const filtered = tools
        .filter((tool) => {
          const toolName = tool.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "");
          return toolName.includes(normalized);
        })
        .map((t) => t.slug);

      onFilter(filtered);
    },
    [tools, onFilter]
  );

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar ferramenta..."
        className="bg-slate-100 border-0 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-full max-w-md outline-none"
      />
    </div>
  );
}
