import { useState, useEffect } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';
import { db } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function RangkumanNestedList() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) {
      navigate('/loginregister');
      return;
    }

    const fetchProgres = async () => {
      try {
        const docRef = doc(db, "mahasiswa", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const progres = data.progres_belajar || 0;
          
          // 🔒 Halaman hanya bisa diakses jika progres >= 8
          if (progres < 8) {
            navigate('/dashboard');
            return;
          }
          // Jika progres >= 8, boleh akses halaman
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Gagal mengambil progres:", error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProgres();
  }, [navigate]);

  // Tampilkan loading saat sedang mengambil data
  if (loading) {
    return (
      <>
        <Navbar />
        <SidebarMateri isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div 
          className="main-content"
          style={{ 
            marginLeft: isSidebarOpen ? "280px" : "0",
            transition: "margin-left 0.3s ease",
            paddingTop: "64px",
            minHeight: "100vh",
            width: "auto",
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
              <div style={{ fontSize: '18px', color: '#306998' }}>Memuat data...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <SidebarMateri isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div 
        className="main-content"
        style={{ 
          marginLeft: isSidebarOpen ? "280px" : "0",
          transition: "margin-left 0.3s ease",
          paddingTop: "64px",
          minHeight: "100vh",
          width: "auto",
        }}
      >
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>RANGKUMAN NESTED LIST</h1>
          </div>

          <section style={styles.section}>
            <div style={styles.card}>
              {/* Grid 2 kolom dengan garis pemisah */}
              <div style={styles.gridContainer}>
                {/* Kolom kiri */}
                <div style={styles.gridColumnLeft}>
                  <h3 style={styles.subTitle}>Pengertian</h3>
                  <p style={styles.text}>
                    <strong>Nested list</strong> (list bersarang) adalah list yang berisi list lain sebagai elemennya. 
                    Digunakan untuk merepresentasikan data dua dimensi atau lebih, seperti tabel, matriks, atau data hierarkis.
                  </p>

                  <h3 style={styles.subTitle}>Karakteristik</h3>
                  <ul style={styles.list}>
                    <li><strong>Ordered</strong> – urutan baris dan kolom tetap.</li>
                    <li><strong>Mutable</strong> – dapat diubah (tambah, hapus, ubah).</li>
                    <li><strong>Heterogeneous</strong> – setiap baris bisa memiliki panjang berbeda (ragged array).</li>
                    <li><strong>Akses</strong> – menggunakan dua indeks: list[baris][kolom].</li>
                  </ul>

                  <h3 style={styles.subTitle}>Membuat dan Mengakses</h3>
                  <p style={styles.text}>
                    <strong>Membuat:</strong> tulis list di dalam list, pisahkan dengan koma.<br />
                    Contoh: data = [[1, 2, 3], [4, 5, 6]] (2 baris, 3 kolom).
                  </p>
                  <p style={styles.text}>
                    <strong>Mengakses:</strong> gunakan indeks baris dan kolom (mulai dari 0).<br />
                    Contoh: data[0][1] → elemen baris pertama kolom kedua.<br />
                    Indeks negatif juga berlaku, misal data[-1][-2].
                  </p>

                  <h3 style={styles.subTitle}>Operasi Dasar</h3>
                  <ul style={styles.list}>
                    <li><strong>Ubah elemen</strong> – data[baris][kolom] = nilai_baru</li>
                    <li><strong>Cari nilai</strong> – perulangan bersarang dengan pengecekan kondisi.</li>
                    <li><strong>Iterasi semua elemen</strong> – loop for i in range(len(data)): for j in range(len(data[i])): ...</li>
                    <li><strong>Gabung nested list</strong> – operator + (contoh: c = a + b).</li>
                  </ul>
                </div>

                {/* Kolom kanan */}
                <div style={styles.gridColumnRight}>
                  <h3 style={styles.subTitle}>Manipulasi Baris</h3>
                  <ul style={styles.list}>
                    <li>Tambah di akhir – append([baris_baru])</li>
                    <li>Sisipkan – insert(posisi, [baris_baru])</li>
                    <li>Hapus terakhir – pop()</li>
                    <li>Hapus indeks tertentu – del data[indeks]</li>
                  </ul>

                  <h3 style={styles.subTitle}>Manipulasi Kolom</h3>
                  <ul style={styles.list}>
                    <li>Tambah kolom di setiap baris – loop: for baris in data: baris.append(nilai)</li>
                    <li>Hapus kolom tertentu – loop: for baris in data: baris.pop(indeks_kolom)</li>
                  </ul>

                  <h3 style={styles.subTitle}>Ringkasan Metode</h3>
                  <ul style={styles.list}>
                    <li><strong>Akses elemen</strong> – data[i][j]</li>
                    <li><strong>Ubah elemen</strong> – data[i][j] = x</li>
                    <li><strong>Tambah baris (append)</strong> – data.append([a,b,c])</li>
                    <li><strong>Sisip baris (insert)</strong> – data.insert(i, [a,b,c])</li>
                    <li><strong>Hapus baris (pop)</strong> – data.pop() atau data.pop(i)</li>
                    <li><strong>Hapus baris (del)</strong> – del data[i]</li>
                    <li><strong>Tambah kolom</strong> – for row in data: row.append(x)</li>
                    <li><strong>Hapus kolom</strong> – for row in data: row.pop(j)</li>
                    <li><strong>Iterasi</strong> – for i in range(len(data)): for j in range(len(data[i])): ...</li>
                    <li><strong>Gabung</strong> – c = a + b</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

/* ================== STYLE ================== */
const styles = {
  page: {
    padding: "30px 40px",
    paddingTop: "30px",
    backgroundColor: "#f5f7fa",
    minHeight: "calc(100vh - 64px)",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "18px 24px",
    position: "relative",
    marginBottom: "30px",
    borderRadius: "6px",
  },
  headerAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "8px",
    backgroundColor: "#FFD43B",
    borderRadius: "6px 0 0 6px",
  },
  headerTitle: {
    margin: 0,
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
  },
  section: { marginBottom: "40px" },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  gridColumnLeft: {
    paddingRight: "15px",
    borderRight: "2px solid #dee2e6",
  },
  gridColumnRight: {
    paddingLeft: "15px",
  },
  list: { 
    paddingLeft: "20px", 
    lineHeight: "1.8", 
    marginBottom: "15px",
    textAlign: "justify" 
  },
  text: { 
    lineHeight: "1.8", 
    color: "#333", 
    marginBottom: "15px",
    textAlign: "justify" 
  },
  subTitle: { marginTop: "20px", marginBottom: "10px", color: "#306998", fontSize: "1.2rem", fontWeight: "600" },
};