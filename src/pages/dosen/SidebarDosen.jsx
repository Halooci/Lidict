import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, HelpCircle, ClipboardList } from 'lucide-react';

const SidebarDosen = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarDosenOpen');
    return saved !== null ? saved === 'true' : true;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const adjustMargins = () => {
    const marginValue = (isOpen && !isMobile) ? '250px' : '0px';
    const containers = ['.dashboard-content', '.mahasiswa-container', '.soal-container', '.nilai-container'];
    containers.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.marginLeft = marginValue;
        el.style.transition = 'margin-left 0.3s ease';
      });
    });
  };

  useEffect(() => {
    adjustMargins();
    localStorage.setItem('sidebarDosenOpen', isOpen);
  }, [isOpen, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        adjustMargins();
      } else {
        document.querySelectorAll('.dashboard-content, .mahasiswa-container, .soal-container, .nilai-container').forEach(el => {
          el.style.marginLeft = '0px';
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const navbarHeight = 64;

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: isActive ? 'white' : '#d1d5db',
    backgroundColor: isActive ? '#3b82f6' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s',
    fontSize: '1rem',
  });

  return (
    <>
      {(!isOpen || (isMobile && !isOpen)) && (
        <button
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: `${navbarHeight + 12}px`,
            left: '16px',
            background: '#3b82f6',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            padding: '6px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 1100,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          ☰
        </button>
      )}

      <aside
        style={{
          position: 'fixed',
          top: `${navbarHeight}px`,
          left: 0,
          height: `calc(100vh - ${navbarHeight}px)`,
          background: '#1f2937',
          color: 'white',
          transition: 'width 0.3s ease, transform 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          overflowX: 'hidden',
          ...(isMobile
            ? {
                width: '250px',
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
              }
            : {
                width: isOpen ? '250px' : '0',
                visibility: isOpen ? 'visible' : 'hidden',
              }),
        }}
      >
        {isOpen && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderBottom: '1px solid #374151',
            }}
          >
            <button
              onClick={toggleSidebar}
              style={{
                background: '#374151',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                padding: '4px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              ☰
            </button>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}></div>
          </div>
        )}
        <ul style={{ listStyle: 'none', padding: '1rem 0', margin: 0 }}>
          <li style={{ marginBottom: '4px' }}>
            <NavLink to="/dosen/dashboard" end style={navLinkStyle}>
              <LayoutDashboard size={20} />
              <span>Dashboard Dosen</span>
            </NavLink>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <NavLink to="/dosen/mahasiswa" style={navLinkStyle}>
              <Users size={20} />
              <span>Daftar Mahasiswa</span>
            </NavLink>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <NavLink to="/dosen/soal" style={navLinkStyle}>
              <HelpCircle size={20} />
              <span>Daftar Soal</span>
            </NavLink>
          </li>
          {/* Tombol baru */}
          <li style={{ marginBottom: '4px' }}>
            <NavLink to="/dosen/nilai" style={navLinkStyle}>
              <ClipboardList size={20} />
              <span>Daftar Nilai Mahasiswa</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default SidebarDosen;