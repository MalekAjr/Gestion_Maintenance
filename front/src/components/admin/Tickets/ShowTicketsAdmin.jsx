import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCalendar, BsCheck, BsFillArrowLeftSquareFill, BsFillPlusSquareFill, BsInfoCircle, BsTrash } from 'react-icons/bs';
import { Table, Button, Modal } from 'react-bootstrap';
import LoadingSpinner from '../../LoadingSpinner';
import Navbar from '../../NavBar/Navbar';
import postService from '../../../services/postService';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function ShowTicketsAdmin() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const iconSize = 24;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await postService.getTickets();
        setTickets(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des tickets :', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    try {
      if (query === "") {
        const response = await postService.getTickets();
        setTickets(response.data.data);
      } else {
        const response = await postService.searchTicketsOneUser(query);
        setTickets(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche des tickets :", error);
    }
  };

  const handleTaskCompleted = async (ticketId) => {
    try {
      const updatedTicket = {
        _id: ticketId,
        statutticket: 2
      };

      const response = await postService.updateTicket(ticketId, updatedTicket);
      if (response.data.success === true) {
        setMessage('Tâche effectuée avec succès.');
        const updatedTickets = tickets.map(ticket =>
          ticket._id === ticketId ? { ...ticket, statutticket: 2 } : ticket
        );
        setTickets(updatedTickets);
      } else {
        setMessage('Échec de la mise à jour de la tâche.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche :', error);
      setMessage('Une erreur s\'est produite. Veuillez réessayer.');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    return Object.entries(ticket).some(([key, value]) =>
      typeof value === 'string' && value.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const handleDeleteTicket = async (ticketId, ticketTitle) => {
    setTicketToDelete({ id: ticketId, title: ticketTitle });
    setShowConfirmationModal(true);
  };

  const confirmDelete = async () => {
    try {
      await postService.deleteTicket(ticketToDelete.id);
      const updatedTickets = tickets.filter(ticket => ticket._id !== ticketToDelete.id);
      setTickets(updatedTickets);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du ticket :", error);
      alert("Une erreur s'est produite lors de la suppression du ticket.");
    }
  };

  if (loading || !tickets) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container"> 
     <div className="row align-items-center">
          <div className="col-auto">
              <Link to="/admin/dashboard" className="btn mb-3" style={{ color: 'green' }}>
                  <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
              </Link>
          </div>
          <div className="col text-center">
              <h1 className="mb-5">Liste des Tickets</h1>
          </div>
          <div className="col-auto text-end">
              <Link to="/admin/createticket" className="btn btn-success mb-3">
                  <BsFillPlusSquareFill size={30} /> Créer un ticket
              </Link>
          </div>
      </div>

      {message && (
      <div className={`alert ${message.includes('succès') ? 'alert-success' : 'alert-danger'}`} role="alert">
        {message}
      </div>
    )}
    
      <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />

      {filteredTickets.length > 0 && (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="thead-dark">
              <tr>
                <th>id ticket</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Priorité</th>
                <th>Catégorie</th>
                <th>Demandé Par(Client)</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket._id}>
                  <td>{ticket._id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.category}</td>
                  <td>{ticket.user_nom}</td>
                  <td>
                    {ticket.statutticket === 2 ? (
                      <div className="d-flex align-items-center">
                        <FaCheckCircle color="#32CD32" size={24} className="me-2" />
                        <span style={{ color: '#32CD32' }}>Ticket Cloturée</span>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center">
                        <FaTimesCircle color="red" size={24} className="me-2" />
                        <span style={{ color: 'red' }}>Pas encore</span>
                      </div>
                    )}
                  </td>
                  <td className="d-flex justify-content-around align-items-center">
                  <Link to={`/admin/details/${ticket._id}`} className="btn btn-primary btn-sm d-flex align-items-center me-2">
                    <BsInfoCircle className="me-1" size={iconSize} /> Voir Détails
                  </Link>
                  <Button
                    variant="info"
                    className="btn-sm d-flex align-items-center me-2"
                    onClick={() => navigate('/admin/scheduler', {
                      state: {
                        showModel: true,
                        category: ticket.category,
                        user_nom: ticket.user_nom,
                        priority: ticket.priority,
                        ticketId: ticket._id
                      }
                    })}
                  >
                    <BsCalendar className="me-1" size={iconSize} /> Créer ce planning
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-sm d-flex align-items-center me-2"
                    style={{ height: "55px"}}
                    onClick={() => handleDeleteTicket(ticket._id, ticket.title)}
                  >
                    <BsTrash className="me-1" size={iconSize} /> Supprimer
                  </Button>
                  <Button
                    variant="success"
                    className="btn-sm d-flex align-items-center"
                    style={{ height: "55px"}}
                    onClick={() => handleTaskCompleted(ticket._id)}
                  >
                    <BsCheck className="me-1" size={36}/> Tâche Effectuée
                  </Button>
                </td>

                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le ticket "{ticketToDelete ? ticketToDelete.title : ''}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ShowTicketsAdmin;
