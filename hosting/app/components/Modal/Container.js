import styled from 'styled-components';

import { ITEM_COLORS } from 'constants/colors';

const Component = styled.div`
  background: ${ITEM_COLORS.GREY};
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
    0 1px 3px 1px rgba(60, 64, 67, 0.149);
  margin: 0 auto;
  padding: 1rem;
  position: relative;

  @media screen and (min-width: 760px) {
    max-width: 430px;
    width: 430px;
  }

  @media screen and (min-width: 1088px) {
    max-width: 480px;
    width: 480px;
  }

  @media screen and (min-width: 1280px) {
    max-width: 576px;
    width: 576px;
  }

  @media screen and (min-width: 1472px) {
    max-width: 672px;
    width: 672px;
  }
`;

export default Component;
