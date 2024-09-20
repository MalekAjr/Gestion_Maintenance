import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsFillArrowLeftSquareFill, BsFillPlusSquareFill } from 'react-icons/bs';
import { Table, } from 'react-bootstrap';
import LoadingSpinner from '../LoadingSpinner';
import Navbar from '../NavBar/Navbar';
import postService from '../../services/postService';

function ShowTicketsClient() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await postService.getTicketsUser();
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
        const response = await postService.getTicketsUser();
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
  /*
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
*/

  if (loading || !tickets) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
     <div className="row align-items-center">
      <div className="col-auto">
        <Link to="/dashboard" className="btn mb-3" style={{ color: 'green' }}>
          <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
        </Link>
      </div>
      <div className="col mx-auto text-center">
        <h1 className="mb-5">Liste des Tickets</h1>
      </div>
      <div className="col-auto">
        <Link to="/createticketclient" className="btn btn-success mb-3">
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
                  <td>
                  <span className={ticket.priority.toLowerCase() === 'haute' ? 'text-danger' : ticket.priority.toLowerCase() === 'moyenne' ? 'text-warning' : ticket.priority.toLowerCase() === 'basse' ? 'text-primary' : ''}>
                    {ticket.priority}
                  </span>
                </td>
                  <td>{ticket.category}</td>
                  <td>
                    <Link to={`/ticketdetails/${ticket._id}`} className="btn btn-primary me-2">
                      Voir Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default ShowTicketsClient;
