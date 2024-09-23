import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useParams } from 'react-router-dom';
import postService from '../../services/postService';
import StatusBadgeAdmin from '../ficheIntervention/StatusBadgeAdmin';
import StatusBadgeClient from '../ficheIntervention/StatusBadgeClient';
import StatusBadgeTechnicien from '../ficheIntervention/StatusBadgeTechnicien';
import { BsFillArrowLeftSquareFill, BsListCheck, BsListUl } from 'react-icons/bs';

const FicheDetails = () => {
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const userRole = localStorage.getItem('role'); 
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchFiche = async () => {
      try {
        setLoading(true);
        const response = await postService.getFicheById(id);
        setFiche(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fiche:", error);
        setLoading(false);
      }
    };
  
    fetchFiche();
  }, [id]);
  
  const handleValiderparAdmin = async () => {
    try {
      const updatedFiche = { ...fiche, statuttechnique: 2 };
      await postService.updateFiche(fiche._id, updatedFiche); 
      setFiche(updatedFiche);
    } catch (error) {
      console.error("Error updating fiche:", error);
    }
  };

  const handleRefuserparAdmin = async () => {
    try {
      const updatedFiche = { ...fiche, statuttechnique: 0 }; 
      await postService.updateFiche(fiche._id, updatedFiche); 
      setFiche(updatedFiche); 
    } catch (error) {
      console.error("Error updating fiche:", error);
    }
  };

  const handleValiderparUser = async () => {
    try {
      const updatedFiche = { ...fiche, statutclient: 2 }; 
      await postService.updateFiche(fiche._id, updatedFiche); 
      setFiche(updatedFiche);
      setShowComment(false);
    } catch (error) {
      console.error("Error updating fiche:", error);
    }
  };


  const handleRefuserparUser = async () => {
    try {
      setShowComment(true); // Show comment input
    } catch (error) {
      console.error("Error showing comment input:", error);
    }
  };
  

  const handleSubmitComment = async () => {
    try {
      if (comment.trim()) {
        const updatedFiche = { ...fiche, statutclient: 0, comment: comment };
        await postService.updateFiche(fiche._id, updatedFiche);
        setFiche(updatedFiche);
        setShowComment(false);
        console.log("Commentaire soumis et statut client mis à jour à 0:", comment);
        console.log("Fiche mise à jour:", updatedFiche);
      } else {
        console.log("Commentaire vide. Aucun changement apporté.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la fiche avec commentaire:", error);
    }
  };
  
  
  const handleCommentChange = (event) => {
    setComment(event.target.value);
    console.log("Commentaire changé:", event.target.value); // Log the comment change
  };
  
  
  const handleValiderparTechnicien= async () => {
    try {
      const updatedFiche = { ...fiche, statuttechnicien: 2 };
      await postService.updateFiche(fiche._id, updatedFiche);
      setFiche(updatedFiche);
    } catch (error) {
      console.error("Error updating fiche:", error);
    }
  };
 
  const handleRefuserparTechnicien = async () => {
    try {
      const updatedFiche = { ...fiche, statuttechnicien: 0 };
      await postService.updateFiche(fiche._id, updatedFiche);
      setFiche(updatedFiche);
    } catch (error) {
      console.error("Error updating fiche:", error);
    }
  };

  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toISOString().split('T')[0];
  };

  function formatTime(date) {
    // Check if 'date' is not defined or null
    if (!date) return "";
  
    // If 'date' is a string, convert it to a Date object
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
  
    // Get hours, minutes, and seconds from the Date object
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Pad single-digit hours, minutes, and seconds with a leading zero
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    // Construct the formatted time string
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
  const handleImprimer = () => {
    const chargerImageEtImprimer = (imageData) => {
      const contenuImprimer = `
        <div style="display: flex;">
          <div style="width: 50%; float: left;">
            <h1>Détails de la Fiche d'Intervention</h1>
            <div>
              <h3>Informations Client:</h3>
              <p><strong>Client:</strong> ${fiche.client}</p>
              <p><strong>Adresse:</strong> ${fiche.address}</p>
              <p><strong>Contact:</strong> ${fiche.contact}</p>
            </div>
            <div>
              <h3>Informations Intervention:</h3>
              <p><strong>Nom:</strong> ${fiche.nom}</p>
              <p><strong>Catégories:</strong> ${fiche.categories ? fiche.categories.join(', ') : ''}</p>
              <p><strong>Équipement:</strong> ${fiche.equiment}</p>
              <p><strong>Date:</strong> ${formatDate(fiche.date)}</p>
              <p><strong>Heure de Création:</strong> ${formatTime(fiche.createdAt)}</p>
              <p><strong>Référence:</strong> ${fiche.reference}</p>
            </div>
            <div>
              <h3>Détails de la Mission:</h3>
              <p><strong>Quantité:</strong> ${fiche.quantite}</p>
              <p><strong>Prix Unitaire:</strong> ${fiche.prixUnitaire}</p>
              <p><strong>Nombre d'heures de Mission:</strong> ${fiche.NBheures_Mission}</p>
              <p><strong>Nombre d'heures de Trajet:</strong> ${fiche.NBheures_Trajet}</p>
              <p><strong>Frais de Mission:</strong> ${fiche.fraisMission}</p>
              <p><strong>Statut:</strong> ${fiche.statut}</p>
              <p><strong>Date de Création:</strong> ${formatDate(fiche.createdAt)}</p>
            </div>
            <div>
              <h3>Demandé Par:</h3>
              <p><strong>Technicien:</strong> ${fiche.user_nom}</p>
              <p><strong>Email:</strong> ${fiche.user_email}</p>
              <p><strong>Nom:</strong> ${fiche.user_nom}</p>
            </div>
          </div>
          <div style="width: 50%; float: right;">
            <h3>Image:</h3>
            <img src="${imageData}" alt="${fiche.image}" style="max-width: 200px; max-height: 200px;" />
          </div>
        </div>
      `;
  
      const fenetreImpression = window.open('', '_blank');
      fenetreImpression.document.open();
      fenetreImpression.document.write(`
        <html>
          <head>
            <title>Impression de la Fiche d'Intervention</title>
            <style>
              /* Styles CSS pour l'impression */
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              h1, h3 {
                margin-bottom: 10px;
              }
              p {
                margin-bottom: 5px;
              }
              img {
                margin: 10px 0;
                max-width: 100%;
                max-height: 100%;
              }
            </style>
          </head>
          <body>
            ${contenuImprimer}
          </body>
        </html>
      `);
      fenetreImpression.document.close();
      fenetreImpression.print();
    };
  
    const imageSrc = 'https://gestion-maintenance.vercel.app/fichesImages/' + fiche.image;
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = reader.result;
          chargerImageEtImprimer(imageData);
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de l'image:", error);
      });
  };
  
  
  
  

  if (loading) {
    return (
      <div className="container mt-5">
        <p className="text-center">Chargement en cours...</p>
      </div>
    );
  }

  if (!fiche) {
    return (
      <div className="container mt-5">
        <p className="text-center">Fiche non trouvée</p>
      </div>
    );
  }
  return (
    <>
      <div className="container">
        <div className="row align-items-center">
        <div className="col-auto">
              <Link to="/showficheIntervention" className="btn mb-3" style={{ color: 'green' }}>
                  <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
              </Link>
          </div>
          {userRole === 'admin' ? (
            <>
              <div className="col">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto">
                    <Link to="/admin/demandesfiches" className="btn mb-3" style={{ color: 'green' }}>
                      <BsFillArrowLeftSquareFill size={30} /> Retour Vers Dashboard
                    </Link>
                  </div>
                  <div className="col text-center">
                    <h1 className="mb-5">Détails de la Fiche D'intervention</h1>
                  </div>
                  <div className="col-auto text-end">
                    <Link to="/createficheintervention" className="btn btn-success mb-3">
                      <BsListCheck size={30} /> Créer Fiche Intervention
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
        {userRole === 'admin' && (
          <div className="row align-items-center justify-content-center">
            <div className="col-auto">
              <Link to="/admin/demandesfiches" className="btn btn-success mb-3">
                <BsListUl size={30} /> Voir Tous les Listes
              </Link>
            </div>
            <div className="col-auto">
              <Link to="/showficheIntervention" className="btn btn-success mb-3">
                <BsListUl size={30} /> Voir Ma Liste
              </Link>
            </div>
          </div>
        )}
      </div>  


    <div className="container mt-5 d-flex justify-content-center">
      <div className="row justify-content-around">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Client :</h5>
                <p className="card-text">{fiche.client}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Address :</h5>
                <p className="card-text">{fiche.address}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Contact :</h5>
                <p className="card-text">{fiche.contact}</p>
              </div>
             {/* <div className="d-flex justify-content-between">
                <h5 className="card-title">Nom :</h5>
                <p className="card-text">{fiche.nom}</p>
              </div> */} 
              <div className="d-flex justify-content-between">
                {fiche.categories && (
                  <>
                    <h5 className="card-title">Categories :</h5>
                    <p className="card-text">{fiche.categories.join(', ')}</p>
                  </>
                )}
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Équipement :</h5>
                <p className="card-text">{fiche.equiment}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Date :</h5>
                <p className="card-text">{formatDate(fiche.date)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Heure :</h5>
                <p className="card-text">{formatTime(fiche.createdAt)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Reference :</h5>
                <p className="card-text">{fiche.reference}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Quantité :</h5>
                <p className="card-text">{fiche.quantite}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Prix Unitaire :</h5>
                <p className="card-text">{fiche.prixUnitaire}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Nombre d'heures de Mission :</h5>
                <p className="card-text">{fiche.NBheures_Mission}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Nombre d'heures de Trajet :</h5>
                <p className="card-text">{fiche.NBheures_Trajet}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Frais de Mission :</h5>
                <p className="card-text">{fiche.fraisMission}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Statut :</h5>
                <p className="card-text">{fiche.statutclient}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Date de Création :</h5>
                <p className="card-text">{formatDate(fiche.createdAt)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Type De Maintenance :</h5>
                <p className="card-text">{fiche.interventionType}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <img
              src={'https://gestion-maintenance.vercel.app/fichesImages/' + fiche.image}
              alt={fiche.image}
              className="card-img-top img-fluid"
            />
             <div className="card-body">
              <h5 className="card-title">Demandé Par :</h5>
              <p className="card-text">Technicien : {fiche.user_nom}</p>
              <p className="card-text">Email : {fiche.user_email}</p>
              <p className="card-text">Nom : {fiche.user_nom}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style={{ width: "50%", margin: "auto", marginTop: "50px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "40%", margin: "15px auto", textAlign: "center" }}>
          <span>Validation Responsable/Admin</span>
          <StatusBadgeAdmin statuttechnique={fiche.statuttechnique} />
        </div>          
        <div style={{ width: "40%", margin: "15px auto", textAlign: "center",marginLeft:"5px" ,marginRight:"5px"  }}>
        <span>Validation de Client</span>
          <StatusBadgeClient statutclient={fiche.statutclient} />
        </div>
        <div style={{ width: "40%", margin: "15px auto", textAlign: "center" }}>
        <span>Validation Technicien</span>
          <StatusBadgeTechnicien statuttechnicien={fiche.statuttechnicien} />
        </div>
      </div>
    </div>

    <div style={{ width: "50%", margin: "auto", marginTop: "50px", textAlign: "center" }}>
  {fiche.statutservice === 1 ? (
    <>
      {fiche.statutclient === 0 ? (
        <div>
          <p>Commentaire de client :</p> 
          <h3>{fiche.comment}</h3>
        </div>
      ) : null}

      {userRole === 'admin' ? (
        <div style={{ display: "flex", justifyContent:"space-between" }}>
          <button onClick={handleValiderparAdmin} style={{ width: "33%" }} className="btn btn-success btn-rounded">Valider</button>
          <button onClick={handleRefuserparAdmin} style={{ width: "33%", marginLeft: "5px" }} className="btn btn-danger btn-rounded">Refuser</button>
          <button onClick={handleImprimer} style={{ width: "33%", marginLeft: "5px" }} className="btn btn-primary btn-rounded">Imprimer</button>
        </div>
      ) : userRole === 'utilisateur' ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleValiderparUser} style={{ width: "45%", marginRight: "10px" }} className="btn btn-success btn-rounded">Satisfait</button>
          <button onClick={handleRefuserparUser} style={{ width: "45%" }} className="btn btn-danger btn-rounded">Pas Satisfait</button>
        </div>
      ) : userRole === 'technicien' ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleValiderparTechnicien} style={{ width: "45%", marginRight: "10px" }} className="btn btn-success btn-rounded">Valider</button>
          <button onClick={handleRefuserparTechnicien} style={{ width: "45%", marginLeft: "5px" }} className="btn btn-danger btn-rounded">Refuser</button>
          <button onClick={handleImprimer} style={{ width: "45%", marginLeft: "5px" }} className="btn btn-primary btn-rounded">Imprimer</button>
        </div>
      ) : null}
    </>
  ) : null}
</div>


        {showComment && (
          <div style={{ width: "50%", margin: "auto", marginTop: "50px" }}>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Entrez votre commentaire ici..."
              className="form-control"
              rows="4"
            ></textarea>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button onClick={handleSubmitComment} className="btn btn-primary">Envoyer Commentaire</button>
            </div>
          </div>
        )}

    </>
  );
};

export default FicheDetails;
