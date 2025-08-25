"use client";

import { useState, useMemo, useEffect, useRef, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoteEditor from "@/components/NoteEditorComponent";

type Note = {
  _id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
};

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteContents, setNoteContents] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/all-notes");
        const data = await res.json();
        console.log(data);
        const arr = Array.isArray(data) ? data : data.notes;
        setNotes(arr || {});

        // ustawiamy początkowe treści notatek
        const contents: Record<string, string> = {};
        arr.forEach((note: Note) => {
          try {
            contents[note._id] = JSON.parse(note.content);
          } catch (e) {
            // jeśli nie JSON, używamy oryginalnego stringa
            contents[note._id] = note.content;
          }
        });
        setNoteContents(contents);
      } catch (err) {
        console.error("Błąd pobierania notatek", err);
        setNotes([]);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    let n = [...notes];

    if (activeCategory)
      n = n.filter((note) => note.category === activeCategory);
    if (search.trim()) {
      n = n.filter(
        (note) =>
          note.title?.toLowerCase().includes(search.toLowerCase()) ||
          note.content?.toLowerCase().includes(search.toLowerCase())
      );
    }

    n.sort((a, b) =>
      sortAsc
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return n;
  }, [notes, activeCategory, search, sortAsc]);

  const groupedNotes = useMemo(() => {
    const groups: Record<string, Note[]> = {};
    filteredNotes.forEach((note) => {
      const cat = note.category || "Inne";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(note);
    });
    return groups;
  }, [filteredNotes]);

  const categories = Object.keys(
    notes.reduce((acc, note) => {
      const cat = note.category || "Inne";
      acc[cat] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const scrollToCategory = (category: string) => {
    const el = sectionRefs.current[category];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNoteChange = (noteId: string, content: string) => {
    setNoteContents((prev) => ({ ...prev, [noteId]: content }));
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-100 p-6 border-r shadow-md overflow-y-auto">
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start font-semibold"
            onClick={() => setActiveCategory(null)}
          >
            📄 Wszystkie notatki
          </Button>

          {categories.map((cat) => (
            <Button
              key={cat}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => scrollToCategory(cat)}
            >
              📂 {cat}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="w-4/5 p-8 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Input
            placeholder="🔍 Szukaj notatek..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="max-w-sm shadow-sm"
          />

          <Button
            variant="outline"
            className="shadow-sm"
            onClick={() => setSortAsc((s) => !s)}
          >
            {sortAsc ? "⬆️ Rosnąco" : "⬇️ Malejąco"}
          </Button>
        </div>

        {Object.entries(groupedNotes).map(([cat, catNotes]) => (
          <div
            key={cat}
            ref={(el) => (sectionRefs.current[cat] = el)}
            className="mb-10"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-700">📂 {cat}</h2>
            <div className="grid gap-4">
              {catNotes.map((note) => (
                <Card
                  key={note._id}
                  className="hover:shadow-xl transition rounded-2xl border border-gray-200 bg-white"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {note.title}
                    </h3>
                    <p className="text-xs text-gray-500 italic">
                      {note.category || "Inne"}
                    </p>

                    {expanded === note._id ? (
                      <NoteEditor
                        note={noteContents[note._id]}
                        setNoteHandler={(content) =>
                          handleNoteChange(note._id, content)
                        }
                      />
                    ) : (
                      <p className="text-sm text-gray-600 mt-2">
                        {noteContents[note._id]?.slice(0, 120) + "..."}
                      </p>
                    )}

                    <Button
                      variant="link"
                      className="p-0 mt-2 text-blue-600 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(expanded === note._id ? null : note._id);
                      }}
                    >
                      {expanded === note._id ? "Pokaż mniej" : "Pokaż więcej"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <p className="text-gray-500 italic text-center mt-10">
            Brak notatek spełniających kryteria.
          </p>
        )}
      </main>
    </div>
  );
}
