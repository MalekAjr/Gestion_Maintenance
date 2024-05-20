import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import CarItem from './CarItem';

const CarsList = ({ handleDropCar }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
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
      setCars([]);
    }
  };

  return (
    <div style={{ height: '300px', overflowY: 'auto' }} id="user-list">
      <h2>Liste Des Voitures</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-dark">
          <tr>
            <th>Matricule</th>
            <th>Brand</th>
           {/* <th>Model</th>
            <th>Year</th>
            <th>Color</th> */}
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <CarItem key={car._id} car={car} handleDropCar={handleDropCar} />
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default CarsList;
