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
  .btn-gray { background: #9ca3af; color: white; }
  .btn-gray:hover { background: #6b7280; }

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
  .form-group .pilihan-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .form-group .pilihan-item input {
    flex: 1;
  }
  .form-group .pilihan-item .btn-remove-pil {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
  }
  .form-group .pilihan-item .btn-remove-pil:hover {
    background: #dc2626;
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
  .essay-badge {
    background: #f59e0b;
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
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
    isEssay: false,
    jawaban_teks: '', // untuk esai
  });

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
      isEssay: false,
      jawaban_teks: '',
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
      isEssay: soal.isEssay || false,
      jawaban_teks: soal.isEssay ? soal.jawaban_benar : '',
    });
    setShowModal(true);
  };

  // === Simpan soal ===
  const handleSaveSoal = async (e) => {
    e.preventDefault();
    if (!formSoal.pertanyaan.trim()) return alert('Pertanyaan wajib diisi.');
    if (!kuisAktif) return;

    // Validasi: jika esai, jawaban_teks harus diisi
    if (formSoal.isEssay && !formSoal.jawaban_teks.trim()) {
      return alert('Jawaban untuk soal esai harus diisi.');
    }

    // Jika bukan esai, pastikan minimal ada 2 pilihan
    if (!formSoal.isEssay) {
      const pilTerisi = formSoal.pilihan.filter(p => p.trim() !== '');
      if (pilTerisi.length < 2) {
        return alert('Minimal 2 pilihan harus diisi untuk soal pilihan ganda.');
      }
      if (formSoal.jawaban_benar < 0 || formSoal.jawaban_benar >= formSoal.pilihan.length) {
        return alert('Indeks jawaban benar tidak valid.');
      }
    }

    const dataSoal = {
      kuis_id: kuisAktif.id,
      pertanyaan: formSoal.pertanyaan,
      pilihan: formSoal.isEssay ? [] : formSoal.pilihan,
      jawaban_benar: formSoal.isEssay ? formSoal.jawaban_teks : formSoal.jawaban_benar,
      bobot: formSoal.bobot,
      pembahasan: formSoal.pembahasan,
      isEssay: formSoal.isEssay,
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

  // === Tambah pilihan baru ===
  const addPilihan = () => {
    if (formSoal.pilihan.length < 6) {
      setFormSoal({...formSoal, pilihan: [...formSoal.pilihan, '']});
    }
  };

  // === Hapus pilihan ===
  const removePilihan = (idx) => {
    if (formSoal.pilihan.length <= 2) return;
    const newPil = formSoal.pilihan.filter((_, i) => i !== idx);
    setFormSoal({...formSoal, pilihan: newPil});
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
              {/* Pilih kuis */}
              <div className="card">
                <div className="card-title">Pilih Kuis</div>
                {kuisList.length === 0 ? (
                  <p className="empty-text">Belum ada kuis di kelas ini.</p>
                ) : (
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
                  </div>
                )}
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
                            <th>Pilihan / Tipe</th>
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
                                {soal.isEssay ? (
                                  <span className="essay-badge">Esai (Tulis Kode)</span>
                                ) : (
                                  <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                    {soal.pilihan?.map((pil, i) => (
                                      <li key={i} style={{ fontWeight: i === soal.jawaban_benar ? 'bold' : 'normal' }}>
                                        {pil}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </td>
                              <td>
                                {soal.isEssay ? (
                                  <code style={{ background: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.85rem' }}>
                                    {soal.jawaban_benar}
                                  </code>
                                ) : (
                                  soal.jawaban_benar
                                )}
                              </td>
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
                  <label>Tipe Soal</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        checked={!formSoal.isEssay}
                        onChange={() => setFormSoal({...formSoal, isEssay: false})}
                      />
                      Pilihan Ganda
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        checked={formSoal.isEssay}
                        onChange={() => setFormSoal({...formSoal, isEssay: true})}
                      />
                      Esai (Tulis Kode)
                    </label>
                  </div>
                </div>

                {!formSoal.isEssay ? (
                  <>
                    <div className="form-group">
                      <label>Pilihan Jawaban (minimal 2)</label>
                      {formSoal.pilihan.map((pil, idx) => (
                        <div key={idx} className="pilihan-item">
                          <input
                            type="text"
                            placeholder={`Pilihan ${idx+1}`}
                            value={pil}
                            onChange={e => {
                              const newPil = [...formSoal.pilihan];
                              newPil[idx] = e.target.value;
                              setFormSoal({...formSoal, pilihan: newPil});
                            }}
                          />
                          <button
                            type="button"
                            className="btn-remove-pil"
                            onClick={() => removePilihan(idx)}
                            disabled={formSoal.pilihan.length <= 2}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button type="button" className="btn btn-outline" onClick={addPilihan} style={{ marginTop: '0.5rem' }}>
                        Tambah Pilihan
                      </button>
                    </div>
                    <div className="form-group">
                      <label>Jawaban Benar (indeks pilihan)</label>
                      <input
                        type="number"
                        min="0"
                        max={formSoal.pilihan.length - 1}
                        value={formSoal.jawaban_benar}
                        onChange={e => setFormSoal({...formSoal, jawaban_benar: parseInt(e.target.value) || 0})}
                      />
                      <small style={{ color: '#6b7280' }}>Indeks dimulai dari 0</small>
                    </div>
                  </>
                ) : (
                  <div className="form-group">
                    <label>Jawaban Benar (kode yang diharapkan)</label>
                    <textarea
                      rows="2"
                      placeholder="Contoh: buah = ['apel', 'anggur', 'jeruk']"
                      value={formSoal.jawaban_teks}
                      onChange={e => setFormSoal({...formSoal, jawaban_teks: e.target.value})}
                      required
                    />
                    <small style={{ color: '#6b7280' }}>Mahasiswa akan mengetik kode, sistem akan mencocokkan dengan jawaban ini.</small>
                  </div>
                )}

                <div className="form-group">
                  <label>Bobot</label>
                  <input
                    type="number"
                    min="0"
                    value={formSoal.bobot}
                    onChange={e => setFormSoal({...formSoal, bobot: parseInt(e.target.value) || 0})}
                  />
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
      </div>
    </>
  );
};

export default Soal;