import "../styles/result.css";

const ScanResult = ({ result, loading, closeModal }) => {
  return (
    <div className="result-modal">
      <button className="close-btn" onClick={closeModal}>
        ✕
      </button>

      <h3>Scan Result</h3>

      {loading ? (
        <>
          <div className="spinner"></div>
          <p>Scanning chicken...</p>
        </>
      ) : result && result.top_results ? (
        <>
          <h4>Top 3 Chicken Breeds:</h4>
          {result.top_results.slice(0, 3).map((item) => (
            <div key={item.rank} className="result-item">
              <p>
                <strong>
                  #{item.rank} {item.breed}
                </strong>
              </p>
              <p>
                <strong>Confidence:</strong> {(item.confidence * 100).toFixed(2)}%
              </p>
            </div>
          ))}
        </>
      ) : result && result.error ? (
        <p style={{ color: "red" }}>Error: {result.error}</p>
      ) : (
        <p>No chicken detected in the image.</p>
      )}
    </div>
  );
};

export default ScanResult;
