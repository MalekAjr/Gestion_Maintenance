import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import adminService from '../../../services/adminService';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    technicienName: '',
    carName: ''
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

  if (new Date(formData.end) <= new Date(formData.start)) {
    alert('End date and time must be greater than start date and time.');
    setLoading(false);
    return;
  }

  if (
    new Date(formData.end).toDateString() === new Date(formData.start).toDateString() &&
    new Date(formData.end) <= new Date(formData.start)
  ) {
    alert('End time must be greater than start time.');
    setLoading(false);
    return;
  }

    try {
      await adminService.createEvent(formData);
      navigate("/admin/showeventsplan") // Rediriger vers la liste des événements après la création
    } catch (error) {
      console.error('Error creating event:', error);
      alert('An error occurred while creating the event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
          <div className="col-auto">
              <Link to="/admin/showeventsplan" className="btn mb-3" style={{ color: 'green' }}>
                  <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
              </Link>
          </div>
          <div className="col text-center">
              <h1 className="mb-5">Créer un Nouveau Evénement</h1>
          </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer titre"
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
            placeholder="Entrer description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formStart">
          <Form.Label>Start Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="start"
            value={formData.start}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEnd">
          <Form.Label>End Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="end"
            value={formData.end}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTechnicienName">
          <Form.Label>Technicien Concerné</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer nom technicien"
            name="technicienName"
            value={formData.technicienName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCarName">
          <Form.Label>Voiture Utilisée</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer nom voiture"
            name="carName"
            value={formData.carName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer Evenement'}
          </Button>
          <Link to="/admin/showeventsplan" className="btn btn-secondary mt-2">
            Annuler
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default CreateEvent;