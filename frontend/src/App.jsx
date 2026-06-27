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
    <div className="app">
      <h1>Rubberduck</h1>
      <p>Frontend connected to the ASP.NET API.</p>
      {error ? <p className="error">{error}</p> : null}

      <div className="submission-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Language"
        />
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code"
          rows={6}
        />
        <select value={status} onChange={(e) => setStatus(Number(e.target.value))}>
          <option value={0}>Pending</option>
          <option value={1}>Reviewing</option>
          <option value={2}>Done</option>
        </select>
        <button onClick={createSubmission}>Create New Submission</button>
      </div>

      <ul>
        {submissions.map((submission) => (
          <li key={submission.id} style={{ marginBottom: 16, borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => deleteSubmission(submission.id)}>X</button>
              <strong>{submission.title}</strong>
              <span>— {submission.language}</span>
              <button onClick={() => toggleDetails(submission.id)} style={{ marginLeft: 'auto' }}>
                {expandedId === submission.id ? 'Hide' : 'View'}
              </button>
            </div>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{submission.code}</pre>
            <p>Status: {submission.status === 0 ? 'Pending' : submission.status === 1 ? 'Reviewing' : 'Done'}</p>

            {expandedId === submission.id && (
              <div className="comments">
                <h4>Comments</h4>
                <div>
                  {commentsBySubmission[submission.id] ? (
                    commentsBySubmission[submission.id].length ? (
                      <ul>
                        {commentsBySubmission[submission.id].map((c) => (
                          <li key={c.id}>
                            <strong>Line {c.lineNumber ?? c.LineNumber}:</strong> {c.content ?? c.Content}
                            <div>Severity: {severityLabel(c.severity ?? c.Severity)}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No comments yet.</p>
                    )
                  ) : (
                    <p>Loading comments…</p>
                  )}
                </div>

                <div className="comment-form" style={{ marginTop: 8 }}>
                  <h5>Add comment</h5>
                  <label>
                    Line:{' '}
                    <input type="number" value={newCommentLine} min={1} onChange={(e) => setNewCommentLine(e.target.value)} />
                  </label>
                  <br />
                  <label>
                    Severity:{' '}
                    <select value={newCommentSeverity} onChange={(e) => setNewCommentSeverity(Number(e.target.value))}>
                      <option value={0}>Info</option>
                      <option value={1}>Warning</option>
                      <option value={2}>Error</option>
                    </select>
                  </label>
                  <br />
                  <textarea value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} rows={3} placeholder="Comment" />
                  <br />
                  <button onClick={() => createComment(submission.id)}>Add Comment</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
