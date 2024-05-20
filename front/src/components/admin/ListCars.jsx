import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import withAuthorization from '../authorization/withAuthorization';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFillPlusSquareFill } from 'react-icons/bs';
import Navbar from '../../components/NavBar/Navbar';

const ListCars = () => {
  const [cars, setCars] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    }
  };

  const filteredCars = cars.filter(car => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return Object.values(car).some(value => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseQuery);
      } else if (typeof value === 'number' && value.toString().toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      return false;
    });
  });
  
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    try {
      if (query === "") {
        fetchCars();
      } else {
        const response = await adminService.searchCars(query);
        if (response.data.success === true) {
          setCars(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error searching cars:", error);
    }
  };
  

  const handleDeleteCar = async (carId, carMatricule) => {
    setCarToDelete({ id: carId, matricule: carMatricule });
    setShowConfirmationModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminService.deleteCar(carToDelete.id);
      const updatedCars = cars.filter(car => car._id !== carToDelete.id);
      setCars(updatedCars);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Une erreur s'est produite lors de la suppression de la voiture.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Liste des voitures</h2>

      <div className="row align-items-center">
        <div className="col">
          <h1 className="mb-5">Liste des Voitures</h1>
        </div>
        <div className="col-auto">
          <Link to="/admin/créer-car" className="btn btn-success mb-3">
            <BsFillPlusSquareFill /> Créer Une Nouvelle Voiture
          </Link>
        </div>
      </div>

      <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />

      {filteredCars.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Matricule</th>
              <th scope="col">Marque</th>
              <th scope="col">Modèle</th>
              <th scope="col">Année</th>
              <th scope="col">Couleur</th>
              <th scope="col" colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car) => (
              <tr key={car._id}>
                <td>{car.matricule}</td>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>{car.color}</td>
                <td>
                  <Link to={`/admin/modifier-voiture/${car._id}`} className="btn btn-primary mr-2">
                    Modifier
                  </Link>
                  &emsp;
                  <button onClick={() => handleDeleteCar(car._id, car.matricule)} className="btn btn-danger">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer la voiture "{carToDelete ? carToDelete.matricule : ''}" (ID: {carToDelete ? carToDelete.id : ''}) ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

};

const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(ListCars);
