import React, { useEffect, useState } from 'react';
import AddCandidateForm from './AddCandidateForm';
import api from '../api';


const CandidateList = () => {
  
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidates');
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error("Error fetching candidates", error);
    }
  };

  const addCandidate = async (candidateName) => {
    try {
      await api.post('/candidate', {full_name: candidateName});
      fetchCandidates();  // Refresh the list after adding a candidate
    } catch (error) {
      console.error("Error adding candidate", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div>
      <h2>Candidates List</h2>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>{candidate.full_name}</li>
        ))}
      </ul>
      <AddCandidateForm addCandidate={addCandidate} />
    </div>
  );
};

export default CandidateList;