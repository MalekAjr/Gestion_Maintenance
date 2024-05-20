import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from 'react-router-dom';
import { BsFillPlusSquareFill } from 'react-icons/bs';
import postService from '../../services/postService';
import LoadingSpinner from '../LoadingSpinner';
import Navbar from '../NavBar/Navbar';
import withAuthorization from '../authorization/withAuthorization';

function ServiceAchat() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

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

  // Filter fiches based on searchQuery
  const filteredFiches = fiches.filter(fiche => {
    const lowerCaseQuery = searchQuery.toLowerCase();
  
    // Check for partial matches in all fields except 'image'
    return Object.entries(fiche).some(([key, value]) =>
      key !== 'image' && typeof value === 'string' && value.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const handleSearch = async (e) => {
    const query = e.target.value;//.toLowerCase(); // .trim()  , Trim the query to remove whitespace
    setSearchQuery(query);
  
    try {
      if (query === "") {
        const response = await postService.getFiches();
        setFiches(response.data.data);
      } else {
        const response = await postService.searchFiches(query);
        setFiches(response.data.data);
      }
    } catch (error) {
      console.error("Error searching fiches:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Time";
    }
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    return `${hours}H ${minutes}minutes `; //${seconds}secondes
  };

  const calculateHoursWorked = (start, end) => {
    const startHours = new Date(start).getTime();
    const endHours = new Date(end).getTime();

    const differenceMs = Math.abs(endHours - startHours);
    const hours = Math.floor(differenceMs / (1000 * 60 * 60));
    const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
    // const seconds = Math.floor((differenceMs % (1000 * 60)) / 1000);

    let result = '';
    if (hours > 0) {
      result += `${hours}H`;
    }
    if (minutes > 0) {
      result += ` et ${minutes} minutes`;
    }
  /*  if (seconds > 0) {
      result += ` et ${seconds} secondes`;
    }
    */

    if (result === '') {
      result = '0 H et 0 minutes';
    }
    return result;
  };

  const handleHoursWorkedChange = (e) => {
    const { value } = e.target;
    setHoursWorked(value);
    calculateTotalPrice();
  };

  const calculateTotalPrice = () => {
    const rate = parseFloat(hourlyRate);
  
    const [hoursPart, minutesPart] = hoursWorked.split('H');
    const hours = parseInt(hoursPart) || 0;
    const minutes = parseInt(minutesPart) || 0;
  
    // Convertir les heures et les minutes en décimal
    const totalDecimalHours = hours + (minutes / 60);
  
    const totalPrice = isNaN(totalDecimalHours) || isNaN(rate) ? 0 : (totalDecimalHours * rate).toFixed(2);
    setTotalHours(totalPrice);
  };
  

  if (loading) {
    return <LoadingSpinner />; 
  }

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col">
          <h1 className="mb-5">Liste des Achats</h1>
        </div>
        <div className="col-auto">
          <Link to="/createficheintervention" className="btn btn-success mb-3">
            <BsFillPlusSquareFill /> Create Fiche Intervention
          </Link>
        </div>
      </div>

      <Navbar searchQuery={searchQuery} handleSearch={handleSearch} />

      {filteredFiches.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Heure Debut</th>
                <th scope="col">Heure Fin</th>
                <th scope="col">Heures Travaillées</th>
                <th scope="col">Prix de l'heure (Dinar(s))</th>
                <th scope="col">Prix Total (Dinar(s))</th>
                <th scope="col">View Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiches.map(fiche => (
                <tr key={fiche._id}>
                  <td>{fiche.client}</td>
                  <td>{formatTime(fiche.heurestart)}</td>
                  <td>{formatTime(fiche.heureend)}</td>
                  <td>{calculateHoursWorked(fiche.heurestart, fiche.heureend)}</td>
                  <td>
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
                  </td>
                  <td>{(parseFloat(fiche.hourlyRate) * parseFloat(calculateHoursWorked(fiche.heurestart, fiche.heureend))).toFixed(2)} Dinar(s)</td>
                  <td>
                    <Link to={`/details/${fiche._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </td>
                 {/* <td>
                    Imprimer (faire ca Si malek)
                  </td> */}
                </tr> 
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(ServiceAchat);