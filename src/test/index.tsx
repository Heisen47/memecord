import React from 'react';
import ReactDOM from 'react-dom/client';
import { TestLab } from './TestLab';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <TestLab />
    </React.StrictMode>
  );
}
