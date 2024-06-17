import React from 'react';
import { BsArrowRepeat, BsX, BsCheck } from 'react-icons/bs';
import { FaCheckCircle,FaTimesCircle } from 'react-icons/fa';

function StatusOrdreMissionTechnicien({ statuttechnicien }) {
  let text, textColor, icon, textSize, iconSize;

  switch (statuttechnicien) { 
    case 0:
      text = 'Ordre refusée';
      textColor = 'text-danger';
      icon = <FaTimesCircle color="red" size={24} className="me-2" /> //<BsX />;
      textSize = 'h6';
      iconSize = 'fs-3';
      break;
    case 1:
      text = 'En Cours';
      textColor = 'text-primary';
      icon = <BsArrowRepeat />;
      textSize = 'h6';
      iconSize = 'fs-3';
      break;
    case 2:
      text = 'Ordre acceptée';
      textColor = 'text-success';
      icon = <FaCheckCircle color="#32CD32" size={24} className="me-2" /> //<BsCheck />;
      textSize = 'h6';
      iconSize = 'fs-3';
      break;
    default:
      text = '';
      textColor = '';
      icon = null;
      textSize = '';
      iconSize = '';
      break;
  }

  return (
    <div className="d-flex align-items-center">
      {icon && <span className={`me-2 ${iconSize} ${textColor}`}>{icon}</span>}
      <h4 className={`m-0 ${textSize} ${textColor}`}>{text}</h4>
    </div>
  );
}

export default StatusOrdreMissionTechnicien;
