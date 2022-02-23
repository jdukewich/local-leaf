import styled from "styled-components";
import { Row, Col } from "./shared";

const Title = styled(Col)`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NavRow = styled(Row)`
  max-height: 5%;
  color: #ffffff;
  background-color: #1e2530;
`;

function Navbar() {
  return (
    <NavRow>
      <Col />
      <Title>
        <h2>Local Leaf</h2>
      </Title>
      <Col />
    </NavRow>
  );
}

export default Navbar;
