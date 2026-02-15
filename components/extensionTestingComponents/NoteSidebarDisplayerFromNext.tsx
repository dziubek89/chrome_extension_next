"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditNoteEditor from "./EditNoteEditor";
// import { sendMessageAsync } from "../utils/handleMessage";

type Note = {
  _id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
};

interface NoteSidebarDisplayerFromNextProps {
  refreshKey?: number; // teraz opcjonalny
}

const NoteSidebarDisplayerFromNext: React.FC<
  NoteSidebarDisplayerFromNextProps
> = ({ refreshKey }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteContents, setNoteContents] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  //@ts-ignore
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [draftTitles, setDraftTitles] = useState<Record<string, string>>({});
  const [draftCategories, setDraftCategories] = useState<
    Record<string, string>
  >({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const noteRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const currentUrl = window.location.href;
    const fetchNotes = async () => {
      //tu pobrać notki
      //   const response = await sendMessageAsync({
      //     type: "GET_NOTES",
      //     url: currentUrl,
      //   });

      const response = await fetch("/api/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // jeśli używasz cookies/sesji
      });
      const data = await response.json();
      console.log(data);
      const arr = Array.isArray(data.notes) ? data.notes : [];

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
    };

    fetchNotes();
  }, [refreshKey]);

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

  const handleDraftTitleChange = (noteId: string, newTitle: string) => {
    setDraftTitles((prev) => ({ ...prev, [noteId]: newTitle }));
  };

  const handleDraftCategoryChange = (noteId: string, newCategory: string) => {
    setDraftCategories((prev) => ({ ...prev, [noteId]: newCategory }));
  };

  const handleNoteChange = (noteId: string, content: string) => {
    setNoteContents((prev) => ({ ...prev, [noteId]: content }));
  };

  const hasChanges = (note: Note) => {
    return (
      draftTitles[note._id] !== note.title ||
      draftCategories[note._id] !== (note.category || "") ||
      noteContents[note._id] !== note.content
    );
  };

  const handleSaveNote = async (noteId: string) => {
    const note = notes.find((n) => n._id === noteId);
    if (!note) return;

    setSaving((prev) => ({ ...prev, [noteId]: true }));
    setSavedStatus((prev) => ({ ...prev, [noteId]: false }));

    try {
      //   await sendMessageAsync({
      //     type: "UPDATE_NOTE",
      //     id: note._id,
      //     title: draftTitles[note._id],
      //     category: draftCategories[note._id],
      //     content: noteContents[note._id],
      //   });

      setNotes((prev) =>
        prev.map((n) =>
          n._id === noteId
            ? {
                ...n,
                title: draftTitles[note._id],
                category: draftCategories[note._id],
                content: noteContents[note._id],
              }
            : n
        )
      );

      setSavedStatus((prev) => ({ ...prev, [noteId]: true }));
      setTimeout(() => {
        setSavedStatus((prev) => ({ ...prev, [noteId]: false }));
      }, 3000);
    } catch (err) {
      console.error("Błąd zapisywania notatki", err);
    } finally {
      setSaving((prev) => ({ ...prev, [noteId]: false }));
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    // try {
    //   await sendMessageAsync({
    //     type: "DELETE_NOTE",
    //     noteId: noteId,
    //   });
    //   setNotes((prev) => prev.filter((n) => n._id !== noteId));
    //   setDeleteConfirmId(null);
    //   setDeleteInput("");
    // } catch (err) {
    //   console.error("Błąd usuwania notatki", err);
    // }
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box component="main" sx={{ flex: 1, p: 2, bgcolor: "#f9f9f9" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <TextField
            label="Search notes"
            variant="outlined"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            sx={{ maxWidth: 300 }}
          />
          <Button variant="outlined" onClick={() => setSortAsc((s) => !s)}>
            {sortAsc ? "⬆️ Ascending" : "⬇️ Descending"}
          </Button>
        </Box>

        {Object.entries(groupedNotes).map(([cat, catNotes]) => (
          <Box
            key={cat}
            ref={(el: any) => {
              //@ts-ignore
              sectionRefs.current[cat] = el;
            }}
            sx={{ mb: 4 }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              📂 {cat}
            </Typography>
            <Grid container spacing={2}>
              {catNotes.map((note) => (
                //@ts-ignore
                <Grid
                  item
                  xs={12}
                  sx={{ width: "100%" }}
                  key={note._id}
                  ref={(el: any) => {
                    noteRefs.current[note._id] = el;
                  }}
                >
                  <Card>
                    <CardContent>
                      {expanded === note._id ? (
                        <>
                          <TextField
                            label="Title"
                            value={draftTitles[note._id] || ""}
                            onChange={(e: any) =>
                              handleDraftTitleChange(note._id, e.target.value)
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            label="Category"
                            value={draftCategories[note._id] || ""}
                            onChange={(e: any) =>
                              handleDraftCategoryChange(
                                note._id,
                                e.target.value
                              )
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <EditNoteEditor
                            note={noteContents[note._id]}
                            setNoteHandler={(content: any) =>
                              handleNoteChange(note._id, content)
                            }
                          />
                        </>
                      ) : (
                        <>
                          <Typography variant="h6">{note.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {note.category || "Inne"}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {returnRawTest(noteContents[note._id])}
                          </Typography>
                        </>
                      )}

                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button
                          variant="text"
                          onClick={() =>
                            setExpanded(expanded === note._id ? null : note._id)
                          }
                        >
                          {expanded === note._id
                            ? "Pokaż mniej"
                            : "Pokaż więcej"}
                        </Button>

                        {expanded === note._id && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleSaveNote(note._id)}
                              disabled={!hasChanges(note) || saving[note._id]}
                            >
                              {saving[note._id] ? (
                                <CircularProgress size={20} />
                              ) : (
                                "💾 Zapisz"
                              )}
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => setDeleteConfirmId(note._id)}
                            >
                              🗑️ Usuń
                            </Button>
                          </>
                        )}
                      </Box>

                      {savedStatus[note._id] && (
                        <Typography
                          color="success.main"
                          variant="body2"
                          sx={{ mt: 1 }}
                        >
                          ✅ Zapisano poprawnie
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Dialog potwierdzenia usunięcia */}
        <Dialog
          open={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
        >
          <DialogTitle>Potwierdź usunięcie</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Aby usunąć notatkę, wpisz jej tytuł:
              <b> "{draftTitles[deleteConfirmId || ""]}"</b>
            </DialogContentText>
            <TextField
              fullWidth
              variant="outlined"
              value={deleteInput}
              onChange={(e: any) => setDeleteInput(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmId(null)}>Anuluj</Button>
            <Button
              color="error"
              disabled={deleteInput !== draftTitles[deleteConfirmId || ""]}
              onClick={() => handleDeleteNote(deleteConfirmId!)}
            >
              Potwierdź
            </Button>
          </DialogActions>
        </Dialog>

        {filteredNotes.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 4, textAlign: "center" }}
          >
            Brak notatek spełniających kryteria.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default NoteSidebarDisplayerFromNext;
