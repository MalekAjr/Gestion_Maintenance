import React from 'react';
import adminService from '../../services/adminService';
import UserItem from './UserItem';

const TechnicienList = () => {
  const [techniciens, setTechniciens] = React.useState([]);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      const filteredUsers = response.data.users.filter(user => user.role === 'technicien');
      setTechniciens(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setTechniciens([]);
    }
  };

  return (
    <div style={{ height: '300px', overflowY: 'auto' }} id="user-list">
      <h2>Liste Des Techniciens</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Nom</th>
              {/*  <th scope="col">Role</th> */}
            </tr>
          </thead>
          <tbody>
            {techniciens.map((user) => (
              <UserItem key={user._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechnicienList;
