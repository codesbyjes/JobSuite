
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "jobsuite_candidate_projects";

const demoProjects = [
  {
    id: "demo-1",
    title: "AI Career Advisor",
    description:
      "A career guidance platform helping first-generation graduates discover career paths, improve skills, and prepare for job opportunities.",
    technologies: "React, JavaScript, CSS",
    url: "https://github.com/",
    fileName: "",
    submittedAt: new Date().toISOString(),
    status: "Under Review",
  },
];

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  url: "",
};

function getSavedProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : demoProjects;
  } catch {
    return demoProjects;
  }
}

function formatDate(date) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "Not available"
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function Submitproject() {
  const [projects, setProjects] = useState(getSavedProjects);
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      setError("Could not save data in browser storage.");
    }
  }, [projects]);

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.status === activeTab);

  const submitted = projects.filter(
    (p) => p.status === "Submitted"
  ).length;

  const underReview = projects.filter(
    (p) => p.status === "Under Review"
  ).length;

  const approved = projects.filter(
    (p) => p.status === "Approved"
  ).length;

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setSelectedFile(null);
    setEditingId(null);

    const fileInput = document.getElementById("sp-file");

    if (fileInput) fileInput.value = "";
  }

  function editProject(project) {
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      url: project.url || "",
    });

    setSelectedFile(null);
    setEditingId(project.id);
    setViewProject(null);
    setMessage("");
    setError("");

    document.getElementById("sp-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.technologies.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.url.trim()) {
      try {
        const parsed = new URL(form.url.trim());

        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("Invalid URL");
        }
      } catch {
        setError("Please enter a valid HTTP or HTTPS project URL.");
        return;
      }
    }

    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      return;
    }

    setLoading(true);

    try {
      // Mock submission. Connect your backend API here later.
      await new Promise((resolve) => setTimeout(resolve, 400));

      const previous = projects.find((p) => p.id === editingId);

      const project = {
        id: editingId || crypto.randomUUID(),
        title: form.title.trim(),
        description: form.description.trim(),
        technologies: form.technologies.trim(),
        url: form.url.trim(),
        fileName: selectedFile
          ? selectedFile.name
          : previous?.fileName || "",
        submittedAt: previous?.submittedAt || new Date().toISOString(),
        status: previous?.status || "Submitted",
      };

      if (editingId) {
        setProjects((current) =>
          current.map((p) => (p.id === editingId ? project : p))
        );

        setMessage("Project updated successfully!");
      } else {
        setProjects((current) => [project, ...current]);
        setActiveTab("All");
        setMessage("Project submitted successfully!");
      }

      resetForm();
    } catch {
      setError("Unable to submit the project. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function cancelEdit() {
    resetForm();
    setMessage("");
    setError("");
  }

  return (
    <div className="sp-app">
      <style>{`
        .sp-app {
          --sp-primary: #5145cd;
          --sp-text: #202238;
          --sp-muted: #73768b;
          --sp-border: #e7e8f0;
          min-height: 100vh;
          padding: 32px 22px 60px;
          background: #f8f9fc;
          color: var(--sp-text);
          font-family: Inter, system-ui, Arial, sans-serif;
        }
        .sp-app * { box-sizing: border-box; }
        .sp-container { max-width: 1150px; margin: 0 auto; }
        .sp-header {
          display: flex; justify-content: space-between;
          align-items: center; gap: 20px; margin-bottom: 28px;
        }
        .sp-eyebrow {
          color: var(--sp-primary); font-size: 11px;
          font-weight: 800; letter-spacing: 1.4px;
        }
        .sp-header h1 { font-size: 34px; margin: 9px 0; }
        .sp-subtitle {
          margin: 0; color: var(--sp-muted);
          font-size: 14px; line-height: 1.7;
        }
        .sp-btn {
          border: 0; border-radius: 8px; padding: 12px 17px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          text-decoration: none; display: inline-flex;
          align-items: center; justify-content: center;
        }
        .sp-btn:disabled { opacity: .6; cursor: not-allowed; }
        .sp-primary { background: var(--sp-primary); color: white; }
        .sp-primary:hover { background: #4034b2; }
        .sp-secondary { background: #f0eff7; color: var(--sp-text); }
        .sp-stats {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px; margin-bottom: 25px;
        }
        .sp-stat, .sp-panel {
          background: white; border: 1px solid var(--sp-border);
          border-radius: 13px;
        }
        .sp-stat { padding: 19px; }
        .sp-stat span { color: var(--sp-muted); font-size: 13px; }
        .sp-stat strong { display: block; font-size: 28px; margin-top: 12px; }
        .sp-panel { padding: 25px; margin-bottom: 25px; }
        .sp-heading { margin-bottom: 23px; }
        .sp-heading h2 { font-size: 21px; margin: 0 0 7px; }
        .sp-heading p {
          color: var(--sp-muted); font-size: 13px;
          line-height: 1.7; margin: 0;
        }
        .sp-form {
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 19px;
        }
        .sp-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .sp-full { grid-column: 1 / -1; }
        .sp-field label { font-size: 13px; font-weight: 700; }
        .sp-field input, .sp-field textarea {
          width: 100%; padding: 12px; border: 1px solid #dfe1eb;
          border-radius: 8px; background: white; color: var(--sp-text);
          font: inherit; font-size: 13px; outline: none;
        }
        .sp-field input { min-height: 44px; }
        .sp-field textarea { min-height: 110px; resize: vertical; }
        .sp-field input:focus, .sp-field textarea:focus {
          border-color: var(--sp-primary);
          box-shadow: 0 0 0 3px #5145cd18;
        }
        .sp-hint { font-size: 12px; color: var(--sp-muted); }
        .sp-actions {
          display: flex; justify-content: flex-end;
          gap: 10px; flex-wrap: wrap;
        }
        .sp-alert {
          padding: 12px 14px; border-radius: 8px;
          margin-bottom: 18px; font-size: 13px; line-height: 1.6;
        }
        .sp-success { background: #e8f8ed; color: #17683a; }
        .sp-error { background: #fff0f0; color: #a62424; }
        .sp-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .sp-tab {
          padding: 9px 13px; border: 1px solid var(--sp-border);
          border-radius: 8px; background: white; color: var(--sp-muted);
          font-size: 12px; font-weight: 700; cursor: pointer;
        }
        .sp-tab.active {
          border-color: var(--sp-primary); color: var(--sp-primary);
          background: #f0efff;
        }
        .sp-list { display: grid; gap: 13px; }
        .sp-card {
          display: flex; justify-content: space-between; gap: 20px;
          padding: 19px; background: white;
          border: 1px solid var(--sp-border); border-radius: 12px;
        }
        .sp-card-main { display: flex; gap: 13px; min-width: 0; }
        .sp-icon {
          flex-shrink: 0; width: 43px; height: 43px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px; background: #efedff;
          color: var(--sp-primary); font-size: 13px; font-weight: 800;
        }
        .sp-card-content { min-width: 0; }
        .sp-card-content h3 { margin: 1px 0 9px; font-size: 16px; }
        .sp-description {
          margin: 0 0 10px; max-width: 650px;
          color: var(--sp-muted); font-size: 13px;
          line-height: 1.7; overflow-wrap: anywhere;
        }
        .sp-meta {
          margin: 6px 0 0; color: var(--sp-muted);
          font-size: 12px; line-height: 1.6; overflow-wrap: anywhere;
        }
        .sp-meta b { color: var(--sp-text); }
        .sp-card-side {
          display: flex; flex-direction: column;
          justify-content: space-between; align-items: flex-end;
          gap: 15px; flex-shrink: 0;
        }
        .sp-status {
          padding: 7px 10px; border-radius: 30px;
          font-size: 11px; font-weight: 800; white-space: nowrap;
          background: #f0efff; color: #5145cd;
        }
        .sp-status-submitted { background: #e9f2ff; color: #2258a5; }
        .sp-status-under-review { background: #fff4dc; color: #956300; }
        .sp-status-approved { background: #e4f7eb; color: #18703c; }
        .sp-card-actions { display: flex; gap: 13px; }
        .sp-link-btn {
          border: 0; background: transparent; color: var(--sp-primary);
          font-size: 12px; font-weight: 700; cursor: pointer; padding: 4px 0;
        }
        .sp-link-btn:hover { text-decoration: underline; }
        .sp-empty {
          text-align: center; padding: 35px 18px;
          border: 1px dashed var(--sp-border); border-radius: 10px;
        }
        .sp-empty h3 { margin: 0 0 8px; }
        .sp-empty p { color: var(--sp-muted); font-size: 13px; line-height: 1.7; }
        .sp-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; background: #14152888;
        }
        .sp-modal {
          position: relative; width: min(100%, 570px);
          max-height: 85vh; overflow-y: auto; padding: 29px;
          background: white; border-radius: 15px;
          box-shadow: 0 20px 70px #0002;
        }
        .sp-close {
          position: absolute; top: 10px; right: 16px;
          border: 0; background: transparent; font-size: 28px;
          color: var(--sp-muted); cursor: pointer;
        }
        .sp-modal h2 { font-size: 23px; overflow-wrap: anywhere; }
        .sp-modal-description {
          color: var(--sp-muted); font-size: 14px;
          line-height: 1.8; overflow-wrap: anywhere;
        }
        .sp-detail {
          display: grid; grid-template-columns: 130px minmax(0, 1fr);
          gap: 12px; padding: 13px 0;
          border-top: 1px solid var(--sp-border);
          font-size: 13px; line-height: 1.6; overflow-wrap: anywhere;
        }
        .sp-detail strong { color: var(--sp-muted); }
        .sp-detail a { color: var(--sp-primary); }
        .sp-modal-edit { width: 100%; margin-top: 20px; }
        @media (max-width: 720px) {
          .sp-app { padding: 22px 13px 40px; }
          .sp-header { align-items: flex-start; flex-direction: column; }
          .sp-header h1 { font-size: 29px; }
          .sp-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .sp-stat { padding: 14px; }
          .sp-panel { padding: 18px 14px; }
          .sp-form { grid-template-columns: 1fr; }
          .sp-field { grid-column: 1 / -1; }
          .sp-card { flex-direction: column; padding: 15px; }
          .sp-card-side { align-items: flex-start; }
          .sp-detail { grid-template-columns: 1fr; gap: 4px; }
          .sp-modal { padding: 24px 18px; }
        }
      `}</style>

      <div className="sp-container">
        <header className="sp-header">
          <div>
            <span className="sp-eyebrow">JOBSUITE · CANDIDATE PORTAL</span>
            <h1>My Projects</h1>
            <p className="sp-subtitle">
              Showcase your skills, manage your projects and track submissions.
            </p>
          </div>

          <a href="#sp-form" className="sp-btn sp-primary">
            + Add a project
          </a>
        </header>

        <section className="sp-stats">
          <article className="sp-stat">
            <span>Total projects</span>
            <strong>{projects.length}</strong>
          </article>
          <article className="sp-stat">
            <span>Submitted</span>
            <strong>{submitted}</strong>
          </article>
          <article className="sp-stat">
            <span>Under review</span>
            <strong>{underReview}</strong>
          </article>
          <article className="sp-stat">
            <span>Approved</span>
            <strong>{approved}</strong>
          </article>
        </section>

        <section className="sp-panel" id="sp-form">
          <div className="sp-heading">
            <h2>{editingId ? "Edit project" : "Submit a project"}</h2>
            <p>
              Enter your project details below. Fields marked * are required.
            </p>
          </div>

          {message && (
            <div className="sp-alert sp-success" role="status">
              {message}
            </div>
          )}

          {error && (
            <div className="sp-alert sp-error" role="alert">
              {error}
            </div>
          )}

          <form className="sp-form" onSubmit={handleSubmit}>
            <div className="sp-field">
              <label htmlFor="sp-title">Project title *</label>
              <input
                id="sp-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. AI Career Advisor"
                maxLength={120}
                required
              />
            </div>

            <div className="sp-field">
              <label htmlFor="sp-tech">Technologies used *</label>
              <input
                id="sp-tech"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Python, Flask"
                required
              />
            </div>

            <div className="sp-field sp-full">
              <label htmlFor="sp-description">Project description *</label>
              <textarea
                id="sp-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Explain what your project does and the problem it solves."
                maxLength={3000}
                rows={4}
                required
              />
            </div>

            <div className="sp-field sp-full">
              <label htmlFor="sp-url">Project URL / GitHub link</label>
              <input
                id="sp-url"
                name="url"
                type="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="sp-field sp-full">
              <label htmlFor="sp-file">Upload project file (optional)</label>
              <input
                id="sp-file"
                type="file"
                accept=".pdf,.zip,.png,.jpg,.jpeg"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <span className="sp-hint">
                Maximum 5 MB. Demo mode saves the file name only.
              </span>
              {selectedFile && (
                <span className="sp-hint">
                  Selected file: {selectedFile.name}
                </span>
              )}
            </div>

            <div className="sp-actions sp-full">
              {editingId && (
                <button
                  type="button"
                  className="sp-btn sp-secondary"
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="sp-btn sp-primary"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Submit project"}
              </button>
            </div>
          </form>
        </section>

        <section className="sp-panel">
          <div className="sp-heading">
            <h2>Project history</h2>
            <p>View submission details and track the status of your projects.</p>
          </div>

          <div className="sp-tabs" aria-label="Filter projects">
            {["All", "Submitted", "Under Review", "Approved"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`sp-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="sp-empty">
              <h3>No projects found</h3>
              <p>Submit a project or choose another status filter.</p>
            </div>
          ) : (
            <div className="sp-list">
              {filteredProjects.map((project) => (
                <article className="sp-card" key={project.id}>
                  <div className="sp-card-main">
                    <div className="sp-icon" aria-hidden="true">
                      {"</>"}
                    </div>

                    <div className="sp-card-content">
                      <h3>{project.title}</h3>
                      <p className="sp-description">{project.description}</p>
                      <p className="sp-meta">
                        <b>Technologies:</b> {project.technologies}
                      </p>
                      <p className="sp-meta">
                        <b>Submitted:</b> {formatDate(project.submittedAt)}
                      </p>
                      {project.fileName && (
                        <p className="sp-meta">
                          <b>Attachment:</b> {project.fileName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sp-card-side">
                    <span
                      className={`sp-status sp-status-${project.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {project.status}
                    </span>

                    <div className="sp-card-actions">
                      <button
                        type="button"
                        className="sp-link-btn"
                        onClick={() => setViewProject(project)}
                      >
                        View details
                      </button>
                      <button
                        type="button"
                        className="sp-link-btn"
                        onClick={() => editProject(project)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {viewProject && (
        <div
          className="sp-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewProject(null);
          }}
        >
          <section
            className="sp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sp-modal-title"
          >
            <button
              type="button"
              className="sp-close"
              aria-label="Close"
              onClick={() => setViewProject(null)}
            >
              ×
            </button>

            <span className="sp-eyebrow">PROJECT DETAILS</span>
            <h2 id="sp-modal-title">{viewProject.title}</h2>
            <p className="sp-modal-description">{viewProject.description}</p>

            <div className="sp-detail">
              <strong>Technologies</strong>
              <span>{viewProject.technologies}</span>
            </div>

            <div className="sp-detail">
              <strong>Submission date</strong>
              <span>{formatDate(viewProject.submittedAt)}</span>
            </div>

            <div className="sp-detail">
              <strong>Status</strong>
              <span>{viewProject.status}</span>
            </div>

            {viewProject.url && (
              <div className="sp-detail">
                <strong>Project link</strong>
                <a
                  href={viewProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open project
                </a>
              </div>
            )}

            {viewProject.fileName && (
              <div className="sp-detail">
                <strong>Attachment</strong>
                <span>{viewProject.fileName}</span>
              </div>
            )}

            <button
              type="button"
              className="sp-btn sp-primary sp-modal-edit"
              onClick={() => editProject(viewProject)}
            >
              Edit project
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
