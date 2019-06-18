import { defineMessages } from 'react-intl';

export const scope = 'app.containers.NotFound';

export default defineMessages({
  description: {
    id: `${scope}.description`,
    defaultMessage: 'The page you requested does not exist.',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Not Found',
  },
});
