import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import postService from '../../../services/postService';
import StatusOrdreMissionTechnicien from '../../OrdreDeMissionTechnicien/StatusOrdreMissionTechnicien';
import StatusOrdreMissionAdmin from '../../OrdreDeMissionTechnicien/StatusOrdreMissionAdmin';
import { BsFillArrowLeftSquareFill, BsFillPlusSquareFill } from 'react-icons/bs';


function OrdreDetails() {
  const { id } = useParams();
  const [ordre, setOrdre] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchOrdreMission = async () => {
      try {
        setLoading(true);
        const response = await postService.getOrdreMissionById(id);
        setOrdre(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ordre mission:', error);
        setLoading(false);
      }
    };

    fetchOrdreMission();
  }, [id]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0, donc +1
    const day = date.getDate().toString().padStart(2, '0'); // Ajoute un zéro devant si le chiffre est inférieur à 10
    return `${year}-${month}-${day}`;
  };
  
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

  const handleValiderparAdmin = async () => {
    try {
      const updatedOrdreMission = { ...ordre, statutadmin: 2 };
      await postService.updateOrdreMission(ordre._id, updatedOrdreMission); 
      setOrdre(updatedOrdreMission);
    } catch (error) {
      console.error("Error updating ordre:", error);
    }
  };

  const handleRefuserparAdmin = async () => {
    try {
      const updatedOrdreMission = { ...ordre, statutadmin: 0 };
      await postService.updateOrdreMission(ordre._id, updatedOrdreMission); 
      setOrdre(updatedOrdreMission); 
    } catch (error) {
      console.error("Error updating ordre:", error);
    }
  };

  const handleValiderparTechnicien= async () => {
    try {
      const updatedOrdreMission = { ...ordre, statuttechnicien: 2 }; 
      await postService.updateOrdreMission(ordre._id, updatedOrdreMission);
      setOrdre(updatedOrdreMission);
    } catch (error) {
      console.error("Error updating ordre:", error);
    }
  };
 
  const handleRefuserparTechnicien = async () => {
    try {
      const updatedOrdreMission = { ...ordre, statuttechnicien: 0 }; 
      await postService.updateOrdreMission(ordre._id, updatedOrdreMission); 
      setOrdre(updatedOrdreMission);
    } catch (error) {
      console.error("Error updating ordre:", error);
    }
  };

  
  const handleUpdateData = async () => {
    try {
      const response = await postService.getOrdreMissionById(id);
      setOrdre(response.data.data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleUpdateOrdre = async () => {
    try {
      await postService.updateOrdreMission(ordre._id, ordre);
      console.log(ordre)
      // Optionnel : Ajouter une confirmation ou une indication de succès
    } catch (error) {
      console.error("Error updating ordre:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrdre({
      ...ordre,
      [name]: value
    });
  };

  if (loading || !ordre) {
    return  (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <CircularProgress size={100}/>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row align-items-center">
          <div className="col-auto">
              <Link to="/admin/consulter-ordre" className="btn mb-3" style={{ color: 'green' }}>
                  <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
              </Link>
          </div>
          <div className="col text-center">
              <h1 className="mb-5">Ordre de Mission</h1>
          </div>
          <div className="col-auto text-end">
              <Link to="/créer-ordre" className="btn btn-success mb-3">
                  <BsFillPlusSquareFill size={30} /> Créer un Ordre de Mission
              </Link>
          </div>
      </div>
  <div className="row">
    <div className="col-md-6">
    <div className="mb-3">
            <label className="form-label">Date de début :</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={formatDate(ordre.startDate)} // Utilisez formatDate pour formater la date
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Date de fin :</label>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={formatDate(ordre.endDate)} // Utilisez formatDate pour formater la date
              onChange={handleInputChange}
            />
          </div>
      <div className="mb-3">
        <label className="form-label">Heure de début :</label>
        <input
          type="time"
          className="form-control"
          name="startHour"
          value={ordre.startHour}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Heure de fin :</label>
        <input
          type="time"
          className="form-control"
          name="endHour"
          value={ordre.endHour}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Destination :</label>
        <input
          type="text"
          className="form-control"
          name="destination"
          value={ordre.destination}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Type de transport :</label>
        <input
          type="text"
          className="form-control"
          name="transportType"
          value={ordre.transportType}
          onChange={handleInputChange}
          disabled
        />
      </div>
      <div className="mb-3">
        <p>Il utilisera le moyen de transport suivant :</p>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="transportType"
            value="Véhicule de l'entreprise"
            checked={ordre.transportType === "Véhicule de l'entreprise"}
            onChange={handleInputChange}
          />
          <label className="form-check-label">Véhicule de l'entreprise</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="transportType"
            value="Son Véhicule personnel"
            checked={ordre.transportType === "Son Véhicule personnel"}
            onChange={handleInputChange}
          />
          <label className="form-check-label">Son Véhicule personnel</label>
        </div>
      </div>

      <div className="mb-3">
        {userRole === 'admin' ? (
          <div>
            <button onClick={handleValiderparAdmin} style={{ width: "45%", marginRight: "10px" }} className="btn btn-success btn-rounded">Valider</button>
            <button onClick={handleRefuserparAdmin} style={{ width: "45%" }} className="btn btn-danger btn-rounded">Refuser</button>
          </div>
        ) : (
          <div>
            <button onClick={handleValiderparTechnicien} style={{ width: "45%", marginRight: "10px" }} className="btn btn-success btn-rounded">Valider</button>
            <button onClick={handleRefuserparTechnicien} style={{ width: "45%" }} className="btn btn-danger btn-rounded">Refuser</button>
          </div>
        )}
      </div>
    </div>

    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label">Heures réalisées :</label>
        <input
          type="text"
          className="form-control"
          name="heuresRealisees"
          value={ordre.heuresRealisees}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Kilométrage effectué(KM) :</label>
        <input
          type="number"
          className="form-control"
          name="kilometrageEffectue"
          value={ordre.kilometrageEffectue}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email du Client :</label>
        <input
          type="email"
          className="form-control"
          name="user_email"
          value={ordre.user_email}
          onChange={handleInputChange}
          disabled
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Nom du Client :</label>
        <input
          type="text"
          className="form-control"
          name="user_nom"
          value={ordre.user_nom}
          onChange={handleInputChange}
          disabled
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Date de création :</label>
        <input
          type="text"
          className="form-control"
          name="createdAt"
          value={formatDate(ordre.createdAt)}
          disabled
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Date de mise à jour :</label>
        <input
          type="text"
          className="form-control"
          name="updatedAt"
          value={formatDate(ordre.updatedAt)}
          disabled
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Heure de mise à jour :</label>
        <input
          type="text"
          className="form-control"
          name="updatedAt"
          value={formatTime(ordre.updatedAt)}
          disabled
        />
      </div>
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Statut de Technicien :</label>
          <StatusOrdreMissionTechnicien statuttechnicien={ordre.statuttechnicien} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Statut de Responsable(Admin) :</label>
          <StatusOrdreMissionAdmin statutadmin={ordre.statutadmin} />
        </div>
      </div>      
    </div>
  </div>
  <div className="row">
  <div className="col-md-12 mb-3">
    <button onClick={handleUpdateOrdre} className="btn btn-primary mr-2">Modifier l'ordre</button>
    <button onClick={handleUpdateData} className="btn btn-secondary mx-2">Rafraîchir les données</button>
  </div>
</div>

</div>

  );
}

export default OrdreDetails;
