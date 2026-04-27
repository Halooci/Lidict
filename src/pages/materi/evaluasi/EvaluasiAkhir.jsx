import { useState, useEffect, useRef } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function EvaluasiAkhir() {
  // ---------- QUIZ STATE ----------
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(20).fill(null));
  const [flags, setFlags] = useState(Array(20).fill(false));
  const [timeRemaining, setTimeRemaining] = useState(1500); // 25 menit = 1500 detik
  const [duration, setDuration] = useState(null);
  const [score, setScore] = useState(null);
  const [correctCount, setCorrectCount] = useState(null);
  const [wrongCount, setWrongCount] = useState(null);

  const timerIntervalRef = useRef(null);

  // ---------- SOAL PILIHAN GANDA (List, Nested List, Dictionary) ----------
  // 20 soal dengan taksonomi Bloom (C1 s.d. C6)
  const questions = [
    // ==================== LIST (7 soal) ====================
    {
      id: 0,
      text: "Perhatikan pernyataan berikut tentang list pada Python:\n(1) List dapat menyimpan elemen dengan tipe data berbeda.\n(2) List bersifat immutable (tidak bisa diubah).\n(3) List didefinisikan dengan tanda kurung siku [].\n(4) Elemen list dapat diakses menggunakan indeks mulai dari 0.\nManakah pernyataan yang benar?",
      options: [
        "A. (1), (2), dan (3)",
        "B. (1), (3), dan (4)",
        "C. (2) dan (4)",
        "D. (1), (2), dan (4)",
        "E. Semua benar"
      ]
    },
    {
      id: 1,
      text: "Diberikan kode berikut:\nbuah = ['apel', 'pisang', 'jeruk', 'mangga']\nprint(buah[-2])\nApa output yang dihasilkan?",
      options: [
        "A. apel",
        "B. pisang",
        "C. jeruk",
        "D. mangga",
        "E. Error"
      ]
    },
    {
      id: 2,
      text: "Manakah cara yang tepat untuk membuat list berisi angka 1, 2, 3, 4, 5 secara berurutan?",
      options: [
        "A. list(1,2,3,4,5)",
        "B. [1;2;3;4;5]",
        "C. {1,2,3,4,5}",
        "D. [1,2,3,4,5]",
        "E. (1,2,3,4,5)"
      ]
    },
    {
      id: 3,
      text: "Perhatikan potongan kode berikut:\nnilai = [80, 75, 90, 85]\nnilai.append(95)\nnilai.insert(1, 70)\nBerapakah panjang list `nilai` setelah kedua operasi tersebut?",
      options: [
        "A. 4",
        "B. 5",
        "C. 6",
        "D. 7",
        "E. Error"
      ]
    },
    {
      id: 4,
      text: "Jika ingin menghapus elemen terakhir dari list sekaligus mengembalikan nilainya, method apa yang paling tepat digunakan?",
      options: [
        "A. remove()",
        "B. pop()",
        "C. delete()",
        "D. discard()",
        "E. clear()"
      ]
    },
    {
      id: 5,
      text: "Analisislah kode berikut:\ndata = [3, 1, 4, 1, 5]\ndata.sort(reverse=True)\nprint(data[2])\nApa output yang dihasilkan?",
      options: [
        "A. 1",
        "B. 4",
        "C. 3",
        "D. 5",
        "E. Error"
      ]
    },
    {
      id: 6,
      text: "Manakah dari operasi berikut yang menghasilkan list baru [10, 20, 30, 40] jika diketahui list awal `a = [10, 20, 30]`?",
      options: [
        "A. a.append(40)",
        "B. a + [40]",
        "C. a.extend([40])",
        "D. a.insert(3, 40)",
        "E. a.add(40)"
      ]
    },

    // ==================== NESTED LIST (7 soal) ====================
    {
      id: 7,
      text: "Apa yang dimaksud dengan nested list dalam Python?",
      options: [
        "A. List yang hanya berisi tipe data numerik",
        "B. List yang di dalamnya terdapat list lain sebagai elemen",
        "C. List yang didefinisikan di dalam fungsi",
        "D. List yang tidak memiliki indeks",
        "E. List yang hanya memiliki satu elemen"
      ]
    },
    {
      id: 8,
      text: "Diberikan nested list: matrix = [[1,2,3], [4,5,6], [7,8,9]]\nBagaimana cara mengakses angka 5?",
      options: [
        "A. matrix[1][1]",
        "B. matrix[2][1]",
        "C. matrix[1][2]",
        "D. matrix[2][2]",
        "E. matrix[0][1]"
      ]
    },
    {
      id: 9,
      text: "Manakah kode yang benar untuk membuat nested list dengan tiga baris dan dua kolom, semua elemen bernilai 0?",
      options: [
        "A. [[0]*2]*3",
        "B. [[0 for _ in range(2)] for _ in range(3)]",
        "C. [0,0] * 3",
        "D. A dan B benar",
        "E. Hanya B yang benar"
      ]
    },
    {
      id: 10,
      text: "Perhatikan kode berikut:\nA = [[1,2], [3,4]]\nB = A[0]\nB.append(5)\nprint(A)\nApa output yang dihasilkan?",
      options: [
        "A. [[1,2], [3,4]]",
        "B. [[1,2,5], [3,4]]",
        "C. Error",
        "D. [[1,2], [3,4,5]]",
        "E. [[1,2,5], [3,4,5]]"
      ]
    },
    {
      id: 11,
      text: "Jika diketahui nested list `data = [['a','b'], ['c','d'], ['e','f']]`, manakah perintah yang akan mengubah elemen 'd' menjadi 'z'?",
      options: [
        "A. data[1][1] = 'z'",
        "B. data[2][1] = 'z'",
        "C. data[1][2] = 'z'",
        "D. data[2][2] = 'z'",
        "E. data[0][1] = 'z'"
      ]
    },
    {
      id: 12,
      text: "Manakah dari pernyataan berikut yang tepat tentang operasi pada nested list?",
      options: [
        "A. Kita dapat menggunakan perulangan bersarang (nested loop) untuk mengakses setiap elemen",
        "B. Nested list tidak bisa digabung dengan operator +",
        "C. Method append() hanya dapat menambah elemen di level paling luar",
        "D. Nested list bersifat immutable seperti string",
        "E. Semua pernyataan salah"
      ]
    },
    {
      id: 13,
      text: "Analisislah kode berikut:\nmatrix = [[i*j for j in range(3)] for i in range(2)]\nprint(matrix[1][2])\nBerapakah output yang dihasilkan?",
      options: [
        "A. 0",
        "B. 1",
        "C. 2",
        "D. 3",
        "E. Error"
      ]
    },

    // ==================== DICTIONARY (6 soal) ====================
    {
      id: 14,
      text: "Manakah pernyataan yang benar tentang dictionary di Python?",
      options: [
        "A. Dictionary menyimpan data dalam pasangan key-value",
        "B. Key dalam dictionary harus unik dan immutable",
        "C. Dictionary didefinisikan dengan tanda kurung siku []",
        "D. A dan B benar",
        "E. Semua benar"
      ]
    },
    {
      id: 15,
      text: "Diberikan kode:\nsiswa = {'nama': 'Andi', 'umur': 17}\nprint(siswa.get('kelas', 'Tidak ada'))\nApa output yang dihasilkan?",
      options: [
        "A. Error",
        "B. None",
        "C. Tidak ada",
        "D. kelas",
        "E. '' (string kosong)"
      ]
    },
    {
      id: 16,
      text: "Manakah cara yang benar untuk mengubah nilai dari key 'hobi' menjadi 'membaca' pada dictionary `profil = {'nama': 'Budi', 'hobi': 'berenang'}`?",
      options: [
        "A. profil['hobi'] = 'membaca'",
        "B. profil.update(hobi='membaca')",
        "C. profil.setdefault('hobi', 'membaca')",
        "D. A dan B benar",
        "E. Hanya A yang benar"
      ]
    },
    {
      id: 17,
      text: "Perhatikan kode berikut:\ndata = {'a':1, 'b':2, 'c':3}\ndel data['b']\ndata['d'] = 4\nprint(len(data))\nBerapakah outputnya?",
      options: [
        "A. 2",
        "B. 3",
        "C. 4",
        "D. Error",
        "E. 5"
      ]
    },
    {
      id: 18,
      text: "Manakah method yang digunakan untuk mengambil semua key dari dictionary?",
      options: [
        "A. values()",
        "B. items()",
        "C. keys()",
        "D. get()",
        "E. pop()"
      ]
    },
    {
      id: 19,
      text: "Analisislah potongan kode berikut:\ncounter = {}\nkata = 'python'\nfor huruf in kata:\n    counter[huruf] = counter.get(huruf, 0) + 1\nprint(counter['p'])\nApa output yang dihasilkan?",
      options: [
        "A. 0",
        "B. 1",
        "C. 2",
        "D. Error",
        "E. None"
      ]
    }
  ];

  // Kunci jawaban (A, B, C, D, E) sesuai dengan soal di atas
  const correctAnswers = [
    "B", // soal0: (1),(3),(4) benar
    "C", // soal1: jeruk (indeks -2)
    "D", // soal2: [1,2,3,4,5]
    "C", // soal3: panjang 6 (awal 4, append+1, insert+1 =6)
    "B", // soal4: pop()
    "C", // soal5: sort reverse -> [5,4,3,1,1] index2 = 3
    "B", // soal6: a + [40] menghasilkan list baru
    "B", // soal7: nested list adalah list di dalam list
    "A", // soal8: matrix[1][1] = 5
    "E", // soal9: Hanya B yang benar (A menghasilkan referensi sama, tidak disarankan)
    "B", // soal10: [[1,2,5], [3,4]]
    "A", // soal11: data[1][1] = 'z'
    "A", // soal12: perulangan bersarang tepat
    "C", // soal13: matrix[1][2] = 1*2 = 2
    "D", // soal14: A dan B benar
    "C", // soal15: get('kelas','Tidak ada') -> 'Tidak ada'
    "D", // soal16: A dan B benar
    "B", // soal17: setelah del b dan tambah d, panjang 3
    "C", // soal18: keys()
    "B"  // soal19: huruf 'p' muncul 1 kali
  ];

  // ---------- HELPER FUNCTIONS (sama seperti asli) ----------
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const startTimer = () => {
    if (timerIntervalRef.current) stopTimer();
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          if (!quizSubmitted && quizStarted) {
            handleSubmitQuiz(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const computeResult = () => {
    let correct = 0;
    answers.forEach((ans, idx) => {
      if (ans && ans === correctAnswers[idx]) correct++;
    });
    const wrong = 20 - correct;
    const totalScore = correct * 5;
    const timeTaken = 1500 - timeRemaining;
    return { correct, wrong, totalScore, timeTaken };
  };

  const handleSubmitQuiz = (isAuto = false) => {
    if (quizSubmitted) return;

    if (!isAuto) {
      const confirmSubmit = window.confirm("Apakah Anda yakin ingin mengumpulkan jawaban?");
      if (!confirmSubmit) return;
    }

    stopTimer();

    const { correct, wrong, totalScore, timeTaken } = computeResult();
    setCorrectCount(correct);
    setWrongCount(wrong);
    setScore(totalScore);
    setDuration(timeTaken);
    setQuizSubmitted(true);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizSubmitted(false);
    setCurrentIndex(0);
    setAnswers(Array(20).fill(null));
    setFlags(Array(20).fill(false));
    setTimeRemaining(1500);
    setScore(null);
    setCorrectCount(null);
    setWrongCount(null);
    setDuration(null);

    stopTimer();
    startTimer();
  };

  const handleRetry = () => {
    startQuiz();
  };

  const backToMaterial = () => {
    setQuizStarted(false);
    setQuizSubmitted(false);
    stopTimer();
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  useEffect(() => {
    if (quizStarted && !quizSubmitted && timeRemaining === 0) {
      handleSubmitQuiz(true);
    }
  }, [timeRemaining, quizStarted, quizSubmitted]);

  // ---------- HANDLER SOAL ----------
  const handleAnswerSelect = (optionLetter) => {
    if (quizSubmitted) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionLetter;
    setAnswers(newAnswers);
  };

  const toggleFlag = () => {
    if (quizSubmitted) return;
    const newFlags = [...flags];
    newFlags[currentIndex] = !newFlags[currentIndex];
    setFlags(newFlags);
  };

  const goPrevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goNextQuestion = () => {
    if (currentIndex < 19) setCurrentIndex(currentIndex + 1);
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ---------- RENDER INSTRUCTION PAGE ----------
  if (!quizStarted && !quizSubmitted) {
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
                <li>Evaluasi terdiri dari 20 soal pilihan ganda (A, B, C, D, E).</li>
                <li>Setiap soal bernilai 5 poin (total maksimal 100).</li>
                <li>Waktu pengerjaan: 25 menit (timer berjalan setelah mulai).</li>
                <li>Jika waktu habis, jawaban yang sudah terisi akan tersimpan dan terkirim secara otomatis.</li>
                <li>Gunakan fitur "Tandai Ragu-ragu" untuk soal yang perlu ditinjau ulang.</li>
                <li>Navigasi soal dapat melalui panel kotak nomor atau tombol Sebelumnya/Selanjutnya.</li>
                <li>Pastikan semua jawaban sudah dipilih sebelum menekan KUMPULKAN JAWABAN.</li>
                <li>Nilai minimal kelulusan (KKM) adalah 70.</li>
              </ul>
              <button style={styles.startButton} onClick={startQuiz}>MULAI EVALUASI</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ---------- RENDER RESULT PAGE ----------
  if (quizSubmitted) {
    const isPassed = score >= 70;
    const minutesTaken = Math.floor(duration / 60);
    const secondsTaken = duration % 60;
    const percentage = (score / 100) * 100;

    return (
      <div style={styles.fullscreenResult}>
        <div style={styles.resultCardNew}>
          <div style={styles.resultHeaderNew}>
            <h1>HASIL EVALUASI</h1>
            <div style={styles.headerAccentResultNew}></div>
          </div>

          <div style={styles.scoreDisplay}>
            <span style={styles.scoreNumberNew}>{score}</span>
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
            <div style={styles.progressLabel}>{score}%</div>
          </div>

          <div style={styles.statsGridNew}>
            <div style={styles.statItemNew}>
              <div style={styles.statIcon}>✓</div>
              <div>
                <div style={styles.statLabelNew}>Benar</div>
                <div style={styles.statValueNew}>{correctCount}</div>
              </div>
            </div>
            <div style={styles.statItemNew}>
              <div style={styles.statIcon}>✗</div>
              <div>
                <div style={styles.statLabelNew}>Salah</div>
                <div style={styles.statValueNew}>{wrongCount}</div>
              </div>
            </div>
            <div style={styles.statItemNew}>
              <div style={styles.statIcon}>⏱</div>
              <div>
                <div style={styles.statLabelNew}>Waktu</div>
                <div style={styles.statValueNew}>
                  {minutesTaken}m {secondsTaken}s
                </div>
              </div>
            </div>
          </div>

          <div style={styles.resultMessageNew}>
            {isPassed ? (
              <div style={styles.passedBoxNew}>SELAMAT! Anda LULUS dengan nilai {score}</div>
            ) : (
              <div style={styles.failedBoxNew}>MOHON MAAF, Anda TIDAK LULUS (Nilai {score} &lt; 70)</div>
            )}
          </div>

          <div style={styles.resultActionsNew}>
            {!isPassed ? (
              <button style={styles.retryButtonNew} onClick={handleRetry}>Ulangi Evaluasi</button>
            ) : (
              <button style={styles.backMaterialButtonNew} onClick={backToMaterial}>Kembali ke Halaman Materi</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- RENDER QUIZ PAGE ----------
  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const isFlagged = flags[currentIndex];

  return (
    <div style={styles.fullscreenQuiz}>
      <div style={styles.quizHeader}>
        <div style={styles.quizTitle}>EVALUASI</div>
        <div style={styles.timerBox}>
          <span style={styles.timerIcon}>⏱</span>
          <span style={timeRemaining < 60 ? styles.timerDanger : styles.timerText}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div style={styles.twoColumnLayout}>
        <div style={styles.questionCard}>
          <div style={styles.questionHeader}>
            <h3 style={styles.questionNumber}>Soal {currentQuestion.id + 1} dari 20</h3>
            <button
              style={isFlagged ? styles.flagButtonActive : styles.flagButton}
              onClick={toggleFlag}
            >
              {isFlagged ? "🏁 Hapus Ragu" : "❓ Tandai Ragu-ragu"}
            </button>
          </div>
          <p style={styles.questionText}>{currentQuestion.text}</p>

          <div style={styles.optionsContainer}>
            {currentQuestion.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              return (
                <label key={letter} style={styles.optionLabel}>
                  <input
                    type="radio"
                    name="question"
                    value={letter}
                    checked={selectedAnswer === letter}
                    onChange={() => handleAnswerSelect(letter)}
                    disabled={quizSubmitted}
                  />
                  <span style={styles.optionLetter}>{letter}.</span> {opt}
                </label>
              );
            })}
          </div>

          <div style={styles.navButtons}>
            <button onClick={goPrevQuestion} disabled={currentIndex === 0} style={styles.navButton}>
              Sebelumnya
            </button>
            <button onClick={goNextQuestion} disabled={currentIndex === 19} style={styles.navButton}>
              Selanjutnya
            </button>
          </div>

          <div style={styles.submitWrapper}>
            <button onClick={() => handleSubmitQuiz(false)} style={styles.submitButton}>
              KUMPULKAN JAWABAN
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
              else if (answers[idx]) boxStyle = { ...styles.navBox, ...styles.navBoxAnswered };
              else boxStyle = styles.navBox;

              return (
                <div key={idx} style={boxStyle} onClick={() => goToQuestion(idx)}>
                  {idx + 1}
                </div>
              );
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
    </div>
  );
}

/* ================== STYLE (tidak diubah) ================== */
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

  // ----- FULLSCREEN QUIZ -----
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
  timerDanger: { fontSize: "28px", fontWeight: "700", fontFamily: "monospace", color: "#FFD43B" },
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
  questionNumber: { fontSize: "20px", fontWeight: "700", color: "#306998", margin: 0 },
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
  questionText: { fontSize: "18px", lineHeight: "1.5", marginBottom: "28px", color: "#0f172a", fontWeight: "500", whiteSpace: "pre-line" },
  optionsContainer: { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" },
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
  optionLetter: { fontWeight: "bold", color: "#306998", width: "28px" },
  navButtons: { display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "10px" },
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
  navLabel: { fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#2c3e50" },
  navGrid: { display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" },
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
  navBoxActive: { backgroundColor: "#306998", color: "white", boxShadow: "0 0 0 3px #FFD43B" },
  navBoxFlagged: { backgroundColor: "#f59e0b", color: "white" },
  navBoxAnswered: { backgroundColor: "#10b981", color: "white" },
  legend: { display: "flex", gap: "24px", fontSize: "14px", color: "#475569", flexWrap: "wrap" },
  legendAnswered: { display: "inline-block", width: "16px", height: "16px", backgroundColor: "#10b981", borderRadius: "4px", marginRight: "6px", verticalAlign: "middle" },
  legendFlagged: { display: "inline-block", width: "16px", height: "16px", backgroundColor: "#f59e0b", borderRadius: "4px", marginRight: "6px", verticalAlign: "middle" },
  legendActive: { display: "inline-block", width: "16px", height: "16px", backgroundColor: "#306998", borderRadius: "4px", marginRight: "6px", verticalAlign: "middle", boxShadow: "0 0 0 1px #FFD43B" },
  legendUnanswered: { display: "inline-block", width: "16px", height: "16px", backgroundColor: "#e2e8f0", borderRadius: "4px", marginRight: "6px", verticalAlign: "middle" },

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
  headerAccentResultNew: { width: "60px", height: "4px", backgroundColor: "#FFD43B", margin: "12px auto 0", borderRadius: "2px" },
  scoreDisplay: { marginBottom: "30px" },
  scoreNumberNew: { fontSize: "72px", fontWeight: "800", color: "#306998", lineHeight: 1 },
  scoreTotalNew: { fontSize: "28px", fontWeight: "500", color: "#64748b" },
  progressContainer: { marginBottom: "35px" },
  progressBar: { backgroundColor: "#e2e8f0", borderRadius: "30px", height: "12px", overflow: "hidden", marginBottom: "8px" },
  progressLabel: { fontSize: "14px", fontWeight: "600", color: "#306998", textAlign: "right" },
  statsGridNew: { display: "flex", justifyContent: "space-between", gap: "15px", marginBottom: "30px", flexWrap: "wrap" },
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
  statIcon: { fontSize: "28px", fontWeight: "bold", color: "#306998", width: "40px", textAlign: "center" },
  statLabelNew: { fontSize: "12px", fontWeight: "500", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
  statValueNew: { fontSize: "24px", fontWeight: "700", color: "#0f172a", lineHeight: 1.2 },
  resultMessageNew: { marginBottom: "30px" },
  passedBoxNew: { backgroundColor: "#e6f7ec", color: "#2e7d32", padding: "14px", borderRadius: "60px", fontWeight: "600", fontSize: "18px", border: "1px solid #a5d6a7" },
  failedBoxNew: { backgroundColor: "#fee9e6", color: "#c62828", padding: "14px", borderRadius: "60px", fontWeight: "600", fontSize: "18px", border: "1px solid #ffab91" },
  resultActionsNew: { display: "flex", justifyContent: "center" },
  retryButtonNew: { backgroundColor: "#f59e0b", border: "none", padding: "12px 28px", borderRadius: "40px", fontSize: "16px", fontWeight: "bold", color: "white", cursor: "pointer" },
  backMaterialButtonNew: { backgroundColor: "#306998", border: "none", padding: "12px 28px", borderRadius: "40px", fontSize: "16px", fontWeight: "bold", color: "white", cursor: "pointer" },
};