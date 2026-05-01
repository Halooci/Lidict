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
  onSnapshot 
} from 'firebase/firestore';
import Navbar from '../komponen/Navbar';
import { Copy, CheckCircle, LogOut, Users, ClipboardList, Save } from 'lucide-react';

// ==================== STYLES ====================
const styles = `
  .dashboard-container {
    min-height: 100vh;
    background: #f3f4f6;
    padding: 2rem 1rem;
  }
  .dashboard-max-width {
    max-width: 1280px;
    margin: 0 auto;
    margin-top: 50px;
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
  .btn-blue {
    background: #3b82f6;
    color: white;
  }
  .btn-blue:hover { background: #2563eb; }
  .btn-green {
    background: #10b981;
    color: white;
  }
  .btn-green:hover { background: #059669; }
  .btn-red {
    background: #ef4444;
    color: white;
  }
  .btn-red:hover { background: #dc2626; }
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
  .table-wrapper {
    overflow-x: auto;
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
  .loading {
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

// ==================== MAIN COMPONENT ====================
const DashboardDosen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dosenData, setDosenData] = useState(null);
  const [tokenKelas, setTokenKelas] = useState('');
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [kkmData, setKkmData] = useState({
    'Nilai Kuis List': 75,
    'Nilai Kuis Nested List': 75,
    'Nilai Kuis Dictionary': 75,
    'Nilai Evaluasi': 75
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [updatingKKM, setUpdatingKKM] = useState(false);

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userId || !userEmail) {
      navigate('/loginregister');
      return;
    }

    const fetchData = async () => {
      try {
        const dosenRef = doc(db, 'dosen', userId);
        const dosenSnap = await getDoc(dosenRef);
        if (!dosenSnap.exists()) {
          alert('Data dosen tidak ditemukan. Silakan login ulang.');
          localStorage.clear();
          navigate('/loginregister');
          return;
        }
        const dosen = dosenSnap.data();
        setDosenData(dosen);
        const token = dosen.Token_kelas;
        setTokenKelas(token);

        const kkmRef = doc(db, 'kkm', token);
        const kkmSnap = await getDoc(kkmRef);
        if (kkmSnap.exists()) setKkmData(kkmSnap.data());

        const q = query(collection(db, 'mahasiswa'), where('Token_mahasiswa', '==', token));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const siswa = [];
          snapshot.forEach((docSnap) => {
            siswa.push({ id: docSnap.id, ...docSnap.data() });
          });
          setMahasiswaList(siswa);
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error(error);
        alert('Gagal memuat data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleKKMChange = (field, value) => {
    setKkmData(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const saveKKM = async () => {
    if (!tokenKelas) return;
    setUpdatingKKM(true);
    try {
      const kkmRef = doc(db, 'kkm', tokenKelas);
      await updateDoc(kkmRef, kkmData);
      alert('KKM berhasil disimpan!');
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan KKM.');
    } finally {
      setUpdatingKKM(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(tokenKelas);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/loginregister');
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <Navbar />
        <div className="loading">Memuat dashboard...</div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-max-width">
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

          {/* Token Kelas Card */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={22} /> Token Kelas
            </div>
            <div className="token-box">
              <div className="token-code">{tokenKelas}</div>
              <button className="btn btn-blue" onClick={copyToken}>
                {copySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                {copySuccess ? 'Tersalin!' : 'Salin Token'}
              </button>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Bagikan token ini kepada mahasiswa agar mereka dapat mendaftar ke kelas Anda.
              </span>
            </div>
          </div>

          {/* KKM Card */}
          <div className="card">
            <div className="card-title">Kriteria Ketuntasan Minimal (KKM)</div>
            <div className="kkm-grid">
              <div className="kkm-item">
                <label>Kuis List</label>
                <input type="number" value={kkmData['Nilai Kuis List']} onChange={(e) => handleKKMChange('Nilai Kuis List', e.target.value)} />
              </div>
              <div className="kkm-item">
                <label>Kuis Nested List</label>
                <input type="number" value={kkmData['Nilai Kuis Nested List']} onChange={(e) => handleKKMChange('Nilai Kuis Nested List', e.target.value)} />
              </div>
              <div className="kkm-item">
                <label>Kuis Dictionary</label>
                <input type="number" value={kkmData['Nilai Kuis Dictionary']} onChange={(e) => handleKKMChange('Nilai Kuis Dictionary', e.target.value)} />
              </div>
              <div className="kkm-item">
                <label>Evaluasi</label>
                <input type="number" value={kkmData['Nilai Evaluasi']} onChange={(e) => handleKKMChange('Nilai Evaluasi', e.target.value)} />
              </div>
            </div>
            <button className="btn btn-green" onClick={saveKKM} disabled={updatingKKM}>
              <Save size={18} /> {updatingKKM ? 'Menyimpan...' : 'Simpan KKM'}
            </button>
          </div>

          {/* Daftar Mahasiswa Card */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={22} /> Daftar Mahasiswa ({mahasiswaList.length})
            </div>
            {mahasiswaList.length === 0 ? (
              <p style={{ color: '#6b7280' }}>Belum ada mahasiswa yang mendaftar dengan token ini.</p>
            ) : (
              <div className="table-wrapper">
                <table>
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
        </div>
      </div>
    </>
  );
};

export default DashboardDosen;