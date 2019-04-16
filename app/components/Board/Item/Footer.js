import styled from 'styled-components';

const Component = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 0.9em;
  position: relative;

  & > div:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export default Component;
