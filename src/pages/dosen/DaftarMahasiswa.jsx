import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Navbar from '../komponen/Navbar';
import SidebarDosen from './SidebarDosen';
import { Users } from 'lucide-react';

const styles = `
  .mahasiswa-page {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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

  return <td>{nilai ?? '...'}</td>;
};

const DaftarMahasiswa = () => {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const tokenKelas = localStorage.getItem('activeKelasToken');

  useEffect(() => {
    if (!tokenKelas) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'mahasiswa'), where('Token_mahasiswa', '==', tokenKelas));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const siswa = [];
      snapshot.forEach((docSnap) => {
        siswa.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMahasiswaList(siswa);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tokenKelas]);

  if (!tokenKelas) {
    return (
      <>
        <style>{styles}</style>
        <SidebarDosen />
        <div style={{ marginLeft: '250px', minHeight: '100vh', background: '#f3f4f6' }}>
          <Navbar />
          <div style={{ padding: '80px 2rem 2rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
            <div className="mahasiswa-page">
              <div className="title"><Users size={22} /> Daftar Mahasiswa</div>
              <p className="empty">Silakan pilih kelas terlebih dahulu di halaman Dashboard.</p>
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
        <div style={{ marginLeft: '250px', minHeight: '100vh', background: '#f3f4f6' }}>
          <Navbar />
          <div className="loading-text" style={{ paddingTop: '80px' }}>Memuat data mahasiswa...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <SidebarDosen />
      <div style={{ marginLeft: '250px', minHeight: '100vh', background: '#f3f4f6' }}>
        <Navbar />
        <div style={{ padding: '80px 2rem 2rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
          <div className="mahasiswa-page">
            <div className="title"><Users size={22} /> Daftar Mahasiswa ({mahasiswaList.length})</div>
            {mahasiswaList.length === 0 ? (
              <p className="empty">Belum ada mahasiswa yang mendaftar dengan token ini.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
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

export default DaftarMahasiswa;