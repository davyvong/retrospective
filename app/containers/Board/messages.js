import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Board';

export default defineMessages({
  context: {
    id: `${scope}.context`,
    defaultMessage: 'Meeting Context',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Board Name',
  },
});
