// Card.js
import React from 'react';

export const Card = ({ title, value }) => {
  return (
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f7f7f7',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      minWidth: '150px',
      textAlign: 'center'
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
};
