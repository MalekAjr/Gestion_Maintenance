import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import adminService from '../../../services/adminService';
import Navbar from '../../NavBar/Navbar';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { format, parseISO } from 'date-fns';
import Swal from 'sweetalert2';

const formatDateToLocalInput = (dateString) => {
    const date = parseISO(dateString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };
  

const UpdateEvent = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await adminService.getEventById(id);
        const eventData = response.data.data;
        setFormData({
          title: eventData.title,
          description: eventData.description,
          start: formatDateToLocalInput(eventData.start),
          end: formatDateToLocalInput(eventData.end),
          technicienName: eventData.technicienName,
          carName: eventData.carName
        });
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);
  
    if (endDate.toDateString() === startDate.toDateString() && endDate <= startDate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'L\'heure de fin doit être supérieure à l\'heure de début.'
      });
      setLoading(false);
      return;
    }
  
    if (endDate <= startDate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La date de fin doit être ultérieure à la date de début.'
      });
      setLoading(false);
      return;
    }
  
    try {
      await adminService.updateEvent({
        _id: id,
        ...formData,
      });
      navigate("/admin/showeventsplan");
    } catch (error) {
      console.error('Error updating event:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Une erreur s\'est produite lors de la mise à jour de l\'événement.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const retourVersPage = () => {
    navigate("/admin/showeventsplan");
  }
  

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-auto">
          <Link to="/admin/showeventsplan" className="btn mb-3" style={{ color: 'green' }}>
            <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
          </Link>
        </div>
        <div className="col text-center">
          <h1 className="mb-5">Modifier un Evénement</h1>
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
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
            placeholder="Enter description"
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
            placeholder="Enter technicien name"
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
            placeholder="Enter car name"
            name="carName"
            value={formData.carName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-center">
        <Button variant="primary" type="submit" disabled={loading} style={{ width: '28%', marginRight: '2%' }}>
          {loading ? 'Mise à jour...' : 'Modifier l\'événement'}
        </Button>
        <Button variant="secondary" onClick={retourVersPage} style={{ width: '28%', marginLeft: '2%' }}>
          Annuler
        </Button>
      </div>

      </Form>
    </div>
  );
};

export default UpdateEvent;
