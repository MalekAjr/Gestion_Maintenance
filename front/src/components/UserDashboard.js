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
        console.log(response);
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
    loading ? <div>loading</div> :
    <div style={{ display: 'flex', maxWidth: '100%', overflowX: 'hidden' }}>
      <div style={{ marginRight: '20px', flex: '0 0 auto' }}>
        {user.image && (
          <div style={{ marginBottom: '20px' }}>
            <br/>
            <div className="text-center">
              <img
                src={`https://gestion-maintenance-dfnp.vercel.app/usersImages/${user.image}`}
                alt="User"
                className="img-fluid rounded-circle mb-2"
                style={{ maxWidth: '200px' }}
              />
            </div>
          </div>
        )}
        <p><strong><center>{user.nom}</center></strong></p>
        <p><strong>User Role: {userRole}</strong></p> {/* Display userRole */}
        <div className="list-group">
          <Link to={`/gerer-profile/${userId}`} className="list-group-item list-group-item-action">
            Modifier Profile
          </Link>
          {user.role !== 'achat' && (
            <Link to={`/showficheIntervention/`} className="list-group-item list-group-item-action">
              Consulter mes demandes Faites
            </Link>
          )}
          {user.role === 'achat' && (
            <Link to={`/admin/achat`} className="list-group-item list-group-item-action">
              Consulter Facturations
            </Link>
          )}
          {user.role === 'admin' && (
            <>
              <Link to={`/showticketclient/`} className="list-group-item list-group-item-action">
                Consulter mes Tickets Faites
              </Link>
              <Link to={`/admin/scheduler/`} className="list-group-item list-group-item-action">
                Consulter Planning
              </Link>
            </>
          )}
          {user.role === 'technicien' && (
            <>
              <Link to={`/consulter-ordretechnicien/`} className="list-group-item list-group-item-action">
                Consulter mes Ordres Faites
              </Link>
              <Link to={`/planningtechnicien/`} className="list-group-item list-group-item-action">
                Mon Planning
              </Link>
            </>
          )}
          {user.role === 'utilisateur' && (
            <Link to={`/showticketclient/`} className="list-group-item list-group-item-action">
              Consulter mes Tickets
            </Link>
          )}
        </div>
      </div>
      <div style={{ flex: '1 1 auto', marginRight: '20px' }}>
        <h1 className="text-center mb-4">Bienvenue Sur votre Tableau De Bord</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Gestion de Profile</h5>
                <p className="card-text">Modifier les information de ton profile.</p>
                <Link to={`/gerer-profile/${userId}`} className="btn btn-primary">
                  Modifier Profile
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
                  Demandes Faites
                </Link>
              </div>
            </div>
          </div>
          {user.role === 'technicien' && (
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Mes Ordres Faites</h5>
                  <p className="card-text">Voir toutes Mes Plans</p>
                  <Link to={`/consulter-ordretechnicien`} className="btn btn-primary">
                    Créer Une Demande D'intervention
                  </Link>
                </div>
              </div>
            </div>
          )}
          {user.role !== 'achat' && (
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Consulter Mes Tickets Faites</h5>
                  <p className="card-text">Voir toutes Mes Tickets</p>
                  <Link to={`/showticketclient/`} className="btn btn-primary">
                    Créer Une Nouvelle Ticket
                  </Link>
                </div>
              </div>
            </div>
          )}
          {user.role === 'admin' && (
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Consulter Planning</h5>
                  <p className="card-text">Voir toutes Mes Planning Faites</p>
                  <Link to={`/admin/scheduler/`} className="btn btn-primary">
                    Créer Une Nouvelle Planning
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
