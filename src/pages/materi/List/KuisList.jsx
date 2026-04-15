import { useState, useEffect, useRef } from "react";

export default function KuisList() {
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
      text: "Manakah cara yang benar untuk membuat list kosong di Python?",
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
      text: "Apa output dari kode berikut?\n\n```python\nbuah = ['apel', 'mangga', 'jeruk']\nprint(buah[-1])\n```",
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
      text: "Perhatikan kode berikut:\n\n```python\nangka = [10, 20, 30, 40, 50]\nprint(angka[1:4])\n```\nApa outputnya?",
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
      text: "Manakah method yang digunakan untuk menambahkan elemen di akhir list?",
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
      text: "Apa hasil dari kode berikut?\n\n```python\na = [1, 2, 3]\nb = a\na.append(4)\nprint(b)\n```",
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
    // ========== 5 DRAG AND DROP ==========
    {
      id: 6,
      type: "dragdrop",
      text: "Lengkapi kode untuk mengambil elemen ke-3 dari list berikut:",
      codeTemplate: `warna = ['merah', 'kuning', 'hijau', 'biru']\nprint(warna[______])`,
      placeholders: ["2"],
      dragItems: ["0", "1", "2", "3", "4"],
      correct: ["2"],
      explanation: "Indeks ke-3 adalah indeks 2 karena indexing dimulai dari 0."
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
    setQuizStarted(false);
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

  // Halaman hasil
  if (submitted && resultsData) {
    const { finalScore, waktuDigunakan, results: detailResults } = resultsData;
    const minutesUsed = Math.floor(waktuDigunakan / 60);
    const secondsUsed = waktuDigunakan % 60;
    const passed = finalScore >= 7;

    return (
      <div style={resultStyles.container}>
        <div style={resultStyles.card}>
          <h1 style={resultStyles.title}>📊 Hasil Kuis List</h1>
          <div style={resultStyles.scoreBox}>
            <p>⏱️ Waktu pengerjaan: {minutesUsed} menit {secondsUsed} detik</p>
            <p>✅ Jumlah soal benar: {finalScore} / 10</p>
            <p>📈 Nilai: {finalScore * 10} ({finalScore * 10 >= 70 ? 'Lulus' : 'Tidak Lulus'})</p>
          </div>
          <div style={resultStyles.details}>
            <h3>📝 Rincian Jawaban</h3>
            {detailResults.map((q, idx) => (
              <div key={idx} style={{...resultStyles.questionItem, backgroundColor: q.isCorrect ? '#e8f5e9' : '#ffebee'}}>
                <p><strong>Soal {idx+1}:</strong> {q.text.substring(0, 100)}...</p>
                <p><strong>Jawaban Anda:</strong> {q.userAnswer !== null && q.userAnswer !== undefined ? (q.type === 'multiple_choice' ? q.options[q.userAnswer] : q.userAnswer) : 'Tidak dijawab'}</p>
                {!q.isCorrect && <p><strong>Jawaban benar:</strong> {q.type === 'multiple_choice' ? q.options[q.correct] : q.correct.join(', ')}</p>}
                <p><strong>Penjelasan:</strong> {q.explanation}</p>
              </div>
            ))}
          </div>
          <div style={resultStyles.buttonGroup}>
            <button onClick={resetQuiz} style={resultStyles.button}>🔄 Ulangi Kuis</button>
            {passed && (
              <button onClick={() => window.location.href = '/NestedList/PendahuluanNestedList'} style={{...resultStyles.button, backgroundColor: '#28a745'}}>➡️ Lanjut ke Materi Selanjutnya (Nested List)</button>
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
          <h1 style={instructionStyles.title}>📋 Kuis List</h1>
          <div style={instructionStyles.infoBox}>
            <p>⏱️ Durasi: <strong>20 Menit</strong></p>
            <p>📝 Jumlah Soal: <strong>10 Butir</strong></p>
            <p>🎯 Nilai Maksimal: <strong>100</strong></p>
            <p>✅ Nilai Kelulusan Minimum: <strong>70</strong></p>
          </div>
          <div style={instructionStyles.petunjuk}>
            <h3>📖 Petunjuk Pengerjaan</h3>
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
        <h1 style={kuisStyles.headerTitle}>KUIS LIST</h1>
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

// ==================== STYLE KUIS (sama seperti semula) ====================
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

const resultStyles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    maxWidth: "900px",
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
  details: {
    marginBottom: "20px",
    maxHeight: "400px",
    overflowY: "auto",
  },
  questionItem: {
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    borderLeft: "4px solid",
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
  if (!document.querySelector('#kuis-media-style-list')) {
    styleTag.id = 'kuis-media-style-list';
    document.head.appendChild(styleTag);
  }
}