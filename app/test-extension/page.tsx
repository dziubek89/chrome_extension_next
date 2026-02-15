"use client";

import { notFound } from "next/navigation";

import { useState, useEffect, useRef } from "react";
import AddNoteComponent from "@/components/extensionTestingComponents/AddNoteComponent";
import NoteSidebarDisplayerFromNext from "@/components/extensionTestingComponents/NoteSidebarDisplayerFromNext";

const ContentScript = () => {
  if (process.env.NODE_ENV !== "development") {
    notFound(); // zwróci 404 w produkcji
  }
  const [open, setOpen] = useState(false);

  const [top, setTop] = useState<number>(() => {
    const saved = localStorage.getItem("notesSidebarTop");
    return saved ? parseInt(saved) : window.innerHeight / 2 - 200;
  });

  const panelRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const startTop = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;

      const deltaY = e.clientY - dragStartY.current;
      let newTop = startTop.current + deltaY;

      // Pobranie wysokości panelu dynamicznie
      const panelHeight = panelRef.current?.offsetHeight || 0;

      const minTop = window.innerHeight * 0.05; // 10% od góry
      const maxTop = window.innerHeight * 0.9 - panelHeight; // 10% od dołu

      newTop = Math.max(minTop, Math.min(newTop, maxTop));
      setTop(newTop);
    };

    const handleMouseUp = () => {
      if (dragging.current) {
        dragging.current = false;
        localStorage.setItem("notesSidebarTop", top.toString());
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [top]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStartY.current = e.clientY;
    startTop.current = top;
    e.preventDefault(); // zapobiega zaznaczaniu tekstu
  };

  return (
    <div
      style={{
        position: "fixed",
        top: `${top}px`,
        right: "0",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        height: "200px",
      }}
    >
      {/* Mały przycisk widget - widoczny tylko gdy panel zamknięty */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          onMouseDown={handleMouseDown}
          style={{
            padding: "10px 14px",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #ccc",
            background: "#f9f9f9",
            cursor: "grab",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          💬
        </button>
      )}

      {/* Panel rozwijany */}
      {open && (
        <div
          ref={panelRef}
          style={{
            width: "520px",
            border: "1px solid #ccc",
            borderRadius: "8px 0 0 8px",
            background: "#fff",
            marginTop: "5px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {/* Drag Handle */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              cursor: "grab",
              padding: "8px",
              background: "#f0f0f0",
              borderBottom: "1px solid #ccc",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              overflowY: "auto",
            }}
          >
            Notes Panel
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: "2px 6px",
                borderRadius: "4px",
                border: "none",
                background: "#ddd",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Zawartość panelu */}
          <div
            style={{
              padding: "10px",
              overflowY: "auto",
              // maxHeight: "calc(80vh - 40px)",
            }}
          >
            <AddNoteComponent />
          </div>
          <div style={{ maxHeight: "75vh", overflow: "auto" }}>
            <NoteSidebarDisplayerFromNext />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentScript;
