import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsClock } from 'react-icons/bs';

import "./OrdreMission.css";
import postService from '../../services/postService';

const CreateOrdreDeMission = () => {
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
    } catch (error) {
      console.error('Erreur lors de la création de l\'ordre de mission:', error);
      setError('Une erreur s\'est produite lors de la création de l\'ordre de mission.');
      setSuccess('');
    }
  };
  
  return (
    <div className="container">
      <h1 className="text-center">ORDRE DE MISSION</h1>
      {error && <h5 style={{textAlign: "center"}} className={`text-danger ${error && 'error'}`}>{error}</h5>}
      {success && <p className={`text-success ${success && 'success'}`}>{success}</p>}

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3 d-flex align-items-center">
            <label className="form-label me-2" style={{ width: '120px' }}>Date de début :</label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              className="form-control date-picker"
            />

            <label className="form-label me-2" style={{ width: '120px', marginLeft: '15px' }}>Date de fin :</label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              className="form-control date-picker"
            />
          </div>
          <div className="mb-3 d-flex align-items-center">
            <label className="form-label me-2" style={{ width: '120px' }}>Heure de début :</label>
            <input
              type="time"
              className="form-control me-3"
              value={formData.startHour}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              style={{ width: '160px' }}
            />
            <label className="form-label me-2" style={{ width: '120px' }}>Heure de fin :</label>
            <input
              type="time"
              className="form-control"
              value={formData.endHour}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              style={{ width: '160px' }}
            />
          </div>
          <div className="mb-3">
            <p>À :</p>
            <textarea 
              className="form-control" 
              rows="3" 
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
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

        <div className="col-md-6">
          <div className="mb-3">
            <p>Heures réalisées :</p>
            <input
              type="text"
              className="form-control"
              value={formData.heuresRealisees}
              onChange={(e) => setFormData({ ...formData, heuresRealisees: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <p>Kilométrage effectué :</p>
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
        <button className="btn btn-primary" onClick={handleCreateOrder}>Créer Ordre</button>
      </div>
    </div>
  </div>
</div>
  );
};

export default CreateOrdreDeMission;
