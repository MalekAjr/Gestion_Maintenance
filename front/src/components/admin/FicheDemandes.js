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
import StatusBadgeFacturation from '../ficheIntervention/StatusBadgeFacturation';
import { BsFillPlusSquareFill } from 'react-icons/bs';


function FicheInterventionTable() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode } = useTheme();
  const [role, setRole] = useState('');

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
  
  

  if (loading) {
    return <LoadingSpinner />; 
  }

  return (
    <div className={`container mt-5 ${darkMode ? 'dark' : 'light'}`}>
      <div className="row align-items-center">
        <div className="col">
          <h1 className="mb-5">Liste des Fiches d'Intervention</h1>
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
          <table className={`table table-hover ${darkMode ? 'table-dark' : 'table-light'}`}>
            <thead className="thead-dark">
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Nom/Image</th>
                <th scope="col">Date Enregistré</th>
                <th scope="col">Reference</th>
                <th scope="col">Statut Technique</th>
                <th scope="col">Statut Validation Client</th>
                <th scope="col">Statut facturation</th>
                <th scope="col">Heure Debut</th>
                <th scope="col">Heure Fin</th>
                <th scope="col">Date Created At</th>
                <th scope="col">Heure Created At</th>
                <th scope="col">Type De Maintenance</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiches.map(fiche => (
                <tr key={fiche._id}>
                  {/* <td>{fiche._id}</td>  */}
                  <td>{fiche.client}</td>
                  <td>
                    <div style={{ textAlign: 'center' }}>
                    <div>{fiche.nom}</div>
                    <img
                      src={'http://localhost:8000/fichesImages/' + fiche.image}
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
                    <StatusBadgeFacturation statutfacturation={fiche.statutfacturation} />
                  </td>
                  <td>{formatTime(fiche.heurestart)}</td>
                  <td>{formatTime(fiche.heureend)}</td>
                  <td>{fiche.createdAt.split('T')[0]}</td>
                  <td>{formatTime(fiche.createdAt)}</td>
                  <td>{fiche.interventionType}</td>
                  <td><Link to={`/fiche-details/${fiche._id}`} className="btn btn-primary">
                      Voir Détails
                    </Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(FicheInterventionTable);
