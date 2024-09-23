import axios from "axios";

const FicheIntervention = {
  token: localStorage.getItem("token"),
  config: {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    }
  },

  // Fiche methods
  createFiche(formData) {
    const url = "https://gestion-maintenancebackend.vercel.app/api/create-fiche/";
    const configWithMultipart = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.token
      }
    };
    return axios.post(url, formData, configWithMultipart);
  },

  getFiches() {
    const url = "https://gestion-maintenancebackend.vercel.app/api/get-fiches/";
    return axios.get(url, this.config);
  },

  deleteFiche(id) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/delete-fiche/${id}`;
    return axios.delete(url, this.config);
  },

  searchFiches() {
    const url = "https://gestion-maintenancebackend.vercel.app/api/get-fiches/";
    return axios.get(url, this.config);
  },

  updateFiche(ficheId, formData) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/update-fiche/${ficheId}`;
    const configWithMultipart = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.token
      }
    };
    return axios.put(url, formData, configWithMultipart);
  },

  getFicheById(id) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/get-ficheuser/${id}/`;
    return axios.get(url, this.config);
  },

  getFicheOneUser() {
    const url = "https://gestion-maintenancebackend.vercel.app/api/get-ficheuser/";
    return axios.get(url, this.config);
  },

  searchFicheOneUser() {
    const url = "https://gestion-maintenancebackend.vercel.app/api/get-ficheuser/";
    return axios.get(url, this.config);
  },

  createOrdreMission(formData) {
    const url = "https://gestion-maintenancebackend.vercel.app/api/create-ordremission";
    return axios.post(url, formData, this.config);
  },

  getOrdresMissions() {
    const url = "https://gestion-maintenancebackend.vercel.app/api/get-ordresmissions/";
    return axios.get(url, this.config);
  },

  searchOrdreMissionsOneUser(query) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/get-ordresmissions/?query=${query}`;
    return axios.get(url, this.config);
  },

  deleteOrdreMission(id) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/delete-ordremission/${id}`;
    return axios.delete(url, this.config);
  },

  updateOrdreMission(ordreMissionId, formData) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/update-ordremission/${ordreMissionId}`;
    return axios.put(url, formData, this.config);
  },

  getOrdreMissionById(id) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/get-ordremissionuser/${id}/`;
    return axios.get(url, this.config);
  },

  getOrdreMissionsOneUser() {
    const url = "https://gestion-maintenancebackend.vercel.app/api/get-ordremissiononeuser";
    return axios.get(url, this.config);
  },

  createTicket(formData) {
    const url = "https://gestion-maintenancebackend.vercel.app/api/create-ticket";
    return axios.post(url, formData, this.config);
  },

  getTickets() {
    const url = "https://gestion-maintenancebackend.vercel.app/api/get-tickets";
    return axios.get(url, this.config);
  },

  getOneTicket(id) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/get-ticket/${id}`;
    return axios.get(url, this.config);
  },

  getTicketsUser() {
    const url = "https://gestion-maintenancebackend.vercel.app/api/get-ticketuser";
    return axios.get(url, this.config);
  },

  deleteTicket(id) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/delete-ticket/${id}`;
    return axios.delete(url, this.config);
  },

  updateTicket(ticketId, formData) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/update-ticket/${ticketId}`;
    return axios.put(url, formData, this.config);
  },

  searchTickets(query) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/search-tickets/?query=${query}`;
    return axios.get(url, this.config);
  },

  getPlanningOneTechnicien() {
    const url = "https://gestion-maintenancebackend.vercel.app/api/getPlanningOneTechnicien";
    return axios.get(url, this.config);
  },

  getClientDetails(clientName) {
    const url = `https://gestion-maintenancebackend.vercel.app/api/details/${clientName}`;
    return axios.get(url, this.config);
  },

  sendEmail(userEmail) {
    const url = "https://gestion-maintenancebackend.vercel.app/api/sendemail";
    const data = { userEmail };
    return axios.post(url, data, this.config);
  }
};

export default FicheIntervention;
