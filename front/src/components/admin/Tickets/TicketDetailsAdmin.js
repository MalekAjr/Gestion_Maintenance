import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import LoadingSpinner from '../../LoadingSpinner';
import postService from '../../../services/postService';


function TicketDetailsAdmin() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: ''
  });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTicket = async () => {
        try {
          setLoading(true);
          const response = await postService.getOneTicket(id);
          setTicket(response.data.data);
          setFormData({
            title: response.data.data.title,
            description: response.data.data.description,
            priority: response.data.data.priority,
            category: response.data.data.category
          });
          setLoading(false);
        } catch (error) {
          console.error('Erreur lors de la récupération du ticket :', error);
          setLoading(false);
        }
      };
      

    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postService.updateTicket(id, formData);
      navigate("/admin/showtickets")
    } catch (error) {
      console.error('Erreur lors de la modification du ticket :', error);
    }
  };

  if (loading || !ticket) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Détails du Ticket</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Titre</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPriority">
          <Form.Label>Priorité</Form.Label>
          <Form.Control
            as="select"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="Basse">Basse</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Haute">Haute</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Catégorie</Form.Label>
          <Form.Control
            as="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Technique">Technique</option>
            <option value="Facturation">Facturation</option>
            <option value="Autre">Autre</option>
          </Form.Control>
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer Ticket'}
          </Button>
          <Link to="/admin/dashboard" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default TicketDetailsAdmin;
