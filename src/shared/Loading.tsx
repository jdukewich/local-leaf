import styled, { keyframes } from 'styled-components';

const animation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`;
const Spinner = styled.div`
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    animation-name: ${animation};
    animation-duration: 1s;
    animation-iteration-count: infinite;

    div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 64px;
        height: 64px;
        margin: 8px;
        border: 8px solid #000000;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #000000 transparent transparent transparent;
    }

    div:nth-child(1) {
        animation-delay: -0.45s;
    }

    div:nth-child(2) {
        animation-delay: -0.3s;
    }

    div:nth-child(3) {
        animation-delay: -0.15s;
    }
`;
function Loading() {
  return (
    <Spinner>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </Spinner>
  );
}
  
export default Loading;


