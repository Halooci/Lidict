import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import Navbar from '../komponen/Navbar';
import SidebarDosen from './SidebarDosen';
import {
  HelpCircle,
  PlusCircle,
  Save,
  Edit,
  Trash2,
  X,
  BookOpen,
} from 'lucide-react';

// ==================== STYLES ====================
const styles = `
  .soal-container {
    margin-left: 250px;
    min-height: 100vh;
    background: #f3f4f6;
  }
  .soal-inner {
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
  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }
  .btn-blue { background: #3b82f6; color: white; }
  .btn-blue:hover { background: #2563eb; }
  .btn-green { background: #10b981; color: white; }
  .btn-green:hover { background: #059669; }
  .btn-red { background: #ef4444; color: white; }
  .btn-red:hover { background: #dc2626; }
  .btn-outline {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
  }
  .btn-outline:hover { background: #f3f4f6; }

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

  .kuis-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  .kuis-btn {
    background: white;
    border: 1px solid #d1d5db;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .kuis-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .soal-table {
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
    vertical-align: top;
  }

  .form-group {
    margin-bottom: 1rem;
  }
  .form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: #374151;
  }
  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
  }

  .modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    max-width: 600px;
    width: 90%;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
  }
  .modal-close {
    position: absolute;
    top: 1rem; right: 1rem;
    cursor: pointer;
    color: #6b7280;
  }
  .empty-text {
    color: #6b7280;
    margin-top: 0.5rem;
  }
`;

// ==================== COMPONENT ====================
const Soal = () => {
  // Daftar kelas dosen
  const [daftarKelas, setDaftarKelas] = useState([]);
  const [kelasAktif, setKelasAktif] = useState(null);
  const [kuisList, setKuisList] = useState([]);
  const [kuisAktif, setKuisAktif] = useState(null);
  const [soalList, setSoalList] = useState([]);

  // Modal soal
  const [showModal, setShowModal] = useState(false);
  const [editingSoal, setEditingSoal] = useState(null);
  const [formSoal, setFormSoal] = useState({
    pertanyaan: '',
    pilihan: ['', '', '', ''],
    jawaban_benar: 0,
    bobot: 10,
    pembahasan: '',
  });

  // Modal kuis baru
  const [showCreateKuis, setShowCreateKuis] = useState(false);
  const [newKuis, setNewKuis] = useState({ judul: '', tipe: 'list', deskripsi: '' });

  const userId = localStorage.getItem('userId'); // NIP dosen

  // Ambil daftar kelas yang diampu dosen
  useEffect(() => {
    if (!userId) return;
    const fetchKelasDosen = async () => {
      try {
        const q = query(collection(db, 'kelas'), where('dosen_ids', 'array-contains', userId));
        const snapshot = await getDocs(q);
        const list = [];
        snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        setDaftarKelas(list);

        // Coba ambil kelas terakhir dari localStorage (jika ada)
        const savedKelasId = localStorage.getItem('activeKelasId');
        if (savedKelasId && list.find(k => k.id === savedKelasId)) {
          setKelasAktif(list.find(k => k.id === savedKelasId));
        } else if (list.length > 0) {
          setKelasAktif(list[0]);
          localStorage.setItem('activeKelasId', list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchKelasDosen();
  }, [userId]);

  // Saat kelas aktif berubah, ambil kuis milik kelas itu
  useEffect(() => {
    if (!kelasAktif) {
      setKuisList([]);
      setKuisAktif(null);
      return;
    }
    // Simpan ke localStorage sebagai default pilihan
    localStorage.setItem('activeKelasId', kelasAktif.id);

    const fetchKuis = async () => {
      const q = query(collection(db, 'kuis'), where('kelas_id', '==', kelasAktif.id));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setKuisList(list);
      if (list.length > 0) {
        setKuisAktif(list[0]);
      } else {
        setKuisAktif(null);
      }
    };
    fetchKuis();
  }, [kelasAktif]);

  // Ambil soal berdasarkan kuis aktif
  useEffect(() => {
    if (!kuisAktif) {
      setSoalList([]);
      return;
    }
    const fetchSoal = async () => {
      const q = query(collection(db, 'soal_kuis'), where('kuis_id', '==', kuisAktif.id));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => a.nomor - b.nomor);
      setSoalList(list);
    };
    fetchSoal();
  }, [kuisAktif]);

  // === Buka modal tambah soal ===
  const openAddSoal = () => {
    setEditingSoal(null);
    setFormSoal({
      pertanyaan: '',
      pilihan: ['', '', '', ''],
      jawaban_benar: 0,
      bobot: 10,
      pembahasan: '',
    });
    setShowModal(true);
  };

  // === Buka modal edit soal ===
  const openEditSoal = (soal) => {
    setEditingSoal(soal);
    setFormSoal({
      pertanyaan: soal.pertanyaan,
      pilihan: soal.pilihan || ['', '', '', ''],
      jawaban_benar: soal.jawaban_benar,
      bobot: soal.bobot || 10,
      pembahasan: soal.pembahasan || '',
    });
    setShowModal(true);
  };

  // === Simpan soal ===
  const handleSaveSoal = async (e) => {
    e.preventDefault();
    if (!formSoal.pertanyaan.trim()) return alert('Pertanyaan wajib diisi.');
    if (!kuisAktif) return;

    const dataSoal = {
      kuis_id: kuisAktif.id,
      pertanyaan: formSoal.pertanyaan,
      pilihan: formSoal.pilihan,
      jawaban_benar: formSoal.jawaban_benar,
      bobot: formSoal.bobot,
      pembahasan: formSoal.pembahasan,
    };

    try {
      if (editingSoal) {
        await updateDoc(doc(db, 'soal_kuis', editingSoal.id), dataSoal);
      } else {
        dataSoal.nomor = soalList.length + 1;
        await addDoc(collection(db, 'soal_kuis'), dataSoal);
      }
      // Refresh soal
      const q = query(collection(db, 'soal_kuis'), where('kuis_id', '==', kuisAktif.id));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => a.nomor - b.nomor);
      setSoalList(list);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan soal.');
    }
  };

  // === Hapus soal ===
  const handleDeleteSoal = async (soalId) => {
    if (!window.confirm('Hapus soal ini?')) return;
    try {
      await deleteDoc(doc(db, 'soal_kuis', soalId));
      setSoalList(prev => prev.filter(s => s.id !== soalId));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus soal.');
    }
  };

  // === Buat kuis baru ===
  const handleCreateKuis = async (e) => {
    e.preventDefault();
    if (!newKuis.judul.trim()) return alert('Judul kuis wajib diisi.');
    try {
      // Gunakan ID unik dengan prefix kelas_id dan tipe (atau random)
      const docRef = await addDoc(collection(db, 'kuis'), {
        kelas_id: kelasAktif.id,
        judul: newKuis.judul,
        tipe: newKuis.tipe,
        deskripsi: newKuis.deskripsi,
      });
      const kuisBaru = { id: docRef.id, ...newKuis, kelas_id: kelasAktif.id };
      setKuisList(prev => [...prev, kuisBaru]);
      setKuisAktif(kuisBaru);
      setShowCreateKuis(false);
      setNewKuis({ judul: '', tipe: 'list', deskripsi: '' });
    } catch (err) {
      console.error(err);
      alert('Gagal membuat kuis.');
    }
  };

  // Jika tidak ada userId
  if (!userId) {
    return (
      <>
        <style>{styles}</style>
        <SidebarDosen />
        <div className="soal-container">
          <Navbar />
          <div className="soal-inner">
            <div className="card">
              <div className="card-title"><HelpCircle size={22} /> Manajemen Soal</div>
              <p className="empty-text">Silakan login terlebih dahulu.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <SidebarDosen />
      <div className="soal-container">
        <Navbar />
        <div className="soal-inner">
          {/* Header: Manajemen Soal */}
          <div className="card">
            <div className="card-title"><HelpCircle size={22} /> Manajemen Soal</div>
            {daftarKelas.length === 0 ? (
              <p className="empty-text">Anda belum memiliki kelas. Silakan buat kelas di Dashboard.</p>
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
                  <p className="empty-text">
                    Aktif: {kelasAktif.nama_kelas} ({kelasAktif.tahun_ajaran} {kelasAktif.semester})
                  </p>
                )}
              </>
            )}
          </div>

          {/* Hanya tampilkan jika kelas aktif */}
          {kelasAktif && (
            <>
              {/* Pilih / buat kuis */}
              <div className="card">
                <div className="card-title">Pilih Kuis</div>
                <div className="kuis-selector">
                  {kuisList.map(kuis => (
                    <button
                      key={kuis.id}
                      className={`kuis-btn ${kuisAktif?.id === kuis.id ? 'active' : ''}`}
                      onClick={() => setKuisAktif(kuis)}
                    >
                      {kuis.judul}
                    </button>
                  ))}
                  <button className="btn btn-blue" onClick={() => setShowCreateKuis(true)}>
                    <PlusCircle size={18} /> Buat Kuis
                  </button>
                </div>
              </div>

              {/* Soal dalam kuis aktif */}
              {kuisAktif && (
                <div className="card">
                  <div className="card-title">
                    Soal: {kuisAktif.judul}
                    <button className="btn btn-green" style={{ marginLeft: 'auto' }} onClick={openAddSoal}>
                      <PlusCircle size={18} /> Tambah Soal
                    </button>
                  </div>
                  {soalList.length === 0 ? (
                    <p className="empty-text">Belum ada soal dalam kuis ini.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="soal-table">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Pertanyaan</th>
                            <th>Pilihan</th>
                            <th>Jawaban</th>
                            <th>Bobot</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {soalList.map((soal, idx) => (
                            <tr key={soal.id}>
                              <td>{soal.nomor || idx+1}</td>
                              <td>{soal.pertanyaan}</td>
                              <td>
                                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                  {soal.pilihan?.map((pil, i) => (
                                    <li key={i} style={{ fontWeight: i === soal.jawaban_benar ? 'bold' : 'normal' }}>
                                      {pil}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td>{soal.jawaban_benar}</td>
                              <td>{soal.bobot}</td>
                              <td style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-blue" onClick={() => openEditSoal(soal)}>
                                  <Edit size={16} />
                                </button>
                                <button className="btn btn-red" onClick={() => handleDeleteSoal(soal.id)}>
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Tambah/Edit Soal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></div>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
                {editingSoal ? 'Edit Soal' : 'Tambah Soal Baru'}
              </h2>
              <form onSubmit={handleSaveSoal}>
                <div className="form-group">
                  <label>Pertanyaan</label>
                  <textarea rows="3" value={formSoal.pertanyaan} onChange={e => setFormSoal({...formSoal, pertanyaan: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Pilihan (minimal 2)</label>
                  {formSoal.pilihan.map((pil, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Pilihan ${idx+1}`}
                      value={pil}
                      style={{ marginBottom: '0.5rem' }}
                      onChange={e => {
                        const newPil = [...formSoal.pilihan];
                        newPil[idx] = e.target.value;
                        setFormSoal({...formSoal, pilihan: newPil});
                      }}
                    />
                  ))}
                </div>
                <div className="form-group">
                  <label>Jawaban Benar (indeks 0-3)</label>
                  <input type="number" min="0" max="3" value={formSoal.jawaban_benar} onChange={e => setFormSoal({...formSoal, jawaban_benar: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label>Bobot</label>
                  <input type="number" min="0" value={formSoal.bobot} onChange={e => setFormSoal({...formSoal, bobot: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label>Pembahasan (opsional)</label>
                  <textarea rows="2" value={formSoal.pembahasan} onChange={e => setFormSoal({...formSoal, pembahasan: e.target.value})} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-blue">
                    <Save size={18} /> Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Buat Kuis Baru */}
        {showCreateKuis && (
          <div className="modal-overlay" onClick={() => setShowCreateKuis(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close" onClick={() => setShowCreateKuis(false)}><X size={24} /></div>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Buat Kuis Baru</h2>
              <form onSubmit={handleCreateKuis}>
                <div className="form-group">
                  <label>Judul Kuis</label>
                  <input type="text" placeholder="Misal: Kuis List" value={newKuis.judul} onChange={e => setNewKuis({...newKuis, judul: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Tipe Kuis</label>
                  <select value={newKuis.tipe} onChange={e => setNewKuis({...newKuis, tipe: e.target.value})}>
                    <option value="list">List</option>
                    <option value="dictionary">Dictionary</option>
                    <option value="nested_list">Nested List</option>
                    <option value="evaluasi">Evaluasi</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deskripsi (opsional)</label>
                  <textarea rows="2" value={newKuis.deskripsi} onChange={e => setNewKuis({...newKuis, deskripsi: e.target.value})} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCreateKuis(false)}>Batal</button>
                  <button type="submit" className="btn btn-blue">Buat Kuis</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Soal;