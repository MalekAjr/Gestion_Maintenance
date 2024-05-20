import React from 'react';

const User = ({ user }) => {
  return (
    <li>
      <strong>Nom :</strong> {user.name}, <strong>Email :</strong> {user.email}
    </li>
  );
};

export default User;
