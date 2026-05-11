import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from 'firebase/firestore';
import Navbar from '../komponen/Navbar';
import SidebarDosen from './SidebarDosen'; // <-- sidebar di-render di sini
import {
  Copy,
  CheckCircle,
  LogOut,
  Users,
  ClipboardList,
  Save,
  BookOpen,
  PlusCircle,
  X,
  UserPlus,
  Trash2,
} from 'lucide-react';

// ==================== STYLES (disesuaikan) ====================
const styles = `
  .dashboard-content {
    margin-left: 250px;
    min-height: 100vh;
    background: #f3f4f6;
  }
  .content-inner {
    padding: 2rem;
    padding-top: 80px; /* tambahan */
    max-width: 1280px;
    margin: 0 auto;
  }
  .card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 1.5rem;
    padding: 1.5rem;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .card-subtitle {
    color: #6b7280;
    margin-top: 0.25rem;
  }
  .token-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }
  .token-code {
    background: #f3f4f6;
    font-family: monospace;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    letter-spacing: 1px;
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
  .kkm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .kkm-item label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }
  .kkm-item input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  .logout-btn {
    background: #ef4444;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    border: none;
  }
  .logout-btn:hover { background: #dc2626; }
  .kelas-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
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
  /* Modal */
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
    max-width: 500px;
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
  .modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: #374151;
  }
  .form-group input, .form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  .dosen-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }
  .dosen-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #f3f4f6;
  }
  .loading-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-size: 1.25rem;
    color: #4b5563;
  }
`;

// ==================== HELPER COMPONENT (Nilai Cell) ====================
const NilaiCell = ({ nim, jenis }) => {
  const [nilai, setNilai] = useState(null);

  useEffect(() => {
    const fetchNilai = async () => {
      if (!nim) return;
      const nilaiRef = doc(db, 'nilai', nim);
      const nilaiSnap = await getDoc(nilaiRef);
      if (nilaiSnap.exists()) {
        const data = nilaiSnap.data();
        setNilai(data[jenis] ?? '-');
      } else {
        setNilai('-');
      }
    };
    fetchNilai();
  }, [nim, jenis]);

  return <td>{nilai !== null ? (nilai === null || nilai === undefined ? '-' : nilai) : '...'}</td>;
};

// ==================== FUNGSI GENERATE TOKEN ====================
const generateRandomToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// ==================== MAIN COMPONENT ====================
const DashboardDosen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dosenData, setDosenData] = useState(null);

  // Data kelas
  const [daftarKelas, setDaftarKelas] = useState([]);
  const [kelasAktif, setKelasAktif] = useState(null);

  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [kkmData, setKkmData] = useState({
    kkm_kuis_list: 75,
    kkm_kuis_nested_list: 75,
    kkm_kuis_dictionary: 75,
    kkm_evaluasi: 75,
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [updatingKKM, setUpdatingKKM] = useState(false);

  // State modal buat kelas
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKelas, setNewKelas] = useState({
    nama_kelas: '',
    tahun_ajaran: '',
    semester: 'Ganjil',
  });
  const [creating, setCreating] = useState(false);

  // State modal gabung kelas
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  const [joining, setJoining] = useState(false);

  // State kelola dosen di kelas aktif
  const [showManageDosen, setShowManageDosen] = useState(false);
  const [dosenInClass, setDosenInClass] = useState([]);
  const [newDosenNIP, setNewDosenNIP] = useState('');
  const [addingDosen, setAddingDosen] = useState(false);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId'); // NIP dosen
  const userEmail = localStorage.getItem('userEmail');

  // Cek login
  useEffect(() => {
    if (!userId || !userEmail) {
      navigate('/loginregister');
    }
  }, [userId, userEmail, navigate]);

  // === Ambil data dosen & semua kelas yang diampu ===
  useEffect(() => {
    if (!userId) return;
    const fetchDosenDanKelas = async () => {
      try {
        const dosenRef = doc(db, 'dosen', userId);
        const dosenSnap = await getDoc(dosenRef);
        if (!dosenSnap.exists()) {
          alert('Data dosen tidak ditemukan.');
          localStorage.clear();
          navigate('/loginregister');
          return;
        }
        setDosenData(dosenSnap.data());

        const kelasQuery = query(collection(db, 'kelas'), where('dosen_ids', 'array-contains', userId));
        const kelasSnapshot = await getDocs(kelasQuery);
        const kelasList = [];
        kelasSnapshot.forEach((docSnap) => {
          kelasList.push({ id: docSnap.id, ...docSnap.data() });
        });
        setDaftarKelas(kelasList);
        if (kelasList.length > 0) {
          setKelasAktif(kelasList[0]);
        } else {
          setKelasAktif(null);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert('Gagal memuat data.');
        setLoading(false);
      }
    };
    fetchDosenDanKelas();
  }, [userId, navigate]);

  // === Simpan token & id kelas aktif ke localStorage ===
  useEffect(() => {
    if (kelasAktif) {
      localStorage.setItem('activeKelasToken', kelasAktif.token);
      localStorage.setItem('activeKelasId', kelasAktif.id);
    } else {
      localStorage.removeItem('activeKelasToken');
      localStorage.removeItem('activeKelasId');
    }
  }, [kelasAktif]);

  // === Saat kelas aktif berubah, ambil KKM & daftar mahasiswa (untuk ringkasan di dashboard) ===
  useEffect(() => {
    if (!kelasAktif) {
      setMahasiswaList([]);
      return;
    }
    setKkmData({
      kkm_kuis_list: kelasAktif.kkm_kuis_list ?? 75,
      kkm_kuis_nested_list: kelasAktif.kkm_kuis_nested_list ?? 75,
      kkm_kuis_dictionary: kelasAktif.kkm_kuis_dictionary ?? 75,
      kkm_evaluasi: kelasAktif.kkm_evaluasi ?? 75,
    });

    const token = kelasAktif.token;
    const q = query(collection(db, 'mahasiswa'), where('Token_mahasiswa', '==', token));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const siswa = [];
      snapshot.forEach((docSnap) => {
        siswa.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMahasiswaList(siswa);
    });
    return () => unsubscribe();
  }, [kelasAktif]);

  // === Ambil data dosen yang ada di kelas aktif (untuk kelola dosen) ===
  useEffect(() => {
    if (!kelasAktif || !showManageDosen) return;
    const fetchDosenInClass = async () => {
      const dosenIds = kelasAktif.dosen_ids || [];
      const dosenDataArr = [];
      for (const nip of dosenIds) {
        const snap = await getDoc(doc(db, 'dosen', nip));
        if (snap.exists()) {
          dosenDataArr.push({ nip, nama: snap.data().Nama });
        } else {
          dosenDataArr.push({ nip, nama: '(Tidak ditemukan)' });
        }
      }
      setDosenInClass(dosenDataArr);
    };
    fetchDosenInClass();
  }, [kelasAktif, showManageDosen]);

  const handleKKMChange = (field, value) => {
    setKkmData(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const saveKKM = async () => {
    if (!kelasAktif) return;
    setUpdatingKKM(true);
    try {
      const kelasRef = doc(db, 'kelas', kelasAktif.id);
      await updateDoc(kelasRef, {
        kkm_kuis_list: kkmData.kkm_kuis_list,
        kkm_kuis_nested_list: kkmData.kkm_kuis_nested_list,
        kkm_kuis_dictionary: kkmData.kkm_kuis_dictionary,
        kkm_evaluasi: kkmData.kkm_evaluasi,
      });
      alert('KKM berhasil disimpan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan KKM.');
    } finally {
      setUpdatingKKM(false);
    }
  };

  const copyToken = () => {
    if (kelasAktif?.token) {
      navigator.clipboard.writeText(kelasAktif.token);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/loginregister');
  };

  // === BUAT KELAS BARU ===
  const openCreateModal = () => {
    setNewKelas({ nama_kelas: '', tahun_ajaran: '', semester: 'Ganjil' });
    setShowCreateModal(true);
  };

  const handleCreateKelas = async (e) => {
    e.preventDefault();
    if (!newKelas.nama_kelas.trim() || !newKelas.tahun_ajaran.trim()) {
      alert('Nama kelas dan tahun ajaran harus diisi.');
      return;
    }
    setCreating(true);
    try {
      const token = generateRandomToken();
      const kelasBaru = {
        dosen_ids: [userId],
        token: token,
        nama_kelas: newKelas.nama_kelas,
        tahun_ajaran: newKelas.tahun_ajaran,
        semester: newKelas.semester,
        kkm_kuis_list: 75,
        kkm_kuis_nested_list: 75,
        kkm_kuis_dictionary: 75,
        kkm_evaluasi: 75,
      };
      const docRef = await addDoc(collection(db, 'kelas'), kelasBaru);
      const kelasDenganId = { id: docRef.id, ...kelasBaru };
      setDaftarKelas(prev => [...prev, kelasDenganId]);
      setKelasAktif(kelasDenganId);
      setShowCreateModal(false);
      alert(`Kelas berhasil dibuat! Token: ${token}`);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat kelas.');
    } finally {
      setCreating(false);
    }
  };

  // === GABUNG KELAS (BERDASARKAN TOKEN) ===
  const openJoinModal = () => {
    setJoinToken('');
    setShowJoinModal(true);
  };

  const handleJoinKelas = async (e) => {
    e.preventDefault();
    if (!joinToken.trim()) return;
    setJoining(true);
    setError('');
    try {
      const q = query(collection(db, 'kelas'), where('token', '==', joinToken.trim().toUpperCase()));
      const snap = await getDocs(q);
      if (snap.empty) {
        setError('Token tidak valid atau kelas tidak ditemukan.');
        setJoining(false);
        return;
      }
      const kelasDoc = snap.docs[0];
      const kelasData = kelasDoc.data();
      const dosenIds = kelasData.dosen_ids || [];
      if (dosenIds.includes(userId)) {
        setError('Anda sudah bergabung di kelas ini.');
        setJoining(false);
        return;
      }
      await updateDoc(doc(db, 'kelas', kelasDoc.id), {
        dosen_ids: arrayUnion(userId)
      });
      const updatedKelas = { id: kelasDoc.id, ...kelasData, dosen_ids: [...dosenIds, userId] };
      setDaftarKelas(prev => {
        const exists = prev.find(k => k.id === updatedKelas.id);
        if (exists) {
          return prev.map(k => k.id === updatedKelas.id ? updatedKelas : k);
        } else {
          return [...prev, updatedKelas];
        }
      });
      setKelasAktif(updatedKelas);
      setShowJoinModal(false);
      alert('Berhasil bergabung ke kelas!');
    } catch (err) {
      console.error(err);
      setError('Gagal bergabung ke kelas.');
    } finally {
      setJoining(false);
    }
  };

  // === KELOLA DOSEN DI KELAS AKTIF ===
  const openManageDosen = () => {
    setNewDosenNIP('');
    setError('');
    setShowManageDosen(true);
  };

  const addDosenToClass = async () => {
    if (!newDosenNIP.trim()) return;
    setAddingDosen(true);
    setError('');
    try {
      const dosenSnap = await getDoc(doc(db, 'dosen', newDosenNIP.trim()));
      if (!dosenSnap.exists()) {
        setError('NIP dosen tidak ditemukan.');
        setAddingDosen(false);
        return;
      }
      const nipToAdd = dosenSnap.id;
      if ((kelasAktif.dosen_ids || []).includes(nipToAdd)) {
        setError('Dosen tersebut sudah ada di kelas.');
        setAddingDosen(false);
        return;
      }
      const kelasRef = doc(db, 'kelas', kelasAktif.id);
      await updateDoc(kelasRef, {
        dosen_ids: arrayUnion(nipToAdd)
      });
      setKelasAktif(prev => ({
        ...prev,
        dosen_ids: [...(prev.dosen_ids || []), nipToAdd]
      }));
      setNewDosenNIP('');
      const newDosenSnap = await getDoc(doc(db, 'dosen', nipToAdd));
      setDosenInClass(prev => [...prev, { nip: nipToAdd, nama: newDosenSnap.exists() ? newDosenSnap.data().Nama : '(baru)' }]);
    } catch (err) {
      console.error(err);
      setError('Gagal menambah dosen.');
    } finally {
      setAddingDosen(false);
    }
  };

  const removeDosenFromClass = async (nipToRemove) => {
    if (!window.confirm(`Hapus dosen dengan NIP ${nipToRemove} dari kelas?`)) return;
    try {
      const kelasRef = doc(db, 'kelas', kelasAktif.id);
      await updateDoc(kelasRef, {
        dosen_ids: arrayRemove(nipToRemove)
      });
      setKelasAktif(prev => ({
        ...prev,
        dosen_ids: prev.dosen_ids.filter(nip => nip !== nipToRemove)
      }));
      setDosenInClass(prev => prev.filter(d => d.nip !== nipToRemove));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus dosen.');
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <SidebarDosen />
        <div className="dashboard-content">
          <Navbar />
          <div className="loading-page">Memuat dashboard...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <SidebarDosen />
      <div className="dashboard-content">
        <Navbar />
        <div className="content-inner">
          {/* Header Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <h1 className="card-title">Dashboard Dosen</h1>
                <p className="card-subtitle">{dosenData?.Nama} ({dosenData?.Email})</p>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Kelas Anda */}
          <div className="card">
            <div className="card-title"><BookOpen size={22} /> Kelas Anda</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
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
                {daftarKelas.length === 0 && (
                  <span style={{ color: '#6b7280' }}>Belum ada kelas.</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-outline" onClick={openJoinModal}>
                  <UserPlus size={18} /> Gabung Kelas
                </button>
                <button className="btn btn-blue" onClick={openCreateModal}>
                  <PlusCircle size={18} /> Buat Kelas Baru
                </button>
              </div>
            </div>
          </div>

          {kelasAktif && (
            <>
              {/* Token & Kelola Dosen */}
              <div className="card">
                <div className="card-title"><ClipboardList size={22} /> Token Kelas & Tim Pengajar</div>
                <div className="token-box">
                  <div className="token-code">{kelasAktif.token}</div>
                  <button className="btn btn-blue" onClick={copyToken}>
                    {copySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                    {copySuccess ? 'Tersalin!' : 'Salin Token'}
                  </button>
                  <button className="btn btn-outline" onClick={openManageDosen}>
                    <Users size={18} /> Kelola Dosen
                  </button>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Token ini dibagikan ke mahasiswa. Dosen lain bisa bergabung dengan token ini.
                </p>
              </div>

              {/* KKM */}
              <div className="card">
                <div className="card-title">KKM - {kelasAktif.nama_kelas} ({kelasAktif.tahun_ajaran} {kelasAktif.semester})</div>
                <div className="kkm-grid">
                  <div className="kkm-item">
                    <label>Kuis List</label>
                    <input type="number" value={kkmData.kkm_kuis_list} onChange={(e) => handleKKMChange('kkm_kuis_list', e.target.value)} />
                  </div>
                  <div className="kkm-item">
                    <label>Kuis Nested List</label>
                    <input type="number" value={kkmData.kkm_kuis_nested_list} onChange={(e) => handleKKMChange('kkm_kuis_nested_list', e.target.value)} />
                  </div>
                  <div className="kkm-item">
                    <label>Kuis Dictionary</label>
                    <input type="number" value={kkmData.kkm_kuis_dictionary} onChange={(e) => handleKKMChange('kkm_kuis_dictionary', e.target.value)} />
                  </div>
                  <div className="kkm-item">
                    <label>Evaluasi</label>
                    <input type="number" value={kkmData.kkm_evaluasi} onChange={(e) => handleKKMChange('kkm_evaluasi', e.target.value)} />
                  </div>
                </div>
                <button className="btn btn-green" onClick={saveKKM} disabled={updatingKKM}>
                  <Save size={18} /> {updatingKKM ? 'Menyimpan...' : 'Simpan KKM'}
                </button>
              </div>

              {/* Daftar Mahasiswa (ringkasan) */}
              <div className="card">
                <div className="card-title"><Users size={22} /> Mahasiswa ({mahasiswaList.length})</div>
                {mahasiswaList.length === 0 ? (
                  <p style={{ color: '#6b7280' }}>Belum ada mahasiswa yang mendaftar dengan token ini.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th>NIM</th><th>Nama</th><th>Email</th><th>Kuis List</th><th>Kuis Nested</th><th>Kuis Dict</th><th>Evaluasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mahasiswaList.map(mhs => (
                          <tr key={mhs.id}>
                            <td>{mhs.NIM}</td>
                            <td>{mhs.Nama}</td>
                            <td>{mhs.Email}</td>
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
            </>
          )}
        </div>

        {/* ===== MODAL BUAT KELAS BARU ===== */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close" onClick={() => setShowCreateModal(false)}><X size={24} /></div>
              <h2 className="modal-title">Buat Kelas Baru</h2>
              <form onSubmit={handleCreateKelas}>
                <div className="form-group">
                  <label>Nama Kelas / Mata Kuliah</label>
                  <input type="text" placeholder="Contoh: Algoritma" value={newKelas.nama_kelas} onChange={e => setNewKelas({...newKelas, nama_kelas: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Tahun Ajaran</label>
                  <input type="text" placeholder="2025/2026" value={newKelas.tahun_ajaran} onChange={e => setNewKelas({...newKelas, tahun_ajaran: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <select value={newKelas.semester} onChange={e => setNewKelas({...newKelas, semester: e.target.value})}>
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-blue" disabled={creating}>{creating ? 'Membuat...' : 'Buat Kelas'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== MODAL GABUNG KELAS ===== */}
        {showJoinModal && (
          <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close" onClick={() => setShowJoinModal(false)}><X size={24} /></div>
              <h2 className="modal-title">Gabung ke Kelas</h2>
              <form onSubmit={handleJoinKelas}>
                <div className="form-group">
                  <label>Masukkan Token Kelas</label>
                  <input type="text" placeholder="Token 8 karakter" value={joinToken} onChange={e => setJoinToken(e.target.value)} maxLength={8} required />
                </div>
                {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowJoinModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-blue" disabled={joining}>{joining ? 'Menggabungkan...' : 'Gabung'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== MODAL KELOLA DOSEN ===== */}
        {showManageDosen && (
          <div className="modal-overlay" onClick={() => setShowManageDosen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close" onClick={() => setShowManageDosen(false)}><X size={24} /></div>
              <h2 className="modal-title">Tim Pengajar - {kelasAktif?.nama_kelas}</h2>
              <ul className="dosen-list">
                {dosenInClass.map(d => (
                  <li key={d.nip}>
                    <span>{d.nama} ({d.nip})</span>
                    {(kelasAktif?.dosen_ids?.length > 1) && (
                      <button className="btn btn-red" onClick={() => removeDosenFromClass(d.nip)}><Trash2 size={14} /></button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="form-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label>Tambah Dosen (masukkan NIP)</label>
                  <input type="text" placeholder="NIP dosen" value={newDosenNIP} onChange={e => setNewDosenNIP(e.target.value)} />
                </div>
                <button className="btn btn-blue" onClick={addDosenToClass} disabled={addingDosen}>{addingDosen ? '...' : <PlusCircle size={18} />}</button>
              </div>
              {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setShowManageDosen(false)}>Tutup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardDosen;