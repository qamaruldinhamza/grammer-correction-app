import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MainPage() {
  const [text, setText] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleCheckGrammar = async () => {
    setLoading(true);
    setError("");
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/grammar",
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      let correctedText = response.data.correctedText.split(':')[1]?.trim() || "No corrections made.";
      let highlightedHTML = response.data.highlightedText.split(':')[1]?.trim() || "No highlights available.";

      correctedText = correctedText.replace(/^"(.*)"$/, "$1");  
      highlightedHTML = highlightedHTML.replace(/^"(.*)"$/, "$1");
  
  
      setText(correctedText); 
      setHighlightedText(highlightedHTML); 
      setCorrectedText(correctedText); 
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Grammar check failed";
      setError(errorMessage);
  
      if (err.response?.status === 401 || err.response?.status === 400) {
        localStorage.removeItem("token"); 
        navigate("/", { state: { sessionExpired: true } }); 
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-end">
        <button className="btn btn-danger mb-3" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Grammar Correction</h2>
              {error && <p className="text-danger text-center">{error}</p>}

              {correctedText && (
                <div className="mb-4">
                  <h3 className="text-center">Corrected Text</h3>
                  <p className="p-3 bg-light border rounded">{correctedText}</p>
                </div>
              )}

              {highlightedText && (
                <div className="mb-4">
                  <h3 className="text-center">Output</h3>
                  <p
                    className="p-3 bg-light border rounded"
                    dangerouslySetInnerHTML={{ __html: highlightedText }} 
                  ></p>
                </div>
              )}

              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Enter text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows="8"
                ></textarea>
              </div>

              <div className="d-grid">
                <button
                  className="btn btn-primary"
                  onClick={handleCheckGrammar}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Check Grammar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;