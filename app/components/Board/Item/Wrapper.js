import styled from 'styled-components';

import { ITEM_COLORS } from 'constants/colors';

const Component = styled.div`
  background-color: ${props => props.color};
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  min-width: 375px;
  padding: 1rem;
  position: relative;

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
  }
`;

Component.defaultProps = {
  color: ITEM_COLORS.GREY,
};

export default Component;
