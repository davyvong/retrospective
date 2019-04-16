import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Home';

export default defineMessages({
  create: {
    id: `${scope}.create`,
    defaultMessage: 'Create a board',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Retrospective',
  },
});
