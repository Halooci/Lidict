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
import MateriPagination from "../../komponen/MateriPagination";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

export default function KuisList() {
  const navigate = useNavigate();

  // ---------- AUTENTIKASI & DATA PENGGUNA ----------
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [tokenKelas, setTokenKelas] = useState(null);
  const [kelasId, setKelasId] = useState(null);
  const [kkm, setKkm] = useState(75);
  const [loading, setLoading] = useState(true);
  const [progresBelajar, setProgresBelajar] = useState(null);

  // DURASI KUIS
  const DURASI_KUIS = 600;

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            const progres = mhsData.progres_belajar || 0;
            setProgresBelajar(progres);

            if (progres < 4) {
              navigate('/dashboard');
              return;
            }

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
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (!kelasId) return;
    const fetchKkm = async () => {
      try {
        const kelasSnap = await getDoc(doc(db, 'kelas', kelasId));
        if (kelasSnap.exists()) {
          const data = kelasSnap.data();
          setKkm(data.kkm_kuis_list ?? 75);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchKkm();
  }, [kelasId]);

  const [questions, setQuestions] = useState([]);
  const [loadingSoal, setLoadingSoal] = useState(true);

  useEffect(() => {
    if (!kelasId) return;
    const fetchSoal = async () => {
      try {
        const kuisQuery = query(
          collection(db, 'kuis'),
          where('kelas_id', '==', kelasId),
          where('tipe', '==', 'list')
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

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const answersRef = useRef(answers);
  const [unsures, setUnsures] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURASI_KUIS);
  const timerRef = useRef(null);
  const [resultsData, setResultsData] = useState(null);
  const [savingData, setSavingData] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showUnsureWarningModal, setShowUnsureWarningModal] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
      setUnsures(Array(questions.length).fill(false));
    }
  }, [questions]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

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

  // Handler untuk soal pilihan ganda
  const handleMCAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  // Handler untuk soal esai (input code) – menggunakan CodeMirror
  const handleEssayAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const toggleUnsure = () => {
    const newUnsures = [...unsures];
    newUnsures[currentQuestion] = !newUnsures[currentQuestion];
    setUnsures(newUnsures);
  };

  // ========== FUNGSI PEMBANDING JAWABAN ESAI (lebih pintar) ==========
  const compareEssayAnswers = (userAns, correctAns) => {
    if (!userAns && !correctAns) return true;
    if (!userAns || !correctAns) return false;

    const u = userAns.trim();
    const c = correctAns.trim();

    try {
      const normalize = (s) => {
        let normalized = s.replace(/\s/g, '');
        normalized = normalized.replace(/"/g, "'");
        return normalized;
      };
      return normalize(u) === normalize(c);
    } catch (e) {
      return u === c;
    }
  };

  // ========== PERBAIKAN UTAMA: Simpan nilai tertinggi dengan batas KKM ==========
  const handleSubmit = async (auto = false) => {
    if (submitted || questions.length === 0 || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    stopTimer();
    setSubmitted(true);
    setShowConfirmModal(false);
    setShowWarningModal(false);
    setShowUnsureWarningModal(false);

    const currentAnswers = answersRef.current;

    let score = 0;
    const results = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = currentAnswers[i];
      let isCorrect = false;

      const isEssay = q.isEssay || (q.pilihan && q.pilihan.length === 0);

      if (isEssay) {
        isCorrect = compareEssayAnswers(userAnswer || '', q.jawaban_benar || '');
      } else {
        isCorrect = (userAnswer !== null && userAnswer === Number(q.jawaban_benar));
      }

      if (isCorrect) score++;
      results.push({ ...q, userAnswer, isCorrect });
    }
    const finalScore = score;
    let newScore = finalScore * 10;

    const waktuDigunakan = auto ? DURASI_KUIS : DURASI_KUIS - (timeLeft < 0 ? 0 : timeLeft);
    setResultsData({ results, finalScore, waktuDigunakan });

    // ===== MAHASISWA: Simpan hanya jika nilai lebih tinggi, dengan batas KKM =====
    if (role === 'mahasiswa') {
      setSavingData(true);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error("User ID tidak ditemukan");

        // Batasi nilai maksimal = KKM
        let scoreToSave = newScore;
        if (scoreToSave > kkm) {
          scoreToSave = kkm;
        }

        const nilaiRef = doc(db, "nilai", userId);
        const nilaiDoc = await getDoc(nilaiRef);
        const nilaiData = nilaiDoc.exists() ? nilaiDoc.data() : {};
        const existingScore = nilaiData["Kuis List"] || 0;

        // Bandingkan nilai
        if (scoreToSave > existingScore) {
          // Simpan nilai baru
          await updateDoc(nilaiRef, {
            "Kuis List": scoreToSave
          });

          // Update progres jika lulus
          const mahasiswaRef = doc(db, "mahasiswa", userId);
          const mahasiswaDoc = await getDoc(mahasiswaRef);
          if (mahasiswaDoc.exists()) {
            const isPassed = scoreToSave >= kkm;
            if (isPassed) {
              const currentProgres = mahasiswaDoc.data().progres_belajar || 0;
              if (currentProgres < 5) {
                await updateDoc(mahasiswaRef, {
                  progres_belajar: increment(1)
                });
                setProgresBelajar(currentProgres + 1);
              }
            }
          }
          alert(`Nilai berhasil disimpan: ${scoreToSave}`);
        } else {
          alert(`Nilai Anda saat ini ${existingScore} lebih tinggi dari nilai baru ${scoreToSave}.\nNilai tidak diupdate.`);
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
    const hasUnsure = unsures.some(u => u === true);
    if (hasUnsure) {
      setShowUnsureWarningModal(true);
      return;
    }

    const allAnswered = answers.every((ans, idx) => {
      const q = questions[idx];
      const isEssay = q.isEssay || (q.pilihan && q.pilihan.length === 0);
      if (isEssay) {
        return ans && ans.trim() !== '';
      } else {
        return ans !== null;
      }
    });

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
      setUnsures(Array(questions.length).fill(false));
    }
    setResultsData(null);
    startTimer();
  };

  const goToPreviousMaterial = () => {
    window.location.href = '/List/OperasiDanManipulasi';
  };

  // CSS hover global
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .btn-hover-primary:hover { background-color: #FFD43B !important; color: #306998 !important; transform: translateY(-2px); transition: all 0.2s ease; }
      .btn-hover-unsure:hover { background-color: #FFD43B !important; color: #306998 !important; transform: translateY(-2px); }
      .btn-hover-nav:hover { background-color: #FFD43B !important; color: #306998 !important; transform: translateY(-2px); }
      .btn-hover-submit:hover { background-color: #FFD43B !important; color: #306998 !important; transform: translateY(-2px); }
      .btn-hover-retry:hover { background-color: #e67e22 !important; transform: translateY(-2px); }
      .btn-hover-back:hover { background-color: #5a6268 !important; transform: translateY(-2px); }
      .btn-hover-next:hover { background-color: #1e4a76 !important; transform: translateY(-2px); }
      .nav-box-hover:hover { transform: scale(1.05); box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.15s ease; }
      .cm-editor { border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; }
      .cm-editor.cm-focused { outline: none; border-color: #306998; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Tampilkan loading saat sedang mengambil data
  if (loading) {
    return (
      <>
        <Navbar />
        <SidebarMateri />
        <div className="main-content" style={{ paddingTop: "64px", textAlign: "center", padding: "40px" }}>
          <h2>Memuat data...</h2>
        </div>
      </>
    );
  }

  // RENDER LOADING SOAL
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

  // Tidak ada soal
  if (questions.length === 0 && !submitted) {
    return (
      <>
        <Navbar />
        <SidebarMateri />
        <div className="main-content" style={{ paddingTop: "64px" }}>
          <div style={styles.page}>
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>KUIS LIST</h1>
            </div>
            <div style={styles.cardInstruction}>
              <h2 style={styles.instructionTitle}>Petunjuk</h2>
              <p>Belum ada soal untuk kuis ini. Hubungi dosen pengampu.</p>
            </div>
            <MateriPagination nextDisabled={true} />
          </div>
        </div>
      </>
    );
  }

  // Halaman petunjuk
  if (!quizStarted && !submitted) {
    return (
      <>
        <Navbar />
        <SidebarMateri />
        <div className="main-content" style={{ paddingTop: "64px" }}>
          <div style={styles.page}>
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>KUIS LIST</h1>
            </div>
            <div style={styles.cardInstruction}>
              <h2 style={styles.instructionTitle}>Petunjuk Pengerjaan</h2>
              <ul style={styles.instructionList}>
                <li>Kuis terdiri dari {questions.length} soal (pilihan ganda &amp; isian kode).</li>
                <li>Setiap soal bernilai 10 poin (total maksimal 100).</li>
                <li>Waktu pengerjaan: 10 menit (timer berjalan setelah tombol mulai kuis diklik).</li>
                <li>Gunakan fitur "Ragu-ragu" untuk soal yang perlu ditinjau ulang.</li>
                <li>Pastikan tombol ragu-ragu nonaktif di semua soal sebelum mengumpulkan jawaban.</li>
                <li>Navigasi soal dapat melalui panel kotak nomor atau tombol Sebelumnya/Selanjutnya.</li>
                <li>Pastikan semua soal sudah terjawab sebelum menekan KUMPULKAN JAWABAN.</li>
                <li>Jika waktu habis, jawaban yang sudah terisi akan tersimpan dan terkirim secara otomatis.</li>
                <li>KKM: 75. Jika nilai yang didapat tidak mencapai KKM, maka harus mengerjakan ulang kuis atau mengulang materi lagi.</li>
              </ul>
              <button className="btn-hover-primary" style={styles.startButton} onClick={startQuiz}>MULAI KUIS</button>
            </div>
            <MateriPagination nextDisabled={true} />
          </div>
        </div>
      </>
    );
  }

  // Halaman hasil
  if (submitted && resultsData) {
    const { finalScore, waktuDigunakan } = resultsData;
    const minutesUsed = Math.floor(waktuDigunakan / 60);
    const secondsUsed = waktuDigunakan % 60;
    const totalSoal = questions.length;
    const skorAkhir = finalScore * 10;
    const isPassed = skorAkhir >= kkm;

    return (
      <div style={styles.fullscreenResult}>
        <div style={styles.resultCardNew}>
          <div style={styles.resultHeaderNew}>
            <h1>HASIL KUIS LIST</h1>
            <div style={styles.headerAccentResultNew}></div>
          </div>
          <div style={styles.scoreDisplay}>
            <span style={styles.scoreNumberNew}>{skorAkhir}</span>
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
            {role === 'mahasiswa' ? (
              isPassed ? (
                <div style={styles.passedBoxNew}>
                  Status: LULUS
                </div>
              ) : (
                <div style={styles.failedBoxNew}>
                  Status: TIDAK LULUS
                </div>
              )
            ) : (
              <div style={{ fontSize: '16px', color: '#306998' }}>Nilai akhir: {skorAkhir}</div>
            )}
            {role === 'mahasiswa' && (
              <div style={{ marginTop: '12px', fontSize: '15px', color: '#475569' }}>
                {isPassed
                  ? 'Materi berikutnya sudah terbuka, silahkan akses.'
                  : 'Silahkan ulangi pengerjaan kuis atau kembali ke materi.'}
              </div>
            )}
            {role === 'dosen' && (
              <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#64748b' }}>
                * Sebagai dosen, nilai tidak disimpan.
              </div>
            )}
          </div>
          <div style={styles.resultActionsNew}>
            {role === 'mahasiswa' && !isPassed && (
              <>
                <button className="btn-hover-retry" style={styles.retryButtonNew} onClick={resetQuiz} disabled={savingData}>Ulangi Kuis</button>
                <button className="btn-hover-back" style={styles.backMaterialButtonNew} onClick={goToPreviousMaterial}>Kembali ke Materi Sebelumnya</button>
              </>
            )}
            {role === 'mahasiswa' && isPassed && (
              <button className="btn-hover-next" style={styles.nextMaterialButtonNew} onClick={() => window.location.href = '/NestedList/PendahuluanNestedList'}>Lanjut ke Materi Selanjutnya</button>
            )}
            {role === 'dosen' && (
              <button className="btn-hover-retry" style={styles.retryButtonNew} onClick={resetQuiz} disabled={savingData}>Ulangi Kuis</button>
            )}
          </div>
          <div style={{ marginTop: '20px' }}>
            {/* <MateriPagination nextDisabled={true} /> */}
          </div>
        </div>
      </div>
    );
  }

  // Halaman kuis aktif (mobile)
  if (isMobile) {
    const q = questions[currentQuestion];
    const isUnsure = unsures[currentQuestion];
    const isEssay = q.isEssay || (q.pilihan && q.pilihan.length === 0);

    return (
      <div style={stylesMobile.fullscreenQuiz}>
        <div style={stylesMobile.quizHeader}>
          <div style={stylesMobile.quizTitle}>KUIS LIST</div>
          <div style={stylesMobile.timerBox}>
            <span style={stylesMobile.timerIcon}>⏱</span>
            <span style={timeLeft < 60 ? stylesMobile.timerDanger : stylesMobile.timerText}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div style={stylesMobile.content}>
          <div style={stylesMobile.navGridContainer}>
            <div style={stylesMobile.navLabel}>Navigasi Soal</div>
            <div style={stylesMobile.navGrid}>
              {questions.map((_, idx) => {
                let boxStyle = stylesMobile.navBox;
                if (idx === currentQuestion) {
                  boxStyle = { ...stylesMobile.navBox, ...stylesMobile.navBoxActive };
                } else if (unsures[idx]) {
                  boxStyle = { ...stylesMobile.navBox, ...stylesMobile.navBoxUnsure };
                } else if (answers[idx] !== null && (typeof answers[idx] === 'string' ? answers[idx].trim() !== '' : true)) {
                  boxStyle = { ...stylesMobile.navBox, ...stylesMobile.navBoxAnswered };
                }
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
            <div style={stylesMobile.legend}>
              <span><span style={stylesMobile.legendAnswered}></span> Terjawab</span>
              <span><span style={stylesMobile.legendUnsure}></span> Ragu</span>
              <span><span style={stylesMobile.legendActive}></span> Aktif</span>
              <span><span style={stylesMobile.legendUnanswered}></span> Kosong</span>
            </div>
            <div style={stylesMobile.submitWrapper}>
              <button
                className="btn-hover-submit"
                onClick={handleCollectClick}
                style={stylesMobile.submitButton}
                disabled={savingData}
              >
                {savingData ? "Menyimpan..." : "KUMPULKAN JAWABAN"}
              </button>
            </div>
          </div>

          <div style={stylesMobile.questionCard}>
            <div style={stylesMobile.questionHeader}>
              <h3 style={stylesMobile.questionNumber}>Soal {currentQuestion + 1} dari {questions.length}</h3>
              <div style={stylesMobile.actionButtons}>
                <button
                  className="btn-hover-unsure"
                  style={isUnsure ? stylesMobile.unsureButtonActive : stylesMobile.unsureButton}
                  onClick={toggleUnsure}
                >
                  Ragu-ragu
                </button>
              </div>
            </div>
            <p style={stylesMobile.questionText}>{q.pertanyaan}</p>

            {isEssay ? (
              <div style={stylesMobile.essayContainer}>
                <CodeMirror
                  value={answers[currentQuestion] || ''}
                  onChange={handleEssayAnswer}
                  extensions={[python()]}
                  theme="light"
                  style={{ fontSize: '14px', fontFamily: 'monospace' }}
                  basicSetup={{
                    lineNumbers: true,
                    tabSize: 2,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                  }}
                  height="auto"
                  minHeight="120px"
                  maxHeight="300px"
                  width="100%"
                />
              </div>
            ) : (
              <div style={stylesMobile.optionsContainer}>
                {q.pilihan.map((opt, idx) => (
                  <label key={idx} style={stylesMobile.optionLabel}>
                    <input
                      type="radio"
                      name="question"
                      value={idx}
                      checked={answers[currentQuestion] === idx}
                      onChange={() => handleMCAnswer(idx)}
                    />
                    <span style={stylesMobile.optionLetter}>{String.fromCharCode(65 + idx)}.</span> {opt}
                  </label>
                ))}
              </div>
            )}

            <div style={stylesMobile.navButtons}>
              <button
                className="btn-hover-nav"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                style={currentQuestion === 0 ? stylesMobile.navButtonDisabled : stylesMobile.navButton}
              >
                Sebelumnya
              </button>
              <button
                className="btn-hover-nav"
                onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestion === questions.length - 1}
                style={currentQuestion === questions.length - 1 ? stylesMobile.navButtonDisabled : stylesMobile.navButton}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showConfirmModal && (
          <div style={stylesMobile.modalOverlay}>
            <div style={stylesMobile.modalContainer}>
              <h3 style={stylesMobile.modalTitle}>Konfirmasi Kumpulkan Jawaban</h3>
              <p style={stylesMobile.modalMessage}>
                Apakah Anda yakin ingin mengumpulkan semua jawaban?<br />
                Pastikan Anda telah memeriksa kembali jawaban Anda.
              </p>
              <div style={stylesMobile.modalButtons}>
                <button
                  style={stylesMobile.modalButtonYes}
                  onClick={() => handleSubmit(false)}
                  className="btn-hover-primary"
                >
                  Ya
                </button>
                <button
                  style={stylesMobile.modalButtonCheck}
                  onClick={() => setShowConfirmModal(false)}
                  className="btn-hover-nav"
                >
                  Periksa Jawaban Kembali
                </button>
              </div>
            </div>
          </div>
        )}

        {showWarningModal && (
          <div style={stylesMobile.modalOverlay}>
            <div style={stylesMobile.modalContainerWarning}>
              <h3 style={stylesMobile.modalTitleWarning}>Peringatan</h3>
              <p style={stylesMobile.modalMessageWarning}>
                Anda belum menjawab semua soal.<br />
                Harap selesaikan semua soal terlebih dahulu sebelum mengumpulkan.
              </p>
              <div style={stylesMobile.modalButtons}>
                <button
                  style={stylesMobile.modalButtonWarning}
                  onClick={() => setShowWarningModal(false)}
                  className="btn-hover-nav"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {showUnsureWarningModal && (
          <div style={stylesMobile.modalOverlay}>
            <div style={stylesMobile.modalContainerWarning}>
              <h3 style={stylesMobile.modalTitleWarning}>Ragu-ragu Aktif</h3>
              <p style={stylesMobile.modalMessageWarning}>
                Masih ada soal yang ditandai Ragu-ragu.<br />
                Harap nonaktifkan tombol ragu-ragu pada semua soal sebelum mengumpulkan jawaban.
              </p>
              <div style={stylesMobile.modalButtons}>
                <button
                  style={stylesMobile.modalButtonWarning}
                  onClick={() => setShowUnsureWarningModal(false)}
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

  // Desktop kuis aktif
  const q = questions[currentQuestion];
  const isUnsure = unsures[currentQuestion];
  const isEssay = q.isEssay || (q.pilihan && q.pilihan.length === 0);

  return (
    <div style={styles.fullscreenQuiz}>
      <div style={styles.quizHeader}>
        <div style={styles.quizTitle}>KUIS LIST</div>
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
            <h3 style={styles.questionNumber}>Soal {currentQuestion + 1} dari {questions.length}</h3>
            <div style={styles.actionButtons}>
              <button
                className="btn-hover-unsure"
                style={isUnsure ? styles.unsureButtonActive : styles.unsureButton}
                onClick={toggleUnsure}
              >
                Ragu-ragu
              </button>
            </div>
          </div>
          <p style={styles.questionText}>{q.pertanyaan}</p>

          {isEssay ? (
            <div style={styles.essayContainer}>
              <CodeMirror
                value={answers[currentQuestion] || ''}
                onChange={handleEssayAnswer}
                extensions={[python()]}
                theme="light"
                style={{ fontSize: '15px', fontFamily: 'monospace' }}
                basicSetup={{
                  lineNumbers: true,
                  tabSize: 2,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                }}
                height="auto"
                minHeight="150px"
                maxHeight="400px"
                width="100%"
              />
            </div>
          ) : (
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
          )}

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
        </div>

        <div style={styles.navGridContainer}>
          <div style={styles.navLabel}>Navigasi Soal</div>
          <div style={styles.navGrid}>
            {questions.map((_, idx) => {
              let boxStyle = styles.navBox;
              if (idx === currentQuestion) {
                boxStyle = { ...styles.navBox, ...styles.navBoxActive };
              } else if (unsures[idx]) {
                boxStyle = { ...styles.navBox, ...styles.navBoxUnsure };
              } else if (answers[idx] !== null && (typeof answers[idx] === 'string' ? answers[idx].trim() !== '' : true)) {
                boxStyle = { ...styles.navBox, ...styles.navBoxAnswered };
              }
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
            <span><span style={styles.legendUnsure}></span> Ragu</span>
            <span><span style={styles.legendActive}></span> Aktif</span>
            <span><span style={styles.legendUnanswered}></span> Kosong</span>
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
      </div>

      {/* Modal */}
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

      {showWarningModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainerWarning}>
            <h3 style={styles.modalTitleWarning}>Peringatan</h3>
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

      {showUnsureWarningModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainerWarning}>
            <h3 style={styles.modalTitleWarning}>Ragu-ragu Aktif</h3>
            <p style={styles.modalMessageWarning}>
              Masih ada soal yang ditandai Ragu-ragu.<br />
              Harap nonaktifkan tombol ragu-ragu pada semua soal sebelum mengumpulkan jawaban.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.modalButtonWarning}
                onClick={() => setShowUnsureWarningModal(false)}
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

/* ==================== STYLE DESKTOP ==================== */
const styles = {
  page: {
    padding: "68px 40px 30px 40px",
    backgroundColor: "#f5f7fa",
    minHeight: "calc(100vh - 64px)",
    fontFamily: "Poppins, sans-serif",
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "16px 24px",
    position: "relative",
    marginBottom: "24px",
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
    fontSize: "26px",
    fontWeight: "700",
  },
  cardInstruction: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "28px 32px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    maxWidth: "800px",
    margin: "0 auto",
  },
  instructionTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#306998",
    marginBottom: "16px",
    borderLeft: "5px solid #FFD43B",
    paddingLeft: "16px",
  },
  instructionList: {
    lineHeight: "1.9",
    fontSize: "16px",
    color: "#2d3748",
    marginBottom: "28px",
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
    height: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f7fa",
    fontFamily: "Poppins, sans-serif",
    padding: "10px 40px 14px 40px",
    overflow: "hidden",
  },
  quizHeader: {
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#306998",
    borderRadius: "16px",
    padding: "10px 28px",
    marginBottom: "16px",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  quizTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  timerBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "4px 16px",
    borderRadius: "60px",
  },
  timerIcon: { fontSize: "20px" },
  timerText: { fontSize: "24px", fontWeight: "700", fontFamily: "monospace" },
  timerDanger: {
    fontSize: "24px",
    fontWeight: "700",
    fontFamily: "monospace",
    color: "#FFD43B",
  },
  twoColumnLayout: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: "20px",
    minHeight: 0,
    overflow: "hidden",
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: "18px",
    padding: "18px 22px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    flexWrap: "wrap",
  },
  questionNumber: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#306998",
    margin: 0,
  },
  actionButtons: { display: "flex", gap: "8px" },
  unsureButton: {
    backgroundColor: "#f1f5f9",
    border: "none",
    padding: "4px 14px",
    borderRadius: "40px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#334155",
  },
  unsureButtonActive: {
    backgroundColor: "#FFD43B",
    border: "none",
    padding: "4px 14px",
    borderRadius: "40px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#306998",
    border: "1px solid #eab308",
  },
  questionText: {
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "12px",
    color: "#0f172a",
    fontWeight: "500",
    whiteSpace: "pre-line",
    flexShrink: 0,
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    marginBottom: "14px",
    overflowY: "auto",
    flex: "1 1 auto",
    paddingRight: "4px",
  },
  optionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "15px",
    padding: "7px 14px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
    border: "1px solid #e2e8f0",
  },
  optionLetter: {
    fontWeight: "bold",
    color: "#306998",
    width: "24px",
    fontSize: "14px",
  },
  essayContainer: {
    flex: "1 1 auto",
    marginBottom: "14px",
    display: "flex",
    flexDirection: "column",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "4px",
    flexShrink: 0,
  },
  navButton: {
    backgroundColor: "#e2e8f0",
    border: "none",
    padding: "7px 16px",
    borderRadius: "40px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    flex: 1,
    maxWidth: "120px",
  },
  navButtonDisabled: {
    backgroundColor: "#cbd5e1",
    border: "none",
    padding: "7px 16px",
    borderRadius: "40px",
    fontWeight: "600",
    fontSize: "14px",
    flex: 1,
    maxWidth: "120px",
    cursor: "not-allowed",
    color: "#64748b",
  },

  navGridContainer: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  navLabel: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#2c3e50",
  },
  navGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "12px",
  },
  navBox: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    backgroundColor: "#e2e8f0",
    color: "#1e293b",
  },
  navBoxActive: {
    backgroundColor: "#306998",
    color: "white",
    boxShadow: "0 0 0 2px #FFD43B",
  },
  navBoxUnsure: {
    backgroundColor: "#FFD43B",
    color: "#306998",
  },
  navBoxAnswered: {
    backgroundColor: "#10b981",
    color: "white",
  },
  legend: {
    display: "flex",
    gap: "12px",
    fontSize: "12px",
    color: "#475569",
    flexWrap: "wrap",
    marginBottom: "6px",
  },
  legendAnswered: {
    display: "inline-block",
    width: "12px",
    height: "12px",
    backgroundColor: "#10b981",
    borderRadius: "3px",
    marginRight: "4px",
    verticalAlign: "middle",
  },
  legendUnsure: {
    display: "inline-block",
    width: "12px",
    height: "12px",
    backgroundColor: "#FFD43B",
    borderRadius: "3px",
    marginRight: "4px",
    verticalAlign: "middle",
  },
  legendActive: {
    display: "inline-block",
    width: "12px",
    height: "12px",
    backgroundColor: "#306998",
    borderRadius: "3px",
    marginRight: "4px",
    verticalAlign: "middle",
    boxShadow: "0 0 0 1px #FFD43B",
  },
  legendUnanswered: {
    display: "inline-block",
    width: "12px",
    height: "12px",
    backgroundColor: "#e2e8f0",
    borderRadius: "3px",
    marginRight: "4px",
    verticalAlign: "middle",
  },
  submitWrapper: {
    textAlign: "center",
    paddingTop: "6px",
  },
  submitButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "9px 18px",
    borderRadius: "40px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },

  fullscreenResult: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, sans-serif",
    padding: "68px 20px 20px 20px",
  },
  resultCardNew: {
    backgroundColor: "white",
    borderRadius: "28px",
    padding: "30px 28px",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 35px -10px rgba(0,0,0,0.1)",
    borderTop: "6px solid #306998",
  },
  resultHeaderNew: { marginBottom: "16px" },
  headerAccentResultNew: {
    width: "50px",
    height: "4px",
    backgroundColor: "#FFD43B",
    margin: "8px auto 0",
    borderRadius: "2px",
  },
  scoreDisplay: { marginBottom: "18px" },
  scoreNumberNew: {
    fontSize: "60px",
    fontWeight: "800",
    color: "#306998",
    lineHeight: 1,
  },
  statsGridNew: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  statItemNew: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8fafc",
    padding: "8px 12px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    textAlign: "left",
  },
  statIcon: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#306998",
    width: "28px",
    textAlign: "center",
  },
  statLabelNew: {
    fontSize: "10px",
    fontWeight: "500",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValueNew: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 1.2,
  },
  resultMessageNew: { marginBottom: "20px" },
  passedBoxNew: {
    backgroundColor: "#e6f7ec",
    color: "#2e7d32",
    padding: "10px",
    borderRadius: "60px",
    fontWeight: "600",
    fontSize: "16px",
    border: "1px solid #a5d6a7",
  },
  failedBoxNew: {
    backgroundColor: "#fee9e6",
    color: "#c62828",
    padding: "10px",
    borderRadius: "60px",
    fontWeight: "600",
    fontSize: "16px",
    border: "1px solid #ffab91",
  },
  resultActionsNew: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  retryButtonNew: {
    backgroundColor: "#f59e0b",
    border: "none",
    padding: "8px 20px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
  },
  backMaterialButtonNew: {
    backgroundColor: "#6c757d",
    border: "none",
    padding: "8px 20px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
  },
  nextMaterialButtonNew: {
    backgroundColor: "#306998",
    border: "none",
    padding: "8px 20px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
  },

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
    borderRadius: "20px",
    padding: "24px 20px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
    borderTop: "6px solid #306998",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#306998",
    marginBottom: "12px",
  },
  modalMessage: {
    fontSize: "14px",
    color: "#334155",
    marginBottom: "20px",
    lineHeight: 1.5,
  },
  modalButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  modalButtonYes: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "100px",
  },
  modalButtonCheck: {
    backgroundColor: "#f1f5f9",
    color: "#1e293b",
    border: "1px solid #cbd5e1",
    padding: "8px 20px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    minWidth: "140px",
  },
  modalContainerWarning: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "24px 20px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
    borderTop: "6px solid #f59e0b",
  },
  modalTitleWarning: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f59e0b",
    marginBottom: "12px",
  },
  modalMessageWarning: {
    fontSize: "14px",
    color: "#334155",
    marginBottom: "20px",
    lineHeight: 1.5,
  },
  modalButtonWarning: {
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "80px",
  },
};

/* ==================== STYLE MOBILE ==================== */
const stylesMobile = {
  fullscreenQuiz: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f7fa",
    fontFamily: "Poppins, sans-serif",
    padding: "8px 12px 12px 12px",
    overflow: "auto",
  },
  quizHeader: {
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#306998",
    borderRadius: "12px",
    padding: "8px 16px",
    marginBottom: "12px",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  quizTitle: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  timerBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "4px 12px",
    borderRadius: "60px",
  },
  timerIcon: { fontSize: "16px" },
  timerText: { fontSize: "18px", fontWeight: "700", fontFamily: "monospace" },
  timerDanger: {
    fontSize: "18px",
    fontWeight: "700",
    fontFamily: "monospace",
    color: "#FFD43B",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflow: "auto",
    paddingBottom: "6px",
  },
  navGridContainer: {
    backgroundColor: "white",
    borderRadius: "14px",
    padding: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    flexShrink: 0,
  },
  navLabel: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#2c3e50",
  },
  navGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "10px",
  },
  navBox: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#e2e8f0",
    color: "#1e293b",
  },
  navBoxActive: {
    backgroundColor: "#306998",
    color: "white",
    boxShadow: "0 0 0 2px #FFD43B",
  },
  navBoxUnsure: {
    backgroundColor: "#FFD43B",
    color: "#306998",
  },
  navBoxAnswered: {
    backgroundColor: "#10b981",
    color: "white",
  },
  legend: {
    display: "flex",
    gap: "10px",
    fontSize: "11px",
    color: "#475569",
    flexWrap: "wrap",
    marginBottom: "6px",
  },
  legendAnswered: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    backgroundColor: "#10b981",
    borderRadius: "3px",
    marginRight: "3px",
    verticalAlign: "middle",
  },
  legendUnsure: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    backgroundColor: "#FFD43B",
    borderRadius: "3px",
    marginRight: "3px",
    verticalAlign: "middle",
  },
  legendActive: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    backgroundColor: "#306998",
    borderRadius: "3px",
    marginRight: "3px",
    verticalAlign: "middle",
    boxShadow: "0 0 0 1px #FFD43B",
  },
  legendUnanswered: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    backgroundColor: "#e2e8f0",
    borderRadius: "3px",
    marginRight: "3px",
    verticalAlign: "middle",
  },
  submitWrapper: {
    textAlign: "center",
    paddingTop: "6px",
  },
  submitButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "40px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "14px 16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
    flexWrap: "wrap",
  },
  questionNumber: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#306998",
    margin: 0,
  },
  actionButtons: { display: "flex", gap: "6px" },
  unsureButton: {
    backgroundColor: "#f1f5f9",
    border: "none",
    padding: "3px 12px",
    borderRadius: "40px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#334155",
  },
  unsureButtonActive: {
    backgroundColor: "#FFD43B",
    border: "none",
    padding: "3px 12px",
    borderRadius: "40px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#306998",
    border: "1px solid #eab308",
  },
  questionText: {
    fontSize: "15px",
    lineHeight: "1.4",
    marginBottom: "10px",
    color: "#0f172a",
    fontWeight: "500",
    whiteSpace: "pre-line",
    flexShrink: 0,
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "12px",
    overflowY: "auto",
    flex: "1 1 auto",
    paddingRight: "2px",
  },
  optionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    padding: "6px 10px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
    border: "1px solid #e2e8f0",
  },
  optionLetter: {
    fontWeight: "bold",
    color: "#306998",
    width: "20px",
    fontSize: "13px",
  },
  essayContainer: {
    flex: "1 1 auto",
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "4px",
    flexShrink: 0,
  },
  navButton: {
    backgroundColor: "#e2e8f0",
    border: "none",
    padding: "6px 14px",
    borderRadius: "40px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    flex: 1,
    maxWidth: "100px",
  },
  navButtonDisabled: {
    backgroundColor: "#cbd5e1",
    border: "none",
    padding: "6px 14px",
    borderRadius: "40px",
    fontWeight: "600",
    fontSize: "13px",
    flex: 1,
    maxWidth: "100px",
    cursor: "not-allowed",
    color: "#64748b",
  },

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
    borderRadius: "18px",
    padding: "20px 18px",
    maxWidth: "360px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
    borderTop: "6px solid #306998",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#306998",
    marginBottom: "10px",
  },
  modalMessage: {
    fontSize: "14px",
    color: "#334155",
    marginBottom: "18px",
    lineHeight: 1.5,
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  modalButtonYes: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "7px 16px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "80px",
  },
  modalButtonCheck: {
    backgroundColor: "#f1f5f9",
    color: "#1e293b",
    border: "1px solid #cbd5e1",
    padding: "7px 16px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    minWidth: "120px",
  },
  modalContainerWarning: {
    backgroundColor: "white",
    borderRadius: "18px",
    padding: "20px 18px",
    maxWidth: "360px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
    borderTop: "6px solid #f59e0b",
  },
  modalTitleWarning: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f59e0b",
    marginBottom: "10px",
  },
  modalMessageWarning: {
    fontSize: "14px",
    color: "#334155",
    marginBottom: "18px",
    lineHeight: 1.5,
  },
  modalButtonWarning: {
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    padding: "7px 16px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "70px",
  },
};