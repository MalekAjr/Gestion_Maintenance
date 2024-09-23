import React from 'react';
import { useDrag } from 'react-dnd';

const UserItem = ({ user }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'USER',
    item: { id: user._id, nom: user.nom, role: user.role }, // Pass the user id, nom, and role
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <tr ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      <td>
        <div className="circular-image-container">
          {user.image ? (
            <img
              src={`https://gestion-maintenance.vercel.app/usersImages/${user.image}`}
              alt={user.image}
              className="img-fluid"
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          ) : (
            <span>No Image Available</span>
          )}
        </div>
      </td>
      <td>{user.nom}</td>
     {/* <td>{user.role}</td> */}
    </tr>
  );
};

export default UserItem;
