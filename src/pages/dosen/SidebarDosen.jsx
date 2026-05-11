import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, HelpCircle } from 'lucide-react';

const styles = `
  .sidebar {
    width: 250px;
    background: #1f2937;
    color: white;
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 20;
  }
  .sidebar-header {
    padding: 0 1.5rem 1.5rem;
    border-bottom: 1px solid #374151;
    font-size: 1.25rem;
    font-weight: 700;
  }
  .nav-list {
    list-style: none;
    padding: 1rem 0;
    flex: 1;
  }
  .nav-item a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    color: #d1d5db;
    text-decoration: none;
    transition: all 0.2s;
    font-size: 0.95rem;
  }
  .nav-item a:hover {
    background: #374151;
    color: white;
  }
  .nav-item a.active {
    background: #3b82f6;
    color: white;
  }
`;

const SidebarDosen = () => {
  return (
    <>
      <style>{styles}</style>
      <aside className="sidebar">
        <div className="sidebar-header">📘 Dosen Panel</div>
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/dosen/dashboard" end>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dosen/mahasiswa">
              <Users size={20} />
              Mahasiswa
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dosen/soal">
              <HelpCircle size={20} />
              Soal
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default SidebarDosen;