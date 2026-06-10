import { useState, useEffect, useRef } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';
import { db } from "../../../config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function KuisNestedList() {
  const navigate = useNavigate();

  // ---------- AUTENTIKASI & DATA PENGGUNA ----------
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [tokenKelas, setTokenKelas] = useState(null);
  const [kelasId, setKelasId] = useState(null);
  const [kkm, setKkm] = useState(75);

  // DURASI KUIS: 1 MENIT = 60 DETIK (untuk testing)
  const DURASI_KUIS = 60;

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    if (!userId || !userEmail) {
      navigate('/loginregister');
      return;
    }
    setRole(userRole);
    const fetchUserData = async () => {
      try {
        if (userRole === 'mahasiswa') {
          const mhsSnap = await getDoc(doc(db, 'mahasiswa', userId));
          if (mhsSnap.exists()) {
            const mhsData = mhsSnap.data();
            setTokenKelas(mhsData.Token_mahasiswa);
            setKelasId(mhsData.Token_mahasiswa);
            setUserData(mhsData);
          }
        } else if (userRole === 'dosen') {
          const savedToken = localStorage.getItem('activeKelasToken');
          const savedKelasId = localStorage.getItem('activeKelasId');
          if (savedToken) {
            setTokenKelas(savedToken);
            setKelasId(savedKelasId);
            const dosenSnap = await getDoc(doc(db, 'dosen', userId));
            if (dosenSnap.exists()) setUserData(dosenSnap.data());
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [navigate]);

  // ---------- AMBIL KKM DARI DOKUMEN KELAS ----------
  useEffect(() => {
    if (!kelasId) return;
    const fetchKkm = async () => {
      try {
        const kelasSnap = await getDoc(doc(db, 'kelas', kelasId));
        if (kelasSnap.exists()) {
          const data = kelasSnap.data();
          setKkm(data.kkm_kuis_nested_list ?? 75);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchKkm();
  }, [kelasId]);

  // ---------- AMBIL SOAL DARI DATABASE ----------
  const [questions, setQuestions] = useState([]);
  const [loadingSoal, setLoadingSoal] = useState(true);

  useEffect(() => {
    if (!kelasId) return;
    const fetchSoal = async () => {
      try {
        // Cari kuis dengan tipe 'nested_list' milik kelas ini
        const kuisQuery = query(
          collection(db, 'kuis'),
          where('kelas_id', '==', kelasId),
          where('tipe', '==', 'nested_list')
        );
        const kuisSnap = await getDocs(kuisQuery);
        if (kuisSnap.empty) {
          setQuestions([]);
          setLoadingSoal(false);
          return;
        }
        const kuisId = kuisSnap.docs[0].id;
        // Ambil soal
        const soalQuery = query(
          collection(db, 'soal_kuis'),
          where('kuis_id', '==', kuisId)
        );
        const soalSnap = await getDocs(soalQuery);
        const soalList = [];
        soalSnap.forEach(doc => {
          soalList.push({ id: doc.id, ...doc.data() });
        });
        // Urutkan berdasarkan nomor
        soalList.sort((a, b) => a.nomor - b.nomor);
        setQuestions(soalList);
        setLoadingSoal(false);
      } catch (err) {
        console.error(err);
        setLoadingSoal(false);
      }
    };
    fetchSoal();
  }, [kelasId]);

  // ---------- STATE KUIS ----------
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const answersRef = useRef(answers); // Ref untuk jawaban terbaru
  const [flags, setFlags] = useState([]);
  const [unsures, setUnsures] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURASI_KUIS);
  const timerRef = useRef(null);
  const [resultsData, setResultsData] = useState(null);
  const [savingData, setSavingData] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const isSubmittingRef = useRef(false); // Mencegah multiple submit

  // Inisialisasi state jawaban saat soal berubah
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
      setFlags(Array(questions.length).fill(false));
      setUnsures(Array(questions.length).fill(false));
    }
  }, [questions]);

  // Sinkronkan answersRef setiap kali answers berubah
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ---------- TIMER ----------
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          // Auto submit saat waktu habis
          if (!submitted && quizStarted && !isSubmittingRef.current) {
            handleSubmit(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (quizStarted && !submitted) {
      startTimer();
    }
    return () => stopTimer();
  }, [quizStarted, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ---------- HANDLER ----------
  const handleMCAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const toggleFlag = () => {
    const newFlags = [...flags];
    newFlags[currentQuestion] = !newFlags[currentQuestion];
    setFlags(newFlags);
  };

  const toggleUnsure = () => {
    const newUnsures = [...unsures];
    newUnsures[currentQuestion] = !newUnsures[currentQuestion];
    setUnsures(newUnsures);
  };

  // Fungsi utama submit (dipanggil baik manual maupun auto)
  const handleSubmit = async (auto = false) => {
    if (submitted || questions.length === 0 || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    
    stopTimer();
    setSubmitted(true);
    setShowConfirmModal(false);
    setShowWarningModal(false);

    // Ambil jawaban terkini dari ref (menghindari stale closure)
    const currentAnswers = answersRef.current;

    // Hitung skor: jawaban null dianggap salah
    let score = 0;
    const results = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = currentAnswers[i];
      // Konversi jawaban_benar ke Number agar perbandingan aman
      const isCorrect = (userAnswer !== null && userAnswer === Number(q.jawaban_benar));
      if (isCorrect) score++;
      results.push({ ...q, userAnswer, isCorrect });
    }
    const finalScore = score;

    // Hitung waktu yang digunakan
    // Jika auto-submit (waktu habis), waktu digunakan = durasi penuh
    const waktuDigunakan = auto ? DURASI_KUIS : DURASI_KUIS - (timeLeft < 0 ? 0 : timeLeft);
    setResultsData({ results, finalScore, waktuDigunakan });

    // Hanya mahasiswa yang menyimpan ke database
    if (role === 'mahasiswa') {
      setSavingData(true);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error("User ID tidak ditemukan");
        const nilaiRef = doc(db, "nilai", userId);
        await updateDoc(nilaiRef, {
          "Kuis Nested List": finalScore * (questions[0]?.bobot || 10)
        });

        // Cek kelulusan dan bonus progres
        const mahasiswaRef = doc(db, "mahasiswa", userId);
        const mahasiswaDoc = await getDoc(mahasiswaRef);
        if (!mahasiswaDoc.exists()) throw new Error("Data mahasiswa tidak ditemukan");

        const nilaiAkhir = finalScore * (questions[0]?.bobot || 10);
        const isPassed = nilaiAkhir >= kkm;

        if (isPassed) {
          const bonusKey = `kuis_nested_bonus_done_${kelasId}`;
          const alreadyBonus = localStorage.getItem(bonusKey);
          if (!alreadyBonus) {
            await updateDoc(mahasiswaRef, {
              progres_belajar: increment(1)
            });
            localStorage.setItem(bonusKey, "true");
          }
        }
      } catch (error) {
        console.error("Gagal menyimpan nilai:", error);
        alert("Terjadi kesalahan saat menyimpan nilai.");
      } finally {
        setSavingData(false);
      }
    }
    isSubmittingRef.current = false;
  };

  const handleCollectClick = () => {
    const allAnswered = answers.every(ans => ans !== null);
    if (!allAnswered) {
      setShowWarningModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const resetQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuizStarted(false);
    setCurrentQuestion(0);
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
      setFlags(Array(questions.length).fill(false));
      setUnsures(Array(questions.length).fill(false));
    }
    setSubmitted(false);
    setTimeLeft(DURASI_KUIS);
    setResultsData(null);
    isSubmittingRef.current = false;
  };

  const startQuiz = () => {
    resetQuiz();
    setQuizStarted(true);
    setTimeLeft(DURASI_KUIS);
    setSubmitted(false);
    setCurrentQuestion(0);
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
      setFlags(Array(questions.length).fill(false));
      setUnsures(Array(questions.length).fill(false));
    }
    setResultsData(null);
    startTimer();
  };

  const goToPreviousMaterial = () => {
    window.location.href = '/NestedList/PendahuluanNestedList';
  };

  // Efek hover global
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .btn-hover-primary:hover {
        background-color: #FFD43B !important;
        color: #306998 !important;
        transform: translateY(-2px);
        transition: all 0.2s ease;
      }
      .btn-hover-flag:hover {
        background-color: #f59e0b !important;
        color: white !important;
        transform: translateY(-2px);
      }
      .btn-hover-unsure:hover {
        background-color: #64748b !important;
        color: white !important;
        transform: translateY(-2px);
      }
      .btn-hover-nav:hover {
        background-color: #FFD43B !important;
        color: #306998 !important;
        transform: translateY(-2px);
      }
      .btn-hover-submit:hover {
        background-color: #FFD43B !important;
        color: #306998 !important;
        transform: translateY(-2px);
      }
      .btn-hover-retry:hover {
        background-color: #e67e22 !important;
        transform: translateY(-2px);
      }
      .btn-hover-back:hover {
        background-color: #5a6268 !important;
        transform: translateY(-2px);
      }
      .btn-hover-next:hover {
        background-color: #1e4a76 !important;
        transform: translateY(-2px);
      }
      .nav-box-hover:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.15s ease;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ---------- RENDER ----------
  if (loadingSoal) {
    return (
      <>
        <Navbar />
        <SidebarMateri />
        <div className="main-content" style={{ paddingTop: "64px", textAlign: "center", padding: "40px" }}>
          <h2>Memuat soal...</h2>
        </div>
      </>
    );
  }

  // Jika soal tidak tersedia
  if (questions.length === 0 && !submitted) {
    return (
      <>
        <Navbar />
        <SidebarMateri />
        <div className="main-content" style={{ paddingTop: "64px" }}>
          <div style={styles.page}>
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>KUIS NESTED LIST</h1>
            </div>
            <div style={styles.cardInstruction}>
              <h2 style={styles.instructionTitle}>Petunjuk</h2>
              <p>Belum ada soal untuk kuis ini. Hubungi dosen pengampu.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Halaman Petunjuk
  if (!quizStarted && !submitted) {
    return (
      <>
        <Navbar />
        <SidebarMateri />
        <div className="main-content" style={{ paddingTop: "64px" }}>
          <div style={styles.page}>
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>KUIS NESTED LIST</h1>
            </div>
            <div style={styles.cardInstruction}>
              <h2 style={styles.instructionTitle}>Petunjuk Pengerjaan</h2>
              <ul style={styles.instructionList}>
                <li>Kuis terdiri dari {questions.length} soal pilihan ganda.</li>
                <li>Setiap soal bernilai {questions[0]?.bobot || 10} poin (total maksimal {questions.length * (questions[0]?.bobot || 10)}).</li>
                <li>Waktu pengerjaan: {Math.floor(DURASI_KUIS / 60)} menit (timer berjalan setelah mulai).</li>
                <li>Jika waktu habis, jawaban yang sudah terisi akan tersimpan dan terkirim secara otomatis.</li>
                <li>Pastikan semua jawaban sudah dipilih sebelum menekan KUMPULKAN JAWABAN.</li>
              </ul>
              <button
                className="btn-hover-primary"
                style={styles.startButton}
                onClick={startQuiz}
              >MULAI KUIS</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Halaman Hasil
  if (submitted && resultsData) {
    const { finalScore, waktuDigunakan } = resultsData;
    const minutesUsed = Math.floor(waktuDigunakan / 60);
    const secondsUsed = waktuDigunakan % 60;
    const totalSoal = questions.length;
    const skorMaks = totalSoal * (questions[0]?.bobot || 10);
    const skorAkhir = finalScore * (questions[0]?.bobot || 10);
    const isPassed = skorAkhir >= kkm;
    const percentage = Math.round((finalScore / totalSoal) * 100);

    return (
      <div style={styles.fullscreenResult}>
        <div style={styles.resultCardNew}>
          <div style={styles.resultHeaderNew}>
            <h1>HASIL KUIS NESTED LIST</h1>
            <div style={styles.headerAccentResultNew}></div>
          </div>
          <div style={styles.scoreDisplay}>
            <span style={styles.scoreNumberNew}>{skorAkhir}</span>
            <span style={styles.scoreTotalNew}>/{skorMaks}</span>
          </div>
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  backgroundColor: isPassed ? "#306998" : "#f59e0b",
                  borderRadius: "30px",
                  transition: "width 0.5s",
                }}
              ></div>
            </div>
            <div style={styles.progressLabel}>{percentage}%</div>
          </div>
          <div style={styles.statsGridNew}>
            <div style={styles.statItemNew}>
              <div style={styles.statIcon}>✓</div>
              <div>
                <div style={styles.statLabelNew}>Benar</div>
                <div style={styles.statValueNew}>{finalScore}</div>
              </div>
            </div>
            <div style={styles.statItemNew}>
              <div style={styles.statIcon}>✗</div>
              <div>
                <div style={styles.statLabelNew}>Salah</div>
                <div style={styles.statValueNew}>{totalSoal - finalScore}</div>
              </div>
            </div>
            <div style={styles.statItemNew}>
              <div style={styles.statIcon}>⏱</div>
              <div>
                <div style={styles.statLabelNew}>Waktu</div>
                <div style={styles.statValueNew}>{minutesUsed}m {secondsUsed}s</div>
              </div>
            </div>
          </div>
          <div style={styles.resultMessageNew}>
            {isPassed ? (
              <div style={styles.passedBoxNew}>
                SELAMAT! Anda LULUS dengan nilai {skorAkhir} (KKM {kkm})
              </div>
            ) : (
              <div style={styles.failedBoxNew}>
                MOHON MAAF, Anda TIDAK LULUS (Nilai {skorAkhir} &lt; KKM {kkm})
              </div>
            )}
            {role === 'dosen' && (
              <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#64748b' }}>
                * Sebagai dosen, nilai tidak disimpan.
              </div>
            )}
          </div>
          <div style={styles.resultActionsNew}>
            <button
              className="btn-hover-retry"
              style={styles.retryButtonNew}
              onClick={resetQuiz}
              disabled={savingData}
            >Ulangi Kuis</button>
            {role === 'mahasiswa' && !isPassed && (
              <button
                className="btn-hover-back"
                style={styles.backMaterialButtonNew}
                onClick={goToPreviousMaterial}
              >Kembali ke Materi Sebelumnya</button>
            )}
            {role === 'mahasiswa' && isPassed && (
              <button
                className="btn-hover-next"
                style={styles.nextMaterialButtonNew}
                onClick={() => window.location.href = '/Dictionary/PendahuluanDictionary'}
              >Lanjut ke Materi Selanjutnya</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Halaman Kuis
  const q = questions[currentQuestion];
  const isFlagged = flags[currentQuestion];
  const isUnsure = unsures[currentQuestion];

  return (
    <div style={styles.fullscreenQuiz}>
      <div style={styles.quizHeader}>
        <div style={styles.quizTitle}>KUIS NESTED LIST</div>
        <div style={styles.timerBox}>
          <span style={styles.timerIcon}>⏱</span>
          <span style={timeLeft < 60 ? styles.timerDanger : styles.timerText}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div style={styles.twoColumnLayout}>
        {/* Kolom Kiri - Soal */}
        <div style={styles.questionCard}>
          <div style={styles.questionHeader}>
            <h3 style={styles.questionNumber}>Soal {currentQuestion + 1} dari {questions.length}</h3>
            <div style={styles.actionButtons}>
              <button
                className="btn-hover-flag"
                style={isFlagged ? styles.flagButtonActive : styles.flagButton}
                onClick={toggleFlag}
              >
                🚩 {isFlagged ? "Flagged" : "Flag"}
              </button>
              <button
                className="btn-hover-unsure"
                style={isUnsure ? styles.unsureButtonActive : styles.unsureButton}
                onClick={toggleUnsure}
              >
                🤔 {isUnsure ? "Ragu" : "Ragu?"}
              </button>
            </div>
          </div>
          <p style={styles.questionText}>{q.pertanyaan}</p>

          <div style={styles.optionsContainer}>
            {q.pilihan.map((opt, idx) => (
              <label key={idx} style={styles.optionLabel}>
                <input
                  type="radio"
                  name="question"
                  value={idx}
                  checked={answers[currentQuestion] === idx}
                  onChange={() => handleMCAnswer(idx)}
                />
                <span style={styles.optionLetter}>{String.fromCharCode(65 + idx)}.</span> {opt}
              </label>
            ))}
          </div>

          <div style={styles.navButtons}>
            <button
              className="btn-hover-nav"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              style={currentQuestion === 0 ? styles.navButtonDisabled : styles.navButton}
            >
              Sebelumnya
            </button>
            <button
              className="btn-hover-nav"
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestion === questions.length - 1}
              style={currentQuestion === questions.length - 1 ? styles.navButtonDisabled : styles.navButton}
            >
              Selanjutnya
            </button>
          </div>

          <div style={styles.submitWrapper}>
            <button
              className="btn-hover-submit"
              onClick={handleCollectClick}
              style={styles.submitButton}
              disabled={savingData}
            >
              {savingData ? "Menyimpan..." : "KUMPULKAN JAWABAN"}
            </button>
          </div>
        </div>

        {/* Kolom Kanan - Navigasi Soal */}
        <div style={styles.navGridContainer}>
          <div style={styles.navLabel}>Navigasi Soal</div>
          <div style={styles.navGrid}>
            {questions.map((_, idx) => {
              let boxStyle = styles.navBox;
              if (idx === currentQuestion) boxStyle = { ...styles.navBox, ...styles.navBoxActive };
              else if (flags[idx]) boxStyle = { ...styles.navBox, ...styles.navBoxFlagged };
              else if (unsures[idx]) boxStyle = { ...styles.navBox, ...styles.navBoxUnsure };
              else if (answers[idx] !== null) boxStyle = { ...styles.navBox, ...styles.navBoxAnswered };
              else boxStyle = styles.navBox;

              return (
                <div
                  key={idx}
                  className="nav-box-hover"
                  style={boxStyle}
                  onClick={() => setCurrentQuestion(idx)}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
          <div style={styles.legend}>
            <span><span style={styles.legendAnswered}></span> Terjawab</span>
            <span><span style={styles.legendFlagged}></span> Flag</span>
            <span><span style={styles.legendUnsure}></span> Ragu</span>
            <span><span style={styles.legendActive}></span> Aktif</span>
            <span><span style={styles.legendUnanswered}></span> Kosong</span>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Kumpul */}
      {showConfirmModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <h3 style={styles.modalTitle}>Konfirmasi Kumpulkan Jawaban</h3>
            <p style={styles.modalMessage}>
              Apakah Anda yakin ingin mengumpulkan semua jawaban?<br />
              Pastikan Anda telah memeriksa kembali jawaban Anda.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.modalButtonYes}
                onClick={() => handleSubmit(false)}
                className="btn-hover-primary"
              >
                Ya
              </button>
              <button
                style={styles.modalButtonCheck}
                onClick={() => setShowConfirmModal(false)}
                className="btn-hover-nav"
              >
                Periksa Jawaban Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Peringatan Belum Semua Terjawab */}
      {showWarningModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainerWarning}>
            <h3 style={styles.modalTitleWarning}>⚠️ Peringatan</h3>
            <p style={styles.modalMessageWarning}>
              Anda belum menjawab semua soal.<br />
              Harap selesaikan semua soal terlebih dahulu sebelum mengumpulkan.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.modalButtonWarning}
                onClick={() => setShowWarningModal(false)}
                className="btn-hover-nav"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================== STYLE (padding top diperbaiki + modal) ================== */
const styles = {
  page: {
    padding: "94px 40px 30px 40px",
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
  cardInstruction: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    maxWidth: "800px",
    margin: "0 auto",
  },
  instructionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#306998",
    marginBottom: "20px",
    borderLeft: "5px solid #FFD43B",
    paddingLeft: "16px",
  },
  instructionList: {
    lineHeight: "1.9",
    fontSize: "16px",
    color: "#2d3748",
    marginBottom: "32px",
    paddingLeft: "24px",
  },
  startButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "14px 28px",
    fontSize: "18px",
    fontWeight: "600",
    borderRadius: "40px",
    cursor: "pointer",
    width: "100%",
    transition: "0.2s",
    boxShadow: "0 4px 10px rgba(48,105,152,0.3)",
  },
  fullscreenQuiz: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "Poppins, sans-serif",
    padding: "80px 40px 20px 40px",
  },
  quizHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#306998",
    borderRadius: "20px",
    padding: "16px 32px",
    marginBottom: "30px",
    color: "white",
    boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
  },
  quizTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  timerBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "8px 20px",
    borderRadius: "60px",
  },
  timerIcon: { fontSize: "24px" },
  timerText: { fontSize: "28px", fontWeight: "700", fontFamily: "monospace" },
  timerDanger: {
    fontSize: "28px",
    fontWeight: "700",
    fontFamily: "monospace",
    color: "#FFD43B",
  },
  twoColumnLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "30px",
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: "28px",
    padding: "32px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  questionNumber: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#306998",
    margin: 0,
  },
  actionButtons: { display: "flex", gap: "10px" },
  flagButton: {
    backgroundColor: "#f1f5f9",
    border: "none",
    padding: "8px 18px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#334155",
  },
  flagButtonActive: {
    backgroundColor: "#fef3c7",
    border: "none",
    padding: "8px 18px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#b45309",
    border: "1px solid #f59e0b",
  },
  unsureButton: {
    backgroundColor: "#f1f5f9",
    border: "none",
    padding: "8px 18px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#334155",
  },
  unsureButtonActive: {
    backgroundColor: "#e2e8f0",
    border: "none",
    padding: "8px 18px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#1e293b",
    border: "1px solid #94a3b8",
  },
  questionText: {
    fontSize: "18px",
    lineHeight: "1.5",
    marginBottom: "28px",
    color: "#0f172a",
    fontWeight: "500",
    whiteSpace: "pre-line",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "36px",
  },
  optionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "16px",
    padding: "10px 16px",
    borderRadius: "16px",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
    border: "1px solid #e2e8f0",
  },
  optionLetter: {
    fontWeight: "bold",
    color: "#306998",
    width: "28px",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginTop: "10px",
  },
  navButton: {
    backgroundColor: "#e2e8f0",
    border: "none",
    padding: "10px 20px",
    borderRadius: "40px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    flex: 1,
    maxWidth: "160px",
  },
  navButtonDisabled: {
    backgroundColor: "#cbd5e1",
    border: "none",
    padding: "10px 20px",
    borderRadius: "40px",
    fontWeight: "600",
    fontSize: "15px",
    flex: 1,
    maxWidth: "160px",
    cursor: "not-allowed",
    color: "#64748b",
  },
  submitWrapper: { marginTop: "32px", textAlign: "center" },
  submitButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "40px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    maxWidth: "300px",
  },
  navGridContainer: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    height: "fit-content",
  },
  navLabel: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#2c3e50",
  },
  navGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "20px",
  },
  navBox: {
    width: "52px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "18px",
    cursor: "pointer",
    backgroundColor: "#e2e8f0",
    color: "#1e293b",
  },
  navBoxActive: {
    backgroundColor: "#306998",
    color: "white",
    boxShadow: "0 0 0 3px #FFD43B",
  },
  navBoxFlagged: {
    backgroundColor: "#f59e0b",
    color: "white",
  },
  navBoxUnsure: {
    backgroundColor: "#94a3b8",
    color: "white",
  },
  navBoxAnswered: {
    backgroundColor: "#10b981",
    color: "white",
  },
  legend: {
    display: "flex",
    gap: "24px",
    fontSize: "14px",
    color: "#475569",
    flexWrap: "wrap",
  },
  legendAnswered: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    backgroundColor: "#10b981",
    borderRadius: "4px",
    marginRight: "6px",
    verticalAlign: "middle",
  },
  legendFlagged: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    backgroundColor: "#f59e0b",
    borderRadius: "4px",
    marginRight: "6px",
    verticalAlign: "middle",
  },
  legendUnsure: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    backgroundColor: "#94a3b8",
    borderRadius: "4px",
    marginRight: "6px",
    verticalAlign: "middle",
  },
  legendActive: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    backgroundColor: "#306998",
    borderRadius: "4px",
    marginRight: "6px",
    verticalAlign: "middle",
    boxShadow: "0 0 0 1px #FFD43B",
  },
  legendUnanswered: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    marginRight: "6px",
    verticalAlign: "middle",
  },
  fullscreenResult: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, sans-serif",
    padding: "80px 20px 20px 20px",
  },
  resultCardNew: {
    backgroundColor: "white",
    borderRadius: "32px",
    padding: "40px 30px",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 35px -10px rgba(0,0,0,0.1)",
    borderTop: "6px solid #306998",
  },
  resultHeaderNew: { marginBottom: "20px" },
  headerAccentResultNew: {
    width: "60px",
    height: "4px",
    backgroundColor: "#FFD43B",
    margin: "12px auto 0",
    borderRadius: "2px",
  },
  scoreDisplay: { marginBottom: "30px" },
  scoreNumberNew: {
    fontSize: "72px",
    fontWeight: "800",
    color: "#306998",
    lineHeight: 1,
  },
  scoreTotalNew: {
    fontSize: "28px",
    fontWeight: "500",
    color: "#64748b",
  },
  progressContainer: { marginBottom: "35px" },
  progressBar: {
    backgroundColor: "#e2e8f0",
    borderRadius: "30px",
    height: "12px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  progressLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#306998",
    textAlign: "right",
  },
  statsGridNew: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  statItemNew: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#f8fafc",
    padding: "12px 16px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    textAlign: "left",
  },
  statIcon: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#306998",
    width: "40px",
    textAlign: "center",
  },
  statLabelNew: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValueNew: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 1.2,
  },
  resultMessageNew: { marginBottom: "30px" },
  passedBoxNew: {
    backgroundColor: "#e6f7ec",
    color: "#2e7d32",
    padding: "14px",
    borderRadius: "60px",
    fontWeight: "600",
    fontSize: "18px",
    border: "1px solid #a5d6a7",
  },
  failedBoxNew: {
    backgroundColor: "#fee9e6",
    color: "#c62828",
    padding: "14px",
    borderRadius: "60px",
    fontWeight: "600",
    fontSize: "18px",
    border: "1px solid #ffab91",
  },
  resultActionsNew: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  retryButtonNew: {
    backgroundColor: "#f59e0b",
    border: "none",
    padding: "12px 28px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
  },
  backMaterialButtonNew: {
    backgroundColor: "#6c757d",
    border: "none",
    padding: "12px 28px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
  },
  nextMaterialButtonNew: {
    backgroundColor: "#306998",
    border: "none",
    padding: "12px 28px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
  },
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(3px)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "32px 28px",
    maxWidth: "450px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
    borderTop: "6px solid #306998",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#306998",
    marginBottom: "16px",
  },
  modalMessage: {
    fontSize: "16px",
    color: "#334155",
    marginBottom: "28px",
    lineHeight: 1.5,
  },
  modalButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  modalButtonYes: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "140px",
  },
  modalButtonCheck: {
    backgroundColor: "#f1f5f9",
    color: "#1e293b",
    border: "1px solid #cbd5e1",
    padding: "12px 28px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    minWidth: "180px",
  },
  modalContainerWarning: {
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "32px 28px",
    maxWidth: "450px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
    borderTop: "6px solid #f59e0b",
  },
  modalTitleWarning: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f59e0b",
    marginBottom: "16px",
  },
  modalMessageWarning: {
    fontSize: "16px",
    color: "#334155",
    marginBottom: "28px",
    lineHeight: 1.5,
  },
  modalButtonWarning: {
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "100px",
  },
};