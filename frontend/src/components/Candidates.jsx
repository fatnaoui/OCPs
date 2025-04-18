import React, { useEffect, useState } from 'react';
import AddCandidateForm from './AddCandidateForm';
import api from '../api';

const OfferList = () => {
  const [offers, setOffers] = useState([]);
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOffers = async () => {
    try {
      const response = await api.get('/offers'); // updated route
      setOffers(response.data.offers);
    } catch (error) {
      console.error("Error fetching offers", error);
    }
  };

  const addOffer = async (formData) => {
    try {
      await api.post('/', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      fetchOffers();
    } catch (error) {
      console.error("Error adding offer", error);
    }
  };

  const fetchScores = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/scores');
      setScores(response.data);
    } catch (error) {
      console.error("Error fetching scores", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

//   return (
//     <div>
//       <AddCandidateForm addCandidate={addOffer} /> {/* keeping form name unchanged */}

//       <div style={{ marginTop: '2rem' }}>
//         <button onClick={fetchScores}>📊 View All Scores</button>
//       </div>

//       {isLoading && (
//         <div className="analyzing-loader">
//           <span className="dot-flash">⚙️ Analyzing</span>
//         </div>
//       )}

//       {scores.length > 0 && !isLoading && (
//         <div className="score-container">
//           <h3 className="score-title">📈 Match Scores</h3>
//           <div className="score-list">
//             {scores.map((scoreText, index) => (
//               <div className="score-item" key={index}>
//                 🧾 {scoreText}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
   
//       </div> 
//   );
// };

return (
  <div>
    <AddCandidateForm addCandidate={addOffer} /> {/* keeping form name unchanged */}

    <div style={{ marginTop: '2rem' }}>
      <button onClick={fetchScores}>📊 View All Scores</button>
    </div>

    {isLoading && (
      <div className="analyzing-loader">
        <span className="dot-flash">⚙️ Analyzing</span>
      </div>
    )}

    {scores.length > 0 && !isLoading && (
      <div className="score-container">
        <h3 className="score-title">📈 Match Scores</h3>
        <div className="score-list">
          {scores.map((scoreObj, index) => (
            <div className="score-item" key={index}>
              <div><strong>{scoreObj.candidate_name}</strong>: <span>{scoreObj.score}</span></div>
              {scoreObj.data && (
                <div style={{ fontSize: '0.95em', marginTop: 4 }}>
                  <div><b>Skills:</b> {scoreObj.data.skills && Array.isArray(scoreObj.data.skills) ? scoreObj.data.skills.join(', ') : ''}</div>
                  <div><b>Experience:</b> {scoreObj.data.experience && Array.isArray(scoreObj.data.experience) ? scoreObj.data.experience.join('; ') : ''}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
};

export default OfferList;
