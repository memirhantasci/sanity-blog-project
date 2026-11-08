import React from 'react';
import './index.css'; // <-- Bu satırın orada olması ve Tailwind direktiflerini içermesi şart
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);