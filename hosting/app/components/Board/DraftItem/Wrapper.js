import styled from 'styled-components';

import { ITEM_COLORS } from 'constants/colors';

const Component = styled.div`
  background-color: ${ITEM_COLORS.GREY};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  margin: 0.75rem 0 1rem 0;
  padding: 1rem;
  width: 100%;

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
  }

  & > *:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;

export default Component;
