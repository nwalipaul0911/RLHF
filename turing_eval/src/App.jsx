import React from 'react';
import ModelReview from './ModelReview';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Response Evaluation</h1>
      <div className="grid-container">
        <div className="model-section">
          <h2>Model A</h2>
          <ModelReview modelName="Model A" />
        </div>
        <div className="model-section">
          <h2>Model B</h2>
          <ModelReview modelName="Model B" />
        </div>
      </div>
    </div>
  );
}

export default App;

