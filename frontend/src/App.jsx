import React from 'react';
import './App.css';
import OfferList from './components/Candidates';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="animated-title">
          Ready to Discover <span class="highlight">the Perfect Fit</span>? 🎯
        </h1>
        <p className="subtitle">Upload your job description and candidate CVs — <span class="highlight-sub">I’ll handle the scoring and show you who fits best 😉</span></p>
      </header>
      <main>
        <OfferList />
      </main>
    </div>
  );
};

export default App;