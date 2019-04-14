import styled from 'styled-components';

import { COLORS } from 'constants/colors';

const Component = styled.i.attrs({ className: 'material-icons' })`
  background-color: ${COLORS.BLUE};
  border-radius: 14px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  margin: 0.25rem 0rem 0.25rem 0.75rem;
  text-align: center;
  transition: visibility 0s, opacity 0.3s linear;
  width: 28px;

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
    cursor: pointer;
  }
`;

export default Component;
