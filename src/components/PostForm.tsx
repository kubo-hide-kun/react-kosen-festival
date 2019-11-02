import React, {useState,useCallback} from 'react';
import Env from "../firebase"
import styled from 'styled-components';
import Loading from './Loading';
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';

const PostForm: React.FC = () => {
  const [syoyu, setSyoyu] = useState(0);
  const [miso, setMiso] = useState(0);
  const [tare, setTare] = useState(0);
  const [wiener, setWiener] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const postRequest = useCallback(()=>{
    let requestNo: number = 0;
    setIsLoading(true);
    Env.instance.firestore
      .collection("requests")
      .get()
      .then(result => {
        requestNo = result.docs.length;
        Env.instance.firestore
          .collection("requests")
          .doc((requestNo+1)+'')
          .set({
            time: new Date(),
            syoyu: syoyu,
            miso: miso,
            tare: tare,
            wiener: wiener
          })
          .then(() => {
            console.log("Success: Document has written")
            setIsLoading(false);
          })
          .catch(error => {
            console.log("Error writing document: "+ error)
            setIsLoading(false);
          });
      })
  },[syoyu,miso,tare,wiener]);

  return (
    <div>
      {isLoading && <Loading/>}
      <FormLine>
        <NameText>醤油味</NameText>
        <PtText>
          <ButtonGroup aria-label="small outlined button group">
            <Button onClick={()=>setSyoyu(syoyu+1)}>
              <ExposurePlus1Icon />
            </Button>
            <Button>
              <b>{syoyu}</b>
            </Button>
            <Button onClick={()=>setSyoyu(syoyu-1)}>
              <ExposureNeg1Icon />
            </Button>
          </ButtonGroup>
        </PtText>
      </FormLine>

      <FormLine>
        <NameText>みそ味</NameText>
        <PtText>
          <ButtonGroup aria-label="small outlined button group">
            <Button onClick={()=>setMiso(miso+1)}>
              <ExposurePlus1Icon />
            </Button>
            <Button>
              <b>{miso}</b>
            </Button>
            <Button onClick={()=>setMiso(miso-1)}>
              <ExposureNeg1Icon />
            </Button>
          </ButtonGroup>
        </PtText>
      </FormLine>


      <FormLine>
        <NameText>焼肉のタレ味</NameText>
        <PtText>
          <ButtonGroup aria-label="small outlined button group">
            <Button onClick={()=>setTare(tare+1)}>
              <ExposurePlus1Icon />
            </Button>
            <Button>
              <b>{tare}</b>
            </Button>
            <Button onClick={()=>setTare(tare-1)}>
              <ExposureNeg1Icon />
            </Button>
          </ButtonGroup>
        </PtText>
      </FormLine>

      <FormLine>
        <NameText>ウィンナー3本セット</NameText>
        <PtText>
          <ButtonGroup aria-label="small outlined button group">
            <Button onClick={()=>setWiener(wiener+1)}>
              <ExposurePlus1Icon />
            </Button>
            <Button>
              <b>{wiener}</b>
            </Button>
            <Button onClick={()=>setWiener(wiener-1)}>
              <ExposureNeg1Icon />
            </Button>
          </ButtonGroup>
        </PtText>
      </FormLine>
      <ButtonDiv onClick={postRequest}>
        test
      </ButtonDiv>
    </div>
  )
}

export default PostForm;

const FormLine = styled.div`
  padding: 10px;
`

const NameText = styled.div`
  display: inline-block;
  width: 55%;
`;

const PtText = styled.div`
  display: inline-block;
  width: 35%;
`;


const ButtonDiv = styled.button`
  background: black;
  color: white;
  font-family: 'Impact', sans-serif;
  margin: 2px;
  padding: 10px;
  margin-top: 20px;
  width: 20%;
`;
