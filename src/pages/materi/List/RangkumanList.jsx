import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";


export default function RangkumanList() {
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
          <h1 style={styles.headerTitle}>RANGKUMAN MATERI LIST</h1>
        </div>

        {/* MATERI */}
            <section style={styles.section}>
              <div style={styles.card}>

                <p style={styles.text}>
                  List adalah salah satu struktur data linier di Python yang
                  digunakan untuk menyimpan sekumpulan elemen dalam satu variabel.
                  Dikatakan linier karena elemen-elemen di dalamnya disusun secara
                  berurutan dan dapat diakses menggunakan indeks. Python mengimplementasikan
                  list sebagai array dinamis. Dalam Python, list ditulis menggunakan tanda 
                  kurung siku [ ], dan setiap elemen dipisahkan dengan tanda koma. List memiliki
                  beberapa karakteristik sebagai berikut.
                </p>

  

                {/* 1. ORDERED */}
                <h3 style={styles.subTitle}>1. Ordered (Terurut)</h3>
                <p style={styles.text}>
                  Elemen di dalam list tersusun sesuai urutan saat list dibuat.
                  Urutan ini akan tetap sama kecuali dilakukan perubahan secara
                  langsung oleh pengguna.
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`buah = ["durian", "nanas", "mangga", "rambutan"]
print(buah)`}  
                </pre>

                <p style={styles.text}>
                  Penjelasan: Urutan elemen pada list adalah durian, nanas,
                  mangga, dan rambutan. Urutan ini tidak akan berubah selama
                  tidak dilakukan pengubahan pada list tersebut.
                </p>

                {/* 2. INDEXED */}
                <h3 style={styles.subTitle}>2. Indexed (Memiliki Indeks)</h3>
                <p style={styles.text}>
                  Setiap elemen pada list memiliki indeks yang digunakan untuk
                  mengakses elemen berdasarkan posisinya. Python menyediakan
                  indeks positif (+) dan indeks negatif (-). Indeks positif 
                  digunakan untuk menghitung dari awal list (dari kiri ke kanan)
                  dan dimulai dari indeks ke-0. Sedangkan indeks negatif digunakan
                  untuk menghitung dari akhir list (dari kanan ke kiri), sangat berguna
                  bila kita ingin mengambil elemen terakhir tanpa mengetahui panjang list.
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`data = ["durian", "nanas", "mangga", "rambutan"]
print(data[0])   # durian
print(data[-1])  # rambutan`}  
                </pre>

                <p style={styles.text}>
                  Penjelasan: List data memiliki empat elemen. Elemen pertama
                  dapat diakses menggunakan indeks 0, sedangkan elemen terakhir
                  dapat diakses menggunakan indeks -1.
                </p>

                {/* 3. MUTABLE */}
                <h3 style={styles.subTitle}>3. Mutable (Dapat Diubah)</h3>
                <p style={styles.text}>
                  List bersifat mutable, artinya elemen di dalam list dapat
                  diubah, ditambah, atau dihapus tanpa membuat list baru,
                  sifat ini meembuat list sangat fleksibel dalam pengolahan data.
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`buah = ["durian", "nanas", "mangga"]
buah[1] = "semangka"
print(buah)`}  
                </pre>

                <p style={styles.text}>
                  Penjelasan: Elemen dengan indeks ke-1 diubah dari nanas
                  menjadi semangka.
                </p>

                {/* 4. HETEROGENEOUS */}
                <h3 style={styles.subTitle}>
                  4. Heterogeneous (Tipe Data Campuran)
                </h3>

                <p style={styles.text}>
                  List dapat menyimpan berbagai tipe data dalam satu struktur,
                  seperti string, integer, float, dan boolean.
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`data = ["Andi", 20, 175.5, True]
print(data)`}  
                </pre>

                <p style={styles.text}>
                  Penjelasan: Dalam satu list terdapat berbagai tipe data,
                  yaitu string ("Andi"), integer (20), float (175.5),
                  dan boolean (True).
                </p>

                {/* 5. DYNAMIC SIZE */}
                <h3 style={styles.subTitle}>
                  5. Dynamic Size (Ukuran Dinamis)
                </h3>

                <p style={styles.text}>
                  List memiliki ukuran yang dinamis, artinya ukuran list dapat
                  berubah secara otomatis ketika elemen ditambahkan atau
                  dihapus.
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`angka = [1, 2, 3]
angka.append(4)
print(angka)`}  
                </pre>

                <p style={styles.text}>
                  Penjelasan: Python menyesuaikan ukuran list secara otomatis
                  saat elemen baru ditambahkan.
                </p>

                {/* 6. NESTED LIST */}
                <h3 style={styles.subTitle}>6. Nested List</h3>

                <p style={styles.text}>
                  Nested list adalah list yang berisi list lain di dalamnya.
                  Nested list digunakan untuk merepresentasikan data bertingkat
                  atau data dua dimensi, seperti tabel nilai, matriks, atau data kelompok.
                  Setiap elemen dalamn nested list dapat berupa list baru. Nested list 
                  banyak digunakan untuk membuat representasi tabel sederhana.
                </p>

                <p style={styles.text}>
                  <strong>Contoh data nilai mahasiswa:</strong>
                </p>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#306998", color: "white" }}>
                      <th style={styles.td}>Nama</th>
                      <th style={styles.td}>UTS</th>
                      <th style={styles.td}>UAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={styles.td}>Nova</td>
                      <td style={styles.td}>80</td>
                      <td style={styles.td}>90</td>
                    </tr>
                    <tr>
                      <td style={styles.td}>Cindy</td>
                      <td style={styles.td}>85</td>
                      <td style={styles.td}>88</td>
                    </tr>
                    <tr>
                      <td style={styles.td}>Sabrina</td>
                      <td style={styles.td}>78</td>
                      <td style={styles.td}>92</td>
                    </tr>
                  </tbody>
                </table>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`nilai = [
  ["Nova", 80, 90],
  ["Cindy", 85, 88],
  ["Sabrina", 78, 92]
]`}  
                </pre>

                <p style={styles.text}>
                  Penjelasan: Setiap baris tabel direpresentasikan sebagai satu
                  list, dan seluruh data disimpan dalam satu list utama.
                </p>

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
  td: {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "center"
  }
};
