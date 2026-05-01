import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';

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

// ===================== VISUALISASI PERBANDINGAN =====================
const IlustrasiPerbandingan = () => {
  const dataBiasa = [85, 90, 78, 88, 92, 80];
  const dataNested = [
    [85, 90, 78],
    [88, 92, 80]
  ];

  return (
    <div style={styles.perbandinganContainer}>
      <h4 style={styles.perbandinganTitle}>Perbandingan Penyimpanan Data Nilai Siswa</h4>
      <div style={styles.perbandinganWrapper}>
        {/* List Biasa */}
        <div style={styles.perbandinganCard}>
          <h5 style={styles.perbandinganCardTitleRed}>Tanpa Nested List (List Biasa)</h5>
          <pre style={styles.perbandinganCode}>nilai = [85, 90, 78, 88, 92, 80]</pre>
          <p style={styles.perbandinganWarning}>⚠️ Semua nilai tercampur. Tidak jelas mana nilai milik siswa 1 dan mana milik siswa 2.</p>
          <table style={styles.perbandinganTable}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th>Indeks</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ fontWeight: "bold" }}>Nilai</td><td>85</td><td>90</td><td>78</td><td>88</td><td>92</td><td>80</td></tr>
            </tbody>
          </table>
          <p style={styles.perbandinganNote}>Seharusnya nilai siswa 1: 85,90,78 dan siswa 2: 88,92,80, tetapi di sini tercampur.</p>
        </div>

        {/* Nested List */}
        <div style={styles.perbandinganCard}>
          <h5 style={styles.perbandinganCardTitleGreen}>Dengan Nested List</h5>
          <pre style={styles.perbandinganCode}>nilai = [[85, 90, 78], [88, 92, 80]]</pre>
          <p style={styles.perbandinganSuccess}>✓ Data terkelompok per siswa (baris) menjadi lebih terstruktur.</p>
          <table style={styles.perbandinganTable}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th>Baris (Siswa)</th><th>Kolom 0</th><th>Kolom 1</th><th>Kolom 2</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ fontWeight: "bold" }}>Siswa 1 (baris 0)</td><td>85</td><td>90</td><td>78</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Siswa 2 (baris 1)</td><td>88</td><td>92</td><td>80</td></tr>
            </tbody>
          </table>
          <p style={styles.perbandinganItalic}>Jauh lebih mudah diakses per siswa!</p>
        </div>
      </div>
    </div>
  );
};

// ===================== EKSPLORASI =====================
const Eksplorasi = ({ onComplete }) => {
  const [selected, setSelected] = useState([null, null]);
  const [feedback, setFeedback] = useState(["", ""]);
  const [hasAnswered, setHasAnswered] = useState([false, false]);

  const questions = [
    {
      text: "Kita memerlukan nested list dalam pemrograman karena ...",
      options: [
        "Nested list lebih cepat dari list biasa",
        "Untuk menyimpan data yang memiliki struktur bertingkat atau tabel",
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
        "Nested list adalah list di dalam list",
        "Nested list hanya bisa memiliki satu tingkat",
        "Nested list sama dengan tuple"
      ],
      correct: 2,
    }
  ];

  const handleAnswer = (qIdx, optIdx) => {
    if (hasAnswered[qIdx]) return;
    setSelected(prev => { const newSel = [...prev]; newSel[qIdx] = optIdx; return newSel; });
    const isCorrect = (optIdx === questions[qIdx].correct);
    setFeedback(prev => { const newFb = [...prev]; newFb[qIdx] = isCorrect ? "Benar" : "Salah"; return newFb; });
    setHasAnswered(prev => { const newAns = [...prev]; newAns[qIdx] = true; return newAns; });
  };

  useEffect(() => {
    if (hasAnswered.every(v => v === true)) onComplete();
  }, [hasAnswered, onComplete]);

  return (
    <div>
      <h2 style={styles.sectionTitle}>Eksplorasi Awal</h2>
      <div style={styles.card}>
        <p style={styles.text}>
          Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
          <strong style={{ color: "#0d6efd" }}> Materi akan terbuka setelah kedua pertanyaan dijawab.</strong>
        </p>
        {questions.map((q, idx) => {
          const isAnswered = hasAnswered[idx];
          const selectedIdx = selected[idx];
          return (
            <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
              <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {q.options.map((opt, optIdx) => {
                  let optionStyle = styles.eksplorasiOption;
                  if (isAnswered) {
                    optionStyle = { ...styles.eksplorasiOptionDisabled };
                    if (selectedIdx === optIdx) {
                      const isCorrect = (selectedIdx === q.correct);
                      optionStyle = {
                        ...optionStyle,
                        backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
                        borderColor: isCorrect ? "#28a745" : "#dc3545",
                        color: isCorrect ? "#155724" : "#842029",
                      };
                    }
                  }
                  return (
                    <div key={optIdx} onClick={() => !isAnswered && handleAnswer(idx, optIdx)} style={optionStyle}>
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </div>
                  );
                })}
              </div>
              {feedback[idx] && (
                <div style={feedback[idx] === "Benar" ? styles.feedbackCorrect : styles.feedbackWrong}>
                  {feedback[idx]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===================== LATIHAN =====================
const LatihanNestedList = () => {
  const [selected, setSelected] = useState([null, null, null, null, null]);
  const [locked, setLocked] = useState([false, false, false, false, false]);
  const [feedbackMsg, setFeedbackMsg] = useState(["", "", "", "", ""]);
  const [warning, setWarning] = useState(null);
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
    if (locked[qId]) return;
    const newSelected = [...selected];
    newSelected[qId] = optionIndex;
    setSelected(newSelected);
    if (allCorrect) setAllCorrect(false);
    const newFeedback = [...feedbackMsg];
    newFeedback[qId] = "";
    setFeedbackMsg(newFeedback);
    setWarning(null);
  };

  const handleCheckAll = () => {
    const allAnswered = selected.every(sel => sel !== null);
    if (!allAnswered) {
      setWarning("⚠️ Semua soal harus dijawab terlebih dahulu sebelum diperiksa.");
      return;
    }
    setWarning(null);

    let newLocked = [...locked];
    let newFeedback = [...feedbackMsg];
    let allNowCorrect = true;

    for (let i = 0; i < questions.length; i++) {
      if (locked[i]) {
        newFeedback[i] = "benar";
        continue;
      }
      const isCorrect = (selected[i] === questions[i].correct);
      if (isCorrect) {
        newLocked[i] = true;
        newFeedback[i] = "benar";
      } else {
        newLocked[i] = false;
        newFeedback[i] = "salah";
        allNowCorrect = false;
      }
    }
    setLocked(newLocked);
    setFeedbackMsg(newFeedback);
    setAllCorrect(allNowCorrect);
  };

  return (
    <div>
      <h2 style={styles.sectionTitle}>Latihan</h2>
      <div style={styles.card}>
        <p style={styles.text}>
          Jawab semua soal dengan memilih opsi yang benar. Klik "Cek Semua Jawaban" untuk memeriksa.
          Soal yang sudah benar akan terkunci. Soal yang salah dapat diperbaiki, lalu periksa kembali.
        </p>
        {questions.map((q, idx) => {
          const isLocked = locked[idx];
          const selectedIdx = selected[idx];
          const fb = feedbackMsg[idx];
          return (
            <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
              <p style={styles.questionText}>{idx+1}. {q.text}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {q.options.map((opt, optIdx) => {
                  let optionStyle = styles.quizOption;
                  if (isLocked) {
                    optionStyle = { ...styles.quizOptionDisabled };
                    if (selectedIdx === optIdx) {
                      optionStyle = {
                        ...optionStyle,
                        backgroundColor: "#d4edda",
                        borderColor: "#28a745",
                        color: "#155724",
                      };
                    }
                  } else {
                    if (selectedIdx === optIdx) {
                      optionStyle = { ...optionStyle, backgroundColor: "#306998", color: "white", borderColor: "#306998" };
                    }
                  }
                  return (
                    <div
                      key={optIdx}
                      onClick={() => !isLocked && handleSelect(idx, optIdx)}
                      style={optionStyle}
                      onMouseEnter={(e) => {
                        if (!isLocked && selectedIdx !== optIdx) {
                          e.currentTarget.style.backgroundColor = "#fef9e6";
                          e.currentTarget.style.borderColor = "#FFD43B";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLocked && selectedIdx !== optIdx) {
                          e.currentTarget.style.backgroundColor = "#fff";
                          e.currentTarget.style.borderColor = "#306998";
                        }
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </div>
                  );
                })}
              </div>
              {fb === "benar" && <div style={{ marginTop: "8px", fontSize: "14px", color: "#28a745", fontWeight: "500" }}>✓ Benar</div>}
              {fb === "salah" && <div style={{ marginTop: "8px", fontSize: "14px", color: "#dc3545", fontWeight: "500" }}>✗ Salah, coba pilih jawaban lain</div>}
            </div>
          );
        })}
        {warning && <div style={styles.quizWarning}>{warning}</div>}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "center" }}>
          <button style={styles.checkAllButton} onClick={handleCheckAll}>Cek Semua Jawaban</button>
        </div>
        {allCorrect && <div style={styles.resultBox}>🎉 Selamat! Semua jawaban sudah dijawab dengan benar.</div>}
      </div>
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
export default function PendahuluanNestedList() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) {
      navigate('/loginregister');
    }
  }, [navigate]);

  
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

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

  const handleEksplorasiComplete = () => setIsEksplorasiCompleted(true);

  return (
    <>
      <Navbar />
      <SidebarMateri isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="main-content" style={{ marginLeft: isSidebarOpen ? "280px" : "0", transition: "margin-left 0.3s ease", paddingTop: "64px", minHeight: "100vh", width: "auto" }}>
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PENDAHULUAN NESTED LIST</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>Mahasiswa mampu memahami pengertian dan konsep dasar nested list dalam Python.</li>
              </ol>
            </div>
          </section>

          <section style={styles.section}>
            <Eksplorasi onComplete={handleEksplorasiComplete} />
          </section>

          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={styles.subTitle}>Apa Itu Nested List?</h3>
                  <p style={styles.text}>
                    <strong>Nested list</strong> (list bersarang) adalah sebuah list yang di dalamnya terdapat list lain sebagai elemen. Dengan kata lain, nested list adalah "list di dalam list". Konsep ini memungkinkan kita menyimpan data dalam bentuk yang lebih kompleks, seperti tabel, matriks, atau struktur data bertingkat.
                  </p>
                  <div style={styles.infoBox}>
                    <strong>💡 Ilustrasi Konsep:</strong>
                    <p>Bayangkan kita memiliki data nilai ujian dari beberapa siswa untuk beberapa mata pelajaran. Dengan list biasa, data akan tercampur dan sulit dibedakan. Namun dengan nested list, data dapat dikelompokkan per siswa menjadi lebih terstruktur seperti tabel di bawah ini.</p>
                    <IlustrasiPerbandingan />
                  </div>
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
              <section style={styles.section}>
                <LatihanNestedList />
              </section>
            </>
          )}

          {!isEksplorasiCompleted && (
            <div style={styles.lockMessage}>🔒 Materi terkunci. Selesaikan eksplorasi di atas dengan menjawab kedua pertanyaan.</div>
          )}
        </div>
      </div>
    </>
  );
}

// ===================== STYLES =====================
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
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
  subTitle: {
    marginTop: "24px",
    marginBottom: "14px",
    color: "#306998",
    fontSize: "20px",
    fontWeight: "700",
    borderLeft: "3px solid #FFD43B",
    paddingLeft: "12px",
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    borderLeft: "4px solid #2196f3",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "0 8px 8px 0",
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
  eksplorasiOption: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  eksplorasiOptionDisabled: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#e9ecef",
    color: "#6c757d",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  feedbackCorrect: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    borderRadius: "6px",
    fontWeight: "500",
  },
  feedbackWrong: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#f8d7da",
    color: "#842029",
    borderRadius: "6px",
    fontWeight: "500",
  },
  codeEditorContainer: {
    border: "2px solid #306998",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "20px",
    backgroundColor: "#1e1e1e",
    marginTop: "15px",
  },
  codeEditorHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "12px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeEditorTitle: {
    fontWeight: "600",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
  },
  codeInputReadOnly: {
    width: "100%",
    minHeight: "100px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflow: "auto",
  },
  codePre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontFamily: "monospace",
  },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    borderTop: "2px solid #1e1e1e",
  },
  outputTitle: {
    fontWeight: "600",
    fontSize: "15px",
  },
  codeOutput: {
    backgroundColor: "#1e1e1e",
    padding: "15px",
    minHeight: "80px",
  },
  outputContent: {
    color: "#4af",
    fontFamily: "monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5",
  },
  questionText: {
    fontWeight: "600",
    marginBottom: "12px",
    fontSize: "15px",
  },
  quizOption: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #306998",
    backgroundColor: "#fff",
    marginBottom: "8px",
  },
  quizOptionDisabled: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#e9ecef",
    color: "#6c757d",
    cursor: "not-allowed",
    opacity: 0.7,
    marginBottom: "8px",
  },
  checkAllButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  quizWarning: {
    marginTop: "15px",
    marginBottom: "10px",
    padding: "12px",
    backgroundColor: "#fff3cd",
    color: "#856404",
    borderRadius: "8px",
    textAlign: "center",
  },
  resultBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#d1e7dd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#0f5132",
    fontWeight: "bold",
  },
  // additional styles for perbandingan
  perbandinganContainer: {
    margin: "20px 0",
    padding: "15px",
    backgroundColor: "#f0f4f8",
    borderRadius: "12px",
  },
  perbandinganTitle: {
    marginBottom: "15px",
    color: "#306998",
  },
  perbandinganWrapper: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  perbandinganCard: {
    flex: 1,
    minWidth: "250px",
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  perbandinganCardTitleRed: {
    textAlign: "center",
    color: "#dc3545",
  },
  perbandinganCardTitleGreen: {
    textAlign: "center",
    color: "#28a745",
  },
  perbandinganCode: {
    backgroundColor: "#f8f9fa",
    padding: "10px",
    borderRadius: "8px",
    overflowX: "auto",
  },
  perbandinganWarning: {
    fontSize: "14px",
    marginTop: "10px",
    color: "#dc3545",
  },
  perbandinganSuccess: {
    fontSize: "14px",
    marginTop: "10px",
    color: "#28a745",
  },
  perbandinganTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    fontSize: "13px",
  },
  perbandinganNote: {
    fontSize: "12px",
    marginTop: "8px",
    color: "#666",
  },
  perbandinganItalic: {
    fontSize: "13px",
    marginTop: "10px",
    fontStyle: "italic",
  },
};