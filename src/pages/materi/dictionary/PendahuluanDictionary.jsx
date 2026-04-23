import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN EDITOR READ-ONLY DENGAN VISUALISASI DAN PENJELASAN =====================
const DictionaryVisualization = ({ data, accessSequence = [], title }) => {
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (!accessSequence || accessSequence.length === 0) return;
    let step = 0;
    const interval = setInterval(() => {
      if (step < accessSequence.length) {
        setHighlightedKey(accessSequence[step]);
        setAnimationStep(step + 1);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setHighlightedKey(null);
          setAnimationStep(0);
        }, 500);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [accessSequence]);

  return (
    <div style={visStyles.container}>
      <div style={visStyles.title}>{title}</div>
      <div style={visStyles.dictContainer}>
        {Object.entries(data).map(([key, value]) => {
          const isHighlighted = highlightedKey === key;
          const isLast = accessSequence && animationStep === accessSequence.length && highlightedKey === null;
          return (
            <div key={key} style={{ ...visStyles.card, backgroundColor: isHighlighted ? "#FFD43B" : "#306998", transform: isHighlighted ? "scale(1.05)" : "scale(1)", transition: "all 0.3s ease" }}>
              <div style={visStyles.key}>{key}</div>
              <div style={visStyles.arrow}>→</div>
              <div style={visStyles.value}>{typeof value === 'string' ? value : JSON.stringify(value)}</div>
            </div>
          );
        })}
      </div>
      {accessSequence.length > 0 && (
        <div style={visStyles.info}>
          {highlightedKey ? (
            <span>🔍 Mengakses key <strong>"{highlightedKey}"</strong> → nilai: <strong>{data[highlightedKey] !== undefined ? data[highlightedKey] : "Tidak ditemukan (None)"}</strong></span>
          ) : animationStep === accessSequence.length ? (
            <span>✅ Semua akses selesai!</span>
          ) : (
            <span>🎬 Animasi akan berjalan... Klik Jalankan</span>
          )}
        </div>
      )}
      {accessSequence.length === 0 && <div style={visStyles.info}>📦 Dictionary siap digunakan</div>}
    </div>
  );
};

const visStyles = {
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "15px",
    margin: "15px 0",
    border: "1px solid #dee2e6",
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#306998",
    textAlign: "center",
  },
  dictContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    padding: "10px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "500",
  },
  key: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  arrow: {
    fontSize: "18px",
    margin: "0 15px",
  },
  value: {
    fontSize: "14px",
  },
  info: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "13px",
    color: "#555",
    backgroundColor: "#e9ecef",
    padding: "8px",
    borderRadius: "8px",
  },
};

const CodeEditor = ({ code, codeKey, pyodideReady, runPythonCode, explanations, visualizationData }) => {
  const [output, setOutput] = useState("");
  const [hasRun, setHasRun] = useState(false);
  const [showVisual, setShowVisual] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setShowVisual(false);
    setHasRun(false);
    const result = await runPythonCode(code);
    setOutput(result);
    setHasRun(true);
    setShowVisual(true);
  }, [pyodideReady, code, runPythonCode]);

  const codeLines = code.split('\n');
  const hasExplanations = explanations && explanations.length === codeLines.length;

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>Contoh Kode Program</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady}>
          {pyodideReady ? "Jalankan" : "Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>{code}</pre>
      </div>
      {showVisual && visualizationData && (
        <DictionaryVisualization
          data={visualizationData.dictionary}
          accessSequence={visualizationData.accessSequence || []}
          title={visualizationData.title || "Visualisasi Dictionary"}
        />
      )}
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik 'Jalankan' untuk melihat hasil)"}</pre>
      </div>
      {hasRun && hasExplanations && (
        <div style={styles.explanationsContainer}>
          <div style={styles.explanationsHeader}>
            <span style={styles.explanationsTitle}>Penjelasan Kode (per baris)</span>
          </div>
          <div style={styles.explanationsContent}>
            {codeLines.map((line, idx) => {
              if (line.trim() === "" && !explanations[idx]) return null;
              return (
                <div key={idx} style={styles.explanationItem}>
                  <span style={styles.lineNumber}>Baris {idx+1}:</span>
                  <code style={styles.lineCode}>{line}</code>
                  <span style={styles.lineExplanation}>→ {explanations[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ===================== KOMPONEN LATIHAN PRAKTIK (VALIDASI TOLERAN) =====================
const CodeEditorEditable = ({ codeKey, title, pyodideReady, runPythonCode, expectedOutput }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setError("");
  }, []);

  const validateCode = useCallback((code) => {
    const trimmedCode = code.trim();
    if (!/\bdata_mahasiswa\s*=\s*\{[^}]*\}/.test(trimmedCode)) {
      return { valid: false, message: "ERROR: Buatlah dictionary dengan nama 'data_mahasiswa'." };
    }
    const printNamaRegex = /print\s*\(\s*data_mahasiswa\s*\[\s*["']nama["']\s*\]\s*\)/;
    if (!printNamaRegex.test(trimmedCode)) {
      return { valid: false, message: "ERROR: Tampilkan nilai dari key 'nama' dengan print(data_mahasiswa['nama'])." };
    }
    const printUsiaRegex = /print\s*\(\s*data_mahasiswa\s*\[\s*["']usia["']\s*\]\s*\)/;
    if (!printUsiaRegex.test(trimmedCode)) {
      return { valid: false, message: "ERROR: Tampilkan nilai dari key 'usia' dengan print(data_mahasiswa['usia'])." };
    }
    return { valid: true };
  }, []);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat, harap tunggu...");
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
    
    const lines = result.trim().split('\n').filter(l => l.trim() !== "");
    if (expectedOutput && lines[0] === expectedOutput[0] && lines[1] === expectedOutput[1]) {
      setOutput(result + "\n\nSELAMAT! Kode kamu benar!");
    } else if (expectedOutput) {
      setOutput(result + "\n\nOutput tidak sesuai. Cek kembali nilai yang dicetak.");
    }
  }, [pyodideReady, localCode, runPythonCode, validateCode, expectedOutput]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady}>
          {pyodideReady ? "Jalankan" : "Memuat..."}
        </button>
      </div>
      {error && <div style={styles.errorBox}>{error}</div>}
      <textarea
        style={{ ...styles.codeInputEditable, border: error ? "2px solid #ff4444" : "none" }}
        value={localCode}
        onChange={handleChange}
        placeholder="Tulis kode Python kamu di sini..."
        spellCheck={false}
        autoComplete="off"
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

// ===================== KOMPONEN SOAL MELENGKAPI KODE =====================
const CodeCompletionQuestion = ({ question, codeParts, placeholders, expectedAnswers }) => {
  const [answers, setAnswers] = useState(placeholders.map(() => ""));
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [isEmptyError, setIsEmptyError] = useState(false);

  const resetQuestion = () => {
    setAnswers(placeholders.map(() => ""));
    setFeedback("");
    setChecked(false);
    setIsEmptyError(false);
  };

  const handleAnswerChange = (idx, value) => {
    if (checked && feedback === "Benar!") return;
    if (checked) {
      setChecked(false);
      setFeedback("");
    }
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
    if (isEmptyError) setIsEmptyError(false);
  };

  const handleCheck = () => {
    const allFilled = answers.every(ans => ans.trim() !== "");
    if (!allFilled) {
      setIsEmptyError(true);
      setFeedback("Lengkapi semua isian terlebih dahulu!");
      setChecked(false);
      return;
    }
    setIsEmptyError(false);

    let allCorrect = true;
    for (let i = 0; i < expectedAnswers.length; i++) {
      const userAnswer = answers[i].trim().replace(/["']/g, '"');
      const expected = expectedAnswers[i].replace(/["']/g, '"');
      if (userAnswer !== expected) {
        allCorrect = false;
        break;
      }
    }
    setChecked(true);
    if (allCorrect) {
      setFeedback("Benar!");
    } else {
      setFeedback("Jawaban Kamu Salah. Coba lagi!");
    }
  };

  const getInputSize = (answer, placeholder) => {
    const length = Math.max(answer.length, placeholder?.length || 0, 10);
    return length + 2;
  };

  const renderCodeWithInputs = () => {
    const result = [];
    for (let i = 0; i < codeParts.length; i++) {
      result.push(<span key={`text-${i}`}>{codeParts[i]}</span>);
      if (i < placeholders.length) {
        const isCorrectAndLocked = (checked && feedback === "Benar!");
        result.push(
          <input
            key={`input-${i}`}
            type="text"
            size={getInputSize(answers[i], placeholders[i])}
            style={styles.inlineInput}
            value={answers[i]}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            disabled={isCorrectAndLocked}
            placeholder={placeholders[i] || "..."}
          />
        );
      }
    }
    return result;
  };

  const showReset = checked && feedback && feedback !== "Benar!";

  return (
    <div style={styles.questionCard}>
      <p style={styles.questionText}>{question}</p>
      <pre style={styles.codeTemplateInline}>
        {renderCodeWithInputs()}
      </pre>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button style={styles.checkButton} onClick={handleCheck} disabled={checked && feedback === "Benar!"}>
          Periksa
        </button>
        {showReset && (
          <button style={styles.resetButtonPerSoal} onClick={resetQuestion}>
            Reset Jawaban
          </button>
        )}
      </div>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function PembuatanAksesElementDictionary() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // EKSPLORASI
  const [eksplorasiSelected, setEksplorasiSelected] = useState([null, null, null]);
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", "", ""]);
  const [eksplorasiHasAnswered, setEksplorasiHasAnswered] = useState([false, false, false]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const eksplorasiQuestions = [
    {
      text: "Berikut ini cara membuat dictionary kosong yang benar di Python adalah ...",
      options: ["data = []", "data = ()", "data = {}", "data = dict[]", "data = set()"],
      correct: 2,
    },
    {
      text: "Perhatikan kode berikut:\n\n`mahasiswa = {\"nama\": \"Budi\", \"nim\": \"123\"}`\n\nApa output dari `print(mahasiswa[\"nama\"])`?",
      options: ["mahasiswa", "Budi", "nama", "123", "Error"],
      correct: 1,
    },
    {
      text: "Berikut ini cara mengakses nilai dictionary dengan aman (tidak menyebabkan error jika key tidak ada) adalah ...",
      options: [
        "dict[key]",
        "dict.get(key)",
        "dict[key] if key in dict",
        "dict.key",
        "dict[key] else default"
      ],
      correct: 1,
    },
  ];

  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    if (eksplorasiHasAnswered[questionIdx]) return;
    setEksplorasiSelected(prev => {
      const newSel = [...prev];
      newSel[questionIdx] = optionIdx;
      return newSel;
    });
    const isCorrect = optionIdx === eksplorasiQuestions[questionIdx].correct;
    setEksplorasiFeedback(prev => {
      const newFb = [...prev];
      newFb[questionIdx] = isCorrect ? "Benar" : "Salah";
      return newFb;
    });
    setEksplorasiHasAnswered(prev => {
      const newAns = [...prev];
      newAns[questionIdx] = true;
      return newAns;
    });
  };

  useEffect(() => {
    const allAnswered = eksplorasiHasAnswered.every(v => v === true);
    if (allAnswered && !isEksplorasiCompleted) {
      setIsEksplorasiCompleted(true);
    }
  }, [eksplorasiHasAnswered, isEksplorasiCompleted]);

  // Data untuk visualisasi
  const dictMembuat = {
    nama: "Budi Santoso",
    nim: "12345678",
    jurusan: "Informatika"
  };
  const dictAkses = {
    nama: "Budi Santoso",
    nim: "12345678",
    jurusan: "Informatika",
    alamat: "Tidak tersedia" // untuk keperluan get default, tapi di visualisasi tetap sama
  };
  // Untuk akses, sequence key sesuai urutan di kode: "nama", "nim", "jurusan", "alamat" (walaupun alamat tidak ada)
  const accessSequence = ["nama", "nim", "jurusan", "alamat"];

  const exampleCodes = {
    membuatDict: `mahasiswa = {
    "nama": "Budi Santoso",
    "nim": "12345678",
    "jurusan": "Informatika"
}
print("Dictionary mahasiswa:")
print(mahasiswa)

data = dict(nama="Ani", usia=20, kota="Jakarta")
print("\\nDictionary data:")
print(data)`,
    aksesDict: `mahasiswa = {
    "nama": "Budi Santoso",
    "nim": "12345678",
    "jurusan": "Informatika"
}

print("Nama:", mahasiswa["nama"])
print("NIM:", mahasiswa["nim"])

print("Jurusan:", mahasiswa.get("jurusan"))
print("Alamat:", mahasiswa.get("alamat", "Tidak tersedia"))`,
  };

  const explanations = {
    membuatDict: [
      "Mendeklarasikan dictionary dengan nama 'mahasiswa' menggunakan kurung kurawal.",
      "Key 'nama' dengan value 'Budi Santoso' (string).",
      "Key 'nim' dengan value '12345678' (string).",
      "Key 'jurusan' dengan value 'Informatika' (string).",
      "Menutup kurung kurawal dictionary.",
      "Mencetak teks 'Dictionary mahasiswa:' ke layar.",
      "Mencetak isi dictionary 'mahasiswa' (menampilkan semua pasangan key-value).",
      "Baris kosong sebagai pemisah output.",
      "Membuat dictionary 'data' menggunakan fungsi dict() dengan argumen keyword: nama='Ani', usia=20, kota='Jakarta'.",
      "Mencetak teks '\\nDictionary data:' (newline di awal).",
      "Mencetak isi dictionary 'data'."
    ],
    aksesDict: [
      "Mendeklarasikan dictionary 'mahasiswa' dengan 3 pasangan key-value.",
      "Key 'nama' dengan value 'Budi Santoso'.",
      "Key 'nim' dengan value '12345678'.",
      "Key 'jurusan' dengan value 'Informatika'.",
      "Menutup kurung kurawal.",
      "Baris kosong.",
      "Mencetak teks 'Nama:' diikuti dengan nilai dari key 'nama' menggunakan tanda kurung siku (akses langsung).",
      "Mencetak teks 'NIM:' diikuti dengan nilai dari key 'nim'.",
      "Baris kosong.",
      "Mencetak 'Jurusan:' dengan nilai dari key 'jurusan' menggunakan metode get(). get() akan mengembalikan None jika key tidak ada, tapi di sini key ada.",
      "Mencetak 'Alamat:' dengan nilai dari key 'alamat'. Karena key 'alamat' tidak ada, get() mengembalikan nilai default 'Tidak tersedia'."
    ],
  };

  // Soal latihan
  const soal1CodeParts = [
    "data = {\n    \"nama\": \"Budi\",\n    ",
    ": 20,\n    \"kota\": \"Jakarta\"\n}\nprint(data)"
  ];
  const soal1Placeholders = ["..."];
  const soal1Expected = ["\"usia\""];

  const soal2CodeParts = [
    "data = dict(",
    "=\"Andi\", umur=22, kota=\"Bandung\")\nprint(data[\"",
    "\"])"
  ];
  const soal2Placeholders = ["...", "..."];
  const soal2Expected = ["nama", "nama"];

  const soal3CodeParts = [
    "nilai = {\n    \"Matematika\": 85,\n    \"Fisika\": 90,\n    \"Kimia\": 78\n}\nprint(\"Nilai Fisika:\", nilai[",
    "])"
  ];
  const soal3Placeholders = ["..."];
  const soal3Expected = ["\"Fisika\""];

  const soal4CodeParts = [
    "data = {\"nama\": \"Citra\", \"usia\": 19}\nprint(data.get(",
    ", \"Tidak ditemukan\"))  # akan mencetak \"Tidak ditemukan\" karena key tidak ada"
  ];
  const soal4Placeholders = ["..."];
  const soal4Expected = ["\"alamat\""];

  const soal5CodeParts = [
    "siswa = {\n    \"nama\": \"Rina\",\n    \"kelas\": \"XII\",\n    ",
    ": 17\n}\nprint(\"Nama:\", siswa[",
    "])"
  ];
  const soal5Placeholders = ["...", "..."];
  const soal5Expected = ["\"usia\"", "\"nama\""];

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
    if (!pyodideRef.current) return "Pyodide sedang dimuat...";
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
      return `Error: ${error.message}`;
    }
  }, []);

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
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PEMBUATAN DAN AKSES ELEMEN DICTIONARY</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li>Mahasiswa mampu membuat dictionary.</li>
                <li>Mahasiswa mampu mengakses nilai dari dictionary.</li>
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Eksplorasi</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
                <strong style={{ color: "#0d6efd" }}> Materi akan terbuka setelah ketiga pertanyaan dijawab.</strong>
              </p>
              {eksplorasiQuestions.map((q, idx) => {
                const isAnswered = eksplorasiHasAnswered[idx];
                const selectedIdx = eksplorasiSelected[idx];
                return (
                  <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
                    <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {q.options.map((opt, optIdx) => {
                        let optionStyle = { ...styles.eksplorasiOption, cursor: "pointer" };
                        if (isAnswered) {
                          optionStyle.cursor = "not-allowed";
                          optionStyle.opacity = 0.7;
                          if (selectedIdx === optIdx) {
                            const isCorrect = (selectedIdx === q.correct);
                            optionStyle.backgroundColor = isCorrect ? "#d4edda" : "#f8d7da";
                            optionStyle.borderColor = isCorrect ? "#28a745" : "#dc3545";
                            optionStyle.color = isCorrect ? "#155724" : "#842029";
                          } else {
                            optionStyle.backgroundColor = "#e9ecef";
                            optionStyle.color = "#6c757d";
                          }
                        } else {
                          optionStyle.backgroundColor = eksplorasiSelected[idx] === optIdx ? "#2fa69a" : "#f9f9f9";
                          optionStyle.color = eksplorasiSelected[idx] === optIdx ? "white" : "#1f2937";
                        }
                        return (
                          <div key={optIdx} onClick={() => !isAnswered && handleEksplorasiSelect(idx, optIdx)} style={optionStyle}>
                            <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </div>
                        );
                      })}
                    </div>
                    {eksplorasiFeedback[idx] && (
                      <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", backgroundColor: eksplorasiFeedback[idx] === "Benar" ? "#d1e7dd" : "#f8d7da", color: eksplorasiFeedback[idx] === "Benar" ? "#0f5132" : "#842029" }}>
                        {eksplorasiFeedback[idx] === "Benar" ? "Benar" : "Salah"}
                      </div>
                    )}
                  </div>
                );
              })}
              {!isEksplorasiCompleted && (
                <div style={styles.lockMessage}>Materi terkunci. Jawab semua pertanyaan di atas untuk membuka materi.</div>
              )}
            </div>
          </section>

          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={styles.subTitle}>1. Membuat Dictionary</h3>
                  <p style={styles.text}>Dictionary dapat dibuat dengan dua cara: menggunakan kurung kurawal <code>{`{}`}</code> atau fungsi <code>dict()</code>.</p>
                  <CodeEditor 
                    code={exampleCodes.membuatDict} 
                    codeKey="membuatDict" 
                    pyodideReady={pyodideReady} 
                    runPythonCode={runPythonCode} 
                    explanations={explanations.membuatDict}
                    visualizationData={{
                      dictionary: dictMembuat,
                      accessSequence: [],
                      title: "Visualisasi Dictionary setelah dibuat"
                    }}
                  />
                  <h3 style={styles.subTitle}>2. Mengakses Nilai Dictionary</h3>
                  <p style={styles.text}>Ada dua cara mengakses nilai: menggunakan <code>nama_dict["key"]</code> (akan error jika key tidak ada) atau metode <code>.get("key", default)</code> (lebih aman).</p>
                  <CodeEditor 
                    code={exampleCodes.aksesDict} 
                    codeKey="aksesDict" 
                    pyodideReady={pyodideReady} 
                    runPythonCode={runPythonCode} 
                    explanations={explanations.aksesDict}
                    visualizationData={{
                      dictionary: dictAkses,
                      accessSequence: accessSequence,
                      title: "Visualisasi Akses Dictionary (animasi)"
                    }}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ayo Praktik</h2>
                <div style={styles.card}>
                  <div style={styles.alertBox}>
                    <strong>Studi Kasus: Data Mahasiswa</strong>
                    <p style={{ marginTop: "10px", marginBottom: "10px" }}>
                      Seorang dosen ingin menyimpan data mahasiswa secara terstruktur. Ia membutuhkan sebuah wadah yang bisa menyimpan informasi seperti nama, usia, dan jurusan dengan mudah diakses. 
                      Python menyediakan dictionary untuk kebutuhan ini, di mana setiap data memiliki label (key) sehingga memudahkan pencarian.
                    </p>
                    <p style={{ marginBottom: "5px" }}>Ikuti langkah-langkah berikut untuk menyelesaikan studi kasus ini:</p>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>Buatlah dictionary dengan nama <code>data_mahasiswa</code> yang berisi key: <code>"nama"</code> dengan value <code>"Citra"</code>, key <code>"usia"</code> dengan value <code>22</code>, dan key <code>"jurusan"</code> dengan value <code>"Sistem Informasi"</code>.</li>
                      <li>Tampilkan nilai dari key <code>"nama"</code> menggunakan <code>print()</code>.</li>
                      <li>Tampilkan nilai dari key <code>"usia"</code> menggunakan <code>print()</code>.</li>
                    </ul>
                  </div>
                  <CodeEditorEditable 
                    codeKey="latihan" 
                    title="Ayo Praktik: Membuat dan Mengakses Dictionary" 
                    pyodideReady={pyodideReady} 
                    runPythonCode={runPythonCode} 
                    expectedOutput={["Citra", "22"]} 
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <p style={styles.text}>Lengkapi kode berikut dengan mengetikkan jawaban pada kotak yang tersedia. Latihan ini akan menguji kemampuan Anda dalam membuat dictionary dan mengakses elemennya.</p>
                  
                  <CodeCompletionQuestion 
                    question="1. Lengkapi kode untuk membuat dictionary dengan key 'usia' yang bernilai 20." 
                    codeParts={soal1CodeParts} 
                    placeholders={soal1Placeholders} 
                    expectedAnswers={soal1Expected} 
                  />

                  <CodeCompletionQuestion 
                    question="2. Lengkapi kode untuk membuat dictionary menggunakan fungsi dict() dengan key 'nama' dan menampilkan nilai 'nama'." 
                    codeParts={soal2CodeParts} 
                    placeholders={soal2Placeholders} 
                    expectedAnswers={soal2Expected} 
                  />

                  <CodeCompletionQuestion 
                    question="3. Lengkapi kode untuk mengakses nilai dari key 'Fisika' menggunakan tanda kurung siku []." 
                    codeParts={soal3CodeParts} 
                    placeholders={soal3Placeholders} 
                    expectedAnswers={soal3Expected} 
                  />

                  <CodeCompletionQuestion 
                    question="4. Lengkapi kode untuk mengakses nilai dari key 'alamat' menggunakan metode get() (key tidak ada, akan mencetak 'Tidak ditemukan')." 
                    codeParts={soal4CodeParts} 
                    placeholders={soal4Placeholders} 
                    expectedAnswers={soal4Expected} 
                  />

                  <CodeCompletionQuestion 
                    question="5. Lengkapi kode untuk menambahkan key 'usia' dan mengakses key 'nama' pada dictionary siswa." 
                    codeParts={soal5CodeParts} 
                    placeholders={soal5Placeholders} 
                    expectedAnswers={soal5Expected} 
                  />
                </div>
              </section>
            </>
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
  alertBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "15px",
    color: "#856404",
  },
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
  codeEditorTitle: { fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" },
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
    fontFamily: "monospace",
    fontSize: "14px",
    overflow: "auto"
  },
  codePre: { margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word", fontFamily: "monospace" },
  codeInputEditable: {
    width: "100%",
    minHeight: "250px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    tabSize: 4,
  },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    borderTop: "2px solid #1e1e1e"
  },
  outputTitle: { fontWeight: "600", fontSize: "15px" },
  codeOutput: { backgroundColor: "#1e1e1e", padding: "15px", minHeight: "80px" },
  outputContent: {
    color: "#4af",
    fontFamily: "monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5"
  },
  explanationsContainer: {
    borderTop: "1px solid #444",
    backgroundColor: "#2d2d2d",
    marginTop: "0",
  },
  explanationsHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
  },
  explanationsTitle: {
    fontWeight: "600",
    fontSize: "15px",
  },
  explanationsContent: {
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#ddd",
  },
  explanationItem: {
    marginBottom: "8px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: "8px",
  },
  lineNumber: {
    color: "#FFD43B",
    fontWeight: "bold",
    minWidth: "60px",
  },
  lineCode: {
    backgroundColor: "#3c3c3c",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#f8f8f2",
    fontFamily: "monospace",
  },
  lineExplanation: {
    color: "#ccc",
    flex: "1",
  },
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ddd"
  },
  questionText: { fontWeight: "500", marginBottom: "10px" },
  codeTemplateInline: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "10px",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    marginBottom: "10px"
  },
  inlineInput: {
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "4px 8px",
    margin: "0 2px",
    fontFamily: "monospace",
    fontSize: "14px",
    textAlign: "center",
    outline: "none",
    boxSizing: "content-box",
  },
  checkButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "10px"
  },
  resetButtonPerSoal: {
    backgroundColor: "#ffc107",
    color: "#212529",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  feedback: { marginTop: "8px", fontSize: "14px", fontStyle: "italic", color: "#333" },
  eksplorasiOption: {
    padding: "12px",
    borderRadius: "8px",
    transition: "all 0.2s",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
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
};