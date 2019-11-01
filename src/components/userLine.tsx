import React, {useState} from 'react';

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
            {props.name} => {props.pt}pt 
            {
                props.isSigned && [
                    <input type="number" onChange={e => setAddPt(parseInt(e.target.value))}/>,
                    <button onClick={() => props.updateUserData(props.name,props.pt+addPt)}>+</button>
                ]
            }
        </div>
    )
}

export default UserLine;