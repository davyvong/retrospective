import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Board';

export default defineMessages({
  groupName: {
    id: `${scope}.groupName`,
    defaultMessage: 'Type a column name',
  },
  itemMessage: {
    id: `${scope}.itemMessage`,
    defaultMessage: 'Type a message here',
  },
  subtitle: {
    id: `${scope}.subtitle`,
    defaultMessage: 'Description',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Board Name',
  },
});
