import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import postService from '../../services/postService';
import LoadingSpinner from "../LoadingSpinner";
import { Link } from 'react-router-dom';
import Navbar from '../../components/NavBar/Navbar';
import withAuthorization from '../authorization/withAuthorization';
import { useTheme } from '../ThemeContext';
import StatusBadgeAdmin from '../ficheIntervention/StatusBadgeAdmin';
import StatusBadgeClient from '../ficheIntervention/StatusBadgeClient';
import StatusBadgeFacturation from '../ficheIntervention/StatusBadgeTechnicien';
import { BsFillArrowLeftSquareFill, BsFillPlusSquareFill, BsInfoCircle, BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Button, Modal } from 'react-bootstrap';


function FicheInterventionTable() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode } = useTheme();
  
  const iconSize = 20;
  const fontSize = 16;

  const [ficheToDelete, setFicheToDelete] = useState(null);
const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    console.log('Dark Mode:', darkMode);
  }, [darkMode]);
  
  const fetchFiches = async () => {
    try {
      setLoading(true);
      const response = await postService.getFiches();
      setFiches(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fiches:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiches();
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


  // Filter fiches based on searchQuery
  const filteredFiches = fiches.filter(fiche => {
    const lowerCaseQuery = searchQuery.toLowerCase();
  
    // Check for partial matches in all fields except 'image'
    return Object.entries(fiche).some(([key, value]) =>
      key !== 'image' && typeof value === 'string' && value.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const handleSearch = async (e) => {
    const query = e.target.value;//.toLowerCase(); // .trim()  , Trim the query to remove whitespace
    setSearchQuery(query);
  
    try {
      if (query === "") {
        const response = await postService.getFiches();
        setFiches(response.data.data);
      } else {
        const response = await postService.searchFiches(query);
        setFiches(response.data.data);
      }
    } catch (error) {
      console.error("Error searching fiches:", error);
    }
  };
  
  const handleDeleteFiche = (ficheId, ficheNom) => {
    setFicheToDelete({ id: ficheId, nom: ficheNom });
    setShowConfirmationModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      await postService.deleteFiche(ficheToDelete.id);
      const updatedFiches = fiches.filter(fiche => fiche._id !== ficheToDelete.id);
      setFiches(updatedFiches);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la fiche :", error);
      alert("Une erreur s'est produite lors de la suppression de la fiche.");
    }
  };
  

  if (loading) {
    return <LoadingSpinner />; 
  }

  return (
    <div className={`container mt-5 ${darkMode ? 'dark' : 'light'}`}>
      <div className="row align-items-center">
        <div className="col-auto">
          <Link to="/admin/dashboard" className="btn mb-3" style={{ color: 'green' }}>
            <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
          </Link>
        </div>
        <div className="col text-center">
          <h1 className="mb-5">Liste des Fiches d'Intervention</h1>
        </div>
        <div className="col-auto text-end">
          <Link to="/createficheintervention" className="btn btn-success mb-3">
            <BsFillPlusSquareFill size={30} /> Créer Fiche Intervention
          </Link>
        </div>
      </div>
  
      <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />
  
      {filteredFiches.length > 0 && (
        <div className="table-responsive">
          <table className={`table table-hover ${darkMode ? 'table-dark' : 'table-light'}`}>
            <thead className="thead-dark">
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Nom/Image</th>
                <th scope="col">Date Enregistré</th>
                <th scope="col">Reference</th>
                <th scope="col">Statut Admin/Responsable</th>
                <th scope="col">Statut Client</th>
                <th scope="col">Statut Technicien</th>
                <th scope="col">Heure Debut</th>
                <th scope="col">Heure Fin</th>
                <th scope="col">Date Création A</th>
                <th scope="col">Heure Création A</th>
                <th scope="col">Type De Maintenance</th>
                <th scope="col" colSpan="3">Actions</th>


              </tr>
            </thead>
            <tbody>
            {filteredFiches.map(fiche => (
  <tr key={fiche._id}>
    <td>{fiche.client}</td>
    <td>
      <div style={{ textAlign: 'center' }}>
        <div>{fiche.nom}</div>
        <img
          src={'https://gestion-maintenance-dfnp.vercel.app//fichesImages/' + fiche.image}
          alt={fiche.image}
          style={{ width: '100px', height: '100px', marginTop: '10px' }}
        />
      </div>
    </td>
    <td>{fiche.date.split('T')[0]}</td>
    <td>{fiche.reference}</td>
    <td>
      <StatusBadgeAdmin statuttechnique={fiche.statuttechnique} />
    </td>
    <td>
      <StatusBadgeClient statutclient={fiche.statutclient} />
    </td>
    <td>
      <StatusBadgeFacturation statuttechnicien={fiche.statuttechnicien} />
    </td>
    <td>{formatTime(fiche.heurestart)}</td>
    <td>{formatTime(fiche.heureend)}</td>
    <td>{fiche.createdAt.split('T')[0]}</td>
    <td>{formatTime(fiche.createdAt)}</td>
    <td>{fiche.interventionType}</td>
    <td>
  <Link to={`/fiche-details/${fiche._id}`} className="btn btn-primary btn-sm" style={{ height: "60px", width: "100px", fontSize: `${fontSize}px` }}>
    <BsInfoCircle className="me-1" size={iconSize} />
    Voir Détails
  </Link>
</td>
<td>
  <Button className="btn btn-danger btn-sm" onClick={() => handleDeleteFiche(fiche._id, fiche.client)} style={{ height: "60px", width: "100px", fontSize: `${fontSize}px` }}>
    <BsTrash className="me-1" size={iconSize} />
    Supprimer
  </Button>
</td>
<td>
  <Link to={`/admin/updatefiche/${fiche._id}`} className="btn btn-success btn-sm" style={{ height: "60px", width: "100px", fontSize: `${fontSize}px` }}>
    <BsPencilSquare className="me-1" size={iconSize} /> 
    Modifier
  </Link>
</td>


  </tr>
))}


            </tbody>
          </table>
        </div>
      )}
      
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer la fiche "{ficheToDelete ? ficheToDelete.nom : ''}" ?
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
  
  
}


const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(FicheInterventionTable);
