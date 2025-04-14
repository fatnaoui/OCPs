// import React, { useState } from 'react';

// const AddCandidateForm = ({ addCandidate }) => {
//   const [CandidateName, setCandidateName] = useState('');

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (CandidateName) {
//       addCandidate(CandidateName);
//       setCandidateName('');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={CandidateName}
//         onChange={(e) => setCandidateName(e.target.value)}
//         placeholder="Enter Candidate name"
//       />
//       <button type="submit">Add Candidate</button>
//     </form>
//   );
// };

// export default AddCandidateForm;

import React, { useState } from 'react';

const AddCandidateForm = ({ addCandidate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fullName && email) {
      addCandidate({ full_name: fullName, email: email }); // 👈 send both
      setFullName('');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Enter candidate's full name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter candidate's email"
      />
      <button type="submit">Add Candidate</button>
    </form>
  );
};

export default AddCandidateForm;