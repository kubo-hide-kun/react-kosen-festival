import React,{useState, useEffect, useCallback} from 'react';
import './App.css';
import Env from "./firebase"

const App: React.FC = () => {

  const [isSignin, setIsSignin] = useState<boolean>(false);
  const [passwd, setPasswd] = useState<string>('');

  const [user, setUser] = useState<string>('dummy_user');
  const [userList, setUserList] = useState<{name:string, pt:number}[]>([]);
  const [reanderList, setReanderList] = useState<JSX.Element[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log(userList)
    setReanderList(userList.map(user => (
      <li>
        {user.name} => {user.pt}pt 
        <input type="number" />
        <button onClick={() => updateUserData(user.name,user.pt+100)}>+</button>
      </li>
      )
    ));
  }, [userList]);

  const login = useCallback(() => {
    setIsLoading(true);
    Env.instance.firebase
      .auth()
      .signInWithPopup(Env.instance.providerGoogle)
      .then(result => {
        console.log(result);
        setIsLoading(false);
      }).catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  },[]);

  const unlockAdmin = useCallback(() => {
    setIsSignin(passwd == 'inu0903');
  },[passwd]);

  const updateUserData = useCallback((name:string, pt:number)=>{
    setIsLoading(true);
    console.log('Start update =>',name,pt)
    Env.instance.firestore
      .collection("users")
      .doc(name)
      .update({ pt:pt })
      .then(() => {
        console.log("Success: Document has written");
        getAllUserData();
        setIsLoading(false);
      }).catch(error => {
        console.log("Error writing document: "+ error)
        setIsLoading(true);
      });
  },[])

  const insertUserData = useCallback(()=>{
    setIsLoading(true);
    console.log('Start posting =>',user)
    Env.instance.firestore
      .collection("users")
      .doc(user)
      .set({ pt:0 })
      .then(() => {
        console.log("Success: Document has written");
        getAllUserData();
        setIsLoading(false);
      })
      .catch(error => {
        console.log("Error writing document: "+ error);
        setIsLoading(false);
      });
  },[user])

  const getAllUserData = useCallback(()=>{
    setIsLoading(true);
    Env.instance.firestore
      .collection("users")
      .get()
      .then(result => {
        setUserList(
          result.docs.map(doc => {
            return {name:doc.id,pt:doc.data().pt}
          })
        );
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      })
  },[])

  return (
    <div>
      {isLoading && <p>test</p>}
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      {
        isSignin
        ?[
          <input type="text" name="name" onChange={e => setUser(e.target.value)}/>,
          <button onClick={insertUserData}>insert</button>
        ]:[
          <input type="password" name="name" onChange={e => setPasswd(e.target.value)}/>,
          <button onClick={unlockAdmin}>go to admin</button>
        ]
      }

      <div>
      <button onClick={login}>
        login
      </button>

      <button onClick={getAllUserData}>
        get user list
      </button>
      </div>
      <ul>
        {reanderList}
      </ul>
    </div>
  );
}

export default App;
