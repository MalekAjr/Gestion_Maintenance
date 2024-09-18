import React, { useCallback, useEffect, useState } from 'react';
import postService from '../../services/postService';
import 'bootstrap/dist/css/bootstrap.min.css';
import hpclogo from '../../imgs/hpclogo.png';
import plasticlogo from '../../imgs/plasticlogo.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import { FaClock, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { useAuth } from '../authorization/AuthContext';

const CreateFicheIntervention = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clientData = location.state;
const heureStart = clientData ? clientData.clientData.heurestart : new Date();
const heureEnd = clientData ? clientData.clientData.heureend : new Date();
const ticketId = clientData ? clientData.clientData.ticketId : '';
const heureTrajet = clientData ? new Date(clientData.clientData.heureTrajet) : new Date();
const heureTrajetFormatted = `${heureTrajet.getHours().toString().padStart(2, '0')}:${heureTrajet.getMinutes().toString().padStart(2, '0')}`;
console.log("Nombre d'heures Trajet:", heureTrajetFormatted);
const heuresTrajet = parseInt(heureTrajetFormatted);

  const [formData, setFormData] = useState({
    client: '',
    address: '',
    contact: '',
   // nom: '',
    categories: [],
    equipment: '',
    interventionType: 'Préventive',
    descriptif: '',
    image: null,
    date: new Date().toISOString().slice(0, 10),
    reference: ticketId,
    quantite: 0,
    prixUnitaire: 0,
    NBheures_Mission: 0,
    NBheures_Trajet: heuresTrajet,
    fraisMission: 0,
    malek: 0,
    heurestart: heureStart,
    heureend: heureEnd,
  });

  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [customClientEnabled, setCustomClientEnabled] = useState(false);
 // const clients = ["MEGAPLAST", "exemple1", "exemple2"];
 // const [customAddressEnabled, setCustomAddressEnabled] = useState(false);
  const [newClientClicked, setNewClientClicked] = useState(false);
  const [newReferenceClicked, setNewReferenceClicked] = useState(false);
 // const references = ["Ref1", "Ref2", "Ref3", "Ref4", "Ref5"];
 // const [newAddressClicked, setNewAddressClicked] = useState(false);
  const [customReferenceEnabled, setCustomReferenceEnabled] = useState(false);
 // const [customEquipmentEnabled, setCustomEquipmentEnabled] = useState(false);
  const equipments = ["Option 1", "Option 2", "Option 3"];
 // const [newEquipmentClicked, setNewEquipmentClicked] = useState(false);
  
  const [users, setUsers] = useState()
  const [tickets, setTickets] = useState([]);
  const { role } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      const filteredUsers = response.data.users.filter(user => user.role === 'utilisateur');
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await postService.getTickets();
      setTickets(response.data.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };
  
  useEffect(() => {
    fetchUsers();
    fetchTickets();
  }, []);
  
  const getUserDetails = useCallback((clientName) => {
    const user = users.find(user => user.nom === clientName);
    return user ? { address: user.address, contact: user.contact } : { address: '', contact: '' };
  }, [users]); // Dépendance sur users

  useEffect(() => {
    if (clientData) {
      const selectedClient = clientData.clientData.userName;
      const userDetails = getUserDetails(selectedClient);
      setFormData(prevFormData => ({
        ...prevFormData,
        client: selectedClient,
        address: userDetails.address,
        contact: userDetails.contact,
      }));
    }
  }, [clientData, getUserDetails]);
  
  
 const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'client') {
      const userDetails = getUserDetails(value);
      setFormData({
        ...formData,
        client: value,
        address: userDetails.address,
        contact: userDetails.contact,
      });
    } else {
      const newValue = name === 'NBheures_Trajet' ? parseInt(value) : value;

      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };
  
  const handleCustomEquipmentToggle = () => {
    setFormData({
      ...formData,
      customEquipmentEnabled: !formData.customEquipmentEnabled,
      equipment: ''
    });
  };
/*
  const handleChangeReference = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      reference: value,
    });
  };*/
  
  const handleInterventionTypeChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      interventionType: value,
    });
  };
  
  
  const handleCustomClientToggle = () => {
    setNewClientClicked(!newClientClicked);
    setCustomClientEnabled(!customClientEnabled);
    setFormData({
      ...formData,
      customClientEnabled: !formData.customClientEnabled,
      client: ''
    });
  };

  const handleCustomReferenceToggle = () => {
    setNewReferenceClicked(!newReferenceClicked);
    setCustomReferenceEnabled(!customReferenceEnabled);
    setFormData({
      ...formData,
      customReferenceEnabled: !formData.customReferenceEnabled,
      reference: ''
    });
  };
 
  

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    let updatedCategories = [...formData.categories];

    if (checked) {
      updatedCategories.push(value);
    } else {
      updatedCategories = updatedCategories.filter((category) => category !== value);
    }

    setFormData({
      ...formData,
      categories: updatedCategories,
    });
  };

  /*
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        image: null,
      });
      setImagePreview(null);
    }
  };
*/
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file && file.size < 5000000 && (file.type === 'image/jpeg' || file.type === 'image/png')) { // Limite de taille et type
    setFormData({
      ...formData,
      image: file,
    });

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  } else {
    console.error("Invalid file type or size too large.");
  }
};

  const handleStartTimeChange = (date) => {
    setFormData({
      ...formData,
      heurestart: date,
    });
  };

  const handleEndTimeChange = (date) => {
    setFormData({
      ...formData,
      heureend: date,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //const totalHours = formData.NBheures_Trajet + (formData.NBheures_Trajet_minutes / 60);

    const formDataToSend = new FormData();
    formDataToSend.append('client', formData.client);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('contact', formData.contact);
    //formDataToSend.append('nom', formData.nom);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('categories', JSON.stringify(formData.categories));
    formDataToSend.append('equipment', formData.equipment);
    formDataToSend.append('interventionType', formData.interventionType);
    formDataToSend.append('descriptif', formData.descriptif);
    formDataToSend.append('image', formData.image);
    formDataToSend.append('reference', formData.reference);
    formDataToSend.append('quantite', formData.quantite);
    formDataToSend.append('prixUnitaire', formData.prixUnitaire);
    formDataToSend.append('NBheures_Mission', formData.NBheures_Mission);
    formDataToSend.append('NBheures_Trajet', formData.NBheures_Trajet);
    formDataToSend.append('fraisMission', formData.fraisMission);
    formDataToSend.append('malek', formData.malek);
    formDataToSend.append('heurestart', formData.heurestart);
    formDataToSend.append('heureend', formData.heureend);

    try {
      const response = await postService.createFiche(formDataToSend);

      if (response.data.success === true) {
        setMessage('Fiche created successfully.');
        setImagePreview(null);

        navigate('/showficheIntervention');
      } else {
        setMessage('Fiche creation failed.');
      }
    } catch (error) {
      console.error('Error creating Fiche:', error);
      setMessage('An error occurred. Please try again.');
    }

    // event.target.reset();
    setFormData({
      client: '',
      address: '',
      contact: '',
      //nom: '',
      categories: [],
      equipment: '',
      descriptif: '',
      image: null,
      date: new Date().toISOString().slice(0, 10),
      reference: '',
      quantite: 0,
      prixUnitaire: 0,
      NBheures_Mission: 0,
      NBheures_Trajet: 0,
      fraisMission: 0,
      malek: 0,
      heurestart: new Date(),
      heureend: new Date(),
      interventionType: 'Préventive'
    });

    setTimeout(function () {
      setMessage('');
    }, 2000);
  };

  /*
  const handleCustomAddressToggle = () => {
    setFormData({
      ...formData,
      customAddressEnabled: !formData.customAddressEnabled
    });
  };
*/

  const handleTimeChange = (field, hours) => {
    const date = new Date(formData[field]);
    date.setHours(date.getHours() + hours);
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  /*
  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  */

/*
  const handleTimeTrajetChange = (date) => {
    const differenceInHours = Math.abs(date.getHours() - formData.heurestart.getHours());
    const differenceInMinutes = Math.abs(date.getMinutes() - formData.heurestart.getMinutes()) / 60;
    const totalHours = differenceInHours + differenceInMinutes;
    
    setFormData({
      ...formData,
      heurestart: date,
      NBheures_Trajet: totalHours,
    });
  };
  
  */

  if (!users) return null 
  
  return (
    <div className="container">
      <div className="row align-items-center justify-content-between">
      {role === 'admin' && (
        <div className="col-auto">
          <Link to="/admin/demandesfiches" className="btn mb-3" style={{ color: 'green' }}>
            <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
          </Link>
        </div>
      )} : {(
        <div className="col-auto">
        <Link to="/showficheIntervention" className="btn mb-3" style={{ color: 'green' }}>
          <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
        </Link>
      </div>
      )}
        <div className="col text-center mx-auto">
          <h1 className="mb-5 txt-center" style={{ marginRight: "6em"}}>Créer Rapport Intervention</h1>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <div className="col-md-4">
          <div className="mb-3">
            <img src={hpclogo} alt="Logo" className="logo" style={{ width: '100%', height: 'auto' }}/>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <img src={plasticlogo} alt="Logo" className="logo" style={{ width: '120px', height: 'auto',marginLeft: "2.5em" }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4">
        
          <div className="mb-3">
        <label className="form-label">Client:</label>
        {!customClientEnabled ? (
          <div className="input-group">
            <select
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Sélectionner un client</option>
              {users.map((client, index) => (
                <option key={index} value={client.nom}>
                  {client.nom}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCustomClientToggle}
            >
              Nouveau
            </button>
          </div>
        ) : (
          <div className="input-group">
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Entrez un nouveau client"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCustomClientToggle}
            >
              Annuler
            </button>
          </div>
        )}
      </div>

          <div className="mb-3">
  <label className="form-label">Adresse:</label>
  <div className="input-group">
    <input
      type="text"
      name="address"
      value={formData.address}
      onChange={handleChange}
      required
      className="form-control"
      placeholder="Entrez une adresse personnalisée"
      disabled
    />
    {/*
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => setCustomAddressEnabled(!customAddressEnabled)}
    >
      {customAddressEnabled ? "Annuler" : "Nouvelle Adresse"}
    </button>
    */}
  </div>
</div>


            <div className="mb-3">
              <label className="form-label">Contact:</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="form-control"
                disabled
              />
            </div>
          { /* <div className="mb-3">
              <label className="form-label">Nom:</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div> */}
            <div className="mb-3">
              <div className="col-md-4">
                <div className="mb-3">
                  <label>Categories:</label>
                  <div className="d-flex">
                    <div className="me-3">
                      <label>
                        <input
                          type="checkbox"
                          name="categories"
                          value="Injection"
                          checked={formData.categories.includes('Injection')}
                          onChange={handleCategoryChange}
                        />
                        Injection
                      </label>
                    </div>
                    <div className="me-3">
                      <label>
                        <input
                          type="checkbox"
                          name="categories"
                          value="Périférique"
                          checked={formData.categories.includes('Périférique')}
                          onChange={handleCategoryChange}
                        />
                        Périférique
                      </label>
                    </div>
                    <div className="me-3">
                      <label>
                        <input
                          type="checkbox"
                          name="categories"
                          value="Robotique"
                          checked={formData.categories.includes('Robotique')}
                          onChange={handleCategoryChange}
                        />
                        Robotique
                      </label>
                    </div>
                    <div className="me-3">
                      <label>
                        <input
                          type="checkbox"
                          name="categories"
                          value="Froid"
                          checked={formData.categories.includes('Froid')}
                          onChange={handleCategoryChange}
                        />
                        Froid
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          name="categories"
                          value="Moules"
                          checked={formData.categories.includes('Moules')}
                          onChange={handleCategoryChange}
                        />
                        Moules
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Equipment:</label>
                <div className="input-group">
                  {formData.customEquipmentEnabled ? (
                    <input
                      type="text"
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="Enter new equipment"
                    />
                  ) : (
                    <select
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select equipment</option>
                      {equipments.map((ref, index) => (
                        <option key={index} value={ref}>
                          {ref}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCustomEquipmentToggle}
                  >
                    {formData.customEquipmentEnabled ? "Cancel" : "New Equipment"}
                  </button>
                </div>
              </div>             
 
              <div>
              {/* Autres éléments de formulaire */}
              <label>
                Type d'intervention:
              </label>
              <div>
                <input
                  type="radio"
                  id="preventive"
                  name="interventionType"
                  value="Préventive"
                  checked={formData.interventionType === 'Préventive'}
                  onChange={handleInterventionTypeChange}
                />
                <label htmlFor="preventive">Préventive</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="corrective"
                  name="interventionType"
                  value="Corrective"
                  checked={formData.interventionType === 'Corrective'}
                  onChange={handleInterventionTypeChange}
                />
                <label htmlFor="corrective">Corrective</label>
              </div>
              {/* Autres éléments de formulaire */}
            </div>
            </div>
          </div>
          <div className="col-md-4">
          <div className="mb-3">
              <label className="form-label">Reference:</label>
              <div className="input-group">
              {formData.customReferenceEnabled ? (
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Entrez une nouvelle référence"
            />
          ) : (
            <select
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Sélectionner une référence</option>
            {tickets
              .filter(ticket => ticket.user_nom === formData.client) // Filtrer les tickets pour le client sélectionné
              .map((ticket, index) => (
                <option key={ticket._id} value={ticket._id}>
                  {ticket._id}
                </option>
              ))}
          </select>

          )}


                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCustomReferenceToggle} // Appeler handleCustomReferenceToggle lors du clic sur le bouton "Nouvelle Référence"
                >
                  {formData.customReferenceEnabled ? "Annuler" : "Nouvelle Référence"}
                </button>
              </div>
            </div>


            <div className="mb-3">
              <label className="form-label">Descriptif:</label>
              <textarea
                name="descriptif"
                value={formData.descriptif}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="form-control"
              />
              <div style={{textAlign: 'center'}}>
              {imagePreview && (
                <img src={imagePreview} alt="Selected" className="img-fluid mt-3" style={{ maxHeight: '150px' }} />
              )}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Quantite:</label>
              <input
                type="number"
                name="quantite"
                value={formData.quantite}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Prix Unitaire:</label>
              <input
                type="number"
                name="prixUnitaire"
                value={formData.prixUnitaire}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre d'heures Mission:</label>
              <input
                type="number"
                name="NBheures_Mission"
                value={formData.NBheures_Mission}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
            <label className="form-label">Nombre d'heures Trajet:</label>
            <input
              type="text"
              name="NBheures_Trajet"
              value={heuresTrajet}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

            <div className="mb-3">
              <label className="form-label">Frais Mission:</label>
              <input
                type="number"
                name="fraisMission"
                value={formData.fraisMission}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3 d-flex justify-content-between">
              
            <div className="mb-3">
  <label className="form-label">Heure de début:</label>
  <div className="input-group">
    <span className="input-group-text">
      <FaClock />
    </span>
    <button
  type="button"
  className="btn btn-outline-secondary"
  onClick={() => handleTimeChange('heurestart', 1)}
>
  <FaChevronUp />
</button>
<button
  type="button"
  className="btn btn-outline-secondary"
  onClick={() => handleTimeChange('heurestart', -1)}
>
  <FaChevronDown />
</button>
<DatePicker
      selected={formData.heurestart}
      onChange={handleStartTimeChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
      className="form-control"
    />
  </div>
</div>

<div className="mb-3">
  <label className="form-label">Heure de fin:</label>
  <div className="input-group">
    <span className="input-group-text">
      <FaClock />
    </span>
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => handleTimeChange('heureend', 1)}
    >
      <FaChevronUp />
    </button>
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => handleTimeChange('heureend', -1)}
    >
      <FaChevronDown />
    </button>
    <DatePicker
      selected={formData.heureend}
      onChange={handleEndTimeChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
      className="form-control"
    />
  </div>
</div>

            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <button type="submit" className="btn btn-primary">Create Fiche</button>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateFicheIntervention;
