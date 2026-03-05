import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function OperasiManipulasiList() {
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
              <h1 style={styles.headerTitle}>OPERASI DAN MANIPULASI LIST</h1>
            </div>

            {/* TUJUAN PEMBELAJARAN */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
              <div style={styles.card}>
                <ol style={styles.list}>
                  <li>
                    Mengoperasikan list menggunakan teknik penjumlahan,
                    pengulangan, pencarian, dan pengurutan.
                  </li>
                  <li>
                    Melakukan manipulasi list seperti menambah, menghapus,
                    mengubah, dan menggabungkan elemen sesuai kebutuhan.
                  </li>
                  <li>
                    Menerapkan operasi dasar pada nested list, baik untuk
                    mengakses, memodifikasi, atau menggabungkan data.
                  </li>
                </ol>
              </div>
            </section>

            {/* MATERI */}
            <section style={styles.section}>
              <div style={styles.card}>

                <p style={styles.text}>
                  Operasi dasar pada list meliputi penjumlahan (concatenation),
                  pengulangan, pencarian nilai, serta pengurutan. Operasi-operasi
                  ini sangat penting untuk mengolah data yang bersifat dinamis
                  dan dapat berubah-ubah.
                </p>

                {/* CONCATENATION */}
                <h3 style={styles.subTitle}>
                  Operasi Penjumlahan (Concatenation)
                </h3>

                <p style={styles.text}>
                  Concatenation digunakan untuk menggabungkan dua atau lebih
                  list menjadi satu list baru dengan menggunakan operator tanda
                  tambah (+).
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`a = [1, 2, 3]
b = [4, 5, 6]
c = a + b
print(c)`}  
                </pre>

                <p style={styles.text}>
                  <strong>Output:</strong>
                </p>

                <pre style={styles.code}>
{`[1, 2, 3, 4, 5, 6]`}  
                </pre>

                <p style={styles.text}>
                  Dengan menggunakan tanda tambah (+), list a dan b dapat
                  digabungkan menjadi satu list baru.
                </p>

                {/* REPETITION */}
                <h3 style={styles.subTitle}>
                  Operasi Perulangan (Repetition)
                </h3>

                <p style={styles.text}>
                  Repetition digunakan untuk menggandakan atau mengulang elemen
                  dalam suatu list menggunakan operator tanda bintang (*).
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`data = [1, 2, 3]
print(data * 3)`}  
                </pre>

                <p style={styles.text}>
                  <strong>Output:</strong>
                </p>

                <pre style={styles.code}>
{`[1, 2, 3, 1, 2, 3, 1, 2, 3]`}  
                </pre>

                <p style={styles.text}>
                  Dengan tanda bintang (*), elemen list akan diulang sebanyak
                  jumlah yang ditentukan.
                </p>

                {/* SEARCH */}
                <h3 style={styles.subTitle}>Operasi Pencarian</h3>

                <p style={styles.text}>
                  Operasi pencarian digunakan untuk memeriksa apakah suatu nilai
                  terdapat di dalam list atau tidak menggunakan operator <code>in</code>.
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`buah = ["apel", "jeruk", "mangga"]
print("mangga" in buah)
print("pisang" in buah)`}  
                </pre>

                <p style={styles.text}>
                  <strong>Output:</strong>
                </p>

                <pre style={styles.code}>
{`True
False`}  
                </pre>

                <p style={styles.text}>
                  Nilai "mangga" ditemukan dalam list sehingga menghasilkan True,
                  sedangkan "pisang" tidak ditemukan sehingga menghasilkan False.
                </p>

                {/* SORTING */}
                <h3 style={styles.subTitle}>
                  Operasi Pengurutan (Sorting)
                </h3>

                <p style={styles.text}>
                  Sorting digunakan untuk mengurutkan elemen list dari nilai
                  terkecil ke nilai terbesar menggunakan perintah <code>sort()</code>.
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`angka = [5, 3, 8, 1, 7, 2]
angka.sort()
print(angka)`}  
                </pre>

                <p style={styles.text}>
                  <strong>Output:</strong>
                </p>

                <pre style={styles.code}>
{`[1, 2, 3, 5, 7, 8]`}  
                </pre>

                <p style={styles.text}>
                  List yang sebelumnya tidak terurut menjadi terurut setelah
                  menggunakan perintah sort().
                </p>

                {/* MANIPULASI */}
                <h3 style={styles.subTitle}>Menambahkan Elemen</h3>

                <p style={styles.text}>
                  Penambahan elemen ke dalam list dapat dilakukan dengan beberapa
                  cara, salah satunya menggunakan perintah append().
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`buah = ["durian", "nanas", "mangga", "rambutan"]
buah.append("alpukat")
print(buah)`}  
                </pre>

                <p style={styles.text}>
                  Dengan append(), elemen baru akan ditambahkan pada indeks
                  terakhir list.
                </p>

                <h3 style={styles.subTitle}>Menambahkan pada Posisi Tertentu</h3>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`buah = ["durian", "nanas", "mangga", "rambutan"]
buah.insert(1, "alpukat")
print(buah)`}  
                </pre>

                <p style={styles.text}>
                  Dengan insert(), elemen baru ditambahkan pada indeks yang
                  ditentukan.
                </p>

                <h3 style={styles.subTitle}>Menambahkan Banyak Elemen</h3>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`buah = ["durian", "nanas", "mangga", "rambutan"]
buah.extend(["salak", "jeruk", "manggis"])
print(buah)`}  
                </pre>

                <p style={styles.text}>
                  Dengan extend(), banyak elemen dapat ditambahkan sekaligus ke
                  dalam list.
                </p>

                {/* REMOVE */}
                <h3 style={styles.subTitle}>
                  Menghapus dan Mengganti Elemen
                </h3>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`buah.remove("jeruk")
print(buah)`}  
                </pre>

                <p style={styles.text}>
                  Elemen "jeruk" dihapus dari list menggunakan perintah remove().
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`buah.pop(2)
print(buah)`}  
                </pre>

                <p style={styles.text}>
                  Elemen pada indeks ke-2 dihapus menggunakan perintah pop().
                </p>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`buah[3] = "belimbing"
print(buah)`}  
                </pre>

                <p style={styles.text}>
                  Elemen pada indeks tertentu dapat diubah dengan mengganti nilai
                  lama dengan nilai baru.
                </p>

                {/* LENGTH */}
                <h3 style={styles.subTitle}>Memeriksa Panjang List</h3>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`print(len(buah))`}  
                </pre>

                <p style={styles.text}>
                  Perintah len() digunakan untuk mengetahui jumlah elemen di
                  dalam list.
                </p>

                {/* NESTED */}
                <h3 style={styles.subTitle}>
                  Operasi pada Nested List
                </h3>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>

                <pre style={styles.code}>
{`data = [["Nitta", 80], ["Lita", 85]]
data[1][1] = 90
print(data)`}  
                </pre>

                <p style={styles.text}>
                  Elemen pada nested list dapat diubah menggunakan dua indeks,
                  yaitu indeks baris dan kolom.
                </p>

                <h3 style={styles.subTitle}>Menambah Baris Baru</h3>

                <p style={styles.text}>
                  <strong>Contoh kode program:</strong>
                </p>
                
                <pre style={styles.code}>
{`data.append(["Citra", 78])
print(data)`}  
                </pre>

                <p style={styles.text}>
                  Baris baru dapat ditambahkan ke dalam nested list menggunakan
                  perintah append().
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
