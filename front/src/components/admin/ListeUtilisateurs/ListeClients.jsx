import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ListUsers.css';
import { useTheme } from '../../ThemeContext';
import adminService from '../../../services/adminService';
import LoadingSpinner from '../../LoadingSpinner';
import Navbar from '../../NavBar/Navbar';
import UpdateUserModal from '../UpdateUserModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import withAuthorization from '../../authorization/withAuthorization';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

function ListUsers() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState(null);
  const { darkMode } = useTheme();
  const iconSize = 28;

  useEffect(() => {
    console.log('Dark Mode:', darkMode);
  }, [darkMode]);


  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await adminService.getClients(); // Utiliser la méthode getClients de votre service adminService
      setClients(response.data.clients); // Mettre à jour le state avec la liste des clients récupérée
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Time";
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${hours}H ${minutes}minutes ${seconds}secondes`;
  };

  const renderCreatedAt = (createdAt) => {
    if (!createdAt) {
      return "Unknown Date";
    }
    return createdAt.split('T')[0];
  };

  // Handle closing update modal
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  // Handle showing delete modal
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  

  const handleConfirmDelete = async () => {
    try {
      await adminService.deleteUser(selectedUser._id);
      setUsers(users.filter(currentUser => currentUser._id !== selectedUser._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Filter users based on searchQuery
  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase(); //.trim();
    setSearchQuery(query);

    try {
      if (query === "") {
        const response = await adminService.getClients();
        setUsers(response.data.clients);
      } else {
        const response = await adminService.searchUsers(query);
        setUsers(response.data.clients);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  useEffect(() => {
    const filteredResults = clients.filter(user =>
      Object.keys(user).some(key =>
        typeof user[key] === 'string' && user[key].toLowerCase().includes(searchQuery)
      )
    );
    setFilteredUsers(filteredResults);
  }, [searchQuery, clients]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`container mt-5 ${darkMode ? 'dark' : 'light'}`}>
    <div className="container mt-5">
      <h1 className="text-center mb-5">Liste des Clients</h1>
      <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />

      <div className="table-responsive">
      <table className={`table table-hover ${darkMode ? 'table-dark' : 'table-light'}`}>      
      <thead className="thead-dark">
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Image</th>
        <th scope="col">Nom</th>
       {/*  <th scope="col">Date</th> */}
        <th scope="col">Role</th>
        <th scope="col">Email</th>
        <th scope="col">Num Téléphone</th>
        <th scope="col">Date Création</th>
        <th scope="col">Temps Création</th>
        <th scope="col">Modifier</th>
        <th scope="col">Supprimer</th>
      </tr>
    </thead>
    <tbody>
                   {/* .filter(user => user.role === 'admin') */}

            {filteredUsers.map(user => (

                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>
                    <div className="circular-image-container">
                      {user.image ? (
                        <img
                          src={`https://gestion-maintenance-dfnp.vercel.app//usersImages/${user.image}`}
                          alt={user.image}
                          className="img-fluid"
                          style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                      ) : (
                        <span>Pas D'Image Trouvée</span>
                      )}
                    </div>
                  </td>
                  <td>{user.nom}</td>
                  {/* <td>{user.date ? user.date.split('T')[0] : 'Unknown Date'}</td> */}
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{renderCreatedAt(user.createdAt)}</td>
                  <td>{formatTime(user.createdAt)}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setSelectedUserForUpdate(user);
                        setShowUpdateModal(true);
                      }}
                    >
                      <BsPencilSquare className="me-1" size={iconSize} /> 
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user)}
                    >
                    <BsTrash className="me-1" size={iconSize} />

                    </button>
                  </td>
                </tr>
              ))}
            {  /*
            {filteredUsers.every(user => user.role !== 'admin') && (
              <tr>
                <td colSpan="11">You haven't Access To Secure Data</td>
              </tr>
            )}
            */}
          </tbody>
        </table>
      </div>


      {/* Update User Modal */}
      {showUpdateModal && (
        <UpdateUserModal
          id={selectedUserForUpdate?._id}
          nom={selectedUserForUpdate?.nom}
          email={selectedUserForUpdate?.email}
          phone={selectedUserForUpdate?.phone}
          role={selectedUserForUpdate?.role}
          image={selectedUserForUpdate?.image}
          onClose={handleCloseUpdateModal}
          show={showUpdateModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          user={selectedUser}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
    </div>
  );
}

const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(ListUsers);
