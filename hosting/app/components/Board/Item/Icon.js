import styled from 'styled-components';

const Component = styled.i.attrs({ className: 'material-icons' })`
  &:hover {
    background-color: #00000010;
    border-radius: 2rem;
    color: ${props => props.hover};
    cursor: pointer;
  }
`;

export default Component;
