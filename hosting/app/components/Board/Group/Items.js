import styled from 'styled-components';

const Component = styled.div`
  & > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

export default Component;
