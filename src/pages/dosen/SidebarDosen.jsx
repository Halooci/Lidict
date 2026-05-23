import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, HelpCircle, Menu, X } from 'lucide-react';

const styles = `
  /* SIDEBAR UTAMA */
  .sidebar-dosen {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background: #1f2937;
    color: white;
    transition: width 0.3s ease;
    z-index: 1000;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  }
  .sidebar-dosen.open {
    width: 250px;
  }
  .sidebar-dosen.closed {
    width: 70px;
  }

  /* HEADER dengan tombol burger */
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #374151;
    min-height: 64px;
  }
  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    white-space: nowrap;
    transition: opacity 0.2s;
  }
  .sidebar-dosen.closed .logo-text {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }
  .toggle-btn {
    background: #3b82f6;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: background 0.2s;
    width: 36px;
    height: 36px;
  }
  .toggle-btn:hover {
    background: #2563eb;
  }

  /* NAVIGASI */
  .nav-list {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    flex: 1;
  }
  .nav-item a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #d1d5db;
    text-decoration: none;
    transition: all 0.2s;
    font-size: 0.95rem;
    white-space: nowrap;
  }
  .nav-item a:hover {
    background: #374151;
    color: white;
  }
  .nav-item a.active {
    background: #3b82f6;
    color: white;
  }
  .sidebar-dosen.closed .nav-item a span {
    display: none;
  }
  .sidebar-dosen.closed .nav-item a {
    justify-content: center;
    padding: 0.75rem 0;
  }

  /* GLOBAL CLASS UNTUK MENGONTROL MARGIN KONTEN (akan digunakan oleh halaman lain) */
  body.sidebar-open .dashboard-content,
  body.sidebar-open .mahasiswa-container,
  body.sidebar-open .soal-container {
    margin-left: 250px;
  }
  body.sidebar-closed .dashboard-content,
  body.sidebar-closed .mahasiswa-container,
  body.sidebar-closed .soal-container {
    margin-left: 70px;
  }

  /* RESPONSIVE MOBILE */
  @media (max-width: 768px) {
    body.sidebar-open .dashboard-content,
    body.sidebar-open .mahasiswa-container,
    body.sidebar-open .soal-container,
    body.sidebar-closed .dashboard-content,
    body.sidebar-closed .mahasiswa-container,
    body.sidebar-closed .soal-container {
      margin-left: 0;
    }
    .sidebar-dosen {
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      width: 250px !important;
    }
    .sidebar-dosen.open {
      transform: translateX(0);
    }
    .sidebar-dosen.closed {
      transform: translateX(-100%);
    }
    body.sidebar-open-mobile::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    }
  }
`;

const SidebarDosen = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarDosenOpen');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarDosenOpen', isOpen);
    if (isOpen) {
      document.body.classList.remove('sidebar-closed');
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
      document.body.classList.add('sidebar-closed');
    }
  }, [isOpen]);

  // Handle mobile overlay
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && isOpen) {
        document.body.classList.add('sidebar-open-mobile');
      } else {
        document.body.classList.remove('sidebar-open-mobile');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <>
      <style>{styles}</style>
      <aside className={`sidebar-dosen ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {isOpen && <span className="logo-text">📘 Dosen Panel</span>}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/dosen/dashboard">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dosen/mahasiswa">
              <Users size={20} />
              <span>Mahasiswa</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dosen/soal">
              <HelpCircle size={20} />
              <span>Soal</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default SidebarDosen;