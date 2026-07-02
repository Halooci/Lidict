import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import Navbar from '../komponen/Navbar';
import SidebarDosen from './SidebarDosen';
import { Users, BookOpen, Eye, Code, CheckCircle, XCircle } from 'lucide-react';

const styles = `
  .praktikum-container {
    margin-left: 250px;
    min-height: 100vh;
    background: #f3f4f6;
  }
  .praktikum-inner {
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
    white-space: nowrap;
  }
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
    text-align: left;
    vertical-align: middle;
  }
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .status-badge.selesai {
    background: #d1fae5;
    color: #065f46;
  }
  .status-badge.belum {
    background: #fee2e2;
    color: #991b1b;
  }
  .btn-lihat {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.4rem 0.9rem;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: background 0.2s;
  }
  .btn-lihat:hover {
    background: #2563eb;
  }
  .btn-lihat:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
  }
  .modal-box {
    background: white;
    border-radius: 1rem;
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: fadeInUp 0.3s ease;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
  }
  .modal-header h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1f2937;
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0 0.5rem;
  }
  .modal-close:hover {
    color: #1f2937;
  }
  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }
  .jawaban-item {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 1rem;
  }
  .jawaban-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  .jawaban-item h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  .jawaban-item pre {
    background: #1e1e1e;
    color: #f8f8f2;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow: auto;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Consolas', 'Monaco', monospace;
    max-height: 300px;
  }
  .jawaban-item .kosong {
    color: #9ca3af;
    font-style: italic;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Komponen Modal
const JawabanModal = ({ mahasiswa, onClose }) => {
  if (!mahasiswa) return null;

  // Daftar topik praktikum dengan field dan label
  const topikList = [
    { field: 'pembuatan_akses_element', label: 'Pembuatan & Akses Elemen List' },
    { field: 'operasi_manipulasi_list', label: 'Operasi & Manipulasi List' },
    { field: 'pembuatan_akses_nested_list', label: 'Pembuatan & Akses Nested List' },
    { field: 'operasi_nested_list', label: 'Operasi & Manipulasi Nested List' },
    { field: 'pembuatan_akses_dict', label: 'Pembuatan & Akses Dictionary' },
    { field: 'manipulasi_dict', label: 'Manipulasi Dictionary' },
  ];

  const dataPraktikum = mahasiswa.praktikum || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Code size={18} style={{ display: 'inline', marginRight: '8px' }} />
            Jawaban Praktikum - {mahasiswa.Nama} ({mahasiswa.NIM})
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {topikList.map((topik) => {
            const jawaban = dataPraktikum[topik.field];
            const ada = jawaban && jawaban.trim().length > 0;
            return (
              <div className="jawaban-item" key={topik.field}>
                <h4>{topik.label}</h4>
                {ada ? (
                  <pre>{jawaban}</pre>
                ) : (
                  <div className="kosong">Belum dikerjakan</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PraktikumMahasiswa = () => {
  const [daftarKelas, setDaftarKelas] = useState([]);
  const [kelasAktif, setKelasAktif] = useState(null);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [praktikumData, setPraktikumData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  const userId = localStorage.getItem('userId');

  // 1. Ambil kelas yang diampu dosen
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

  // 2. Ambil mahasiswa berdasarkan token kelas
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

  // 3. Ambil data praktikum untuk semua mahasiswa di kelas
  useEffect(() => {
    const fetchPraktikum = async () => {
      if (mahasiswaList.length === 0) {
        setPraktikumData({});
        return;
      }

      try {
        // Ambil semua dokumen dari koleksi "Praktikum"
        const praktikumSnapshot = await getDocs(collection(db, 'Praktikum'));
        const dataMap = {};
        praktikumSnapshot.forEach(docSnap => {
          const userId = docSnap.id; // userId sama dengan NIM atau id mahasiswa
          dataMap[userId] = docSnap.data();
        });

        // Filter hanya untuk mahasiswa yang ada di kelas
        const filtered = {};
        mahasiswaList.forEach(mhs => {
          const nim = mhs.NIM;
          if (nim && dataMap[nim]) {
            filtered[nim] = dataMap[nim];
          }
        });
        setPraktikumData(filtered);
      } catch (error) {
        console.error('Gagal mengambil data praktikum:', error);
        setPraktikumData({});
      }
    };

    fetchPraktikum();
  }, [mahasiswaList]);

  const handleLihatJawaban = (mhs) => {
    // Gabungkan data mahasiswa dengan praktikumnya
    const praktikum = praktikumData[mhs.NIM] || {};
    setSelectedMahasiswa({ ...mhs, praktikum });
  };

  const closeModal = () => setSelectedMahasiswa(null);

  if (!userId) {
    return (
      <>
        <style>{styles}</style>
        <SidebarDosen />
        <div className="praktikum-container">
          <Navbar />
          <div className="praktikum-inner">
            <div className="card">
              <div className="title"><Users size={22} /> Jawaban Praktikum Mahasiswa</div>
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
        <div className="praktikum-container">
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
      <div className="praktikum-container">
        <Navbar />
        <div className="praktikum-inner">

          {/* Header & Pilih Kelas */}
          <div className="card">
            <div className="title"><Users size={22} /> Jawaban Praktikum Mahasiswa</div>
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
                        <th>Status Pengerjaan</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mahasiswaList.map((mhs, index) => {
                        const praktikum = praktikumData[mhs.NIM] || {};
                        const totalTopik = 6; // jumlah topik praktikum
                        const sudahDikerjakan = Object.values(praktikum).filter(v => v && v.trim().length > 0).length;
                        const status = sudahDikerjakan === totalTopik ? 'Selesai' : `${sudahDikerjakan}/${totalTopik}`;
                        const isComplete = sudahDikerjakan === totalTopik;
                        return (
                          <tr key={mhs.id}>
                            <td>{index + 1}</td>
                            <td>{mhs.NIM}</td>
                            <td>{mhs.Nama}</td>
                            <td>
                              <span className={`status-badge ${isComplete ? 'selesai' : 'belum'}`}>
                                {isComplete ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                {status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn-lihat"
                                onClick={() => handleLihatJawaban(mhs)}
                                disabled={sudahDikerjakan === 0}
                              >
                                <Eye size={16} /> Lihat Jawaban
                              </button>
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

      {/* Modal */}
      {selectedMahasiswa && (
        <JawabanModal mahasiswa={selectedMahasiswa} onClose={closeModal} />
      )}
    </>
  );
};

export default PraktikumMahasiswa;