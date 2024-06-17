import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import postService from '../../services/postService';
import adminService from '../../services/adminService';
import { BsFillArrowLeftSquareFill, BsFillPlusSquareFill } from 'react-icons/bs';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Suppose que user_nom est disponible dans le contexte
      const { title, description, priority, category } = formData;
      const userNom = 'user_nom'; // Remplacez ceci par le nom de l'utilisateur réel
      const ticketData = {
        title,
        description,
        priority,
        category,
        userNom, // Inclure le nom de l'utilisateur dans les données du ticket
      };
      await postService.createTicket(ticketData);
    
      navigate("/showticketclient")
    } catch (error) {
      console.error('Erreur lors de la création du ticket :', error);
      alert('Une erreur s\'est produite lors de la création du ticket.');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
      <div className="col-auto">
        <Link to="/showficheIntervention" className="btn mb-3" style={{ color: 'green' }}>
          <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
        </Link>
      </div>
      <div className="col mx-auto text-center">
        <h2 className="mb-5">Créer un nouveau ticket</h2>
      </div>
      <div className="col-auto">
        <Link to="/createticketclient" className="btn btn-success mb-3">
          <BsFillPlusSquareFill /> Créer un ticket
        </Link>
      </div>
    </div>
      
      
      <Form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center">
          <Form.Group className="mb-3 w-50" controlId="formTitle">
            <Form.Label>Titre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le titre"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </div>

        <div className="d-flex justify-content-center">
          <Form.Group className="mb-3 w-50" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Entrez la description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </div>

        <div className="d-flex justify-content-center">
          <Form.Group className="mb-3 w-50" controlId="formPriority">
            <Form.Label>Priorité</Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez la priorité</option>
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Haute">Haute</option>
            </Form.Select>
          </Form.Group>
        </div>

        <div className="d-flex justify-content-center">
          <Form.Group className="mb-3 w-50" controlId="formCategory">
            <Form.Label>Catégorie</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez la catégorie</option>
              <option value="Technique">Technique</option>
              <option value="Facturation">Facturation</option>
              <option value="Autre">Autre</option>
            </Form.Select>
          </Form.Group>
        </div>

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer Ticket'}
          </Button>
          <Link to="/dashboard" className="btn btn-secondary ms-2">
            Annuler
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default CreateTicket;
