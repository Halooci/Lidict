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

// ===================== KOMPONEN LATIHAN PRAKTIK (CODING) =====================
const CodeEditorEditable = ({ codeKey, title, validationRules, pyodideReady, runPythonCode, expectedOutput }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setError("");
  }, []);

  const validateCode = useCallback((code) => {
    const trimmedCode = code.trim();
    if (!/\bmatriks\s*=\s*\[\[.*?\]\s*,\s*\[.*?\]\]/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Buatlah nested list dengan nama 'matriks' berisi dua baris." };
    }
    if (!/print\s*\(\s*matriks\s*\[\s*0\s*\]\s*\[\s*0\s*\]\s*\)/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Tampilkan elemen pertama baris pertama dengan print(matriks[0][0])." };
    }
    if (!/print\s*\(\s*matriks\s*\[\s*1\s*\]\s*\[\s*2\s*\]\s*\)/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Tampilkan elemen ketiga baris kedua dengan print(matriks[1][2])." };
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
    
    const lines = result.trim().split('\n').filter(l => l.trim() !== "");
    if (expectedOutput && lines[0] === expectedOutput[0] && lines[1] === expectedOutput[1]) {
      setOutput(result + "\n\n✅ SELAMAT! Kode kamu benar!");
    } else if (expectedOutput) {
      setOutput(result + "\n\n⚠️ Output tidak sesuai. Cek kembali nilai yang dicetak.");
    }
  }, [pyodideReady, localCode, runPythonCode, validateCode, expectedOutput]);

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
        style={{ ...styles.codeInputEditable, border: error ? "2px solid #ff4444" : "none" }}
        value={localCode}
        onChange={handleChange}
        placeholder="Ketik kode Python kamu di sini..."
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

// ===================== KOMPONEN SOAL MELENGKAPI KODE (DENGAN INPUT INLINE) =====================
const CodeCompletionQuestion = ({ question, codeParts, placeholders, expectedAnswers, onCheck, resetTrigger }) => {
  const [answers, setAnswers] = useState(placeholders.map(() => ""));
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAnswers(placeholders.map(() => ""));
    setFeedback("");
    setChecked(false);
  }, [resetTrigger, placeholders]);

  const handleAnswerChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  const handleCheck = () => {
    let allCorrect = true;
    for (let i = 0; i < expectedAnswers.length; i++) {
      if (answers[i].trim() !== expectedAnswers[i]) {
        allCorrect = false;
        break;
      }
    }
    setChecked(true);
    if (allCorrect) {
      setFeedback("✅ Benar!");
      if (onCheck) onCheck(true);
    } else {
      const expectedStr = expectedAnswers.join(", ");
      setFeedback(`❌ Salah. Jawaban yang benar: ${expectedStr}`);
      if (onCheck) onCheck(false);
    }
  };

  const renderCodeWithInputs = () => {
    const result = [];
    for (let i = 0; i < codeParts.length; i++) {
      result.push(<span key={`text-${i}`}>{codeParts[i]}</span>);
      if (i < placeholders.length) {
        result.push(
          <input
            key={`input-${i}`}
            type="text"
            size={placeholders[i]?.length || 10}
            style={styles.inlineInput}
            value={answers[i]}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            disabled={checked}
            placeholder={placeholders[i] || "..."}
          />
        );
      }
    }
    return result;
  };

  return (
    <div style={styles.questionCard}>
      <p style={styles.questionText}>{question}</p>
      <pre style={styles.codeTemplateInline}>
        {renderCodeWithInputs()}
      </pre>
      <button style={styles.checkButton} onClick={handleCheck} disabled={checked}>
        Periksa
      </button>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

// ===================== KOMPONEN SOAL MENENTUKAN OUTPUT =====================
const GuessOutputQuestion = ({ question, codeSnippet, expectedOutput, onCheck, resetTrigger }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setUserAnswer("");
    setFeedback("");
    setChecked(false);
  }, [resetTrigger]);

  const handleCheck = () => {
    const isCorrect = userAnswer.trim() === expectedOutput;
    setChecked(true);
    setFeedback(isCorrect ? "✅ Benar!" : `❌ Salah. Output yang benar: ${expectedOutput}`);
    if (onCheck) onCheck(isCorrect);
  };

  return (
    <div style={styles.questionCard}>
      <p style={styles.questionText}>{question}</p>
      <pre style={styles.codeTemplate}>{codeSnippet}</pre>
      <input
        type="text"
        style={styles.fillInput}
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Ketik output yang dihasilkan..."
        disabled={checked}
      />
      <button style={styles.checkButton} onClick={handleCheck} disabled={checked}>
        Periksa
      </button>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function PembuatanAksesNestedList() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [resetInteractives, setResetInteractives] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State untuk sidebar

  // Contoh kode read-only (diperbanyak)
  const exampleCodes = {
    pembuatan: `# Membuat nested list 2 baris 3 kolom
matriks = [[1, 2, 3],
           [4, 5, 6]]
print("Matriks:")
print(matriks)`,
    akses: `# Mengakses elemen nested list
matriks = [[1, 2, 3],
           [4, 5, 6]]
print("Elemen baris 1 kolom 1:", matriks[0][0])
print("Elemen baris 2 kolom 3:", matriks[1][2])`,
    panjangBerbeda: `# Nested list dengan panjang baris berbeda
data = [[1, 2],
        [3, 4, 5],
        [6]]
print(data)`,
    ubahElemen: `# Mengubah nilai elemen nested list
matriks = [[1, 2, 3],
           [4, 5, 6]]
matriks[0][1] = 99  # mengubah baris 1 kolom 2 menjadi 99
matriks[1][2] = 88  # mengubah baris 2 kolom 3 menjadi 88
print(matriks)`,
    tambahBaris: `# Menambahkan baris baru ke nested list
matriks = [[1, 2, 3],
           [4, 5, 6]]
baris_baru = [7, 8, 9]
matriks.append(baris_baru)
print(matriks)`,
    iterasi: `# Iterasi nested list dengan loop
matriks = [[1, 2, 3],
           [4, 5, 6]]
for i in range(len(matriks)):
    for j in range(len(matriks[i])):
        print(f"matriks[{i}][{j}] = {matriks[i][j]}")`,
    contohSiswa: `# Contoh: Data nilai 3 siswa untuk 4 mata pelajaran
nilai = [[85, 90, 78, 88],
         [92, 86, 79, 94],
         [88, 91, 84, 89]]
print("Nilai siswa 2 mata pelajaran 3:", nilai[1][2])  # output: 79`,
  };

  // Data untuk soal completion dengan inline input (tetap 3 soal)
  const soal1CodeParts = [
    "data = [[10, 20, 30], [40, 50, 60]]\nprint(data[",
    "][",
    "])"
  ];
  const soal1Placeholders = ["", ""];
  const soal1Expected = ["0", "1"];

  const soal2CodeParts = ["matriks = [[1, 2], ", "]\nprint(matriks)"];
  const soal2Placeholders = ["[3,4]"];
  const soal2Expected = ["[3,4]"];

  const soal3CodeParts = [
    "data = [[10, 20], [30, 40], [50, 60]]\nprint(data[",
    "][",
    "])"
  ];
  const soal3Placeholders = ["", ""];
  const soal3Expected = ["2", "1"];

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

  const resetInteractiveQuestions = () => {
    setResetInteractives(prev => prev + 1);
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
            <h1 style={styles.headerTitle}>PEMBUATAN DAN AKSES ELEMEN NESTED LIST</h1>
          </div>

          {/* TUJUAN PEMBELAJARAN */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>Mahasiswa mampu membuat nested list dengan berbagai variasi (baris dan kolom).</li>
                <li>Mahasiswa mampu mengakses elemen nested list menggunakan indeks baris dan kolom.</li>
                <li>Mahasiswa mampu mengubah nilai elemen dalam nested list.</li>
                <li>Mahasiswa mampu menambahkan baris baru ke dalam nested list.</li>
                <li>Mahasiswa mampu melakukan iterasi pada nested list.</li>
              </ol>
            </div>
          </section>

          {/* MATERI (diperbanyak) */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>1. Membuat Nested List</h3>
              <p style={styles.text}>
                Nested list dibuat dengan menuliskan list di dalam list, dipisahkan koma. Setiap list dalam dapat memiliki panjang yang berbeda (ragged array).
              </p>
              <CodeEditor
                code={exampleCodes.pembuatan}
                codeKey="pembuatan"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
              />
              <CodeEditor
                code={exampleCodes.panjangBerbeda}
                codeKey="panjangBerbeda"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
              />

              <h3 style={styles.subTitle}>2. Mengakses Elemen Nested List</h3>
              <p style={styles.text}>
                Gunakan dua indeks: <code>nama_list[indeks_baris][indeks_kolom]</code>. Indeks dimulai dari 0.
              </p>
              <CodeEditor
                code={exampleCodes.akses}
                codeKey="akses"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
              />

              <h3 style={styles.subTitle}>3. Mengubah Nilai Elemen</h3>
              <p style={styles.text}>
                Kita dapat mengubah nilai elemen tertentu dengan mengaksesnya lalu menetapkan nilai baru.
              </p>
              <CodeEditor
                code={exampleCodes.ubahElemen}
                codeKey="ubahElemen"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
              />

              <h3 style={styles.subTitle}>4. Menambahkan Baris Baru</h3>
              <p style={styles.text}>
                Gunakan method <code>append()</code> untuk menambahkan baris (list) baru ke dalam nested list.
              </p>
              <CodeEditor
                code={exampleCodes.tambahBaris}
                codeKey="tambahBaris"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
              />

              <h3 style={styles.subTitle}>5. Iterasi pada Nested List</h3>
              <p style={styles.text}>
                Kita dapat menggunakan perulangan bersarang (nested loop) untuk mengakses seluruh elemen.
              </p>
              <CodeEditor
                code={exampleCodes.iterasi}
                codeKey="iterasi"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
              />

              <h3 style={styles.subTitle}>6. Contoh Penggunaan: Data Nilai Siswa</h3>
              <p style={styles.text}>
                Nested list sangat cocok untuk menyimpan data tabel, seperti nilai siswa.
              </p>
              <CodeEditor
                code={exampleCodes.contohSiswa}
                codeKey="contohSiswa"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
              />
            </div>
          </section>

          {/* LATIHAN PRAKTIK (CODING) */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Ayo Praktik!</h2>
            <div style={styles.card}>
              <div style={styles.alertBox}>
                <strong>📝 Instruksi:</strong>
                <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                  <li>Buatlah nested list dengan nama <code>matriks</code> yang berisi dua baris: baris pertama [3, 6, 9], baris kedua [12, 15, 18].</li>
                  <li>Tampilkan elemen pertama dari baris pertama (3).</li>
                  <li>Tampilkan elemen ketiga dari baris kedua (18).</li>
                </ul>
              </div>
              <CodeEditorEditable
                codeKey="latihan"
                title="Ayo Praktik"
                validationRules={{}}
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
                expectedOutput={["3", "18"]}
              />
            </div>
          </section>

          {/* LATIHAN INTERAKTIF - 5 SOAL (3 completion inline + 2 output guess) */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Latihan</h2>
            <div style={styles.card}>
              <p style={styles.text}>Isilah bagian yang kosong pada kode di bawah ini dengan mengetikkan jawaban pada kotak yang tersedia.</p>
              <button style={styles.resetButton} onClick={resetInteractiveQuestions}>↻ Reset Jawaban</button>
              
              {/* Soal 1: Akses elemen 20 */}
              <CodeCompletionQuestion
                question="1. Lengkapi kode berikut untuk mengakses elemen 20 dari nested list di bawah ini:"
                codeParts={soal1CodeParts}
                placeholders={soal1Placeholders}
                expectedAnswers={soal1Expected}
                resetTrigger={resetInteractives}
              />

              {/* Soal 2: Membuat nested list baris kedua */}
              <CodeCompletionQuestion
                question="2. Lengkapi kode untuk membuat nested list yang berisi dua baris: baris pertama [1,2], baris kedua [3,4]:"
                codeParts={soal2CodeParts}
                placeholders={soal2Placeholders}
                expectedAnswers={soal2Expected}
                resetTrigger={resetInteractives}
              />

              {/* Soal 3: Akses elemen terakhir (60) */}
              <CodeCompletionQuestion
                question="3. Lengkapi kode untuk mencetak elemen terakhir (60) dari nested list berikut:"
                codeParts={soal3CodeParts}
                placeholders={soal3Placeholders}
                expectedAnswers={soal3Expected}
                resetTrigger={resetInteractives}
              />

              {/* Soal 4: Menentukan output */}
              <GuessOutputQuestion
                question="4. Output dari kode berikut adalah ..."
                codeSnippet={`nilai = [[5, 7], [9, 11]]
print(nilai[1][0])`}
                expectedOutput="9"
                resetTrigger={resetInteractives}
              />

              {/* Soal 5: Menentukan output */}
              <GuessOutputQuestion
                question="5. Jika kita menjalankan kode berikut, maka yang akan tercetak adalah ..."
                codeSnippet={`a = [[2, 4], [6, 8]]
b = a[0][1]
print(b)`}
                expectedOutput="4"
                resetTrigger={resetInteractives}
              />
            </div>
          </section>
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
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ddd"
  },
  questionText: { fontWeight: "500", marginBottom: "10px" },
  codeTemplate: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "10px",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflowX: "auto",
    marginBottom: "10px"
  },
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
    padding: "2px 6px",
    margin: "0 2px",
    fontFamily: "monospace",
    fontSize: "14px",
    textAlign: "center",
    outline: "none"
  },
  fillInput: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    boxSizing: "border-box"
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
  resetButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px"
  },
  feedback: { marginTop: "8px", fontSize: "14px", fontStyle: "italic", color: "#333" }
};