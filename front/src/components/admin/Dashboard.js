import React, { useState, useEffect } from 'react';
import { Layout, Menu, Modal } from 'antd';
import {
  DesktopOutlined,
  CalendarOutlined,
  CheckOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  BellOutlined,
  CarFilled,
  // ShopOutlined,
  DollarOutlined,
  FileTextOutlined,
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
import ShowTicketsAdmin from './Tickets/ShowTicketsAdmin';
import io from 'socket.io-client';
import { notification } from 'antd';
import { Badge } from 'antd';

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
  const [notifications, setNotifications] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showBadgeCount, setShowBadgeCount] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  
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

  
  const fetchNotifications = async () => {
    try {
      const response = await adminService.getAllNotifications();
      setNotifications(response.data);
      setShowBadgeCount(response.data.length > 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  
  useEffect(() => {
    const socket = io('http://localhost:8000');
  
    socket.on('notification', (notificationData) => {
      setNotifications((prevNotifications) => [...prevNotifications, notificationData]);
      const notificationMessage = notificationData.message || 'Vous avez une nouvelle notification.';
      notification.info({
        message: 'Nouvelle Notification',
        description: notificationMessage,
        placement: 'bottomRight',
      });
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  
  /*
  const handleNotificationClick = () => {
    fetchNotifications();
    showModal();
    setShowBadgeCount(false); // Réinitialiser showBadgeCount à false lorsqu'on clique sur l'icône de notification
  };
*/

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await adminService.getAllNotifications();
      setNotifications(response.data);
      setShowBadgeCount(response.data.length > 0); // Afficher le compteur uniquement s'il y a des notifications non lues
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  fetchNotifications();

}, []);



/*
const handleNotificationClick = () => {
    /*notification.info({
      message: 'Nouvelle Notification',
      description: 'Vous avez une nouvelle notification.',
      placement: 'bottomRight',
      duration: 2,
    });
    setNotifications([]);
};
  */
useEffect(() => {
  const fetchInitialNotifications = async () => {
    try {
      const response = await adminService.getUnreadNotifications();
      setNotifications(response.data);
      setShowBadgeCount(response.data.length > 0); // Afficher le compteur uniquement s'il y a des notifications non lues
    } catch (error) {
      console.error('Error fetching initial notifications:', error);
    }
  };

  fetchInitialNotifications();

}, []);

const handleNotificationClick = async () => {
  try {
    await adminService.markNotificationsAsRead();
    setNotifications([]); // Vider les notifications
    setShowBadgeCount(false); // Réinitialiser showBadgeCount à false lorsqu'on clique sur l'icône de notification
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
};
/*
const handleNotificationClick = async () => {
  try {
    await adminService.markNotificationsAsRead();
    setNotifications([]);
    setShowBadgeCount(false); // Réinitialiser showBadgeCount à false lorsqu'on clique sur l'icône de notification
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
};
*/

const handleBadgeClick = async () => {
  try {
    setIsModalVisible(true); // Afficher le modal
    await adminService.markNotificationsAsRead(); // Marquer toutes les notifications comme lues
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        read: true, // Marquer la notification comme lue
      }))
    );
    setShowBadgeCount(true);
     // Réinitialiser le compteur de badge à false
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
};




return (
    loading?<div>loading</div>:
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
              Tableau de Bord
            </Menu.Item>
           
            <Menu.Item key="planning" icon={<CalendarOutlined />}>
              Planning
            </Menu.Item>
            <Menu.Item key="Taches*Technicien"  icon={<UserOutlined />}>
              Tache + Technicien
            </Menu.Item>
            <SubMenu key="taches" icon={<CheckOutlined />} title="Taches">
              {/** <Menu.Item key="tache1">Task 1</Menu.Item>
              <Menu.Item key="tache2">Task 2</Menu.Item>  */}
              <Menu.Item key="eventsplanning">Plan D'événements</Menu.Item>
            </SubMenu>
            <SubMenu key="manage" icon={<TeamOutlined />} title="Gérer L'équipe">
              <Menu.Item key="clients">Clients</Menu.Item>
              <Menu.Item key="technicians">Techniciens</Menu.Item>
              <Menu.Item key="users">Utilisateurs</Menu.Item>
            </SubMenu>
            <SubMenu key="details" icon={<FileTextOutlined />} title="Details">
            <Menu.Item key="tickets">Tickets</Menu.Item>
            <Menu.Item key="demandeordremission">Ordres Des Missions</Menu.Item>
            <Menu.Item key="demandefichesintervention">Fiches Des interventions</Menu.Item>
            </SubMenu>
            <Menu.Item key="cars" icon={<CarFilled />}>
              Voitures
            </Menu.Item>
            <SubMenu key="achat" icon={<DollarOutlined  />} title="achat">
                <Menu.Item key="achat">achat</Menu.Item>
            </SubMenu>
            <Menu.Item key="charts" icon={<FaChartArea />}>
              ChartsMenuItem
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              Paramètres
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{selectedMenuItem}</Breadcrumb.Item>
            </Breadcrumb> */}
            <div className={`site-layout-background ${darkMode ? 'dark' : 'light'}`} style={{ padding: 24, minHeight: 360 }}>
              <DndProvider backend={HTML5Backend}>
              <div>
              <div className="d-flex justify-content-end align-items-center">
              <Badge count={showBadgeCount ? notifications.filter(notification => !notification.read).length : 0} onClick={handleBadgeClick}>
                  <BellOutlined style={{ fontSize: '24px' }} />
                </Badge>

                </div>
                <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                width={600}
              >
                <div className="notification-container" style={{ maxHeight: '500px', overflowY: 'auto',  paddingRight: '15px',paddingLeft: '15px' }}>
                  <h3 style={{ textAlign: "center", boxShadow: "10px 5px 5px #ff5a5f", marginRight: "50px", marginLeft: "30px" }}>Notifications</h3>
                  <ul className="list-group">
                    {notifications
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((notification, index) => {
                        const notificationDate = new Date(notification.date);
                        const formattedDate = `${notificationDate.getFullYear()}-${(notificationDate.getMonth() + 1).toString().padStart(2, '0')}-${notificationDate.getDate().toString().padStart(2, '0')} à ${notificationDate.getHours().toString().padStart(2, '0')}:${notificationDate.getMinutes().toString().padStart(2, '0')}`;

                        const currentDate = new Date();
                        const timeDifference = currentDate - notificationDate;

                        const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
                        const daysDifference = Math.floor(hoursDifference / 24);
                        const yearsDifference = Math.floor(daysDifference / 365);

                        let timeAgoMessage = '';

                        if (yearsDifference > 0) {
                          timeAgoMessage = `${yearsDifference} an${yearsDifference > 1 ? 's' : ''}`;
                        } else if (daysDifference > 0) {
                          timeAgoMessage = `${daysDifference} jour${daysDifference > 1 ? 's' : ''}`;
                        } else if (hoursDifference > 0) {
                          timeAgoMessage = `${hoursDifference} heure${hoursDifference > 1 ? 's' : ''}`;
                        }

                        return (
                          <li className="list-group-item" key={index}>
                            {notification.message} le <span style={{ fontSize: '16px' }}>{formattedDate}</span> {timeAgoMessage && `il y a ${timeAgoMessage}`}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </Modal>

                </div>



                {selectedMenuItem === 'dashboard' && (
                  <div className="overflow-auto">
                     <Link to="/dashboard">
                      <button className="btn btn-primary">Vers Tableau de bord</button>
                    </Link>
                    <UserDashboard />
                  </div>
                )}
                
                {selectedMenuItem === 'planning' && (
                  <div className="overflow-auto">
                     <Link to="/admin/scheduler">
                      <button className="btn btn-primary">Vers Calendrier</button>
                    </Link>
                    <SchedulerCalendar />
                  </div>
                )}
                {selectedMenuItem === 'Taches*Technicien' && (
                  <div>
                     <Link to="/admin/schedulerPage">
                      <button className="btn btn-primary">Vers Tache et Techniciens</button>
                    </Link>
                    <SchedularPage />
                  </div>
                )}
              {/*  {selectedMenuItem === 'tache1' && <h1>Task 1 Content Goes Here</h1>}
                {selectedMenuItem === 'tache2' && <h1>Task 2 Content Goes Here</h1>} */}
                {selectedMenuItem === 'eventsplanning' && (
                  <div>
                     <Link to="/admin/showeventsplan">
                      <button className="btn btn-primary">Vers Liste Des Evenements</button>
                    </Link>
                    <ShowEvents />
                  </div>
                )}
                {selectedMenuItem === 'clients' &&  (
                  <div>
                     <Link to="/admin/listclients">
                      <button className="btn btn-primary">Vers List Clients</button>
                    </Link>
                    <ListeClients />
                  </div>
                )}
                {selectedMenuItem === 'technicians' &&  (
                  <div>
                     <Link to="/admin/listtechniciens">
                      <button className="btn btn-primary">Vers List Techniciens</button>
                    </Link>
                    <ListTechniciens />
                  </div>
                )}
                {selectedMenuItem === 'users' && (
                  <div>
                     <Link to="/admin/listusers">
                      <button className="btn btn-primary">Vers List Utilisateurs</button> 
                    </Link>
                    <ListUsers />
                  </div>
                )}
                {selectedMenuItem === 'settings' &&  <div>
                     <Link to="/dashboard">
                      <button className="btn btn-primary">Vers Dashboard</button>
                    </Link>
                    <UserProfile/>
                    </div> }
                {selectedMenuItem === 'cars' && (
                  <div>
                     <Link to="/admin/listcars">
                      <button className="btn btn-primary">Vers Liste Voitures</button>
                    </Link>
                    <ListCars />
                  </div>
                )}
                {selectedMenuItem === 'demandefichesintervention' && (
                  <div>
                     <Link to="/admin/demandesfiches">
                      <button className="btn btn-primary">Vers Liste des Fiches d'Intervention </button>
                    </Link>
                    <FicheDemandes />
                  </div>
                )}
                {selectedMenuItem === 'demandeordremission' && (
                  <div>
                     <Link to="/admin/consulter-ordre">
                      <button className="btn btn-primary">Vers Liste Des Ordres Des Missions </button>
                    </Link>
                    <ShowOrdreMission />
                  </div>
                )}
                {selectedMenuItem === 'achat' && (
                  <div>
                     <Link to="/admin/achat">
                      <button className="btn btn-primary">Vers Service Achat</button>
                    </Link>
                    <ServiceAchat />
                  </div>
                )}
                 {selectedMenuItem === 'tickets' && (
                  <div>
                     <Link to="/admin/showtickets">
                      <button className="btn btn-primary">Vers Tickets</button>
                    </Link>
                    <ShowTicketsAdmin />
                  </div>
                )}
                {selectedMenuItem === 'charts' && (
                  <div>
                     <Link to="/admin/statistiques">
                      <button className="btn btn-primary">Vers Charts</button>
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
