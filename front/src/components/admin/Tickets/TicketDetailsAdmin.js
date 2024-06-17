import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import LoadingSpinner from '../../LoadingSpinner';
import postService from '../../../services/postService';
import { BsFillArrowLeftSquareFill, BsFillPlusSquareFill } from 'react-icons/bs';

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
  const [creationDate, setCreationDate] = useState('');
  const [creationTime, setCreationTime] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [time, setTime] = useState('');

  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await postService.getOneTicket(id);
        const ticketData = response.data.data;
        setTicket(ticketData);
        setFormData({
          title: ticketData.title,
          description: ticketData.description,
          priority: ticketData.priority,
          category: ticketData.category
        });
        const createDate = new Date(ticketData.createdAt);
        setCreationDate(createDate.toLocaleDateString());
        setCreationTime(createDate.toLocaleTimeString());
        
        if (ticketData.updatedAt) {
          const updateDate = new Date(ticketData.updatedAt);
          setUpdatedAt(updateDate.toLocaleDateString());
          const updateTime = updateDate.toLocaleTimeString();
          setTime(updateTime);
        }
  
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
      navigate("/admin/showtickets");
    } catch (error) {
      console.error('Erreur lors de la modification du ticket :', error);
    }
  };

  if (loading || !ticket) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="row align-items-center mb-4">
            <div className="col-auto">
              <Link to="/admin/dashboard" className="btn mb-3" style={{ color: 'green' }}>
                <BsFillArrowLeftSquareFill size={30} /> Retour
              </Link>
            </div>
            <div className="col text-center">
              <h2 className="text-center mb-4">Détails du Ticket</h2>
            </div>
            <div className="col-auto text-end">
              <Link to="/admin/createticket" className="btn btn-success mb-3">
                <BsFillPlusSquareFill size={30} /> Créer un Ticket
              </Link>
            </div>
          </div>
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

            <div className="mb-3 d-flex justify-content-between">
              <span className="form-label" style={{ marginRight: "10px" }}>Créé le : {creationDate} à {creationTime}</span>
              <span className="form-label" style={{ marginRight: "10px" }}>Modifié le : {updatedAt} à {time}</span>
            </div>

            <div className="d-flex justify-content-between">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Création en cours...' : (ticket ? 'Modifier' : 'Créer Ticket')}
              </Button>
              <Link to="/admin/dashboard" className="btn btn-secondary">
                Annuler
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailsAdmin;
