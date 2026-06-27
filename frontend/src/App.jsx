import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(0);

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
          <li key={submission.id}>
            <button onClick={() => deleteSubmission(submission.id)}>X</button>
            <strong>{submission.title}</strong> — {submission.language}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
