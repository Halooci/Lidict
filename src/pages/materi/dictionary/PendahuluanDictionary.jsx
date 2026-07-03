import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { db } from "../../../config/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import MateriPagination from "../../komponen/MateriPagination"; // <-- import

// ===================== KOMPONEN VISUALISASI DICTIONARY =====================
const DictionaryVisualization = ({ data, title }) => {
  return (
    <div style={visStyles.container}>
      <div style={visStyles.title}>{title}</div>
      <div style={visStyles.dictContainer}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={visStyles.card}>
            <div style={visStyles.key}>{key}</div>
            <div style={visStyles.arrow}>→</div>
            <div style={visStyles.value}>{typeof value === 'string' ? value : JSON.stringify(value)}</div>
          </div>
        ))}
      </div>
      <div style={visStyles.info}>
        📌 Setiap <strong>key</strong> bersifat unik dan digunakan untuk mengakses <strong>value</strong> yang sesuai.
      </div>
    </div>
  );
};

const visStyles = {
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "15px",
    margin: "15px 0",
    border: "1px solid #dee2e6",
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#306998",
    textAlign: "center",
  },
  dictContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    padding: "10px 20px",
    borderRadius: "10px",
    backgroundColor: "#306998",
    color: "white",
    fontWeight: "500",
  },
  key: { fontWeight: "bold", fontSize: "14px" },
  arrow: { fontSize: "18px", margin: "0 15px" },
  value: { fontSize: "14px" },
  info: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "13px",
    color: "#555",
    backgroundColor: "#e9ecef",
    padding: "8px",
    borderRadius: "8px",
  },
};

// ===================== KOMPONEN SOAL PILIHAN GANDA (UNTUK EKSPLORASI) =====================
const EksplorasiQuestion = ({ question, options, correctIndex, onAnswer, reset }) => {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (reset) {
      setSelected(null);
      setFeedback("");
      setIsAnswered(false);
    }
  }, [reset]);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelected(idx);
    const isCorrect = (idx === correctIndex);
    setFeedback(isCorrect ? "✅ Benar!" : "❌ Salah. Coba lagi!");
    setIsAnswered(true);
    if (onAnswer) onAnswer(isCorrect);
  };

  return (
    <div style={styles.questionCard}>
      <p style={styles.questionText}>{question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        {options.map((opt, idx) => {
          let optionStyle = { ...styles.mcOption, cursor: "pointer" };
          if (isAnswered && selected === idx) {
            optionStyle.backgroundColor = (idx === correctIndex) ? "#d4edda" : "#f8d7da";
            optionStyle.borderColor = (idx === correctIndex) ? "#28a745" : "#dc3545";
            optionStyle.color = (idx === correctIndex) ? "#155724" : "#842029";
          } else if (isAnswered && idx === correctIndex && selected !== correctIndex) {
            optionStyle.backgroundColor = "#d4edda";
            optionStyle.borderColor = "#28a745";
            optionStyle.color = "#155724";
          } else if (!isAnswered && selected === idx) {
            optionStyle.backgroundColor = "#2fa69a";
            optionStyle.color = "white";
          }
          return (
            <div
              key={idx}
              onClick={() => handleSelect(idx)}
              style={optionStyle}
            >
              <strong>{String.fromCharCode(65+idx)}.</strong> {opt}
            </div>
          );
        })}
      </div>
      {feedback && <div style={styles.mcFeedback}>{feedback}</div>}
    </div>
  );
};

// ===================== KOMPONEN SOAL LATIHAN (TANPA AUTO CHECK) =====================
const LatihanSoal = ({ soal, index, selectedAnswer, onSelect, isWrong }) => {
  const handleSelect = (idx) => {
    onSelect(index, idx);
  };

  return (
    <div style={styles.questionCard} id={`soal-latihan-${index}`}>
      <p style={styles.questionText}>{index+1}. {soal.text}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        {soal.options.map((opt, optIdx) => {
          let optionStyle = { ...styles.mcOption, cursor: "pointer" };
          if (selectedAnswer === optIdx) {
            optionStyle.backgroundColor = "#2fa69a";
            optionStyle.color = "white";
          }
          return (
            <div
              key={optIdx}
              onClick={() => handleSelect(optIdx)}
              style={optionStyle}
            >
              <strong>{String.fromCharCode(65+optIdx)}.</strong> {opt}
            </div>
          );
        })}
      </div>
      {isWrong && (
        <div style={styles.salahLabel}>❌ Jawaban salah, pilih jawaban lain</div>
      )}
    </div>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function PendahuluanDictionary() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progresBelajar, setProgresBelajar] = useState(null);

  // ---------- KONFIGURASI HALAMAN (TERSTRUKTUR) ----------
  const TOPIC_NAME = "pendahuluan_dict";
  const EKSPLORASI_ANSWERS_KEY = `eksplorasi_${TOPIC_NAME}_answers`;
  const BONUS_DONE_KEY = `${TOPIC_NAME}_bonus_done`;
  // --------------------------------------------------------

  // Cek autentikasi user
  useEffect(() => {
    const uid = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!uid || !userEmail) {
      navigate('/loginregister');
    } else {
      setUserId(uid);
    }
  }, [navigate]);

  // Fetch progres_belajar dari Firestore
  useEffect(() => {
    if (!userId) return;

    const fetchProgres = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "mahasiswa", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const progres = data.progres_belajar || 0;
          setProgresBelajar(progres);

          // 🔒 Halaman hanya bisa diakses jika progres >= 9
          if (progres < 9) {
            navigate('/dashboard');
            return;
          }
          // Jika progres >= 9, boleh akses halaman
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Gagal mengambil progres:", error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProgres();
  }, [userId, navigate]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Cek apakah bonus sudah pernah diberikan
  useEffect(() => {
    const already = localStorage.getItem(BONUS_DONE_KEY);
    if (already === "true") {
      // Tandai bonus sudah diberikan
    }
  }, [BONUS_DONE_KEY]);

  // EKSPLORASI (pretest) - dengan localStorage
  const eksplorasiQuestions = [
    {
      text: "Yang dimaksud dengan dictionary dalam Python adalah ….",
      options: [
        "Kumpulan data berurutan yang dapat diubah",
        "Kumpulan pasangan key-value yang tidak berurutan",
        "Kumpulan data yang hanya dapat diisi angka",
        "Tipe data untuk menyimpan satu nilai saja",
        "Kumpulan data yang bersifat immutable"
      ],
      correct: 1,
    },
    {
      text: "Pernyataan yang BENAR tentang key pada dictionary adalah ….",
      options: [
        "Key boleh duplikat",
        "Key harus berupa string",
        "Key harus unik",
        "Key dapat berupa list",
        "Key harus berupa angka"
      ],
      correct: 2,
    },
    {
      text: "Sifat dictionary yang menyebabkan isinya dapat diubah setelah dibuat disebut...",
      options: [
        "Immutable",
        "Ordered",
        "Mutable",
        "Sequential",
        "Dynamic"
      ],
      correct: 2,
    },
  ];

  // State untuk eksplorasi, diinisialisasi dari localStorage
  const [eksplorasiSelected, setEksplorasiSelected] = useState(() => {
    try {
      const saved = localStorage.getItem(EKSPLORASI_ANSWERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === eksplorasiQuestions.length) {
          return parsed;
        }
      }
    } catch (e) {}
    return Array(eksplorasiQuestions.length).fill(null);
  });

  // State turunan (dapat dihitung langsung dari selected)
  const eksplorasiHasAnswered = eksplorasiSelected.map(sel => sel !== null);
  const eksplorasiFeedback = eksplorasiSelected.map((sel, i) => {
    if (sel === null) return "";
    return sel === eksplorasiQuestions[i].correct ? "Benar" : "Salah";
  });
  const isEksplorasiCompleted = eksplorasiHasAnswered.every(v => v === true);

  // Sinkronisasi ke localStorage setiap kali jawaban berubah
  useEffect(() => {
    localStorage.setItem(EKSPLORASI_ANSWERS_KEY, JSON.stringify(eksplorasiSelected));
  }, [eksplorasiSelected, EKSPLORASI_ANSWERS_KEY]);

  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    if (eksplorasiHasAnswered[questionIdx]) return;
    setEksplorasiSelected(prev => {
      const newSel = [...prev];
      newSel[questionIdx] = optionIdx;
      return newSel;
    });
  };

  // Data visualisasi contoh dictionary
  const contohDictionary = {
    nama: "Budi",
    usia: 20,
    kota: "Jakarta"
  };

  // Soal latihan pilihan ganda (5 soal)
  const latihanSoal = [
    {
      text: "Dictionary pada Python menggunakan tanda kurung ....",
      options: ["[]", "{}", "()", "<>", "||"],
      correct: 1,
    },
    {
      text: "Berikut ini yang BUKAN merupakan karakteristik dictionary adalah ....",
      options: [
        "Key harus unik",
        "Dapat diubah (mutable)",
        "Memiliki urutan tetap (ordered)",
        "Menyimpan pasangan key-value",
        "Key harus immutable"
      ],
      correct: 2,
    },
    {
      text: "Tipe data yang dapat digunakan sebagai key dalam dictionary adalah ....",
      options: [
        "Hanya string",
        "Hanya angka",
        "Tipe yang immutable (string, integer, tuple, dll)",
        "Semua tipe data termasuk list",
        "Hanya tuple dan string"
      ],
      correct: 2,
    },
    {
      text: "Jika kita menggunakan key yang sama dua kali saat membuat dictionary maka yang terjadi adalah ....",
      options: [
        "Error sintaks",
        "Nilai pertama akan diganti dengan nilai terakhir",
        "Dictionary akan menyimpan duplikat key",
        "Dictionary tidak jadi dibuat",
        "Key akan digabung menjadi list"
      ],
      correct: 1,
    },
    {
      text: "Cara yang tepat untuk mengakses nilai dari key 'nama' pada dictionary siswa adalah ....",
      options: [
        "siswa(nama)",
        "siswa[nama]",
        "siswa['nama']",
        "siswa.nama",
        "siswa->nama"
      ],
      correct: 2,
    },
  ];

  // State untuk latihan (baru, tanpa auto-lock)
  const [jawabanLatihan, setJawabanLatihan] = useState(Array(latihanSoal.length).fill(null));
  const [hasilPeriksa, setHasilPeriksa] = useState(Array(latihanSoal.length).fill(null));
  const [pesanPeriksa, setPesanPeriksa] = useState("");
  const [semuaBenar, setSemuaBenar] = useState(false);
  
  const soalRefs = useRef([]);
  useEffect(() => {
    soalRefs.current = soalRefs.current.slice(0, latihanSoal.length);
  }, [latihanSoal.length]);

  // Tampilkan modal hanya jika:
  // 1. progresBelajar < 10 (belum mencapai level 10)
  // 2. semua latihan benar
  // 3. belum menampilkan modal
  useEffect(() => {
    if (!userId) return;
    if (progresBelajar === null) return;
    if (progresBelajar >= 10) {
      // Jika progres >= 10, tidak perlu tampilkan modal
      setShowModal(false);
      return;
    }
    if (semuaBenar && !showModal) {
      // Jika progres < 10 dan semua latihan benar, tampilkan modal
      setShowModal(true);
    }
  }, [semuaBenar, userId, showModal, progresBelajar]);

  const handleCompleteAndNavigate = async () => {
    try {
      // Tambah progres hanya jika masih < 10
      if (progresBelajar < 10) {
        const mahasiswaRef = doc(db, "mahasiswa", userId);
        await updateDoc(mahasiswaRef, {
          progres_belajar: increment(1)
        });
        // Update state lokal
        setProgresBelajar(progresBelajar + 1);
      }
      
      // Tandai bonus sudah diberikan
      localStorage.setItem(BONUS_DONE_KEY, "true");
      setShowModal(false);
      navigate("/Dictionary/PembuatanAksesElementDictionary");
    } catch (error) {
      console.error("Gagal update progres:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleSelectLatihan = (index, optionIdx) => {
    setJawabanLatihan(prev => {
      const newJaw = [...prev];
      newJaw[index] = optionIdx;
      return newJaw;
    });
    setHasilPeriksa(prev => {
      const newHasil = [...prev];
      newHasil[index] = null;
      return newHasil;
    });
    if (semuaBenar) setSemuaBenar(false);
    if (pesanPeriksa) setPesanPeriksa("");
  };

  const handlePeriksaSemua = () => {
    const semuaTerisi = jawabanLatihan.every(jaw => jaw !== null);
    if (!semuaTerisi) {
      setPesanPeriksa("⚠️ Anda harus menjawab semua soal terlebih dahulu!");
      return;
    }

    const newHasilPeriksa = [];
    let adaSalah = false;
    let firstWrongIndex = -1;

    for (let i = 0; i < latihanSoal.length; i++) {
      const isCorrect = (jawabanLatihan[i] === latihanSoal[i].correct);
      newHasilPeriksa[i] = isCorrect;
      if (!isCorrect) {
        adaSalah = true;
        if (firstWrongIndex === -1) firstWrongIndex = i;
      }
    }

    setHasilPeriksa(newHasilPeriksa);

    if (adaSalah) {
      const element = document.getElementById(`soal-latihan-${firstWrongIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setPesanPeriksa("❌ Masih ada jawaban yang salah. Perbaiki jawaban yang salah, lalu periksa kembali.");
      setSemuaBenar(false);
    } else {
      setSemuaBenar(true);
      setPesanPeriksa("🎉 Selamat! Semua jawaban Anda benar! 🎉");
    }
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
            <h1 style={styles.headerTitle}>PENDAHULUAN DICTIONARY</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li>Memahami konsep dictionary sebagai struktur data pasangan key-value.</li>
                <li>Mengetahui karakteristik utama dictionary (key unik, mutable, tidak berurutan).</li>
                {/* <li>Mengenal perbedaan dasar antara dictionary dengan tipe data lain.</li> */}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Eksplorasi</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia. 
                Eksplorasi awal ini bertujuan untuk mengukur pemahaman awal Anda terhadap materi yang akan dipelajari.
                Maka dari itu, <strong>jawaban</strong> Anda <strong>tidak harus benar</strong>, jawab sesuai pemahaman Anda. 
                <strong> Materi akan terbuka setelah kedua pertanyaan dijawab.</strong>
                {isEksplorasiCompleted && " (Anda sudah menyelesaikan eksplorasi ini sebelumnya.)"}
              </p>
              {eksplorasiQuestions.map((q, idx) => {
                const isAnswered = eksplorasiHasAnswered[idx];
                const selectedIdx = eksplorasiSelected[idx];
                return (
                  <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
                    <p style={{ fontWeight: "600", marginBottom: "12px", textAlign: "justify" }}>{idx + 1}. {q.text}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {q.options.map((opt, optIdx) => {
                        let optionStyle = { ...styles.eksplorasiOption, cursor: "pointer" };
                        if (isAnswered) {
                          optionStyle.cursor = "not-allowed";
                          optionStyle.opacity = 0.7;
                          if (selectedIdx === optIdx) {
                            const isCorrect = (selectedIdx === q.correct);
                            optionStyle.backgroundColor = isCorrect ? "#d4edda" : "#f8d7da";
                            optionStyle.borderColor = isCorrect ? "#28a745" : "#dc3545";
                            optionStyle.color = isCorrect ? "#155724" : "#842029";
                          } else {
                            optionStyle.backgroundColor = "#e9ecef";
                            optionStyle.color = "#6c757d";
                          }
                        } else {
                          optionStyle.backgroundColor = eksplorasiSelected[idx] === optIdx ? "#2fa69a" : "#f9f9f9";
                          optionStyle.color = eksplorasiSelected[idx] === optIdx ? "white" : "#1f2937";
                        }
                        return (
                          <div key={optIdx} onClick={() => !isAnswered && handleEksplorasiSelect(idx, optIdx)} style={optionStyle}>
                            <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </div>
                        );
                      })}
                    </div>
                    {eksplorasiFeedback[idx] && (
                      <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", backgroundColor: eksplorasiFeedback[idx] === "Benar" ? "#d1e7dd" : "#f8d7da", color: eksplorasiFeedback[idx] === "Benar" ? "#0f5132" : "#842029" }}>
                        {eksplorasiFeedback[idx] === "Benar" ? "Benar" : "Salah"}
                      </div>
                    )}
                  </div>
                );
              })}
              {!isEksplorasiCompleted && (
                <div style={styles.lockMessage}>
                  🔒 Materi terkunci. Jawab semua pertanyaan di atas untuk membuka materi.
                </div>
              )}
            </div>
          </section>

          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={styles.subTitle}>Apa itu Dictionary?</h3>
                  <p style={styles.text}>
                    <strong>Dictionary</strong> adalah struktur data di Python yang menyimpan koleksi 
                    pasangan key-value (kunci-nilai). Setiap key bersifat unik dan 
                    digunakan untuk mengakses nilai yang terkait. Dictionary bersifat 
                    mutable (dapat diubah), dinamis, dan sangat efisien untuk pencarian data.
                  </p>
                  
                  <h3 style={styles.subTitle}>Karakteristik Dictionary</h3>
                  <ul style={styles.list}>
                    <li><strong>Key unik</strong> → Tidak boleh ada dua key yang sama dalam satu dictionary.</li>
                    <li><strong>Mutable</strong> → Isi dictionary dapat diubah setelah dibuat (tambah, hapus, ubah).</li>
                    <li><strong>Value</strong> dapat berupa apa saja → Dapat ditambah, diubah, dihapus.</li>
                    <li><strong>Key harus immutable</strong> → Key dapat berupa string, integer, tuple, tetapi tidak boleh list atau dictionary lain.</li>
                  </ul>

                  <h3 style={styles.subTitle}>Contoh Dictionary</h3>
                  <p style={styles.text}>
                    Berikut adalah ilustrasi sederhana dictionary yang menyimpan data seorang mahasiswa:
                  </p>
                  <DictionaryVisualization 
                    data={contohDictionary}
                    title="Contoh Dictionary: Data Mahasiswa"
                  />
                  <div style={styles.infoNote}>
                    💡 <strong>Catatan:</strong> Pembuatan dictionary akan dipelajari secara mendalam pada materi selanjutnya. 
                    Pada pendahuluan ini, fokus kita adalah memahami konsep dan karakteristik dasarnya.
                  </div>
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Kerjakan soal-soal berikut untuk menguji pemahaman Anda tentang konsep dasar dictionary. 
                    Pilih jawaban, lalu klik tombol "Periksa Jawaban" di bawah.
                  </p>
                  {latihanSoal.map((soal, idx) => (
                    <LatihanSoal
                      key={idx}
                      soal={soal}
                      index={idx}
                      selectedAnswer={jawabanLatihan[idx]}
                      onSelect={handleSelectLatihan}
                      isWrong={hasilPeriksa[idx] === false}
                    />
                  ))}
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button style={styles.periksaButton} onClick={handlePeriksaSemua}>
                      Periksa Jawaban
                    </button>
                  </div>
                  {pesanPeriksa && (
                    <div style={{ ...styles.mcFeedback, marginTop: "15px", textAlign: "center", backgroundColor: pesanPeriksa.includes("Selamat") ? "#d4edda" : "#f8d7da", color: pesanPeriksa.includes("Selamat") ? "#155724" : "#842029" }}>
                      {pesanPeriksa}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* ===== PAGINATION DENGAN DISABLE NEXT ===== */}
          <MateriPagination nextDisabled={progresBelajar !== null && progresBelajar < 10} />

        </div>
      </div>

      {/* Modal Sukses - HANYA MUNCUL JIKA PROGRES < 10 */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>🎉</div>
            <h2 style={styles.modalTitle}>Selamat!</h2>
            <p style={styles.modalText}>
              Anda telah menyelesaikan materi ini dengan sempurna.
              <br />
              Materi selanjutnya akan terbuka.
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

/* ================== STYLES ================== */
const styles = {
  page: {
    padding: "30px 40px",
    paddingTop: "30px",
    backgroundColor: "#f5f7fa",
    minHeight: "calc(100vh - 64px)",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
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
  list: { 
    paddingLeft: "20px", 
    lineHeight: "1.8", 
    color: "#333",
    textAlign: "justify" 
  },
  text: { 
    lineHeight: "1.8", 
    color: "#333", 
    marginBottom: "15px",
    textAlign: "justify" 
  },
  subTitle: { marginTop: "20px", marginBottom: "10px", color: "#306998", fontSize: "18px", fontWeight: "600" },
  infoNote: {
    backgroundColor: "#e7f3ff",
    borderLeft: "4px solid #306998",
    padding: "12px 15px",
    borderRadius: "6px",
    marginTop: "15px",
    fontSize: "14px",
    color: "#004085",
    textAlign: "justify",
  },
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    scrollMarginTop: "80px",
  },
  questionText: { 
    fontWeight: "600", 
    marginBottom: "10px", 
    color: "#1f2937",
    textAlign: "justify" 
  },
  mcOption: {
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "all 0.2s",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    color: "#1f2937",
  },
  mcFeedback: {
    marginTop: "10px",
    fontSize: "14px",
    fontWeight: "500",
    padding: "6px 12px",
    borderRadius: "6px",
    backgroundColor: "#e9ecef",
    display: "inline-block",
  },
  benarLabel: {
    marginTop: "10px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#28a745",
  },
  salahLabel: {
    marginTop: "10px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#dc3545",
    padding: "6px 12px",
    backgroundColor: "#f8d7da",
    borderRadius: "6px",
    display: "inline-block",
  },
  periksaButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background 0.2s",
  },
  eksplorasiOption: {
    padding: "12px",
    borderRadius: "8px",
    transition: "all 0.2s",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  lockMessage: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#cfe2ff",
    borderLeft: "5px solid #0d6efd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#084298",
  },
  // Modal styles
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
  modalTitle: { fontSize: "28px", fontWeight: "700", color: "#1e3a5f", marginBottom: "12px" },
  modalText: { 
    fontSize: "16px", 
    color: "#334155", 
    lineHeight: "1.5", 
    marginBottom: "24px",
    textAlign: "justify" 
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