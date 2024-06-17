import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'; // Ajout de "Navigate"
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './components/authorization/AuthContext';
import Login from './components/Login';
import Login_Signup from './components/register/Login_Signup';
import CreateFormFicheIntervention from './components/ficheIntervention/CreateFormFicheIntervention';
import FicheInterventionTable from './components/ficheIntervention/ShowFicheIntervention';
import FicheDetails from './components/ficheIntervention/FicheDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SchedulerCalendar from './components/admin/SchedulerCalendar';
import FicheDemandes from './components/admin/FicheDemandes';
import ListUsers from './components/admin/ListUsers';
import SchedulePage from './components/admin/SchedularPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Unauthorized from './components/authorization/Unauthorized';
import LogoutButton from './components/register/LogoutButton';
import Navbartotal from './components/NavBar/NavBartotal';
import Dashboard from './components/admin/Dashboard';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import ServiceAchat from './components/serviceachat/ServiceAchat';
import ListCars from './components/admin/ListCars';
import UserProfile from './components/UserProfile';
import UserDashboard from './components/UserDashboard';
import CreateCar from './components/admin/CreateCar';
import UpdateCar from './components/admin/UpdateCar';
import ShowOrdreMissionTechnicien from './components/OrdreDeMissionTechnicien/ShowOrdreMissionTechnicien';
import OrdreDetailsTechnicien from './components/OrdreDeMissionTechnicien/OrdreDetailsTechnicien';
import ShowOrdreMission from './components/admin/OrdreMission/ShowOrdreMission';
import OrdreDetails from './components/admin/OrdreMission/OrdreDetails';
import CreateOrdreDeMissionTechnicien from './components/OrdreDeMissionTechnicien/CreateOrdreDeMissionTechnicien';
import ShowEvents from './components/admin/Events/ShowEvents';
import CreateEvent from './components/admin/Events/CreateEvent';
import CreateTicket from './components/Tickets/CreateTicketClient';
import CreateTicketAdmin from './components/admin/Tickets/CreateTicketAdmin';
import TicketDetailsAdmin from './components/admin/Tickets/TicketDetailsAdmin';
import TicketDetailsClient from './components/Tickets/TicketDetailsClient';
import ShowTicketsClient from './components/Tickets/ShowTicketsClient';
import ShowTicketsAdmin from './components/admin/Tickets/ShowTicketsAdmin';
import TechnicienShedulerCalendar from './components/PlanningTechnicien/TechnicienShedulerCalendar';
import 'bootstrap/dist/css/bootstrap.min.css';
import StatistiquesTotal from './components/admin/charts/StatistiquesTotal';
import ListeClients from './components/admin/ListeUtilisateurs/ListeClients';
import ListTechniciens from './components/admin/ListeUtilisateurs/ListTechniciens';
import FicheUpdate from './components/admin/FicheUpdate';
import UpdateEvent from './components/admin/Events/UpdateEvent';


function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter basename='/app'>
          <ThemeProvider>
            <AuthProvider>
              <Navbartotal />
              <Routes>
                {/* Routes publiques */}
                <Route path='/logout' element={<LogoutButton />} />
                <Route path="/admin/unauthorized" element={<Unauthorized />} />
                <Route path='/signup' element={<Login_Signup />} />
                <Route path='/login' element={<Login />} />
                <Route path='/createficheintervention' element={<CreateFormFicheIntervention />} />
                <Route path='/showficheIntervention' element={<FicheInterventionTable />} />
                <Route path='/fiche-details/:id' element={<FicheDetails />} />
                <Route path='/home' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/gerer-profile/:id' element={<UserProfile />} />
                <Route path='/dashboard' element={<UserDashboard />} />
                <Route path='/créer-ordre' element={<CreateOrdreDeMissionTechnicien />} />
                <Route path='/consulter-ordretechnicien' element={<ShowOrdreMissionTechnicien />} />
                <Route path='/ordre-detailstechnicien/:id' element={< OrdreDetailsTechnicien />} />
                <Route path='/createticketclient' element={<CreateTicket />} />
                <Route path='/showticketclient' element={<ShowTicketsClient />} />
                <Route path='/ticketdetails/:id' element={<TicketDetailsClient />} />

                {/* Routes protégées */}
                <Route path="/admin/listusers" element={<ListUsers />} />
                <Route path="/admin/listclients" element={<ListeClients />} />
                <Route path="/admin/listtechniciens" element={<ListTechniciens />} />
                <Route path='/admin/demandesfiches' element={<FicheDemandes />} />
                <Route path='/admin/updatefiche/:id' element={<FicheUpdate />} />
                <Route path='/admin/listcars' element={<ListCars />} />
                <Route path='/admin/modifier-voiture/:id' element={<UpdateCar />} />
                <Route path='/admin/créer-car' element={<CreateCar />} />
                <Route path='/admin/scheduler' element={<SchedulerCalendar />} />
                <Route path='/admin/schedulerPage' element={<SchedulePage />} />
                <Route path='/admin/showeventsplan' element={<ShowEvents />} />
                <Route path='/admin/create-event' element={<CreateEvent />} />
                <Route path='/admin/updateevent/:id' element={<UpdateEvent />} />
                
                <Route path='/admin/dashboard' element={<Dashboard />} />
                <Route path='/admin/achat' element={<ServiceAchat />} />
                <Route path='/admin/consulter-ordre' element={<ShowOrdreMission />} />
                <Route path='/admin/ordre-details/:id' element={<OrdreDetails />} />
                <Route path='/admin/showtickets' element={<ShowTicketsAdmin />} />
                <Route path='/admin/createticket' element={<CreateTicketAdmin />} />
                <Route path='/admin/details/:id' element={<TicketDetailsAdmin />} />
                <Route path="/admin/statistiques" element={<StatistiquesTotal />} />
                
                <Route path='/planningtechnicien' element={<TechnicienShedulerCalendar />} />
                
                {/* Redirection par défaut */}
                <Route path="/*" element={<Navigate to="/admin/unauthorized" />} />
              </Routes>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </DndProvider>
    </div>
  );
}

export default App;
