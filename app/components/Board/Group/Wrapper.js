import styled from 'styled-components';

const Component = styled.div`
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0.75rem;

  & > *:last-child {
    margin-top: 0.75rem;
  }
`;

export default Component;
