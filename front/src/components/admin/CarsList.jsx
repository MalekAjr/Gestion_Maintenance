import React, { useState, useEffect } from 'react';
import CarsItem from './CarsItem';
import adminService from '../../services/adminService';
import withAuthorization from '../authorization/withAuthorization';

const CarsList = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Fetch cars from the backend when the component mounts
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await adminService.getCars();
      if (response.data.success === true) {
        setCars(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  return (
    <div>
      <h2>List of Cars</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <CarsItem key={car._id} car={car} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(CarsList);
