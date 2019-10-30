import React from 'react';
import * as BootStrap from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import Env from "./firebase"

const App: React.FC = () => {

  const [user, setUser] = React.useState('dummy_user');

  const login = React.useCallback(() => {
    Env.instance.firebase
      .auth()
      .signInWithPopup(Env.instance.providerGoogle)
      .then(result => { 
        console.log("AC:");
        console.log(result);
      })
      .catch(error => {
        console.log("WA:");
        console.log(error);
      });
  },[]);

  const insertUserData = React.useCallback(()=>{
    Env.instance.firestore
      .collection("users")
      .doc(user)
      .set({ pt:0 })
      .then(() => alert("Success: Document has written"))
      .catch(error => alert("Error writing document: "+ error));
  },[])

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

        <BootStrap.Button onClick={insertUserData}>
          insert
        </BootStrap.Button>
      </header>
    </div>
  );
}

export default App;
