import React, { useState } from 'react';
import './AddCandidateForm.css'; // Optional

const AddCandidateForm = ({ addCandidate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cv, setCv] = useState(null);
  const [offer, setOffer] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (fullName && email && cv && offer) {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("cv", cv);
      formData.append("offer", offer);

      addCandidate(formData);

      setFullName('');
      setEmail('');
      setCv(null);
      setOffer(null)
      event.target.reset();
    }
  };

  return (
    <form className="candidate-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Hamza Fatnaoui"
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. hamzafatnaoui@gmail.com"
          required
        />
      </div>

      <div className="form-group">
        <label>Resume (PDF or DOCx)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setCv(e.target.files[0])}
          required
        />
      </div>

      <div className="form-group">
        <label>Offer (PDF or DOCx)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setOffer(e.target.files[0])}
          required
        />
      </div>

      <button type="submit">📤 Submit Candidate</button>
    </form>
  );
};

export default AddCandidateForm;