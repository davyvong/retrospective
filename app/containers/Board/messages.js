import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Board';

export default defineMessages({
  subtitle: {
    id: `${scope}.subtitle`,
    defaultMessage: 'Description',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Board Name',
  },
});
