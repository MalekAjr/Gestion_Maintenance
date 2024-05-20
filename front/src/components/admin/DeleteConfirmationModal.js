import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import adminService from '../../services/adminService';

function DeleteConfirmationModal({ user, onClose, onDelete }) {
  const handleDelete = async () => {
    try {
      await adminService.deleteUser(user._id);
      onDelete(user);
      window.location.reload(); 
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete user ID: {user._id}?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmationModal;
