import React, { useState } from 'react';
import adminService from '../../services/adminService';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CreateCar = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        matricule: '',
        brand: '',
        model: '',
        year: '',
        color: ''
    });


    const handleCarSubmit = async (e) => {
        e.preventDefault();
        try {
            const { matricule, brand, model, year, color } = formData;
    
            if (!matricule || !brand || !model || !year || !color) {
                setError('Veuillez remplir tous les champs obligatoires.');
                return;
            }
    
            console.log('Formulaire de données avant la soumission :', formData); // Ajout du console.log
    
            const response = await adminService.createCar(formData);
    
            setFormData({
                matricule: '',
                brand: '',
                model: '',
                year: '',
                color: ''
            });
    
            setSuccess('Voiture créée avec succès');
            setError('');
            setTimeout(() => {
                setSuccess('');
                console.log('Redirection vers /admin/listcars...');
                navigate('/admin/listcars');
            }, 3000);
    
            console.log('Voiture créée avec succès:', response.data);
        } catch (error) {
            console.error('Erreur lors de la création de la voiture:', error);
            setError('Une erreur s\'est produite lors de la création de la voiture.');
            setSuccess('');
        }
    };    

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Création d'une nouvelle voiture</h2>
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
                                        <button className="btn btn-primary" onClick={handleCarSubmit}>Créer Voiture</button>
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

export default CreateCar;
