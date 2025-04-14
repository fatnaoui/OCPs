import React, { useEffect, useState } from 'react';
import AddCandidateForm from './AddCandidateForm';
import api from '../api';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 👈 Add loading state

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidates');
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error("Error fetching candidates", error);
    }
  };

  const addCandidate = async (formData) => {
    try {
      await api.post('/candidate', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      fetchCandidates();
    } catch (error) {
      console.error("Error adding candidate", error);
    }
  };

  const fetchScores = async () => {
    setIsLoading(true); // 👈 Start loader
    try {
      const response = await api.get('/scores');
      setScores(response.data.scores);
    } catch (error) {
      console.error("Error fetching scores", error);
    }
    setIsLoading(false); // 👈 Stop loader
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div>
      <AddCandidateForm addCandidate={addCandidate} />

      <div style={{ marginTop: '2rem' }}>
        <button onClick={fetchScores}>📊 View All Scores</button>
      </div>

      {/* ✅ Loading indicator */}
      {isLoading && (
        <div className="analyzing-loader">
          <span className="dot-flash">⚙️ Analyzing your resume vs offer</span>
        </div>
      )}

      {/* ✅ Scores */}
      {scores.length > 0 && !isLoading && (
        <div className="score-container">
          <h3 className="score-title">📈 Match Scores</h3>
          <div className="score-list">
            {scores.map((scoreText, index) => (
              <div className="score-item" key={index}>
                🧾 {scoreText}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateList;
