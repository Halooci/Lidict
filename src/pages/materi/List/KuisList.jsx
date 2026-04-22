import { useState, useEffect, useRef } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function KuisList() {
  // ---------- STATE ----------
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [flags, setFlags] = useState(Array(10).fill(false));
  const [unsures, setUnsures] = useState(Array(10).fill(false));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 menit
  const timerRef = useRef(null);
  const [resultsData, setResultsData] = useState(null);

  // State untuk jawaban drag-drop (5 soal)
  const [dragAnswers, setDragAnswers] = useState(Array(5).fill().map(() => []));

  // ---------- DATA SOAL (10 soal: 5 Multiple Choice + 5 Drag-Drop) ----------
  const questions = [
    // 5 PILIHAN GANDA
    {
      id: 1,
      type: "multiple_choice",
      text: "Cara yang benar untuk membuat list kosong di Python adalah ...",
      options: [
        "A. list = []",
        "B. list = ()",
        "C. list = {}",
        "D. list = list[]",
        "E. list = empty()"
      ],
      correct: 0,
      explanation: "List kosong dibuat dengan kurung siku tanpa elemen: []"
    },
    {
      id: 2,
      type: "multiple_choice",
      text: "Output dari kode berikut adalah ... \n\n```python\nbuah = ['apel', 'mangga', 'jeruk']\nprint(buah[-1])\n```",
      options: [
        "A. apel",
        "B. mangga",
        "C. jeruk",
        "D. Error",
        "E. None"
      ],
      correct: 2,
      explanation: "Indeks -1 mengakses elemen terakhir dari list, yaitu 'jeruk'."
    },
    {
      id: 3,
      type: "multiple_choice",
      text: "Perhatikan kode berikut:\n\n```python\nangka = [10, 20, 30, 40, 50]\nprint(angka[1:4])\n```\nOutputnya adalah ...",
      options: [
        "A. [10, 20, 30]",
        "B. [20, 30, 40]",
        "C. [20, 30, 40, 50]",
        "D. [10, 20, 30, 40]",
        "E. [30, 40, 50]"
      ],
      correct: 1,
      explanation: "Slicing [1:4] mengambil indeks 1 sampai 3 (indeks 4 tidak termasuk), yaitu [20,30,40]."
    },
    {
      id: 4,
      type: "multiple_choice",
      text: "Method yang digunakan untuk menambahkan elemen di akhir list adalah ...",
      options: [
        "A. insert()",
        "B. extend()",
        "C. add()",
        "D. append()",
        "E. push()"
      ],
      correct: 3,
      explanation: "append() menambahkan elemen tunggal di akhir list."
    },
    {
      id: 5,
      type: "multiple_choice",
      text: "Hasil dari kode berikut adalah ...\n\n```python\na = [1, 2, 3]\nb = a\na.append(4)\nprint(b)\n```",
      options: [
        "A. [1, 2, 3]",
        "B. [1, 2, 3, 4]",
        "C. Error",
        "D. [1, 2, 3, 4, 4]",
        "E. None"
      ],
      correct: 1,
      explanation: "b merujuk ke list yang sama dengan a, sehingga perubahan pada a juga terlihat pada b."
    },
    // 5 DRAG AND DROP
    {
      id: 6,
      type: "dragdrop",
      text: "Lengkapi kode untuk mengambil elemen ke 3 dari list berikut:",
      codeTemplate: `warna = ['merah', 'kuning', 'hijau', 'biru']\nprint(warna[______])`,
      placeholders: ["2"],
      dragItems: ["0", "1", "2", "3", "4"],
      correct: ["2"],
      explanation: "Indeks ke 3 adalah indeks 2 karena indexing dimulai dari 0."
    },
    {
      id: 7,
      type: "dragdrop",
      text: "Lengkapi kode untuk mengubah elemen pertama menjadi 'Python':",
      codeTemplate: `bahasa = ['Java', 'C++', 'JavaScript']\nbahasa[______] = 'Python'\nprint(bahasa)`,
      placeholders: ["0"],
      dragItems: ["0", "1", "2", "-1", "append"],
      correct: ["0"],
      explanation: "Indeks 0 adalah elemen pertama."
    },
    {
      id: 8,
      type: "dragdrop",
      text: "Lengkapi kode untuk menggabungkan dua list menggunakan method yang tepat:",
      codeTemplate: `list1 = [1, 2, 3]\nlist2 = [4, 5, 6]\nlist1.______(list2)\nprint(list1)`,
      placeholders: ["extend"],
      dragItems: ["append", "extend", "merge", "join", "add"],
      correct: ["extend"],
      explanation: "extend() menambahkan semua elemen dari list2 ke list1."
    },
    {
      id: 9,
      type: "dragdrop",
      text: "Lengkapi kode untuk membuat list berisi kuadrat dari 0 sampai 4 menggunakan list comprehension:",
      codeTemplate: `kuadrat = [x**2 for x in range(______)]\nprint(kuadrat)`,
      placeholders: ["5"],
      dragItems: ["4", "5", "6", "range(5)", "0-4"],
      correct: ["5"],
      explanation: "range(5) menghasilkan 0,1,2,3,4 sehingga ada 5 elemen."
    },
    {
      id: 10,
      type: "dragdrop",
      text: "Lengkapi kode untuk menghapus elemen 'mangga' dari list:",
      codeTemplate: `buah = ['apel', 'mangga', 'jeruk']\nbuah.______('mangga')\nprint(buah)`,
      placeholders: ["remove"],
      dragItems: ["pop", "remove", "del", "delete", "discard"],
      correct: ["remove"],
      explanation: "remove() menghapus elemen pertama yang nilainya sesuai."
    }
  ];

  // ---------- HELPER FUNCTIONS ----------
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!submitted && quizStarted) handleSubmit(true);
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

  const handleMCAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  // Drag & Drop handlers
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e, dragQuestionIdx, placeholderIdx) => {
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData("text/plain");
    const newDragAnswers = [...dragAnswers];
    if (!newDragAnswers[dragQuestionIdx]) newDragAnswers[dragQuestionIdx] = [];
    newDragAnswers[dragQuestionIdx][placeholderIdx] = draggedItem;
    setDragAnswers(newDragAnswers);
    const globalIdx = 5 + dragQuestionIdx;
    const newAnswers = [...answers];
    newAnswers[globalIdx] = newDragAnswers[dragQuestionIdx].join("|");
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

  const handleSubmit = (auto = false) => {
    if (submitted) return;
    stopTimer();
    setSubmitted(true);
    let score = 0;
    const results = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      let userAnswer = answers[i];
      let isCorrect = false;
      if (q.type === "multiple_choice") {
        isCorrect = (userAnswer === q.correct);
      } else if (q.type === "dragdrop") {
        const userAnswersArray = userAnswer ? userAnswer.split("|") : [];
        if (userAnswersArray.length === q.correct.length) {
          isCorrect = userAnswersArray.every((val, idx) => val === q.correct[idx]);
        } else {
          isCorrect = false;
        }
      }
      if (isCorrect) score++;
      results.push({ ...q, userAnswer, isCorrect });
    }
    const finalScore = score;
    const waktuDigunakan = (20 * 60) - timeLeft;
    setResultsData({ results, finalScore, waktuDigunakan });
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers(Array(10).fill(null));
    setFlags(Array(10).fill(false));
    setUnsures(Array(10).fill(false));
    setSubmitted(false);
    setTimeLeft(20 * 60);
    setDragAnswers(Array(5).fill().map(() => []));
    setResultsData(null);
    stopTimer();
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(20 * 60);
    setSubmitted(false);
    setCurrentQuestion(0);
    setAnswers(Array(10).fill(null));
    setFlags(Array(10).fill(false));
    setUnsures(Array(10).fill(false));
    setDragAnswers(Array(5).fill().map(() => []));
    setResultsData(null);
    stopTimer();
    startTimer();
  };

  const goToPreviousMaterial = () => {
    window.location.href = '/List/PendahuluanList';
  };

  // Efek untuk menambahkan CSS global hover
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

  // ---------- RENDER HALAMAN PETUNJUK (dengan Navbar & SidebarMateri) ----------
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
                <li>Kuis terdiri dari 10 soal.</li>
                <li>Setiap soal bernilai 10 poin (total maksimal 100).</li>
                <li>Waktu pengerjaan: 20 menit (timer berjalan setelah mulai).</li>
                <li>Jika waktu habis, jawaban yang sudah terisi akan tersimpan dan terkirim secara otomatis.</li>
                {/* <li>Gunakan fitur "Flag" (🚩) dan "Ragu" (🤔) untuk menandai soal.</li> */}
                {/* <li>Navigasi soal melalui panel kotak nomor di sebelah kanan.</li> */}
                <li>Pastikan semua jawaban sudah dipilih sebelum menekan KUMPULKAN JAWABAN.</li>
                <li>Pastikan perangkat terhubung dengan koneksi internet yang stabil.</li>
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

  // ---------- RENDER HALAMAN HASIL (fullscreen, tanpa sidebar) ----------
  if (submitted && resultsData) {
    const { finalScore, waktuDigunakan } = resultsData;
    const minutesUsed = Math.floor(waktuDigunakan / 60);
    const secondsUsed = waktuDigunakan % 60;
    const skor100 = finalScore * 10;
    const isPassed = skor100 >= 70;
    const percentage = skor100;

    return (
      <div style={styles.fullscreenResult}>
        <div style={styles.resultCardNew}>
          <div style={styles.resultHeaderNew}>
            <h1>HASIL KUIS LIST</h1>
            <div style={styles.headerAccentResultNew}></div>
          </div>
          <div style={styles.scoreDisplay}>
            <span style={styles.scoreNumberNew}>{skor100}</span>
            <span style={styles.scoreTotalNew}>/100</span>
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
            <div style={styles.progressLabel}>{skor100}%</div>
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
                <div style={styles.statValueNew}>{10 - finalScore}</div>
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
              <div style={styles.passedBoxNew}>SELAMAT! Anda LULUS dengan nilai {skor100}</div>
            ) : (
              <div style={styles.failedBoxNew}>MOHON MAAF, Anda TIDAK LULUS (Nilai {skor100} &lt; 70)</div>
            )}
          </div>
          <div style={styles.resultActionsNew}>
            <button 
              className="btn-hover-retry"
              style={styles.retryButtonNew} 
              onClick={resetQuiz}
            >Ulangi Kuis</button>
            {!isPassed && (
              <button 
                className="btn-hover-back"
                style={styles.backMaterialButtonNew} 
                onClick={goToPreviousMaterial}
              >Kembali ke Materi Sebelumnya</button>
            )}
            {isPassed && (
              <button 
                className="btn-hover-next"
                style={styles.nextMaterialButtonNew}
                onClick={() => window.location.href = '/NestedList/PendahuluanNestedList'}
              >Lanjut ke Materi Selanjutnya</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- RENDER HALAMAN KUIS (fullscreen, dua kolom) ----------
  const q = questions[currentQuestion];
  const isFlagged = flags[currentQuestion];
  const isUnsure = unsures[currentQuestion];
  const isDragDrop = q.type === "dragdrop";
  const dragQuestionIdx = currentQuestion - 5;

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
        {/* Kolom Kiri - Soal */}
        <div style={styles.questionCard}>
          <div style={styles.questionHeader}>
            <h3 style={styles.questionNumber}>Soal {currentQuestion + 1} dari 10</h3>
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
          <p style={styles.questionText}>{q.text}</p>

          {q.type === "multiple_choice" && (
            <div style={styles.optionsContainer}>
              {q.options.map((opt, idx) => (
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

          {isDragDrop && (
            <div>
              <div style={styles.codeBlock}>
                {q.codeTemplate.split('______').map((part, idx) => (
                  <span key={idx}>
                    {part}
                    {idx < q.placeholders.length && (
                      <span
                        style={styles.dropZone}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, dragQuestionIdx, idx)}
                      >
                        {dragAnswers[dragQuestionIdx] && dragAnswers[dragQuestionIdx][idx]
                          ? dragAnswers[dragQuestionIdx][idx]
                          : '______'}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <div style={styles.dragItems}>
                {q.dragItems.map((item, idx) => (
                  <div
                    key={idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    style={styles.dragItem}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>Seret kata/kode ke area kosong di atas.</p>
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

          <div style={styles.submitWrapper}>
            <button 
              className="btn-hover-submit"
              onClick={() => handleSubmit()} 
              style={styles.submitButton}
            >KUMPULKAN JAWABAN</button>
          </div>
        </div>

        {/* Kolom Kanan - Navigasi Soal */}
        <div style={styles.navGridContainer}>
          <div style={styles.navLabel}>Navigasi Soal</div>
          <div style={styles.navGrid}>
            {questions.map((_, idx) => {
              let boxStyle = styles.navBox;
              let additionalClass = "nav-box-hover";
              if (idx === currentQuestion) boxStyle = { ...styles.navBox, ...styles.navBoxActive };
              else if (flags[idx]) boxStyle = { ...styles.navBox, ...styles.navBoxFlagged };
              else if (unsures[idx]) boxStyle = { ...styles.navBox, ...styles.navBoxUnsure };
              else if (answers[idx] !== null && answers[idx] !== "") boxStyle = { ...styles.navBox, ...styles.navBoxAnswered };
              else boxStyle = styles.navBox;

              return (
                <div
                  key={idx}
                  className={additionalClass}
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
    </div>
  );
}

/* ================== STYLE (RAPI & TERSTRUKTUR) ================== */
const styles = {
  // ----- INSTRUCTION PAGE -----
  page: {
    padding: "30px 40px",
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

  // ----- FULLSCREEN QUIZ (dua kolom) -----
  fullscreenQuiz: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "Poppins, sans-serif",
    padding: "20px 40px",
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
  codeBlock: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflowX: "auto",
    lineHeight: "1.8",
  },
  dropZone: {
    display: "inline-block",
    minWidth: "100px",
    backgroundColor: "#3c3c3c",
    border: "2px dashed #FFD43B",
    borderRadius: "4px",
    padding: "2px 8px",
    margin: "0 2px",
    textAlign: "center",
    color: "#FFD43B",
    fontWeight: "bold",
  },
  dragItems: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
    justifyContent: "center",
  },
  dragItem: {
    backgroundColor: "#306998",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "grab",
    userSelect: "none",
    fontSize: "14px",
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

  // ----- FULLSCREEN RESULT -----
  fullscreenResult: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, sans-serif",
    padding: "20px",
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
};