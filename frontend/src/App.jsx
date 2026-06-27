import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [commentsBySubmission, setCommentsBySubmission] = useState({});
  const [newCommentContent, setNewCommentContent] = useState('');
  const [newCommentLine, setNewCommentLine] = useState(1);
  const [newCommentSeverity, setNewCommentSeverity] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5196/Submissions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load submissions');
        }
        return response.json();
      })
      .then((data) => setSubmissions(data))
      .catch((err) => setError(err.message));
  }, []);

  const createSubmission = async () => {
    setError('');

    const newSubmission = {
      title,
      language,
      code,
      status
    };

    const newReview = {
      SubmissionId: 0,
      LineNumber: 0,
      Content: '',
      Severity: 0
    };

    try {
      const response = await fetch('http://localhost:5196/Submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSubmission)
      });

      if (!response.ok) {
        throw new Error('Failed to create submission');
      }

      const created = await response.json();
      setSubmissions((current) => [...current, created]);
      setTitle('');
      setLanguage('');
      setCode('');
      setStatus(0);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchComments = async (submissionId) => {
    try {
      const res = await fetch(`http://localhost:5196/Submissions/${submissionId}/comments`);
      if (!res.ok) throw new Error('Failed to load comments');
      const data = await res.json();
      setCommentsBySubmission((prev) => ({ ...prev, [submissionId]: data }));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteSubmission = async (id) => {
    setError('');

    try {
      const response = await fetch(`http://localhost:5196/Submissions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }

      setSubmissions((current) => current.filter((submission) => submission.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleDetails = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!commentsBySubmission[id]) {
      fetchComments(id);
    }
  };

  const createComment = async (submissionId) => {
    setError('');
    const payload = {
      lineNumber: Number(newCommentLine),
      content: newCommentContent,
      severity: Number(newCommentSeverity)
    };

    try {
      const res = await fetch(`http://localhost:5196/Submissions/${submissionId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create comment');
      const created = await res.json();
      setCommentsBySubmission((prev) => ({
        ...prev,
        [submissionId]: [...(prev[submissionId] || []), created]
      }));
      setNewCommentContent('');
      setNewCommentLine(1);
      setNewCommentSeverity(0);
    } catch (err) {
      setError(err.message);
    }
  };

  const severityLabel = (val) => {
    const n = Number(val);
    return ['Info', 'Warning', 'Error'][n] ?? val;
  };

 

  return (
    <div className="app container py-5">
      <div className="hero text-center mb-5">
        <div className="badge bg-primary text-white mb-3">Rubberduck API Demo</div>
        <h1 className="display-5 fw-bold">Review code submissions instantly</h1>
        <p className="lead text-secondary">Create submissions, inspect code, and add review comments from one polished dashboard.</p>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="h5 mb-3">New Submission</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Language"
              />
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code"
                rows={5}
              />
            </div>
            <div className="col-md-4">
              <select className="form-select" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                <option value={0}>Pending</option>
                <option value={1}>Reviewing</option>
                <option value={2}>Done</option>
              </select>
            </div>
            <div className="col-md-8 d-grid">
              <button className="btn btn-primary btn-lg" onClick={createSubmission}>Create New Submission</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 gy-4">
        {submissions.map((submission) => (
          <div className="col" key={submission.id}>
            <div className="card shadow-sm h-100 submission-card">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div>
                    <h3 className="h6 mb-1">{submission.title}</h3>
                    <p className="text-muted mb-0">{submission.language} • <span className="text-capitalize">{submission.status === 0 ? 'Pending' : submission.status === 1 ? 'Reviewing' : 'Done'}</span></p>
                  </div>
                  <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteSubmission(submission.id)}>Delete</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => toggleDetails(submission.id)}>
                      {expandedId === submission.id ? 'Hide details' : 'View details'}
                    </button>
                  </div>
                </div>
                <pre className="submission-code bg-light rounded p-3 mb-3">{submission.code}</pre>

                {expandedId === submission.id && (
                  <div className="comments">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h4 className="h6 mb-0">Review comments</h4>
                      <span className="badge bg-secondary">{commentsBySubmission[submission.id]?.length ?? 0} total</span>
                    </div>

                    {commentsBySubmission[submission.id] ? (
                      commentsBySubmission[submission.id].length ? (
                        <ul className="list-group mb-3">
                          {commentsBySubmission[submission.id].map((c) => (
                            <li className="list-group-item" key={c.id}>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>Line {c.lineNumber ?? c.LineNumber}</strong>
                                <span className="badge bg-info text-dark">{severityLabel(c.severity ?? c.Severity)}</span>
                              </div>
                              <p className="mb-0">{c.content ?? c.Content}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="alert alert-warning">No comments yet. Add the first review comment below.</div>
                      )
                    ) : (
                      <div className="text-muted">Loading comments…</div>
                    )}

                    <div className="card card-body bg-white border mt-3 shadow-sm">
                      <h5 className="h6 mb-3">Add comment</h5>
                      <div className="row g-3">
                        <div className="col-md-3">
                          <input type="number" className="form-control" value={newCommentLine} min={1} onChange={(e) => setNewCommentLine(e.target.value)} placeholder="Line #" />
                        </div>
                        <div className="col-md-3">
                          <select className="form-select" value={newCommentSeverity} onChange={(e) => setNewCommentSeverity(Number(e.target.value))}>
                            <option value={0}>Info</option>
                            <option value={1}>Warning</option>
                            <option value={2}>Error</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <textarea className="form-control" value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} rows={2} placeholder="Comment"></textarea>
                        </div>
                        <div className="col-12 d-grid">
                          <button className="btn btn-success" onClick={() => createComment(submission.id)}>Add Comment</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
