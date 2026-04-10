import { useState, useEffect, useRef, useCallback } from "react";

export default function KuisDictionary() {
  // State kuis
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [flags, setFlags] = useState(Array(10).fill(false));
  const [unsures, setUnsures] = useState(Array(10).fill(false));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 menit dalam detik
  const [codingAnswer, setCodingAnswer] = useState("");
  const [codingOutput, setCodingOutput] = useState("");
  const [codingError, setCodingError] = useState("");
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const timerRef = useRef(null);

  // Data soal (10 soal)
  const questions = [
    {
      id: 1,
      type: "multiple_choice",
      text: "Manakah pernyataan yang BENAR tentang dictionary di Python?",
      options: [
        "A. Dictionary dapat diakses menggunakan indeks angka seperti list",
        "B. Key dalam dictionary harus bersifat unik dan immutable",
        "C. Dictionary tidak dapat diubah setelah dibuat (immutable)",
        "D. Dictionary hanya bisa menyimpan tipe data string sebagai value",
        "E. Key dalam dictionary boleh berupa list"
      ],
      correct: 1,
      explanation: "Key dalam dictionary harus unik dan immutable (string, integer, tuple). List tidak bisa menjadi key karena mutable."
    },
    {
      id: 2,
      type: "multiple_choice",
      text: "Apa output dari kode berikut?\n\n```python\ndata = {'a': 1, 'b': 2, 'c': 3}\nprint(data.get('d', 0))\n```",
      options: [
        "A. None",
        "B. Error",
        "C. 0",
        "D. 'd'",
        "E. 3"
      ],
      correct: 2,
      explanation: "Metode get() mengembalikan nilai default (0) jika key 'd' tidak ditemukan."
    },
    {
      id: 3,
      type: "code_output",
      text: "Tebak output dari kode berikut:",
      code: "nilai = {'Math': 85, 'Science': 90, 'English': 78}\ndel nilai['Science']\nprint(len(nilai))",
      correct: "2",
      explanation: "Setelah menghapus key 'Science', dictionary hanya memiliki 2 item."
    },
    {
      id: 4,
      type: "multiple_choice",
      text: "Metode mana yang digunakan untuk menggabungkan dua dictionary?",
      options: [
        "A. merge()",
        "B. combine()",
        "C. update()",
        "D. join()",
        "E. concat()"
      ],
      correct: 2,
      explanation: "Metode update() digunakan untuk menggabungkan dictionary lain ke dictionary asli."
    },
    {
      id: 5,
      type: "code_completion",
      text: "Lengkapi kode berikut untuk membuat dictionary dengan key 'nama' dan value 'Andi', lalu cetak value tersebut.",
      code: "data = {}\n________________\nprint(data['nama'])",
      correct: "data['nama'] = 'Andi'",
      explanation: "Menambahkan pasangan key-value ke dictionary: data['nama'] = 'Andi'"
    },
    {
      id: 6,
      type: "multiple_choice",
      text: "Perhatikan kode berikut:\n\n```python\nx = {'a': 10, 'b': 20}\ny = x.copy()\ny['a'] = 99\nprint(x['a'])\n```\nApa yang akan dicetak?",
      options: [
        "A. 99",
        "B. 10",
        "C. Error",
        "D. None",
        "E. 20"
      ],
      correct: 1,
      explanation: "copy() membuat salinan dangkal, perubahan pada y tidak mempengaruhi x."
    },
    {
      id: 7,
      type: "multiple_choice",
      text: "Manakah cara yang benar untuk menghapus semua item dalam dictionary `data`?",
      options: [
        "A. data.removeAll()",
        "B. data.delete()",
        "C. data.clear()",
        "D. data.popall()",
        "E. del data"
      ],
      correct: 2,
      explanation: "Metode clear() menghapus semua item, tetapi dictionary tetap ada."
    },
    {
      id: 8,
      type: "code_output",
      text: "Tebak output dari kode berikut:",
      code: "items = {'apel': 3, 'mangga': 5, 'jeruk': 2}\nfor k in items.keys():\n    print(k, end=' ')",
      correct: "apel mangga jeruk",
      explanation: "keys() mengembalikan semua key dalam urutan insertion (Python 3.7+)."
    },
    {
      id: 9,
      type: "code_completion",
      text: "Lengkapi kode untuk mencetak nilai dari key 'fisika' menggunakan metode get() dengan default 0 jika tidak ada.",
      code: "nilai = {'matematika': 85, 'kimia': 90}\nprint(________________)",
      correct: "nilai.get('fisika', 0)",
      explanation: "get(key, default) mengembalikan nilai key atau default jika tidak ada."
    },
    {
      id: 10,
      type: "coding",
      text: "Studi Kasus: Sebuah toko buku memiliki dictionary `stok` dengan data awal {'Python': 10, 'Java': 5, 'C++': 7}. \n\nLakukan operasi berikut secara berurutan:\n1. Tambahkan buku baru 'JavaScript' dengan stok 3.\n2. Kurangi stok 'Python' sebanyak 2.\n3. Hapus buku 'C++' karena sudah tidak tersedia.\n4. Tampilkan dictionary stok terakhir.\n\nTulis kode Python lengkap untuk menyelesaikan kasus di atas.",
      correct: "",
      expectedOutput: "{'Python': 8, 'Java': 5, 'JavaScript': 3}",
      explanation: "Solusi: stok = {'Python':10, 'Java':5, 'C++':7}\nstok['JavaScript'] = 3\nstok['Python'] -= 2\ndel stok['C++']\nprint(stok)"
    }
  ];

  // Load Pyodide untuk soal coding
  useEffect(() => {
    const loadPyodide = async () => {
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.async = true;
        script.onload = async () => {
          const pyodide = await window.loadPyodide();
          pyodideRef.current = pyodide;
          setPyodideReady(true);
        };
        document.body.appendChild(script);
      } else {
        const pyodide = await window.loadPyodide();
        pyodideRef.current = pyodide;
        setPyodideReady(true);
      }
    };
    loadPyodide();
  }, []);

  // Timer
  useEffect(() => {
    if (submitted) return;
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
  }, [submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
    if (questions[currentQuestion].type === "coding") {
      setCodingAnswer(answer);
    }
  };

  const handleCodingRun = async () => {
    if (!pyodideReady) {
      setCodingError("⏳ Pyodide sedang dimuat...");
      return;
    }
    setCodingError("");
    setCodingOutput("");
    try {
      const pyodide = pyodideRef.current;
      const code = codingAnswer;
      const result = await pyodide.runPythonAsync(`
import sys
from io import StringIO
_old_stdout = sys.stdout
sys.stdout = _buffer = StringIO()
try:
    exec("""
${code.replace(/`/g, '\\`')}
""")
finally:
    sys.stdout = _old_stdout
_buffer.getvalue()
      `);
      setCodingOutput(result);
    } catch (err) {
      setCodingError(`Error: ${err.message}`);
    }
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
    // Hitung skor
    let score = 0;
    const results = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = answers[i];
      let isCorrect = false;
      if (q.type === "multiple_choice") {
        isCorrect = (userAnswer === q.correct);
      } else if (q.type === "code_output") {
        isCorrect = (userAnswer && userAnswer.trim() === q.correct);
      } else if (q.type === "code_completion") {
        isCorrect = (userAnswer && userAnswer.trim() === q.correct);
      } else if (q.type === "coding") {
        if (userAnswer && pyodideReady) {
          try {
            const pyodide = pyodideRef.current;
            const result = pyodide.runPython(`
import sys
from io import StringIO
_old_stdout = sys.stdout
sys.stdout = _buffer = StringIO()
try:
    exec("""
${userAnswer.replace(/`/g, '\\`')}
""")
finally:
    sys.stdout = _old_stdout
_buffer.getvalue()
            `);
            isCorrect = (result.trim() === q.expectedOutput);
          } catch(e) {
            isCorrect = false;
          }
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

  const [resultsData, setResultsData] = useState(null);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(Array(10).fill(null));
    setFlags(Array(10).fill(false));
    setUnsures(Array(10).fill(false));
    setSubmitted(false);
    setTimeLeft(20 * 60);
    setCodingAnswer("");
    setCodingOutput("");
    setCodingError("");
    setResultsData(null);
    if (timerRef.current) clearInterval(timerRef.current);
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
  };

  if (submitted && resultsData) {
    const { finalScore, waktuDigunakan, results: detailResults } = resultsData;
    const minutesUsed = Math.floor(waktuDigunakan / 60);
    const secondsUsed = waktuDigunakan % 60;
    const passed = finalScore >= 7;

    return (
      <div style={resultStyles.container}>
        <div style={resultStyles.card}>
          <h1 style={resultStyles.title}>📊 Hasil Kuis Dictionary</h1>
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
                <p><strong>Jawaban Anda:</strong> {q.userAnswer !== null && q.userAnswer !== undefined ? (typeof q.userAnswer === 'number' ? q.options[q.userAnswer] : q.userAnswer) : 'Tidak dijawab'}</p>
                {!q.isCorrect && <p><strong>Jawaban benar:</strong> {q.type === 'multiple_choice' ? q.options[q.correct] : q.correct}</p>}
                <p><strong>Penjelasan:</strong> {q.explanation}</p>
              </div>
            ))}
          </div>
          <div style={resultStyles.buttonGroup}>
            <button onClick={resetQuiz} style={resultStyles.button}>🔄 Ulangi Kuis</button>
            {passed && (
              <button onClick={() => window.location.href = '/materi/dictionary/lanjutan'} style={{...resultStyles.button, backgroundColor: '#28a745'}}>➡️ Lanjut ke Materi Selanjutnya</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const isFlagged = flags[currentQuestion];
  const isUnsure = unsures[currentQuestion];

  return (
    <div style={kuisStyles.container}>
      <div style={kuisStyles.header}>
        <div style={kuisStyles.headerAccent}></div>
        <h1 style={kuisStyles.headerTitle}>KUIS DICTIONARY</h1>
        <div style={kuisStyles.timer}>⏰ {formatTime(timeLeft)}</div>
      </div>

      <div style={kuisStyles.content}>
        <div style={kuisStyles.questionArea}>
          <div style={kuisStyles.questionCard}>
            <div style={kuisStyles.questionHeader}>
              <span style={kuisStyles.questionNumber}>Soal {currentQuestion+1} dari 10</span>
              <div style={kuisStyles.actions}>
                <button 
                  onClick={toggleFlag} 
                  style={{...kuisStyles.actionButton, backgroundColor: isFlagged ? '#FFD43B' : '#eee', color: '#333'}}
                >
                  🚩 {isFlagged ? 'Flagged' : 'Flag'}
                </button>
                <button 
                  onClick={toggleUnsure} 
                  style={{...kuisStyles.actionButton, backgroundColor: isUnsure ? '#aaa' : '#eee', color: '#333'}}
                >
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
                      onChange={() => handleAnswer(idx)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {q.type === "code_output" && (
              <div>
                <pre style={kuisStyles.codeBlock}>{q.code}</pre>
                <input
                  type="text"
                  style={kuisStyles.textInput}
                  placeholder="Tulis output yang dihasilkan..."
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
              </div>
            )}
            {q.type === "code_completion" && (
              <div>
                <pre style={kuisStyles.codeBlock}>{q.code}</pre>
                <input
                  type="text"
                  style={kuisStyles.textInput}
                  placeholder="Isi kode yang rumpang..."
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
              </div>
            )}
            {q.type === "coding" && (
              <div>
                <textarea
                  style={kuisStyles.codeArea}
                  rows="12"
                  placeholder="Tulis kode Python lengkap di sini..."
                  value={codingAnswer}
                  onChange={(e) => {
                    setCodingAnswer(e.target.value);
                    handleAnswer(e.target.value);
                  }}
                />
                <div style={kuisStyles.buttonGroup}>
                  <button onClick={handleCodingRun} style={kuisStyles.runButton} disabled={!pyodideReady}>
                    ▶ Jalankan Kode
                  </button>
                </div>
                {codingError && <pre style={kuisStyles.error}>{codingError}</pre>}
                {codingOutput && <pre style={kuisStyles.output}>Output:\n{codingOutput}</pre>}
              </div>
            )}
          </div>
          <div style={kuisStyles.navButtons}>
            <button 
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev-1))} 
              disabled={currentQuestion === 0}
              style={kuisStyles.navButton}
            >
              ◀ Sebelumnya
            </button>
            <button 
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length-1, prev+1))} 
              disabled={currentQuestion === questions.length-1}
              style={kuisStyles.navButton}
            >
              Selanjutnya ▶
            </button>
            <button onClick={() => handleSubmit()} style={kuisStyles.submitButton}>
              📤 Kumpulkan Jawaban
            </button>
          </div>
        </div>

        <div style={kuisStyles.navGrid}>
          <h3 style={kuisStyles.gridTitle}>Navigasi Soal</h3>
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
            <p><span style={{...kuisStyles.legendColor, backgroundColor: '#FFD43B'}}></span> Ditandai (Flag)</p>
            <p><span style={{...kuisStyles.legendColor, backgroundColor: '#aaa'}}></span> Ragu</p>
            <p><span style={{...kuisStyles.legendColor, backgroundColor: '#FF9800'}}></span> Aktif</p>
            <p><span style={{...kuisStyles.legendColor, backgroundColor: '#f0f0f0'}}></span> Belum dijawab</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const kuisStyles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "Poppins, sans-serif",
    padding: "20px 40px",
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "18px 24px",
    position: "relative",
    marginBottom: "30px",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: "28px",
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  timer: {
    fontSize: "24px",
    fontWeight: "bold",
    backgroundColor: "#FFD43B",
    color: "#306998",
    padding: "8px 16px",
    borderRadius: "8px",
  },
  content: {
    display: "flex",
    gap: "30px",
  },
  questionArea: {
    flex: 2,
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
    padding: "6px 12px",
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
  },
  codeBlock: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflowX: "auto",
    marginBottom: "15px",
  },
  textInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "10px",
  },
  codeArea: {
    width: "100%",
    fontFamily: "monospace",
    fontSize: "14px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  runButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "6px",
    marginTop: "10px",
  },
  output: {
    backgroundColor: "#1e1e1e",
    color: "#4af",
    padding: "10px",
    borderRadius: "6px",
    marginTop: "10px",
    fontFamily: "monospace",
  },
  navButtons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "10px",
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
  navGrid: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    height: "fit-content",
  },
  gridTitle: {
    marginTop: 0,
    marginBottom: "15px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },
  gridItem: {
    aspectRatio: "1",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
    color: "#333",
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
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
    padding: "40px",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#306998",
    marginBottom: "20px",
  },
  scoreBox: {
    backgroundColor: "#e7f3ff",
    padding: "15px",
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