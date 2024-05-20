import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';

function UserDashboard() {
  const [user, setUser] = useState({
    _id: '',
    nom: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminService.getUser();
        setUser(response.data.user);
        setLoading(false);
        setUserId(localStorage.getItem('userId'));
        setUserRole(localStorage.getItem('userRole'));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ display: 'flex', maxWidth: '100%', overflowX: 'hidden' }}>
      <div style={{ marginRight: '20px', flex: '0 0 auto' }}>
        {user.image && (
          <div style={{ marginBottom: '20px' }}>
            <br/>
            <div className="text-center">
              <img
                src={`http://localhost:8000/usersImages/${user.image}`}
                alt="User"
                className="img-fluid rounded-circle mb-2"
                style={{ maxWidth: '200px' }}
              />
            </div>
          </div>
        )}
        <p><strong><center>{user.nom}</center></strong> </p>
        <div className="list-group">
          <Link to={`/gerer-profile/${userId}`} className="list-group-item list-group-item-action">
            Edit Profile
          </Link>
          <Link to={`/showficheIntervention/`} className="list-group-item list-group-item-action">
            Consulter mes demandes Faites
          </Link>
         
      
          {user.role === 'technicien' && (
            <>
            <Link to={`/consulter-planningtechnicien/`} className="list-group-item list-group-item-action">
              Consulter Mon Planning
            </Link>
            <Link to={`/consulter-ordretechnicien/`} className="list-group-item list-group-item-action">
            Consulter mes Demandes Faites
          </Link>
          <Link to={`/planningtechnicien/`} className="list-group-item list-group-item-action">
            Mon Planning
          </Link>
          </>
          )}

          {user.role === 'utilisateur' && (
            <>
          <Link to={`/showticketclient/`} className="list-group-item list-group-item-action">
            Consulter mes Demandes Interventions
          </Link>
          <Link to={`/showticketclient/`} className="list-group-item list-group-item-action">
          Consulter mes Tickets
        </Link>
          </>
          )}
        </div>
      </div>
      <div style={{ flex: '1 1 auto', marginRight: '20px' }}>
        <h1 className="text-center mb-4">Welcome to Your Dashboard</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Profile Management</h5>
                <p className="card-text">Update your profile information.</p>
                <Link to={`/gerer-profile/${userId}`} className="btn btn-primary">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Mes Demandes Faites</h5>
                <p className="card-text">Voir Mes Demandes Faites</p>
                <Link to={`/showficheIntervention/`} className="btn btn-primary">
                  View Requests
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Mes Demandes D'interventions</h5>
                <p className="card-text">View and manage your service requests.</p>
                <Link to={`/createdemandeinterventionclient/`} className="btn btn-primary">
                  Créer Une Demande D'intervention
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
