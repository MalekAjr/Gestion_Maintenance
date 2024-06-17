import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { BsFillArrowLeftSquareFill, BsFillPlusSquareFill } from 'react-icons/bs';
import postService from '../../services/postService';
import LoadingSpinner from '../LoadingSpinner';
import Navbar from '../NavBar/Navbar';
import withAuthorization from '../authorization/withAuthorization';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function ServiceAchat() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState('');

  const fetchFichesbyID = async () => {
    try {
      setLoading(true);
      const response = await postService.getFiches();
      const updatedFiches = response.data.data.map(fiche => {
        return {
          ...fiche,
          hourlyRate: fiche.hourlyRate || 0, // Initialize to 0 if hourlyRate is not provided
        };
      });
      setFiches(updatedFiches);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fiches:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFichesbyID();
  }, []);

  
  const filteredFiches = fiches.filter(fiche => {
    const lowerCaseQuery = searchQuery.toLowerCase();
  
    return Object.entries(fiche).some(([key, value]) => {
      if (value === null || value === undefined) {
        return false;
      }
  
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseQuery);
      }
      if (typeof value === 'number') {
        return value.toString().includes(searchQuery);
      }
      if (key === 'hourlyRate' || key === 'prixUnitaire' || key === 'prixPiece' || key === 'prixHeures' || key === 'prixTotal') {
        return value.toString().includes(searchQuery);
      }
      return false;
    });
  });
  
  
  
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    try {
      const response = query === ""
        ? await postService.getFiches()
        : await postService.searchFiches(query);
      setFiches(response.data.data)
    } catch (error) {
      console.error("Error searching fiches:", error);
    }
  };
  

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      return "Invalid DateTime";
    }
    
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
    };
  
    return date.toLocaleString('fr-FR', options);
  };
  
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      return "Invalid DateTime";
    }
    
    const options = { 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
  
    return date.toLocaleString('fr-FR', options);
  };

  const calculateHoursWorked = (start, end) => {
    const startHours = new Date(start).getTime();
    const endHours = new Date(end).getTime();

    const differenceMs = Math.abs(endHours - startHours);
    const hours = Math.floor(differenceMs / (1000 * 60 * 60));
    const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));

    let result = '';
    if (hours > 0) {
      result += `${hours}H`;
    }
    if (minutes > 0) {
      result += ` et ${minutes} minutes`;
    }

    if (result === '') {
      result = '0 H et 0 minutes';
    }
    return result;
  };

  const calculatePiecePrice = (quantity, unitPrice) => {
    const qty = parseFloat(quantity);
    const price = parseFloat(unitPrice);
    return isNaN(qty) || isNaN(price) ? 0 : (qty * price).toFixed(2);
  };

  const calculateTotalHeuresPrice = (hoursWorked, hourlyRate) => {
    const [hoursPart, minutesPart] = hoursWorked.split('H');
    const hours = parseInt(hoursPart) || 0;
    const minutes = parseInt(minutesPart) || 0;

    // Convertir les heures et les minutes en décimal
    const totalDecimalHours = hours + (minutes / 60);
    const totalHourlyPrice = totalDecimalHours * parseFloat(hourlyRate);
    return isNaN(totalHourlyPrice) ? 0 : totalHourlyPrice.toFixed(2);
  };

  const calculateTotalPrice = (heuresPrice, piecePrice) => {
    return (parseFloat(heuresPrice) + parseFloat(piecePrice)).toFixed(2);
  };

  const generateInvoice = (fiche) => {
    const doc = new jsPDF();
    doc.text("Facture", 20, 20);
  
    doc.autoTable({
      startY: 30,
      head: [['Client', 'Heure Debut', 'Heure Fin', 'Heures Travaillées', 'Prix de l\'heure (Dinar(s))', 'Quantité', 'Prix Unitaire (Dinar(s))', 'Prix de la Pièce (Dinar(s))', 'Prix Des Heures (Dinar(s))', 'Prix Totales (Dinar(s))']],
      body: [[
        fiche.client,
        formatTime(fiche.heurestart),
        formatTime(fiche.heureend),
        calculateHoursWorked(fiche.heurestart, fiche.heureend),
        fiche.hourlyRate,
        fiche.quantite,
        fiche.prixUnitaire,
        calculatePiecePrice(fiche.quantite, fiche.prixUnitaire),
        calculateTotalHeuresPrice(calculateHoursWorked(fiche.heurestart, fiche.heureend), fiche.hourlyRate),
        calculateTotalPrice(
          calculateTotalHeuresPrice(calculateHoursWorked(fiche.heurestart, fiche.heureend), fiche.hourlyRate),
          calculatePiecePrice(fiche.quantite, fiche.prixUnitaire)
        ),
      ]],
    });
  
    const pageHeight = doc.internal.pageSize.height;
    const signatureY = pageHeight - 30;
    doc.text("Signature:", 20, signatureY);
    doc.line(50, signatureY, 150, signatureY);
  
    doc.save(`facture_${fiche.client}.pdf`);
  };
  
  const handleVerifyInvoice = async (ficheId) => {
    try {
      const ficheToUpdate = fiches.find(fiche => fiche._id === ficheId);
      
      if (!ficheToUpdate) {
        console.error("Fiche not found:", ficheId);
        return;
      }
  
      const updatedData = {
        statutservice: 2,
        hourlyRate: ficheToUpdate.hourlyRate,
        quantite: ficheToUpdate.quantite,
        prixUnitaire: ficheToUpdate.prixUnitaire,
        prixPiece: calculatePiecePrice(ficheToUpdate.quantite, ficheToUpdate.prixUnitaire),
        prixHeures: calculateTotalHeuresPrice(calculateHoursWorked(ficheToUpdate.heurestart, ficheToUpdate.heureend), ficheToUpdate.hourlyRate),
        prixTotal: calculateTotalPrice(
          calculateTotalHeuresPrice(calculateHoursWorked(ficheToUpdate.heurestart, ficheToUpdate.heureend), ficheToUpdate.hourlyRate),
          calculatePiecePrice(ficheToUpdate.quantite, ficheToUpdate.prixUnitaire)
        ),
      };
  
      await postService.updateFiche(ficheId, updatedData);
  
      const updatedFiches = fiches.map(fiche => {
        if (fiche._id === ficheId) {
          return { ...fiche, ...updatedData };
        } else {
          return fiche;
        }
      });
  
      setFiches(updatedFiches);
    } catch (error) {
      console.error("Error verifying invoice:", error);
    }
  };
  


  if (loading) {
    return <LoadingSpinner />; 
  }

  return (
    <div className="container">
       <div className="row align-items-center">
       {role === "admin" ? (
        <div className="col-auto">
          <Link to="/admin/dashboard" className="btn mb-3" style={{ color: 'green' }}>
            <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
          </Link>
        </div>
      ) : (
        <div className="col-auto">
          <Link to="/dashboard" className="btn mb-3" style={{ color: 'green' }}>
            <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
          </Link>
        </div>
      )}
          <div className="col text-center">
              <h1 className="mb-5">Liste des Achats</h1>
          </div>
      </div>
      
      <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />

      {filteredFiches.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Ticket</th>
                <th scope="col">Date Création</th>
                <th scope="col">Heure Création</th>
                <th scope="col">Heure Debut</th>
                <th scope="col">Heure Fin</th>
                <th scope="col">Heures Travaillées</th>
                <th scope="col">Prix de l'heure (Dinar(s))</th>
                <th scope="col">Quantité de Piece(s)</th>
                <th scope="col">Prix Unitaire (Dinar(s))</th>
                <th scope="col">Prix de la Pièce (Dinar(s))</th>
                <th scope="col">Prix Des Heures (Dinar(s))</th>
                <th scope="col">Prix Totales (Dinar(s))</th>
                <th scope="col">View Details</th>
                <th scope="col">Générer la Facture</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiches.length > 0 ? (
                filteredFiches.map(fiche => (
                  (fiche.statuttechnique === 2 && fiche.statuttechnicien === 2 && fiche.statutclient === 2) ? (
                    <tr key={fiche._id}>
                      <td>{fiche.client}</td>
                      <td>{fiche.reference}</td>
                      <td>{fiche.createdAt.split('T')[0]}</td>
                      <td>{formatTime(fiche.createdAt)}</td>
                      <td>{formatTime(fiche.heurestart)}</td>
                      <td>{formatTime(fiche.heureend)}</td>
                      <td>{calculateHoursWorked(fiche.heurestart, fiche.heureend)}</td>
                      <td>
                        {fiche.statutservice === 1 ? (
                          <input
                            type="number"
                            value={fiche.hourlyRate}
                            onChange={(e) => {
                              const updatedFiches = [...fiches];
                              const index = updatedFiches.findIndex(item => item._id === fiche._id);
                              updatedFiches[index].hourlyRate = e.target.value;
                              setFiches(updatedFiches);
                            }}
                            placeholder="Prix de l'heure"
                          />
                        ) : (
                          `Prix de l'heure (Dinar(s)): ${fiche.hourlyRate}`
                        )}
                      </td>
                      <td>{fiche.quantite}</td>
                      <td>
                        {fiche.statutservice === 1 ? (
                          <input
                            type="number"
                            value={fiche.prixUnitaire}
                            onChange={(e) => {
                              const updatedFiches = [...fiches];
                              const index = updatedFiches.findIndex(item => item._id === fiche._id);
                              updatedFiches[index].prixUnitaire = e.target.value;
                              setFiches(updatedFiches);
                            }}
                            placeholder="Prix Unitaire"
                          />
                        ) : (
                          `Prix Unitaire (Dinar(s)): ${fiche.prixUnitaire}`
                        )}
                      </td>           
                      <td>{calculatePiecePrice(fiche.quantite, fiche.prixUnitaire)} Dinar(s)</td>
                      <td>{calculateTotalHeuresPrice(calculateHoursWorked(fiche.heurestart, fiche.heureend), fiche.hourlyRate)} Dinar(s)</td>
                      <td>{calculateTotalPrice(calculateTotalHeuresPrice(calculateHoursWorked(fiche.heurestart, fiche.heureend), fiche.hourlyRate), calculatePiecePrice(fiche.quantite, fiche.prixUnitaire))} Dinar(s)</td>
                      <td>
                        {fiche.statutservice === 2 ? (
                          <div className="d-flex align-items-center">
                            <FaCheckCircle color="#32CD32" size={24} className="me-2" />
                            <span style={{ color: '#32CD32' }}>Facture Cloturée</span>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center">
                            <FaTimesCircle color="red" size={24} className="me-2" />
                            <span style={{ color: 'red' }}>Pas encore</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-warning" onClick={() => handleVerifyInvoice(fiche._id)}>
                          Facture Vérifiée
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-secondary" onClick={() => generateInvoice(fiche)}>
                          Générer Facture
                        </button>
                      </td>
                    </tr>
                  ) : null
                ))
              ) : (
                <tr>
                  <td colSpan="15">Pas De Demande Terminée Pour le moment</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

const allowedRoles = ['admin', 'achat'];

export default withAuthorization(allowedRoles)(ServiceAchat);
