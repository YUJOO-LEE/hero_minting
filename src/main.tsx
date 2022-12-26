import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

const getLibrary = (provider: any) => {
  console.log('[getLibrary] provider', provider);
  return new Web3Provider(provider);
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
);