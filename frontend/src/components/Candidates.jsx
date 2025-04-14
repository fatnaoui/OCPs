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

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div>
      <AddCandidateForm addCandidate={addCandidate} />
    </div>
  );
};

export default CandidateList;