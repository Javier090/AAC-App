import React from 'react';
import Draggable from 'react-draggable';

function Card({ text, onDragStart }) {
  return (
    <Draggable>
      <div
        className="bg-white p-6 rounded shadow text-center"
        draggable
        onDragStart={onDragStart}
      >
        <p className="text-xl">{text}</p>
      </div>
    </Draggable>
  );
}

export default Card;
