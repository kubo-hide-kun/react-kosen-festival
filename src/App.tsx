import React,{useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import Loading from './components/Loading'
import UserLine from './components/userLine';
import './App.css';
import Env from "./firebase"

const App: React.FC = () => {

  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [passwd, setPasswd] = useState<string>('');

  const [user, setUser] = useState<string>('dummy_user');
  const [userList, setUserList] = useState<{name:string, pt:number}[]>([]);
  const [reanderList, setReanderList] = useState<JSX.Element[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log(userList,"1.")
    setReanderList(userList.map((user,index) => (
      <UserLine
        deleteUserData={deleteUserData}
        index={index}
        name={user.name}
        pt={user.pt}
        updateUserData={updateUserData}
        isSigned={isSigned}
      />
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
    setIsSigned(passwd == 'inuadmin');
    setUser('');
    setPasswd('');
    console.log(user);
    console.log(passwd);
    getAllUserData();
  },[passwd]);

  const deleteUserData = useCallback((name:string)=>{
    setIsLoading(true);
    Env.instance.firestore
      .collection("users")
      .doc(name)
      .delete()
      .then(() => {
        console.log("Success: Document has written");
        getAllUserData();
        setIsLoading(false);
      }).catch(error => {
        console.log("Error writing document: "+ error)
        setIsLoading(true);
      });
  },[])

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

  const sortList = useCallback(()=>{
    console.log(
      userList.sort((a,b) => {
        if(a.pt == b.pt)return 0;
        return a.pt < b.pt ? 1 : -1;
    }))
    setUserList(
      userList.sort((a,b) => {
        if(a.pt == b.pt)return 0;
        return a.pt < b.pt ? 1 : -1;
      })
    );
    setReanderList(userList.map((user,index) => (
      <UserLine
        index={index}
        name={user.name}
        pt={user.pt}
        updateUserData={updateUserData}
        deleteUserData={deleteUserData}
        isSigned={isSigned}
      />
    )))
  },[userList])

  const retireAdmin = useCallback(()=>{
    setIsSigned(false);
    getAllUserData();
  },[]);

  return (
    <MainBack>
      {isLoading && <Loading />}
      <p>
        KOSEN FESTIVAL IN 4th INFORMATION
      </p>
      {
        isSigned
        ?[
          <YInput
            type="text"
            name="user"
            placeholder="追加するユーザーを入力"
            onChange={e => setUser(e.target.value)}
          />,
          <YButton onClick={insertUserData}>insert</YButton>
        ]:[
          <p></p>,
          <YInput
            type="password"
            name="passwd"
            placeholder="パスワードを入力"
            onChange={e => setPasswd(e.target.value)}
          />,
          <YButton onClick={unlockAdmin}>admin</YButton>
        ]
      }

      <div>
      <YButton onClick={login}>
        login
      </YButton>

      <YButton onClick={sortList}>
        sort
      </YButton>

      <YButton onClick={getAllUserData}>
        reload
      </YButton>
      {isSigned && <YButton onClick={retireAdmin}>retire</YButton>}
      </div>
      {reanderList}
    </MainBack>
  );
}
const MainBack = styled.div`
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: yellow
  z-index: 250
  font-family: 'arial black'	
`;

const YButton = styled.button`
  background: black;
  color: white;
  font-family: 'Impact';
  margin: 2px;
  padding: 10px;
  width: 20%;
`;

const YInput = styled.input`
  padding: 10px;
  margin: 5px 2px;
  border-color: black;
  width: 60%;
`;

export default App;
