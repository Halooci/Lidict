import { useState, useEffect, useRef } from "react";

export default function KuisNestedList() {
  // State untuk menampilkan halaman petunjuk
  const [quizStarted, setQuizStarted] = useState(false);

  // State kuis
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [flags, setFlags] = useState(Array(10).fill(false));
  const [unsures, setUnsures] = useState(Array(10).fill(false));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 menit
  const timerRef = useRef(null);
  const [resultsData, setResultsData] = useState(null);

  // State untuk jawaban drag-drop (5 soal)
  const [dragAnswers, setDragAnswers] = useState(
    Array(5).fill().map(() => [])
  );

  // Data soal (10 soal: 5 Multiple Choice + 5 Drag-Drop)
  const questions = [
    // ========== 5 PILIHAN GANDA (termasuk tebak output) ==========
    {
      id: 1,
      type: "multiple_choice",
      text: "Cara mengakses angka 30 dari nested list berikut adalah ...\n\n```python\ndata = [[10, 20], [30, 40]]\n```",
      options: [
        "A. data[0][1]",
        "B. data[1][0]",
        "C. data[1][1]",
        "D. data[0][0]",
        "E. data[2][0]"
      ],
      correct: 1,
      explanation: "Indeks pertama (1) mengakses list kedua, indeks kedua (0) mengakses elemen pertama dari list tersebut yaitu 30."
    },
    {
      id: 2,
      type: "multiple_choice",
      text: "Output dari kode berikut adalah ...\n\n```python\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nprint(matrix[1][2])\n```",
      options: [
        "A. 2",
        "B. 4",
        "C. 5",
        "D. 6",
        "E. 8"
      ],
      correct: 3,
      explanation: "matrix[1] adalah [4,5,6], kemudian [2] mengambil indeks ke-2 yaitu 6."
    },
    {
      id: 3,
      type: "multiple_choice",
      text: "Perhatikan kode berikut:\n\n```python\nnested = [[1], [2, 3], [4, 5, 6]]\nprint(len(nested[1]))\n```\nOutputnya adalah ...",
      options: [
        "A. 1",
        "B. 2",
        "C. 3",
        "D. 4",
        "E. Error"
      ],
      correct: 1,
      explanation: "nested[1] adalah [2,3] yang memiliki panjang 2."
    },
    {
      id: 4,
      type: "multiple_choice",
      text: "Prnyataan berikut yang BENAR tentang nested list di Python adalah ...",
      options: [
        "A. Nested list hanya bisa memiliki 2 tingkat kedalaman",
        "B. Setiap elemen dalam nested list harus memiliki tipe data yang sama",
        "C. Nested list dapat diakses menggunakan beberapa indeks berurutan",
        "D. Nested list tidak dapat diubah setelah dibuat",
        "E. Nested list hanya bisa berisi angka"
      ],
      correct: 2,
      explanation: "Nested list dapat diakses dengan indeks bertingkat, misal list[i][j][k]."
    },
    {
      id: 5,
      type: "multiple_choice",
      text: "Hasil dari kode berikut adalah ...\n\n```python\nlst = [[0] * 3] * 3\nlst[0][1] = 5\nprint(lst)\n```",
      options: [
        "A. [[0,5,0], [0,0,0], [0,0,0]]",
        "B. [[0,5,0], [0,5,0], [0,5,0]]",
        "C. [[0,0,0], [0,5,0], [0,0,0]]",
        "D. Error",
        "E. [[5,0,0], [0,0,0], [0,0,0]]"
      ],
      correct: 1,
      explanation: "Perkalian list menghasilkan referensi ke list yang sama, sehingga perubahan pada satu baris mempengaruhi semua baris."
    },
    // ========== 5 DRAG AND DROP ==========
    {
      id: 6,
      type: "dragdrop",
      text: "Lengkapi kode untuk membuat nested list 3x3 dengan nilai 0 menggunakan list comprehension:",
      codeTemplate: `matrix = [[0 for j in range(3)] for i in range(______)]\nprint(matrix)`,
      placeholders: ["..."],
      dragItems: ["2", "3", "4", "range(3)", "[0,1,2]"],
      correct: ["3"],
      explanation: "range(3) menghasilkan 0,1,2 sehingga terbentuk 3 baris."
    },
    {
      id: 7,
      type: "dragdrop",
      text: "Lengkapi kode untuk mengakses angka 7 dari nested list berikut:",
      codeTemplate: `data = [[1,2],[3,4],[5,6,7]]\nprint(data[______][______])`,
      placeholders: ["...", "..."],
      dragItems: ["0", "1", "2", "3"],
      correct: ["2", "2"],
      explanation: "data[2] adalah [5,6,7], kemudian indeks [2] mengambil 7."
    },
    {
      id: 8,
      type: "dragdrop",
      text: "Lengkapi kode untuk menjumlahkan semua elemen dalam nested list (flatten):",
      codeTemplate: `nested = [[1,2],[3,4],[5,6]]\ntotal = 0\nfor sublist in nested:\n    for val in ______:\n        total += val\nprint(total)`,
      placeholders: ["..."],
      dragItems: ["nested", "sublist", "val", "range(len(sublist))", "total"],
      correct: ["sublist"],
      explanation: "Loop pertama mengambil setiap sublist, loop kedua mengambil setiap nilai dalam sublist."
    },
    {
      id: 9,
      type: "dragdrop",
      text: "Lengkapi kode untuk menambahkan elemen 99 ke dalam sublist kedua dari nested list:",
      codeTemplate: `matrix = [[1,2],[3,4]]\nmatrix[______].append(99)\nprint(matrix)`,
      placeholders: [""],
      dragItems: ["0", "1", "2", "-1", "append"],
      correct: ["1"],
      explanation: "Indeks 1 mengakses sublist [3,4], lalu append(99) menambahkannya."
    },
    {
      id: 10,
      type: "dragdrop",
      text: "Lengkapi kode untuk membuat nested list 2x2 dengan nilai perkalian indeks (i*j):",
      codeTemplate: `matrix = [[i*j for j in range(2)] for i in range(______)]\nprint(matrix)`,
      placeholders: [""],
      dragItems: ["1", "2", "3", "range(2)", "2x2"],
      correct: ["2"],
      explanation: "range(2) menghasilkan baris 0 dan 1, sehingga terbentuk 2 baris."
    }
  ];

  // Timer hanya berjalan jika kuis sudah dimulai dan belum disubmit
  useEffect(() => {
    if (!quizStarted || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
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
    clearInterval(timerRef.current);
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
    setQuizStarted(false); // Kembali ke halaman petunjuk
    setCurrentQuestion(0);
    setAnswers(Array(10).fill(null));
    setFlags(Array(10).fill(false));
    setUnsures(Array(10).fill(false));
    setSubmitted(false);
    setTimeLeft(20 * 60);
    setDragAnswers(Array(5).fill().map(() => []));
    setResultsData(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Fungsi untuk memulai kuis
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
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Halaman hasil (tidak menampilkan rincian jawaban, skor /100)
  if (submitted && resultsData) {
    const { finalScore, waktuDigunakan } = resultsData;
    const minutesUsed = Math.floor(waktuDigunakan / 60);
    const secondsUsed = waktuDigunakan % 60;
    const passed = finalScore >= 7;
    const statusText = passed ? 'Lulus' : 'Tidak Lulus';
    const skor100 = finalScore * 10;

    return (
      <div style={resultStyles.container}>
        <div style={resultStyles.card}>
          <h1 style={resultStyles.title}>Hasil Kuis Nested List</h1>
          <div style={resultStyles.scoreBox}>
            <p>Waktu pengerjaan: {minutesUsed} menit {secondsUsed} detik</p>
            <p>Skor: {skor100} / 100 ({statusText})</p>
          </div>
          <div style={resultStyles.buttonGroup}>
            <button onClick={resetQuiz} style={resultStyles.button}>Ulangi Kuis</button>
            {passed && (
              <button onClick={() => window.location.href = '/Dictionary/PendahuluanDictionary'} style={{...resultStyles.button, backgroundColor: '#28a745'}}>➡️ Lanjut ke Materi Selanjutnya</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Halaman petunjuk (sebelum kuis dimulai)
  if (!quizStarted) {
    return (
      <div style={instructionStyles.container}>
        <div style={instructionStyles.card}>
          <h1 style={instructionStyles.title}>Kuis Nested List</h1>
          <div style={instructionStyles.infoBox}>
            <p>Durasi: <strong>20 Menit</strong></p>
            <p>Jumlah Soal: <strong>10 Butir</strong></p>
            <p>Skor Maksimal: <strong>100</strong></p>
            <p>Skor Kelulusan Minimum: <strong>70</strong></p>
          </div>
          <div style={instructionStyles.petunjuk}>
            <h3>Petunjuk Pengerjaan</h3>
            <ol>
              <li>Aktivitas ini terdiri dari <strong>10 butir soal</strong>.</li>
              <li>Tekan tombol <strong>MULAI</strong> di bawah untuk masuk ke halaman kuis.</li>
              <li>Waktu pengerjaan akan <strong>dihitung mundur otomatis</strong> begitu Anda menekan tombol mulai.</li>
              <li>Pastikan perangkat terhubung dengan <strong>koneksi internet yang stabil</strong>.</li>
              <li>Kerjakan soal dengan teliti dan jujur.</li>
              <li>Periksa kembali jawaban sebelum mengirimkan.</li>
              <li>Jika waktu habis, jawaban yang sudah terisi akan <strong>tersimpan dan terkirim secara otomatis</strong>.</li>
              <li>Anda dapat menandai soal dengan <strong>Flag</strong> (🚩) atau <strong>Ragu</strong> (🤔) untuk memudahkan navigasi.</li>
            </ol>
          </div>
          <div style={instructionStyles.buttonGroup}>
            <button onClick={startQuiz} style={instructionStyles.startButton}>Mulai</button>
            <button onClick={() => window.history.back()} style={instructionStyles.cancelButton}>Batal & Kembali</button>
          </div>
        </div>
      </div>
    );
  }

  // ================== Halaman Kuis (setelah mulai) ==================
  const q = questions[currentQuestion];
  const isFlagged = flags[currentQuestion];
  const isUnsure = unsures[currentQuestion];
  const isDragDrop = q.type === "dragdrop";
  const dragQuestionIdx = currentQuestion - 5;

  return (
    <div style={kuisStyles.container}>
      {/* Header dengan timer */}
      <div style={kuisStyles.header}>
        <div style={kuisStyles.headerAccent}></div>
        <h1 style={kuisStyles.headerTitle}>KUIS NESTED LIST</h1>
        <div style={kuisStyles.timer}>⏰ {formatTime(timeLeft)}</div>
      </div>

      <div style={kuisStyles.mainContent}>
        {/* Kolom Kiri: Soal */}
        <div style={kuisStyles.questionColumn}>
          <div style={kuisStyles.questionCard}>
            <div style={kuisStyles.questionHeader}>
              <span style={kuisStyles.questionNumber}>Soal {currentQuestion+1} dari 10</span>
              <div style={kuisStyles.actions}>
                <button onClick={toggleFlag} style={{...kuisStyles.actionButton, backgroundColor: isFlagged ? '#FFD43B' : '#eee'}}>
                  🚩 {isFlagged ? 'Flagged' : 'Flag'}
                </button>
                <button onClick={toggleUnsure} style={{...kuisStyles.actionButton, backgroundColor: isUnsure ? '#aaa' : '#eee'}}>
                  🤔 {isUnsure ? 'Ragu' : 'Ragu?'}
                </button>
              </div>
            </div>
            <div style={kuisStyles.questionText}>{q.text}</div>
            {q.type === "multiple_choice" && (
              <div style={kuisStyles.options}>
                {q.options.map((opt, idx) => (
                  <label key={idx} style={kuisStyles.option}>
                    <input
                      type="radio"
                      name="question"
                      value={idx}
                      checked={answers[currentQuestion] === idx}
                      onChange={() => handleMCAnswer(idx)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {isDragDrop && (
              <div>
                <div style={kuisStyles.codeBlock}>
                  {q.codeTemplate.split('______').map((part, idx) => (
                    <span key={idx}>
                      {part}
                      {idx < q.placeholders.length && (
                        <span
                          style={kuisStyles.dropZone}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, dragQuestionIdx, idx)}
                        >
                          {dragAnswers[dragQuestionIdx] && dragAnswers[dragQuestionIdx][idx] ? dragAnswers[dragQuestionIdx][idx] : '______'}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <div style={kuisStyles.dragItems}>
                  {q.dragItems.map((item, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      style={kuisStyles.dragItem}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>💡 Seret kata/kode ke area kosong di atas.</p>
              </div>
            )}
          </div>
          <div style={kuisStyles.navButtons}>
            <button onClick={() => setCurrentQuestion(prev => Math.max(0, prev-1))} disabled={currentQuestion === 0} style={kuisStyles.navButton}>◀ Sebelumnya</button>
            <button onClick={() => setCurrentQuestion(prev => Math.min(questions.length-1, prev+1))} disabled={currentQuestion === questions.length-1} style={kuisStyles.navButton}>Selanjutnya ▶</button>
            <button onClick={() => handleSubmit()} style={kuisStyles.submitButton}>📤 Kumpulkan Jawaban</button>
          </div>
        </div>

        {/* Kolom Kanan: Navigasi Soal */}
        <div style={kuisStyles.navColumn}>
          <div style={kuisStyles.navCard}>
            <h3 style={kuisStyles.navTitle}>Navigasi Soal</h3>
            <div style={kuisStyles.grid}>
              {questions.map((_, idx) => {
                let bgColor = '#f0f0f0';
                if (answers[idx] !== null && answers[idx] !== "") bgColor = '#306998';
                if (flags[idx]) bgColor = '#FFD43B';
                if (unsures[idx]) bgColor = '#aaa';
                if (idx === currentQuestion) bgColor = '#FF9800';
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    style={{...kuisStyles.gridItem, backgroundColor: bgColor}}
                    title={`Soal ${idx+1}${flags[idx] ? ' (Ditandai)' : ''}${unsures[idx] ? ' (Ragu)' : ''}`}
                  >
                    {idx+1}
                  </button>
                );
              })}
            </div>
            <div style={kuisStyles.legend}>
              <p><span style={{...kuisStyles.legendColor, backgroundColor: '#306998'}}></span> Terjawab</p>
              <p><span style={{...kuisStyles.legendColor, backgroundColor: '#FFD43B'}}></span> Flag</p>
              <p><span style={{...kuisStyles.legendColor, backgroundColor: '#aaa'}}></span> Ragu</p>
              <p><span style={{...kuisStyles.legendColor, backgroundColor: '#FF9800'}}></span> Aktif</p>
              <p><span style={{...kuisStyles.legendColor, backgroundColor: '#f0f0f0'}}></span> Kosong</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STYLE UNTUK HALAMAN PETUNJUK ====================
const instructionStyles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    maxWidth: "800px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#306998",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "700",
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "25px",
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "15px",
    textAlign: "center",
  },
  petunjuk: {
    marginBottom: "30px",
  },
  buttonGroup: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },
};

// ==================== STYLE KUIS ====================
const kuisStyles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "Poppins, sans-serif",
    padding: "20px",
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "12px 20px",
    position: "relative",
    marginBottom: "30px",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  headerAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "6px",
    backgroundColor: "#FFD43B",
    borderRadius: "6px 0 0 6px",
  },
  headerTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
  },
  timer: {
    fontSize: "20px",
    fontWeight: "bold",
    backgroundColor: "#FFD43B",
    color: "#306998",
    padding: "4px 12px",
    borderRadius: "8px",
  },
  mainContent: {
    display: "flex",
    gap: "30px",
    flexDirection: "row",
  },
  questionColumn: {
    flex: 2,
  },
  navColumn: {
    flex: 1,
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    flexWrap: "wrap",
    gap: "10px",
  },
  questionNumber: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#306998",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  actionButton: {
    border: "none",
    padding: "4px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  },
  questionText: {
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "20px",
    whiteSpace: "pre-line",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "16px",
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
    gap: "15px",
    justifyContent: "center",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  navButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  submitButton: {
    backgroundColor: "#FFD43B",
    color: "#306998",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  navCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },
  navTitle: {
    marginTop: 0,
    marginBottom: "15px",
    textAlign: "center",
    fontSize: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "12px",
    marginBottom: "20px",
  },
  gridItem: {
    aspectRatio: "1",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
    color: "#333",
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
    fontSize: "12px",
  },
  legendColor: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    marginRight: "5px",
    verticalAlign: "middle",
  },
};

// ==================== STYLE HASIL (TANPA DETAIL JAWABAN, SKOR /100) ====================
const resultStyles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#306998",
    marginBottom: "20px",
    fontSize: "24px",
  },
  scoreBox: {
    backgroundColor: "#e7f3ff",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

// CSS global untuk responsive
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @media (max-width: 768px) {
      .kuis-main-content {
        flex-direction: column !important;
      }
    }
  `;
  if (!document.querySelector('#kuis-media-style-nested')) {
    styleTag.id = 'kuis-media-style-nested';
    document.head.appendChild(styleTag);
  }
}