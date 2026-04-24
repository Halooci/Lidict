import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== PENJELASAN PER BARIS =====================
const PenjelasanPerBaris = ({ code }) => {
  const lines = code.split('\n').filter(l => l.trim().length > 0);
  const penjelasan = lines.map(line => {
    if (line.includes('=') && line.includes('[[')) return "Membuat nested list dan menyimpannya ke variabel.";
    if (line.includes('print') && line.includes('[0][0]')) return "Mencetak elemen baris pertama kolom pertama (indeks 0,0).";
    if (line.includes('print') && line.includes('[1][2]')) return "Mencetak elemen baris kedua kolom ketiga (indeks 1,2).";
    if (line.includes('print')) return "Mencetak nilai ke layar.";
    return "Baris kode Python biasa.";
  });
  return (
    <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px", borderLeft: "4px solid #306998" }}>
      <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Penjelasan per baris:</h4>
      {lines.map((line, idx) => (
        <div key={idx} style={{ marginBottom: "8px" }}>
          <code style={{ backgroundColor: "#f0f0f0", padding: "2px 4px" }}>{line}</code>
          <span style={{ marginLeft: "10px" }}>→ {penjelasan[idx]}</span>
        </div>
      ))}
    </div>
  );
};

// ===================== VISUALISASI CONTOH KODE =====================
const VisualisasiContoh = ({ codeKey }) => {
  if (codeKey === 'pembuatan' || codeKey === 'akses') {
    return (
      <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#eef2fa", borderRadius: "8px", border: "1px solid #306998" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#306998" }}>📊 Visualisasi Nested List</h4>
        <table style={{ borderCollapse: "collapse", margin: "10px 0" }}>
          <tbody>
            <tr><td style={styles.cell}>1</td><td style={styles.cell}>2</td><td style={styles.cell}>3</td></tr>
            <tr><td style={styles.cell}>4</td><td style={styles.cell}>5</td><td style={styles.cell}>6</td></tr>
          </tbody>
        </table>
        {codeKey === 'pembuatan' && <p>✅ Membuat matriks 2x3 dengan nama <code>matriks</code></p>}
        {codeKey === 'akses' && (
          <>
            <p>✅ <code>matriks[0][0]</code> → <strong>1</strong> (baris 1, kolom 1)</p>
            <p>✅ <code>matriks[1][2]</code> → <strong>6</strong> (baris 2, kolom 3)</p>
          </>
        )}
      </div>
    );
  }
  if (codeKey === 'panjangBerbeda') {
    return (
      <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#eef2fa", borderRadius: "8px", border: "1px solid #306998" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#306998" }}>📊 Visualisasi Ragged Array</h4>
        <pre style={{ backgroundColor: "#fff", padding: "8px", borderRadius: "6px" }}>[[1, 2], [3, 4, 5, 6], [7, 8, 9]]</pre>
        <p>Baris 0: 2 kolom, Baris 1: 4 kolom, Baris 2: 3 kolom</p>
      </div>
    );
  }
  return null;
};

// ===================== CODE EDITOR READ-ONLY =====================
const CodeEditor = ({ code, codeKey, pyodideReady, runPythonCode }) => {
  const [output, setOutput] = useState("");
  const [showDetail, setShowDetail] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat...");
      setShowDetail(true);
      return;
    }
    const result = await runPythonCode(code);
    setOutput(result);
    setShowDetail(true);
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
      {showDetail && (
        <>
          <VisualisasiContoh codeKey={codeKey} />
          <div style={styles.outputBox}>
            <div style={styles.outputHeader}>
              <span style={styles.outputTitle}>Output</span>
            </div>
            <div style={styles.codeOutput}>
              <pre style={styles.outputContent}>{output || "(Tidak ada output)"}</pre>
            </div>
          </div>
          <PenjelasanPerBaris code={code} />
        </>
      )}
      {!showDetail && (
        <div style={{ padding: "15px", textAlign: "center", color: "#666" }}>
          ⚡ Klik tombol "Jalankan" untuk melihat visualisasi, output, dan penjelasan.
        </div>
      )}
    </div>
  );
};

// ===================== CODE EDITOR EDITABLE (PRAKTIK) =====================
const CodeEditorEditable = ({ pyodideReady, runPythonCode }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false, 3: false });

  const validateStep = (code) => {
    const trimmed = code.trim();
    if (!/\bmatriks\s*=\s*\[\[.*?\]\s*,\s*\[.*?\]\]/.test(trimmed) && !completedSteps[1])
      return { valid: false, step: 1, msg: "Belum ada deklarasi 'matriks' dengan dua baris." };
    if (!/print\s*\(\s*matriks\s*\[\s*0\s*\]\s*\[\s*0\s*\]\s*\)/.test(trimmed) && !completedSteps[2])
      return { valid: false, step: 2, msg: "Belum mencetak elemen pertama baris pertama (print(matriks[0][0]))." };
    if (!/print\s*\(\s*matriks\s*\[\s*1\s*\]\s*\[\s*2\s*\]\s*\)/.test(trimmed) && !completedSteps[3])
      return { valid: false, step: 3, msg: "Belum mencetak elemen ketiga baris kedua (print(matriks[1][2]))." };
    return { valid: true };
  };

  const handleRun = async () => {
    if (!localCode.trim()) {
      setError("Silakan isi jawaban Anda terlebih dahulu.");
      setOutput("");
      setMessage("");
      return;
    }
    const validation = validateStep(localCode);
    if (!validation.valid) {
      setError(validation.msg);
      setOutput("");
      setMessage("");
      return;
    }
    setError("");
    const result = await runPythonCode(localCode);
    setOutput(result);
    let newCompleted = { ...completedSteps };
    let changed = false;
    if (!completedSteps[1] && /\bmatriks\s*=\s*\[\[.*?\]\s*,\s*\[.*?\]\]/.test(localCode)) {
      newCompleted[1] = true;
      changed = true;
      setMessage("✅ Bagus! Nested list 'matriks' sudah dibuat. Lanjut ke instruksi berikutnya.");
    }
    if (!completedSteps[2] && /print\s*\(\s*matriks\s*\[\s*0\s*\]\s*\[\s*0\s*\]\s*\)/.test(localCode)) {
      newCompleted[2] = true;
      changed = true;
      setMessage("✅ Bagus! Elemen pertama baris pertama sudah dicetak. Lanjut ke instruksi berikutnya.");
    }
    if (!completedSteps[3] && /print\s*\(\s*matriks\s*\[\s*1\s*\]\s*\[\s*2\s*\]\s*\)/.test(localCode)) {
      newCompleted[3] = true;
      changed = true;
      setMessage("✅ Bagus! Elemen ketiga baris kedua sudah dicetak. Semua instruksi selesai! Kode Anda benar.");
    }
    if (changed) setCompletedSteps(newCompleted);
    else if (newCompleted[1] && newCompleted[2] && newCompleted[3]) {
      setMessage("✅ SELAMAT! Semua instruksi sudah dipenuhi dengan benar.");
    } else {
      setMessage("⚠️ Periksa kembali kode Anda. Pastikan semua instruksi diikuti.");
    }
  };

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>Ayo Praktik</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady}>
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      {error && <div style={styles.errorBox}>{error}</div>}
      <textarea
        style={{ ...styles.codeInputEditable, border: error ? "2px solid #ff4444" : "none" }}
        value={localCode}
        onChange={(e) => setLocalCode(e.target.value)}
        placeholder="Tulis kode Python Anda di sini..."
        spellCheck={false}
      />
      <div style={styles.outputHeader}><span style={styles.outputTitle}>Output</span></div>
      <div style={styles.codeOutput}><pre style={styles.outputContent}>{output || "(Klik 'Jalankan' untuk melihat hasil)"}</pre></div>
      {message && <div style={message.startsWith("✅") ? styles.successBox : styles.warningBox}>{message}</div>}
    </div>
  );
};

// ===================== SOAL MELENGKAPI KODE =====================
const CodeCompletionQuestion = ({ question, codeParts, placeholders, expectedAnswers, resetTrigger, onCheck }) => {
  const [answers, setAnswers] = useState(placeholders.map(() => ""));
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setAnswers(placeholders.map(() => ""));
    setFeedback("");
    setChecked(false);
    setShowReset(false);
  }, [resetTrigger]);

  const handleAnswerChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
    setChecked(false);
    setFeedback("");
    setShowReset(false);
  };

  const handleCheck = () => {
    if (answers.some(a => a.trim() === "")) {
      setFeedback("⚠️ Lengkapi semua kotak isian terlebih dahulu.");
      return;
    }
    let allCorrect = true;
    for (let i = 0; i < expectedAnswers.length; i++) {
      if (answers[i].trim() !== expectedAnswers[i]) { allCorrect = false; break; }
    }
    setChecked(true);
    if (allCorrect) {
      setFeedback("✅ Benar!");
      setShowReset(false);
      if (onCheck) onCheck(true);
    } else {
      setFeedback("❌ Salah, coba lagi.");
      setShowReset(true);
      if (onCheck) onCheck(false);
    }
  };

  const handleReset = () => {
    setAnswers(placeholders.map(() => ""));
    setFeedback("");
    setChecked(false);
    setShowReset(false);
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
            disabled={checked && feedback === "✅ Benar!"}
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
      <pre style={styles.codeTemplateInline}>{renderCodeWithInputs()}</pre>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button style={styles.checkButton} onClick={handleCheck} disabled={checked && feedback === "✅ Benar!"}>Periksa</button>
        {showReset && <button style={styles.resetButtonSmall} onClick={handleReset}>Reset Jawaban</button>}
      </div>
      {feedback && <div style={feedback.includes("Benar") ? styles.feedbackSuccess : styles.feedbackError}>{feedback}</div>}
    </div>
  );
};

// ===================== SOAL TEBAK OUTPUT =====================
const GuessOutputQuestion = ({ question, codeSnippet, expectedOutput, resetTrigger, onCheck }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setUserAnswer("");
    setFeedback("");
    setChecked(false);
    setShowReset(false);
  }, [resetTrigger]);

  const handleCheck = () => {
    if (userAnswer.trim() === "") { setFeedback("⚠️ Isi jawaban Anda terlebih dahulu."); return; }
    const isCorrect = userAnswer.trim() === expectedOutput;
    setChecked(true);
    if (isCorrect) {
      setFeedback("✅ Benar!");
      setShowReset(false);
      if (onCheck) onCheck(true);
    } else {
      setFeedback("❌ Salah, coba lagi.");
      setShowReset(true);
      if (onCheck) onCheck(false);
    }
  };

  const handleReset = () => {
    setUserAnswer("");
    setFeedback("");
    setChecked(false);
    setShowReset(false);
  };

  return (
    <div style={styles.questionCard}>
      <p style={styles.questionText}>{question}</p>
      <pre style={styles.codeTemplate}>{codeSnippet}</pre>
      <input type="text" style={styles.fillInput} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Ketik output yang dihasilkan..." disabled={checked && feedback === "✅ Benar!"} />
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button style={styles.checkButton} onClick={handleCheck} disabled={checked && feedback === "✅ Benar!"}>Periksa</button>
        {showReset && <button style={styles.resetButtonSmall} onClick={handleReset}>Reset Jawaban</button>}
      </div>
      {feedback && <div style={feedback.includes("Benar") ? styles.feedbackSuccess : styles.feedbackError}>{feedback}</div>}
    </div>
  );
};

// ===================== EKSPLORASI =====================
const Eksplorasi = ({ onComplete }) => {
  const [selected, setSelected] = useState([null, null]);
  const [feedback, setFeedback] = useState(["", ""]);
  const [hasAnswered, setHasAnswered] = useState([false, false]);

  const questions = [
    { text: "Berikut ini yang merupakan sintaks yang benar untuk membuat nested list adalah ...", options: ["[1,2,3]", "[[1,2],[3,4]]", "(1,2,3)", "{1,2,3}", "[1,2,[3,4]]"], correct: 1 },
    { text: "Jika `matriks = [[1,2,3],[4,5,6]]`, cara mengakses elemen 6 adalah ...", options: ["matriks[1][2]", "matriks[2][1]", "matriks[1][1]", "matriks[2][2]", "matriks[0][2]"], correct: 0 }
  ];

  const handleAnswer = (qIdx, optIdx) => {
    if (hasAnswered[qIdx]) return;
    setSelected(prev => { const newSel = [...prev]; newSel[qIdx] = optIdx; return newSel; });
    const isCorrect = (optIdx === questions[qIdx].correct);
    setFeedback(prev => { const newFb = [...prev]; newFb[qIdx] = isCorrect ? "Benar" : "Salah"; return newFb; });
    setHasAnswered(prev => { const newAns = [...prev]; newAns[qIdx] = true; return newAns; });
  };

  useEffect(() => { if (hasAnswered.every(v => v === true)) onComplete(); }, [hasAnswered, onComplete]);

  return (
    <div>
      <h2 style={styles.sectionTitle}>Eksplorasi Awal</h2>
      <div style={styles.card}>
        <p style={styles.text}>Sebelum belajar, jawab pertanyaan berikut. <strong style={{ color: "#0d6efd" }}>Materi akan terbuka setelah kedua pertanyaan dijawab.</strong></p>
        {questions.map((q, idx) => {
          const isAnswered = hasAnswered[idx];
          const selectedIdx = selected[idx];
          return (
            <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
              <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx+1}. {q.text}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {q.options.map((opt, optIdx) => {
                  let optionStyle = styles.eksplorasiOption;
                  if (isAnswered) {
                    optionStyle = { ...styles.eksplorasiOptionDisabled };
                    if (selectedIdx === optIdx) {
                      const isCorrect = (selectedIdx === q.correct);
                      optionStyle = { ...optionStyle, backgroundColor: isCorrect ? "#d4edda" : "#f8d7da", borderColor: isCorrect ? "#28a745" : "#dc3545", color: isCorrect ? "#155724" : "#842029" };
                    }
                  }
                  return (
                    <div key={optIdx} onClick={() => !isAnswered && handleAnswer(idx, optIdx)} style={optionStyle}>
                      {opt}
                    </div>
                  );
                })}
              </div>
              {feedback[idx] && <div style={feedback[idx] === "Benar" ? styles.feedbackCorrect : styles.feedbackWrong}>{feedback[idx]}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===================== STRUKTUR INTERAKTIF =====================
const StrukturInteraktif = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const data = [[85, 90, 78], [88, 92, 80]];

  const handleClick = (row, col) => {
    if (row === null && col === null) setSelectedElement({ text: "nilai_siswa → [[85, 90, 78], [88, 92, 80]] (seluruh nested list)" });
    else if (col === null) setSelectedElement({ text: `nilai_siswa[${row}] → [${data[row].join(", ")}] (seluruh baris ke-${row+1})` });
    else setSelectedElement({ text: `nilai_siswa[${row}][${col}] → ${data[row][col]} (baris ${row+1}, kolom ${col+1})` });
  };

  return (
    <div style={{ margin: "20px 0", padding: "15px", backgroundColor: "#f0f4f8", borderRadius: "12px" }}>
      <h4 style={{ marginBottom: "15px", color: "#306998" }}>Visualisasi Struktur Nested List (Klik pada elemen)</h4>
      <p style={{ marginBottom: "10px", fontSize: "14px", fontStyle: "italic" }}>💡 Petunjuk: Klik pada kotak "nilai_siswa", pada setiap judul baris, atau pada setiap angka dalam tabel.</p>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <pre style={{ fontSize: "16px", fontWeight: "bold", backgroundColor: "#fff", padding: "10px", borderRadius: "8px" }}>nilai_siswa = [[85, 90, 78], [88, 92, 80]]</pre>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => handleClick(null, null)}>
          <div style={{ padding: "20px", backgroundColor: selectedElement?.text?.includes("seluruh") ? "#FFD43B" : "#306998", color: "white", borderRadius: "12px", minWidth: "150px" }}>Klik untuk info seluruh data</div>
          <div style={{ marginTop: "8px" }}>nilai_siswa</div>
        </div>
        <table style={{ borderCollapse: "collapse", backgroundColor: "white" }}>
          <thead>
            <tr style={{ backgroundColor: "#e9ecef" }}>
              <th></th><th>Kolom 0</th><th>Kolom 1</th><th>Kolom 2</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => handleClick(rowIdx, null)}>Baris {rowIdx+1}</td>
                {row.map((val, colIdx) => (
                  <td key={colIdx} style={{ padding: "12px", cursor: "pointer", backgroundColor: "#f1f3f5" }} onClick={() => handleClick(rowIdx, colIdx)}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedElement && <div style={{ marginTop: "20px", padding: "12px", backgroundColor: "#fff3cd", borderLeft: "5px solid #FFD43B", borderRadius: "8px" }}><strong>Informasi:</strong> {selectedElement.text}</div>}
    </div>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function PembuatanAksesNestedList() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [resetInteractives, setResetInteractives] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);
  const [allExercisesCorrect, setAllExercisesCorrect] = useState(false);

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
  };

  const soal1CodeParts = ["data = [[10,20,30],[40,50,60]]\nprint(data[", "][", "])"];
  const soal1Expected = ["0","1"];
  const soal2CodeParts = ["matriks = [[1,2], ", "]\nprint(matriks)"];
  const soal2Expected = ["[3,4]"];
  const soal3CodeParts = ["data = [[10,20],[30,40],[50,60]]\nprint(data[", "][", "])"];
  const soal3Expected = ["2","1"];

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
      const result = await pyodide.runPythonAsync(`
import sys
from io import StringIO
_old_stdout = sys.stdout
sys.stdout = _buffer = StringIO()
try:
    exec(${JSON.stringify(code)})
finally:
    sys.stdout = _old_stdout
_buffer.getvalue()`);
      return result;
    } catch (error) {
      return `❌ Error: ${error.message}`;
    }
  }, []);

  const resetInteractiveQuestions = () => { setResetInteractives(prev => prev+1); setAllExercisesCorrect(false); };
  const handleEksplorasiComplete = () => setIsEksplorasiCompleted(true);
  const handleExerciseCorrect = () => setAllExercisesCorrect(true);

  return (
    <>
      <Navbar />
      <SidebarMateri isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div style={{ marginLeft: isSidebarOpen ? "280px" : "0", transition: "margin-left 0.3s ease", paddingTop: "64px", minHeight: "100vh", width: "auto" }}>
        <div style={styles.page}>
          <div style={styles.header}><div style={styles.headerAccent}></div><h1 style={styles.headerTitle}>PEMBUATAN DAN AKSES ELEMEN NESTED LIST</h1></div>
          <section style={styles.section}><h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2><div style={styles.card}><ol style={styles.list}><li>Mahasiswa mampu membuat nested list sesuai kebutuhan representasi data.</li><li>Mahasiswa mampu mengakses elemen nested list menggunakan indeks baris dan kolom.</li></ol></div></section>
          <section style={styles.section}><Eksplorasi onComplete={handleEksplorasiComplete} /></section>
          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}><div style={styles.card}><h3 style={styles.subTitle}>Struktur Nested List</h3><p>Nested list dapat dipandang sebagai tabel/matriks. Indeks pertama = baris, kedua = kolom.</p><StrukturInteraktif /></div></section>
              <section style={styles.section}><div style={styles.card}><h3 style={styles.subTitle}>Membuat Nested List</h3><p>Nested list = list di dalam list.</p><CodeEditor code={exampleCodes.pembuatan} codeKey="pembuatan" pyodideReady={pyodideReady} runPythonCode={runPythonCode} /><CodeEditor code={exampleCodes.panjangBerbeda} codeKey="panjangBerbeda" pyodideReady={pyodideReady} runPythonCode={runPythonCode} /></div></section>
              <section style={styles.section}><div style={styles.card}><h3 style={styles.subTitle}>Mengakses Elemen</h3><p>Gunakan dua indeks.</p><CodeEditor code={exampleCodes.akses} codeKey="akses" pyodideReady={pyodideReady} runPythonCode={runPythonCode} /></div></section>
              <section style={styles.section}><h2 style={styles.sectionTitle}>Ayo Praktik!</h2><div style={styles.card}><div style={styles.alertBox}><strong>📘 Cerita Studi Kasus:</strong><p>Data: Siswa A=[3,6,9], Siswa B=[12,15,18]. Buat nested list 'matriks', cetak 3 dan 18.</p><p><strong>Instruksi:</strong></p><ol><li>Buat matriks = [[3,6,9],[12,15,18]]</li><li>Cetak matriks[0][0]</li><li>Cetak matriks[1][2]</li></ol><p style={{fontStyle:"italic",color:"#d9534f"}}>⚠️ Ikuti instruksi. Error tidak memberi jawaban benar.</p></div><CodeEditorEditable pyodideReady={pyodideReady} runPythonCode={runPythonCode} /></div></section>
              <section style={styles.section}><h2 style={styles.sectionTitle}>Latihan</h2><div style={styles.card}><button style={styles.resetButton} onClick={resetInteractiveQuestions}>↻ Reset Semua Jawaban</button>
                <CodeCompletionQuestion question="1. Akses elemen 20" codeParts={soal1CodeParts} placeholders={["",""]} expectedAnswers={soal1Expected} resetTrigger={resetInteractives} onCheck={handleExerciseCorrect} />
                <CodeCompletionQuestion question="2. Lengkapi baris kedua [3,4]" codeParts={soal2CodeParts} placeholders={["..."]} expectedAnswers={soal2Expected} resetTrigger={resetInteractives} onCheck={handleExerciseCorrect} />
                <CodeCompletionQuestion question="3. Cetak elemen terakhir (60)" codeParts={soal3CodeParts} placeholders={["",""]} expectedAnswers={soal3Expected} resetTrigger={resetInteractives} onCheck={handleExerciseCorrect} />
                <GuessOutputQuestion question="4. Output dari kode?" codeSnippet={`nilai = [[5,7],[9,11]]\nprint(nilai[1][0])`} expectedOutput="9" resetTrigger={resetInteractives} onCheck={handleExerciseCorrect} />
                <GuessOutputQuestion question="5. Output dari kode?" codeSnippet={`a = [[2,4],[6,8]]\nb = a[0][1]\nprint(b)`} expectedOutput="4" resetTrigger={resetInteractives} onCheck={handleExerciseCorrect} />
                {allExercisesCorrect && <div style={styles.finalSuccessBox}>🎉 Selamat! Semua jawaban benar.</div>}
              </div></section>
            </>
          )}
          {!isEksplorasiCompleted && <div style={styles.lockMessage}>🔒 Materi terkunci. Selesaikan eksplorasi di atas.</div>}
        </div>
      </div>
    </>
  );
}

// ===================== STYLES =====================
const styles = {
  page: { padding: "30px 40px", backgroundColor: "#f5f7fa", minHeight: "calc(100vh - 64px)", fontFamily: "Poppins, sans-serif", width: "100%", boxSizing: "border-box" },
  header: { backgroundColor: "#306998", color: "white", padding: "18px 24px", position: "relative", marginBottom: "30px", borderRadius: "6px" },
  headerAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: "8px", backgroundColor: "#FFD43B" },
  headerTitle: { margin: 0, textAlign: "center", fontSize: "28px", fontWeight: "700" },
  section: { marginBottom: "40px" },
  sectionTitle: { fontSize: "22px", fontWeight: "700", marginBottom: "15px", borderLeft: "5px solid #306998", paddingLeft: "12px" },
  card: { backgroundColor: "white", borderRadius: "10px", padding: "25px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" },
  list: { paddingLeft: "20px", lineHeight: "1.8" },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
  subTitle: { marginTop: "20px", marginBottom: "15px", color: "#306998", fontSize: "22px", fontWeight: "700", borderLeft: "4px solid #FFD43B", paddingLeft: "12px" },
  alertBox: { backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "6px", padding: "15px", marginBottom: "15px", color: "#856404" },
  lockMessage: { marginTop: "20px", padding: "15px", backgroundColor: "#cfe2ff", borderLeft: "5px solid #0d6efd", borderRadius: "8px", textAlign: "center", color: "#084298" },
  eksplorasiOption: { padding: "12px", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s", border: "1px solid #ddd", backgroundColor: "#f9f9f9" },
  eksplorasiOptionDisabled: { padding: "12px", borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#e9ecef", color: "#6c757d", cursor: "not-allowed", opacity: 0.7 },
  feedbackCorrect: { marginTop: "10px", padding: "8px 12px", backgroundColor: "#d1e7dd", color: "#0f5132", borderRadius: "6px", fontWeight: "500" },
  feedbackWrong: { marginTop: "10px", padding: "8px 12px", backgroundColor: "#f8d7da", color: "#842029", borderRadius: "6px", fontWeight: "500" },
  codeEditorContainer: { border: "2px solid #306998", borderRadius: "10px", overflow: "hidden", marginBottom: "20px", backgroundColor: "#1e1e1e", marginTop: "15px" },
  codeEditorHeader: { backgroundColor: "#306998", color: "white", padding: "12px 15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  codeEditorTitle: { fontWeight: "600", fontSize: "15px" },
  runButton: { backgroundColor: "#FFD43B", color: "#306998", border: "none", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  outputBox: { marginTop: "10px" },
  outputHeader: { backgroundColor: "#306998", color: "white", padding: "10px 15px" },
  outputTitle: { fontWeight: "600", fontSize: "15px" },
  codeOutput: { backgroundColor: "#1e1e1e", padding: "15px", minHeight: "60px" },
  outputContent: { color: "#4af", fontFamily: "monospace", fontSize: "14px", margin: 0, whiteSpace: "pre-wrap" },
  codeInputReadOnly: { width: "100%", minHeight: "100px", backgroundColor: "#272822", color: "#f8f8f2", padding: "15px", fontFamily: "monospace", fontSize: "14px", overflow: "auto" },
  codePre: { margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word" },
  errorBox: { backgroundColor: "#ff4444", color: "white", padding: "12px 15px", fontSize: "14px" },
  codeInputEditable: { width: "100%", minHeight: "250px", backgroundColor: "#272822", color: "#f8f8f2", padding: "15px", fontFamily: "monospace", fontSize: "14px", resize: "vertical", outline: "none" },
  questionCard: { backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "15px", marginBottom: "20px", border: "1px solid #ddd" },
  questionText: { fontWeight: "500", marginBottom: "10px" },
  codeTemplate: { backgroundColor: "#272822", color: "#f8f8f2", padding: "10px", borderRadius: "6px", fontFamily: "monospace", fontSize: "14px", overflowX: "auto", marginBottom: "10px" },
  codeTemplateInline: { backgroundColor: "#272822", color: "#f8f8f2", padding: "10px", borderRadius: "6px", fontFamily: "monospace", fontSize: "14px", whiteSpace: "pre-wrap", marginBottom: "10px" },
  inlineInput: { backgroundColor: "#fff", color: "#000", border: "1px solid #ccc", borderRadius: "4px", padding: "2px 6px", margin: "0 2px", fontFamily: "monospace", fontSize: "14px", textAlign: "center" },
  fillInput: { width: "100%", padding: "10px", fontSize: "14px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "10px" },
  checkButton: { backgroundColor: "#28a745", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", marginRight: "10px" },
  resetButton: { backgroundColor: "#6c757d", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", marginBottom: "20px" },
  resetButtonSmall: { backgroundColor: "#6c757d", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  feedbackSuccess: { marginTop: "8px", fontSize: "14px", color: "#155724", backgroundColor: "#d4edda", padding: "8px", borderRadius: "6px" },
  feedbackError: { marginTop: "8px", fontSize: "14px", color: "#721c24", backgroundColor: "#f8d7da", padding: "8px", borderRadius: "6px" },
  successBox: { marginTop: "12px", padding: "10px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "6px", textAlign: "center" },
  warningBox: { marginTop: "12px", padding: "10px", backgroundColor: "#fff3cd", color: "#856404", borderRadius: "6px", textAlign: "center" },
  finalSuccessBox: { marginTop: "20px", padding: "15px", backgroundColor: "#d1e7dd", borderRadius: "8px", textAlign: "center", color: "#0f5132", fontWeight: "bold" },
  cell: { border: "1px solid #306998", padding: "8px 12px", textAlign: "center" },
};