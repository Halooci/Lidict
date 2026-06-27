import { useState, useEffect } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';

export default function RangkumanList() {
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
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>RANGKUMAN LIST</h1>
          </div>

          <section style={styles.section}>
            <div style={styles.card}>
              <p style={styles.text}>
                <strong>List</strong> adalah struktur data dalam Python yang dapat menyimpan <strong>tipe data campuran</strong> (integer, string, boolean, float, bahkan list lain). 
                Elemen dalam list diakses menggunakan <strong>indeks</strong> (positif dari kiri, negatif dari kanan). 
                List bersifat sangat fleksibel karena ukurannya dapat berubah secara dinamis (dapat ditambah, dihapus, atau diubah setelah list dibuat).
              </p>

              {/* ========== 1. KARAKTERISTIK LIST ========== */}
              <h3 style={styles.subTitle}>1. Karakteristik List</h3>
              <ul style={styles.list}>
                <li><strong>Ordered (Terurut):</strong> Urutan elemen sesuai dengan urutan saat list dibuat. List akan mempertahankan urutan penyisipan elemen.</li>
                <li><strong>Indexed (Memiliki Indeks):</strong> Setiap elemen memiliki posisi yang disebut indeks. Indeks positif dimulai dari 0 (elemen pertama) dan seterusnya. Indeks negatif dimulai dari -1 (elemen terakhir) dan mundur ke kiri.</li>
                <li><strong>Mutable (Dapat Diubah):</strong> Elemen dalam list dapat ditambahkan, dihapus, atau diubah nilainya setelah list dibuat. List tidak bersifat tetap (immutable) seperti tuple.</li>
                <li><strong>Heterogeneous (Tipe Campuran):</strong> Satu list dapat berisi berbagai tipe data sekaligus, misalnya angka, teks, nilai boolean, bilangan desimal, bahkan list lain di dalamnya (nested list).</li>
                <li><strong>Dynamic Size (Ukuran Dinamis):</strong> Ukuran list otomatis bertambah atau berkurang saat kita menambah atau menghapus elemen. Tidak perlu menentukan kapasitas awal seperti pada array di bahasa pemrograman lain.</li>
              </ul>

              {/* ========== 2. MEMBUAT LIST ========== */}
              <h3 style={styles.subTitle}>2. Membuat List</h3>
              <p style={styles.text}>
                List dibuat dengan menggunakan tanda kurung siku <code>[]</code>. Elemen-elemen di dalam list dipisahkan dengan tanda koma. 
                Kita dapat membuat list kosong (tanpa elemen), list dengan satu jenis tipe data, atau list dengan campuran berbagai tipe data. 
                List juga dapat dibuat dari hasil operasi lain atau menggunakan fungsi bawaan <code>list()</code>.
              </p>

              {/* ========== 3. AKSES ELEMEN LIST ========== */}
              <h3 style={styles.subTitle}>3. Akses Elemen List</h3>
              <p style={styles.text}>
                <strong>Indeks positif:</strong> dimulai dari 0 untuk elemen pertama, 1 untuk elemen kedua, dan seterusnya hingga (n-1) untuk elemen terakhir.<br />
                <strong>Indeks negatif:</strong> dimulai dari -1 untuk elemen terakhir, -2 untuk elemen sebelum terakhir, dan seterusnya hingga -n untuk elemen pertama.<br />
                <strong>Slicing (pengiris):</strong> digunakan untuk mengambil sebagian elemen dari list dengan format <code>list[awal:akhir]</code>. 
                Elemen dari indeks <code>awal</code> hingga sebelum indeks <code>akhir</code> akan diambil. Jika <code>awal</code> dikosongkan, berarti dimulai dari indeks 0. 
                Jika <code>akhir</code> dikosongkan, berarti sampai akhir list. Slicing juga dapat menggunakan langkah (step) dengan format <code>list[awal:akhir:langkah]</code>.
              </p>

              {/* ========== 4. OPERASI DASAR LIST ========== */}
              <h3 style={styles.subTitle}>4. Operasi Dasar List</h3>
              <ul style={styles.list}>
                <li><strong>Concatenation (+):</strong> Menggabungkan dua list menjadi list baru yang berisi semua elemen dari list pertama diikuti semua elemen dari list kedua.</li>
                <li><strong>Repetition (*):</strong> Mengulang isi list sebanyak n kali, menghasilkan list baru yang lebih panjang.</li>
                <li><strong>Keanggotaan (in):</strong> Operator untuk mengecek apakah suatu nilai terdapat di dalam list. Hasilnya adalah <code>True</code> jika ada, <code>False</code> jika tidak.</li>
                <li><strong>Panjang (len):</strong> Fungsi bawaan <code>len()</code> digunakan untuk menghitung jumlah elemen yang ada di dalam list.</li>
              </ul>

              {/* ========== 5. MANIPULASI LIST ========== */}
              <h3 style={styles.subTitle}>5. Manipulasi List (Menambah, Mengubah, Menghapus)</h3>
              
              <h4 style={styles.subSubTitle}>a. Menambah Elemen</h4>
              <ul style={styles.list}>
                <li><code>append(x)</code> – Menambahkan elemen <code>x</code> di akhir list. Hanya satu elemen setiap pemanggilan.</li>
                <li><code>insert(i, x)</code> – Menyisipkan elemen <code>x</code> pada posisi indeks <code>i</code>. Elemen yang semula berada di indeks <code>i</code> dan seterusnya akan bergeser ke kanan.</li>
                <li><code>extend(iterable)</code> – Menambahkan semua elemen dari suatu iterable (misalnya list lain, tuple, atau string) ke akhir list. Berbeda dengan <code>append</code> yang menambahkan satu objek utuh.</li>
              </ul>

              <h4 style={styles.subSubTitle}>b. Menghapus Elemen</h4>
              <ul style={styles.list}>
                <li><code>remove(x)</code> – Menghapus elemen pertama yang bernilai <code>x</code> dari list. Jika nilai <code>x</code> tidak ditemukan, akan memunculkan error <code>ValueError</code>.</li>
                <li><code>pop(i)</code> – Menghapus elemen pada indeks <code>i</code> dan mengembalikan nilai elemen tersebut. Jika <code>i</code> tidak diberikan, maka akan menghapus dan mengembalikan elemen terakhir.</li>
                <li><code>clear()</code> – Menghapus semua elemen dalam list, sehingga list menjadi kosong (ukuran 0).</li>
                <li><code>del list[i]</code> atau <code>del list[i:j]</code> – Pernyataan <code>del</code> dapat digunakan untuk menghapus elemen berdasarkan indeks tertentu atau menghapus irisan (slice) tertentu dari list.</li>
              </ul>

              <h4 style={styles.subSubTitle}>c. Mengubah Elemen</h4>
              <p style={styles.text}>
                Untuk mengubah nilai elemen pada posisi tertentu, kita dapat langsung menugaskan (assign) nilai baru ke indeks yang dituju, dengan format <code>list[indeks] = nilai_baru</code>. 
                Indeks harus berada dalam jangkauan list, jika tidak akan terjadi error <code>IndexError</code>.
              </p>

              <h4 style={styles.subSubTitle}>d. Pengurutan & Pembalikan</h4>
              <ul style={styles.list}>
                <li><code>sort()</code> – Mengurutkan elemen list secara permanen (in-place) dalam urutan menaik (ascending) dari nilai terkecil ke terbesar. Untuk urutan menurun, dapat menggunakan parameter <code>reverse=True</code>.</li>
                <li><code>reverse()</code> – Membalik urutan elemen list secara permanen (in-place). Elemen pertama menjadi terakhir, dan sebaliknya.</li>
              </ul>

              <h4 style={styles.subSubTitle}>e. Method Informasi Lainnya</h4>
              <ul style={styles.list}>
                <li>
                  <strong><code>count(x)</code> – jumlah kemunculan x</strong><br />
                  Method ini menghitung berapa kali nilai <code>x</code> muncul di dalam list. Hasilnya adalah bilangan bulat. Jika <code>x</code> tidak ditemukan, hasilnya adalah 0.
                </li>
                <li>
                  <strong><code>index(x)</code> – indeks pertama x</strong><br />
                  Method ini mencari kemunculan <strong>pertama</strong> dari nilai <code>x</code> dalam list, lalu mengembalikan posisi indeksnya (dimulai dari 0). Jika <code>x</code> tidak ada dalam list, akan memunculkan error <code>ValueError</code>.
                </li>
              </ul>
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
  subTitle: { marginTop: "28px", marginBottom: "10px", color: "#306998", fontSize: "1.4rem", fontWeight: "600" },
  subSubTitle: { marginTop: "20px", marginBottom: "8px", color: "#2c5282", fontSize: "1.2rem", fontWeight: "600" },
};