import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import adminService from "../../services/adminService";

function UpdateUserModal(props) {
  const [isShow, setShow] = useState(true); // Changer à true pour afficher automatiquement
  const [nom, setNom] = useState(props.nom);
  const [email, setEmail] = useState(props.email);
  const [phone, setPhone] = useState(props.phone);
  const [role, setRole] = useState(props.role);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    setNom(props.nom);
    setEmail(props.email);
    setPhone(props.phone);
    setRole(props.role);
    setImagePreview(`https://gestion-maintenancebackend.vercel.app/usersImages/${props.image}`);
    setImageName(getImageNameFromUrl(props.image));
  }, [props]);

  const initModal = () => {
    setShow(false);
    window.location.reload();
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Create a preview for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Set the name of the selected file
    setImageName(file.name);
  }

  const getImageNameFromUrl = (url) => {
    if (!url) return ''; // Handle undefined or null url
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const fileNameParts = fileName.split('-');
    return fileNameParts[fileNameParts.length - 1];
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('role', role);
  
    if (selectedFile) {
      formData.append('image', selectedFile);
    } else {
      // Si aucun fichier sélectionné, utiliser l'image actuelle
      const currentImageBlob = await fetch(`https://gestion-maintenancebackend.vercel.app/usersImages/${props.image}`).then(res => res.blob());
      formData.append('image', currentImageBlob, props.image);
    }
  
    try {
      const response = await adminService.updateUser(props.id, formData);
  
      if (response.data.success) {
        alert('User updated successfully');
        window.location.reload();
      } else {
        alert(response.data.msg);
      }
  
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  }
  
  
  return (
    <Modal show={isShow} onHide={initModal}>
      <Modal.Header closeButton>
        <Modal.Title>Update User</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="nom" className="form-label">Name</label>
            <input type="text" className="form-control" id="nom" placeholder="Enter Name"
              value={nom} onChange={event => setNom(event.target.value)} required />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Enter Email"
              value={email} onChange={event => setEmail(event.target.value)} required />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input type="text" className="form-control" id="phone" placeholder="Enter Phone"
              value={phone} onChange={event => setPhone(event.target.value)} required />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <input type="text" className="form-control" id="role" placeholder="Enter Role"
              value={role} onChange={event => setRole(event.target.value)} required />
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">Image</label>
            <input className="form-control" type="file" id="image" onChange={handleFileChange} />
          </div>

          {imagePreview && (
            <div className="mb-3">
              <img
                src={imagePreview}
                alt="Current"
                className="img-fluid rounded"
                style={{ width: "200px", height: "200px" }} // Dimensions spécifiques
              />
              <p>Current Image: {imageName}</p>
            </div>
          )}

          {!selectedFile && !imagePreview && (
            <div className="mb-3">
              <img
                src={`https://gestion-maintenancebackend.vercel.app/usersImages/${props.image}`}
                alt="Current"
                className="img-fluid rounded"
                style={{ width: "200px", height: "200px" }} // Dimensions spécifiques
              />
              <p>Current Image: {props.image}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={initModal}>Close</Button>
          <Button variant="primary" type="submit">Update</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default UpdateUserModal;
