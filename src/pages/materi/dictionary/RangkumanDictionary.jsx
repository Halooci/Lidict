import { useState, useEffect } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';
import { db } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function RangkumanDictionary() {
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
          
          // 🔒 Halaman hanya bisa diakses jika progres >= 12
          if (progres < 12) {
            navigate('/dashboard');
            return;
          }
          // Jika progres >= 12, boleh akses halaman
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
            <h1 style={styles.headerTitle}>RANGKUMAN DICTIONARY</h1>
          </div>

          <section style={styles.section}>
            <div style={styles.card}>
              <p style={styles.text}>
                <strong>Dictionary</strong> adalah struktur data Python yang menyimpan pasangan <strong>key-value</strong> (kunci-nilai). 
                Key bersifat unik dan immutable, value dapat berupa tipe data apa pun. Dictionary bersifat mutable, dinamis, dan sangat efisien untuk pencarian data.
              </p>

              <div style={styles.gridContainer}>
                <div style={styles.gridColumnLeft}>
                  <h3 style={styles.subTitle}>Karakteristik</h3>
                  <ul style={styles.list}>
                    <li><strong>Key unik</strong> – tidak boleh duplikat; jika sama, nilai tertimpa.</li>
                    <li><strong>Key immutable</strong> – hanya boleh string, integer, tuple (list tidak boleh).</li>
                    <li><strong>Value bebas</strong> – bisa list, dictionary lain, fungsi, dll.</li>
                    <li><strong>Mutable</strong> – dapat ditambah, diubah, dihapus; ukuran otomatis menyesuaikan.</li>
                  </ul>

                  <h3 style={styles.subTitle}>Membuat Dictionary</h3>
                  <ul style={styles.list}>
                    <li>Kurung kurawal: mahasiswa = {"{"}"nama": "Budi", "umur": 20{"}"}</li>
                    <li>Fungsi dict(): data = dict(nama="Ani", kota="Jakarta")</li>
                    <li>Dictionary comprehension: kuadrat = {"{x: x**2 for x in range(1, 6)}"}</li>
                  </ul>

                  <h3 style={styles.subTitle}>Mengakses Nilai</h3>
                  <ul style={styles.list}>
                    <li>Kurung siku [] – print(mahasiswa["nama"]) → error jika key tidak ada.</li>
                    <li>Metode get() – print(mahasiswa.get("alamat", "Tidak tersedia")) → aman, bisa beri default.</li>
                  </ul>
                </div>

                <div style={styles.gridColumnRight}>
                  <h3 style={styles.subTitle}>Manipulasi Dictionary</h3>
                  <ul style={styles.list}>
                    <li><strong>Tambah/Ubah</strong> – dict["key"] = value</li>
                    <li><strong>Update banyak</strong> – dict.update({"{"}"a":1, "b":2{"}"})</li>
                    <li><strong>Hapus dengan pop()</strong> – value = dict.pop("key")</li>
                    <li><strong>Hapus item terakhir</strong> – item = dict.popitem()</li>
                    <li><strong>Hapus semua</strong> – dict.clear()</li>
                  </ul>

                  <h3 style={styles.subTitle}>Perbandingan Dictionary vs List</h3>
                  <ul style={styles.list}>
                    <li><strong>Akses:</strong> List pakai indeks angka, Dictionary pakai key.</li>
                    <li><strong>Urutan:</strong> List terurut pasti, Dictionary urutan sesuai penyisipan.</li>
                    <li><strong>Kunci:</strong> List hanya indeks angka, Dictionary key harus unik dan immutable.</li>
                  </ul>

                  <h3 style={styles.subTitle}>Metode Penting</h3>
                  <ul style={styles.list}>
                    <li>clear() – hapus semua item</li>
                    <li>get(key, default) – ambil nilai atau default</li>
                    <li>items() – view pasangan (key, value)</li>
                    <li>keys() – view semua key</li>
                    <li>pop(key, default) – hapus key, kembalikan value</li>
                    <li>popitem() – hapus dan kembalikan item terakhir</li>
                  </ul>

                  <h3 style={styles.subTitle}>Tips Penting</h3>
                  <ul style={styles.list}>
                    <li>Gunakan get() daripada [] jika key mungkin tidak ada, untuk hindari KeyError.</li>
                    <li>Gunakan in untuk cek keberadaan key: if "nama" in mahasiswa:</li>
                    <li>Gabung dictionary: {"{**dict1, **dict2}"} atau dict1.update(dict2).</li>
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
  section: {
    marginBottom: "40px",
  },
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
    marginTop: "15px",
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
    textAlign: "justify",
    marginBottom: "15px",
  },
  text: {
    lineHeight: "1.8",
    color: "#333",
    textAlign: "justify",
    marginBottom: "15px",
  },
  subTitle: {
    marginTop: "10px",
    marginBottom: "10px",
    color: "#306998",
    fontSize: "1.2rem",
    fontWeight: "600",
  },
};