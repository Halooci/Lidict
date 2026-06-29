import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { db } from "../../../config/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

export default function Pengantar() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progresBelajar, setProgresBelajar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State untuk latihan
  const [selected, setSelected] = useState([null, null]);
  const [locked, setLocked] = useState([false, false]);
  const [feedbackMsg, setFeedbackMsg] = useState(["", ""]);
  const [warning, setWarning] = useState(null);
  const [allCorrect, setAllCorrect] = useState(false);

  // Data soal
  const questions = [
    {
      text: "Apa fungsi utama dari struktur data dalam pemrograman?",
      options: [
        "Menyimpan data sementara dalam program",
        "Mengorganisir dan mengelola data secara efisien",
        "Menampilkan data ke layar",
        "Menghitung operasi matematika",
        "Mengirim data ke server"
      ],
      correct: 1
    },
    {
      text: "Manakah pernyataan yang benar tentang List dan Dictionary?",
      options: [
        "List hanya bisa menyimpan angka, Dictionary hanya bisa menyimpan string",
        "List dan Dictionary sama-sama menyimpan data secara berurutan",
        "List menyimpan data dengan indeks angka, Dictionary menyimpan dengan key unik",
        "Dictionary lebih lambat dari List dalam semua operasi",
        "List tidak dapat diubah setelah dibuat"
      ],
      correct: 2
    }
  ];

  // Cek autentikasi dan ambil progres belajar
  useEffect(() => {
    const uid = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!uid || !userEmail) {
      navigate('/loginregister');
      return;
    }
    setUserId(uid);

    const fetchProgres = async () => {
      try {
        const docRef = doc(db, "mahasiswa", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const progres = data.progres_belajar || 0;
          console.log("📊 Progres belajar:", progres);
          setProgresBelajar(progres);
        } else {
          console.log("❌ Dokumen mahasiswa tidak ditemukan");
        }
      } catch (error) {
        console.error("❌ Gagal mengambil progres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgres();
  }, [navigate]);

  // Tampilkan modal hanya jika:
  // 1. progresBelajar < 1
  // 2. semua latihan benar
  // 3. belum menampilkan modal
  useEffect(() => {
    console.log("🔍 useEffect modal - allCorrect:", allCorrect, "progresBelajar:", progresBelajar, "showModal:", showModal);
    
    if (!userId) {
      console.log("⏳ userId belum siap");
      return;
    }
    if (progresBelajar === null) {
      console.log("⏳ progresBelajar masih null");
      return;
    }
    if (progresBelajar >= 1) {
      console.log("✅ Progres sudah >= 1, tidak perlu modal");
      setShowModal(false);
      return;
    }
    if (allCorrect && !showModal) {
      console.log("🎉 SEMUA KONDISI TERPENUHI! Menampilkan modal...");
      setShowModal(true);
    } else {
      console.log("⏳ Belum semua kondisi terpenuhi");
    }
  }, [allCorrect, userId, showModal, progresBelajar]);

  const handleCompleteAndNavigate = async () => {
    console.log("🚀 handleCompleteAndNavigate dipanggil");
    try {
      if (progresBelajar < 1) {
        console.log("📝 Menambah progres...");
        const mahasiswaRef = doc(db, "mahasiswa", userId);
        await updateDoc(mahasiswaRef, {
          progres_belajar: increment(1)
        });
        const newProgres = progresBelajar + 1;
        setProgresBelajar(newProgres);
        console.log("✅ Progres berhasil ditambah! Sekarang:", newProgres);
      } else {
        console.log("ℹ️ Progres sudah >= 1, tidak perlu ditambah");
      }
      
      setShowModal(false);
      navigate("/List/PendahuluanList");
    } catch (error) {
      console.error("❌ Gagal update progres:", error);
      alert("Terjadi kesalahan saat menyimpan progres. Silakan coba lagi.");
    }
  };

  const handleSelect = (questionIdx, optionIdx) => {
    if (locked[questionIdx]) return;
    const newSelected = [...selected];
    newSelected[questionIdx] = optionIdx;
    setSelected(newSelected);
    if (allCorrect) setAllCorrect(false);
    const newFeedback = [...feedbackMsg];
    newFeedback[questionIdx] = "";
    setFeedbackMsg(newFeedback);
    setWarning(null);
    console.log("📝 Jawaban dipilih:", newSelected);
  };

  const handleCheckAll = () => {
    console.log("🔍 handleCheckAll dipanggil");
    const allAnswered = selected.every(sel => sel !== null);
    if (!allAnswered) {
      setWarning("⚠️ Semua soal harus dijawab terlebih dahulu sebelum diperiksa.");
      return;
    }
    setWarning(null);

    let newLocked = [...locked];
    let newFeedback = [...feedbackMsg];
    let allNowCorrect = true;

    for (let i = 0; i < questions.length; i++) {
      if (locked[i]) {
        newFeedback[i] = "benar";
        continue;
      }
      const isCorrect = (selected[i] === questions[i].correct);
      console.log(`📌 Soal ${i+1}: selected=${selected[i]}, correct=${questions[i].correct}, isCorrect=${isCorrect}`);
      if (isCorrect) {
        newLocked[i] = true;
        newFeedback[i] = "benar";
      } else {
        newLocked[i] = false;
        newFeedback[i] = "salah";
        allNowCorrect = false;
      }
    }
    setLocked(newLocked);
    setFeedbackMsg(newFeedback);
    setAllCorrect(allNowCorrect);
    console.log("✅ allCorrect di-set menjadi:", allNowCorrect);
  };

  // Tampilkan loading saat sedang mengambil data
  if (loading) {
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
              <div style={{ fontSize: '18px', color: '#306998' }}>Memuat data...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <h1 style={styles.headerTitle}>PENGANTAR</h1>
          </div>

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

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tes Pemahaman Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Jawab semua soal dengan memilih opsi yang benar. Klik "Cek Semua Jawaban" untuk memeriksa.
                Soal yang sudah benar akan terkunci. Soal yang salah dapat diperbaiki, lalu periksa kembali.
              </p>
              
              {questions.map((q, qIdx) => {
                const isLocked = locked[qIdx];
                const selectedIdx = selected[qIdx];
                const fb = feedbackMsg[qIdx];
                return (
                  <div key={qIdx} style={styles.questionContainer}>
                    <p style={styles.questionText}>{qIdx + 1}. {q.text}</p>
                    <div style={styles.optionsContainer}>
                      {q.options.map((opt, optIdx) => {
                        let optionStyle = { ...styles.optionLabel, cursor: "pointer" };
                        if (isLocked) {
                          optionStyle = { ...optionStyle, ...styles.optionLabelDisabled };
                          if (selectedIdx === optIdx) {
                            optionStyle = { ...optionStyle, ...styles.optionLabelCorrect };
                          }
                        } else {
                          if (selectedIdx === optIdx) {
                            optionStyle = { ...optionStyle, ...styles.optionLabelSelected };
                          }
                        }
                        return (
                          <div
                            key={optIdx}
                            onClick={() => !isLocked && handleSelect(qIdx, optIdx)}
                            style={optionStyle}
                            onMouseEnter={(e) => {
                              if (!isLocked && selectedIdx !== optIdx) {
                                e.currentTarget.style.backgroundColor = "#fef9e6";
                                e.currentTarget.style.borderColor = "#FFD43B";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isLocked && selectedIdx !== optIdx) {
                                e.currentTarget.style.backgroundColor = "#f9f9f9";
                                e.currentTarget.style.borderColor = "#ddd";
                              }
                            }}
                          >
                            <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </div>
                        );
                      })}
                    </div>
                    {fb === "benar" && (
                      <div style={styles.feedbackCorrect}>✅ Benar</div>
                    )}
                    {fb === "salah" && (
                      <div style={styles.feedbackWrong}>❌ Salah, coba pilih jawaban lain</div>
                    )}
                  </div>
                );
              })}
              {warning && <div style={styles.quizWarning}>{warning}</div>}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                <button style={styles.checkAllButton} onClick={handleCheckAll}>
                  Cek Semua Jawaban
                </button>
              </div>
              {allCorrect && (
                <div style={styles.resultBox}>🎉 Selamat! Semua jawaban sudah dijawab dengan benar.</div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modal Sukses - HANYA MUNCUL JIKA PROGRES < 1 */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>🎉</div>
            <h2 style={styles.modalTitle}>Selamat!</h2>
            <p style={styles.modalText}>
              Anda telah menyelesaikan tes pemahaman awal dengan sempurna.
              <br />
              Progres belajar Anda bertambah! Materi selanjutnya akan terbuka.
            </p>
            <button style={styles.modalButton} onClick={handleCompleteAndNavigate}>
              Lanjut ke materi selanjutnya
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modalButton:hover {
          transform: scale(1.02);
          box-shadow: 0 5px 15px rgba(49,130,206,0.3);
        }
      `}</style>
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

  text: {
    lineHeight: "1.8",
    color: "#333",
    marginBottom: "15px",
    textAlign: "justify",
  },

  subTitle: {
    marginTop: "20px",
    marginBottom: "10px",
    color: "#306998",
    fontSize: "1.2rem",
    fontWeight: "600",
  },

  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontSize: "14px",
    overflowX: "auto",
    fontFamily: "monospace",
  },

  questionContainer: {
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },

  questionText: {
    fontWeight: "600",
    marginBottom: "12px",
    textAlign: "justify",
  },

  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "12px",
  },

  optionLabel: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    transition: "all 0.2s",
    backgroundColor: "#f9f9f9",
    color: "#1f2937",
    cursor: "pointer",
  },

  optionLabelSelected: {
    backgroundColor: "#306998",
    color: "white",
    borderColor: "#306998",
  },

  optionLabelCorrect: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
    color: "#155724",
  },

  optionLabelDisabled: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
    cursor: "not-allowed",
    opacity: 0.7,
  },

  feedbackCorrect: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    borderRadius: "6px",
    fontWeight: "500",
  },

  feedbackWrong: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#f8d7da",
    color: "#842029",
    borderRadius: "6px",
    fontWeight: "500",
  },

  quizWarning: {
    marginTop: "15px",
    marginBottom: "10px",
    padding: "12px",
    backgroundColor: "#fff3cd",
    color: "#856404",
    borderRadius: "8px",
    textAlign: "center",
  },

  checkAllButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
  },

  resultBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#d1e7dd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#0f5132",
    fontWeight: "bold",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },

  modal: {
    background: "white",
    borderRadius: "32px",
    padding: "32px",
    maxWidth: "450px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
    animation: "fadeInUp 0.3s ease",
  },

  modalIcon: { fontSize: "64px", marginBottom: "16px" },

  modalTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e3a5f",
    marginBottom: "12px",
  },

  modalText: {
    fontSize: "16px",
    color: "#334155",
    lineHeight: "1.5",
    marginBottom: "24px",
    textAlign: "justify",
  },

  modalButton: {
    background: "linear-gradient(135deg, #3182ce, #2c5282)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};