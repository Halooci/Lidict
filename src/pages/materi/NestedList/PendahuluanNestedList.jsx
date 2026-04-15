import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN EDITOR READ-ONLY =====================
const CodeEditor = ({ code, codeKey, pyodideReady, runPythonCode }) => {
  const [output, setOutput] = useState("");

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    const result = await runPythonCode(code);
    setOutput(result);
  }, [pyodideReady, code, runPythonCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>Contoh Kode Program</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady}>
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>{code}</pre>
      </div>
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik 'Jalankan' untuk melihat hasil)"}</pre>
      </div>
    </div>
  );
};

// ===================== KOMPONEN LATIHAN (PILIHAN GANDA) DENGAN SATU TOMBOL CEK =====================
const LatihanNestedList = () => {
  const [selected, setSelected] = useState([null, null, null, null, null]);
  const [status, setStatus] = useState([null, null, null, null, null]); // null: belum dicek, true: benar, false: salah
  const [allCorrect, setAllCorrect] = useState(false);

  const questions = [
    {
      id: 0,
      text: "Yang dimaksud dengan nested list adalah ...",
      options: [
        "List yang berisi list lain sebagai elemennya",
        "List yang hanya berisi angka",
        "List yang tidak memiliki indeks",
        "List yang hanya memiliki satu elemen",
        "List yang berisi tipe data campuran"
      ],
      correct: 0,
    },
    {
      id: 1,
      text: "Berikut ini yang merupakan bentuk nested list adalah ...",
      options: [
        "[1, 2, 3]",
        "[[1, 2], [3, 4]]",
        "(1, 2, 3)",
        "{1: 'a', 2: 'b'}",
        "[{1, 2}, {3, 4}]"
      ],
      correct: 1,
    },
    {
      id: 2,
      text: "Untuk merepresentasikan data tabel 2 baris 3 kolom, struktur data yang tepat adalah...",
      options: [
        "List biasa",
        "Nested list",
        "Tuple",
        "Dictionary",
        "Set"
      ],
      correct: 1,
    },
    {
      id: 3,
      text: "Perhatikan kode berikut: `data = [[5, 10], [15, 20]]`. Banyak elemen yang ada pada nested list tersebut adalah ...",
      options: ["2", "4", "6", "8", "3"],
      correct: 1,
    },
    {
      id: 4,
      text: "Pernyataan yang BENAR tentang nested list adalah ...",
      options: [
        "Nested list hanya bisa memiliki 2 level",
        "Nested list tidak bisa berisi tipe data selain list",
        "Nested list berguna untuk menyimpan data yang berdimensi banyak",
        "Nested list hanya bisa digunakan untuk data angka",
        "Nested list tidak dapat diubah setelah dibuat"
      ],
      correct: 2,
    }
  ];

  const handleSelect = (qId, optionIndex) => {
    const newSelected = [...selected];
    newSelected[qId] = optionIndex;
    setSelected(newSelected);
    // Reset status soal tersebut jika sudah pernah dicek
    if (status[qId] !== null) {
      const newStatus = [...status];
      newStatus[qId] = null;
      setStatus(newStatus);
      setAllCorrect(false);
    }
  };

  const handleCheckAll = () => {
    let allTrue = true;
    const newStatus = [...status];
    for (let i = 0; i < questions.length; i++) {
      const isCorrect = (selected[i] === questions[i].correct);
      newStatus[i] = isCorrect;
      if (!isCorrect) allTrue = false;
    }
    setStatus(newStatus);
    setAllCorrect(allTrue);
  };

  const handleReset = () => {
    setSelected([null, null, null, null, null]);
    setStatus([null, null, null, null, null]);
    setAllCorrect(false);
  };

  return (
    <div style={styles.quizContainer}>
      <h3 style={styles.quizTitle}>Latihan: Pilihan Ganda</h3>
      <p style={styles.text}>Jawab semua soal dengan memilih opsi yang benar. Klik "Cek Semua Jawaban" untuk memeriksa. Jawaban yang salah dapat diperbaiki dan dicek kembali.</p>
      {questions.map((q, idx) => (
        <div key={idx} style={styles.questionCard}>
          <p style={styles.questionText}>{idx+1}. {q.text}</p>
          <div style={styles.options}>
            {q.options.map((opt, optIdx) => (
              <label key={optIdx} style={styles.optionLabel}>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value={optIdx}
                  checked={selected[idx] === optIdx}
                  onChange={() => handleSelect(idx, optIdx)}
                  style={styles.radio}
                />
                <span style={{ marginLeft: "8px" }}>{opt}</span>
              </label>
            ))}
          </div>
          {status[idx] !== null && (
            <div style={{ marginTop: "8px", fontSize: "14px", fontStyle: "italic", color: status[idx] ? "#28a745" : "#dc3545" }}>
              {status[idx] ? "✅ Benar" : "❌ Salah"}
            </div>
          )}
        </div>
      ))}
      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button style={styles.checkAllButton} onClick={handleCheckAll}>🔍 Cek Semua Jawaban</button>
        <button style={styles.resetButton} onClick={handleReset}>↻ Reset Semua Jawaban</button>
      </div>
      {allCorrect && (
        <div style={styles.resultBox}>
          <strong>🎉 Selamat! Semua jawaban benar. Anda telah menguasai materi nested list.</strong>
        </div>
      )}
    </div>
  );
};

// ===================== EKSPLORASI (PRA TES) =====================
const Eksplorasi = ({ onComplete }) => {
  const [answers, setAnswers] = useState([null, null]);
  const [feedbacks, setFeedbacks] = useState(["", ""]);
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      text: "Kita memerlukan nested list dalam pemrograman karena ...",
      options: [
        "Nested list lebih cepat dari list biasa",
        "Untuk menyimpan data yang memiliki struktur bertingkat atau tabel (dua dimensi)",
        "Program lebih hemat memori",
        "Nested list tidak dapat diubah",
        "Untuk menggantikan fungsi percabangan"
      ],
      correct: 1,
    },
    {
      text: "Pernyataan yang PALING TEPAT tentang nested list adalah ...",
      options: [
        "Nested list adalah list yang hanya berisi angka",
        "Nested list tidak dapat diakses menggunakan indeks",
        "Nested list adalah list di dalam list, berguna untuk data dua dimensi atau lebih",
        "Nested list hanya bisa memiliki satu tingkat",
        "Nested list sama dengan tuple"
      ],
      correct: 2,
    }
  ];

  const handleAnswer = (qIdx, optIdx) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = optIdx;
    setAnswers(newAnswers);
    setFeedbacks(prev => {
      const newFb = [...prev];
      newFb[qIdx] = "";
      return newFb;
    });
  };

  const checkAnswer = (qIdx) => {
    if (answers[qIdx] === null) {
      setFeedbacks(prev => {
        const newFb = [...prev];
        newFb[qIdx] = "❌ Pilih jawaban terlebih dahulu!";
        return newFb;
      });
      return;
    }
    const isCorrect = answers[qIdx] === questions[qIdx].correct;
    if (isCorrect) {
      setFeedbacks(prev => {
        const newFb = [...prev];
        newFb[qIdx] = "✅ Benar!";
        return newFb;
      });
    } else {
      setFeedbacks(prev => {
        const newFb = [...prev];
        newFb[qIdx] = "❌ Salah. Coba lagi!";
        return newFb;
      });
    }
  };

  useEffect(() => {
    const allCorrect = answers.every((ans, idx) => ans !== null && ans === questions[idx].correct);
    if (allCorrect && !completed) {
      setCompleted(true);
      onComplete();
    }
  }, [answers, questions, completed, onComplete]);

  return (
    <div style={styles.eksplorasiContainer}>
      <h3 style={styles.eksplorasiTitle}>🔍 Eksplorasi</h3>
      <p style={styles.text}>Jawab pertanyaan berikut dengan benar agar materi terbuka. Kamu boleh mengulang sampai benar.</p>
      {questions.map((q, idx) => (
        <div key={idx} style={styles.eksplorasiCard}>
          <p style={styles.questionText}>{idx+1}. {q.text}</p>
          <div style={styles.options}>
            {q.options.map((opt, optIdx) => (
              <label key={optIdx} style={styles.optionLabel}>
                <input
                  type="radio"
                  name={`eksplorasi${idx}`}
                  value={optIdx}
                  checked={answers[idx] === optIdx}
                  onChange={() => handleAnswer(idx, optIdx)}
                  style={styles.radio}
                />
                <span style={{ marginLeft: "8px" }}>{opt}</span>
              </label>
            ))}
          </div>
          <button style={styles.checkEksplorasiButton} onClick={() => checkAnswer(idx)}>Periksa Jawaban</button>
          {feedbacks[idx] && (
            <div style={{ marginTop: "8px", fontSize: "14px", fontStyle: "italic", color: feedbacks[idx].includes("Benar") ? "#28a745" : "#dc3545" }}>
              {feedbacks[idx]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
export default function PendahuluanNestedList() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const exampleCodes = {
    nested: `# Contoh nested list: data nilai siswa dalam 2 mata pelajaran
nilai_siswa = [[85, 90, 78],
               [88, 92, 80]]

print("Data nilai siswa:")
print(nilai_siswa)`,
  };

  // Load Pyodide
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

  const runPythonCode = useCallback(async (code) => {
    if (!pyodideRef.current) return "⏳ Pyodide sedang dimuat...";
    try {
      const pyodide = pyodideRef.current;
      const escapedCode = code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
      const result = await pyodide.runPythonAsync(`
import sys
from io import StringIO

_old_stdout = sys.stdout
sys.stdout = _buffer = StringIO()

try:
    exec("""
${escapedCode}
""")
finally:
    sys.stdout = _old_stdout

_buffer.getvalue()
      `);
      return result;
    } catch (error) {
      return `❌ Error: ${error.message}`;
    }
  }, []);

  const handleEksplorasiComplete = () => {
    setIsEksplorasiCompleted(true);
  };

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
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PENDAHULUAN NESTED LIST</h1>
          </div>

          {/* TUJUAN PEMBELAJARAN */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>Mahasiswa mampu memahami pengertian dan konsep dasar nested list sebagai struktur data untuk menyimpan data berjenjang (list di dalam list).</li>
              </ol>
            </div>
          </section>

          {/* EKSPLORASI */}
          <section style={styles.section}>
            <Eksplorasi onComplete={handleEksplorasiComplete} />
          </section>

          {/* MATERI UTAMA (TERKUNCI SAMPAI EKSPLORASI SELESAI) */}
          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={styles.subTitle}>Apa Itu Nested List?</h3>
                  <p style={styles.text}>
                    <strong>Nested list</strong> (atau sering disebut list bersarang) adalah sebuah list yang di dalamnya terdapat list lain sebagai elemen. Dengan kata lain, nested list adalah "list di dalam list". Konsep ini memungkinkan kita menyimpan data dalam bentuk yang lebih kompleks, seperti tabel, matriks, atau struktur data bertingkat.
                  </p>

                  <div style={styles.infoBox}>
                    <strong>💡 Ilustrasi Konsep:</strong>
                    <p>Bayangkan kita memiliki data nilai ujian dari beberapa siswa untuk beberapa mata pelajaran. Dengan list biasa, data akan tercampur dan sulit dibedakan:</p>
                    <code style={styles.inlineCode}>nilai = [85, 90, 78, 88, 92, 80]</code>
                    <p>Namun dengan nested list, data dapat dikelompokkan per siswa:</p>
                    <code style={styles.inlineCode}>nilai = [[85, 90, 78], [88, 92, 80]]</code>
                    <p>Baris pertama adalah nilai siswa 1, baris kedua adalah nilai siswa 2. Jauh lebih terstruktur!</p>
                  </div>

                  <h3 style={styles.subTitle}>Struktur Nested List</h3>
                  <p style={styles.text}>
                    Secara visual, nested list dapat dipandang sebagai tabel atau matriks. Setiap list di dalamnya mewakili satu baris, dan elemen-elemen dalam baris tersebut mewakili kolom. Indeks pertama digunakan untuk memilih baris, indeks kedua untuk memilih kolom.
                  </p>
                  <p style={styles.text}>
                    Misalnya, jika kita memiliki nested list <code>data = [[1, 2, 3], [4, 5, 6]]</code>, maka:
                  </p>
                  <ul style={styles.list}>
                    <li><code>data[0]</code> → [1, 2, 3] (seluruh baris pertama)</li>
                    <li><code>data[0][0]</code> → 1 (baris 1 kolom 1)</li>
                    <li><code>data[1][2]</code> → 6 (baris 2 kolom 3)</li>
                  </ul>

                  <CodeEditor
                    code={exampleCodes.nested}
                    codeKey="nested"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />

                  <p style={styles.text}>
                    Pada contoh di atas, <code>nilai_siswa</code> adalah sebuah nested list yang terdiri dari dua list (baris). Baris pertama berisi nilai untuk tiga mata pelajaran (kolom), baris kedua juga berisi tiga nilai. Dengan struktur ini, kita dapat dengan mudah mengetahui nilai siswa pertama dan kedua secara terpisah.
                  </p>

                  <h3 style={styles.subTitle}>Mengapa Menggunakan Nested List?</h3>
                  <ul style={styles.list}>
                    <li><strong>Data Terstruktur</strong>: Memudahkan representasi data seperti tabel, matriks, atau grid.</li>
                    <li><strong>Pengelompokan</strong>: Mengelompokkan data yang berhubungan dalam satu variabel, sehingga lebih mudah dikelola.</li>
                    <li><strong>Fleksibilitas</strong>: Setiap list di dalam nested list bisa memiliki panjang yang berbeda (ragged array), memberikan fleksibilitas dalam menyimpan data.</li>
                    <li><strong>Dasar untuk Struktur Data Lanjutan</strong>: Nested list menjadi fondasi untuk struktur data multidimensi seperti matriks dalam komputasi numerik.</li>
                  </ul>

                  <h3 style={styles.subTitle}>Contoh Penggunaan dalam Kehidupan Nyata</h3>
                  <ul style={styles.list}>
                    <li><strong>Data Nilai Siswa</strong>: Baris mewakili siswa, kolom mewakili mata pelajaran.</li>
                    <li><strong>Papan Permainan</strong>: Game seperti Tic-Tac-Toe atau Catur dapat direpresentasikan dengan nested list 3x3 atau 8x8.</li>
                    <li><strong>Citra Digital</strong>: Gambar hitam-putih dapat direpresentasikan sebagai nested list di mana setiap elemen adalah nilai intensitas pixel.</li>
                    <li><strong>Koordinat</strong>: Menyimpan titik-titik koordinat (x, y) dalam bentuk list of lists.</li>
                  </ul>
                </div>
              </section>

              {/* LATIHAN (PILIHAN GANDA) */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <LatihanNestedList />
                </div>
              </section>
            </>
          )}

          {/* PESAN TERKUNCI */}
          {!isEksplorasiCompleted && (
            <div style={styles.lockMessage}>
              🔒 Materi terkunci. Selesaikan eksplorasi di atas dengan menjawab kedua pertanyaan dengan benar.
            </div>
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
  list: { paddingLeft: "20px", lineHeight: "1.8" },
  text: { lineHeight: "1.8", color: "#333" },
  subTitle: { marginTop: "20px", marginBottom: "10px", color: "#306998" },
  infoBox: {
    backgroundColor: "#e7f3ff",
    borderLeft: "5px solid #306998",
    padding: "12px 15px",
    margin: "15px 0",
    borderRadius: "6px",
  },
  inlineCode: {
    backgroundColor: "#f0f0f0",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
  },
  lockMessage: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#fef3c7",
    borderLeft: "5px solid #f59e0b",
    borderRadius: "8px",
    textAlign: "center",
    color: "#92400e",
  },
  eksplorasiContainer: {
    marginBottom: "30px",
  },
  eksplorasiTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "15px",
    borderLeft: "5px solid #306998",
    paddingLeft: "12px",
  },
  eksplorasiCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  checkEksplorasiButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },

  // Code editor styles
  codeEditorContainer: {
    border: "2px solid #306998",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "20px",
    backgroundColor: "#1e1e1e",
    marginTop: "15px"
  },
  codeEditorHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "12px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  codeEditorTitle: {
    fontWeight: "600",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  runButton: {
    backgroundColor: "#FFD43B",
    color: "#306998",
    border: "none",
    padding: "8px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },
  codeInputReadOnly: {
    width: "100%",
    minHeight: "100px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    lineHeight: "1.6",
    overflow: "auto"
  },
  codePre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace"
  },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    borderTop: "2px solid #1e1e1e"
  },
  outputTitle: {
    fontWeight: "600",
    fontSize: "15px"
  },
  codeOutput: {
    backgroundColor: "#1e1e1e",
    padding: "15px",
    minHeight: "80px"
  },
  outputContent: {
    color: "#4af",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5"
  },

  // Quiz styles (untuk latihan)
  quizContainer: {
    marginTop: "20px"
  },
  quizTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "15px"
  },
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd"
  },
  questionText: {
    fontWeight: "500",
    marginBottom: "10px"
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "10px"
  },
  optionLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },
  radio: {
    marginRight: "5px"
  },
  checkAllButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
  resetButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
  resultBox: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#d4edda",
    borderRadius: "6px",
    textAlign: "center",
    color: "#155724"
  }
};