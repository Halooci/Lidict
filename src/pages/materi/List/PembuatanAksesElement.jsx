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
    minHeight: "200px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  },
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ddd",
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
    marginBottom: "10px",
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
    marginBottom: "10px",
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
    outline: "none",
  },
  fillInput: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  checkButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "10px",
  },
  resetButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px",
  },
  feedback: { marginTop: "8px", fontSize: "14px", fontStyle: "italic", color: "#333" },
};

// ================= KOMPONEN VISUALISASI LIST DENGAN HOVER INTERAKTIF =================
const ListVisualization = ({ data, title, highlightSequence, processExplanation }) => {
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [explanationText, setExplanationText] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!highlightSequence || highlightSequence.length === 0) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < highlightSequence.length) {
        setCurrentHighlight(highlightSequence[idx].index);
        if (processExplanation && processExplanation[idx]) {
          setExplanationText(processExplanation[idx]);
        }
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentHighlight(null);
          setExplanationText("");
        }, 500);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, [highlightSequence, processExplanation]);

  const negativeIndices = data.map((_, i) => -(data.length - i));

  const getHoverExplanation = (idx, item) => {
    const posIdx = idx;
    const negIdx = negativeIndices[idx];
    return `📌 Elemen: "${item}"
✅ Indeks positif: ${posIdx} → akses dengan data[${posIdx}]
✅ Indeks negatif: ${negIdx} → akses dengan data[${negIdx}]
💡 Tip: Indeks negatif dihitung dari akhir list, -1 = elemen terakhir.`;
  };

  return (
    <div style={visStyles.container}>
      <p style={visStyles.title}>{title}</p>
      <div style={visStyles.listWrapper}>
        {data.map((item, idx) => (
          <div
            key={idx}
            style={visStyles.itemCard}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              style={{
                ...visStyles.item,
                backgroundColor: currentHighlight === idx ? "#FFD43B" : (hoveredIndex === idx ? "#FFA500" : "#306998"),
                color: (currentHighlight === idx || hoveredIndex === idx) ? "#1f2937" : "white",
                transform: (currentHighlight === idx || hoveredIndex === idx) ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            >
              <div style={visStyles.value}>{String(item)}</div>
            </div>
            <div style={visStyles.indexLabel}>Indeks +{idx}</div>
            <div style={visStyles.indexLabelNeg}>Indeks {negativeIndices[idx]}</div>
          </div>
        ))}
      </div>
      {hoveredIndex !== null && (
        <div style={visStyles.hoverExplanationBox}>
          {getHoverExplanation(hoveredIndex, data[hoveredIndex])}
        </div>
      )}
      {explanationText && (
        <div style={visStyles.explanationBox}>
          <strong>📖 Proses animasi:</strong> {explanationText}
        </div>
      )}
      <div style={visStyles.note}>
        💡 <strong>Petunjuk:</strong> Arahkan kursor ke kotak untuk melihat detail indeks. Klik "Jalankan & Lihat Proses" untuk simulasi akses list.
      </div>
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
  title: { fontSize: "16px", fontWeight: "bold", marginBottom: "15px", color: "#306998", textAlign: "center" },
  listWrapper: { display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "15px" },
  itemCard: { textAlign: "center" },
  item: { width: "80px", padding: "12px 8px", borderRadius: "10px", fontWeight: "500", marginBottom: "5px" },
  value: { fontSize: "14px" },
  indexLabel: { fontSize: "11px", color: "#555", marginTop: "4px" },
  indexLabelNeg: { fontSize: "11px", color: "#888" },
  hoverExplanationBox: {
    backgroundColor: "#fff3cd",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "10px",
    fontSize: "14px",
    color: "#856404",
    borderLeft: "4px solid #ffc107",
    whiteSpace: "pre-line",
  },
  explanationBox: {
    backgroundColor: "#e8f1ff",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "10px",
    fontSize: "14px",
    color: "#1f2937",
    borderLeft: "4px solid #306998",
  },
  note: { fontSize: "12px", color: "#666", marginTop: "10px", textAlign: "center" },
};

// ================= KOMPONEN CODE EDITOR READ-ONLY DENGAN VISUALISASI =================
const CodeEditorWithVisual = ({ code, title, visualData, visualTitle, highlightMapping, pyodideReady, runPythonCode }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [highlightSequence, setHighlightSequence] = useState([]);
  const [explanationSteps, setExplanationSteps] = useState([]);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat...");
      return;
    }
    setIsRunning(true);
    const result = await runPythonCode(code);
    setOutput(result);
    setIsRunning(false);

    if (highlightMapping) {
      const { indices, explanations } = highlightMapping();
      setHighlightSequence(indices.map((i) => ({ index: i })));
      setExplanationSteps(explanations);
      setTimeout(() => {
        setHighlightSequence([]);
        setExplanationSteps([]);
      }, 6000);
    }
  }, [pyodideReady, code, runPythonCode, highlightMapping]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady || isRunning}>
          {isRunning ? "⏳ Menjalankan..." : pyodideReady ? "▶ Jalankan & Lihat Proses" : "⏳ Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>{code}</pre>
      </div>
      {visualData && (
        <ListVisualization
          data={visualData}
          title={visualTitle}
          highlightSequence={highlightSequence}
          processExplanation={explanationSteps}
        />
      )}
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output Program</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik tombol di atas untuk menjalankan kode dan melihat simulasi)"}</pre>
      </div>
    </div>
  );
};

// ================= KOMPONEN UNTUK LATIHAN PRAKTIK CODING =================
const CodeEditorEditable = ({ title, pyodideReady, runPythonCode }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setError("");
  }, []);

  const validateAndRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat...");
      return;
    }
    setOutput("");
    setError("");
    setIsRunning(true);

    const trimmed = localCode.trim();
    if (!trimmed.includes("belanja =")) {
      setError("❌ ERROR: Kamu harus membuat variabel 'belanja'.");
      setIsRunning(false);
      return;
    }
    const regex = /belanja\s*=\s*\[\s*["']apel["']\s*,\s*["']jeruk["']\s*,\s*["']mangga["']\s*\]/;
    if (!regex.test(trimmed)) {
      setError("❌ ERROR: Isi list harus ['apel', 'jeruk', 'mangga'].");
      setIsRunning(false);
      return;
    }
    if (!/print\s*\(\s*belanja\s*\[\s*0\s*\]\s*\)/.test(trimmed)) {
      setError("❌ ERROR: Kamu harus mencetak elemen pertama dengan print(belanja[0]).");
      setIsRunning(false);
      return;
    }
    if (!/print\s*\(\s*belanja\s*\[\s*-\s*1\s*\]\s*\)/.test(trimmed)) {
      setError("❌ ERROR: Kamu harus mencetak elemen terakhir dengan print(belanja[-1]).");
      setIsRunning(false);
      return;
    }

    const result = await runPythonCode(localCode);
    setOutput(result);
    if (result.includes("apel") && result.includes("mangga")) {
      setOutput(result + "\n\n✅ SELAMAT! Jawaban kamu BENAR!");
    } else {
      setOutput(result + "\n\n⚠️ Output tidak sesuai. Pastikan kamu mencetak elemen pertama dan terakhir.");
    }
    setIsRunning(false);
  }, [localCode, pyodideReady, runPythonCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={validateAndRun} disabled={!pyodideReady || isRunning}>
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

// ================= KOMPONEN SOAL MELENGKAPI KODE =================
const CodeCompletionQuestion = ({ question, codeParts, placeholders, expectedAnswers, resetTrigger }) => {
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
    } else {
      const expectedStr = expectedAnswers.join(", ");
      setFeedback(`❌ Salah. Jawaban yang benar: ${expectedStr}`);
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
      <pre style={styles.codeTemplateInline}>{renderCodeWithInputs()}</pre>
      <button style={styles.checkButton} onClick={handleCheck} disabled={checked}>
        Periksa
      </button>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

// ================= KOMPONEN SOAL MENENTUKAN OUTPUT =================
const GuessOutputQuestion = ({ question, codeSnippet, expectedOutput, resetTrigger }) => {
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

// ================= KOMPONEN UTAMA =================
export default function PembuatanAksesElement() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [resetInteractives, setResetInteractives] = useState(0);

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

  // Data visual
  const buahData = ["apel", "jeruk", "mangga"];
  const angkaData = [10, 20, 30, 40, 50];

  // Contoh kode
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

  // Fungsi mapping untuk visualisasi
  const highlightPembuatan = () => ({
    indices: [0, 1, 2],
    explanations: [
      "👉 Python membaca list dari kiri ke kanan. Indeks 0: 'apel' → disimpan di memori.",
      "👉 Indeks 1: 'jeruk' → disimpan setelah 'apel'.",
      "👉 Indeks 2: 'mangga' → disimpan setelah 'jeruk'. Kemudian print(buah) menampilkan seluruh list."
    ]
  });
  const highlightAkses = () => ({
    indices: [0, 1],
    explanations: [
      "📌 Perintah `buah[0]` → Python langsung mengambil elemen pada indeks 0, yaitu 'apel', lalu mencetaknya.",
      "📌 Perintah `buah[1]` → Python mengambil elemen pada indeks 1, yaitu 'jeruk', lalu mencetaknya."
    ]
  });
  const highlightNegatif = () => ({
    indices: [2, 1],
    explanations: [
      "🔹 `buah[-1]` → indeks negatif -1 diubah menjadi indeks positif (len-1 = 2), yaitu 'mangga'. Dicetak.",
      "🔹 `buah[-2]` → indeks -2 diubah menjadi indeks positif 1, yaitu 'jeruk'. Dicetak."
    ]
  });
  const highlightSlicing = () => ({
    indices: [1, 2, 3],
    explanations: [
      "✂️ Slicing `angka[1:4]` → mulai dari indeks 1 (nilai 20), berhenti SEBELUM indeks 4 (nilai 50 tidak termasuk).",
      "✂️ Mengambil indeks 2 (nilai 30).",
      "✂️ Mengambil indeks 3 (nilai 40). Hasil slicing adalah list baru [20,30,40]."
    ]
  });

  // Soal interaktif
  const soal1CodeParts = ["buah = [\"apel\", \"jeruk\", \"mangga\"]\nprint(buah[", "])  # ingin mencetak 'jeruk'"];
  const soal1Placeholders = [""];
  const soal1Expected = ["1"];

  const soal2CodeParts = ["nilai = [10, 20, 30, 40]\nprint(nilai[", "])  # ingin mencetak 30"];
  const soal2Placeholders = [""];
  const soal2Expected = ["2"];

  const soal3CodeParts = ["data = [5, 10, 15, 20]\nprint(data[", "])  # menggunakan indeks negatif untuk mencetak 15"];
  const soal3Placeholders = [""];
  const soal3Expected = ["-2"];

  const soal4Code = `buah = ["apel", "jeruk", "mangga"]
print(buah[1])`;
  const soal5Code = `angka = [100, 200, 300]
print(angka[-2])`;

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

  const resetInteractiveQuestions = () => {
    setResetInteractives(prev => prev + 1);
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
                    List dibuat dengan tanda kurung siku <code>[]</code> dan elemen dipisahkan koma.
                  </p>
                  <CodeEditorWithVisual
                    code={exampleCodes.pembuatan}
                    title="Contoh: Membuat List"
                    visualData={buahData}
                    visualTitle="Visualisasi List 'buah'"
                    highlightMapping={highlightPembuatan}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                  <div style={styles.infoBox}>
                    <strong>📌 Catatan:</strong> List bersifat <strong>mutable</strong> (dapat diubah) dan <strong>ordered</strong> (mempertahankan urutan).
                  </div>
                </div>
              </section>

              {/* AKSES POSITIF */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🔍 Akses Elemen (Indeks Positif)</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Indeks dimulai dari <strong>0</strong> untuk elemen pertama.
                  </p>
                  <CodeEditorWithVisual
                    code={exampleCodes.akses}
                    title="Contoh: Akses dengan Indeks Positif"
                    visualData={buahData}
                    visualTitle="Visualisasi List 'buah'"
                    highlightMapping={highlightAkses}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>

              {/* AKSES NEGATIF */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🔍 Akses Elemen (Indeks Negatif)</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Indeks negatif: <strong>-1</strong> untuk elemen terakhir, <strong>-2</strong> untuk kedua terakhir.
                  </p>
                  <CodeEditorWithVisual
                    code={exampleCodes.negatif}
                    title="Contoh: Akses dengan Indeks Negatif"
                    visualData={buahData}
                    visualTitle="Visualisasi List 'buah'"
                    highlightMapping={highlightNegatif}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>

              {/* SLICING */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>✂️ Slicing List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Slicing <code>list[awal:akhir]</code> mengambil elemen dari indeks `awal` hingga sebelum `akhir`.
                  </p>
                  <CodeEditorWithVisual
                    code={exampleCodes.slicing}
                    title="Contoh: Slicing"
                    visualData={angkaData}
                    visualTitle="Visualisasi List 'angka'"
                    highlightMapping={highlightSlicing}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                  <div style={styles.highlightBox}>
                    <strong>💡 Tips:</strong> <code>list[:3]</code> mengambil 3 elemen pertama, <code>list[2:]</code> dari indeks 2 sampai akhir.
                  </div>
                </div>
              </section>

              {/* LATIHAN PRAKTIK CODING */}
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
                  <CodeEditorEditable
                    title="Latihan: Daftar Belanja"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>

              {/* LATIHAN INTERAKTIF */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🧩 Latihan Interaktif</h2>
                <div style={styles.card}>
                  <p style={styles.text}>Isilah bagian yang kosong pada kode di bawah ini dengan mengetikkan jawaban pada kotak yang tersedia.</p>
                  <button style={styles.resetButton} onClick={resetInteractiveQuestions}>↻ Reset Jawaban</button>

                  <CodeCompletionQuestion
                    question="1. Lengkapi kode untuk mencetak 'jeruk' dari list berikut:"
                    codeParts={soal1CodeParts}
                    placeholders={soal1Placeholders}
                    expectedAnswers={soal1Expected}
                    resetTrigger={resetInteractives}
                  />

                  <CodeCompletionQuestion
                    question="2. Lengkapi kode untuk mencetak angka 30 dari list nilai:"
                    codeParts={soal2CodeParts}
                    placeholders={soal2Placeholders}
                    expectedAnswers={soal2Expected}
                    resetTrigger={resetInteractives}
                  />

                  <CodeCompletionQuestion
                    question="3. Lengkapi kode (gunakan indeks negatif) untuk mencetak 15 dari list data:"
                    codeParts={soal3CodeParts}
                    placeholders={soal3Placeholders}
                    expectedAnswers={soal3Expected}
                    resetTrigger={resetInteractives}
                  />

                  <GuessOutputQuestion
                    question="4. Apa output dari kode berikut?"
                    codeSnippet={soal4Code}
                    expectedOutput="jeruk"
                    resetTrigger={resetInteractives}
                  />

                  <GuessOutputQuestion
                    question="5. Jika kita menjalankan kode berikut, apa yang akan tercetak?"
                    codeSnippet={soal5Code}
                    expectedOutput="200"
                    resetTrigger={resetInteractives}
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