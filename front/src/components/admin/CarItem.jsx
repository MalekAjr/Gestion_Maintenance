import React from 'react';
import { useDrag } from 'react-dnd';

const CarItem = ({ car }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CAR', // Define the type of the dragged item as 'CAR'
    item: { id: car._id, matricule: car.matricule }, // Pass the car ID and carName
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <tr ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      <td>{car.matricule}</td>
      <td>{car.brand}</td>
      {/* <td>{car.model}</td>
      <td>{car.year}</td>
      <td>{car.color}</td> */}
    </tr>
  );
};

export default CarItem;
