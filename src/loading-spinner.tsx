import "./loading-spinner.css"

// Covers the page's central column with a spinning wheel while a long task
// runs. It also blocks clicks (including Back) until the task finishes.
function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="spinner-overlay" role="status" aria-live="polite">
      <div className="spinner" />
      <div className="spinner-label">{label}</div>
    </div>
  );
}

export default LoadingSpinner;
