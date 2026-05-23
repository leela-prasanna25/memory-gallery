import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/errors";
import { useApp } from "../context/AppContext";

export default function GalleryPage() {
  const { memories, fetchMemories } = useApp();
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await fetchMemories();
        if (!cancelled) setLoadError("");
      } catch (err) {
        if (!cancelled) {
          setLoadError(getApiErrorMessage(err, "Unable to load memories."));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchMemories]);

  const filteredMemories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return memories;
    }
    return memories.filter((memory) =>
      [memory.caption, memory.location, memory.activity]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [memories, query]);

  return (
    <>
      <header className="topbar page-intro">
        <h1>Gallery feed</h1>
        <p>Browse shared memories—search by caption, location, or activity.</p>
      </header>

      <section className="card gallery-section">
        <div className="feed-header">
          <h2>All memories</h2>
          <input
            className="search"
            type="search"
            placeholder="Search by caption, location, activity…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search memories"
          />
        </div>

        {loadError && <p className="message error">{loadError}</p>}

        <div className="gallery-grid">
          {filteredMemories.map((memory) => (
            <article key={memory._id} className="memory-card">
              <img src={memory.imageUrl} alt={memory.caption || "Memory"} loading="lazy" />
              <div className="meta">
                <h3>{memory.caption || "Untitled memory"}</h3>
                <p>{memory.location || "Unknown location"}</p>
                <p>{memory.activity || "General activity"}</p>
                <small>
                  by {memory.uploadedBy?.name || "Community"} ·{" "}
                  {new Date(memory.createdAt).toLocaleString()}
                </small>
              </div>
            </article>
          ))}
        </div>

        {!filteredMemories.length && !loadError && (
          <p className="empty-state">
            {memories.length === 0
              ? "No memories yet. Upload the first one from the Upload page."
              : "No memories match this search."}
          </p>
        )}
      </section>
    </>
  );
}
