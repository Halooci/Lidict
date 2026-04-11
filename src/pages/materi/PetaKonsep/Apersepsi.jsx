import { useState } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function Apersepsi() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <Navbar />
      <SidebarMateri
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        style={{
          marginLeft: isSidebarOpen ? "280px" : "0",
          transition: "margin-left 0.3s ease",
          paddingTop: "64px",
        }}
      >
        <div style={styles.page}>
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>APERSEPSI</h1>
          </div>

          {/* TUJUAN APERSEPSI */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Apersepsi</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li>Mengingat kembali materi prasyarat yang telah dipelajari sebelumnya.</li>
                <li>Membangun kaitan antara pengetahuan lama dengan materi baru yang akan dipelajari.</li>
                <li>Memotivasi dan mempersiapkan mental siswa untuk menerima topik baru.</li>
              </ul>
            </div>
          </section>

          {/* MATERI PRASYARAT */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>Materi Prasyarat: List pada Python</h3>
              <p style={styles.text}>
                Sebelum mempelajari <strong>Nested List</strong>, pastikan kamu sudah memahami konsep dasar <strong>List</strong> di Python. List adalah struktur data yang dapat menyimpan banyak nilai dalam satu variabel. Contoh:
              </p>
              <pre style={styles.codeBlock}>
                {`buah = ["apel", "mangga", "jeruk"]
print(buah[0])  # Output: apel`}
              </pre>
              <p style={styles.text}>
                Kamu juga harus mengerti cara mengakses elemen list dengan indeks, menambah elemen dengan <code>append()</code>, dan mengubah nilai elemen.
              </p>

              <div style={styles.infoBox}>
                <strong>🔗 Kaitan dengan Nested List:</strong>
                <p>
                  Nested list adalah list yang di dalamnya berisi list lain. Konsep ini memungkinkan kita membuat struktur data dua dimensi (seperti tabel atau matriks). Tanpa pemahaman list dasar, akan sulit memahami nested list.
                </p>
              </div>
            </div>
          </section>

          {/* AKTIVITAS AWAL */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Aktivitas Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum masuk ke materi nested list, coba kerjakan aktivitas berikut secara mandiri:
              </p>
              <ol style={styles.list}>
                <li>
                  Buatlah sebuah list bernama <code>nilai_pelajaran</code> yang berisi 5 angka (misalnya nilai ujian).
                </li>
                <li>
                  Tampilkan elemen ketiga dari list tersebut.
                </li>
                <li>
                  Tambahkan angka baru ke dalam list menggunakan method <code>append()</code>.
                </li>
                <li>
                  Ubah nilai pertama list menjadi 100.
                </li>
              </ol>
              <p style={styles.text}>
                Jika kamu dapat melakukan semua langkah di atas, berarti kamu siap mempelajari nested list!
              </p>
            </div>
          </section>

          {/* MOTIVASI */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>Mengapa Kita Perlu Belajar Nested List?</h3>
              <p style={styles.text}>
                Bayangkan kamu diminta menyimpan data nilai semua siswa dalam satu kelas untuk 5 mata pelajaran. Dengan list biasa, data akan tercampur dan sulit dibaca. <strong>Nested list</strong> memungkinkan kamu menyusun data tersebut rapi dalam bentuk baris (siswa) dan kolom (mata pelajaran). Kemampuan ini sangat berguna dalam pengolahan data, pembuatan game (papan catur), dan komputasi numerik.
              </p>
              <div style={styles.quoteBox}>
                “Apersepsi adalah jembatan antara apa yang sudah kamu ketahui dengan apa yang akan kamu pelajari. Mari bangun jembatan itu!”
              </div>
            </div>
          </section>

          {/* RANGKUMAN APERSEPSI */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Rangkuman Apersepsi</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li>List adalah struktur data dasar untuk menyimpan banyak nilai.</li>
                <li>Nested list adalah list di dalam list, berguna untuk data multidimensi.</li>
                <li>Menguasai list dasar akan memudahkan pemahaman nested list.</li>
                <li>Setelah ini, kita akan belajar membuat, mengakses, dan memanipulasi nested list.</li>
              </ul>
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
  list: { paddingLeft: "20px", lineHeight: "1.8" },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "12px" },
  subTitle: { marginTop: "0", marginBottom: "15px", color: "#306998", fontSize: "20px" },
  infoBox: {
    backgroundColor: "#e7f3ff",
    borderLeft: "5px solid #306998",
    padding: "12px 15px",
    margin: "20px 0",
    borderRadius: "6px",
  },
  quoteBox: {
    backgroundColor: "#fef9e6",
    borderLeft: "5px solid #FFD43B",
    padding: "15px",
    marginTop: "20px",
    fontStyle: "italic",
    fontSize: "16px",
    color: "#081527",
    borderRadius: "6px",
  },
  codeBlock: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "12px",
    borderRadius: "8px",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    overflow: "auto",
    margin: "15px 0",
  },
};