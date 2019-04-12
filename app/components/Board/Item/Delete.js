import styled from 'styled-components';

import { COLORS } from 'constants/colors';

const Component = styled.i.attrs({ className: 'material-icons' })`
  background-color: ${COLORS.RED};
  border-radius: 14px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  height: 28px;
  justify-content: center;
  position: absolute;
  right: -10px;
  text-align: center;
  top: -10px;
  transition: visibility 0s, opacity 0.3s linear;
  width: 28px;
`;

export default Component;
