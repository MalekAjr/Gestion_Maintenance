import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const UserProfile = () => {
  const [user, setUser] = useState({
    _id: '',
    nom: '',
    phone: '',
    email: '',
    image: '',
    role: '',
    address: '',
    contact: ''
  });

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    phone: '',
    email: '',
    address: '',
    contact: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [displayedImage, setDisplayedImage] = useState(user.image);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminService.getUser();
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{8}$/.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleUpdateUser = async () => {
    if (!validateEmail(formData.email)) {
      showAlert("L'adresse e-mail n'est pas valide", 'danger');
      return;
    }

    if (!validatePhone(formData.phone)) {
      showAlert('Le numéro de téléphone doit être un nombre de 8 chiffres', 'danger');
      return;
    }

    if (password && !validatePassword(password)) {
      showAlert('Le mot de passe doit contenir au moins 8 caractères, dont au moins une majuscule, une minuscule et un chiffre', 'danger');
      return;
    }

    const confirmUpdate = window.confirm("Confirmez-vous la mise à jour de l'utilisateur?");
    if (confirmUpdate) {
      try {
        const formDataWithImage = new FormData();
        formDataWithImage.append('_id', user._id);
        formDataWithImage.append('nom', formData.nom || user.nom);
        formDataWithImage.append('phone', formData.phone || user.phone);
        formDataWithImage.append('email', formData.email || user.email);
        formDataWithImage.append('address', formData.address || user.address);
        formDataWithImage.append('contact', formData.contact || user.contact);

        // Update the password only if a new one is provided
        if (password) {
          formDataWithImage.append('password', password);
        }
        if (imageFile) {
          formDataWithImage.append('image', imageFile);
        } else {
          formDataWithImage.append('image', user.image);
        }

        const response = await adminService.updateUser(user._id, formDataWithImage);
        console.log('User updated successfully:', response.data);
        setUser(response.data.user);
        setFormData({
          nom: '',
          phone: '',
          email: '',
          address: '',
          contact: ''
        });
        setImageFile(null);
        setDisplayedImage(''); // Reset the image field to an empty string after updating the data
        setPassword('');
        showAlert('User updated successfully', 'success');
      } catch (error) {
        console.error('Error updating user:', error);
        showAlert('Error updating user. Please try again later', 'danger');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setDisplayedImage('');
    if (e.target.files[0]) {
      setDisplayedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 5000);
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <CircularProgress size={80} />
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-8">
            {alertMessage && (
              <div className={`alert alert-${alertType}`} role="alert">
                {alertMessage}
              </div>
            )}
            <Link to={'/dashboard/'} className="btn btn-primary">Dashboard</Link>
            <div className="row">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header text-center">User Profile</div>
                  <div className="card-body">
                    {user.image && (
                      <div className="mb-3">
                        <strong>Image:</strong>
                        <div className="text-center">
                          {imageFile ? (
                            <img
                              src={URL.createObjectURL(imageFile)}
                              alt="User"
                              className="img-fluid rounded-circle"
                              style={{ maxWidth: '200px' }}
                            />
                          ) : (
                            <img
                              src={`https://gestion-maintenancebackend.vercel.app/usersImages/${user.image}`}
                              alt="User"
                              className="img-fluid rounded-circle"
                              style={{ maxWidth: '200px' }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    <p><strong>Name:</strong> {user.nom}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Adresse:</strong> {user.address}</p>
                    <p><strong>Contact:</strong> {user.contact}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header text-center">Edit Profile</div>
                  <div className="card-body">
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="form-control mb-3"
                      placeholder="Enter Name"
                    />
                    <input
                      type="tel"
                      pattern="[0-9]*"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control mb-3"
                      placeholder="Enter Phone"
                    />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control mb-3"
                      placeholder="Enter Email"
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-control mb-3"
                      placeholder="Enter Adresse"
                    />
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className="form-control mb-3"
                      placeholder="Enter Contact"
                    />
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      className="form-control mb-3"
                    />
                    <img src={displayedImage} alt="User" className="img-fluid mb-3" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={handleChangePassword}
                      className="form-control mb-3"
                      placeholder="Enter New Password"
                    />
                    <div className="form-group d-flex justify-content-between align-items-center mb-3">
                      <button
                        onClick={togglePasswordVisibility}
                        className="btn btn-secondary"
                      >
                        {showPassword ? 'Hide Password' : 'Show Password'}
                      </button>
                      <button
                        onClick={handleUpdateUser}
                        className="btn btn-primary"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
