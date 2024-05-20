import React from 'react';
import adminService from '../../services/adminService';

const CarsItem = ({ car }) => {

  return (
    <tr>
      <td>{car.matricule}</td>
      <td>{car.brand}</td>
      <td>{car.model}</td>
      <td>{car.year}</td>
      <td>{car.color}</td>
      </tr>
  );
};

export default CarsItem;
