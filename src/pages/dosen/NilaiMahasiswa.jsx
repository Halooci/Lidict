import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import Navbar from '../komponen/Navbar';
import SidebarDosen from './SidebarDosen';
import { Users, BookOpen, FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    text-align: left;
  }
  .nilai-badge {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
    background: #eff6ff;
    color: #2563eb;
    min-width: 36px;
    text-align: center;
  }
  .nilai-badge.kosong {
    background: #f3f4f6;
    color: #9ca3af;
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

const NilaiCell = ({ nim, jenis }) => {
  const [nilai, setNilai] = useState(null);

  useEffect(() => {
    const fetchNilai = async () => {
      if (!nim) return;
      const snap = await getDoc(doc(db, 'nilai', nim));
      if (snap.exists()) {
        const data = snap.data();
        setNilai(data[jenis] ?? '-');
      } else {
        setNilai('-');
      }
    };
    fetchNilai();
  }, [nim, jenis]);

  const isEmpty = nilai === '-' || nilai === null;

  return (
    <td>
      {nilai === null ? (
        <span className="nilai-badge kosong">...</span>
      ) : (
        <span className={`nilai-badge${isEmpty ? ' kosong' : ''}`}>{nilai}</span>
      )}
    </td>
  );
};

const NilaiMahasiswa = () => {
  const [daftarKelas, setDaftarKelas] = useState([]);
  const [kelasAktif, setKelasAktif] = useState(null);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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
        snapshot.forEach(d => kelasList.push({ id: d.id, ...d.data() }));
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

  // --- Fungsi bantu: ambil semua data nilai untuk NIM tertentu ---
  const fetchAllNilai = async (nimList) => {
    if (nimList.length === 0) return {};
    try {
      const nilaiSnapshot = await getDocs(collection(db, 'nilai'));
      const nilaiMap = {};
      nilaiSnapshot.forEach(docSnap => {
        const nim = docSnap.id;
        if (nimList.includes(nim)) {
          nilaiMap[nim] = docSnap.data();
        }
      });
      return nilaiMap;
    } catch (error) {
      console.error('Gagal mengambil data nilai:', error);
      return {};
    }
  };

  // --- Ekspor ke Excel ---
  const exportToExcel = async () => {
    if (!kelasAktif || mahasiswaList.length === 0) return;
    setExporting(true);
    try {
      const nimList = mahasiswaList.map(m => m.NIM).filter(Boolean);
      const nilaiMap = await fetchAllNilai(nimList);

      const data = mahasiswaList.map((mhs, index) => {
        const nilai = nilaiMap[mhs.NIM] || {};
        return {
          No: index + 1,
          NIM: mhs.NIM || '-',
          Nama: mhs.Nama || '-',
          'Kuis List': nilai['Kuis List'] ?? '-',
          'Kuis Nested List': nilai['Kuis Nested List'] ?? '-',
          'Kuis Dictionary': nilai['Kuis Dictionary'] ?? '-',
          Evaluasi: nilai['Evaluasi'] ?? '-',
        };
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Nilai');
      const fileName = `Nilai_${kelasAktif.nama_kelas}_${kelasAktif.tahun_ajaran}_${kelasAktif.semester}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Gagal export Excel:', error);
      alert('Terjadi kesalahan saat export Excel.');
    } finally {
      setExporting(false);
    }
  };

  // --- Ekspor ke PDF ---
  const exportToPDF = async () => {
    if (!kelasAktif || mahasiswaList.length === 0) return;
    setExporting(true);
    try {
      const nimList = mahasiswaList.map(m => m.NIM).filter(Boolean);
      const nilaiMap = await fetchAllNilai(nimList);

      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(16);
      doc.text(`Daftar Nilai - ${kelasAktif.nama_kelas}`, pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(11);
      doc.text(`${kelasAktif.tahun_ajaran} ${kelasAktif.semester}`, pageWidth / 2, 28, { align: 'center' });
      doc.text(`Total Mahasiswa: ${mahasiswaList.length}`, pageWidth / 2, 35, { align: 'center' });

      const tableData = mahasiswaList.map((mhs, index) => {
        const nilai = nilaiMap[mhs.NIM] || {};
        return [
          index + 1,
          mhs.NIM || '-',
          mhs.Nama || '-',
          nilai['Kuis List'] ?? '-',
          nilai['Kuis Nested List'] ?? '-',
          nilai['Kuis Dictionary'] ?? '-',
          nilai['Evaluasi'] ?? '-',
        ];
      });

      autoTable(doc, {
        startY: 42,
        head: [['No', 'NIM', 'Nama', 'Kuis List', 'Kuis Nested List', 'Kuis Dictionary', 'Evaluasi']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 30 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { cellWidth: 35 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30 },
        },
        margin: { left: 10, right: 10 },
      });

      const fileName = `Nilai_${kelasAktif.nama_kelas}_${kelasAktif.tahun_ajaran}_${kelasAktif.semester}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Gagal export PDF:', error);
      alert('Terjadi kesalahan saat export PDF.');
    } finally {
      setExporting(false);
    }
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
              <div className="title"><Users size={22} /> Daftar Nilai Mahasiswa</div>
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
            <div className="title"><Users size={22} /> Daftar Nilai Mahasiswa</div>
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

          {/* Tabel Nilai */}
          {kelasAktif && (
            <div className="card">
              <div className="title" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={22} /> Nilai Mahasiswa ({mahasiswaList.length})
                </span>
                <div className="export-buttons">
                  <button
                    className="btn-export btn-export-excel"
                    onClick={exportToExcel}
                    disabled={mahasiswaList.length === 0 || exporting}
                  >
                    <FileSpreadsheet size={18} /> {exporting ? 'Loading...' : 'Excel'}
                  </button>
                  <button
                    className="btn-export btn-export-pdf"
                    onClick={exportToPDF}
                    disabled={mahasiswaList.length === 0 || exporting}
                  >
                    <FileText size={18} /> {exporting ? 'Loading...' : 'PDF'}
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
                        <th>Kuis List</th>
                        <th>Kuis Nested List</th>
                        <th>Kuis Dictionary</th>
                        <th>Evaluasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mahasiswaList.map((mhs, index) => (
                        <tr key={mhs.id}>
                          <td>{index + 1}</td>
                          <td>{mhs.NIM}</td>
                          <td>{mhs.Nama}</td>
                          <NilaiCell nim={mhs.NIM} jenis="Kuis List" />
                          <NilaiCell nim={mhs.NIM} jenis="Kuis Nested List" />
                          <NilaiCell nim={mhs.NIM} jenis="Kuis Dictionary" />
                          <NilaiCell nim={mhs.NIM} jenis="Evaluasi" />
                        </tr>
                      ))}
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

export default NilaiMahasiswa;