import React, {useState} from 'react';
import styled from 'styled-components';

type Props = {
    index: number
    name: string;
    pt: number;
    updateUserData: (name: string, pt: number) => void;
    deleteUserData: (name: string) => void;
    isSigned: boolean;
}

const UserLine: React.FC<Props> = (props:Props) => {

    const [addPt, setAddPt] = useState(0);

    return (
    <div>
        <div>
            <Ynum>
                {props.index+1} 
            </Ynum>
            <YLine>
                {props.name}
            </YLine>
            <Ypt>
              {props.pt}pt 
            </Ypt>
        </div>
        {props.isSigned && [
            <YInput type="number" onChange={e => setAddPt(parseInt(e.target.value))}/>,
            <YButton onClick={() => props.updateUserData(props.name,props.pt+addPt)}>+</YButton>,
            <YButton onClick={() => props.deleteUserData(props.name)}>x</YButton>
        ]}
    </div>)
}

export default UserLine;

const Ynum = styled.div`
  display: inline-block;
  background: black;
  color: white;
  font-family: 'Impact';
  margin: 5px 2px;
  padding: 10px;
  width: 10%;
`;

const YLine = styled.div`
  display: inline-block;
  background: black;
  color: white;
  font-family: 'Impact';
  margin: 5px 2px;
  padding: 10px;
  width: 45%;
`;

const Ypt = styled.div`
  display: inline-block;
  background: black;
  color: white;
  font-family: 'Impact';
  margin: 5px 2px;
  padding: 10px;
  width: 15%;
`;

const YInput = styled.input`
  padding: 10px;
  margin: 5px 2px;
  border-color: black;
`;

const YButton = styled.button`
    font-family: 'Impact';
`;
