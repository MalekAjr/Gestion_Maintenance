import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsFillPlusSquareFill } from 'react-icons/bs';
import { Table, Button, Modal } from 'react-bootstrap';
import LoadingSpinner from '../../LoadingSpinner';
import Navbar from '../../NavBar/Navbar';
import postService from '../../../services/postService';

function ShowTicketsAdmin() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

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
        <div className="col">
          <h1 className="mb-5">Liste des Tickets</h1>
        </div>
        <div className="col-auto">
          <Link to="/admin/createticket" className="btn btn-success mb-3">
            <BsFillPlusSquareFill /> Créer un ticket
          </Link>
        </div>
      </div>

      <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />
      
      {filteredTickets.length > 0 && (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="thead-dark">
              <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Priorité</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket._id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.category}</td>
                  <td>
                    <Link to={`/admin/details/${ticket._id}`} className="btn btn-primary me-2">
                      Voir Détails
                    </Link>
                    <Button variant="danger" onClick={() => handleDeleteTicket(ticket._id, ticket.title)}>
                      Supprimer
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
