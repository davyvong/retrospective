import styled from 'styled-components';

const Component = styled.button`
  background-color: #dfe6e980;
  border-radius: 6px;
  font-size: 1em;
  margin-top: 1.5rem;
  padding: 0.5rem;
  text-align: center;
  width: 100%;

  &:focus {
    outline: none;
  }

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
    cursor: pointer;
  }
`;

export default Component;
