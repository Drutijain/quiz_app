import React from 'react';
import './DomainSelection.css';
import mathImg from '../assets/math.png';
import historyImg from '../assets/history.png';
import geogImg from '../assets/geography.png';
import aptImg from '../assets/aptitude.png';
import polImg from '../assets/political.png';
import scienceImg from '../assets/science.png';


const domains = [
  { name: 'Maths', img: mathImg },
  { name: 'Science', img: scienceImg },
  { name: 'History', img: historyImg },
  { name: 'Geography', img: geogImg },
  { name: 'Politics', img: polImg },
  { name: 'Aptitude', img: aptImg }
];

function DomainSelection({ setDomain }) {
  return (
    <div className="card-container">
      {domains.map((domain) => (
        <div className="card" key={domain.name} onClick={() => setDomain(domain.name)}>
          <img src={domain.img} alt={domain.name} />
          <h3>{domain.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default DomainSelection;
