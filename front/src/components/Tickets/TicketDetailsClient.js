import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import LoadingSpinner from '../LoadingSpinner';
import postService from '../../services/postService';

function TicketDetailsClient() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await postService.getOneTicket(id);
        setTicket(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération du ticket :', error);
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading || !ticket) {
    return <LoadingSpinner />;
  }

  const priorityColorClass = () => {
    switch (ticket.priority.toLowerCase()) {
      case 'basse':
        return 'text-primary';
      case 'moyenne':
        return 'text-warning';
      case 'haute':
        return 'text-danger';
      default:
        return '';
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Card style={{ width: '30rem' }}>
        <Card.Body>
          <Card.Title className="text-center">Détails du Ticket</Card.Title>
          <Card.Text>
            <p>Titre: {ticket.title}</p>
            <p>Description: {ticket.description}</p>
            <p>
              Priorité: <span className={priorityColorClass()}>{ticket.priority}</span>
            </p>
            <p>
              Catégorie: <span>{ticket.category}</span>
            </p>
            <p>Date de création: {new Date(ticket.createdAt).toLocaleDateString()}</p>
            <p>Heure de création: {new Date(ticket.createdAt).toLocaleTimeString()}</p>
            <p>Date de modification: {new Date(ticket.updatedAt).toLocaleDateString()}</p>
            <p>Heure de modification: {new Date(ticket.updatedAt).toLocaleTimeString()}</p>
          </Card.Text>
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={() => navigate('/showticketclient')}>
              Voir Mes Tickets
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TicketDetailsClient;
