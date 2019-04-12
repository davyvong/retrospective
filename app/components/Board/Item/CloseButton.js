import styled from 'styled-components';

const Component = styled.i.attrs({ className: 'material-icons' })`
  background-color: #4a4a4a;
  border-radius: 14px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  opacity: 1 !important;
  position: absolute;
  right: -10px;
  text-align: center;
  top: -10px;
  visibility: visible !important;
  width: 28px;

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
    cursor: pointer;
  }
`;

export default Component;
