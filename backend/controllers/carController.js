const Car = require('../models/carModel');
const Event = require('../models/eventModel');

const createCar = async (req, res) => {
    try {
        const { matricule, brand, model, year, color } = req.body;
            
        const newCar = new Car({
            matricule,
            brand,
            model,
            year,
            color,
        });

        const carData = await newCar.save();

        console.log('Saved Car Data:', carData);

        res.status(200).send({ success: true, msg: 'Car Data saved successfully', data: carData });

    } catch (error) {
        console.error('Error saving Car Data:', error);
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getCars = async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 });

        res.status(200).send({ success: true, msg: 'Cars Data retrieved', data: cars });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getCarsWithoutEvents = async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
  
      if (!startDate || !endDate) {
        return res.status(400).json({ success: false, msg: 'Veuillez fournir une date de début et une date de fin' });
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const cars = await Car.find();
  
      const carsWithoutEvents = [];
  
      for (const car of cars) {
        const events = await Event.find({
            carName: car.matricule,
          $or: [
            { start: { $lt: end }, end: { $gt: start } },
            { start: { $gte: start, $lte: end } },
          ],
        });
  
        if (events.length === 0) {
          carsWithoutEvents.push(car);
        }
      }
  
      // Envoyer la liste des voitures sans événements pendant l'intervalle spécifié en réponse
      res.status(200).json({ success: true, msg: 'Voitures sans événements pendant l\'intervalle spécifié récupérées', data: carsWithoutEvents });
    } catch (error) {
      console.error('Erreur lors de la récupération des voitures sans événements pendant l\'intervalle spécifié :', error);
      res.status(500).json({ success: false, msg: 'Erreur serveur lors de la récupération des voitures sans événements pendant l\'intervalle spécifié' });
    }
  };
  

const deleteCar = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the car exists before deleting
        const existingCar = await Car.findById(id);
        if (!existingCar) {
            return res.status(400).send({ success: false, msg: 'Car already deleted' });
        }

        // Use Car model to delete the document by _id
        await Car.findByIdAndDelete(id);

        res.status(200).send({ success: true, msg: 'Car deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const updateCar = async (req, res) => {
    try {
        const carId = req.params.id;
        const { matricule, brand, model, year, color } = req.body;

        let updateFields = { matricule, brand, model, year, color };

        console.log("Updating car with ID:", carId);
        console.log("Update Fields:", updateFields);

        const updatedCar = await Car.findByIdAndUpdate(carId, updateFields, { new: true });

        if (!updatedCar) {
            console.log("Car not found.");
            return res.status(404).json({ success: false, msg: 'Car not found' });
        }

        console.log("Car updated successfully:", updatedCar);
        res.status(200).json({ success: true, msg: 'Car updated successfully', data: updatedCar });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(400).json({ success: false, msg: error.message });
    }
};

module.exports = {
    createCar,
    getCars,
    getCarsWithoutEvents,
    deleteCar,
    updateCar
};
