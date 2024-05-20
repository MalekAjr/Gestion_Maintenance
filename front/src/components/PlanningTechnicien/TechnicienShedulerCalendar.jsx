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
import { useNavigate } from 'react-router-dom';

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
    const clientData = {
      userName: selectedEvent.userName,
      // Ajoutez d'autres données client si nécessaire
    };
    navigate('/createficheIntervention', { state: { clientData } });
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
  
  
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
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
            <Button variant="warning" onClick={handleNavigation}>Créer cette intervention</Button>
            <div>
              <Button variant="primary" onClick={handleUpdateEvent}>Tâche effectuée</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
            </div>
          </div>
        </Modal.Footer>

      </Modal>
    </div>
  );
};

export default TechnicienSchedulerCalendar;
