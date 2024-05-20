import React from 'react';

const Technicien = ({ technicien }) => {
  return (
    <li>
      <strong>Nom :</strong> {technicien.name}, <strong>Email :</strong> {technicien.email}
    </li>
  );
};

export default Technicien;
