import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import Navbar from '../komponen/Navbar';
import SidebarDosen from './SidebarDosen';
import { Users, BookOpen, FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const styles = `
  .mahasiswa-container {
    margin-left: 250px;
    min-height: 100vh;
    background: #f3f4f6;
  }
  .mahasiswa-inner {
    padding: 80px 2rem 2rem 2rem;
    max-width: 1280px;
    margin: 0 auto;
  }
  .card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .kelas-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .kelas-btn {
    background: white;
    border: 1px solid #d1d5db;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  .kelas-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    text-align: left;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    font-weight: 600;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
  }
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
  }
  .progres-bar-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .progres-bar-bg {
    flex: 1;
    background: #e5e7eb;
    border-radius: 999px;
    height: 8px;
    min-width: 80px;
  }
  .progres-bar-fill {
    height: 8px;
    border-radius: 999px;
    background: #3b82f6;
    transition: width 0.4s ease;
  }
  .progres-label {
    font-size: 0.85rem;
    color: #6b7280;
    white-space: nowrap;
  }
  .empty {
    color: #6b7280;
    margin-top: 1rem;
  }
  .loading-text {
    display: flex;
    justify-content: center;
    padding: 2rem;
    color: #6b7280;
  }
  .export-buttons {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  .btn-export {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;
    color: white;
  }
  .btn-export-excel {
    background: #22c55e;
  }
  .btn-export-excel:hover {
    background: #16a34a;
  }
  .btn-export-pdf {
    background: #ef4444;
  }
  .btn-export-pdf:hover {
    background: #dc2626;
  }
  .btn-export:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Asumsi total progres maksimal = 14
const MAX_PROGRES = 14;

const DaftarMahasiswa = () => {
  const [daftarKelas, setDaftarKelas] = useState([]);
  const [kelasAktif, setKelasAktif] = useState(null);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  // 1. Ambil semua kelas yang diampu dosen
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchKelasDosen = async () => {
      try {
        const q = query(collection(db, 'kelas'), where('dosen_ids', 'array-contains', userId));
        const snapshot = await getDocs(q);
        const kelasList = [];
        snapshot.forEach(doc => kelasList.push({ id: doc.id, ...doc.data() }));
        setDaftarKelas(kelasList);

        const savedKelasId = localStorage.getItem('activeKelasId');
        const kelasFromStorage = savedKelasId ? kelasList.find(k => k.id === savedKelasId) : null;
        const active = kelasFromStorage || (kelasList.length > 0 ? kelasList[0] : null);
        setKelasAktif(active);
        if (active) {
          localStorage.setItem('activeKelasId', active.id);
          localStorage.setItem('activeKelasToken', active.token);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchKelasDosen();
  }, [userId]);

  // 2. Saat kelasAktif berubah, subscribe ke mahasiswa
  useEffect(() => {
    if (kelasAktif) {
      localStorage.setItem('activeKelasId', kelasAktif.id);
      localStorage.setItem('activeKelasToken', kelasAktif.token);
      const token = kelasAktif.token;

      const q = query(collection(db, 'mahasiswa'), where('Token_mahasiswa', '==', token));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const siswa = [];
        snapshot.forEach((docSnap) => {
          siswa.push({ id: docSnap.id, ...docSnap.data() });
        });
        setMahasiswaList(siswa);
      }, (error) => {
        console.error(error);
      });

      return () => unsubscribe();
    } else {
      setMahasiswaList([]);
    }
  }, [kelasAktif]);

  // --- Ekspor ke Excel ---
  const exportToExcel = () => {
    if (!kelasAktif || mahasiswaList.length === 0) return;

    const data = mahasiswaList.map((mhs, index) => ({
      No: index + 1,
      NIM: mhs.NIM || '-',
      Nama: mhs.Nama || '-',
      Email: mhs.Email || '-',
      'Progres Belajar': `${mhs.progres_belajar ?? 0} / ${MAX_PROGRES}`,
      'Persentase': `${Math.min(Math.round(((mhs.progres_belajar ?? 0) / MAX_PROGRES) * 100), 100)}%`,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Mahasiswa');
    
    // Nama file
    const fileName = `Daftar_Mahasiswa_${kelasAktif.nama_kelas}_${kelasAktif.tahun_ajaran}_${kelasAktif.semester}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // --- Ekspor ke PDF ---
  const exportToPDF = () => {
    if (!kelasAktif || mahasiswaList.length === 0) return;

    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Judul
    doc.setFontSize(16);
    doc.text(`Daftar Mahasiswa - ${kelasAktif.nama_kelas}`, pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`${kelasAktif.tahun_ajaran} ${kelasAktif.semester}`, pageWidth / 2, 28, { align: 'center' });
    doc.text(`Total Mahasiswa: ${mahasiswaList.length}`, pageWidth / 2, 35, { align: 'center' });

    // Data tabel
    const tableData = mahasiswaList.map((mhs, index) => [
      index + 1,
      mhs.NIM || '-',
      mhs.Nama || '-',
      mhs.Email || '-',
      `${mhs.progres_belajar ?? 0} / ${MAX_PROGRES}`,
      `${Math.min(Math.round(((mhs.progres_belajar ?? 0) / MAX_PROGRES) * 100), 100)}%`,
    ]);

    doc.autoTable({
      startY: 42,
      head: [['No', 'NIM', 'Nama', 'Email', 'Progres Belajar', 'Persentase']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 35 },
        2: { cellWidth: 50 },
        3: { cellWidth: 60 },
        4: { cellWidth: 35 },
        5: { cellWidth: 30 },
      },
      margin: { left: 10, right: 10 },
    });

    const fileName = `Daftar_Mahasiswa_${kelasAktif.nama_kelas}_${kelasAktif.tahun_ajaran}_${kelasAktif.semester}.pdf`;
    doc.save(fileName);
  };

  if (!userId) {
    return (
      <>
        <style>{styles}</style>
        <SidebarDosen />
        <div className="mahasiswa-container">
          <Navbar />
          <div className="mahasiswa-inner">
            <div className="card">
              <div className="title"><Users size={22} /> Daftar Mahasiswa</div>
              <p className="empty">Silakan login terlebih dahulu.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <SidebarDosen />
        <div className="mahasiswa-container">
          <Navbar />
          <div className="loading-text" style={{ paddingTop: '80px' }}>Memuat data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <SidebarDosen />
      <div className="mahasiswa-container">
        <Navbar />
        <div className="mahasiswa-inner">

          {/* Header & Pilih Kelas */}
          <div className="card">
            <div className="title"><Users size={22} /> Daftar Mahasiswa</div>
            {daftarKelas.length === 0 ? (
              <p className="empty">Anda belum memiliki kelas. Silakan buat kelas di Dashboard.</p>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <BookOpen size={18} />
                  <span style={{ fontWeight: 500 }}>Pilih Kelas:</span>
                </div>
                <div className="kelas-selector">
                  {daftarKelas.map(kelas => (
                    <button
                      key={kelas.id}
                      className={`kelas-btn ${kelasAktif?.id === kelas.id ? 'active' : ''}`}
                      onClick={() => setKelasAktif(kelas)}
                    >
                      {kelas.nama_kelas} ({kelas.tahun_ajaran} {kelas.semester})
                    </button>
                  ))}
                </div>
                {kelasAktif && (
                  <p className="empty" style={{ marginTop: '0.75rem' }}>
                    Kelas aktif: {kelasAktif.nama_kelas} ({kelasAktif.tahun_ajaran} {kelasAktif.semester})
                  </p>
                )}
              </>
            )}
          </div>

          {/* Tabel Mahasiswa */}
          {kelasAktif && (
            <div className="card">
              <div className="title" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={22} /> Daftar Mahasiswa ({mahasiswaList.length})
                </span>
                <div className="export-buttons" style={{ marginBottom: 0 }}>
                  <button
                    className="btn-export btn-export-excel"
                    onClick={exportToExcel}
                    disabled={mahasiswaList.length === 0}
                  >
                    <FileSpreadsheet size={18} /> Excel
                  </button>
                  <button
                    className="btn-export btn-export-pdf"
                    onClick={exportToPDF}
                    disabled={mahasiswaList.length === 0}
                  >
                    <FileText size={18} /> PDF
                  </button>
                </div>
              </div>
              {mahasiswaList.length === 0 ? (
                <p className="empty">Belum ada mahasiswa yang mendaftar dengan token kelas ini.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Progres Belajar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mahasiswaList.map((mhs, index) => {
                        const progres = mhs.progres_belajar ?? 0;
                        const persen = Math.min(Math.round((progres / MAX_PROGRES) * 100), 100);
                        return (
                          <tr key={mhs.id}>
                            <td>{index + 1}</td>
                            <td>{mhs.NIM}</td>
                            <td>{mhs.Nama}</td>
                            <td>{mhs.Email}</td>
                            <td>
                              <div className="progres-bar-wrapper">
                                <div className="progres-bar-bg">
                                  <div
                                    className="progres-bar-fill"
                                    style={{ width: `${persen}%` }}
                                  />
                                </div>
                                <span className="progres-label">{progres} / {MAX_PROGRES}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default DaftarMahasiswa;