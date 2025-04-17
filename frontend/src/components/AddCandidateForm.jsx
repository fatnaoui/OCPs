import React, { useState } from 'react';
import './AddCandidateForm.css'; 

const AddCandidateForm = ({ addCandidate }) => {
  const [cvFiles, setCvFiles] = useState([]);
  const [offer, setOffer] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cvFiles.length > 0 && offer) {
      const formData = new FormData();

      formData.append("offer", offer);
      cvFiles.forEach((file) => {
        formData.append("cvs", file);
      });

      addCandidate(formData);

      setCvFiles([]);
      setOffer(null);
      event.target.reset();
    }
  };

  return (
    <form className="candidate-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="form-group">
        <label>Upload Job Offer (PDF/DOCX)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setOffer(e.target.files[0])}
          required
        />
      </div>

      <div className="form-group">
        <label>Select Folder with Candidate Resumes</label>
        <input
          type="file"
          webkitdirectory="true"
          directory=""
          multiple
          accept=".pdf,.docx"
          onChange={(e) => setCvFiles(Array.from(e.target.files))}
          required
        />
        {/* <small>You can upload an entire folder of resumes</small> */}
      </div>

      <button type="submit">📊 Score All Candidates</button>
    </form>
  );
};

export default AddCandidateForm;

