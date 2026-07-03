// src/komponen/MateriPagination.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPrevMateriInBab, getNextMateriInBab } from './Pagination';

const MateriPagination = ({ nextDisabled = false, prevDisabled = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const prev = getPrevMateriInBab(currentPath);
  const next = getNextMateriInBab(currentPath);

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '500',
    fontSize: '0.95rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
  };

  const disabledStyle = {
    ...buttonStyle,
    backgroundColor: '#d1d5db',
    color: '#6b7280',
    cursor: 'not-allowed',
    pointerEvents: 'none',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2.5rem',
    paddingTop: '1.5rem',
    borderTop: '2px solid #e5e7eb',
    gap: '1rem',
    flexWrap: 'wrap',
  };

  const labelStyle = {
    fontSize: '0.9rem',
    color: '#4b5563',
  };

  const handleNextClick = (e) => {
    if (nextDisabled || !next) {
      e.preventDefault();
      alert('Anda harus menyelesaikan latihan terlebih dahulu untuk melanjutkan ke materi berikutnya.');
      return false;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Tombol Sebelumnya */}
      {prev && !prevDisabled ? (
        <Link to={prev.path} style={buttonStyle}>
          ← {prev.label}
        </Link>
      ) : (
        <span style={disabledStyle}>← Sebelumnya</span>
      )}

      <span style={labelStyle}>
        {prev && next && !prevDisabled && !nextDisabled ? '' : ''}
      </span>

      {/* Tombol Selanjutnya */}
      {next ? (
        nextDisabled ? (
          <span style={{ ...buttonStyle, backgroundColor: '#d1d5db', color: '#6b7280', cursor: 'pointer' }} onClick={handleNextClick}>
            {next.label} →
          </span>
        ) : (
          <Link to={next.path} style={buttonStyle}>
            {next.label} →
          </Link>
        )
      ) : (
        <span style={disabledStyle}>Selanjutnya →</span>
      )}
    </div>
  );
};

export default MateriPagination;