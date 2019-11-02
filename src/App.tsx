import React,{useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import Loading from './components/Loading'
import UserLine from './components/userLine'
import PostForm from './components/PostForm'
import './App.css'
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

  useEffect(() => {
    getAllUserData();
  }, []);

  const unlockAdmin = useCallback(() => {
    setIsSigned(passwd == 'inuadmin');
    setUser('');
    setPasswd('');
    console.log(user);
    console.log(passwd);
    getAllUserData();
  },[passwd]);

  const deleteUserData = useCallback((name:string)=>{
    if(!window.confirm(name+"を削除しても良いですか?")) return;
    setIsLoading(true);
    Env.instance.firestore
      .collection("requests")
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
      .collection("requests")
      .doc(name)
      .update({ Time:new Date() })
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
      .collection("requests")
      .doc("user")
      .set({ Time:new Date() })
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
      .collection("requests")
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
      {isLoading && <Loading/>}
      <PostForm />
      <YButton onClick={insertUserData}>
        test
      </YButton>

      <YButton onClick={sortList}>
        sort
      </YButton>

      <YButton onClick={getAllUserData}>
        reload
      </YButton>
      {isSigned && <YButton onClick={retireAdmin}>retire</YButton>}
      {reanderList}
    </MainBack>
  );
}
const MainBack = styled.div`
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 250;
  font-family: 'arial black', sans-serif;
`;

const YButton = styled.button`
  background: black;
  color: white;
  font-family: 'Impact', sans-serif;
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
