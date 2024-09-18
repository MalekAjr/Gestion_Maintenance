import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {  useDrop } from 'react-dnd';
import adminService from '../../services/adminService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaCaretUp, FaCaretDown, FaCheckCircle } from 'react-icons/fa';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import './SchedulerCalendar.css'
import withAuthorization from '../authorization/withAuthorization';
import imguser from '../../../src/imgs/img_client.png';
import imgtech from '../../../src/imgs/img_technicien.png';
import imgvoiture from '../../../src/imgs/img_voiture.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const localizer = momentLocalizer(moment);
// ItemTypes.js
export const ItemTypes = {
  USER: 'USER',
  TECHNICIEN: 'TECHNICIEN',
  CAR: 'CAR',
};

const SchedulerCalendar = (props) => {
  const location = useLocation();

  const { category, user_nom, /*priority, */ ticketId, showModel } = location.state || {};
  const [showModal, setShowModal] = useState(showModel);
  const [userName, setUserName] = useState(user_nom || '');
  
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [selectedhoursTravel, setSelectedHoursTravel] = useState(0);
  const [showHoursTimePicker, setShowHoursTimePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

 // const [selectedUserNames, setSelectedUserNames] = useState([]);
 // const [selectedTechnicienNames, setSelectedTechnicienNames] = useState([]);

  const [technicienName, setTechnicienName] = useState('');
  const [updateClicked, setUpdateClicked] = useState(false);
 // const [date, setDate] = useState();
  const [carName, setCarName] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [technicienOptions, setTechnicienOptions] = useState([]);
  const [carOptions, setCarOptions] = useState([]);
 // const [travelHours, setTravelHours] = useState(''); 
  const initialTime = '00:00';
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const navigate = useNavigate();


 
  
  useEffect(() => {
    setShowModal(showModel || false);
  }, [showModel]);

  useEffect(() => {
    setTitle(category || '');

    setUserName(user_nom || '');
  }, [category, user_nom]);

  const updateEventsWithColor = (events, updatedEvent) => {
    const updatedEvents = events.map((event) => {
      const now = new Date();
  
      if (updatedEvent && event._id === updatedEvent._id) {
        // Updated event
        if (updatedEvent.statut === 2) {
          return { ...updatedEvent, backgroundColor: 'yellow' }; // Modification
        } else if (new Date(updatedEvent.start) < now && new Date(updatedEvent.end) > now) {
          return { ...updatedEvent, backgroundColor: 'yellow' }; // En cours et modification
        } else if (new Date(updatedEvent.start) > now) {
          return { ...updatedEvent, backgroundColor: '#32CD32' }; // Futur
        } else {
          return { ...updatedEvent, backgroundColor: 'gray' }; // Passé
        }
      } else {
        // Other events
        if (event.statut === 2) {
          return { ...event, backgroundColor: 'yellow' }; // Modification
        } else if (new Date(event.start) < now && new Date(event.end) > now) {
          return { ...event, backgroundColor: 'Blue' }; // En cours et modification
        } else if (new Date(event.start) > now) {
          return { ...event, backgroundColor: '#32CD32' }; // Futur
        } else {
          return { ...event, backgroundColor: 'gray' }; // Passé
        }
      }
    });
  
    return updatedEvents;
  };
  



  const handleSelectEvent = (event) => {
    setSelectedStart(event.start);
    setSelectedEnd(event.end);
    setSelectedEvent(event);
    setUserName(event.userName || '');
    setTechnicienName(event.technicienName || '');
    setCarName(event.carName || '');
    setSelectedHoursTravel(event.hoursTravel || 0);
    setShowModal(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedStart(slotInfo.start);
    setSelectedEnd(slotInfo.end);
    setShowModal(true);
  };

  const handleTimeIncrease = () => {
    const time = moment(selectedTime, 'HH:mm').add(30, 'minutes').format('HH:mm');
    setSelectedTime(time);
  };

  const handleTimeDecrease = () => {
    const time = moment(selectedTime, 'HH:mm').subtract(30, 'minutes').format('HH:mm');
    setSelectedTime(time);
  };


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handleTechnicienNameChange = (e) => {
    setTechnicienName(e.target.value);
  };
  const handleCarChange = (e) => {
    setCarName(e.target.value);
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    setTitle('');
    setDescription('');
    setSelectedEvent(null);
    setUserName('');
    setTechnicienName('');
  };

  const handleStartTimeIncrease = () => {
    setSelectedStart(moment(selectedStart).add(1, 'hour').toDate());
  };

  const handleStartTimeDecrease = () => {
    setSelectedStart(moment(selectedStart).subtract(1, 'hour').toDate());
  };

  const handleEndTimeIncrease = () => {
    setSelectedEnd(moment(selectedEnd).add(1, 'hour').toDate());
  };

  const handleEndTimeDecrease = () => {
    setSelectedEnd(moment(selectedEnd).subtract(1, 'hour').toDate());
  };

  const handleHoursTimeIncrease = () => {
    setSelectedHoursTravel(moment(selectedhoursTravel).add(1, 'hour').toDate());
  };

  const handleHoursTimeDecrease = () => {
    setSelectedHoursTravel(moment(selectedhoursTravel).subtract(1, 'hour').toDate());
  };

  const isValidTime = (value) => {
    return moment(value, 'HH:mm', true).isValid();
  };
  
  const handleHoursTravelChange = (e) => {
    const value = e.target.value;
    if (isValidTime(value)) {
      setSelectedHoursTravel(moment(`2022-01-01 ${value}`).toDate());
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();

      const filteredUsers = response.data.users.filter(user => user.role === 'utilisateur');
      setUserOptions(filteredUsers);

      
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  useEffect(() => {
    const getTechniciens = async (startDate, endDate) => {
      try {
        const response = await adminService.getTechniciens(startDate, endDate);
        const filteredTechniciens = response.data.data;
        setTechnicienOptions(filteredTechniciens);
      } catch (error) {
        console.error('Error fetching techniciens:', error);
      }
    };
  
    if (selectedStart && selectedEnd) {
      getTechniciens(selectedStart, selectedEnd);
    }
  }, [selectedStart, selectedEnd]);
  

  useEffect(() => {
    const getCarsSansEvents = async (startDate, endDate) => {
      try {
        const response = await adminService.getVoituresSansEvenements(startDate, endDate);
        const filteredVoitures = response.data.data;
        setCarOptions(filteredVoitures);
      } catch (error) {
        console.error('Error fetching Voitures:', error);
      }
    };
  
    if (selectedStart && selectedEnd) {
      getCarsSansEvents(selectedStart, selectedEnd);
    }
  }, [selectedStart, selectedEnd]);

  useEffect(() => {
  //filterTechniciens(selectedStart, selectedEnd, selectedEvent?._id);
}, [selectedStart, selectedEnd, selectedEvent]);

  
const handleNavigation = () => {
  const clientData = {
    userName: selectedEvent.userName,
    heurestart: selectedEvent.start,
    heureend: selectedEvent.end,
    heureTrajet: selectedEvent.hoursTravel,
    ticketId: selectedEvent.ticketId
  };
  console.log("Heure Trajet:", selectedEvent.hoursTravel); // Ajout du console.log

  navigate('/createficheIntervention', { state: { clientData } });
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedStart || !selectedEnd || !title || !description) {
      Swal.fire({
        icon: 'error',
        iconColor: '#d9534f',
        text: 'Veuillez remplir tous les champs.'
    });
      return;
    }
  
    if (selectedStart >= selectedEnd) {
      Swal.fire({
          icon: 'error',
          iconColor: '#d9534f',
          text: 'La date de début doit être antérieure à la date de fin.'
      });
      return;
    }
    if (selectedStart.toDateString() === selectedEnd.toDateString() && selectedStart >= selectedEnd) {
      Swal.fire({
        icon: 'error',
        iconColor: '#d9534f',
        text: "L'heure de fin doit être postérieure à l'heure de début."
    });
      return;
    }

    try {
      let formData = {
        title,
        description,
        start: selectedStart,
        end: selectedEnd,
        hoursTravel: selectedhoursTravel,
        ticketId: ticketId,
       // userId: selectedUserNames.map((user) => user.value)[0], // Prend le premier ID utilisateur sélectionné
        userName,
        technicienName,
        carName,
      };
  
      let updatedEvent = null;
      if (selectedEvent) {
        // Update existing event
        updatedEvent = { ...selectedEvent, ...formData };
  
        // Automatically set statut to 2 for updates
        updatedEvent.statut = 2;
  
        const response = await adminService.updateEvent(updatedEvent);
        if (response.data.success === true) {
          setMessage('Event updated successfully.');
          window.location.reload();
        } else {
          setMessage('Event update failed.');
          return;
        }
      } else {
        // Create new event
        const response = await adminService.createEvent(formData);
        if (response.data.success === true) {
          setMessage('Event created successfully.');
          setShowModal(false);
          window.location.reload();
        } else {
          setMessage('Event creation failed.');
          return;
        }
      }
  
      // Update events with colors
      const updatedEventsWithColor = updateEventsWithColor(events, updatedEvent);
      setEvents(updatedEventsWithColor);
    } catch (error) {
      console.error('Une erreur création/Modification Evenement:', error);
      Swal.fire('Une erreur s\'est produite. Veuillez réessayer.');
    }
  };
  
  
  const fetchEvents = async () => {
    try {
      const response = await adminService.getEvents();
      if (response.data.success === true) {
        const formattedEvents = response.data.data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        const updatedEvents = updateEventsWithColor(formattedEvents);
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUpdateClicked = localStorage.getItem('updateClicked');
        if (storedUpdateClicked) {
          setUpdateClicked(JSON.parse(storedUpdateClicked));
        }
        await fetchEvents();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const saveUpdateClickedToLocalStorage = () => {
      localStorage.setItem('updateClicked', JSON.stringify(updateClicked));
    };

    saveUpdateClickedToLocalStorage();
  }, [updateClicked]);

  const handleDeleteEvent = async () => {
    if (!selectedEvent) {
      return;
    }

    try {
      const response = await adminService.deleteEvent(selectedEvent._id);
      if (response.data.success === true) {
        setMessage('Event deleted successfully.');
        setSelectedEvent(null);
        setShowModal(false);
        fetchEvents();
        setUpdateClicked(true);
      } else {
        setMessage('Event deletion failed.');
      }
    } catch (error) {
      console.error('Error deleting Event:', error);
      setMessage('An error occurred. Please try again.');
    }
  };


  const handleStartTimePicker = () => {
    setShowStartTimePicker(!showStartTimePicker);
  };

  const handleEndTimePicker = () => {
    setShowEndTimePicker(!showEndTimePicker);
  };

  const handleHoursTimePicker  = () => {
    setShowHoursTimePicker (!showHoursTimePicker);
  };

  const handleStartDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setSelectedStart(date);
      setShowStartDatePicker(false);
    } else {
      console.error("Invalid date:", date);
    }
  };

  const handleEndDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setSelectedEnd(date);
      setShowEndDatePicker(false);
    } else {
      console.error("Invalid date:", date);
    }
  };

  /*
  const filterTechniciens = async (start, end, selectedEventId) => {
    try {
      const overlappingEventsResponse = await adminService.getOverlappingEvents(start, end);
      const overlappingEvents = overlappingEventsResponse.data;
  
      const techniciensAssigned = overlappingEvents.map(event => event.technicienName);
  
      // Si un ID d'événement est fourni, excluez le technicien correspondant à cet événement
      if (selectedEventId) {
        const selectedEvent = await adminService.getEvent(selectedEventId);
        if (selectedEvent && selectedEvent.data && selectedEvent.data.technicienName) {
          const technicienToDeleteIndex = techniciensAssigned.indexOf(selectedEvent.data.technicienName);
          if (technicienToDeleteIndex !== -1) {
            techniciensAssigned.splice(technicienToDeleteIndex, 1);
          }
        }
      }
  
      // Maintenant, on va filtrer les techniciens qui ne sont pas déjà assignés
      const filteredTechniciens = technicienOptions.filter(technicien => {
        return !techniciensAssigned.includes(technicien.nom);
      });
  
      setTechnicienOptions(filteredTechniciens);
    } catch (error) {
      console.error("Error filtering techniciens:", error);
    }
  };
  
  */

  const handleStartTimeChange = (time) => {
    setSelectedStart(moment(time).toDate());
    setShowStartTimePicker(false);
  };

  const handleEndTimeChange = (time) => {
    setSelectedEnd(moment(time).toDate());
    setShowEndTimePicker(false);
  };

  const handleHoursTimeChange = (time) => {
    setSelectedHoursTravel(moment(time).toDate());
    setShowHoursTimePicker(false);
  };

  const saveEvent = async (event) => {
    try {
      if (event._id) {
        const response = await adminService.updateEvent(event);
        if (response.data.success === true) {
          console.log('Event updated successfully.');
        } else {
          console.log('Event update failed.');
        }
      } else {
        const response = await adminService.createEvent(event);
        if (response.data.success === true) {
          console.log('Event created successfully.');
        } else {
          console.log('Event creation failed.');
        }
      }
    } catch (error) {
      console.error('Error saving Event:', error);
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || '');
      setDescription(selectedEvent.description || '');
      setSelectedStart(selectedEvent.start || null);
      setSelectedEnd(selectedEvent.end || null);
      setUserName(selectedEvent.userName || '');
      setTechnicienName(selectedEvent.technicienName || '');
      setSelectedHoursTravel(selectedEvent.hoursTravel);
      setUpdateClicked(false);
    }
  }, [selectedEvent]);
  

  const Event = ({ event, handleSelectEvent }) => {
    const [eventUserName, setEventUserName] = useState(event.userName || '');
    const [eventTechnicienName, setEventTechnicienName] = useState(event.technicienName || '');
    const [eventCarName, setEventCarName] = useState(event.carName || '');
  
    const handleDropUser = (item) => {
      if (item && item.role === "technicien") {
        setEventTechnicienName(item.nom);
        const updatedEvent = { ...event, technicienName: item.nom };
        saveEvent(updatedEvent);
        setUpdateClicked(true);
      } else if (item && item.role === "utilisateur") {
        setEventUserName(item.nom);
        const updatedEvent = { ...event, userName: item.nom };
        saveEvent(updatedEvent);
        setUpdateClicked(true);
      }
      //window.location.reload()
    };
  
    const handleDropTechnicien = (item) => {
      if (item && item.role === "technicien") {
        setEventTechnicienName(item.nom);
        const updatedEvent = { ...event, technicienName: item.nom };
        saveEvent(updatedEvent);
        setUpdateClicked(true);
      } else {
        setEventUserName(item.nom);
        const updatedEvent = { ...event, userName: item.nom };
        saveEvent(updatedEvent);
        setUpdateClicked(true);
      }
      window.location.reload()
    };
  
    const handleDropCar = (item) => {
      if (item) {
        setEventCarName(item.matricule);
        const updatedEvent = { ...event, carName: item.matricule };
        saveEvent(updatedEvent);
        setUpdateClicked(true);
      }
      window.location.reload()
    };
  
    useEffect(() => {
      setEventUserName(event.userName || '');
      setEventTechnicienName(event.technicienName || '');
      setEventCarName(event.carName || '');
    }, [event.userName, event.technicienName, event.carName]);
  
    const [{ canDropUser, isOverUser }, dropUser] = useDrop({
      accept: ItemTypes.USER,
      drop: (item) => {
        if (item && item.nom) {
          handleDropUser(item);
        }
      },
    });
  
    const [{ canDropTechnicien, isOverTechnicien }, dropTechnicien] = useDrop({
      accept: ItemTypes.TECHNICIEN,
      drop: (item) => {
        if (item && item.nom) {
          handleDropTechnicien(item);
        }
      },
    });
  
    const [{ canDropCar, isOverCar }, dropCar] = useDrop({
      accept: ItemTypes.CAR,
      drop: (item) => {
        if (item && item.matricule) {
          handleDropCar(item);
        }
      },
    });
  
    const eventClassName = `event-item ${isOverUser ? 'user-over' : ''} ${isOverTechnicien ? 'technicien-over' : ''} ${isOverCar ? 'car-over' : ''}`;
  
    return (
      <div className={eventClassName} onClick={() => handleSelectEvent(event)}>
        <div
          ref={dropUser}
          className="user-drop-area"
          style={{
            border: `2px solid ${canDropUser ? 'green' : 'black'}`,
            backgroundColor: isOverUser ? 'lightgreen' : event.backgroundColor || 'white',
          }}
        >
        <div className="d-flex align-items-center">
        <img
          src={imguser}
          alt="Client"
          className="rounded-circle me-2"
          style={{ width: '50px', height: '50px' }}
        />
        <div>
          {eventUserName && <div><strong>Client: {eventUserName}</strong></div>}
        </div>
      </div>


     
          <div className="event-title" >
            <strong>{event.title}</strong>
          </div>
          <br />

          <div className="event-title" >
          {event.description}
          </div>
          <br/>
        </div>
        <div
          ref={dropTechnicien}
          className="technicien-drop-area"
          style={{
            border: `2px solid ${canDropTechnicien ? 'blue' : 'black'}`,
            backgroundColor: isOverTechnicien ? 'lightblue' : event.backgroundColor || 'white',
          }}
        >
        <div className="d-flex align-items-center">
        <img
          src={imgtech}
          alt="Client"
          className="rounded-circle me-2"
          style={{ width: '50px', height: '50px' }}
        />
          {eventTechnicienName && <div>Technicien: {eventTechnicienName}</div>}
          </div>
        </div>
        <div
          ref={dropCar}
          className="car-drop-area"
          style={{
            border: `2px solid ${canDropCar ? 'red' : 'black'}`,
            backgroundColor: isOverCar ? 'lightcoral' : event.backgroundColor || 'white',
          }}
        >
          <div className="d-flex align-items-center">
            <img
              src={imgvoiture}
              alt="Client"
              className="rounded-circle me-2"
              style={{ width: '50px', height: '50px' }}
            />
          <div className="event-title" >
          <div>Car: {eventCarName}</div>
          </div>
          <br/>
        </div>
        </div>
        {event.statuttechnicien === 2 && (
        <div className="d-flex align-items-center">
          <span>Tache éffectué</span>
          <FaCheckCircle color="#32CD32" size={24} />
        </div>
      )}
      </div>
    );
  };
  
  

  const formatDate = (date) => {
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setSelectedEnd(selectedDate);
  };

  const handleUpdateEvent = async () => {
    try {
      if (selectedEvent) {
        const updatedEvent = { ...selectedEvent, statuttechnicien: 2 };
        const response = await adminService.updateEvent(updatedEvent);
        if (response.data.success) {
          setShowModal(false);
          fetchEvents();
        } else {
          console.error('Failed to update event:', response.data.msg);
        }
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={['day', 'week', 'month']}
          style={{ margin: '50px', width: "1400px", height:"540px"}}
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          tooltipAccessor={(event) => (
            <div>
              <strong>{event.title}</strong>
              <br />
              {event.description}
            </div>
          )}
          components={{
            event: (eventProps) => <Event {...eventProps} handleSelectEvent={handleSelectEvent} />,
          }}
        />

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedEvent ? 'Modifier Une Intervention' : 'Ajouter Une Intervention'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Type de l'intervention</Form.Label>
              <Form.Control as="select" value={title} onChange={handleTitleChange}>
                <option value="">Sélectionner le type d'intervention</option>
                <option value="Technique">Technique</option>
                <option value="Facturation">Facturation</option>
                <option value="Autre">Autre</option>
              </Form.Control>
            </Form.Group>

                    <Row>
{/* Colonne pour la Date de Début */}
      <Col xs={12} md={6} className="mb-3">
        <Form.Group controlId="startDate">
          <Form.Label className="start-date-label">Date de début</Form.Label>
          <InputGroup className="align-items-center">
            <InputGroup.Text className="d-inline-flex">
              <FaCalendarAlt className="date-picker-icon" />
            </InputGroup.Text>
            <input
              type="date"
              onChange={(e) => handleStartDateChange(e.target.valueAsDate)}
              value={selectedStart ? formatDate(selectedStart) : ''}
              className="form-control custom-date-input"
            />
          </InputGroup>
        </Form.Group>

        {showStartDatePicker && (
          <DatePicker
            selected={selectedStart}
            onChange={handleStartDateChange}
            inline
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="inline-date-picker"
            calendarClassName="react-datepicker"
            dayClassName={(date) => {
              return date.toDateString() === new Date(selectedStart).toDateString()
                ? 'react-datepicker__day--selected'
                : date.toDateString() === new Date().toDateString()
                ? 'react-datepicker__day--today'
                : '';
            }}
          />
        )}
      </Col>



            {/* Colonne pour l'Heure de Début */}
            <Col xs={12} md={6} className="mb-3">
              <Form.Group controlId="startTime">
                <Form.Label className="start-date-label">Heure de début</Form.Label>
                <InputGroup>
                  <Button variant="outline-secondary" onClick={handleStartTimePicker}>
                    <FaClock />
                  </Button>
                  <FormControl
                    type="text"
                    value={selectedStart ? moment(selectedStart).format("HH:mm") : ''}
                    onChange={(e) => setSelectedStart(moment(`2022-01-01 ${e.target.value}`).toDate())}
                    onClick={handleStartTimePicker}
                    placeholder="Choisir l'heure de début"
                    className="form-control"
                  />
                  <InputGroup.Text><FaClock /></InputGroup.Text>
                  <Button variant="outline-secondary" onClick={handleStartTimeIncrease}>
                    <FaCaretUp />
                  </Button>
                  <Button variant="outline-secondary" onClick={handleStartTimeDecrease}>
                    <FaCaretDown />
                  </Button>
                </InputGroup>
              </Form.Group>

              {showStartTimePicker && (
                <DatePicker
                  selected={selectedStart}
                  onChange={handleStartTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="h:mm aa"
                  timeCaption="Time"
                  inline
                />
              )}
            </Col>
          </Row>

          <Row>
            {/* Colonne pour la Date de Fin */}
            <Col xs={12} md={6} className="mb-3">
            <Form.Group controlId="endDate">
                  <Form.Label className="start-date-label">Date de fin</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaCalendarAlt className="date-picker-icon" /></InputGroup.Text>
                    <input
                      DatePicker
                      type='date'
                      onChange={handleDateChange}
                      value={selectedEnd ? formatDate(selectedEnd) : ''}
                      className="form-control custom-date-input"
                      style={{}}
                    />
                  </InputGroup>
                </Form.Group>
            {showEndDatePicker && (
              <DatePicker
                selected={selectedEnd}
                onChange={handleEndDateChange}
                inline
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="inline-date-picker"
                calendarClassName="react-datepicker"
                dayClassName={(date) => {
                  return date.toDateString() === new Date(selectedEnd).toDateString()
                    ? 'react-datepicker__day--selected'
                    : date.toDateString() === new Date().toDateString()
                    ? 'react-datepicker__day--today'
                    : '';
                }}
              />
            )}
          </Col>

          {/* Colonne pour l'Heure de Fin */}
          <Col xs={12} md={6} className="mb-3">
            <Form.Group controlId="endTime">
              <Form.Label className="start-date-label">Heure de fin</Form.Label>
              <InputGroup>
                <FormControl
                  type="text"
                  value={selectedEnd ? moment(selectedEnd).format("HH:mm") : ''}
                  onChange={(e) => setSelectedEnd(moment(`2022-01-01 ${e.target.value}`).toDate())}
                  onClick={handleEndTimePicker}
                  placeholder="Choisir l'heure de fin"
                  className="form-control"
                />
                <InputGroup.Text><FaClock /></InputGroup.Text>
                <Button variant="outline-secondary" onClick={handleEndTimeDecrease}><FaCaretDown /></Button>
                <Button variant="outline-secondary" onClick={handleEndTimeIncrease}><FaCaretUp /></Button>
              </InputGroup>
            </Form.Group>
            {showEndTimePicker && (
              <DatePicker
                selected={selectedEnd}
                onChange={handleEndTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                timeCaption="Time"
                inline
              />
            )}
          </Col>
        </Row>
        <Row>
                {/* Colonne pour le Logo du Client */}
                <Col xs={12} md={6} className="mb-3 d-flex justify-content-center align-items-center">
                  <Form.Group controlId="clientLogo">
                    <Form.Label className="start-date-label">Logo du Client</Form.Label>
                    <div className="d-flex justify-content-center">
                      <img src={imguser} alt="Logo du client" className="client-logo" style={{ maxWidth: '50%', height: 'auto' }} />
                    </div>
                  </Form.Group>
                </Col>

                {/* Colonne pour les Heures de Trajet */}
                <Col xs={12} md={6} className="mb-3">
                  <Form.Group controlId="hoursTravel">
                    <Form.Label className="start-date-label">Heures de Trajet</Form.Label>
                    <InputGroup>
                      <FormControl
                        type="text"
                        value={selectedhoursTravel ? moment(selectedhoursTravel).format("HH:mm") : ''}
                        onChange={(e) => setSelectedHoursTravel(moment(`2022-01-01 ${e.target.value}`).toDate())}
                        onClick={handleHoursTimePicker}
                        placeholder="Choisir les heures de trajets"
                        className="form-control"
                      />
                      <InputGroup.Text><FaClock /></InputGroup.Text>
                      <Button variant="outline-secondary" onClick={handleHoursTimeDecrease}><FaCaretDown /></Button>
                      <Button variant="outline-secondary" onClick={handleHoursTimeIncrease}><FaCaretUp /></Button>
                    </InputGroup>
                  </Form.Group>
                  {showHoursTimePicker && (
                    <DatePicker
                      selected={selectedhoursTravel}
                      onChange={handleHoursTimeChange}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      dateFormat="h:mm aa"
                      timeCaption="Time"
                      inline
                    />
                  )}
                </Col>

              </Row>
              
              <Form.Group controlId="description">
                <Form.Label>Description de l'intervention</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Entrez la description de l'intervention"
                />
              </Form.Group>
              <Form.Group controlId="formUserName">
                <Form.Label>Nom de Client</Form.Label>
                <Form.Control as="select" value={userName} onChange={handleUserNameChange}>
                  {user_nom ? (
                    <option value={user_nom}>{user_nom}</option>
                  ) : (
                    <option value="">Sélectionner un client</option>
                  )}
                  {userOptions.map((client, index) => (
                    <option key={index} value={client.nom}>
                      {client.nom}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

            <Form.Group controlId="formTechnicienName">
              <Form.Label>Nom de Technicien</Form.Label>
              <Form.Control as="select" value={technicienName} onChange={handleTechnicienNameChange}>
                <option value="">Sélectionner un technicien</option>
                {technicienOptions.map((technicien, index) => (
                  <option key={index} value={technicien.nom}>
                    {technicien.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

          <Form.Group controlId="formCar">
            <Form.Label>Nom de voiture</Form.Label>
            <Form.Control as="select" value={carName} onChange={handleCarChange} custom>
              <option value="">Sélectionner une voiture</option>
              {carOptions.map((car, index) => (
                <option key={index} value={car.matricule}>
                  {car.matricule}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Modal.Footer>
      <div className="w-100 d-flex flex-column justify-content-between align-items-center">
        <div className="d-flex flex-column flex-md-row w-100 justify-content-between">
          <Button variant="primary" type="submit" size="sm" className="mx-2">
            {selectedEvent ? "Modifier l'intervention" : "Ajouter l'intervention"}
          </Button>
          {selectedEvent && (
            <>
              <Button variant="success" onClick={handleUpdateEvent} size="sm" className="mx-2">
                Tâche effectuée
              </Button>
              <Button onClick={handleNavigation} className="mb-2 mb-md-0 btn btn-warning text-white">
                Créer cette intervention
              </Button>
              <Button variant="danger" onClick={handleDeleteEvent} size="sm" className="mb-2 mb-md-0 ms-2">
                Supprimer l'intervention
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal.Footer>


             </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(SchedulerCalendar);
