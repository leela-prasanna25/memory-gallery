import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { getApiErrorMessage } from "../api/errors";
import { useApp } from "../context/AppContext";

export default function UploadPage() {
  const { token, fetchMemories } = useApp();
  const navigate = useNavigate();

  const [memoryForm, setMemoryForm] = useState({
    caption: "",
    location: "",
    activity: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      navigate("/auth", { state: { from: { pathname: "/upload" } } });
      return;
    }

    if (!imageFile) {
      setError("Please choose an image file.");
      return;
    }

    const payload = new FormData();
    payload.append("image", imageFile);
    payload.append("caption", memoryForm.caption);
    payload.append("location", memoryForm.location);
    payload.append("activity", memoryForm.activity);

    setIsLoading(true);
    try {
      await api.post("/memories", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemoryForm({ caption: "", location: "", activity: "" });
      setImageFile(null);
      setSuccess("Memory uploaded. You can see it in the gallery.");
      await fetchMemories();
    } catch (err) {
      setError(getApiErrorMessage(err, "Upload failed."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="topbar page-intro">
        <h1>Upload a memory</h1>
        <p>Add a photo with a caption, location, and activity name. Sign in is required.</p>
      </header>

      <section className="card">
        {!token && (
          <p className="message error" style={{ marginBottom: "1rem" }}>
            You need to{" "}
            <button
              type="button"
              className="link-inline"
              onClick={() =>
                navigate("/auth", { state: { from: { pathname: "/upload" } } })
              }
            >
              sign in
            </button>{" "}
            before uploading.
          </p>
        )}

        <form className="grid-form" onSubmit={handleUpload}>
          <input
            placeholder="Caption"
            value={memoryForm.caption}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, caption: e.target.value })
            }
          />
          <input
            placeholder="Location"
            value={memoryForm.location}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, location: e.target.value })
            }
          />
          <input
            placeholder="Activity name"
            value={memoryForm.activity}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, activity: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <button disabled={isLoading || !token} type="submit">
            {isLoading ? "Uploading…" : "Upload memory"}
          </button>
        </form>

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}
      </section>
    </>
  );
}
