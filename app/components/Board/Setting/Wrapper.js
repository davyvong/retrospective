import styled from 'styled-components';

import { ITEM_COLORS } from 'constants/colors';

const Component = styled.div`
  align-items: center;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  padding: 0.25rem 0.75rem;
  position: relative;

  &:hover {
    background-color: #00000010;
  }
`;

Component.defaultProps = {
  color: ITEM_COLORS.GREY,
};

export default Component;
