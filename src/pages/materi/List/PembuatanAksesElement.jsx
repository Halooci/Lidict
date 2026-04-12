import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ================= STYLE GLOBAL =================
const styles = {
  page: {
    padding: "30px 40px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "18px 24px",
    borderRadius: "6px",
    marginBottom: "30px",
    position: "relative",
  },
  headerAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "8px",
    backgroundColor: "#FFD43B",
  },
  headerTitle: {
    margin: 0,
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
  },
  headerSubtitle: {
    margin: "10px 0 0 0",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "400",
    opacity: 0.9,
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
  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    overflow: "auto",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: 0,
  },
  highlightBox: {
    backgroundColor: "#e3f2fd",
    borderLeft: "4px solid #2196f3",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "0 8px 8px 0",
  },
  infoBox: {
    backgroundColor: "#e8f5e9",
    borderLeft: "4px solid #4caf50",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "0 8px 8px 0",
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
  codeEditorTitle: { fontWeight: "600", fontSize: "15px" },
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
  },
  codeInputReadOnly: {
    width: "100%",
    minHeight: "120px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    lineHeight: "1.6",
    overflow: "auto",
  },
  codePre: { margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word" },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    borderTop: "2px solid #1e1e1e",
  },
  outputTitle: { fontWeight: "600", fontSize: "15px" },
  codeOutput: { backgroundColor: "#1e1e1e", padding: "15px", minHeight: "80px" },
  outputContent: {
    color: "#4af",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5",
  },
  eksplorasiOption: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  checkEksplorasiButton: {
    marginTop: "12px",
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
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
  quizBox: {
    border: "2px solid #2fa69a",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  quizHeader: { backgroundColor: "#cfd8e6", padding: "15px", fontWeight: "600" },
  quizContent: { padding: "20px" },
  quizQuestion: { marginBottom: "20px", whiteSpace: "pre-line" },
  quizOption: {
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #2fa69a",
    cursor: "pointer",
  },
  quizError: {
    marginTop: "15px",
    backgroundColor: "#f8d7da",
    color: "#842029",
    padding: "12px",
    borderRadius: "8px",
  },
  quizSuccess: {
    marginTop: "15px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    padding: "12px",
    borderRadius: "8px",
  },
  quizFooter: { display: "flex", justifyContent: "space-between", padding: "15px" },
  quizNavButton: {
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  errorBox: {
    backgroundColor: "#ff4444",
    color: "white",
    padding: "12px 15px",
    fontSize: "14px",
    fontWeight: "500",
    borderBottom: "2px solid #cc0000",
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
    boxSizing: "border-box",
  },
};

// ================= KOMPONEN CODE EDITOR READ-ONLY =================
const CodeEditor = ({ code, title, pyodideReady, runPythonCode }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setIsRunning(true);
    const result = await runPythonCode(code);
    setOutput(result);
    setIsRunning(false);
  }, [pyodideReady, code, runPythonCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title || "Contoh Kode"}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady || isRunning}>
          {isRunning ? "⏳ Menjalankan..." : pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
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

// ================= KOMPONEN CODE EDITOR DENGAN VALIDASI UNTUK LATIHAN =================
const CodeEditorEditable = ({ title, validationRules, pyodideReady, runPythonCode }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setError("");
  }, []);

  const validateCode = useCallback((code) => {
    const trimmedCode = code.trim();
    // Cek 1: Harus ada variabel "belanja"
    if (!trimmedCode.includes("belanja =")) {
      return { valid: false, message: "❌ ERROR: Kamu harus membuat variabel bernama 'belanja'." };
    }
    // Cek 2: Isi list harus ["apel", "jeruk", "mangga"]
    const regexList = /belanja\s*=\s*\[\s*["']apel["']\s*,\s*["']jeruk["']\s*,\s*["']mangga["']\s*\]/;
    if (!regexList.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Isi list 'belanja' harus ['apel', 'jeruk', 'mangga']." };
    }
    // Cek 3: Harus ada print(belanja[0])
    if (!/print\s*\(\s*belanja\s*\[\s*0\s*\]\s*\)/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Kamu harus menampilkan elemen pertama (indeks 0) dengan print(belanja[0])." };
    }
    // Cek 4: Harus ada print(belanja[-1])
    if (!/print\s*\(\s*belanja\s*\[\s*-\s*1\s*\]\s*\)/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Kamu harus menampilkan elemen terakhir dengan print(belanja[-1])." };
    }
    // Cek 5: Urutan: variabel dulu baru print
    const varIndex = trimmedCode.indexOf("belanja =");
    const printFirst = trimmedCode.indexOf("print(belanja[0])");
    const printLast = trimmedCode.indexOf("print(belanja[-1])");
    if (printFirst < varIndex || printLast < varIndex) {
      return { valid: false, message: "❌ ERROR: Variabel 'belanja' harus didefinisikan SEBELUM digunakan." };
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
    setIsRunning(true);

    const validation = validateCode(localCode);
    if (!validation.valid) {
      setError(validation.message);
      setIsRunning(false);
      return;
    }

    const result = await runPythonCode(localCode);
    setOutput(result);

    // Cek output: harus berisi "apel" dan "mangga"
    const expectedFirst = "apel";
    const expectedLast = "mangga";
    if (result.includes(expectedFirst) && result.includes(expectedLast)) {
      setOutput(result + "\n\n✅ SELAMAT! Jawaban kamu BENAR!");
    } else {
      setOutput(result + "\n\n⚠️ Output tidak sesuai. Pastikan kamu mencetak elemen pertama dan terakhir dengan benar.");
    }
    setIsRunning(false);
  }, [pyodideReady, localCode, runPythonCode, validateCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady || isRunning}>
          {isRunning ? "⏳ Menjalankan..." : pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      {error && <div style={styles.errorBox}>{error}</div>}
      <textarea
        style={styles.codeInputEditable}
        value={localCode}
        onChange={handleChange}
        placeholder="Tulis kode Python di sini..."
        spellCheck={false}
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

// ================= KOMPONEN UTAMA =================
export default function PembuatanAksesElement() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  // State untuk eksplorasi
  const [eksplorasiTempAnswers, setEksplorasiTempAnswers] = useState([null, null]);
  const [eksplorasiSavedAnswers, setEksplorasiSavedAnswers] = useState([null, null]);
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", ""]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const eksplorasiQuestions = [
    {
      text: "Apa yang digunakan untuk mengakses elemen pertama dalam list?",
      options: ["Indeks 0", "Indeks 1", "Indeks -1", "Indeks length-1"],
      correct: 0,
    },
    {
      text: "Manakah cara yang benar untuk membuat list berisi angka 5, 10, 15?",
      options: ["angka = (5, 10, 15)", "angka = {5, 10, 15}", "angka = [5, 10, 15]", "angka = <5, 10, 15>"],
      correct: 2,
    },
  ];

  const checkEksplorasiAnswer = (questionIdx) => {
    const selected = eksplorasiTempAnswers[questionIdx];
    if (selected === null) {
      setEksplorasiFeedback((prev) => {
        const newFeedback = [...prev];
        newFeedback[questionIdx] = "❌ Pilih jawaban terlebih dahulu!";
        return newFeedback;
      });
      return;
    }
    const isCorrect = selected === eksplorasiQuestions[questionIdx].correct;
    if (isCorrect) {
      const newSaved = [...eksplorasiSavedAnswers];
      newSaved[questionIdx] = selected;
      setEksplorasiSavedAnswers(newSaved);
      setEksplorasiFeedback((prev) => {
        const newFeedback = [...prev];
        newFeedback[questionIdx] = "✅ Benar! Jawaban tersimpan.";
        return newFeedback;
      });
    } else {
      setEksplorasiFeedback((prev) => {
        const newFeedback = [...prev];
        newFeedback[questionIdx] = "❌ Salah. Coba lagi!";
        return newFeedback;
      });
    }
  };

  useEffect(() => {
    const allCorrect = eksplorasiSavedAnswers.every(
      (ans, idx) => ans !== null && ans === eksplorasiQuestions[idx].correct
    );
    setIsEksplorasiCompleted(allCorrect);
  }, [eksplorasiSavedAnswers]);

  const handleTempAnswer = (questionIdx, optionIdx) => {
    const newTemp = [...eksplorasiTempAnswers];
    newTemp[questionIdx] = optionIdx;
    setEksplorasiTempAnswers(newTemp);
    setEksplorasiFeedback((prev) => {
      const newFeedback = [...prev];
      newFeedback[questionIdx] = "";
      return newFeedback;
    });
  };

  // Contoh kode untuk materi
  const exampleCodes = {
    pembuatan: `# Membuat list
buah = ["apel", "jeruk", "mangga"]
print(buah)`,
    akses: `# Akses elemen dengan indeks positif
buah = ["apel", "jeruk", "mangga"]
print("Elemen pertama:", buah[0])
print("Elemen kedua:", buah[1])`,
    negatif: `# Akses dengan indeks negatif
buah = ["apel", "jeruk", "mangga"]
print("Elemen terakhir:", buah[-1])
print("Elemen kedua dari belakang:", buah[-2])`,
    slicing: `# Slicing list
angka = [10, 20, 30, 40, 50]
print("Indeks 1 sampai 3:", angka[1:4])  # [20, 30, 40]`,
  };

  // Load Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      if (!window.loadPyodide) {
        const script = document.createElement("script");
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
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);
      await pyodide.runPythonAsync(code);
      const output = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      await pyodide.runPythonAsync("sys.stdout = sys.__stdout__");
      return output || "(Tidak ada output)";
    } catch (error) {
      return `❌ Error: ${error.message}`;
    }
  }, []);

  // Quiz 5 soal
  const quizQuestions = [
    {
      question: "Bagaimana cara mengakses elemen ketiga dari list `data = [5, 10, 15, 20]`?",
      options: ["data[2]", "data[3]", "data[-2]", "data[1]"],
      answer: 0,
    },
    {
      question: "Apa output dari `print([1,2,3,4][1:3])`?",
      options: ["[2,3]", "[2,3,4]", "[1,2]", "[1,2,3]"],
      answer: 0,
    },
    {
      question: "Indeks negatif -1 pada list merujuk ke elemen...",
      options: ["Pertama", "Kedua", "Terakhir", "Tengah"],
      answer: 2,
    },
    {
      question: "Manakah pernyataan yang benar tentang slicing `list[awal:akhir]`?",
      options: ["Elemen pada indeks 'akhir' ikut diambil", "Elemen pada indeks 'akhir' TIDAK diambil", "Hanya elemen pertama yang diambil", "Mengambil semua elemen"],
      answer: 1,
    },
    {
      question: "Apa kode yang tepat untuk membuat list kosong?",
      options: ["list = ()", "list = []", "list = {}", "list = ' '"],
      answer: 1,
    },
  ];

  const [quizCurrent, setQuizCurrent] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverCheck, setHoverCheck] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  const checkQuizAnswer = () => {
    if (quizSelected === null) return;
    setQuizFeedback(quizSelected === quizQuestions[quizCurrent].answer ? "benar" : "salah");
  };

  const nextQuiz = () => {
    if (quizCurrent < quizQuestions.length - 1) {
      setQuizCurrent(quizCurrent + 1);
      setQuizSelected(null);
      setQuizFeedback(null);
    }
  };

  const prevQuiz = () => {
    if (quizCurrent > 0) {
      setQuizCurrent(quizCurrent - 1);
      setQuizSelected(null);
      setQuizFeedback(null);
    }
  };

  return (
    <>
      <Navbar />
      <SidebarMateri />
      <div className="main-content" style={{ paddingTop: "64px" }}>
        <div style={styles.page}>
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PEMBUATAN DAN AKSES ELEMEN LIST</h1>
            <p style={styles.headerSubtitle}>Belajar Membuat dan Mengakses Data dalam List</p>
          </div>

          {/* TUJUAN PEMBELAJARAN */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🎯 Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>Mahasiswa mampu membuat list dalam Python dengan berbagai tipe data.</li>
                <li>Mahasiswa mampu mengakses elemen list menggunakan indeks positif dan negatif.</li>
                <li>Mahasiswa mampu melakukan slicing untuk mengambil sebagian elemen list.</li>
              </ol>
              <p style={{ ...styles.text, fontSize: "14px", marginTop: "10px", fontStyle: "italic" }}>
                🎯 <strong>Kaitan dengan CPMK:</strong> Materi ini mendukung CPMK 1 dan 4 (kemampuan menuliskan kode Python untuk menyelesaikan masalah data sederhana).
              </p>
            </div>
          </section>

          {/* EKSPLORASI AWAL */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🔍 Eksplorasi Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum belajar lebih dalam, jawab pertanyaan berikut. Pilih jawaban, lalu klik "Periksa Jawaban". 
                <strong style={{ color: "#d9534f" }}> Materi akan terbuka setelah kedua jawaban benar.</strong>
              </p>
              {eksplorasiQuestions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
                  <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        onClick={() => handleTempAnswer(idx, optIdx)}
                        style={{
                          ...styles.eksplorasiOption,
                          backgroundColor: eksplorasiTempAnswers[idx] === optIdx ? "#2fa69a" : "#f9f9f9",
                          color: eksplorasiTempAnswers[idx] === optIdx ? "white" : "#1f2937",
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                  <button style={styles.checkEksplorasiButton} onClick={() => checkEksplorasiAnswer(idx)}>
                    Periksa Jawaban
                  </button>
                  {eksplorasiFeedback[idx] && (
                    <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", backgroundColor: eksplorasiFeedback[idx].includes("Benar") ? "#d1e7dd" : "#f8d7da" }}>
                      {eksplorasiFeedback[idx]}
                    </div>
                  )}
                </div>
              ))}
              {!isEksplorasiCompleted && (
                <div style={styles.lockMessage}>🔒 Materi terkunci. Jawab kedua pertanyaan dengan benar.</div>
              )}
            </div>
          </section>

          {/* MATERI UTAMA */}
          {isEksplorasiCompleted && (
            <>
              {/* MEMBUAT LIST */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>📝 Membuat List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    List dibuat dengan tanda kurung siku <code>[]</code> dan elemen dipisahkan koma. List dapat berisi berbagai tipe data (string, integer, float, boolean, bahkan list lain).
                  </p>
                  <CodeEditor code={exampleCodes.pembuatan} title="Contoh: Membuat List" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
                  <div style={styles.infoBox}>
                    <strong>📌 Catatan:</strong> List bersifat <strong>mutable</strong> (dapat diubah) dan <strong>ordered</strong> (mempertahankan urutan).
                  </div>
                </div>
              </section>

              {/* AKSES ELEMEN DENGAN INDEKS POSITIF */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🔍 Akses Elemen (Indeks Positif)</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Setiap elemen dalam list memiliki indeks numerik. Indeks <strong>dimulai dari 0</strong> untuk elemen pertama, 1 untuk kedua, dan seterusnya.
                  </p>
                  <CodeEditor code={exampleCodes.akses} title="Contoh: Akses dengan Indeks Positif" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
                </div>
              </section>

              {/* AKSES ELEMEN DENGAN INDEKS NEGATIF */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🔍 Akses Elemen (Indeks Negatif)</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Python juga mendukung indeks negatif untuk mengakses elemen dari belakang. <strong>-1</strong> untuk elemen terakhir, <strong>-2</strong> untuk kedua terakhir, dst.
                  </p>
                  <CodeEditor code={exampleCodes.negatif} title="Contoh: Akses dengan Indeks Negatif" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
                </div>
              </section>

              {/* SLICING LIST */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>✂️ Slicing List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Slicing digunakan untuk mengambil sub-list (bagian dari list) dengan format <code>list[awal:akhir]</code>. Elemen pada indeks <strong>akhir tidak diikutsertakan</strong>.
                  </p>
                  <CodeEditor code={exampleCodes.slicing} title="Contoh: Slicing" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
                  <div style={styles.highlightBox}>
                    <strong>💡 Tips:</strong> <code>list[:3]</code> mengambil 3 elemen pertama, <code>list[2:]</code> mengambil dari indeks 2 sampai akhir.
                  </div>
                </div>
              </section>

              {/* LATIHAN PRAKTIK (STUDI KASUS) */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>💻 Latihan Praktik</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    <strong>Studi Kasus: Daftar Belanja</strong><br />
                    Buatlah program Python yang:
                  </p>
                  <ol style={styles.list}>
                    <li>Membuat list bernama <code>belanja</code> dengan isi <code>["apel", "jeruk", "mangga"]</code>.</li>
                    <li>Menampilkan elemen <strong>pertama</strong> (apel) menggunakan indeks positif.</li>
                    <li>Menampilkan elemen <strong>terakhir</strong> (mangga) menggunakan indeks negatif.</li>
                  </ol>
                  <p style={styles.text}>Tulis kode Python di editor di bawah, lalu klik "Jalankan".</p>
                  <CodeEditorEditable
                    title="Latihan: Daftar Belanja"
                    validationRules={{}}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>

              {/* QUIZ PEMAHAMAN */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>📝 Latihan Pemahaman</h2>
                <div style={styles.quizBox}>
                  <div style={styles.quizHeader}>Soal {quizCurrent + 1} dari {quizQuestions.length}</div>
                  <div style={styles.quizContent}>
                    <p style={styles.quizQuestion}>{quizQuestions[quizCurrent].question}</p>
                    {quizQuestions[quizCurrent].options.map((opt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setQuizSelected(idx)}
                        style={{
                          ...styles.quizOption,
                          backgroundColor: quizSelected === idx ? "#2fa69a" : "#ffffff",
                          color: quizSelected === idx ? "white" : "#1f2937",
                        }}
                      >
                        {String.fromCharCode(65 + idx)}. {opt}
                      </div>
                    ))}
                    {quizFeedback === "salah" && <div style={styles.quizError}>❌ Salah! Coba periksa kembali.</div>}
                    {quizFeedback === "benar" && <div style={styles.quizSuccess}>✅ Benar! Jawaban tepat.</div>}
                  </div>
                  <div style={styles.quizFooter}>
                    <button
                      style={{
                        ...styles.quizNavButton,
                        backgroundColor: hoverPrev ? "#FFD43B" : "#9ca3af",
                        color: hoverPrev ? "#306998" : "white",
                      }}
                      onClick={prevQuiz}
                      disabled={quizCurrent === 0}
                      onMouseEnter={() => setHoverPrev(true)}
                      onMouseLeave={() => setHoverPrev(false)}
                    >
                      Sebelumnya
                    </button>
                    <button
                      style={{
                        ...styles.quizNavButton,
                        backgroundColor: "#1e63d5",
                        color: "white",
                        ...(hoverCheck && { backgroundColor: "#FFD43B", color: "#306998" }),
                      }}
                      onClick={checkQuizAnswer}
                      onMouseEnter={() => setHoverCheck(true)}
                      onMouseLeave={() => setHoverCheck(false)}
                    >
                      Periksa Jawaban
                    </button>
                    <button
                      style={{
                        ...styles.quizNavButton,
                        backgroundColor: hoverNext ? "#FFD43B" : "#9ca3af",
                        color: hoverNext ? "#306998" : "white",
                      }}
                      onClick={nextQuiz}
                      disabled={quizCurrent === quizQuestions.length - 1}
                      onMouseEnter={() => setHoverNext(true)}
                      onMouseLeave={() => setHoverNext(false)}
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}