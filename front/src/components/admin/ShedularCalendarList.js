import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import adminService from '../../services/adminService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import './SchedulerCalendar.css'
import withAuthorization from '../authorization/withAuthorization';
import imguser from '../../../src/imgs/img_client.png';
import imgtech from '../../../src/imgs/img_technicien.png';
import imgvoiture from '../../../src/imgs/img_voiture.jpg';


const localizer = momentLocalizer(moment);
// ItemTypes.js
export const ItemTypes = {
  USER: 'USER',
  TECHNICIEN: 'TECHNICIEN',
  CAR: 'CAR',
};

const ShedularCalendarList = () => {
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedUserNames, setSelectedUserNames] = useState([]);
  const [selectedTechnicienNames, setSelectedTechnicienNames] = useState([]);

  const [userName, setUserName] = useState('');
  const [technicienName, setTechnicienName] = useState('');
  const [updateClicked, setUpdateClicked] = useState(false);
  const [date, setDate] = useState();
  const [carName, setCarName] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [technicienOptions, setTechnicienOptions] = useState([]);
  const [carOptions, setCarOptions] = useState([]);
  const [travelHours, setTravelHours] = useState(''); 
  const initialTime = '00:00';
  const [selectedTime, setSelectedTime] = useState(initialTime);


  const updateEventsWithColor = (events, updatedEvent) => {
  const updatedEvents = events.map((event) => {
    if (updatedEvent && event._id === updatedEvent._id) {
      // Updated event
      if (updatedEvent.statut === 2) {
        // Set background color to green if statut is 2
        return { ...updatedEvent, backgroundColor: 'yellow' };
      } else if (updatedEvent.start < new Date() && updatedEvent.end > new Date()) {
        // Ongoing event
        return { ...updatedEvent, backgroundColor: 'yellow' };
      } else if (updatedEvent.start > new Date()) {
        // Future event
        return { ...updatedEvent, backgroundColor: '#32CD32' };
      } else {
        // Past event
        return { ...updatedEvent, backgroundColor: 'gray' };
      }
    } else {
      // Other events
      if (event.statut === 2) {
        // Set background color to green if statut is 2
        return { ...event, backgroundColor: 'yellow' };
      } else if (event.start < new Date() && event.end > new Date()) {
        // Ongoing event
        return { ...event, backgroundColor: 'yellow' };
      } else if (event.start > new Date()) {
        // Future event
        return { ...event, backgroundColor: '#32CD32' };
      } else {
        // Past event
        return { ...event, backgroundColor: 'gray' };
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

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedStart || !selectedEnd || !title || !description) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
  
    try {
      let formData = {
        title,
        description,
        start: selectedStart,
        end: selectedEnd,
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
      console.error('Error creating/updating Event:', error);
      setMessage('An error occurred. Please try again.');
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

  const handleStartDatePicker = () => {
    setShowStartDatePicker(!showStartDatePicker);
  };

  const handleEndDatePicker = () => {
    setShowEndDatePicker(!showEndDatePicker);
  };

  const handleStartTimePicker = () => {
    setShowStartTimePicker(!showStartTimePicker);
  };

  const handleEndTimePicker = () => {
    setShowEndTimePicker(!showEndTimePicker);
  };

  const handleStartDateChange = (date) => {
    setSelectedStart(date);
    setShowStartDatePicker(false);
    // filterTechniciens(date, selectedEnd);
  };

  const handleEndDateChange = (date) => {
    setSelectedEnd(date);
    setShowEndDatePicker(false);
   // filterTechniciens(selectedStart, date);

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
      setTechnicienName(selectedEvent.technicienName || ''); // Corrected line
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
          style={{ height: '400px', width: '100%' }}
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
        <Col xs={12} md={6} className="mb-3">
        <Form.Group controlId="startDate">
          <Form.Label className="start-date-label">Date de début</Form.Label>
          <InputGroup className="align-items-center">
            <InputGroup.Text className="d-inline-flex">
              <FaCalendarAlt className="date-picker-icon" />
            </InputGroup.Text>
            <input
              type='date'
              onChange={handleStartDateChange}
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
                <Form.Group controlId="travelHours">
                  <Form.Label className="start-date-label">Heures de Trajet</Form.Label>
                  <InputGroup>
                    <FormControl
                      type="text"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      placeholder="Entrez les heures de trajet"
                      className="form-control"
                    />
                    <InputGroup.Text><FaClock /></InputGroup.Text>
                    <Button variant="outline-secondary" onClick={handleTimeDecrease}><FaCaretDown /></Button>
                    <Button variant="outline-secondary" onClick={handleTimeIncrease}><FaCaretUp /></Button>
                  </InputGroup>
                </Form.Group>
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
                <option value="">Sélectionner un client</option>
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



              <Button variant="primary" type="submit">
                {selectedEvent ? 'Modifier l\'intervention' : 'Ajouter l\'intervention'}
              </Button>
              {selectedEvent && (
                <Button variant="danger" onClick={handleDeleteEvent}>
                  Supprimer l'intervention
                </Button>
              )}
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(ShedularCalendarList);
