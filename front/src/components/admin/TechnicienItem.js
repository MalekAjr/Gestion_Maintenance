import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes'; // Import ItemTypes

const TechnicienItem = ({ technicien, handleDropTechnicien }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TECHNICIEN,
    item: { id: technicien._id, nom: technicien.nom, role: technicien.role },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDrop = () => {
    handleDropTechnicien(technicien);
  };

  return (
    <tr ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }} onDrop={handleDrop}>
      <td>
        <div className="circular-image-container">
          {technicien.image ? (
            <img
              src={`http://localhost:8000/usersImages/${technicien.image}`}
              alt={technicien.image}
              className="img-fluid"
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          ) : (
            <span>No Image Available</span>
          )}
        </div>
      </td>
      <td>{technicien.nom}</td>
      <td>{technicien.role}</td>
    </tr>
  );
};

export default TechnicienItem;
