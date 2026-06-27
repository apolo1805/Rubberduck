  import { useEffect, useState } from 'react';
  import './index.css';
  import Submissions from './components/Submissions.jsx';

function App() {
  const [error, setError] = useState('');

  return (
    <div className="app container py-5">
      <div className="hero text-center mb-5">
        <div className="badge bg-primary text-white mb-3">Rubberduck API Demo</div>
        <h1 className="display-5 fw-bold">Review code submissions instantly</h1>
        <p className="lead text-secondary">Create submissions, inspect code, and add review comments from one polished dashboard.</p>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <Submissions />
    </div>
  );
}

export default App;
