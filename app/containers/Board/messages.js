import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Board';

export default defineMessages({
  commentMessage: {
    id: `${scope}.commentMessage`,
    defaultMessage: 'Type a comment',
  },
  groupName: {
    id: `${scope}.groupName`,
    defaultMessage: 'Type a column name',
  },
  itemMessage: {
    id: `${scope}.itemMessage`,
    defaultMessage: 'Type a message',
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
