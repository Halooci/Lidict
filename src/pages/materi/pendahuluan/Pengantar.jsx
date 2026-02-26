import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function Pengantar() {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <div style={{ marginLeft: "280px" }}>
        <SidebarMateri />
        <div style={{ paddingTop: "64px" }}>
          {/* PAGE CONTENT */}
          <div style={styles.page}>
            {/* HEADER MATERI */}
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>PENGANTAR</h1>
            </div>

            {/* MATERI */}
            <section style={styles.section}>
              <div style={styles.card}>
                <p style={styles.text}>
                  Mata kuliah <strong>Struktur Data</strong> merupakan lanjutan
                  dari mata kuliah Pemrograman Dasar yang telah dipelajari
                  sebelumnya. Pada tahap awal pembelajaran, mahasiswa telah
                  mengenal konsep-konsep fundamental seperti penggunaan variabel,
                  tipe data dasar (integer, float, string), operator,
                  percabangan, perulangan, serta cara menuliskan fungsi dalam
                  bahasa Python.
                </p>

                <p style={styles.text}>
                  Keterampilan dasar tersebut menjadi fondasi penting sebelum
                  mempelajari struktur data tingkat lanjut, karena setiap
                  operasi pada struktur data pada dasarnya dibangun dari logika
                  pemrograman dasar yang telah dikuasai sebelumnya.
                </p>

                <p style={styles.text}>
                  Dalam media ini, mahasiswa akan mempelajari dua struktur data
                  penting, yaitu <strong>List</strong> dan{" "}
                  <strong>Dictionary</strong>, yang merupakan bagian inti dari
                  pengelolaan data dalam Python. Berbeda dengan tipe data dasar
                  yang hanya menyimpan satu nilai, List dan Dictionary
                  memungkinkan penyimpanan dan pengelolaan banyak data secara
                  terorganisir.
                </p>

                <p style={styles.text}>
                  Pemahaman mengenai cara membuat, mengakses, memperbarui, serta
                  memanipulasi elemen dalam List dan Dictionary sangat
                  bergantung pada kemampuan dasar seperti penggunaan indeks,
                  iterasi dengan perulangan, pemanggilan fungsi, serta logika
                  seleksi yang telah diajarkan dalam mata kuliah prasyarat.
                </p>

                <p style={styles.text}>
                  Oleh karena itu, media ini dirancang tidak hanya untuk
                  memperkenalkan konsep List dan Dictionary, tetapi juga sebagai
                  sarana penyegaran kembali terhadap logika dan keterampilan
                  dasar pemrograman. Mahasiswa akan dibimbing secara bertahap
                  melalui penjelasan konsep, contoh kode, visualisasi, serta
                  latihan interaktif agar mampu menghubungkan materi
                  pemrograman dasar dengan implementasi struktur data tingkat
                  lanjut.
                </p>

                <p style={styles.text}>
                  Dengan pendekatan tersebut, diharapkan mahasiswa dapat
                  memahami materi secara lebih menyeluruh dan siap
                  menggunakannya pada pemrograman yang lebih kompleks.
                </p>

                <h3 style={styles.subTitle}>Contoh List</h3>
                <pre style={styles.code}>
{`buah = ["apel", "jeruk", "mangga"]
print(buah[0])   # apel`}
                </pre>
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
