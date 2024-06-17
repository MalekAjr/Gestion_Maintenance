import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import adminService from '../../../services/adminService';
import Navbar from '../../NavBar/Navbar';
import { BsFillArrowLeftSquareFill, BsFillPlusSquareFill, BsPencilSquare, BsTrash } from 'react-icons/bs';

const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await adminService.getEvents();
      if (response.data.success === true) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US');
    }
    return dateString;
  };
  
  const filteredEvents = events.filter(event => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return Object.values(event).some(value => {
      if (typeof value === 'string') {
        const formattedValue = formatDateString(value);
        return formattedValue.toLowerCase().includes(lowerCaseQuery);
      } else if (typeof value === 'number' && value.toString().toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      return false;
    });
  });

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Time";
    }
  
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };
  
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString('en-US');
  };
  
   /*
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    try {
      if (query === "") {
        const response = await adminService.getEvents();
        setEvents(response.data.data);
      } else {
        const response = await adminService.searchEventOneUser(query);
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error("Error searching ordres missions:", error);
    }
  };
  */
 
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    try {
      if (query === "") {
        const response = await adminService.getEvents();
        setEvents(response.data.data);
      } else {
        const response = await adminService.searchEventOneUser(query);
        const filteredData = response.data.data.filter(ordre => {
          // Convertir les heures à rechercher en format hh:mm
          const queryTime = query.trim().split(' ')[0];
          const queryHour = parseInt(queryTime.split(':')[0]);
          const queryMinute = parseInt(queryTime.split(':')[1]);
  
          const startHour = ordre.startHour.split(':');
          const endHour = ordre.endHour.split(':');
  
          const ordreStartHour = parseInt(startHour[0]);
          const ordreStartMinute = parseInt(startHour[1]);
          const ordreEndHour = parseInt(endHour[0]);
          const ordreEndMinute = parseInt(endHour[1]);
  
          if (
            (ordreStartHour === queryHour && ordreStartMinute === queryMinute) ||
            (ordreEndHour === queryHour && ordreEndMinute === queryMinute)
          ) {
            return true;
          }
          return false;
        });
        setEvents(filteredData);
      }
    } catch (error) {
      console.error("Error searching ordres missions:", error);
    }
  };


  
  const handleDeleteEvent = async (eventId, eventTitle) => {
    setEventToDelete({ id: eventId, title: eventTitle });
    setShowConfirmationModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminService.deleteEvent(eventToDelete.id);
      const updatedEvents = events.filter(event => event._id !== eventToDelete.id);
      setEvents(updatedEvents);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
          <div className="col-auto">
              <Link to="/admin/dashboard" className="btn mb-3" style={{ color: 'green' }}>
                  <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
              </Link>
          </div>
          <div className="col text-center">
              <h1 className="mb-5">Liste Des Evenements</h1>
          </div>
          <div className="col-auto text-end">
              <Link to="/admin/create-event" className="btn btn-success mb-3">
                  <BsFillPlusSquareFill size={30} /> Créer un Evenement
              </Link>
          </div>
      </div>
      <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Titre</th>
              <th scope="col">Description</th>
              <th scope="col">Date Début</th>
              <th scope="col">Temps Début</th>
              <th scope="col">Date Fin</th>
              <th scope="col">Temps Fin</th>
              <th scope="col">Technicien Concerné</th>
              <th scope="col">Voiture Utilisé</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{formatDate(event.start)}</td>
                  <td>{formatTime(event.start)}</td>
                  <td>{formatDate(event.end)}</td>
                  <td>{formatTime(event.end)}</td>
                  <td>{event.technicienName}</td>
                  <td>{event.carName}</td>
                  <td>
                    <div className="d-flex justify-content-between">
                      <Link to={`/admin/updateevent/${event._id}`} className="btn btn-success me-2 btn-block">
                      <BsPencilSquare className="me-1" />
                        Modifier
                      </Link>
                      <button onClick={() => handleDeleteEvent(event._id, event.title)} className="btn btn-danger btn-block">
                      <BsTrash className="me-1" />
                        Supprimer
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">Pas D'événements trouver</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the event "{eventToDelete ? eventToDelete.title : ''}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirm
          </Button> 
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShowEvents;
