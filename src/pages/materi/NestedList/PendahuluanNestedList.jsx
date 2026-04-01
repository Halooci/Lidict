import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN EDITOR DENGAN VALIDASI =====================
const CodeEditorEditable = ({ codeKey, title, expectedAnswer, validationRules, pyodideReady, runPythonCode }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setError("");
  }, []);

  const validateCode = useCallback((code) => {
    const trimmedCode = code.trim();

    const variableRegex = /(\bdata\s*=\s*\[\[[^]]*\],\s*\[[^]]*\]\]\s*)/;
    if (!variableRegex.test(trimmedCode)) {
      return {
        valid: false,
        message: "❌ ERROR: Variabel 'data' harus berupa nested list dengan format [[...], [...]]."
      };
    }

    const nestedListMatch = trimmedCode.match(/data\s*=\s*\[\[(.*?)\],\s*\[(.*?)\]\]/);
    if (!nestedListMatch) {
      return { valid: false, message: "❌ ERROR: Pastikan format nested list benar: [[a, b, ...], [c, d, ...]]." };
    }

    const printWholeList = /print\s*\(\s*data\s*\)/;
    if (!printWholeList.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Kamu harus menampilkan seluruh nested list menggunakan print(data)." };
    }

    const defIndex = trimmedCode.indexOf('data =');
    const printIndex = trimmedCode.indexOf('print(data)');
    if (defIndex === -1 || printIndex === -1) {
      return { valid: false, message: "❌ ERROR: Struktur kode tidak lengkap." };
    }
    if (printIndex < defIndex) {
      return { valid: false, message: "❌ ERROR: Variabel 'data' harus didefinisikan SEBELUM digunakan dalam print." };
    }

    return { valid: true };
  }, []);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }

    setOutput("");
    setError("");

    const validation = validateCode(localCode);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    const result = await runPythonCode(localCode);
    setOutput(result);

    const expectedLines = /\[\[.*?\]\s*,\s*\[.*?\]\]/s;
    if (expectedLines.test(result)) {
      setOutput(result + "\n\n✅ SELAMAT! Nested list kamu sudah benar!");
    } else {
      setOutput(result + "\n\n⚠️ Output tidak sesuai ekspektasi. Cek kembali kodemu!");
    }
  }, [pyodideReady, localCode, runPythonCode, validateCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady}>
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <textarea
        style={{
          ...styles.codeInputEditable,
          border: error ? "2px solid #ff4444" : "none",
        }}
        value={localCode}
        onChange={handleChange}
        placeholder="Ketik kode Python kamu di sini..."
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik 'Jalankan' untuk melihat hasil)"}</pre>
      </div>
    </div>
  );
};

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

// ===================== KOMPONEN KUIS (5 SOAL) =====================
const QuizNestedList = () => {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Apa yang dimaksud dengan nested list?",
      options: [
        "List yang berisi list lain sebagai elemennya",
        "List yang hanya berisi angka",
        "List yang tidak memiliki indeks",
        "List yang hanya memiliki satu elemen"
      ],
      correct: 0,
    },
    {
      id: 2,
      text: "Manakah bentuk yang merupakan nested list?",
      options: [
        "[1, 2, 3]",
        "[[1, 2], [3, 4]]",
        "(1, 2, 3)",
        "{1: 'a', 2: 'b'}"
      ],
      correct: 1,
    },
    {
      id: 3,
      text: "Untuk merepresentasikan data tabel 2 baris 3 kolom, struktur data yang tepat adalah...",
      options: [
        "List biasa",
        "Nested list dengan 2 list di dalamnya, masing-masing berisi 3 elemen",
        "Tuple",
        "Dictionary"
      ],
      correct: 1,
    },
    {
      id: 4,
      text: "Perhatikan kode berikut: `data = [[5, 10], [15, 20]]`. Berapa banyak elemen yang ada pada nested list tersebut?",
      options: [
        "2",
        "4",
        "6",
        "8"
      ],
      correct: 1,
    },
    {
      id: 5,
      text: "Manakah pernyataan yang BENAR tentang nested list?",
      options: [
        "Nested list hanya bisa memiliki 2 level",
        "Nested list tidak bisa berisi tipe data selain list",
        "Nested list berguna untuk menyimpan data yang memiliki hubungan hierarkis atau berdimensi banyak",
        "Nested list hanya bisa digunakan untuk data angka"
      ],
      correct: 2,
    }
  ];

  const handleSelect = (qId, optionIndex) => {
    if (!submitted) {
      setSelected({ ...selected, [qId]: optionIndex });
    }
  };

  const checkAnswers = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selected[q.id] === q.correct) correct++;
    });
    return correct;
  };

  return (
    <div style={styles.quizContainer}>
      <h3 style={styles.quizTitle}>Latihan Interaktif: Kuis Pilihan Ganda</h3>
      {questions.map(q => (
        <div key={q.id} style={styles.questionCard}>
          <p style={styles.questionText}>{q.id}. {q.text}</p>
          <div style={styles.options}>
            {q.options.map((opt, idx) => (
              <label key={idx} style={styles.optionLabel}>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={idx}
                  checked={selected[q.id] === idx}
                  onChange={() => handleSelect(q.id, idx)}
                  disabled={submitted}
                  style={styles.radio}
                />
                <span style={{ marginLeft: "8px" }}>{opt}</span>
              </label>
            ))}
          </div>
          {submitted && (
            <div style={styles.feedback}>
              {selected[q.id] === q.correct ? "✅ Benar" : `❌ Salah. Jawaban yang benar: ${q.options[q.correct]}`}
            </div>
          )}
        </div>
      ))}
      {!submitted && (
        <button style={styles.submitButton} onClick={checkAnswers}>Kumpulkan Jawaban</button>
      )}
      {submitted && (
        <div style={styles.resultBox}>
          <strong>Skor Anda: {calculateScore()} / {questions.length}</strong>
        </div>
      )}
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
export default function PendahuluanNestedList() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

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

  return (
    <>
      <Navbar />
      <div style={{ marginLeft: "280px" }}>
        <SidebarMateri />
        <div style={{ paddingTop: "64px" }}>
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
                  <li>Memahami konsep dasar struktur data nested list dalam Python.</li>
                  <li>Membedakan antara list biasa dan nested list serta mengetahui kegunaannya dalam menyimpan data terstruktur.</li>
                </ol>
              </div>
            </section>

            {/* MATERI (diperbanyak) */}
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

            {/* LATIHAN PRAKTIK */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Latihan Praktik</h2>
              <div style={styles.card}>
                <div style={styles.alertBox}>
                  <strong>⚠️ Instruksi Latihan:</strong>
                  <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                    <li>Buatlah nested list dengan nama <code>data</code> yang berisi dua list di dalamnya.</li>
                    <li>List pertama: [1, 2, 3]</li>
                    <li>List kedua: [4, 5, 6]</li>
                    <li>Tampilkan nested list tersebut menggunakan <code>print(data)</code>.</li>
                  </ul>
                </div>
                <CodeEditorEditable
                  codeKey="latihan"
                  title="Latihan Nested List"
                  validationRules={{}}
                  pyodideReady={pyodideReady}
                  runPythonCode={runPythonCode}
                />
              </div>
            </section>

            {/* LATIHAN INTERAKTIF (KUIS) */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Latihan Interaktif</h2>
              <div style={styles.card}>
                <QuizNestedList />
              </div>
            </section>
          </div>
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
  alertBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "15px",
    color: "#856404",
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
  errorBox: {
    backgroundColor: "#ff4444",
    color: "white",
    padding: "12px 15px",
    fontSize: "14px",
    fontWeight: "500",
    borderBottom: "2px solid #cc0000",
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
  codeInputEditable: {
    width: "100%",
    minHeight: "250px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    lineHeight: "1.6",
    resize: "vertical",
    outline: "none",
    display: "block",
    boxSizing: "border-box",
    tabSize: 4,
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

  // Quiz styles
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
  feedback: {
    marginTop: "8px",
    fontSize: "14px",
    fontStyle: "italic"
  },
  submitButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px"
  },
  resultBox: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#e7f3ff",
    borderRadius: "6px",
    textAlign: "center"
  }
};