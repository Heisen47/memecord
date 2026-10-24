import React from 'react';
import ReactDOM from 'react-dom/client';
// Load the camera compositor so the Test Lab works without the extension installed
import '../content/inject';
import { TestLab } from './TestLab';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <TestLab />
    </React.StrictMode>
  );
}
