import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import {
  DesktopOutlined,
  CalendarOutlined,
  CheckOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './Dashboard.css';
import { useTheme } from '../ThemeContext'; 

import SchedulerCalendar from './SchedulerCalendar';
import ListUsers from './ListUsers';
import SchedularPage from './SchedularPage';
import FicheDemandes from './FicheDemandes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link } from 'react-router-dom';
import ListCars from './ListCars';
import withAuthorization from '../authorization/withAuthorization';
import ServiceAchat from '../serviceachat/ServiceAchat';
import UserDashboard from '../UserDashboard';
import ShowOrdreMission from './OrdreMission/ShowOrdreMission';
import ShowEvents from './Events/ShowEvents';
import adminService from '../../services/adminService';
import UserProfile from '../UserProfile';
import ListeClients from './ListeUtilisateurs/ListeClients';
import ListTechniciens from './ListeUtilisateurs/ListTechniciens';
import { FaChartArea } from 'react-icons/fa';
import StatistiquesTotal from './charts/StatistiquesTotal';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState({
    _id: '',
    nom: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
    if (e.key === 'profile') {
      const userIdParam = window.location.pathname.split('/').pop(); // Extract user ID from URL parameter
      setUserId(userIdParam); // Set userId state with the extracted user ID
    }
  };
  
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
    <div className="dashboard-container">
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} theme={darkMode ? 'dark' : 'light'}>
          <div className="logo" />
          <Menu
            theme={darkMode ? 'dark' : 'light'}
            defaultSelectedKeys={['dashboard']}
            selectedKeys={[selectedMenuItem]}
            mode="inline"
            onClick={handleMenuClick}
          >
             <Menu.Item key="dashboard" icon={<DesktopOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                Edit Profile
            </Menu.Item>
           
            <Menu.Item key="planning" icon={<CalendarOutlined />}>
              Planning
            </Menu.Item>
            <Menu.Item key="Taches*Technicien"  icon={<UserOutlined />}>
              Tache + Technicien
            </Menu.Item>
            <SubMenu key="taches" icon={<CheckOutlined />} title="Taches">
              <Menu.Item key="tache1">Task 1</Menu.Item>
              <Menu.Item key="tache2">Task 2</Menu.Item>
              <Menu.Item key="eventsplanning">Plan D'événements</Menu.Item>
            </SubMenu>
            <SubMenu key="manage" icon={<TeamOutlined />} title="Manage Team">
              <Menu.Item key="clients">Clients</Menu.Item>
              <Menu.Item key="technicians">Techniciens</Menu.Item>
              <Menu.Item key="users">Users</Menu.Item>
            </SubMenu>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
            <SubMenu key="details" icon={<TeamOutlined />} title="Details">
              <Menu.Item key="cars">Cars</Menu.Item>
              <Menu.Item key="achat">achat</Menu.Item>
              <Menu.Item key="demandefichesintervention">Fiches Des interventions</Menu.Item>
              <Menu.Item key="demandeordremission">Ordres Des Missions</Menu.Item>
            </SubMenu>
            <Menu.Item key="charts" icon={<FaChartArea />}>
              ChartsMenuItem
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{selectedMenuItem}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={`site-layout-background ${darkMode ? 'dark' : 'light'}`} style={{ padding: 24, minHeight: 360 }}>
              <DndProvider backend={HTML5Backend}>
                {selectedMenuItem === 'dashboard' && <UserDashboard />}
                {selectedMenuItem === 'profile' && <UserProfile/> }
                
                {selectedMenuItem === 'planning' && (
                  <div className="overflow-auto">
                     <Link to="/admin/scheduler">
                      <button className="btn btn-primary">Go to Scheduler</button>
                    </Link>
                    <SchedulerCalendar />
                  </div>
                )}
                {selectedMenuItem === 'Taches*Technicien' && (
                  <div>
                     <Link to="/admin/schedulerPage">
                      <button className="btn btn-primary">Go to SchedulerPage</button>
                    </Link>
                    <SchedularPage />
                  </div>
                )}
                {selectedMenuItem === 'tache1' && <h1>Task 1 Content Goes Here</h1>}
                {selectedMenuItem === 'tache2' && <h1>Task 2 Content Goes Here</h1>}
                {selectedMenuItem === 'eventsplanning' && (
                  <div>
                     <Link to="/admin/showeventsplan">
                      <button className="btn btn-primary">Liste Des Evenements</button>
                    </Link>
                    <ShowEvents />
                  </div>
                )}
                {selectedMenuItem === 'clients' &&  (
                  <div>
                     <Link to="/admin/listclients">
                      <button className="btn btn-primary">Go to List Clients</button>
                    </Link>
                    <ListeClients />
                  </div>
                )}
                {selectedMenuItem === 'technicians' &&  (
                  <div>
                     <Link to="/admin/listtechniciens">
                      <button className="btn btn-primary">Go to List Techniciens</button>
                    </Link>
                    <ListTechniciens />
                  </div>
                )}
                {selectedMenuItem === 'users' && (
                  <div>
                     <Link to="/admin/listusers">
                      <button className="btn btn-primary">Go to List Users</button>
                    </Link>
                    <ListUsers />
                  </div>
                )}
                {selectedMenuItem === 'settings' && <h1>Settings Content Goes Here</h1>}
                {selectedMenuItem === 'cars' && (
                  <div>
                     <Link to="/admin/listcars">
                      <button className="btn btn-primary">Go to Liste Cars</button>
                    </Link>
                    <ListCars />
                  </div>
                )}
                {selectedMenuItem === 'demandefichesintervention' && (
                  <div>
                     <Link to="/admin/demandesfiches">
                      <button className="btn btn-primary">Go to Liste des Fiches d'Intervention </button>
                    </Link>
                    <FicheDemandes />
                  </div>
                )}
                {selectedMenuItem === 'demandeordremission' && (
                  <div>
                     <Link to="/admin/consulter-ordre">
                      <button className="btn btn-primary">Go to Liste Des Ordres Des Missions </button>
                    </Link>
                    <ShowOrdreMission />
                  </div>
                )}
                {selectedMenuItem === 'achat' && (
                  <div>
                     <Link to="/admin/achat">
                      <button className="btn btn-primary">Go to Service Achat</button>
                    </Link>
                    <ServiceAchat />
                  </div>
                )}
                {selectedMenuItem === 'charts' && (
                  <div>
                     <Link to="/admin/statistiques">
                      <button className="btn btn-primary">Go to Charts</button>
                    </Link>
                    <StatistiquesTotal />
                  </div>
                )}
              </DndProvider>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Maintenance Management ©2024 Created by Ajroud Malek Team</Footer>
        </Layout>
      </Layout>

    { /* <div className="toggle-button-container">
        <Button type="primary" onClick={toggleTheme}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Button>
      </div> */}
    </div>
  );
};

const allowedRoles = ['admin'];

export default withAuthorization(allowedRoles)(Dashboard);
