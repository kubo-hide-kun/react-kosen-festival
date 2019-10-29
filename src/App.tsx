import React from 'react';
import * as BootStrap from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import Env from "./firebase"

const App: React.FC = () => {

  const login = React.useCallback(() => {
      Env.instance.firebase
        .auth()
        .getRedirectResult()
        .then(result => {console.log(result)})
        .catch(error => {console.log(error)});
    },[]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <BootStrap.Button onClick={login}>
          login
        </BootStrap.Button>
      </header>
    </div>
  );
}

export default App;
