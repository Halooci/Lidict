import { useState, useEffect } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';

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
            // Tampilkan jawaban benar jika user salah
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

// ===================== KOMPONEN SOAL LATIHAN (DENGAN TOMBOL PERIKSA) =====================
const LatihanSoal = ({ soal, index, selectedAnswer, onSelect, isLocked, isCorrect }) => {
  const handleSelect = (idx) => {
    if (isLocked) return;
    onSelect(index, idx);
  };

  return (
    <div style={styles.questionCard}>
      <p style={styles.questionText}>{index+1}. {soal.text}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        {soal.options.map((opt, optIdx) => {
          let optionStyle = { ...styles.mcOption, cursor: isLocked ? "not-allowed" : "pointer" };
          if (isLocked && isCorrect) {
            // Jika sudah benar, tampilkan jawaban yang benar dengan warna hijau
            if (optIdx === soal.correct) {
              optionStyle.backgroundColor = "#d4edda";
              optionStyle.borderColor = "#28a745";
              optionStyle.color = "#155724";
            } else {
              optionStyle.backgroundColor = "#e9ecef";
              optionStyle.color = "#6c757d";
            }
          } else if (selectedAnswer === optIdx) {
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
      {isLocked && isCorrect && <div style={styles.benarLabel}>✅ Jawaban Benar</div>}
      {!isLocked && selectedAnswer !== undefined && !isCorrect && (
        <div style={styles.salahLabel}>❌ Jawaban salah, pilih jawaban lain</div>
      )}
    </div>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function PendahuluanDictionary() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) {
      navigate('/loginregister');
    }
  }, [navigate]);

  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // EKSPLORASI (pretest) - opsi A sampai E
  const [eksplorasiSelected, setEksplorasiSelected] = useState([null, null, null]);
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", "", ""]);
  const [eksplorasiHasAnswered, setEksplorasiHasAnswered] = useState([false, false, false]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const eksplorasiQuestions = [
    {
      text: "Apa yang dimaksud dengan dictionary dalam Python?",
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
      text: "Manakah pernyataan yang BENAR tentang key pada dictionary?",
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

  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    if (eksplorasiHasAnswered[questionIdx]) return;
    setEksplorasiSelected(prev => {
      const newSel = [...prev];
      newSel[questionIdx] = optionIdx;
      return newSel;
    });
    const isCorrect = optionIdx === eksplorasiQuestions[questionIdx].correct;
    setEksplorasiFeedback(prev => {
      const newFb = [...prev];
      newFb[questionIdx] = isCorrect ? "Benar" : "Salah";
      return newFb;
    });
    setEksplorasiHasAnswered(prev => {
      const newAns = [...prev];
      newAns[questionIdx] = true;
      return newAns;
    });
  };

  useEffect(() => {
    const allAnswered = eksplorasiHasAnswered.every(v => v === true);
    if (allAnswered && !isEksplorasiCompleted) {
      setIsEksplorasiCompleted(true);
    }
  }, [eksplorasiHasAnswered, isEksplorasiCompleted]);

  // Data visualisasi contoh dictionary
  const contohDictionary = {
    nama: "Budi",
    usia: 20,
    kota: "Jakarta"
  };

  // Soal latihan pilihan ganda (5 soal) dengan opsi A sampai E
  const latihanSoal = [
    {
      text: "Dictionary pada Python menggunakan tanda kurung ...",
      options: ["[]", "{}", "()", "<>", "||"],
      correct: 1,
    },
    {
      text: "Berikut ini yang BUKAN merupakan karakteristik dictionary adalah ...",
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
      text: "Tipe data apa saja yang dapat digunakan sebagai key dalam dictionary?",
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
      text: "Apa yang terjadi jika kita menggunakan key yang sama dua kali saat membuat dictionary?",
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
      text: "Manakah cara yang tepat untuk mengakses nilai dari key 'nama' pada dictionary siswa?",
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

  // State untuk latihan
  const [jawabanLatihan, setJawabanLatihan] = useState(Array(latihanSoal.length).fill(null));
  const [isBenarLatihan, setIsBenarLatihan] = useState(Array(latihanSoal.length).fill(false));
  const [isLockedLatihan, setIsLockedLatihan] = useState(Array(latihanSoal.length).fill(false));
  const [pesanPeriksa, setPesanPeriksa] = useState("");
  const [semuaBenar, setSemuaBenar] = useState(false);

  // Fungsi untuk memilih jawaban latihan
  const handleSelectLatihan = (index, optionIdx) => {
    if (isLockedLatihan[index]) return;
    // Update jawaban
    setJawabanLatihan(prev => {
      const newJaw = [...prev];
      newJaw[index] = optionIdx;
      return newJaw;
    });
    // Cek kebenaran jawaban ini sekarang
    const isCorrect = (optionIdx === latihanSoal[index].correct);
    if (isCorrect) {
      // Jika benar, langsung kunci soal dan tandai benar
      setIsBenarLatihan(prev => {
        const newBenar = [...prev];
        newBenar[index] = true;
        return newBenar;
      });
      setIsLockedLatihan(prev => {
        const newLock = [...prev];
        newLock[index] = true;
        return newLock;
      });
      // Cek apakah semua sudah benar
      const updatedBenar = [...isBenarLatihan];
      updatedBenar[index] = true;
      const allTrue = updatedBenar.every(v => v === true);
      if (allTrue) setSemuaBenar(true);
    } else {
      // Jika salah, set status benar jadi false (belum benar)
      setIsBenarLatihan(prev => {
        const newBenar = [...prev];
        newBenar[index] = false;
        return newBenar;
      });
      // Jangan kunci, biarkan user coba lagi
      // Jika sebelumnya semua benar, reset
      setSemuaBenar(false);
    }
  };

  // Fungsi untuk memeriksa semua jawaban (tombol periksa)
  const handlePeriksaSemua = () => {
    // Cek apakah semua soal sudah dipilih jawabannya (tidak null)
    const semuaTerisi = jawabanLatihan.every(jaw => jaw !== null);
    if (!semuaTerisi) {
      setPesanPeriksa("⚠️ Anda harus menjawab semua soal terlebih dahulu!");
      return;
    }
    setPesanPeriksa("");
    // Evaluasi setiap jawaban yang masih belum benar
    for (let i = 0; i < latihanSoal.length; i++) {
      if (isBenarLatihan[i]) continue; // sudah benar, skip
      const jawabanUser = jawabanLatihan[i];
      const isCorrect = (jawabanUser === latihanSoal[i].correct);
      if (isCorrect) {
        // Jika jawaban benar, kunci dan tandai
        setIsBenarLatihan(prev => {
          const newBenar = [...prev];
          newBenar[i] = true;
          return newBenar;
        });
        setIsLockedLatihan(prev => {
          const newLock = [...prev];
          newLock[i] = true;
          return newLock;
        });
      } else {
        // Jika salah, beri tahu user (melalui state, akan muncul pesan di komponen)
        // Tidak perlu kunci, biarkan user mengubah
        // Tampilkan pesan error di masing-masing soal (sudah ada dari komponen LatihanSoal)
      }
    }
    // Setelah pengecekan, cek apakah semua sudah benar
    setTimeout(() => {
      const semuaSudahBenar = isBenarLatihan.every(v => v === true);
      if (semuaSudahBenar) {
        setSemuaBenar(true);
        setPesanPeriksa("🎉 Selamat! Semua jawaban Anda benar! 🎉");
      } else {
        setSemuaBenar(false);
        setPesanPeriksa("Masih ada jawaban yang salah. Silakan perbaiki jawaban yang salah.");
      }
    }, 0);
  };

  // Reset pesan periksa jika ada perubahan jawaban
  useEffect(() => {
    if (pesanPeriksa && !semuaBenar) {
      setPesanPeriksa("");
    }
  }, [jawabanLatihan, pesanPeriksa, semuaBenar]);

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
                <li>Mengenal perbedaan dasar antara dictionary dengan tipe data lain.</li>
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Eksplorasi</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum mempelajari materi lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
                <strong style={{ color: "#0d6efd" }}> Materi akan terbuka setelah ketiga pertanyaan dijawab.</strong>
              </p>
              {eksplorasiQuestions.map((q, idx) => {
                const isAnswered = eksplorasiHasAnswered[idx];
                const selectedIdx = eksplorasiSelected[idx];
                return (
                  <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
                    <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
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
                    <strong>Dictionary</strong> adalah salah satu struktur data bawaan Python yang sangat berguna. 
                    Dictionary menyimpan koleksi data dalam bentuk <strong>pasangan key-value</strong> (kunci-nilai). 
                    Setiap <strong>key</strong> bersifat unik dan digunakan untuk mengakses <strong>value</strong> yang terkait.
                  </p>
                  
                  <h3 style={styles.subTitle}>Karakteristik Dictionary</h3>
                  <ul style={styles.list}>
                    <li><strong>Key unik</strong> → Tidak boleh ada dua key yang sama dalam satu dictionary.</li>
                    <li><strong>Mutable</strong> → Isi dictionary dapat diubah setelah dibuat (tambah, hapus, ubah).</li>
                    <li><strong>Unordered</strong> → Sebelum Python 3.7, dictionary tidak menjamin urutan; setelah 3.7 urutan penyisipan diingat tetapi tetap tidak bisa diakses berdasarkan indeks.</li>
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
                <h2 style={styles.sectionTitle}>Latihan Pemahaman</h2>
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
                      isLocked={isLockedLatihan[idx]}
                      isCorrect={isBenarLatihan[idx]}
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
                  {semuaBenar && (
                    <div style={{ marginTop: "15px", padding: "12px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "8px", textAlign: "center", fontWeight: "bold" }}>
                      🎉 SELAMAT! Anda telah menyelesaikan semua latihan dengan benar. 🎉
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
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
  list: { paddingLeft: "20px", lineHeight: "1.8", color: "#333" },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
  subTitle: { marginTop: "20px", marginBottom: "10px", color: "#306998", fontSize: "18px", fontWeight: "600" },
  infoNote: {
    backgroundColor: "#e7f3ff",
    borderLeft: "4px solid #306998",
    padding: "12px 15px",
    borderRadius: "6px",
    marginTop: "15px",
    fontSize: "14px",
    color: "#004085",
  },
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ddd",
  },
  questionText: { fontWeight: "600", marginBottom: "10px", color: "#1f2937" },
  mcOption: {
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "all 0.2s",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
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
};