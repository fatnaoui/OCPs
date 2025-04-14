import React from 'react';
import './App.css';
import CandidateList from './components/Candidates';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Candidate Management App</h1>
      </header>
      <main>
        <CandidateList />
      </main>
    </div>
  );
};

export default App;