import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import '../admin/SchedulerCalendar.css';
import imguser from '../../imgs/img_client.png';
import imgtech from '../../imgs/img_technicien.png';
import imgvoiture from '../../imgs/img_voiture.jpg';
import postService from '../../services/postService';
import adminService from '../../services/adminService';

import { Button, Modal } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';

const localizer = momentLocalizer(moment);

const TechnicienSchedulerCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchTechnicienEvents = async () => {
    try {
      const response = await postService.getPlanningOneTechnicien();
      if (response.data.success) {
        const formattedEvents = response.data.data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchTechnicienEvents();
  }, []);

  const handleNavigation = () => {
    if (selectedEvent) {
      const ticketId = selectedEvent.ticketId;
      console.log("Ticket ID passé:", ticketId);
      const clientData = {
        userName: selectedEvent.userName,
        heurestart: selectedEvent.start,
        heureend: selectedEvent.end,
        heureTrajet: selectedEvent.hoursTravel,
        ticketId: ticketId,
      };
      console.log("Heure Trajet:", selectedEvent.hoursTravel); // Ajout du console.log

      navigate('/createficheIntervention', { state: { clientData } });
    }
  };
  
  
  
  
  
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleUpdateEvent = async () => {
    try {
      if (selectedEvent) {
        const updatedEvent = { ...selectedEvent, statuttechnicien: 2 };
        const response = await adminService.updateEvent(updatedEvent);
        if (response.data.success) {
          setShowModal(false);
          fetchTechnicienEvents();
        } else {
          console.error('Failed to update event:', response.data.msg);
        }
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const Event = ({ event }) => {
    const { userName, technicienName, carName, title, description, statuttechnicien } = event;
  
    return (
      <div onClick={() => handleSelectEvent(event)}>
        <div className="d-flex align-items-center">
          <img
            src={imguser}
            alt="Client"
            className="rounded-circle me-2"
            style={{ width: '50px', height: '50px' }}
          />
          <div>
            {userName && <div><strong>Client: {userName}</strong></div>}
          </div>
        </div>
        <div className="event-title">
          <strong>{title}</strong>
        </div>
        <div className="event-description">
          {description}
        </div>
        <div className="technicien-drop-area">
          <div className="d-flex align-items-center">
            <img
              src={imgtech}
              alt="Technicien"
              className="rounded-circle me-2"
              style={{ width: '50px', height: '50px' }}
            />
            {technicienName && <div>Technicien: {technicienName}</div>}
          </div>
        </div>
        <div className="car-drop-area">
          <div className="d-flex align-items-center">
            <img
              src={imgvoiture}
              alt="Car"
              className="rounded-circle me-2"
              style={{ width: '50px', height: '50px' }}
            />
            <div className="event-title">
              <div>Car: {carName}</div>
            </div>
          </div>
        </div>
        {statuttechnicien === 2 && (
        <div className="d-flex align-items-center">
          <span>Tache éffectué</span>
          <FaCheckCircle color="#32CD32" size={24} />
        </div>
      )}
      </div>
    );
  };
  
  const handleSendEmailToClient = async () => {
    try {
      if (selectedEvent && selectedEvent.userName) {
        // Appeler getClientDetails avec le nom d'utilisateur du client
        const response = await postService.getClientDetails(selectedEvent.userName);
  
        // Vérifier si les détails du client ont été récupérés avec succès
        if (response.data && response.data.email) {
          // Récupérer l'adresse e-mail du client à partir de la réponse
          const clientEmail = response.data.email;
  
          // Envoyer l'e-mail au client en utilisant son adresse e-mail récupérée
          const emailResponse = await postService.sendEmail(clientEmail);
          console.log(emailResponse.data); // Si nécessaire
          alert('Email envoyé avec succès!');
        } else {
          // Aucune adresse e-mail n'a été trouvée pour le client
          alert('Aucune adresse e-mail client disponible');
        }
      } else {
        // Aucun nom d'utilisateur n'a été fourni
        alert('Nom d\'utilisateur client non spécifié');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail au client:', error);
      alert('Une erreur s\'est produite lors de l\'envoi de l\'e-mail au client.');
    }
  };
  

  
  
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
      <div className="col-auto">
              <Link to="/dashboard" className="btn mb-3" style={{ color: 'green' }}>
                  <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
              </Link>
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={['day', 'week', 'month']}
          style={{ height: 500, margin: '50px' }}
          components={{
            event: Event,
          }}
          selectable={false}
          onSelectSlot={() => {}}
          onSelectEvent={() => {}}
          onDoubleClickEvent={() => {}}
          resizable={false}
          draggable={false}
          onSelecting={() => false}
          onSelectingSlot={() => false}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'événement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <p><strong>Client:</strong> {selectedEvent.userName}</p>
              <p><strong>Type de l'intervention:</strong> {selectedEvent.title}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <p><strong>Technicien:</strong> {selectedEvent.technicienName}</p>
              <p><strong>Car:</strong> {selectedEvent.carName}</p>
              <p><strong>Date début:</strong> {moment(selectedEvent.start).format("dddd, MMMM Do YYYY, h:mm a")}</p>
              <p><strong>Date fin:</strong> {moment(selectedEvent.end).format("dddd, MMMM Do YYYY, h:mm a")}</p>
              <i className="fas fa-check-circle white"></i>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
  <div className="w-100 d-flex justify-content-between">
    <Button variant="warning" className="btn-block mr-2" onClick={handleNavigation}>
      Créer cette intervention
    </Button>
    <Button variant="success" className="btn-block mx-2" onClick={handleSendEmailToClient}>
      Envoi Email Au Client
    </Button>
    <Button variant="primary" className="btn-block ml-2" onClick={handleUpdateEvent}>
      Tâche effectuée
    </Button>
  </div>
</Modal.Footer>


      </Modal>
    </div>
  );
};

export default TechnicienSchedulerCalendar;
