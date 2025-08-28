"use client";

import { useState, useMemo, useEffect, useRef, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoteEditor from "@/components/NoteEditorComponent";
import { useSession } from "next-auth/react";

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
  const [draftTitles, setDraftTitles] = useState<Record<string, string>>({});
  const [draftCategories, setDraftCategories] = useState<
    Record<string, string>
  >({});

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const noteRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/all-notes");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.notes;
        setNotes(arr || []);

        const contents: Record<string, string> = {};
        const titles: Record<string, string> = {};
        const categories: Record<string, string> = {};
        arr.forEach((note: Note) => {
          try {
            contents[note._id] = JSON.parse(note.content);
          } catch {
            contents[note._id] = note.content;
          }
          titles[note._id] = note.title;
          categories[note._id] = note.category || "";
        });
        setNoteContents(contents);
        setDraftTitles(titles);
        setDraftCategories(categories);
      } catch (err) {
        console.error("Błąd pobierania notatek", err);
        setNotes([]);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      window.postMessage(
        {
          type: "SET_TOKEN",
          token: session.accessToken,
        },
        window.origin
      );
    }
  }, [status, session]);

  const returnRawTest = (content: string) => {
    const plainText = content.replace(/<[^>]+>/g, "");
    return plainText.slice(0, 120) + "...";
  };

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

  const scrollToNote = (noteId: string) => {
    const el = noteRefs.current[noteId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDraftTitleChange = (noteId: string, newTitle: string) => {
    setDraftTitles((prev) => ({ ...prev, [noteId]: newTitle }));
  };

  const handleDraftCategoryChange = (noteId: string, newCategory: string) => {
    setDraftCategories((prev) => ({ ...prev, [noteId]: newCategory }));
  };

  const handleNoteChange = (noteId: string, content: string) => {
    setNoteContents((prev) => ({ ...prev, [noteId]: content }));
  };

  const handleSaveNote = async (noteId: string) => {
    const note = notes.find((n) => n._id === noteId);
    if (!note || !note._id) return;
    const editedNoteContent = noteContents[note._id];
    const editedTitle = draftTitles[note._id];
    const editedCategory = draftCategories[note._id];

    try {
      await fetch(`/api/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: note._id,
          title: editedTitle,
          category: editedCategory,
          content: editedNoteContent,
        }),
      });

      setNotes((prev) =>
        prev.map((n) =>
          n._id === noteId
            ? { ...n, title: editedTitle, category: editedCategory }
            : n
        )
      );
    } catch (err) {
      console.error("Błąd zapisywania notatki", err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await fetch(`/api/notes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId }),
      });
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      setDeleteConfirmId(null);
      setDeleteInput("");
    } catch (err) {
      console.error("Błąd usuwania notatki", err);
    }
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
            <div key={cat} className="mb-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-semibold"
                onClick={() => scrollToCategory(cat)}
              >
                📂 {cat.length > 20 ? cat.slice(0, 20) + "..." : cat}
              </Button>
              <div className="ml-6 mt-1 space-y-1">
                {groupedNotes[cat]?.map((note) => (
                  <Button
                    key={note._id}
                    variant="ghost"
                    className="w-full justify-start text-xs text-gray-600"
                    onClick={() => scrollToNote(note._id)}
                  >
                    •{" "}
                    {note.title.length > 30
                      ? note.title.slice(0, 30) + "..."
                      : note.title}
                  </Button>
                ))}
              </div>
            </div>
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
            ref={(el) => {
              sectionRefs.current[cat] = el;
            }}
            className="mb-10"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-700">📂 {cat}</h2>
            <div className="grid gap-4">
              {catNotes.map((note) => (
                <Card
                  key={note._id}
                  ref={(el) => {
                    noteRefs.current[note._id] = el;
                  }}
                  className="hover:shadow-xl transition rounded-2xl border border-gray-200 bg-white"
                >
                  <CardContent className="p-6 space-y-3">
                    {expanded === note._id ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            Title:
                          </span>
                          <Input
                            value={draftTitles[note._id] || ""}
                            onChange={(e) =>
                              handleDraftTitleChange(note._id, e.target.value)
                            }
                            placeholder="Wpisz tytuł"
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            Category:
                          </span>
                          <Input
                            value={draftCategories[note._id] || ""}
                            onChange={(e) =>
                              handleDraftCategoryChange(
                                note._id,
                                e.target.value
                              )
                            }
                            placeholder="Wpisz kategorię"
                            className="flex-1"
                          />
                        </div>
                        <NoteEditor
                          note={noteContents[note._id]}
                          setNoteHandler={(content) =>
                            handleNoteChange(note._id, content)
                          }
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {note.title}
                        </h3>
                        <p className="text-xs text-gray-500 italic">
                          {note.category || "Inne"}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {returnRawTest(noteContents[note._id])}
                        </p>
                      </>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <Button
                        variant="link"
                        className="p-0 text-blue-600 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(expanded === note._id ? null : note._id);
                        }}
                      >
                        {expanded === note._id ? "Pokaż mniej" : "Pokaż więcej"}
                      </Button>

                      {expanded === note._id && (
                        <>
                          <button
                            // variant="outline"
                            // size="sm"
                            className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                            onClick={() => handleSaveNote(note._id)}
                          >
                            💾 Save
                          </button>

                          <button
                            // variant="destructive"
                            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                            // size="sm"
                            onClick={() => setDeleteConfirmId(note._id)}
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {deleteConfirmId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl w-96 space-y-4">
              <h3 className="text-lg font-bold">Confirm Delete</h3>
              <p>
                To delete this note, type its title exactly:
                <span className="font-semibold">
                  {" "}
                  "{draftTitles[deleteConfirmId]}"
                </span>
              </p>
              <Input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type note title..."
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteConfirmId(null);
                    setDeleteInput("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={deleteInput !== draftTitles[deleteConfirmId]}
                  onClick={() => handleDeleteNote(deleteConfirmId)}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {filteredNotes.length === 0 && (
          <p className="text-gray-500 italic text-center mt-10">
            Brak notatek spełniających kryteria.
          </p>
        )}
      </main>
    </div>
  );
}
