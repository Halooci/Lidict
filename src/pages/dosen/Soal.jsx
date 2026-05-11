import React from 'react';
import Navbar from '../komponen/Navbar';
import SidebarDosen from './SidebarDosen';
import { HelpCircle } from 'lucide-react';

const styles = `
  .soal-page {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Soal = () => {
  return (
    <>
      <style>{styles}</style>
      <SidebarDosen />
      <div style={{ marginLeft: '250px', minHeight: '100vh', background: '#f3f4f6' }}>
        <Navbar />
        {/* Padding atas ditambahkan agar tidak tertutup navbar */}
        <div style={{ padding: '80px 2rem 2rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
          <div className="soal-page">
            <div className="title"><HelpCircle size={22} /> Manajemen Soal</div>
            <p>Halaman untuk CRUD soal kuis akan dikembangkan di sini.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Soal;