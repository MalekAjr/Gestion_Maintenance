import axios from "axios";

const AdminForm = {
  token: localStorage.getItem("token"),
  config: {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    }
  },

  // Calendar event methods
  createEvent(formData) {
    const url = "http://localhost:8000/api/create-event";
    return axios.post(url, formData, this.config);
  },

  getEvents() {
    const url = "http://localhost:8000/api/get-events";
    return axios.get(url, this.config);
  },

  getEventById(id) {
    const url = `http://localhost:8000/api/get-event/${id}`;
    return axios.get(url, this.config);
  },

  searchEventOneUser(query) {
    const url = `http://localhost:8000/api/get-events/?query=${query}`;
    return axios.get(url, this.config);
  },

  updateEvent(updatedEvent) {
    const url = `http://localhost:8000/api/update-event/${updatedEvent._id}`;
    return axios.put(url, updatedEvent, this.config);
  },

  deleteEvent(id) {
    const url = `http://localhost:8000/api/delete-event/${id}`;
    return axios.get(url, this.config);  // keeping this as axios.get to match your backend expectations
  },

  // User methods
  getUsers() {
    const url = "http://localhost:8000/api/get-users/";
    return axios.get(url, this.config);
  },

  getClients() {
    const url = "http://localhost:8000/api/get-clients/";
    return axios.get(url, this.config);
  },

  getListeTechniciens() {
    const url = "http://localhost:8000/api/getliste-techniciens/";
    return axios.get(url, this.config);
  },

  updateUser(userId, formData) {
    const url = `http://localhost:8000/api/update-user/${userId}`;
    const configWithMultipart = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.token
      }
    };
    return axios.put(url, formData, configWithMultipart);
  },

  deleteUser(id) {
    const url = `http://localhost:8000/api/delete-user/${id}`;
    return axios.delete(url, this.config);
  },

  searchUsers(query) {
    const url = `http://localhost:8000/api/get-users/?query=${query}`;
    return axios.get(url, this.config);
  },

  // Car methods
  createCar(formData) {
    const url = "http://localhost:8000/api/create-car";
    return axios.post(url, formData, this.config);
  },

  getCars() {
    const url = "http://localhost:8000/api/get-cars";
    return axios.get(url, this.config);
  },

  updateCar(updatedCar) {
    const url = `http://localhost:8000/api/update-car/${updatedCar._id}`;
    return axios.put(url, updatedCar, this.config);
  },

  deleteCar(id) {
    const url = `http://localhost:8000/api/delete-car/${id}`;
    return axios.delete(url, this.config);
  },

  searchCars(query) {
    const url = `http://localhost:8000/api/search-cars/?query=${query}`;
    return axios.get(url, this.config);
  },

  getCarById(carId) {
    const url = `http://localhost:8000/api/get-car/${carId}`;
    return axios.get(url, this.config);
  },

  getTechniciens(startDate, endDate) {
    const url = "http://localhost:8000/api/get-techniciens-sans-evenements";
    const requestData = { startDate, endDate };
    return axios.post(url, requestData, this.config);
  },

  getVoituresSansEvenements(startDate, endDate) {
    const url = "http://localhost:8000/api/get-carssansevenements";
    const requestData = { startDate, endDate };
    return axios.post(url, requestData, this.config);
  },

  // Other user methods
  getUser() {
    const url = "http://localhost:8000/api/get-user/";
    return axios.get(url, this.config);
  },

  getFichesDemandes() {
    const url = "http://localhost:8000/api/get-fiches-demandes";
    return axios.get(url, this.config);
  },

  // Notification methods
  addNotification(notificationData) {
    const url = "http://localhost:8000/api/add-notification";
    return axios.post(url, notificationData, this.config);
  },

  getLastNotification() {
    const url = "http://localhost:8000/api/last-notification-message";
    return axios.get(url, this.config);
  },

  getAllNotifications() {
    const url = "http://localhost:8000/api/get-all-notifications";
    return axios.get(url, this.config);
  },

  getUnreadNotifications() {
    const url = "http://localhost:8000/api/unread-notifications";
    return axios.get(url, this.config);
  },

  markNotificationsAsRead() {
    const url = "http://localhost:8000/api/mark-notifications-as-read";
    return axios.post(url, {}, this.config);
  },

  // Signup methods
  createUser(formDataToSend) {
    const url = "http://localhost:8000/api/signup/";
    return axios.post(url, formDataToSend, this.config);
  }
};

export default AdminForm;
