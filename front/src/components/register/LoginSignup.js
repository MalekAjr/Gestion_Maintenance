import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faLock, faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';

import './Login_Signup.css';

function LoginSignup() {
  const [nom, setNom] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeForm, setActiveForm] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(false);
  // const [userRole, setUserRole] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    nom: '',
    phone: '',
    email: '',
    password: '',
  });

   // const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      setImage(selectedImage);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleNomChange = (e) => {
    setNom(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /*
  const handleErrors = (err) => {
    let errorMessage = "Une erreur s'est produite";
    if (err.response && err.response.data && err.response.data.error) {
      errorMessage = err.response.data.error;
    }
    return errorMessage;
  };
  */
 
  const handleRegister = async (e) => {
    e.preventDefault();
  
    setErrorMessages({
      nom: '',
      phone: '',
      email: '',
      password: '',
    });
  
    if (!nom || !phone || !email || !password) {
      setErrorMessages({
        ...errorMessages,
        nom: nom ? '' : 'Veuillez fournir votre nom complet',
        phone: phone ? '' : 'Veuillez fournir votre numéro de téléphone',
        email: email ? '' : 'Veuillez fournir votre adresse e-mail',
        password: password ? '' : 'Veuillez fournir un mot de passe',
      });
      return;
    }
  
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessages({
        ...errorMessages,
        phone: 'Le numéro de téléphone doit être composé de 8 chiffres.',
      });
      return;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessages({
        ...errorMessages,
        password: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et être d\'au moins 8 caractères de longueur.',
      });
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('nom', nom);
    formDataToSend.append('phone', phone);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    if (image) {
      formDataToSend.append('image', image);
    }
  
    try {
      const response = await axios.post("http://localhost:8000/api/signup", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data.token);
      localStorage.setItem('token', response.data.token);
      navigate("/signup");
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;
        if (errorMessage.includes('nom')) {
          setErrorMessages({
            ...errorMessages,
            nom: errorMessage,
          });
        } else if (errorMessage.includes('email')) {
          setErrorMessages({
            ...errorMessages,
            email: errorMessage,
          });
        } else if (errorMessage.includes('phone')) {
          setErrorMessages({
            ...errorMessages,
            phone: errorMessage,
          });
        } else if (errorMessage.includes('password')) {
          setErrorMessages({
            ...errorMessages,
            password: errorMessage,
          });
        } else {
          alert(errorMessage);
        }
      } else {
        alert("Something went wrong");
      }
    }

   // setShowAlert(true);
    // setTimeout(() => setShowAlert(false), 3000);
  };
  

  const handleSubmitLogin = async (e) => {  
    e.preventDefault();

    await axios.post("http://localhost:8000/api/login/", { email, password })
      .then((res) => {
        const { token, role } = res.data;
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;
        console.log(token, role, userId);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
    

        if (role === 'admin') {
         // setLoggedIn(true);
         // setUserRole(role);

        //  triggerReloadNavbar();
                 window.location.href=window.location.origin+'/app/admin/dashboard/';
          //navigate("/admin/dashboard/");
        } else {
          // setLoggedIn(true);
          // setUserRole(role);
          window.location.href=window.location.origin+'/app/dashboard/';
          //navigate("/dashboard/"); // Redirection vers la page showficheintervention après la connexion réussie
        }
      })
      .catch((err) => {
        alert("Erreur: identifiants incorrects");
      });
  };

  return (
    <>
      <div className="error-messages d-flex justify-content-center align-items-center text-center">
  {errorMessages.nom && <div className="alert alert-danger"><FontAwesomeIcon icon={faUser} /> {errorMessages.nom}</div>}
  {errorMessages.phone && <div className="alert alert-danger"><FontAwesomeIcon icon={faPhone} /> {errorMessages.phone}</div>}
  {errorMessages.email && <div className="alert alert-danger"><FontAwesomeIcon icon={faEnvelope} /> <FontAwesomeIcon icon={faExclamationCircle} /> {errorMessages.email}</div>}
  {errorMessages.password && <div className="alert alert-danger"><FontAwesomeIcon icon={faLock} /> {errorMessages.password}</div>}
</div>


      <div className='signup-form-container'>
        <div className="container">
        <div className='imagepetit'>
        <img src="/imgs/hpclogo2.JPG" alt="HPC Logo" />
        </div>
          <div className="card">
            {/* Toggle Buttons */}
            <div className="toggle-btns">
              <button
                className={activeForm === 'login' ? 'login-btn active' : 'login-btn'}
                onClick={() => setActiveForm('login')}
              >
                Login
              </button>
              <button
                className={activeForm === 'register' ? 'register-btn active' : 'register-btn'}
                onClick={() => setActiveForm('register')}
              >
                Register
              </button>
            </div>
            {/* Forms */}
            <div className="forms">
              {/* Login Form */}
              <form className='signup-form' style={{ display: activeForm === 'login' ? 'block' : 'none' }} onSubmit={handleSubmitLogin}>
                <h2>Login</h2>
                <div className="form-group">
                  <div className="form-group icon-input">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Email"
                      // required
                    />
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  </div>
                </div>
                <div className="form-group position-relative">
                  <div className="icon-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Password"
                      // required
                    />
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                  </div>
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                    style={{
                      cursor: 'pointer',
                      position: 'absolute',
                      right: '30px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  />
                </div>
                <button type="submit" className='tologin'>Login</button>
              </form>

              {/* Signup Form */}
              <form className="signup-form" style={{ display: activeForm === 'register' ? 'block' : 'none' }} onSubmit={handleRegister}>
                <h2>Create an Account</h2>
                <div className="form-group">
                  <div className="form-group icon-input">
                    <input
                      type="text"
                      name="fullName"
                      value={nom}
                      onChange={handleNomChange}
                      placeholder="Full Name"
                      // required
                    />
                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-group icon-input">
                    <input
                      type="number"
                      name="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="Phone"
                      // required
                    />
                    <FontAwesomeIcon icon={faPhone} className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-group icon-input">
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Email Address"
                      // required
                    />
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  </div>
                </div>
                <div className="form-group position-relative">
                  <div className="icon-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Password"
                      // required
                      className="form-control"
                    />
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                  </div>
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                    style={{
                      cursor: 'pointer',
                      position: 'absolute',
                      right: '30px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  />
                </div>
                <div className="form-group" style={{ textAlign: 'center' }}>
                  <div className="circular-image-container">
                    {imagePreview && (
                      <img src={imagePreview} alt="Selected" className="circular-image" />
                    )}
                    <div className="image-overlay">
                      <label htmlFor="image" className="choose-image-btn">Choose an Image</label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        className="input-field"
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className='signup_btn'>Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );  
}

export default LoginSignup;
