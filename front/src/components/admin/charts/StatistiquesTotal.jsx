import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line, Doughnut, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale } from 'chart.js';
import adminService from '../../../services/adminService';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement,RadialLinearScale);

const StatistiquesTotal = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminService.getFichesDemandes();
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching statistics data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const polarData = {
    labels: ['Total', 'Acceptées', 'Refusées', 'En Cours'],
    datasets: [
      {
        label: 'My Dataset',
        data: [data.totalDemandes, data.demandesAcceptees, data.demandesRefuser, data.demandesEnCours],
        backgroundColor: ['red', 'blue', 'yellow', 'green'],
      },
    ],
  };

  const barData = {
    labels: ['Total', 'Acceptées', 'Refusées', 'En Cours'],
    datasets: [
      {
        label: 'Demandes',
        data: [data.totalDemandes, data.demandesAcceptees, data.demandesRefuser, data.demandesEnCours],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 205, 86, 0.6)'],
      },
    ],
  };

  const pieData = {
    labels: [`Acceptées: ${data.pourcentageAcceptees.toFixed(2)}%`, `Refusées: ${data.pourcentageRefuser.toFixed(2)}%`, `En Cours: ${data.pourcentageEnCours.toFixed(2)}%`],
    datasets: [
      {
        data: [data.pourcentageAcceptees, data.pourcentageRefuser,data.pourcentageEnCours],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)','rgba(255, 205, 86, 0.6)'],
      },
    ],
  };  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Statistiques des Fiches</h2>
      <div className="row text-center mb-4">
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Demandes</h5>
              <p className="card-text display-5">{data.totalDemandes}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Demandes Acceptées</h5>
              <p className="card-text display-5">{data.demandesAcceptees}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Demandes Refusées</h5>
              <p className="card-text display-5">{data.demandesRefuser}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Demandes En Cours</h5>
              <p className="card-text display-5">{data.demandesEnCours}</p>
            </div>
          </div>
        </div>
      </div>  
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title text-center">Graphique à Barres</h5>
              <Bar data={barData} />
            </div>
          </div>
          </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title text-center">Graphique Circulaire</h5>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title text-center">Graphique Linéaire</h5>
              <Line data={barData} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title text-center">Graphique en Anneau</h5>
              <Doughnut data={pieData} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title text-center">Graphique Polaire</h5>
              <PolarArea data={polarData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesTotal;
