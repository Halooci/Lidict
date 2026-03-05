import { useState } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function PendahuluanList() {

  /* ================= QUIZ 5 SOAL ================= */
  const quizQuestions = [
    {
      question: "Yang termasuk karakteristik list dalam Python adalah…",
      options: [
        "Tidak terurut, tidak dapat diubah, dan homogen",
        "Terurut, dapat diubah, dan dapat menyimpan tipe campuran",
        "Tidak memiliki indeks, tetapi ukurannya dinamis",
        "Hanya dapat menyimpan angka dan string"
      ],
      answer: 1
    },
    {
      question: "Indeks -1 pada sebuah list digunakan untuk mengakses…",
      options: [
        "Elemen pertama",
        "Elemen kedua",
        "Elemen terakhir",
        "Elemen acak"
      ],
      answer: 2
    },
    {
      question: "List bersifat heterogen karena dapat menyimpan berbagai tipe data dalam satu wadah.",
      options: ["Benar", "Salah"],
      answer: 0
    },
    {
      question:
        "Jika terdapat nested list berikut:\n\ndata = [[\"Nova\", 20], [\"Sabrina\", 21]]\n\nElemen pada baris ke-2 kolom ke-2 adalah…",
      options: ["\"Nova\"", "20", "\"Sabrina\"", "21"],
      answer: 3
    },
    {
      question:
        "Nested list cocok digunakan untuk merepresentasikan…",
      options: [
        "Nilai tunggal",
        "Array satu dimensi",
        "Data dua dimensi seperti tabel atau matriks",
        "Semua operasi matematika"
      ],
      answer: 2
    }
  ];

  const [quizCurrent, setQuizCurrent] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);

  const checkQuizAnswer = () => {
    if (quizSelected === null) return;

    if (quizSelected === quizQuestions[quizCurrent].answer) {
      setQuizFeedback("benar");
    } else {
      setQuizFeedback("salah");
    }
  };

  const nextQuiz = () => {
    if (quizCurrent < quizQuestions.length - 1) {
      setQuizCurrent(quizCurrent + 1);
      setQuizSelected(null);
      setQuizFeedback(null);
    }
  };

  const prevQuiz = () => {
    if (quizCurrent > 0) {
      setQuizCurrent(quizCurrent - 1);
      setQuizSelected(null);
      setQuizFeedback(null);
    }
  };

  /* ================= EKSPLORASI ================= */
const [showEksplorasiJawaban, setShowEksplorasiJawaban] = useState(false);


  return (
    <>
      <Navbar />

      <div style={{ marginLeft: "280px" }}>
        
        <SidebarMateri />
        <div style={{ paddingTop: "64px" }}>
          <div style={styles.page}>

            {/* ================= HEADER ================= */}
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}> PENDAHULUAN LIST </h1>
            </div>

            {/* ================= TUJUAN ================= */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
              <div style={styles.card}>
                <ol style={styles.list}>
                  <li>Menjelaskan konsep dasar struktur data list dalam Python.</li>
                  <li>Mengidentifikasi karakteristik list.</li>
                  <li>Memahami penggunaan list dalam pengolahan data.</li>
                </ol>
              </div>
            </section>

            {/* ================= EKSPLORASI ================= */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>
                🔍 Eksplorasi
              </h2>


              <div style={styles.card}>
                <p style={styles.text}>
                  Pernahkah kamu menyimpan beberapa data dalam satu variabel?
                  Misalnya menyimpan daftar nama teman, daftar nilai, atau daftar barang?
                </p>

                <p style={styles.text}>
                  Perhatikan contoh berikut:
                </p>

                <pre style={styles.code}>
            {`nama1 = "Andi"
            nama2 = "Budi"
            nama3 = "Citra"`}
                </pre>

                <p style={styles.text}>
                  Jika jumlah data semakin banyak, apakah cara tersebut masih efisien?
                </p>

                <button
                  style={styles.primaryButton}
                  onClick={() => setShowEksplorasiJawaban(!showEksplorasiJawaban)}
                >
                  Lihat Refleksi
                </button>

                {showEksplorasiJawaban && (
                  <div style={styles.quizSuccess}>
                    Ketika data semakin banyak, penggunaan variabel terpisah menjadi
                    tidak efisien dan sulit dikelola. Oleh karena itu, diperlukan
                    struktur data seperti <strong>List</strong> yang dapat menyimpan
                    banyak data dalam satu wadah secara terorganisir.
                  </div>
                )}

              </div>
            </section>


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

            {/* ================= LATIHAN PRAKTIK ================= */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Latihan Praktik</h2>
              <div style={styles.card}>

                <p style={styles.text}><strong>Output:</strong></p>

                <pre style={styles.code}>
{`apel
mangga
['apel', 'pisang', 'mangga', 'anggur']`}
                </pre>

                <p style={styles.text}><strong>Instruksi:</strong></p>

                <ol style={styles.list}>
                  <li>Buat list bernama buah berisi "apel", "jeruk", "mangga".</li>
                  <li>Tampilkan elemen pertama.</li>
                  <li>Ubah elemen kedua menjadi "pisang".</li>
                  <li>Tambahkan "anggur".</li>
                  <li>Tampilkan seluruh isi list.</li>
                </ol>

                <iframe
                  src="https://trinket.io/embed/python3"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  allowFullScreen
                  title="Latihan List"
                ></iframe>

              </div>
            </section>

            {/* ================= 5 SOAL ================= */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Latihan Pemahaman</h2>

              <div style={styles.quizBox}>

                <div style={styles.quizHeader}>
                  Soal {quizCurrent + 1} dari {quizQuestions.length}
                </div>

                <div style={styles.quizContent}>
                  <p style={styles.quizQuestion}>
                    {quizQuestions[quizCurrent].question}
                  </p>

                  {quizQuestions[quizCurrent].options.map((opt, index) => (
                    <div
                      key={index}
                      onClick={() => setQuizSelected(index)}
                      style={{
                        ...styles.quizOption,
                        backgroundColor:
                          quizSelected === index ? "#2fa69a" : "#ffffff",
                        color:
                          quizSelected === index ? "white" : "#1f2937"
                      }}
                    >
                      {String.fromCharCode(65 + index)}. {opt}
                    </div>
                  ))}

                  {quizFeedback === "salah" && (
                    <div style={styles.quizError}>
                      Salah! Coba periksa kembali jawaban Anda.
                    </div>
                  )}

                  {quizFeedback === "benar" && (
                    <div style={styles.quizSuccess}>
                      Benar! Jawaban Anda tepat.
                    </div>
                  )}
                </div>

                <div style={styles.quizFooter}>
                  <button
                    style={styles.secondaryButton}
                    onClick={prevQuiz}
                    disabled={quizCurrent === 0}
                  >
                    Sebelumnya
                  </button>

                  <button
                    style={styles.primaryButton}
                    onClick={checkQuizAnswer}
                  >
                    Periksa Jawaban
                  </button>

                  <button
                    style={styles.secondaryButton}
                    onClick={nextQuiz}
                    disabled={quizCurrent === quizQuestions.length - 1}
                  >
                    Selanjutnya
                  </button>
                </div>

              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    padding: "30px 40px",
    paddingTop: "40px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif"
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
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "15px",
    borderLeft: "5px solid #306998",
    paddingLeft: "12px"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
  },
  list: { paddingLeft: "20px", lineHeight: "1.8" },
  text: { lineHeight: "1.8", color: "#333" },
  subTitle: { marginTop: "22px", color: "#306998" },
  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px"
  },
  quizBox: {
    border: "2px solid #2fa69a",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff"
  },
  quizHeader: {
    backgroundColor: "#cfd8e6",
    padding: "15px",
    fontWeight: "600"
  },
  quizContent: { padding: "20px" },
  quizQuestion: { marginBottom: "20px", whiteSpace: "pre-line" },
  quizOption: {
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #2fa69a",
    cursor: "pointer"
  },
  quizError: {
    marginTop: "15px",
    backgroundColor: "#f8d7da",
    color: "#842029",
    padding: "12px",
    borderRadius: "8px"
  },
  quizSuccess: {
    marginTop: "15px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    padding: "12px",
    borderRadius: "8px"
  },
  quizFooter: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px"
  },
  primaryButton: {
    backgroundColor: "#1e63d5",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  secondaryButton: {
    backgroundColor: "#9ca3af",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  td: {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "center"
  }
};
