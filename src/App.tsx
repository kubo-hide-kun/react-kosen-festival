import React,{useState, useEffect, useCallback} from 'react';
import * as BootStrap from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import Env from "./firebase"

const App: React.FC = () => {

  const [user, setUser] = useState<string>('dummy_user');
  const [userList, setUserList] = useState<{name:string, pt:number}[]>([]);
  const [reanderList, setReanderList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    console.log(userList)
    setReanderList(userList.map(user => {
      return <li>{user.name} || {user.pt}</li>
    }));
  }, [userList]);

  const login = useCallback(() => {
    Env.instance.firebase
      .auth()
      .signInWithPopup(Env.instance.providerGoogle)
      .then(result => console.log(result))
      .catch(error => console.log(error));
  },[]);

  const insertUserData = useCallback(()=>{
    console.log('Start posting',user)
    Env.instance.firestore
      .collection("users")
      .doc(user)
      .set({ pt:0 })
      .then(() => {
        console.log("Success: Document has written");
        getAllUserData();
      })
      .catch(error => console.log("Error writing document: "+ error));
  },[user])

  const getAllUserData = useCallback(()=>{
    Env.instance.firestore
      .collection("users")
      .get()
      .then(result => {
        setUserList(result.docs.map(doc => {return {name:doc.id,pt:doc.data().pt}}));
      })
      .catch(error => console.log(error))
  },[])

  return (
    <div>
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <input type="text" name="name" onChange={e => setUser(e.target.value)}/>
      <BootStrap.Button onClick={insertUserData}>
        insert
      </BootStrap.Button>

      <div>
      <BootStrap.Button onClick={login}>
        login
      </BootStrap.Button>

      <BootStrap.Button onClick={getAllUserData}>
        get user list
      </BootStrap.Button>
      </div>
      <ul>
        {reanderList}
      </ul>
    </div>
  );
}

export default App;
