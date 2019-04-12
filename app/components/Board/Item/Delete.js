import styled from 'styled-components';

import { COLORS } from 'constants/colors';

const Component = styled.i.attrs({ className: 'material-icons' })`
  background-color: ${COLORS.RED};
  border-radius: 12px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  height: 24px;
  justify-content: center;
  position: absolute;
  right: -10px;
  text-align: center;
  top: -10px;
  transition: visibility 0s, opacity 0.3s linear;
  width: 24px;
`;

export default Component;
