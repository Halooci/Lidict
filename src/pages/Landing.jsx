import Navbar from "./komponen/Navbar";

export default function Landing() {
  return (
    <div style={styles.container}>
      <Navbar />

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          ListDictionaryLearn: Media Pembelajaran Interaktif
        </h1>

        <h1 style={styles.title}>
          List & Dictionary
        </h1>

        {/* <p style={styles.subtitle}>
          Belajar <strong>List</strong> dan <strong>Dictionary</strong> secara interaktif dan mudah.
        </p> */}

        <p style={styles.subtitle}>
          Media pembelajaran yang dibuat untuk membantu mahasiswa memahami 
        </p>

        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryBtn}
            onClick={() => window.location.href = "/List/PendahuluanList"}
          >
            Mulai Belajar
          </button>

          <button style={styles.secondaryBtn}
          onClick={() => window.location.href = "/InformasiPage"}>
            Informasi
          </button>
        </div>
      </section>

      {/* MATERI */}
      {/* <section style={styles.material}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📋 List</h2>
          <p style={styles.cardText}>
            List adalah struktur data Python yang digunakan untuk menyimpan
            kumpulan data secara berurutan dan dapat diubah (mutable).
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🗂️ Dictionary</h2>
          <p style={styles.cardText}>
            Dictionary menyimpan data dalam pasangan <i>key-value</i>,
            cocok untuk representasi data yang terstruktur dan cepat diakses.
          </p>
        </div>
      </section> */}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2026 List Dictionary</p>
      </footer>
    </div>
  );
}

/* ================== STYLE ================== */
const styles = {
  container: {
    backgroundColor: "#f5f7fa",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
  },

  hero: {
    flex: 1,
    paddingTop: "64px",
    background: "linear-gradient(135deg, #b89344, #3a86c4)",
    color: "white",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    textAlign: "center",
    paddingLeft: "20px",
    paddingRight: "20px",
  },

  title: {
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "15px",
  },

  subtitle: {
    fontSize: "18px",
    maxWidth: "600px",
    marginBottom: "30px",
    lineHeight: "1.6",
  },

  buttonGroup: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    backgroundColor: "#FFD43B",
    color: "#306998",
    padding: "12px 28px",
    border: "none",
    borderRadius: "30px",
    fontWeight: "700",
    cursor: "pointer",
  },

  secondaryBtn: {
    backgroundColor: "transparent",
    color: "white",
    padding: "12px 28px",
    border: "2px solid #FFD43B",
    borderRadius: "30px",
    fontWeight: "700",
    cursor: "pointer",
  },

  material: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    padding: "80px 40px",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    color: "#306998",
    fontSize: "22px",
    marginBottom: "12px",
  },

  cardText: {
    color: "#555",
    lineHeight: "1.6",
  },

  footer: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
    fontSize: "14px",
  },
};
