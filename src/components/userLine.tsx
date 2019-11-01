import React, {useState} from 'react';
import styled from 'styled-components';

type Props = {
    name: string;
    pt: number;
    updateUserData: (name: string, pt: number) => void
    isSigned: boolean
}

const UserLine: React.FC<Props> = (props:Props) => {

    const [addPt, setAddPt] = useState(0);

    return (
        <div>
        <YLine>
            {props.name} => {props.pt}pt 
        </YLine>
        {props.isSigned && [
            <YInput type="number" onChange={e => setAddPt(parseInt(e.target.value))}/>,
            <YButton onClick={() => props.updateUserData(props.name,props.pt+addPt)}>+</YButton>
        ]
        }
        </div>
    )
}

export default UserLine;

const YLine = styled.div`
  background: black;
  color: white;
  font-family: 'Impact';
  margin: 5px 2px;
  padding: 10px;
`;

const YInput = styled.input`
  padding: 10px;
  margin: 5px 2px;
  border-color: black;
`;

const YButton = styled.button`
font-family: 'Impact';
`;