import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import postService from '../../services/postService';
import LoadingSpinner from "../LoadingSpinner";
import { Link } from 'react-router-dom';
import Navbar from '../../components/NavBar/Navbar';
import { BsFillArrowLeftSquareFill, BsFillPlusSquareFill } from 'react-icons/bs';
import StatusBadgeAdmin from './StatusBadgeAdmin';
import StatusBadgeClient from './StatusBadgeClient';
import StatusBadgeTechnicien from './StatusBadgeTechnicien';
import adminService from '../../services/adminService';

function FicheInterventionTable() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchFichesbyID = async () => {
      try {
        setLoading(true);
        const response = await postService.getFicheOneUser();
        setFiches(response.data.data);
      } catch (error) {
        console.error("Error fetching fiches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFichesbyID();
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
        const response = await postService.getFicheOneUser();
        setFiches(response.data.data);
        
      } else {
        const response = await postService.searchFicheOneUser(query);
        setFiches(response.data.data);
        
      }
    } catch (error) {
      console.error("Error searching fiches:", error);
    }
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data here, including the role
        const response = await adminService.getUser();
        setRole(response.data.user.role);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  if (loading || !fiches) {
    return <LoadingSpinner />; 
  }

  return (

         

    <div className="container">
      <div className="row align-items-center">
          <div className="col-auto">
              <Link to="/dashboard" className="btn mb-3" style={{ color: 'green' }}>
                  <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
              </Link>
          </div>
        <div className="col">
          <h1 className="mb-5"  style={{ textAlign: 'center', marginTop: "10px" }}>Liste des Fiches d'Intervention</h1> 
        </div>
        {role !== 'utilisateur' && (
          <div className="col-auto">
            <Link to="/createficheintervention" className="btn btn-success mb-3">
              <BsFillPlusSquareFill /> Create Fiche Intervention
            </Link>
          </div>
        )}
      </div>

   <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />

   {filteredFiches.length > 0 && (
  <div className="table-responsive">
    <table className="table table-hover">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Client</th>
          <th scope="col">Nom/Image</th>
          <th scope="col">Date Enregistré</th>
          <th scope="col">Reference</th>
          <th scope="col">Statut Admin</th>
          <th scope="col">Statut Client</th>
          <th scope="col">Statut Technicien</th>
          <th scope="col">Heure Debut</th>
          <th scope="col">Heure Fin</th>
          <th scope="col">Date Created At</th>
          <th scope="col">Heure Created At</th>
          <th scope="col">Type De Maintenance</th>
       {/*   <th scope="col">Date Updated At</th>
          <th scope="col">Heure Updated At</th> */} 
        </tr>
      </thead>
      <tbody>
        {filteredFiches.map(fiche => (
          <tr key={fiche._id}>
            {/* <td>{fiche._id}</td> */}
            <td>{fiche.client}</td>
            <td>
              <div style={{ textAlign: 'center' }}>
                <div>{fiche.nom}</div>
                <img
                  src={'https://gestion-maintenance-dfnp.vercel.app/fichesImages/' + fiche.image}
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
              <StatusBadgeTechnicien statuttechnicien={fiche.statuttechnicien} />
            </td>
            <td>{formatTime(fiche.heurestart)}</td>
            <td>{formatTime(fiche.heureend)}</td>
            <td>{fiche.createdAt.split('T')[0]}</td>
            <td>{formatTime(fiche.createdAt)}</td>
            <td>{fiche.interventionType}</td>
        {/*    <td>{fiche.updatedAt ? fiche.updatedAt.split('T')[0] : '-'}</td>
            <td>{fiche.updatedAt ? formatTime(fiche.updatedAt) : '-'}</td>  */} 
            <td>
              <Link to={`/fiche-details/${fiche._id}`} className="btn btn-primary">
                Voir Détails
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
}

export default FicheInterventionTable;