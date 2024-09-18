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
    const url = "http://localhost:8000/api/create-fiche/";
    const configWithMultipart = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.token
      }
    };
    return axios.post(url, formData, configWithMultipart);
  },

  getFiches() {
    const url = "http://localhost:8000/api/get-fiches/";
    return axios.get(url, this.config);
  },

  deleteFiche(id) {
    const url = `http://localhost:8000/api/delete-fiche/${id}`;
    return axios.delete(url, this.config);
  },

  searchFiches() {
    const url = "http://localhost:8000/api/get-fiches/";
    return axios.get(url, this.config);
  },

  updateFiche(ficheId, formData) {
    const url = `http://localhost:8000/api/update-fiche/${ficheId}`;
    const configWithMultipart = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.token
      }
    };
    return axios.put(url, formData, configWithMultipart);
  },

  getFicheById(id) {
    const url = `http://localhost:8000/api/get-ficheuser/${id}/`;
    return axios.get(url, this.config);
  },

  getFicheOneUser() {
    const url = "http://localhost:8000/api/get-ficheuser/";
    return axios.get(url, this.config);
  },

  searchFicheOneUser() {
    const url = "http://localhost:8000/api/get-ficheuser/";
    return axios.get(url, this.config);
  },

  createOrdreMission(formData) {
    const url = "http://localhost:8000/api/create-ordremission";
    return axios.post(url, formData, this.config);
  },

  getOrdresMissions() {
    const url = "http://localhost:8000/api/get-ordresmissions/";
    return axios.get(url, this.config);
  },

  searchOrdreMissionsOneUser(query) {
    const url = `http://localhost:8000/api/get-ordresmissions/?query=${query}`;
    return axios.get(url, this.config);
  },

  deleteOrdreMission(id) {
    const url = `http://localhost:8000/api/delete-ordremission/${id}`;
    return axios.delete(url, this.config);
  },

  updateOrdreMission(ordreMissionId, formData) {
    const url = `http://localhost:8000/api/update-ordremission/${ordreMissionId}`;
    return axios.put(url, formData, this.config);
  },

  getOrdreMissionById(id) {
    const url = `http://localhost:8000/api/get-ordremissionuser/${id}/`;
    return axios.get(url, this.config);
  },

  getOrdreMissionsOneUser() {
    const url = "http://localhost:8000/api/get-ordremissiononeuser";
    return axios.get(url, this.config);
  },

  createTicket(formData) {
    const url = "http://localhost:8000/api/create-ticket";
    return axios.post(url, formData, this.config);
  },

  getTickets() {
    const url = "http://localhost:8000/api/get-tickets";
    return axios.get(url, this.config);
  },

  getOneTicket(id) {
    const url = `http://localhost:8000/api/get-ticket/${id}`;
    return axios.get(url, this.config);
  },

  getTicketsUser() {
    const url = "http://localhost:8000/api/get-ticketuser";
    return axios.get(url, this.config);
  },

  deleteTicket(id) {
    const url = `http://localhost:8000/api/delete-ticket/${id}`;
    return axios.delete(url, this.config);
  },

  updateTicket(ticketId, formData) {
    const url = `http://localhost:8000/api/update-ticket/${ticketId}`;
    return axios.put(url, formData, this.config);
  },

  searchTickets(query) {
    const url = `http://localhost:8000/api/search-tickets/?query=${query}`;
    return axios.get(url, this.config);
  },

  getPlanningOneTechnicien() {
    const url = "http://localhost:8000/api/getPlanningOneTechnicien";
    return axios.get(url, this.config);
  },

  getClientDetails(clientName) {
    const url = `http://localhost:8000/api/details/${clientName}`;
    return axios.get(url, this.config);
  },

  sendEmail(userEmail) {
    const url = "http://localhost:8000/api/sendemail";
    const data = { userEmail };
    return axios.post(url, data, this.config);
  }
};

export default FicheIntervention;
