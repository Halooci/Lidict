import { useState, useEffect } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';

export default function RangkumanNestedList() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) {
      navigate('/loginregister');
    }
  }, [navigate]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>RANGKUMAN NESTED LIST</h1>
          </div>

          {/* PENGERTIAN DAN KARAKTERISTIK */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Pengertian Nested List</h2>
              <p style={styles.text}>
                <strong>Nested list</strong> (list bersarang) adalah struktur data di mana sebuah list menjadi elemen dari list lain. 
                Nested list sangat berguna untuk merepresentasikan data dua dimensi atau lebih, seperti tabel, matriks, atau data hierarkis.
              </p>
              <ul style={styles.list}>
                <li><strong>Ordered:</strong> Urutan baris dan kolom tetap sesuai penyisipan.</li>
                <li><strong>Mutable:</strong> Dapat diubah (ditambah, dihapus, diubah) baik baris maupun kolom.</li>
                <li><strong>Heterogeneous:</strong> Setiap baris dapat memiliki panjang berbeda (ragged array).</li>
                <li><strong>Akses:</strong> Menggunakan dua indeks: <code>list[baris][kolom]</code>.</li>
              </ul>
            </div>
          </section>

          {/* PEMBUATAN DAN AKSES ELEMEN */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Membuat dan Mengakses Nested List</h2>
              <p style={styles.text}>
                <strong>Membuat nested list:</strong> Tulis list di dalam list, pisahkan dengan koma.
              </p>
              <pre style={styles.code}>{`# Cara membuat nested list
data = [[1, 2, 3], [4, 5, 6]]          # 2 baris, 3 kolom
matriks = [[1, 2], [3, 4], [5, 6]]    # 3 baris, 2 kolom
ragged = [[1, 2], [3, 4, 5], [6]]     # panjang baris berbeda`}</pre>
              <p style={styles.text}>
                <strong>Mengakses elemen:</strong> Gunakan indeks baris dan kolom (keduanya mulai dari 0). Contoh: <code>data[0][1]</code> mengakses elemen baris pertama kolom kedua. 
                Indeks negatif juga dapat digunakan, misalnya <code>data[-1][-2]</code> mengakses elemen kedua dari akhir pada baris terakhir.
              </p>
            </div>
          </section>

          {/* OPERASI DASAR NESTED LIST */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Operasi Dasar Nested List</h2>
              <ul style={styles.list}>
                <li><strong>Mengubah nilai elemen:</strong> <code>data[baris][kolom] = nilai_baru</code></li>
                <li><strong>Mencari nilai:</strong> Lakukan perulangan bersarang dan pengecekan kondisi untuk menemukan nilai tertentu.</li>
                <li><strong>Iterasi seluruh elemen:</strong> Gunakan loop <code>for i in range(len(data))</code> untuk setiap baris, dan di dalamnya <code>for j in range(len(data[i]))</code> untuk setiap kolom.</li>
                <li><strong>Menggabungkan nested list:</strong> Operator <code>+</code> dapat digunakan untuk menggabungkan dua nested list menjadi satu list baru.</li>
              </ul>
            </div>
          </section>

          {/* MANIPULASI NESTED LIST (BARIS DAN KOLOM) */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Manipulasi Nested List</h2>
              <h3 style={styles.subTitle}>Manipulasi Baris</h3>
              <ul style={styles.list}>
                <li><strong>Menambah baris di akhir:</strong> <code>data.append([baris_baru])</code></li>
                <li><strong>Menyisipkan baris:</strong> <code>data.insert(posisi, [baris_baru])</code></li>
                <li><strong>Menghapus baris terakhir:</strong> <code>data.pop()</code></li>
                <li><strong>Menghapus baris berdasarkan indeks:</strong> <code>del data[indeks]</code></li>
              </ul>

              <h3 style={styles.subTitle}>Manipulasi Kolom</h3>
              <ul style={styles.list}>
                <li><strong>Menambah kolom di setiap baris:</strong> Gunakan loop <code>for baris in data: baris.append(nilai)</code></li>
                <li><strong>Menghapus kolom tertentu dari setiap baris:</strong> Gunakan loop <code>for baris in data: baris.pop(indeks_kolom)</code></li>
              </ul>
            </div>
          </section>

          {/* RINGKASAN METODE PENTING */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>📋 Ringkasan Metode dan Operasi</h2>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.tableCell}>Operasi/Metode</th>
                      <th style={styles.tableCell}>Contoh</th>
                      <th style={styles.tableCell}>Penjelasan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={styles.tableCell}>Akses elemen</td><td style={styles.tableCell}><code>data[i][j]</code></td><td style={styles.tableCell}>Mengambil elemen baris i kolom j</td></tr>
                    <tr><td style={styles.tableCell}>Ubah elemen</td><td style={styles.tableCell}><code>data[i][j] = x</code></td><td style={styles.tableCell}>Mengubah nilai pada posisi tertentu</td></tr>
                    <tr><td style={styles.tableCell}>Tambah baris (append)</td><td style={styles.tableCell}><code>data.append([a,b,c])</code></td><td style={styles.tableCell}>Menambah baris baru di akhir</td></tr>
                    <tr><td style={styles.tableCell}>Sisip baris (insert)</td><td style={styles.tableCell}><code>data.insert(i, [a,b,c])</code></td><td style={styles.tableCell}>Menyisip baris pada indeks i</td></tr>
                    <tr><td style={styles.tableCell}>Hapus baris (pop)</td><td style={styles.tableCell}><code>data.pop()</code> atau <code>data.pop(i)</code></td><td style={styles.tableCell}>Hapus baris terakhir atau baris ke-i</td></tr>
                    <tr><td style={styles.tableCell}>Hapus baris (del)</td><td style={styles.tableCell}><code>del data[i]</code></td><td style={styles.tableCell}>Hapus baris ke-i</td></tr>
                    <tr><td style={styles.tableCell}>Tambah kolom</td><td style={styles.tableCell}><code>for row in data: row.append(x)</code></td><td style={styles.tableCell}>Menambah kolom baru di semua baris</td></tr>
                    <tr><td style={styles.tableCell}>Hapus kolom</td><td style={styles.tableCell}><code>for row in data: row.pop(j)</code></td><td style={styles.tableCell}>Hapus kolom ke-j dari semua baris</td></tr>
                    <tr><td style={styles.tableCell}>Iterasi</td><td style={styles.tableCell}><code>for i in range(len(data)): for j in range(len(data[i])): ...</code></td><td style={styles.tableCell}>Perulangan bersarang untuk mengakses semua elemen</td></tr>
                    <tr><td style={styles.tableCell}>Penggabungan</td><td style={styles.tableCell}><code>c = a + b</code></td><td style={styles.tableCell}>Menggabungkan dua nested list</td></tr>
                  </tbody>
                </table>
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
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "15px",
    borderLeft: "5px solid #306998",
    paddingLeft: "12px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },
  list: { paddingLeft: "20px", lineHeight: "1.8", marginBottom: "15px" },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
  subTitle: { marginTop: "20px", marginBottom: "10px", color: "#306998", fontSize: "1.2rem", fontWeight: "600" },
  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflowX: "auto",
    marginBottom: "15px",
  },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    lineHeight: "1.6",
    marginTop: "10px",
  },
  tableHeader: { backgroundColor: "#306998", color: "white" },
  tableCell: { padding: "10px", border: "1px solid #ddd", textAlign: "left", verticalAlign: "top" },
};