import { useState, useEffect } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';
import { db } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function RangkumanList() {
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
          
          // 🔒 Halaman hanya bisa diakses jika progres >= 4
          if (progres < 4) {
            navigate('/dashboard');
            return;
          }
          // Jika progres >= 4, boleh akses halaman
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
            <h1 style={styles.headerTitle}>RANGKUMAN LIST</h1>
          </div>

          <section style={styles.section}>
            <div style={styles.card}>
              <p style={styles.text}>
                <strong>List</strong> adalah struktur data Python yang menyimpan koleksi elemen (tipe data campuran) secara <strong>terurut</strong>. 
                Elemen dapat diakses melalui <strong>indeks</strong> (positif dari 0, negatif dari -1). List bersifat <strong>mutable</strong> dan ukurannya dinamis.
              </p>

              {/* Grid 2 kolom dengan garis pemisah */}
              <div style={styles.gridContainer}>
                {/* Kolom kiri */}
                <div style={styles.gridColumnLeft}>
                  <h3 style={styles.subTitle}>Karakteristik</h3>
                  <ul style={styles.list}>
                    <li><strong>Ordered</strong> – mempertahankan urutan penyisipan.</li>
                    <li><strong>Indexed</strong> – akses via indeks (positif/negatif).</li>
                    <li><strong>Mutable</strong> – dapat ditambah, dihapus, diubah.</li>
                    <li><strong>Heterogeneous</strong> – berisi berbagai tipe data.</li>
                    <li><strong>Dynamic</strong> – ukuran otomatis bertambah/berkurang.</li>
                  </ul>

                  <h3 style={styles.subTitle}>Membuat List</h3>
                  <p style={styles.text}>
                    Gunakan kurung siku [] atau fungsi list(). Contoh: data = [1, "teks", True].
                  </p>

                  <h3 style={styles.subTitle}>Akses Elemen</h3>
                  <ul style={styles.list}>
                    <li><strong>Indeks positif</strong> : dimulai dari 0 (elemen pertama).</li>
                    <li><strong>Indeks negatif</strong> : dimulai dari -1 (elemen terakhir).</li>
                    <li><strong>Slicing</strong> : <strong>list[awal:akhir]</strong> mengambil elemen dari indeks awal hingga sebelum akhir.</li>
                  </ul>

                  <h3 style={styles.subTitle}>Operasi Dasar</h3>
                  <ul style={styles.list}>
                    <li><strong>Concatenation (+)</strong> –  Menggabungkan dua atau lebih list menjadi list baru.</li>
                    <li><strong>Repetition (*)</strong> – Mengulang list sebanyak n kali.</li>
                    <li><strong>Keanggotaan (in)</strong> – Mengecek apakah suatu nilai ada di dalam list (hasil True/False).</li>
                    <li><strong>Panjang (len)</strong> – Menghitung jumlah elemen list.</li>
                  </ul>
                </div>

                {/* Kolom kanan */}
                <div style={styles.gridColumnRight}>
                  <h3 style={styles.subTitle}>Manipulasi List</h3>

                  <h4 style={styles.subSubTitle}>Menambah</h4>
                  <ul style={styles.list}>
                    <li>append(x) – tambah x di akhir.</li>
                    <li>insert(i, x) – sisipkan x di indeks i.</li>
                    <li>extend(iterable) – tambahkan semua elemen dari iterable.</li>
                  </ul>

                  <h4 style={styles.subSubTitle}>Menghapus</h4>
                  <ul style={styles.list}>
                    <li>remove(x) – hapus elemen pertama bernilai x.</li>
                    <li>pop(i) – hapus indeks i (default: terakhir) dan kembalikan nilainya.</li>
                    <li>clear() – hapus semua elemen.</li>
                    <li>del list[i] atau del list[i:j] – hapus indeks atau slice.</li>
                  </ul>

                  <h4 style={styles.subSubTitle}>Mengubah</h4>
                  <p style={styles.text}>
                    list[indeks] = nilai_baru – mengganti nilai pada posisi tertentu.
                  </p>

                  <h4 style={styles.subSubTitle}>Pengurutan & Pembalikan</h4>
                  <ul style={styles.list}>
                    <li>sort(): mengurutkan list secara ascending (nilai terkecil ke terbesar) secara permanen.</li>
                    <li>reverse(): membalik urutan list secara permanen.</li>
                  </ul>

                  <h4 style={styles.subSubTitle}>Method Lainnya</h4>
                  <ul style={styles.list}>
                    <li>count(x) – jumlah kemunculan x dalam list. Hasilnya integer; jika x tidak ditemukan, hasilnya 0. Contoh: [1, 2, 2, 3].count(2) menghasilkan 2</li>
                    <li>index(x) – mengembalikan posisi indeks pertama kemunculan x (dimulai dari 0). Jika x tidak ada, akan memunculkan ValueError. Contoh: [10, 20, 30, 20].index(20) menghasilkan 1.</li>
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

const styles = {
  page: {
    padding: "30px 40px",
    paddingTop: "40px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "18px 24px",
    borderRadius: "6px",
    marginBottom: "30px",
    position: "relative"
  },
  headerAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "8px",
    backgroundColor: "#FFD43B"
  },
  headerTitle: {
    margin: 0,
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700"
  },
  section: { marginBottom: "40px" },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
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
  subTitle: { marginTop: "20px", marginBottom: "10px", color: "#306998", fontSize: "1.4rem", fontWeight: "600" },
  subSubTitle: { marginTop: "20px", marginBottom: "8px", color: "#2c5282", fontSize: "1.2rem", fontWeight: "600" },
};