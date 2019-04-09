import styled from 'styled-components';

const Component = styled.div`
  height: ${props => props.size};
  margin: 0 auto;
  position: relative;
  width: ${props => props.size};
`;

export default Component;
