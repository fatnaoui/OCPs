import React from 'react';
import './App.css';
import CandidateList from './components/Candidates';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="animated-title">
          Apply to Join <span className="highlight">Our Team</span> 🚀
        </h1>
        <p className="subtitle">Submit your resume and we’ll <span class="highlight-sub">get in touch</span>!</p>
      </header>
      <main>
        <CandidateList />
      </main>
    </div>
  );
};

export default App;