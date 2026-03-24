import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// KOMPONEN TERPISAH untuk editor read-only
const CodeEditor = ({ code, title, pyodideReady, runPythonCode }) => {
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
        <span style={styles.codeEditorTitle}>{title}</span>
        <button 
          style={styles.runButton}
          onClick={handleRun}
          disabled={!pyodideReady}
        >
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>
          {code}
        </pre>
      </div>
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>
          {output || "(Klik 'Jalankan' untuk melihat hasil)"}
        </pre>
      </div>
    </div>
  );
};

export default function PendahuluanList() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  // Kode contoh sederhana
  const exampleCodes = {
    variabel: `# Refresh: Variabel di Python
nama = "Andi"
umur = 20

print("Nama:", nama)
print("Umur:", umur)`,

    listPengenalan: `# Pengenalan List
# List = wadah untuk menyimpan banyak data

buah = ["apel", "jeruk", "mangga"]
angka = [10, 20, 30]

print(buah)
print(angka)
print("Jumlah buah:", len(buah))`,
  };

  // Load Pyodide saat komponen mount
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

  // Fungsi untuk menjalankan kode Python
  const runPythonCode = useCallback(async (code) => {
    if (!pyodideRef.current) {
      return "⏳ Pyodide sedang dimuat, harap tunggu...";
    }

    try {
      const pyodide = pyodideRef.current;
      
      const escapedCode = code
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
      
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

  /* ================= QUIZ 5 SOAL ================= */
  const quizQuestions = [
    {
      question: "Apa fungsi utama List dalam Python?",
      options: [
        "Melakukan operasi matematika kompleks",
        "Menyimpan kumpulan data dalam satu variabel",
        "Menggantikan fungsi percabangan",
        "Menampilkan output ke layar"
      ],
      answer: 1
    },
    {
      question: "Bagaimana cara membuat list kosong dalam Python?",
      options: [
        "list = ()",
        "list = {}",
        "list = []",
        "list = \"\""
      ],
      answer: 2
    },
    {
      question: "List dalam Python dapat menyimpan berbagai tipe data sekaligus.",
      options: ["Benar", "Salah"],
      answer: 0
    },
    {
      question: "Apa output dari kode berikut?\n\nbuah = [\"apel\", \"jeruk\"]\nprint(len(buah))",
      options: ["0", "1", "2", "3"],
      answer: 2
    },
    {
      question: "Mengapa kita membutuhkan List dibanding variabel tunggal?",
      options: [
        "Agar program berjalan lebih cepat",
        "Untuk menyimpan banyak data secara terorganisir dalam satu variabel",
        "Supaya tidak perlu menggunakan perulangan",
        "Agar tipe data lebih ketat"
      ],
      answer: 1
    }
  ];

  const [quizCurrent, setQuizCurrent] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);

  const checkQuizAnswer = () => {
    if (quizSelected === null) return;

    if (quizSelected === quizQuestions[quizCurrent].answer) {
      setQuizFeedback("benar");
    } else {
      setQuizFeedback("salah");
    }
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

      <div style={{ marginLeft: "280px" }}>
        <SidebarMateri />
        <div style={{ paddingTop: "64px" }}>
          <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>PENDAHULUAN LIST</h1>
              <p style={styles.headerSubtitle}>Pengenalan Struktur Data Dasar dalam Python</p>
            </div>

            {/* TUJUAN PEMBELAJARAN - HANYA 2 */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🎯 Tujuan Pembelajaran</h2>
              <div style={styles.card}>
                <ol style={styles.list}>
                  <li>Memahami konsep list sebagai struktur data dasar untuk menyimpan kumpulan data dalam Python.</li>
                  <li>Mengetahui keunggulan penggunaan list dibanding variabel tunggal dalam penyimpanan data.</li>
                </ol>
              </div>
            </section>

            {/* EKSPLORASI */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>📚 Memahami Kebutuhan List</h2>

              <div style={styles.card}>
                <p style={styles.text}>
                  Dalam pemrograman, seringkali kita perlu menyimpan banyak data sekaligus. 
                  Misalnya, daftar nama siswa, nilai ujian, atau item belanja.
                </p>

                <p style={styles.text}>
                  Jika menggunakan variabel tunggal, kita perlu membuat banyak variabel:
                </p>

                <div style={styles.highlightBox}>
                  <pre style={styles.code}>
{`# Tidak efisien dengan variabel terpisah
siswa1 = "Andi"
siswa2 = "Budi"
siswa3 = "Citra"
# ... dan seterusnya`}</pre>
                </div>

                <p style={styles.text}>
                  <strong>List</strong> hadir sebagai solusi: <strong>satu variabel untuk banyak data</strong>.
                </p>

                <div style={styles.infoBox}>
                  <strong>Keunggulan List:</strong>
                  <ul style={styles.list}>
                    <li>Menyimpan banyak data dalam satu variabel</li>
                    <li>Data tetap terurut dan mudah diakses</li>
                    <li>Lebih mudah dikelola dengan perulangan</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* MATERI SINGKAT */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🔄 Refresh Singkat: Variabel</h2>
              
              <div style={styles.card}>
                <p style={styles.text}>
                  Sebelum masuk ke list, ingat kembali bahwa variabel digunakan untuk menyimpan data:
                </p>

                <CodeEditor 
                  code={exampleCodes.variabel} 
                  title="Contoh: Variabel"
                  pyodideReady={pyodideReady}
                  runPythonCode={runPythonCode}
                />
              </div>
            </section>

            {/* PENGENALAN LIST */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🆕 Pengenalan List</h2>
              
              <div style={styles.card}>
                <p style={styles.text}>
                  <strong>List</strong> adalah struktur data dalam Python yang digunakan untuk 
                  menyimpan <strong>kumpulan item</strong> dalam satu variabel. List dibuat 
                  menggunakan tanda kurung siku <code>[ ]</code>.
                </p>

                <CodeEditor 
                  code={exampleCodes.listPengenalan} 
                  title="Contoh: Membuat List"
                  pyodideReady={pyodideReady}
                  runPythonCode={runPythonCode}
                />

                <div style={styles.infoBox}>
                  <strong>Yang akan dipelajari di bab selanjutnya:</strong>
                  <ul style={styles.list}>
                    <li>Cara membuat list dengan berbagai metode</li>
                    <li>Mengakses elemen list menggunakan indeks</li>
                    <li>Memodifikasi elemen list</li>
                    <li>Operasi slicing dan method-method list</li>
                    <li>List bersarang (nested list)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SOAL PILIHAN GANDA */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>📝 Latihan Pemahaman</h2>

              <div style={styles.quizBox}>
                <div style={styles.quizHeader}>
                  Soal {quizCurrent + 1} dari {quizQuestions.length}
                </div>

                <div style={styles.quizContent}>
                  <p style={styles.quizQuestion}>
                    {quizQuestions[quizCurrent].question}
                  </p>

                  {quizQuestions[quizCurrent].options.map((opt, index) => (
                    <div
                      key={index}
                      onClick={() => setQuizSelected(index)}
                      style={{
                        ...styles.quizOption,
                        backgroundColor:
                          quizSelected === index ? "#2fa69a" : "#ffffff",
                        color:
                          quizSelected === index ? "white" : "#1f2937"
                      }}
                    >
                      {String.fromCharCode(65 + index)}. {opt}
                    </div>
                  ))}

                  {quizFeedback === "salah" && (
                    <div style={styles.quizError}>
                      ❌ Salah! Coba periksa kembali jawaban Anda.
                    </div>
                  )}

                  {quizFeedback === "benar" && (
                    <div style={styles.quizSuccess}>
                      ✅ Benar! Jawaban Anda tepat.
                    </div>
                  )}
                </div>

                <div style={styles.quizFooter}>
                  <button
                    style={styles.secondaryButton}
                    onClick={prevQuiz}
                    disabled={quizCurrent === 0}
                  >
                    Sebelumnya
                  </button>

                  <button
                    style={styles.primaryButton}
                    onClick={checkQuizAnswer}
                  >
                    Periksa Jawaban
                  </button>

                  <button
                    style={styles.secondaryButton}
                    onClick={nextQuiz}
                    disabled={quizCurrent === quizQuestions.length - 1}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    padding: "30px 40px",
    paddingTop: "40px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif"
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "18px 24px",
    borderRadius: "6px",
    marginBottom: "30px",
    position: "relative"
  },
  headerAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "8px",
    backgroundColor: "#FFD43B"
  },
  headerTitle: {
    margin: 0,
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700"
  },
  headerSubtitle: {
    margin: "10px 0 0 0",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "400",
    opacity: 0.9
  },
  section: { marginBottom: "40px" },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "15px",
    borderLeft: "5px solid #306998",
    paddingLeft: "12px"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
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
    margin: 0
  },
  highlightBox: {
    backgroundColor: "#e3f2fd",
    borderLeft: "4px solid #2196f3",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "0 8px 8px 0"
  },
  infoBox: {
    backgroundColor: "#e8f5e9",
    borderLeft: "4px solid #4caf50",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "0 8px 8px 0"
  },
  // Styles untuk Code Editor Pyodide
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
    fontSize: "15px"
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
    transition: "all 0.2s"
  },
  // Style untuk area kode yang read-only
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
    overflow: "auto"
  },
  codePre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace"
  },
  // Header Output
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
  quizBox: {
    border: "2px solid #2fa69a",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff"
  },
  quizHeader: {
    backgroundColor: "#cfd8e6",
    padding: "15px",
    fontWeight: "600"
  },
  quizContent: { padding: "20px" },
  quizQuestion: { marginBottom: "20px", whiteSpace: "pre-line" },
  quizOption: {
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #2fa69a",
    cursor: "pointer"
  },
  quizError: {
    marginTop: "15px",
    backgroundColor: "#f8d7da",
    color: "#842029",
    padding: "12px",
    borderRadius: "8px"
  },
  quizSuccess: {
    marginTop: "15px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    padding: "12px",
    borderRadius: "8px"
  },
  quizFooter: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px"
  },
  primaryButton: {
    backgroundColor: "#1e63d5",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  secondaryButton: {
    backgroundColor: "#9ca3af",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};