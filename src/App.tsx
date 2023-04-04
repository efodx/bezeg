import React from 'react';
import logo from './logo.svg';
import './App.css';

import { JSXGraph } from "jsxgraph";
import Graph from "./graphs/Graph";
import GraphSubdivision from "./graphs/GraphSubdivision";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Graph/>
          <GraphSubdivision/>
      </header>
    </div>
  );
}

export default App;
