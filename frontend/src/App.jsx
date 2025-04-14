import React from 'react';
import './App.css';
import CandidateList from './components/Candidates';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="animated-title">
          {/* Apply to Join <span className="highlight">Our Team</span> 🚀 */}
          Is Your Resume <span class="highlight">the Right Match</span>? 🎯
        </h1>
        {/* <p className="subtitle">Submit your resume and we’ll <span class="highlight-sub">get in touch</span>!</p> */}
        <p className="subtitle">Upload your CV and the job offer to find out how well you fit — <span class="highlight-sub">get a score instantly!</span>!</p>

      </header>
      <main>
        <CandidateList />
      </main>
    </div>
  );
};

export default App;