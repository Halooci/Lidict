import Navbar from "../komponen/Navbar";
import SidebarMateri from "../komponen/SidebarMateri";

export default function Materi1() {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

        <div style={{ marginLeft: "280px" }}>
        <SidebarMateri />
        <div style={{ paddingTop: "64px"}}>
      {/* PAGE CONTENT */}
      <div style={styles.page}>
        {/* HEADER MATERI */}
        <div style={styles.header}>
          <div style={styles.headerAccent}></div>
          <h1 style={styles.headerTitle}>Materi 1 – List</h1>
        </div>

        {/* TUJUAN PEMBELAJARAN */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>

          <div style={styles.card}>
            <ol style={styles.list}>
              <li>Memahami konsep List sebagai struktur data di Python.</li>
              <li>Mengetahui cara membuat dan mengakses elemen List.</li>
              <li>Menggunakan operasi dasar List dalam pemrograman Python.</li>
            </ol>
          </div>
        </section>

        {/* MATERI */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Materi List</h2>

          <div style={styles.card}>
            <p style={styles.text}>
              <strong>List</strong> adalah struktur data pada Python yang digunakan
              untuk menyimpan sekumpulan data dalam satu variabel.
              List bersifat <i>ordered</i> (berurutan) dan <i>mutable</i> (dapat diubah).
            </p>

            <h3 style={styles.subTitle}>Contoh List</h3>
            <pre style={styles.code}>
{`buah = ["apel", "jeruk", "mangga"]
print(buah[0])   # apel`}
            </pre>

            <h3 style={styles.subTitle}>Operasi Dasar List</h3>
            <ul style={styles.textList}>
              <li><code>append()</code> → menambah data</li>
              <li><code>remove()</code> → menghapus data</li>
              <li><code>len()</code> → menghitung jumlah elemen</li>
              <li>Index → mengakses data berdasarkan posisi</li>
            </ul>
          </div>
        </section>
      </div>
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
    minHeight: "calc(100vh - 64px)", // ⬅️ tinggi navbar
    fontFamily: "Poppins, sans-serif",
  },

  header: {
    backgroundColor: "#306998", // Python Blue (diseragamkan)
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
    backgroundColor: "#FFD43B", // Python Yellow
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

  list: {
    paddingLeft: "20px",
    lineHeight: "1.8",
  },

  text: {
    lineHeight: "1.8",
    color: "#333",
  },

  subTitle: {
    marginTop: "20px",
    marginBottom: "10px",
    color: "#306998",
  },

  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontSize: "14px",
    overflowX: "auto",
  },

  textList: {
    paddingLeft: "20px",
    lineHeight: "1.8",
  },
};
