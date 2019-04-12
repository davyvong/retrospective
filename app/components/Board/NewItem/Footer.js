import styled from 'styled-components';

const Component = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 0.9em;
  margin: 0 -0.5rem;
  position: relative;

  & > div:not(:last-child) {
    margin-right: 0.75rem;
  }
`;

export default Component;
