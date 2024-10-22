import React from 'react';

function Card({ text }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <p className="text-xl">{text}</p>
    </div>
  );
}

export default Card;
