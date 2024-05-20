import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Importation de Container
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import UserList from './UsersList';
import withAuthorization from '../authorization/withAuthorization';
import TechnicienList from './TechnicienList';
import CarsList from './CarsList';
import ShedularCalendarList from './ShedularCalendarList';

const SchedulePage = () => {
  const [droppedUser, setDroppedUser] = useState(null);
  const [droppedTechnicien, setDroppedTechnicien] = useState(null);
  const [droppedCar, setDroppedCar] = useState(null);

  const handleDropUser = (item) => {
    setDroppedUser(item);
  };

  const handleDropTechnicien = (item) => {
    setDroppedTechnicien(item);
  };

  const handleDropCar = (item) => {
    setDroppedCar(item);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Utilisation du composant Container pour ajouter des marges à gauche et à droite */}
      <Container>
        <Row>
          <Col md={4}>
            <CarsList handleDropCar={handleDropCar} />
          </Col>
          <Col md={4}>
            <UserList handleDropUser={handleDropUser} />
          </Col>
          <Col md={4}>
            <TechnicienList handleDropTechnicien={handleDropTechnicien} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div>
              {droppedUser && (
                <div>
                  <strong>Dropped User:</strong> {droppedUser.nom}
                </div>
              )}
              {droppedTechnicien && (
                <div>
                  <strong>Dropped Technicien:</strong> {droppedTechnicien.nom}
                </div>
              )}
              {droppedCar && (
                <div>
                  <strong>Dropped Car:</strong> {droppedCar.matricule}
                </div>
              )}
              <ShedularCalendarList
                droppedUser={droppedUser}
                droppedTechnicien={droppedTechnicien}
                droppedCar={droppedCar}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </DndProvider>
  );
};

const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(SchedulePage);
