import React from 'react';
import { BsArrowRepeat, BsX, BsCheck } from 'react-icons/bs';

function StatusBadgeAdmin({ statuttechnique }) {
  let text, bgColor, icon, textSize, iconSize;

  switch (statuttechnique) {
    case 0:
      text = 'Demande refusée';
      bgColor = 'bg-danger';
      icon = <BsX />;
      textSize = 'h6';
      iconSize = 'fs-3';
      break;
    case 1:
      text = 'En Cours';
      bgColor = 'bg-primary';
      icon = <BsArrowRepeat />;
      textSize = 'h6';
      iconSize = 'fs-3';
      break;
    case 2:
      text = 'Demande acceptée';
      bgColor = 'bg-success';
      icon = <BsCheck />;
      textSize = 'h6';
      iconSize = 'fs-3';
      break;
    default:
      text = '';
      bgColor = '';
      icon = null;
      textSize = '';
      iconSize = '';
      break;
  }

  return (
    
    <div className={`d-flex align-items-center justify-content-center text-white p-2 rounded ${bgColor}`}>
      {icon && <span className={`me-2 ${iconSize}`}>{icon}</span>}
      <h4 className={`m-0 text-center ${textSize}`}>{text}</h4>
    </div>
  );
}

export default StatusBadgeAdmin;
