import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import adminService from '../../services/adminService';

function CreateUserModal({ show, onClose, onUserCreated }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState(''); // Ajout du champ password
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('role', role);
      formData.append('password', password); // Ajout du champ password
      if (image) {
        formData.append('image', image);
      }

      await adminService.createUser(formData);
      onClose();
      onUserCreated();
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Créer un Utilisateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNom">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Entrez l'email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Num Téléphone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formRole">
            <Form.Label>Rôle</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Sélectionnez un rôle</option>
              <option value="utilisateur">Utilisateur</option>
              <option value="technicien">Technicien</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formPassword"> {/* Champ pour le mot de passe */}
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Entrez le mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          {error && <p className="text-danger">{error}</p>}

          <Button variant="primary" type="submit">
            Créer
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateUserModal;
