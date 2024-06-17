import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsClock, BsFillArrowLeftSquareFill } from 'react-icons/bs';

import "./OrdreMission.css";
import postService from '../../services/postService';
import { Button } from 'react-bootstrap';
import {  Link, useNavigate } from 'react-router-dom';

const CreateOrdreDeMissionTechnicien = () => {
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    startHour: '',
    endHour: '',
    transportType: '',
    heuresRealisees: '',
    kilometrageEffectue: '',
    destination: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const handleStartTimeChange = (time) => {
    setFormData({
      ...formData,
      startHour: time,
    });
  };
  
  const handleEndTimeChange = (time) => {
    setFormData({
      ...formData,
      endHour: time,
    });
  };

  const handleCreateOrder = async () => {
    try {
      const { startDate, endDate, startHour, endHour, destination, transportType, heuresRealisees, kilometrageEffectue } = formData;
      let errorMessage = '';
      let successMessage = '';

      if (!startDate || !endDate || !startHour || !endHour || !transportType || !heuresRealisees || !kilometrageEffectue || !destination) {
        setError('Veuillez remplir tous les champs obligatoires.');
        return;
      }
  
      if (endDate.getTime() === startDate.getTime() && new Date(`1970-01-01T${endHour}`) <= new Date(`1970-01-01T${startHour}`)) {
        errorMessage = 'L\'heure de fin doit être postérieure à l\'heure de début.';
      }

    if (errorMessage) {
      setError(errorMessage);
      setTimeout(() => {
        setError('');
      }, 5000); // Disparition après 5 secondes
      return;
    }

      const response = await postService.createOrdreMission(formData);
  
      setFormData({
        startDate: new Date(),
        endDate: new Date(),
        startHour: '',
        endHour: '',
        transportType: '',
        heuresRealisees: '',
        kilometrageEffectue: '',
        destination: ''
      });
      setSuccess('Ordre de mission créé avec succès');
      setError('');
  
      setTimeout(() => {
        setSuccess('');
      }, 3000);

      console.log('Ordre de mission créé avec succès:', response.data);
      navigate('/consulter-ordretechnicien')
    } catch (error) {
      console.error('Erreur lors de la création de l\'ordre de mission:', error);
      setError('Une erreur s\'est produite lors de la création de l\'ordre de mission.');
      setSuccess('');
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
          <div className="col-auto">
              <Link to="/consulter-ordretechnicien" className="btn mb-3" style={{ color: 'green' }}>
                  <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
              </Link>
          </div>
          <div className="col text-center">
              <h1 className="mb-5">Demande D'ORDRE DE MISSION</h1>
          </div>
      </div>
      {error && <h5 className={`text-danger ${error && 'error'}`} style={{ textAlign: "center" }}>{error}</h5>}
      {success && <p className={`text-success ${success && 'success'}`}>{success}</p>}

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Date de début :</label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => setFormData({ ...formData, startDate: date })}
                  className="form-control date-picker"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Heure de début :</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.startHour}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">À :</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Date de fin :</label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => setFormData({ ...formData, endDate: date })}
                  className="form-control date-picker"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Heure de fin :</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.endHour}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Il utilisera le moyen de transport suivant :</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="transportType"
                    value="Véhicule de l'entreprise"
                    onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
                  />
                  <label className="form-check-label">Véhicule de l'entreprise</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="transportType"
                    value="Son Véhicule personnel"
                    onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
                  />
                  <label className="form-check-label">Son Véhicule personnel</label>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-2">Heures réalisées :</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.heuresRealisees}
                  onChange={(e) => setFormData({ ...formData, heuresRealisees: e.target.value })}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-2">Kilométrage effectué :</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.kilometrageEffectue}
                  onChange={(e) => setFormData({ ...formData, kilometrageEffectue: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="d-grid gap-2">
                <Button variant="primary" onClick={handleCreateOrder}>Créer Ordre</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
    
};

export default CreateOrdreDeMissionTechnicien;
