import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntAppProvider } from 'antd'; // Import the provider
import 'antd/dist/reset.css';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AntAppProvider> {/* <-- Wrap your App component here */}
      <App />
    </AntAppProvider>
  </React.StrictMode>,
);