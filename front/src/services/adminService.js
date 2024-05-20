import axios from "axios";

class AdminForm {
  constructor() {
    this.token = localStorage.getItem("token");
    this.config = {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    };
  }

  // pour event de calndrier
  createEvent(formData) {
    const url = "http://localhost:8000/api/create-event";
    return axios.post(url, formData, this.config);
  }

  getEvents() {
    const url = "http://localhost:8000/api/get-events";
    return axios.get(url, this.config);
  }

  searchEventOneUser(query) {
    const url = `http://localhost:8000/api/get-events/?query=${query}`;
    return axios.get(url, this.config);
}

  updateEvent(updatedEvent) {
    const url = `http://localhost:8000/api/update-event/${updatedEvent._id}`;
    return axios.put(url, updatedEvent, this.config);
  }
  

  deleteEvent(id) {
    const url = `http://localhost:8000/api/delete-event/${id}`;
    return axios.get(url, this.config); // Use axios.delete for DELETE requests
  }

  getUsers() {
    const url = "http://localhost:8000/api/get-users/";
    return axios.get(url, this.config);
  }
  

  updateUser(updatedUser) {
    const url = `http://localhost:8000/api/update-user/${updatedUser._id}`;
    return axios.put(url, updatedUser, this.config);
  }
  
  updateUser(userId, formData) {
    const url = `http://localhost:8000/api/update-user/${userId}`;
    let token = localStorage.getItem("token")
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
            
        }
    };
    return axios.put(url, formData, config);
}


  deleteUser(id) {
    const url = `http://localhost:8000/api/delete-user/${id}`;
    return axios.delete(url, this.config);
  }

  searchUsers(query) {
    let url = `http://localhost:8000/api/get-users/?query=${query}`;
    return axios.get(url, this.config);
  }
  
  

  createCar(formData) {
    const url = "http://localhost:8000/api/create-car";
    return axios.post(url, formData, this.config);
  }

  getCars() {
    const url = "http://localhost:8000/api/get-cars";
    return axios.get(url, this.config);
  }

  updateCar(updatedCar) {
    const url = `http://localhost:8000/api/update-car/${updatedCar._id}`;
    return axios.put(url, updatedCar, this.config);
  }

  deleteCar(id) {
    const url = `http://localhost:8000/api/delete-car/${id}`;
    return axios.delete(url, this.config);
  }
  
  searchCars(query) {
    let url = `http://localhost:8000/api/search-cars/?query=${query}`;
    return axios.get(url, this.config);
  }


  getTechniciens(startDate, endDate) {
    const url = "http://localhost:8000/api/get-techniciens-sans-evenements";
    const requestData = { startDate, endDate };
    return axios.post(url, requestData, this.config);
  }
  
  getVoituresSansEvenements(startDate, endDate) {
    const url = "http://localhost:8000/api/get-carssansevenements";
    const requestData = { startDate, endDate };
    return axios.post(url, requestData, this.config);
}


getUser() {
    const url = "http://localhost:8000/api/get-user/";

    return axios.get(url, this.config);
}

getFichesDemandes() {
  const url = "http://localhost:8000/api/get-fiches-demandes";
  return axios.get(url, this.config);
}

}

export default new AdminForm();
