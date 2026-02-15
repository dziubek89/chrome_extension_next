"use client";

import { useState } from "react";
// import { sendMessageAsync } from "../utils/handleMessage";
import AddNoteEditor from "@/components/extensionTestingComponents/AddNoteEditor";

interface NotesSidebarProps {
  onNoteAdded?: () => void;
}
const AddNoteComponent: React.FC<NotesSidebarProps> = ({ onNoteAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSaveNote = async () => {
    const currentUrl = window.location.href.split("?")[0];

    try {
      //tutaj request do api po notesy
      //   await sendMessageAsync({
      //     type: "ADD_NOTE",
      //     url: currentUrl,
      //     note,
      //     category,
      //     title,
      //   });

      onNoteAdded?.();

      setTitle("");
      setCategory("");
      setNote("");
      setIsOpen(false);
    } catch (error) {
      console.error("❌ Wystąpił błąd podczas zapisywania notatki:", error);
    }
  };

  return (
    <>
      {/* Przycisk otwierający panel */}
      {!isOpen && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            style={{
              // position: "fixed",
              // top: "50%",
              right: 0,
              // transform: "translateY(-50%)",
              background: "#4CAF50",
              color: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              zIndex: 999999,
            }}
          >
            ✏️ Add note
          </button>

          <a
            href="https://chrome-extension-next.vercel.app/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              right: 0,
              background: "#007bff",
              color: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
              zIndex: 999999,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 2h14a2 2 0 012 2v16l-4-4H4a2 2 0 01-2-2V4a2 2 0 012-2zm2 7h10v2H6V9zm0 4h7v2H6v-2z" />
            </svg>{" "}
            Check all notes
          </a>
        </div>
      )}

      {/* Panel boczny */}
      {isOpen && (
        <div
          style={{
            // position: "fixed",
            top: 0,
            right: 0,
            // height: "100vh",
            width: "500px",
            background: "#fff",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            zIndex: 999999,
            overflow: "auto",
          }}
        >
          {/* Nagłówek panelu */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <h3 style={{ margin: 0 }}>New Note</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Pole: Title */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              marginBottom: 8,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />

          {/* Pole: Category */}
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              marginBottom: 8,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />

          <AddNoteEditor setNoteHandler={setNote} />

          {/* Przycisk zapisu */}
          <button
            onClick={handleSaveNote}
            style={{
              marginTop: 10,
              background: "#4CAF50",
              color: "white",
              padding: "8px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default AddNoteComponent;
