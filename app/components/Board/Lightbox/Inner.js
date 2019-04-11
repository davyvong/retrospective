import styled from 'styled-components';

const Component = styled.div`
  background-color: ${props => props.color};
  border-radius: 6px;
  height: 100%;
  padding: 1.25rem 1.5rem;
  width: 100%;
`;

export default Component;
