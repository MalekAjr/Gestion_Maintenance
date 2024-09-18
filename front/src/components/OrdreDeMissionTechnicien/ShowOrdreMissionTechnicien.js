import React, { useState, useEffect } from 'react';
import postService from '../../services/postService';
import LoadingSpinner from "../LoadingSpinner";
import Navbar from '../NavBar/Navbar';
import StatusOrdreMissionAdmin from './StatusOrdreMissionAdmin';
import StatusOrdreMissionTechnicien from './StatusOrdreMissionTechnicien';
import { Link } from 'react-router-dom';
import { BsFillArrowLeftSquareFill, BsFillPlusSquareFill } from 'react-icons/bs';
// import { Modal, Button } from 'react-bootstrap'; // Importation des composants de la boîte de dialogue

function ShowOrdreMissionTechnicien() {
  const [ordres, setOrdres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const fetchOrdresMissions = async () => {
      try {
        setLoading(true);
        const response = await postService.getOrdreMissionsOneUser();
        setOrdres(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ordres missions:', error);
        setLoading(false);
      }
    };

    fetchOrdresMissions();
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
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString('en-US');
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US');
    }
    return dateString;
  };

  const filteredOrdres = ordres.filter(ordre => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return Object.values(ordre).some(value => {
      if (typeof value === 'string') {
        const formattedValue = formatDateString(value);
        return formattedValue.toLowerCase().includes(lowerCaseQuery);
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
        const response = await postService.getOrdreMissionsOneUser();
        setOrdres(response.data.data);
      } else {
        const response = await postService.searchOrdreMissionsOneUser(query);
        setOrdres(response.data.data);
      }
    } catch (error) {
      console.error("Error searching ordres missions:", error);
    }
  };

  
  if (loading || !ordres) {
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
          <h1 className="mb-5">Liste des Ordres de Mission</h1>
        </div>
        <div className="col-auto">
          <Link to="/créer-ordre" className="btn btn-success mb-3">
            <BsFillPlusSquareFill /> Create Ordre De Mission
          </Link>
        </div>
      </div>

      <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />
      
      {filteredOrdres.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Heure de début</th>
                <th>Heure de fin</th>
                <th>Destination</th>
                <th>Type de transport</th>
                <th>Heures réalisées(H)</th>
                <th>Kilométrage effectué(KM)</th>
                <th>Statut Technicien</th>
                <th>Statut d'Admin</th>
                <th>Email du Technicien</th>
                <th>Nom du Technicien</th>
                <th>Date de création</th>
                <th>Date de mise à jour</th>
                <th>Heure de mise à jour</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrdres.map(ordre => (
                <tr key={ordre._id}>
                  <td>{ordre.startDate ? formatDate(ordre.startDate) : "Ce champ est vide"}</td>
                  <td>{ordre.endDate ? formatDate(ordre.endDate) : "Ce champ est vide"}</td>
                  <td>{ordre.startHour ? ordre.startHour : "Ce champ est vide"}</td>
                  <td>{ordre.endHour ? ordre.endHour : "Ce champ est vide"}</td>
                  <td>{ordre.destination ? ordre.destination : "Ce champ est vide"}</td>
                  <td>{ordre.transportType ? ordre.transportType : "Ce champ est vide"}</td>
                  <td>{ordre.heuresRealisees ? ordre.heuresRealisees : "Ce champ est vide"}</td>
                  <td>{ordre.kilometrageEffectue ? ordre.kilometrageEffectue : "Ce champ est vide"}</td>
                  <td><StatusOrdreMissionTechnicien statuttechnicien={ordre.statuttechnicien} /></td>
                  <td><StatusOrdreMissionAdmin statutadmin={ordre.statutadmin} /></td>
                  <td>{ordre.user_email ? ordre.user_email : "Ce champ est vide"}</td>
                  <td>{ordre.user_nom ? ordre.user_nom : "Ce champ est vide"}</td>
                  <td>{ordre.createdAt ? formatDate(ordre.createdAt) : "Ce champ est vide"}</td>
                  <td>{ordre.updatedAt ? formatDate(ordre.updatedAt) : "Ce champ est vide"}</td>
                  <td>{ordre.updatedAt ? formatTime(ordre.updatedAt) : "Ce champ est vide"}</td>
                  <td>
                  <Link to={`/ordre-detailstechnicien/${ordre._id}?startDate=${ordre.startDate}&endDate=${ordre.endDate}`} className="btn btn-primary">
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

export default ShowOrdreMissionTechnicien;
