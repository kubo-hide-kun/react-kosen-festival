import React from 'react';
import styled from 'styled-components';
const Loading: React.FC = () => {
  return <LoadingBack />;
}

const LoadingBack = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
`;

export default Loading;