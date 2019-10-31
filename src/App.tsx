import React from 'react';
import * as BootStrap from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import Env from "./firebase"

const App: React.FC = () => {

  const [user, setUser] = React.useState('dummy_user');
  const [userList, setUserList] = React.useState<{name:string, pt:number}[]>([]);

  React.useEffect(() => {
    console.log(userList)
  }, [userList])

  const login = React.useCallback(() => {
    Env.instance.firebase
      .auth()
      .signInWithPopup(Env.instance.providerGoogle)
      .then(result => console.log(result))
      .catch(error => console.log(error));
  },[]);

  const insertUserData = React.useCallback(()=>{
    Env.instance.firestore
      .collection("users")
      .doc(user)
      .set({ pt:0 })
      .then(() => alert("Success: Document has written"))
      .catch(error => alert("Error writing document: "+ error));
  },[])

  const getAllUserData = React.useCallback(()=>{
    Env.instance.firestore
      .collection("users")
      .get()
      .then(result => {
        setUserList(result.docs.map(doc => {return {name:doc.id,pt:doc.data().pt}}));
      })
      .catch(error => console.log(error))
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

        <BootStrap.Button onClick={getAllUserData}>
          get user list
        </BootStrap.Button>
      </header>
    </div>
  );
}

export default App;
