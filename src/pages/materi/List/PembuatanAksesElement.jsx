import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ================= STYLE GLOBAL (sama seperti sebelumnya) =================
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
  visualHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    fontWeight: "600",
    fontSize: "15px",
  },
  visualArea: {
    backgroundColor: "#1e1e1e",
    padding: "15px",
    minHeight: "200px",
  },
  visualPlaceholder: {
    color: "#aaa",
    fontFamily: "monospace",
    fontSize: "14px",
    textAlign: "center",
    margin: "20px 0",
  },
};

// ================= KOMPONEN VISUALISASI LIST =================
const ListVisualization = ({ data, title, highlightSequence, processExplanation, hidePositive = false, hideNegative = false, disableHover = false }) => {
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
    }, 3000);
    return () => clearInterval(interval);
  }, [highlightSequence, processExplanation]);

  const negativeIndices = data.map((_, i) => -(data.length - i));

  const getHoverExplanation = (idx, item) => {
    let msg = `📌 Elemen: "${item}"`;
    if (!hidePositive) msg += `\n✅ Indeks positif: ${idx} → data[${idx}]`;
    if (!hideNegative) msg += `\n✅ Indeks negatif: ${negativeIndices[idx]} → data[${negativeIndices[idx]}]`;
    if (!hidePositive && !hideNegative) msg += `\n💡 Tip: Indeks negatif dihitung dari akhir list.`;
    return msg;
  };

  const getBgColor = (idx) => {
    if (disableHover) {
      if (currentHighlight === idx) return "#FFD43B";
      return "#306998";
    }
    if (currentHighlight === idx) return "#FFD43B";
    if (hoveredIndex === idx) return "#FFA500";
    return "#306998";
  };

  const getTextColor = (idx) => {
    if (disableHover) {
      if (currentHighlight === idx) return "#1f2937";
      return "white";
    }
    if (currentHighlight === idx || hoveredIndex === idx) return "#1f2937";
    return "white";
  };

  const getTransform = (idx) => {
    if (disableHover) {
      if (currentHighlight === idx) return "scale(1.05)";
      return "scale(1)";
    }
    if (currentHighlight === idx || hoveredIndex === idx) return "scale(1.05)";
    return "scale(1)";
  };

  return (
    <div style={visStyles.container}>
      <p style={visStyles.title}>{title}</p>
      <div style={visStyles.listWrapper}>
        {data.map((item, idx) => (
          <div
            key={idx}
            style={visStyles.itemCard}
            onMouseEnter={() => !disableHover && setHoveredIndex(idx)}
            onMouseLeave={() => !disableHover && setHoveredIndex(null)}
          >
            <div
              style={{
                ...visStyles.item,
                backgroundColor: getBgColor(idx),
                color: getTextColor(idx),
                transform: getTransform(idx),
                transition: "all 0.3s ease",
                cursor: disableHover ? "default" : "pointer",
              }}
            >
              <div style={visStyles.value}>{String(item)}</div>
            </div>
            {!hidePositive && <div style={visStyles.indexLabel}>Indeks +{idx}</div>}
            {!hideNegative && <div style={visStyles.indexLabelNeg}>Indeks {negativeIndices[idx]}</div>}
          </div>
        ))}
      </div>
      {!disableHover && hoveredIndex !== null && (
        <div style={visStyles.hoverExplanationBox}>
          {getHoverExplanation(hoveredIndex, data[hoveredIndex])}
        </div>
      )}
      {explanationText && (
        <div style={visStyles.explanationBox}>
          <strong>📖 Proses animasi:</strong> {explanationText}
        </div>
      )}
      {!disableHover && (
        <div style={visStyles.note}>
          💡 <strong>Petunjuk:</strong> Arahkan kursor ke kotak untuk melihat detail indeks.
        </div>
      )}
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

// ================= KOMPONEN CODE EDITOR DENGAN VISUALISASI =================
const CodeEditorWithVisual = ({ code, title, visualData, visualTitle, highlightMapping, pyodideReady, runPythonCode, hidePositive = false, hideNegative = false, disableHover = false }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const [highlightSequence, setHighlightSequence] = useState([]);
  const [explanationSteps, setExplanationSteps] = useState([]);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat...");
      return;
    }
    setIsRunning(true);
    setShowVisual(false);
    const result = await runPythonCode(code);
    setOutput(result);
    setIsRunning(false);
    setShowVisual(true);

    if (highlightMapping) {
      const { indices, explanations } = highlightMapping();
      const totalSteps = indices.length;
      const totalDuration = totalSteps * 3000 + 500;
      setHighlightSequence(indices.map((i) => ({ index: i })));
      setExplanationSteps(explanations);
      setTimeout(() => {
        setHighlightSequence([]);
        setExplanationSteps([]);
      }, totalDuration);
    }
  }, [pyodideReady, code, runPythonCode, highlightMapping]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady || isRunning}>
          {isRunning ? "⏳ Menjalankan..." : pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>{code}</pre>
      </div>
      <div style={styles.visualHeader}>📊 Visualisasi Kode Program</div>
      <div style={styles.visualArea}>
        {showVisual && visualData ? (
          <ListVisualization
            data={visualData}
            title={visualTitle}
            highlightSequence={highlightSequence}
            processExplanation={explanationSteps}
            hidePositive={hidePositive}
            hideNegative={hideNegative}
            disableHover={disableHover}
          />
        ) : (
          <div style={styles.visualPlaceholder}>(Klik 'Jalankan' untuk melihat hasil)</div>
        )}
      </div>
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik tombol di atas untuk menjalankan kode)"}</pre>
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
  const campuranData = ["apel", 100, true, 3.14];
  const angkaData = [10, 20, 30, 40, 50];

  // Kode contoh
  const contohMembuatList = `# List dengan tipe data sama (string)
buah = ["apel", "jeruk", "mangga"]

# List dengan tipe data sama (integer)
angka = [10, 20, 30, 40, 50]

# List dengan tipe data campuran
campuran = ["teks", 100, True, 3.14]`;

  const contohAksesPositif = `# List dengan tipe data campuran
data = ["apel", 100, True, 3.14]

# Mengakses elemen pertama (indeks 0)
print("Elemen pertama:", data[0])
# Mengakses elemen kedua (indeks 1)
print("Elemen kedua:", data[1])
# Mengakses elemen ketiga (indeks 2)
print("Elemen ketiga:", data[2])
# Mengakses elemen keempat (indeks 3)
print("Elemen keempat:", data[3])`;

  const contohAksesNegatif = `# List dengan tipe data campuran
data = ["apel", 100, True, 3.14]

# Mengakses elemen terakhir (indeks -1)
print("Elemen terakhir:", data[-1])
# Mengakses elemen kedua dari belakang (indeks -2)
print("Elemen kedua dari belakang:", data[-2])
# Mengakses elemen ketiga dari belakang (indeks -3)
print("Elemen ketiga dari belakang:", data[-3])
# Mengakses elemen pertama dari belakang (indeks -4)
print("Elemen pertama dari belakang:", data[-4])`;

  const contohSlicing = `angka = [10, 20, 30, 40, 50]
print("Indeks 1 sampai 3:", angka[1:4])`;

  // Highlight mapping
  const highlightPositif = () => ({
    indices: [0, 1, 2, 3],
    explanations: [
      "📌 Perintah `data[0]` → mengambil elemen indeks 0, yaitu 'apel'.",
      "📌 Perintah `data[1]` → mengambil elemen indeks 1, yaitu 100.",
      "📌 Perintah `data[2]` → mengambil elemen indeks 2, yaitu True.",
      "📌 Perintah `data[3]` → mengambil elemen indeks 3, yaitu 3.14."
    ]
  });

  const highlightNegatif = () => ({
    indices: [3, 2, 1, 0],
    explanations: [
      "🔹 `data[-1]` → indeks -1 sama dengan indeks positif 3, yaitu 3.14.",
      "🔹 `data[-2]` → indeks -2 sama dengan indeks positif 2, yaitu True.",
      "🔹 `data[-3]` → indeks -3 sama dengan indeks positif 1, yaitu 100.",
      "🔹 `data[-4]` → indeks -4 sama dengan indeks positif 0, yaitu 'apel'."
    ]
  });

  const highlightSlicing = () => ({
    indices: [1, 2, 3],
    explanations: [
      "✂️ Slicing `angka[1:4]` → mulai dari indeks 1 (nilai 20), berhenti SEBELUM indeks 4 (nilai 50 tidak termasuk).",
      "✂️ Mengambil elemen indeks 2 (nilai 30).",
      "✂️ Mengambil elemen indeks 3 (nilai 40). Hasil slicing adalah list baru [20,30,40]."
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
            {/* <p style={styles.headerSubtitle}>Belajar Membuat dan Mengakses Data dalam List</p> */}
          </div>

          {/* TUJUAN PEMBELAJARAN */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🎯 Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>Mahasiswa mampu membuat list dalam Python.</li>
                <li>Mahasiswa mampu mengambil elemen list menggunakan indeks positif, negatif, dan slicing.</li>
              </ol>
              {/* <p style={{ ...styles.text, fontSize: "14px", marginTop: "10px", fontStyle: "italic" }}>
                🎯 <strong>Kaitan dengan CPMK:</strong> Materi ini mendukung CPMK 1 dan 4 (kemampuan menuliskan kode Python untuk menyelesaikan masalah data sederhana).
              </p> */}
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
                    List dapat berisi berbagai tipe data (integer, string, boolean, float, dll) dalam satu list.
                    List bersifat <strong>mutable</strong> (dapat diubah setelah dibuat) dan <strong>ordered</strong> (mempertahankan urutan elemen sesuai saat dibuat).
                  </p>
                  <div style={styles.codeEditorContainer}>
                    <div style={styles.codeEditorHeader}>
                      <span style={styles.codeEditorTitle}>Contoh Kode Program</span>
                    </div>
                    <div style={styles.codeInputReadOnly}>
                      <pre style={styles.codePre}>{contohMembuatList}</pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* AKSES ELEMEN (INDEKS POSITIF) */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🔍 Akses Elemen (Indeks Positif)</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Indeks dimulai dari <strong>0</strong> untuk elemen pertama. Contoh di bawah menggunakan list dengan tipe data campuran.
                  </p>
                  <CodeEditorWithVisual
                    code={contohAksesPositif}
                    title="Contoh Kode Program"
                    visualData={campuranData}
                    visualTitle="Visualisasi List 'data'"
                    highlightMapping={highlightPositif}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    hideNegative={true}
                  />
                </div>
              </section>

              {/* AKSES ELEMEN (INDEKS NEGATIF) */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🔍 Akses Elemen (Indeks Negatif)</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Python juga mendukung indeks negatif untuk mengakses elemen dari belakang. 
                    Indeks <strong>-1</strong> untuk elemen terakhir, <strong>-2</strong> untuk kedua terakhir, dst.
                  </p>
                  <CodeEditorWithVisual
                    code={contohAksesNegatif}
                    title="Contoh Kode Program"
                    visualData={campuranData}
                    visualTitle="Visualisasi List 'data'"
                    highlightMapping={highlightNegatif}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    hidePositive={true}
                  />
                </div>
              </section>

              {/* SLICING LIST */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>✂️ Slicing List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    <strong>Slicing</strong> adalah teknik untuk mengambil sebagian elemen dari list. 
                    Format penulisannya adalah <code>list[awal:akhir]</code>, di mana:
                  </p>
                  <ul style={styles.list}>
                    <li><code>awal</code> adalah indeks mulai (termasuk).</li>
                    <li><code>akhir</code> adalah indeks berhenti (tidak termasuk).</li>
                    <li>Jika <code>awal</code> dikosongkan, berarti mulai dari indeks 0.</li>
                    <li>Jika <code>akhir</code> dikosongkan, berarti sampai akhir list.</li>
                  </ul>
                  <p style={styles.text}>
                    Contoh: <code>list[:3]</code> mengambil 3 elemen pertama (indeks 0,1,2).<br />
                    <code>list[2:]</code> mengambil elemen dari indeks 2 sampai akhir.<br />
                    <code>list[1:4]</code> mengambil elemen indeks 1,2,3.
                  </p>
                  <CodeEditorWithVisual
                    code={contohSlicing}
                    title="Contoh Kode Program"
                    visualData={angkaData}
                    visualTitle="Visualisasi List 'angka'"
                    highlightMapping={highlightSlicing}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>

              {/* MENGAPA PERLU LIST - dengan keunggulan yang sudah diperbaiki */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>📚 Mengapa Perlu List?</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Tanpa list, kita harus membuat banyak variabel terpisah yang tidak efisien.
                  </p>
                  <div style={styles.highlightBox}>
                    <pre style={styles.code}>{`# Tidak efisien dengan variabel terpisah
nilai1 = 85
nilai2 = 90
nilai3 = 78
# ... sulit diolah`}</pre>
                  </div>
                  <p style={styles.text}>
                    Dengan list, data menjadi terstruktur, mudah diakses dengan perulangan, dan ringkas.
                  </p>
                  <div style={styles.infoBox}>
                    <strong>Keunggulan List:</strong> Menghemat jumlah variabel dan dapat ditambah, dihapus, atau diubah elemennya.
                  </div>
                  <p style={styles.text}>
                    Materi selanjutnya akan membahas lebih detail tentang pembuatan, akses, operasi, dan manipulasi list.
                  </p>
                </div>
              </section>

              {/* AYO PRAKTIK */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>💻 Ayo Praktik!</h2>
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
                    title="Ayo Praktik"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>

              {/* LATIHAN INTERAKTIF */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🧩 Latihan</h2>
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