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

export default function EvaluasiAkhir() {
  const navigate = useNavigate();

  // ---------- AUTENTIKASI & DATA PENGGUNA ----------
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [tokenKelas, setTokenKelas] = useState(null);
  const [kelasId, setKelasId] = useState(null);
  const [kkm, setKkm] = useState(70); // default

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
          setKkm(data.kkm_evaluasi ?? 70);
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
        const kuisQuery = query(
          collection(db, 'kuis'),
          where('kelas_id', '==', kelasId),
          where('tipe', '==', 'evaluasi')
        );
        const kuisSnap = await getDocs(kuisQuery);
        if (kuisSnap.empty) {
          setQuestions([]);
          setLoadingSoal(false);
          return;
        }
        const kuisId = kuisSnap.docs[0].id;
        const soalQuery = query(
          collection(db, 'soal_kuis'),
          where('kuis_id', '==', kuisId)
        );
        const soalSnap = await getDocs(soalQuery);
        const soalList = [];
        soalSnap.forEach(doc => {
          soalList.push({ id: doc.id, ...doc.data() });
        });
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [flags, setFlags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 menit
  const timerRef = useRef(null);
  const [resultsData, setResultsData] = useState(null);
  const [savingData, setSavingData] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Inisialisasi state jawaban saat soal berubah
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
      setFlags(Array(questions.length).fill(false));
    }
  }, [questions]);

  // ---------- TIMER ----------
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!submitted && quizStarted) processSubmit(true);
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
  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const toggleFlag = () => {
    const newFlags = [...flags];
    newFlags[currentIndex] = !newFlags[currentIndex];
    setFlags(newFlags);
  };

  const handleSubmit = (auto = false) => {
    if (!auto) {
      setShowConfirmModal(true);
      return;
    }
    processSubmit(true);
  };

  const processSubmit = async (auto = false) => {
    if (submitted || questions.length === 0) return;
    stopTimer();
    setSubmitted(true);
    setShowConfirmModal(false);

    let correct = 0;
    const results = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = answers[i];
      const isCorrect = (userAnswer === q.jawaban_benar);
      if (isCorrect) correct++;
      results.push({ ...q, userAnswer, isCorrect });
    }
    const wrong = questions.length - correct;
    const totalScore = correct * (questions[0]?.bobot || 5);
    const waktuDigunakan = (25 * 60) - timeLeft;
    setResultsData({ results, correct, wrong, totalScore, waktuDigunakan });

    // Hanya mahasiswa yang menyimpan
    if (role === 'mahasiswa') {
      setSavingData(true);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error("User ID tidak ditemukan");
        const nilaiRef = doc(db, "nilai", userId);
        await updateDoc(nilaiRef, { Evaluasi: totalScore });

        const mahasiswaRef = doc(db, "mahasiswa", userId);
        const mahasiswaDoc = await getDoc(mahasiswaRef);
        if (!mahasiswaDoc.exists()) throw new Error("Data mahasiswa tidak ditemukan");

        const isPassed = totalScore >= kkm;
        if (isPassed) {
          const bonusKey = `evaluasi_bonus_done_${kelasId}`;
          const alreadyBonus = localStorage.getItem(bonusKey);
          if (!alreadyBonus) {
            await updateDoc(mahasiswaRef, { progres_belajar: increment(1) });
            localStorage.setItem(bonusKey, "true");
          }
        }
      } catch (err) {
        console.error(err);
        alert("Gagal menyimpan nilai.");
      } finally {
        setSavingData(false);
      }
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentIndex(0);
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
      setFlags(Array(questions.length).fill(false));
    }
    setSubmitted(false);
    setTimeLeft(25 * 60);
    setResultsData(null);
    stopTimer();
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(25 * 60);
    setSubmitted(false);
    setCurrentIndex(0);
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
      setFlags(Array(questions.length).fill(false));
    }
    setResultsData(null);
    stopTimer();
    startTimer();
  };

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

  if (questions.length === 0 && !submitted) {
    return (
      <>
        <Navbar />
        <SidebarMateri />
        <div className="main-content" style={{ paddingTop: "64px" }}>
          <div style={styles.page}>
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>EVALUASI AKHIR</h1>
            </div>
            <div style={styles.cardInstruction}>
              <h2 style={styles.instructionTitle}>Petunjuk</h2>
              <p>Belum ada soal untuk evaluasi ini. Hubungi dosen pengampu.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!quizStarted && !submitted) {
    const totalSoal = questions.length;
    const bobot = questions[0]?.bobot || 5;
    return (
      <>
        <Navbar />
        <SidebarMateri />
        <div className="main-content" style={{ paddingTop: "64px" }}>
          <div style={styles.page}>
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>EVALUASI AKHIR</h1>
            </div>
            <div style={styles.cardInstruction}>
              <h2 style={styles.instructionTitle}>Petunjuk Pengerjaan</h2>
              <ul style={styles.instructionList}>
                <li>Evaluasi terdiri dari {totalSoal} soal pilihan ganda.</li>
                <li>Setiap soal bernilai {bobot} poin (total maksimal {totalSoal * bobot}).</li>
                <li>Waktu pengerjaan: 25 menit (timer berjalan setelah mulai).</li>
                <li>Jika waktu habis, jawaban yang sudah terisi akan tersimpan dan terkirim secara otomatis.</li>
                <li>Gunakan fitur "Tandai Ragu-ragu" untuk soal yang perlu ditinjau ulang.</li>
                <li>Navigasi soal dapat melalui panel kotak nomor atau tombol Sebelumnya/Selanjutnya.</li>
                <li>Pastikan semua jawaban sudah dipilih sebelum menekan KUMPULKAN JAWABAN.</li>
                {role === 'mahasiswa' && <li>Nilai minimal kelulusan (KKM) adalah {kkm}.</li>}
              </ul>
              <button style={styles.startButton} onClick={startQuiz}>MULAI EVALUASI</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (submitted && resultsData) {
    const { correct, wrong, totalScore, waktuDigunakan } = resultsData;
    const minutesUsed = Math.floor(waktuDigunakan / 60);
    const secondsUsed = waktuDigunakan % 60;
    const skorMaks = questions.length * (questions[0]?.bobot || 5);
    const isPassed = totalScore >= kkm;
    const percentage = Math.round((correct / questions.length) * 100);

    return (
      <div style={styles.fullscreenResult}>
        <div style={styles.resultCardNew}>
          <div style={styles.resultHeaderNew}>
            <h1>HASIL EVALUASI</h1>
            <div style={styles.headerAccentResultNew}></div>
          </div>
          <div style={styles.scoreDisplay}>
            <span style={styles.scoreNumberNew}>{totalScore}</span>
            <span style={styles.scoreTotalNew}>/{skorMaks}</span>
          </div>
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div style={{
                width: `${percentage}%`,
                height: "100%",
                backgroundColor: isPassed ? "#306998" : "#f59e0b",
                borderRadius: "30px",
                transition: "width 0.5s"
              }}></div>
            </div>
            <div style={styles.progressLabel}>{percentage}%</div>
          </div>
          <div style={styles.statsGridNew}>
            <div style={styles.statItemNew}>
              <div style={styles.statIcon}>✓</div>
              <div><div style={styles.statLabelNew}>Benar</div><div style={styles.statValueNew}>{correct}</div></div>
            </div>
            <div style={styles.statItemNew}>
              <div style={styles.statIcon}>✗</div>
              <div><div style={styles.statLabelNew}>Salah</div><div style={styles.statValueNew}>{wrong}</div></div>
            </div>
            <div style={styles.statItemNew}>
              <div style={styles.statIcon}>⏱</div>
              <div><div style={styles.statLabelNew}>Waktu</div><div style={styles.statValueNew}>{minutesUsed}m {secondsUsed}s</div></div>
            </div>
          </div>
          <div style={styles.resultMessageNew}>
            {isPassed ? (
              <div style={styles.passedBoxNew}>SELAMAT! Anda LULUS dengan nilai {totalScore} (KKM {kkm})</div>
            ) : (
              <div style={styles.failedBoxNew}>MOHON MAAF, Anda TIDAK LULUS (Nilai {totalScore} &lt; KKM {kkm})</div>
            )}
            {role === 'dosen' && (
              <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#64748b' }}>
                * Sebagai dosen, nilai tidak disimpan.
              </div>
            )}
          </div>
          <div style={styles.resultActionsNew}>
            {role === 'mahasiswa' && !isPassed && (
              <button style={styles.retryButtonNew} onClick={resetQuiz}>Ulangi Evaluasi</button>
            )}
            {role === 'mahasiswa' && isPassed && (
              <button style={styles.petaKonsepButton} onClick={() => navigate('/PetaKonsep')}>Kembali ke Peta Konsep</button>
            )}
            {role === 'dosen' && (
              <button style={styles.retryButtonNew} onClick={resetQuiz}>Ulangi (Preview)</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Halaman kuis
  const q = questions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const isFlagged = flags[currentIndex];

  return (
    <div style={styles.fullscreenQuiz}>
      <div style={styles.quizHeader}>
        <div style={styles.quizTitle}>EVALUASI</div>
        <div style={styles.timerBox}>
          <span style={styles.timerIcon}>⏱</span>
          <span style={timeLeft < 60 ? styles.timerDanger : styles.timerText}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div style={styles.twoColumnLayout}>
        <div style={styles.questionCard}>
          <div style={styles.questionHeader}>
            <h3 style={styles.questionNumber}>Soal {currentIndex + 1} dari {questions.length}</h3>
            <button style={isFlagged ? styles.flagButtonActive : styles.flagButton} onClick={toggleFlag}>
              {isFlagged ? "🏁 Hapus Ragu" : "❓ Tandai Ragu-ragu"}
            </button>
          </div>
          <p style={styles.questionText}>{q.pertanyaan}</p>

          <div style={styles.optionsContainer}>
            {q.pilihan.map((opt, idx) => (
              <label key={idx} style={styles.optionLabel}>
                <input
                  type="radio"
                  name="question"
                  value={idx}
                  checked={selectedAnswer === idx}
                  onChange={() => handleAnswer(idx)}
                  disabled={submitted}
                />
                <span style={styles.optionLetter}>{String.fromCharCode(65 + idx)}.</span> {opt}
              </label>
            ))}
          </div>

          <div style={styles.navButtons}>
            <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0} style={styles.navButton}>Sebelumnya</button>
            <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIndex === questions.length - 1} style={styles.navButton}>Selanjutnya</button>
          </div>

          <div style={styles.submitWrapper}>
            <button onClick={() => handleSubmit(false)} style={styles.submitButton} disabled={savingData}>
              {savingData ? "Menyimpan..." : "KUMPULKAN JAWABAN"}
            </button>
          </div>
        </div>

        <div style={styles.navGridContainer}>
          <div style={styles.navLabel}>Navigasi Soal</div>
          <div style={styles.navGrid}>
            {questions.map((_, idx) => {
              let boxStyle = styles.navBox;
              if (idx === currentIndex) boxStyle = { ...styles.navBox, ...styles.navBoxActive };
              else if (flags[idx]) boxStyle = { ...styles.navBox, ...styles.navBoxFlagged };
              else if (answers[idx] !== null) boxStyle = { ...styles.navBox, ...styles.navBoxAnswered };
              return <div key={idx} style={boxStyle} onClick={() => setCurrentIndex(idx)}>{idx + 1}</div>;
            })}
          </div>
          <div style={styles.legend}>
            <span><span style={styles.legendAnswered}></span> Terjawab</span>
            <span><span style={styles.legendFlagged}></span> Ragu-ragu</span>
            <span><span style={styles.legendActive}></span> Aktif</span>
            <span><span style={styles.legendUnanswered}></span> Kosong</span>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>⚠️</div>
            <h2 style={styles.modalTitle}>Konfirmasi</h2>
            <p style={styles.modalText}>Apakah Anda yakin ingin mengumpulkan jawaban?</p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "20px" }}>
              <button style={styles.modalButtonCancel} onClick={() => setShowConfirmModal(false)}>Batal</button>
              <button style={styles.modalButtonConfirm} onClick={() => processSubmit(false)}>Ya, Kumpulkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================== STYLE (padding top diperbaiki) ================== */
const styles = {
  page: { padding: "94px 40px 30px 40px", backgroundColor: "#f5f7fa", minHeight: "calc(100vh - 64px)", fontFamily: "Poppins, sans-serif" },
  header: { backgroundColor: "#306998", color: "white", padding: "18px 24px", position: "relative", marginBottom: "30px", borderRadius: "6px" },
  headerAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: "8px", backgroundColor: "#FFD43B", borderRadius: "6px 0 0 6px" },
  headerTitle: { margin: 0, textAlign: "center", fontSize: "28px", fontWeight: "700" },
  cardInstruction: { backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", maxWidth: "800px", margin: "0 auto" },
  instructionTitle: { fontSize: "24px", fontWeight: "600", color: "#306998", marginBottom: "20px", borderLeft: "5px solid #FFD43B", paddingLeft: "16px" },
  instructionList: { lineHeight: "1.9", fontSize: "16px", color: "#2d3748", marginBottom: "32px", paddingLeft: "24px" },
  startButton: { backgroundColor: "#306998", color: "white", border: "none", padding: "14px 28px", fontSize: "18px", fontWeight: "600", borderRadius: "40px", cursor: "pointer", width: "100%", boxShadow: "0 4px 10px rgba(48,105,152,0.3)" },
  fullscreenQuiz: { minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: "Poppins, sans-serif", padding: "80px 40px 20px 40px" },
  quizHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#306998", borderRadius: "20px", padding: "16px 32px", marginBottom: "30px", color: "white", boxShadow: "0 6px 14px rgba(0,0,0,0.1)" },
  quizTitle: { fontSize: "28px", fontWeight: "bold", letterSpacing: "1px" },
  timerBox: { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(0,0,0,0.2)", padding: "8px 20px", borderRadius: "60px" },
  timerIcon: { fontSize: "24px" },
  timerText: { fontSize: "28px", fontWeight: "700", fontFamily: "monospace" },
  timerDanger: { fontSize: "28px", fontWeight: "700", fontFamily: "monospace", color: "#FFD43B" },
  twoColumnLayout: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "30px" },
  questionCard: { backgroundColor: "white", borderRadius: "28px", padding: "32px", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" },
  questionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" },
  questionNumber: { fontSize: "20px", fontWeight: "700", color: "#306998", margin: 0 },
  flagButton: { backgroundColor: "#f1f5f9", border: "none", padding: "8px 18px", borderRadius: "40px", fontSize: "14px", fontWeight: "500", cursor: "pointer", color: "#334155" },
  flagButtonActive: { backgroundColor: "#fef3c7", border: "1px solid #f59e0b", padding: "8px 18px", borderRadius: "40px", fontSize: "14px", fontWeight: "500", cursor: "pointer", color: "#b45309" },
  questionText: { fontSize: "18px", lineHeight: "1.5", marginBottom: "28px", color: "#0f172a", fontWeight: "500", whiteSpace: "pre-line" },
  optionsContainer: { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" },
  optionLabel: { display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", padding: "10px 16px", borderRadius: "16px", backgroundColor: "#f8fafc", cursor: "pointer", border: "1px solid #e2e8f0" },
  optionLetter: { fontWeight: "bold", color: "#306998", width: "28px" },
  navButtons: { display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "10px" },
  navButton: { backgroundColor: "#e2e8f0", border: "none", padding: "10px 20px", borderRadius: "40px", fontWeight: "600", cursor: "pointer", fontSize: "15px", flex: 1, maxWidth: "160px" },
  submitWrapper: { marginTop: "32px", textAlign: "center" },
  submitButton: { backgroundColor: "#306998", color: "white", border: "none", padding: "14px 28px", borderRadius: "40px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", width: "100%", maxWidth: "300px" },
  navGridContainer: { backgroundColor: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: "fit-content" },
  navLabel: { fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#2c3e50" },
  navGrid: { display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" },
  navBox: { width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", fontWeight: "bold", fontSize: "18px", cursor: "pointer", backgroundColor: "#e2e8f0", color: "#1e293b" },
  navBoxActive: { backgroundColor: "#306998", color: "white", boxShadow: "0 0 0 3px #FFD43B" },
  navBoxFlagged: { backgroundColor: "#f59e0b", color: "white" },
  navBoxAnswered: { backgroundColor: "#10b981", color: "white" },
  legend: { display: "flex", gap: "24px", fontSize: "14px", color: "#475569", flexWrap: "wrap" },
  legendAnswered: { display: "inline-block", width: "16px", height: "16px", backgroundColor: "#10b981", borderRadius: "4px", marginRight: "6px", verticalAlign: "middle" },
  legendFlagged: { display: "inline-block", width: "16px", height: "16px", backgroundColor: "#f59e0b", borderRadius: "4px", marginRight: "6px", verticalAlign: "middle" },
  legendActive: { display: "inline-block", width: "16px", height: "16px", backgroundColor: "#306998", borderRadius: "4px", marginRight: "6px", verticalAlign: "middle", boxShadow: "0 0 0 1px #FFD43B" },
  legendUnanswered: { display: "inline-block", width: "16px", height: "16px", backgroundColor: "#e2e8f0", borderRadius: "4px", marginRight: "6px", verticalAlign: "middle" },
  fullscreenResult: { minHeight: "100vh", backgroundColor: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins, sans-serif", padding: "80px 20px 20px 20px" },
  resultCardNew: { backgroundColor: "white", borderRadius: "32px", padding: "40px 30px", maxWidth: "600px", width: "100%", textAlign: "center", boxShadow: "0 20px 35px -10px rgba(0,0,0,0.1)", borderTop: "6px solid #306998" },
  resultHeaderNew: { marginBottom: "20px" },
  headerAccentResultNew: { width: "60px", height: "4px", backgroundColor: "#FFD43B", margin: "12px auto 0", borderRadius: "2px" },
  scoreDisplay: { marginBottom: "30px" },
  scoreNumberNew: { fontSize: "72px", fontWeight: "800", color: "#306998", lineHeight: 1 },
  scoreTotalNew: { fontSize: "28px", fontWeight: "500", color: "#64748b" },
  progressContainer: { marginBottom: "35px" },
  progressBar: { backgroundColor: "#e2e8f0", borderRadius: "30px", height: "12px", overflow: "hidden", marginBottom: "8px" },
  progressLabel: { fontSize: "14px", fontWeight: "600", color: "#306998", textAlign: "right" },
  statsGridNew: { display: "flex", justifyContent: "space-between", gap: "15px", marginBottom: "30px", flexWrap: "wrap" },
  statItemNew: { flex: 1, display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "left" },
  statIcon: { fontSize: "28px", fontWeight: "bold", color: "#306998", width: "40px", textAlign: "center" },
  statLabelNew: { fontSize: "12px", fontWeight: "500", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
  statValueNew: { fontSize: "24px", fontWeight: "700", color: "#0f172a", lineHeight: 1.2 },
  resultMessageNew: { marginBottom: "30px" },
  passedBoxNew: { backgroundColor: "#e6f7ec", color: "#2e7d32", padding: "14px", borderRadius: "60px", fontWeight: "600", fontSize: "18px", border: "1px solid #a5d6a7" },
  failedBoxNew: { backgroundColor: "#fee9e6", color: "#c62828", padding: "14px", borderRadius: "60px", fontWeight: "600", fontSize: "18px", border: "1px solid #ffab91" },
  resultActionsNew: { display: "flex", justifyContent: "center", gap: "15px" },
  retryButtonNew: { backgroundColor: "#f59e0b", border: "none", padding: "12px 28px", borderRadius: "40px", fontSize: "16px", fontWeight: "bold", color: "white", cursor: "pointer" },
  petaKonsepButton: { backgroundColor: "#306998", border: "none", padding: "12px 28px", borderRadius: "40px", fontSize: "16px", fontWeight: "bold", color: "white", cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 },
  modal: { background: "white", borderRadius: "32px", padding: "32px", maxWidth: "400px", width: "90%", textAlign: "center", boxShadow: "0 20px 35px rgba(0,0,0,0.2)", animation: "fadeInUp 0.3s ease" },
  modalIcon: { fontSize: "48px", marginBottom: "16px" },
  modalTitle: { fontSize: "24px", fontWeight: "700", color: "#1e3a5f", marginBottom: "12px" },
  modalText: { fontSize: "16px", color: "#334155", lineHeight: "1.5", marginBottom: "24px" },
  modalButtonCancel: { background: "#6c757d", color: "white", border: "none", padding: "10px 24px", borderRadius: "40px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  modalButtonConfirm: { background: "linear-gradient(135deg, #3182ce, #2c5282)", color: "white", border: "none", padding: "10px 24px", borderRadius: "40px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
};