import '../index.css';

function CommentReviews({
  submission,
  commentsBySubmission,
  createComment,
  newCommentLine,
  setNewCommentLine,
  newCommentSeverity,
  setNewCommentSeverity,
  newCommentContent,
  setNewCommentContent
}) {
  const comments = commentsBySubmission[submission.id];

  const severityLabel = (val) => {
    const n = Number(val);
    return ['Info', 'Warning', 'Error'][n] ?? val;
  };

  return (
    <>
      {comments ? (
        comments.length ? (
          <ul className="list-group mb-3">
            {comments.map((c) => (
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
            <input
              type="number"
              className="form-control"
              value={newCommentLine}
              min={1}
              onChange={(e) => setNewCommentLine(e.target.value)}
              placeholder="Line #"
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={newCommentSeverity}
              onChange={(e) => setNewCommentSeverity(Number(e.target.value))}
            >
              <option value={0}>Info</option>
              <option value={1}>Warning</option>
              <option value={2}>Error</option>
            </select>
          </div>
          <div className="col-md-6">
            <textarea
              className="form-control"
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              rows={2}
              placeholder="Comment"
            />
          </div>
          <div className="col-12 d-grid">
            <button className="btn btn-success" onClick={() => createComment(submission.id)}>
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommentReviews;