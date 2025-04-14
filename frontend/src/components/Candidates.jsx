// import React, { useEffect, useState } from 'react';
// import AddCandidateForm from './AddCandidateForm';
// import api from '../api';


// const CandidateList = () => {
  
//   const [candidates, setCandidates] = useState([]);

//   const fetchCandidates = async () => {
//     try {
//       const response = await api.get('/candidates');
//       setCandidates(response.data.candidates);
//     } catch (error) {
//       console.error("Error fetching candidates", error);
//     }
//   };

//   const addCandidate = async (formData) => {
//     try {
//       await api.post('/candidate', formData, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       fetchCandidates();
//     } catch (error) {
//       console.error("Error adding candidate", error);
//     }
//   };

//   useEffect(() => {
//     fetchCandidates();
//   }, []);

//   return (
//     <div>
//       <AddCandidateForm addCandidate={addCandidate} />
//     </div>
//   );
// };

// export default CandidateList;


import React, { useEffect, useState } from 'react';
import AddCandidateForm from './AddCandidateForm';
import api from '../api';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [scores, setScores] = useState([]);

  // Fetch the list of candidates
  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidates');
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error("Error fetching candidates", error);
    }
  };

  // Add a new candidate
  const addCandidate = async (formData) => {
    try {
      await api.post('/candidate', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      fetchCandidates(); // Refresh list
    } catch (error) {
      console.error("Error adding candidate", error);
    }
  };

  // Fetch score results from backend
  const fetchScores = async () => {
    try {
      const response = await api.get('/scores');
      setScores(response.data.scores); // Array of strings
    } catch (error) {
      console.error("Error fetching scores", error);
    }
  };

  // Load candidates on component mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div>
      <AddCandidateForm addCandidate={addCandidate} />

      <div style={{ marginTop: '2rem' }}>
        <button onClick={fetchScores}>📊 View All Scores</button>
      </div>

      {scores.length > 0 && (
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
