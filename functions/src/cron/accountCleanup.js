const auth = require('../auth.js');

module.exports = async () => {
  const inactiveUsers = await getInactiveUsers();
  for (let i = 0; i < inactiveUsers.length; i += 1) {
    deleteInactiveUser(inactiveUsers);
  }
  // eslint-disable-next-line no-console
  console.log('User cleanup finished');
};

function deleteInactiveUser(inactiveUsers) {
  if (inactiveUsers.length > 0) {
    const userToDelete = inactiveUsers.pop();
    return auth
      .deleteUser(userToDelete.uid)
      .then(() =>
        // eslint-disable-next-line no-console
        console.log(
          'Deleted user account',
          userToDelete.uid,
          'because of inactivity',
        ),
      )
      .catch(error =>
        // eslint-disable-next-line no-console
        console.error(
          'Deletion of inactive user account',
          userToDelete.uid,
          'failed:',
          error,
        ),
      );
  }
  return null;
}

async function getInactiveUsers(users = [], nextPageToken) {
  const result = await auth.listUsers(1000, nextPageToken);
  const inactiveUsers = result.users.filter(
    user =>
      Date.parse(user.metadata.lastSignInTime) < Date.now() - 14 * 86400000,
  );
  // eslint-disable-next-line no-param-reassign
  users = users.concat(inactiveUsers);
  if (result.pageToken) {
    return getInactiveUsers(users, result.pageToken);
  }
  return users;
}
