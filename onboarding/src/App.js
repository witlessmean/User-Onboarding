import React from 'react';
import { createGlobalStyle } from 'styled-components'
import Form from './Form'

const GlobalStyle = createGlobalStyle`
body {
  background-color: #eae7dc;
}`

function App() {
  return (
   <div>
    <GlobalStyle />
    <Form />
    </div>
    
    );
}

export default App;
