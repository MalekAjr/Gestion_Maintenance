import axios from "axios";
let token = localStorage.getItem("token")
let config = {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
class FicheIntervention {
    
    createFiche(formData) {
        let token = localStorage.getItem("token")
        const url = "http://localhost:8000/api/create-fiche/";
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token
            }
        };
        return axios.post(url, formData, config);
    }

    getFiches() {
        const url = "http://localhost:8000/api/get-fiches/";

        return axios.get(url,config);
    }
    

    deleteFiche(id) {
        const url = "http://localhost:8000/api/delete-fiche/" + id;
        return axios.delete(url,config);
    }

    searchFiches(query) {
        let url = "http://localhost:8000/api/get-fiches/";

        return axios.get(url,config);
    }

    updateFiche(ficheId, formData) {
        const url = `http://localhost:8000/api/update-fiche/${ficheId}`;
        let token = localStorage.getItem("token")
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token
                
            }
        };
        return axios.put(url, formData, config);
    }
    
    getFicheById(id) {
        const url = `http://localhost:8000/api/get-ficheuser/${id}/`;
        return axios.get(url, config);
      }
    
      getFicheOneUser() {
        const url = "http://localhost:8000/api/get-ficheuser/";
        return axios.get(url, config);
      }

      searchFicheOneUser(query) {
        let url = "http://localhost:8000/api/get-ficheuser/";

        return axios.get(url,config);
    }


    async createOrdreMission(formData) {
        const url = "http://localhost:8000/api/create-ordremission";

             return axios.post(url, formData, config);
    }

    getOrdresMissions() {
        const url = "http://localhost:8000/api/get-ordresmissions/";
        return axios.get(url, config);
    }
  
    searchOrdreMissionsOneUser(query) {
        const url = `http://localhost:8000/api/get-ordresmissions/?query=${query}`;
        return axios.get(url, config);
    }
    

    deleteOrdreMission(id) {
        const url = `http://localhost:8000/api/delete-ordremission/${id}`;
        return axios.delete(url, config);
    }
    
    
    updateOrdreMission(ordreMissionId, formData) {
        const url = `http://localhost:8000/api/update-ordremission/${ordreMissionId}`;
        return axios.put(url, formData, config);
    }
    
    getOrdreMissionById(id) {
        const url = `http://localhost:8000/api/get-ordremissionuser/${id}/`;
        return axios.get(url, config);
    }
    
    getOrdreMissionsOneUser() {
        const url = "http://localhost:8000/api/get-ordremissiononeuser";
        return axios.get(url, config);
    }

    createTicket(formData) {
        const url = "http://localhost:8000/api/create-ticket";
        return axios.post(url, formData, config);
      }

      getTickets() {
        const url = "http://localhost:8000/api/get-tickets";
        return axios.get(url, config);
      }
    
      getOneTicket(id) {
        const url = `http://localhost:8000/api/get-ticket/${id}`;
        return axios.get(url, config);
      }
      getTicketsUser() {
        const url = "http://localhost:8000/api/get-ticketuser";
        return axios.get(url, config);
      }

      deleteTicket(id) {
        const url = `http://localhost:8000/api/delete-ticket/${id}`;
        return axios.delete(url, config);
      }
    
      updateTicket(ticketId, formData) {
        const url = `http://localhost:8000/api/update-ticket/${ticketId}`;
        return axios.put(url, formData, config);
      }
    
      searchTickets(query) {
        const url = `http://localhost:8000/api/search-tickets/?query=${query}`;
        return axios.get(url, config);
      }

      getPlanningOneTechnicien() {
        const url = "http://localhost:8000/api/getPlanningOneTechnicien";
        return axios.get(url, config);
    }

     getClientDetails = (clientName) => {
      const url= `http://localhost:8000/api/details/${clientName}`;
      return axios.get(url, config);
    };

    sendEmail(userEmail) {
      const url = "http://localhost:8000/api/sendemail";
      const data = { userEmail };
      return axios.post(url, data, config);
  }
  
}

export default new FicheIntervention();
