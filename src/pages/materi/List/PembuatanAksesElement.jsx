import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function PembuatanAksesElement() {
  return (
    <>
      <Navbar />

      <div style={{ marginLeft: "280px" }}>
        <SidebarMateri />
        <div style={{ paddingTop: "64px" }}>
          <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>
                PEMBUATAN DAN AKSES ELEMEN LIST
              </h1>
            </div>

            {/* TUJUAN PEMBELAJARAN */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
              <div style={styles.card}>
                <ol style={styles.list}>
                  <li>Menjelaskan cara membuat list dalam Python.</li>
                  <li>Menjelaskan cara mengakses elemen list menggunakan indeks.</li>
                  <li>Menjelaskan penggunaan indeks positif dan indeks negatif.</li>
                  <li>Menjelaskan konsep slicing pada list.</li>
                  <li>Menjelaskan konsep nested list dan cara mengakses elemennya.</li>
                </ol>
              </div>
            </section>

            {/* MATERI */}
            <section style={styles.section}>
              <div style={styles.card}>

                <p style={styles.text}>
                  Pembuatan list dalam Python dilakukan dengan menggunakan tanda
                  kurung siku <strong>[ ]</strong>. Setiap elemen di dalam list
                  dipisahkan menggunakan tanda koma. Elemen list dapat berupa
                  string, integer, float, maupun tipe data lainnya.
                </p>

                <pre style={styles.code}>
{`buah = ["apel", "jeruk", "mangga"]
print(buah)`}  
                </pre>

                <p style={styles.text}>
                  Contoh di atas menunjukkan proses pembuatan sebuah list bernama
                  <code> buah </code> yang berisi tiga elemen bertipe string.
                  Ketika program dijalankan, seluruh isi list akan ditampilkan.
                </p>

                {/* AKSES ELEMEN */}
                <h3 style={styles.subTitle}>Akses Elemen List</h3>

                <p style={styles.text}>
                  Setiap elemen dalam list memiliki indeks yang digunakan untuk
                  mengakses elemen tersebut. Python menggunakan indeks yang
                  dimulai dari angka 0 untuk elemen pertama.
                </p>

                <pre style={styles.code}>
{`buah = ["apel", "jeruk", "mangga"]
print(buah[0])
print(buah[1])`}  
                </pre>

                <p style={styles.text}>
                  Pada contoh di atas, elemen "apel" berada pada indeks ke-0,
                  sedangkan elemen "jeruk" berada pada indeks ke-1.
                </p>

                {/* INDEKS NEGATIF */}
                <h3 style={styles.subTitle}>Indeks Negatif</h3>

                <p style={styles.text}>
                  Selain indeks positif, Python juga menyediakan indeks negatif
                  untuk mengakses elemen list dari belakang. Indeks -1 digunakan
                  untuk mengakses elemen terakhir.
                </p>

                <pre style={styles.code}>
{`buah = ["apel", "jeruk", "mangga"]
print(buah[-1])
print(buah[-2])`}  
                </pre>

                <p style={styles.text}>
                  Elemen terakhir pada list dapat diakses menggunakan indeks -1,
                  sedangkan elemen sebelumnya menggunakan indeks -2.
                </p>

                {/* SLICING */}
                <h3 style={styles.subTitle}>Slicing List</h3>

                <p style={styles.text}>
                  Slicing digunakan untuk mengambil sebagian elemen dari list.
                  Slicing dituliskan dengan format <code>list[awal:akhir]</code>.
                </p>

                <pre style={styles.code}>
{`angka = [1, 2, 3, 4, 5]
print(angka[1:4])`}  
                </pre>

                <p style={styles.text}>
                  Kode tersebut akan mengambil elemen dari indeks ke-1 sampai
                  sebelum indeks ke-4, sehingga menghasilkan list baru.
                </p>

                {/* NESTED LIST */}
                <h3 style={styles.subTitle}>Nested List</h3>

                <p style={styles.text}>
                  Nested list adalah list yang berisi list lain di dalamnya.
                  Struktur ini sering digunakan untuk merepresentasikan data
                  bertingkat atau data berbentuk tabel.
                </p>

                <pre style={styles.code}>
{`nilai = [
  ["Ani", 80],
  ["Budi", 85],
  ["Citra", 90]
]`}  
                </pre>

                <p style={styles.text}>
                  Pada contoh di atas, setiap elemen dalam list utama merupakan
                  list yang berisi nama dan nilai mahasiswa.
                </p>

                {/* AKSES NESTED LIST */}
                <h3 style={styles.subTitle}>Akses Elemen Nested List</h3>

                <p style={styles.text}>
                  Elemen pada nested list dapat diakses menggunakan dua indeks.
                  Indeks pertama digunakan untuk memilih baris, sedangkan indeks
                  kedua digunakan untuk memilih kolom.
                </p>

                <pre style={styles.code}>
{`print(nilai[0][0])
print(nilai[1][1])`}  
                </pre>

                <p style={styles.text}>
                  Kode di atas akan menampilkan nama mahasiswa pertama dan nilai
                  mahasiswa kedua dari nested list.
                </p>

              </div>
            </section>

            {/* ================= LATIHAN PRAKTIK ================= */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Latihan Praktik
              </h2>

              <div style={styles.card}>

                <p style={styles.text}>
                  <strong>Instruksi Pengerjaan:</strong>
                </p>

                <ol style={styles.list}>
                  <li>Buatlah list bernama <b>data</b> berisi angka 10, 20, 30, 40, 50.</li>
                  <li>Tampilkan elemen pertama menggunakan indeks positif.</li>
                  <li>Tampilkan elemen terakhir menggunakan indeks negatif.</li>
                  <li>Gunakan slicing untuk menampilkan elemen ke-2 sampai ke-4.</li>
                  <li>Buat nested list berisi nama dan nilai 2 mahasiswa.</li>
                  <li>Tampilkan nama mahasiswa pertama dari nested list tersebut.</li>
                </ol>

                <p style={styles.text}>
                  Ketikkan kode Python Anda pada editor berikut, lalu klik tombol
                  <b> Run </b> untuk melihat hasilnya.
                </p>

                <div style={{ marginTop: "20px" }}>
                  <iframe
                    src="https://trinket.io/embed/python3"
                    width="100%"
                    height="500"
                    frameBorder="0"
                    allowFullScreen
                    title="Latihan Pembuatan dan Akses Elemen"
                  ></iframe>
                </div>

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
    paddingTop: "40px",
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
  text: { lineHeight: "1.8", color: "#333" },
  subTitle: { marginTop: "22px", color: "#306998" },
  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontSize: "14px",
    overflowX: "auto",
  },
};
