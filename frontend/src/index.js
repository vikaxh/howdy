import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react'

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ChatProvider from './context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Router>
<ChatProvider>
   <ChakraProvider>
    <App />
   </ChakraProvider>
</ChatProvider>
 </Router>
  
);

reportWebVitals();
