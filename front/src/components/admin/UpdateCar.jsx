import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import e from 'cors';

const UpdateCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    matricule: '',
    brand: '',
    model: '',
    year: '',
    color: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await adminService.getCarById(id);
      const carData = response.data;
      setFormData({
        matricule: carData.matricule,
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        color: carData.color
      });
    } catch (error) {
      console.error('Error fetching car:', error);
    }
  };

  const handleCarUpdate = async (e) => {
    e.preventDefault();
    try {
      const { matricule, brand, model, year, color } = formData;

      if (!matricule || !brand || !model || !year || !color) {
        setError('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      const updatedCar = {
        _id: id,
        matricule,
        brand,
        model,
        year,
        color
      };

      const response = await adminService.updateCar(updatedCar);

      setSuccess('Voiture mise à jour avec succès');
      setError('');

      setTimeout(() => {
        setSuccess('');
        console.log('Redirection vers /admin/listcars...');
        navigate('/admin/listcars');
      }, 3000);

      console.log('Voiture mise à jour avec succès:', response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la voiture:', error);
      setError('Une erreur s\'est produite lors de la mise à jour de la voiture.');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Modifier Voiture</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form>
                <div className="mb-3">
                  <label className="form-label">Matricule</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.matricule}
                    onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Marque</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Modèle</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Année</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Couleur</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary" onClick={handleCarUpdate}>Modifier Voiture</button>
                  </div>
                  <div className="d-grid gap-2">
                    <Link to="/admin/listcars" className="btn btn-success">Voir Liste Des Voitures</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCar;
