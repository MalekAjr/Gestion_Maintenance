import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import errorImage from './error.png'; // Your error image path
import './Unauthorized.css'; // Custom CSS for animations

function Unauthorized() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow animated fadeInDown">
            <div className="card-body text-center">
              <h1 className="card-title mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning mr-2" />
                Unauthorized Access
              </h1>
              <img src={errorImage} alt="Error" className="img-fluid mb-4 animated pulse" />
              <p className="card-text mb-4">
                Oops! It looks like you do not have permission to access this page.
              </p>
              <p className="card-text">
                Please contact the administrator for further assistance.
              </p>
              <hr />
              <p className="card-text">
                <small className="text-muted">
                  Your access to this website is securely monitored.
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
