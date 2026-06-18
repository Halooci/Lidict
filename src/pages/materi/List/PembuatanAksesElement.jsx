import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { db } from "../../../config/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

// ---------- IMPOR CODEMIRROR ----------
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { lineNumbers } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
// ---------------------------------------

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
  // Gaya untuk area CodeMirror
  codeMirrorWrapper: {
    backgroundColor: "#272822",
    padding: "0",
  },
  codeMirrorEditableWrapper: {
    backgroundColor: "#272822",
    padding: "0",
    borderBottom: "1px solid #333",
  },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
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
  explanationHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    fontWeight: "600",
  },
  explanationContent: {
    backgroundColor: "#1e1e1e",
    padding: "15px",
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#f8f8f2",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    borderTop: "1px solid #333",
  },
  explanationLine: {
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #333",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  explanationLineNumber: {
    fontWeight: "bold",
    color: "#61afef",
    marginRight: "8px",
  },
  explanationCode: {
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    backgroundColor: "#2d2d2d",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "13px",
    color: "#e5c07b",
  },
  explanationArrow: {
    margin: "0 6px",
    color: "#abb2bf",
  },
  explanationText: {
    color: "#abb2bf",
  },
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
  finalSuccessBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
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
  infoMessage: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#cfe2ff",
    borderLeft: "5px solid #0d6efd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#084298",
  },
  errorBox: {
    backgroundColor: "#ff4444",
    color: "white",
    padding: "12px 15px",
    fontSize: "14px",
    fontWeight: "500",
    borderBottom: "2px solid #cc0000",
  },
  successBox: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "12px 15px",
    fontSize: "14px",
    fontWeight: "500",
    borderBottom: "2px solid #1e7e34",
  },
  // Gaya untuk CodeMirror edit (akan di-override oleh CodeMirror sendiri)
  // tidak perlu textarea lagi
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
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  modal: {
    background: "white",
    borderRadius: "32px",
    padding: "32px",
    maxWidth: "450px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
    animation: "fadeInUp 0.3s ease",
  },
  modalIcon: { fontSize: "64px", marginBottom: "16px" },
  modalTitle: { fontSize: "28px", fontWeight: "700", color: "#1e3a5f", marginBottom: "12px" },
  modalText: { fontSize: "16px", color: "#334155", lineHeight: "1.5", marginBottom: "24px" },
  modalButton: {
    background: "linear-gradient(135deg, #3182ce, #2c5282)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  praktikMessageContainer: {
    margin: "15px 0 10px 0",
    padding: "10px 15px",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    borderLeft: "4px solid",
  },
  warningMessage: {
    color: "#856404",
    borderLeftColor: "#ffc107",
    backgroundColor: "#fff3cd",
  },
  successMessage: {
    color: "#0f5132",
    borderLeftColor: "#28a745",
    backgroundColor: "#d1e7dd",
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
    let msg = `Elemen: "${item}"`;
    if (!hidePositive) msg += `\nIndeks positif: ${idx} -> data[${idx}]`;
    if (!hideNegative) msg += `\nIndeks negatif: ${negativeIndices[idx]} -> data[${negativeIndices[idx]}]`;
    if (!hidePositive && !hideNegative) msg += `\nTip: Indeks negatif dihitung dari akhir list.`;
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
            {!hidePositive && <div style={visStyles.indexLabel}>Indeks {idx}</div>}
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
          <strong>Proses animasi:</strong> {explanationText}
        </div>
      )}
      {!disableHover && (
        <div style={visStyles.note}>
          <strong>Petunjuk:</strong> Arahkan kursor ke kotak untuk melihat detail indeks.
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

// ================= KOMPONEN CODE EDITOR DENGAN VISUAL (READ-ONLY) =================
const CodeEditorWithVisual = ({ code, title, visualData, visualTitle, highlightMapping, pyodideReady, runPythonCode, hidePositive = false, hideNegative = false, disableHover = false, lineExplanations }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const [highlightSequence, setHighlightSequence] = useState([]);
  const [explanationSteps, setExplanationSteps] = useState([]);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat...");
      return;
    }
    setIsRunning(true);
    setShowVisual(false);
    setShowExplanations(false);
    const result = await runPythonCode(code);
    setOutput(result);
    setIsRunning(false);
    setShowVisual(true);
    setShowExplanations(true);

    if (highlightMapping) {
      const { indices, explanations } = highlightMapping();
      const totalSteps = indices.length * 3000 + 500;
      setHighlightSequence(indices.map((i) => ({ index: i })));
      setExplanationSteps(explanations);
      setTimeout(() => {
        setHighlightSequence([]);
        setExplanationSteps([]);
      }, totalSteps);
    }
  }, [pyodideReady, code, runPythonCode, highlightMapping]);

  const renderLineExplanations = () => {
    if (!lineExplanations || lineExplanations.length === 0) return null;
    const lines = code.split("\n");
    const explanations = lineExplanations;
    return (
      <div>
        {lines.map((line, idx) => {
          const explanation = explanations[idx] || "";
          if (!explanation.trim() && !line.trim()) return null;
          const lineNumber = idx + 1;
          return (
            <div key={idx} style={styles.explanationLine}>
              <span style={styles.explanationLineNumber}>{lineNumber}:</span>
              <code style={styles.explanationCode}>{line}</code>
              <span style={styles.explanationArrow}> → </span>
              <span style={styles.explanationText}>{explanation}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady || isRunning}>
          {isRunning ? "Menjalankan..." : pyodideReady ? "Jalankan" : "Memuat..."}
        </button>
      </div>

      {/* CodeMirror read-only */}
      <div style={styles.codeMirrorWrapper}>
        <CodeMirror
          value={code}
          height="auto"
          theme="dark"
          extensions={[
            python(),
            lineNumbers(),
            EditorView.editable.of(false),
          ]}
          style={{ fontSize: '14px' }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: false,
            indentOnInput: false,
          }}
        />
      </div>

      {/* Output */}
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || ""}</pre>
      </div>

      {/* Visualisasi */}
      <div style={styles.visualHeader}>Visualisasi</div>
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

      {showExplanations && lineExplanations && lineExplanations.length > 0 && (
        <>
          <div style={styles.explanationHeader}>
            <span style={styles.outputTitle}>Penjelasan Kode Program</span>
          </div>
          <div style={styles.explanationContent}>
            {renderLineExplanations()}
          </div>
        </>
      )}
    </div>
  );
};

// ================= KOMPONEN EDITOR UNTUK AYO PRAKTIK (EDITABLE) =================
const CodeEditorEditable = ({ title, pyodideReady, runPythonCode, onValidation }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleChange = useCallback((value) => {
    setLocalCode(value);
    if (onValidation) onValidation({ isValid: false, isComplete: false });
  }, [onValidation]);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setOutput("");
    setIsRunning(true);

    let executionOutput = "";
    let hasError = false;
    try {
      const result = await runPythonCode(localCode);
      executionOutput = result;
      if (result.startsWith("Error:")) {
        hasError = true;
        setOutput(result);
        if (onValidation) onValidation({ isValid: false, isComplete: false });
        setIsRunning(false);
        return;
      }
    } catch (err) {
      hasError = true;
      setOutput(`Error: ${err.message}`);
      if (onValidation) onValidation({ isValid: false, isComplete: false });
      setIsRunning(false);
      return;
    }

    const code = localCode;
    const varRegex = /belanja\s*=\s*\[\s*['"]apel['"]\s*,\s*['"]jeruk['"]\s*,\s*['"]mangga['"]\s*\]/;
    const hasCorrectList = varRegex.test(code);
    const printFirstRegex = /print\s*\(\s*belanja\s*\[\s*0\s*\]\s*\)/;
    const hasPrintFirst = printFirstRegex.test(code);
    const printLastRegex = /print\s*\(\s*belanja\s*\[\s*-\s*1\s*\]\s*\)/;
    const hasPrintLast = printLastRegex.test(code);

    const isComplete = hasCorrectList && hasPrintFirst && hasPrintLast;
    const isValid = hasCorrectList && hasPrintFirst && hasPrintLast;

    setOutput(executionOutput);
    setIsRunning(false);

    if (onValidation) {
      onValidation({ isValid: isValid, isComplete: isComplete });
    }
  }, [localCode, pyodideReady, runPythonCode, onValidation]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady || isRunning}>
          {isRunning ? "Menjalankan..." : pyodideReady ? "Jalankan" : "Memuat..."}
        </button>
      </div>

      {/* CodeMirror editable */}
      <div style={styles.codeMirrorEditableWrapper}>
        <CodeMirror
          value={localCode}
          height="auto"
          theme="dark"
          extensions={[
            python(),
            lineNumbers(),
            EditorView.editable.of(true),
          ]}
          onChange={handleChange}
          style={{ fontSize: '14px' }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            indentOnInput: true,
            tabSize: 4,
          }}
          placeholder="Tulis kode Python di sini..."
        />
      </div>

      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output}</pre>
      </div>
    </div>
  );
};

// ================= KOMPONEN SOAL MELENGKAPI KODE =================
const CodeCompletionQuestion = ({ question, codeParts, placeholders, expectedAnswers, explanation, index, onCorrectChange }) => {
  const [answers, setAnswers] = useState(placeholders.map(() => ""));
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const resetQuestion = () => {
    setAnswers(placeholders.map(() => ""));
    setFeedback("");
    setChecked(false);
    if (isCorrect) {
      setIsCorrect(false);
      if (onCorrectChange) onCorrectChange(index, false);
    }
  };

  const handleAnswerChange = (idx, value) => {
    if (checked && isCorrect) return;
    if (checked) {
      setChecked(false);
      setFeedback("");
    }
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  const handleCheck = () => {
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
      setFeedback(`✓ Benar – ${explanation}`);
      setIsCorrect(true);
      if (onCorrectChange) onCorrectChange(index, true);
    } else {
      setFeedback("✗ Salah. Coba lagi!");
      setIsCorrect(false);
      if (onCorrectChange) onCorrectChange(index, false);
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
        const isLocked = (checked && isCorrect);
        result.push(
          <input
            key={`input-${i}`}
            type="text"
            size={getInputSize(answers[i], placeholders[i])}
            style={styles.inlineInput}
            value={answers[i]}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            disabled={isLocked}
            placeholder={placeholders[i] || "..."}
          />
        );
      }
    }
    return result;
  };

  const showReset = checked && feedback && !isCorrect;

  return (
    <div style={styles.questionCard}>
      <p style={styles.questionText}>{question}</p>
      <pre style={styles.codeTemplateInline}>
        {renderCodeWithInputs()}
      </pre>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button style={styles.checkButton} onClick={handleCheck} disabled={checked && isCorrect}>
          Periksa
        </button>
        {showReset && (
          <button style={styles.resetButtonPerSoal} onClick={resetQuestion}>
            Reset Jawaban
          </button>
        )}
      </div>
      {feedback && <div style={feedback.includes("✓") ? styles.feedbackCorrect : styles.feedbackWrong}>{feedback}</div>}
    </div>
  );
};

// ================= KOMPONEN SOAL MENENTUKAN OUTPUT =================
const GuessOutputQuestion = ({ question, codeSnippet, expectedOutput, explanation, index, onCorrectChange }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const resetQuestion = () => {
    setUserAnswer("");
    setFeedback("");
    setChecked(false);
    if (isCorrect) {
      setIsCorrect(false);
      if (onCorrectChange) onCorrectChange(index, false);
    }
  };

  const handleCheck = () => {
    const correct = userAnswer.trim() === expectedOutput;
    setChecked(true);
    if (correct) {
      setFeedback(`✓ Benar – ${explanation}`);
      setIsCorrect(true);
      if (onCorrectChange) onCorrectChange(index, true);
    } else {
      setFeedback("✗ Salah. Coba lagi!");
      setIsCorrect(false);
      if (onCorrectChange) onCorrectChange(index, false);
    }
  };

  const showReset = checked && feedback && !isCorrect;

  return (
    <div style={styles.questionCard}>
      <p style={styles.questionText}>{question}</p>
      <pre style={styles.codeTemplate}>{codeSnippet}</pre>
      <input
        type="text"
        style={styles.fillInput}
        value={userAnswer}
        onChange={(e) => {
          if (checked && isCorrect) return;
          if (checked) {
            setChecked(false);
            setFeedback("");
          }
          setUserAnswer(e.target.value);
        }}
        placeholder="Ketik output yang dihasilkan..."
        disabled={checked && isCorrect}
      />
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button style={styles.checkButton} onClick={handleCheck} disabled={checked && isCorrect}>
          Periksa
        </button>
        {showReset && (
          <button style={styles.resetButtonPerSoal} onClick={resetQuestion}>
            Reset Jawaban
          </button>
        )}
      </div>
      {feedback && <div style={feedback.includes("✓") ? styles.feedbackCorrect : styles.feedbackWrong}>{feedback}</div>}
    </div>
  );
};

// ================= KOMPONEN UTAMA =================
export default function PembuatanAksesElement() {
  const navigate = useNavigate();

  // ─────────── KONFIGURASI HALAMAN ───────────
  const TOPIC_NAME = "pembuatan_akses_element";
  const EKSPLORASI_ANSWERS_KEY = `eksplorasi_${TOPIC_NAME}_answers`;
  const BONUS_DONE_KEY = `${TOPIC_NAME}_bonus_done`;
  // ──────────────────────────────────────────

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) {
      navigate('/loginregister');
    }
  }, [navigate]);

  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [correctStatus, setCorrectStatus] = useState([false, false, false, false, false]);

  const [showModal, setShowModal] = useState(false);
  const [bonusGiven, setBonusGiven] = useState(false);
  const userId = localStorage.getItem('userId');

  const [praktikMessage, setPraktikMessage] = useState("");
  const [praktikMessageType, setPraktikMessageType] = useState("");

  useEffect(() => {
    const already = localStorage.getItem(BONUS_DONE_KEY);
    if (already === "true") setBonusGiven(true);
  }, [BONUS_DONE_KEY]);

  const eksplorasiQuestions = [
    {
      text: "Yang digunakan untuk mengakses elemen pertama dalam list adalah ....",
      options: [
        "Indeks 0",
        "Indeks 1",
        "Indeks -1",
        "Indeks length-1",
        "Indeks pertama adalah 1"
      ],
      correct: 0,
    },
    {
      text: "Cara yang benar untuk membuat list berisi angka 5, 10, 15 adalah ....",
      options: [
        "angka = (5, 10, 15)",
        "angka = {5, 10, 15}",
        "angka = [5, 10, 15]",
        "angka = <5, 10, 15>",
        "angka = list(5, 10, 15)"
      ],
      correct: 2,
    },
  ];

  // State eksplorasi diinisialisasi dari localStorage
  const [eksplorasiSelected, setEksplorasiSelected] = useState(() => {
    try {
      const saved = localStorage.getItem(EKSPLORASI_ANSWERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === eksplorasiQuestions.length) {
          return parsed;
        }
      }
    } catch (e) {
      // fallback
    }
    return Array(eksplorasiQuestions.length).fill(null);
  });

  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(() => {
    return eksplorasiSelected.map((selectedIdx, i) => {
      if (selectedIdx === null) return "";
      return selectedIdx === eksplorasiQuestions[i].correct ? "Benar" : "Salah";
    });
  });

  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(
    () => eksplorasiSelected.every(sel => sel !== null)
  );

  // Sinkronisasi: setiap kali eksplorasiSelected berubah, simpan ke localStorage
  useEffect(() => {
    const newFeedback = eksplorasiSelected.map((sel, i) => {
      if (sel === null) return "";
      return sel === eksplorasiQuestions[i].correct ? "Benar" : "Salah";
    });
    setEksplorasiFeedback(newFeedback);
    const allAnswered = eksplorasiSelected.every(sel => sel !== null);
    setIsEksplorasiCompleted(allAnswered);
    localStorage.setItem(EKSPLORASI_ANSWERS_KEY, JSON.stringify(eksplorasiSelected));
  }, [eksplorasiSelected, EKSPLORASI_ANSWERS_KEY]);

  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    if (eksplorasiSelected[questionIdx] !== null) return;
    setEksplorasiSelected(prev => {
      const newSelected = [...prev];
      newSelected[questionIdx] = optionIdx;
      return newSelected;
    });
  };

  const campuranData = ["apel", 100, true, 3.14];
  const angkaData = [10, 20, 30, 40, 50];

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

  const highlightPositif = () => ({
    indices: [0, 1, 2, 3],
    explanations: [
      "Perintah `data[0]` -> mengambil elemen indeks 0, yaitu 'apel'.",
      "Perintah `data[1]` -> mengambil elemen indeks 1, yaitu 100.",
      "Perintah `data[2]` -> mengambil elemen indeks 2, yaitu True.",
      "Perintah `data[3]` -> mengambil elemen indeks 3, yaitu 3.14."
    ]
  });

  const highlightNegatif = () => ({
    indices: [3, 2, 1, 0],
    explanations: [
      "`data[-1]` -> indeks -1 sama dengan indeks positif 3, yaitu 3.14.",
      "`data[-2]` -> indeks -2 sama dengan indeks positif 2, yaitu True.",
      "`data[-3]` -> indeks -3 sama dengan indeks positif 1, yaitu 100.",
      "`data[-4]` -> indeks -4 sama dengan indeks positif 0, yaitu 'apel'."
    ]
  });

  const highlightSlicing = () => ({
    indices: [1, 2, 3],
    explanations: [
      "Slicing `angka[1:4]` -> mulai dari indeks 1 (nilai 20), berhenti SEBELUM indeks 4 (nilai 50 tidak termasuk).",
      "Mengambil elemen indeks 2 (nilai 30).",
      "Mengambil elemen indeks 3 (nilai 40). Hasil slicing adalah list baru [20,30,40]."
    ]
  });

  const lineExplanationsPositif = [
    "Komentar: Memberi tahu bahwa list ini berisi tipe data campuran.",
    "Membuat list bernama 'data' dengan elemen: string 'apel', integer 100, boolean True, float 3.14.",
    "",
    "Komentar: Akan mengakses elemen pertama (indeks 0).",
    "Mencetak string 'Elemen pertama:' diikuti nilai dari data[0] yaitu 'apel'.",
    "Komentar: Akan mengakses elemen kedua (indeks 1).",
    "Mencetak 'Elemen kedua:' dan data[1] yaitu 100.",
    "Komentar: Akan mengakses elemen ketiga (indeks 2).",
    "Mencetak 'Elemen ketiga:' dan data[2] yaitu True.",
    "Komentar: Akan mengakses elemen keempat (indeks 3).",
    "Mencetak 'Elemen keempat:' dan data[3] yaitu 3.14."
  ];

  const lineExplanationsNegatif = [
    "Komentar: List dengan tipe data campuran.",
    "Membuat list 'data' dengan 4 elemen.",
    "",
    "Komentar: Akan mengakses elemen terakhir menggunakan indeks -1.",
    "Mencetak 'Elemen terakhir:' dan data[-1] (indeks -1 sama dengan indeks 3) yaitu 3.14.",
    "Komentar: Akan mengakses elemen kedua dari belakang (indeks -2).",
    "Mencetak 'Elemen kedua dari belakang:' dan data[-2] (indeks -2 = indeks 2) yaitu True.",
    "Komentar: Akan mengakses elemen ketiga dari belakang (indeks -3).",
    "Mencetak 'Elemen ketiga dari belakang:' dan data[-3] (indeks -3 = indeks 1) yaitu 100.",
    "Komentar: Akan mengakses elemen pertama dari belakang (indeks -4).",
    "Mencetak 'Elemen pertama dari belakang:' dan data[-4] (indeks -4 = indeks 0) yaitu 'apel'."
  ];

  const lineExplanationsSlicing = [
    "Membuat list 'angka' berisi 5 bilangan: 10, 20, 30, 40, 50.",
    "Melakukan slicing dari indeks 1 sampai sebelum indeks 4, sehingga mengambil elemen indeks 1 (20), indeks 2 (30), indeks 3 (40). Hasilnya dicetak."
  ];

  const soal1CodeParts = ["buah = [\"apel\", \"jeruk\", \"mangga\"]\nprint(buah[", "])"];
  const soal1Placeholders = [""];
  const soal1Expected = ["1"];
  const soal1Explanation = "Indeks dalam Python dimulai dari 0. 'jeruk' adalah elemen kedua, maka indeksnya adalah 1.";

  const soal2CodeParts = ["nilai = [10, 20, 30, 40]\nprint(nilai[", "])"];
  const soal2Placeholders = [""];
  const soal2Expected = ["2"];
  const soal2Explanation = "List nilai = [10,20,30,40]. Angka 30 berada pada indeks ke-2 (karena indeks 0=10, 1=20, 2=30).";

  const soal3CodeParts = ["data = [5, 10, 15, 20]\nprint(data[", "])"];
  const soal3Placeholders = [""];
  const soal3Expected = ["-2"];
  const soal3Explanation = "Indeks negatif -1 adalah elemen terakhir (20), -2 adalah elemen kedua dari terakhir (15).";

  const soal4Code = `buah = ["apel", "jeruk", "mangga"]
print(buah[1])`;
  const soal4Explanation = "List buah berisi 'apel' (indeks 0), 'jeruk' (indeks 1), 'mangga' (indeks 2). Perintah print(buah[1]) mencetak 'jeruk'.";

  const soal5Code = `angka = [100, 200, 300]
print(angka[-2])`;
  const soal5Explanation = "Indeks -1 adalah elemen terakhir (300), -2 adalah elemen kedua dari belakang yaitu 200.";

  const handleCorrectChange = (index, isCorrect) => {
    setCorrectStatus(prev => {
      const newStatus = [...prev];
      newStatus[index] = isCorrect;
      return newStatus;
    });
  };

  const allCorrect = correctStatus.every(v => v === true);

  useEffect(() => {
    if (allCorrect && !bonusGiven && userId) {
      setShowModal(true);
    }
  }, [allCorrect, bonusGiven, userId]);

  const handleCompleteAndNavigate = async () => {
    try {
      const mahasiswaRef = doc(db, "mahasiswa", userId);
      await updateDoc(mahasiswaRef, {
        progres_belajar: increment(1)
      });
      localStorage.setItem(BONUS_DONE_KEY, "true");
      setShowModal(false);
      navigate("/List/OperasiDanManipulasi");
    } catch (error) {
      console.error("Gagal update progres:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

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
    if (!pyodideRef.current) return "Pyodide sedang dimuat...";
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
      return output || "";
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }, []);

  const handlePraktikValidation = ({ isValid, isComplete }) => {
    if (isComplete) {
      setPraktikMessage("✅ Selamat! Semua instruksi sudah dikerjakan dengan benar.");
      setPraktikMessageType("success");
    } else {
      setPraktikMessage("⚠️ Periksa kembali instruksi!");
      setPraktikMessageType("warning");
    }
  };

  return (
    <>
      <Navbar />
      <SidebarMateri />
      <div className="main-content" style={{ paddingTop: "64px" }}>
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PEMBUATAN DAN AKSES ELEMEN LIST</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>Mahasiswa mampu membuat list dalam Python.</li>
                <li>Mahasiswa mampu mengambil elemen list menggunakan indeks positif, negatif, dan slicing.</li>
              </ol>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Eksplorasi Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum belajar lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
                <strong style={{ color: "#0d6efd" }}> Materi akan terbuka setelah kedua pertanyaan dijawab.</strong>
                {isEksplorasiCompleted && " (Anda sudah menyelesaikan eksplorasi ini sebelumnya.)"}
              </p>
              {eksplorasiQuestions.map((q, idx) => {
                const isAnswered = eksplorasiSelected[idx] !== null;
                const selectedIdx = eksplorasiSelected[idx];
                return (
                  <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
                    <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {q.options.map((opt, optIdx) => {
                        let optionStyle = {};
                        if (isAnswered) {
                          optionStyle = styles.eksplorasiOptionDisabled;
                          if (selectedIdx === optIdx) {
                            const isCorrect = selectedIdx === q.correct;
                            optionStyle = {
                              ...optionStyle,
                              backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
                              borderColor: isCorrect ? "#28a745" : "#dc3545",
                              color: isCorrect ? "#155724" : "#842029",
                            };
                          }
                        } else {
                          optionStyle = styles.eksplorasiOption;
                        }
                        return (
                          <div
                            key={optIdx}
                            onClick={() => !isAnswered && handleEksplorasiSelect(idx, optIdx)}
                            style={optionStyle}
                          >
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </div>
                        );
                      })}
                    </div>
                    {eksplorasiFeedback[idx] && (
                      <div style={eksplorasiFeedback[idx] === "Benar" ? styles.feedbackCorrect : styles.feedbackWrong}>
                        {eksplorasiFeedback[idx]}
                      </div>
                    )}
                  </div>
                );
              })}
              {!isEksplorasiCompleted && (
                <div style={styles.infoMessage}>
                  Jawab kedua pertanyaan di atas untuk membuka materi pembelajaran.
                </div>
              )}
            </div>
          </section>

          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Membuat List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    List dibuat dengan tanda kurung siku <code>[]</code> dan setiap elemennya dipisahkan dengan koma. 
                    List dapat berisi berbagai tipe data (integer, string, boolean, float, dll) dalam satu list.
                    List bersifat <strong>mutable</strong> (dapat diubah setelah dibuat) dan <strong>ordered</strong> (mempertahankan urutan elemen sesuai saat dibuat).
                  </p>
                  <div style={styles.codeEditorContainer}>
                    <div style={styles.codeEditorHeader}>
                      <span style={styles.codeEditorTitle}>Contoh Kode Program</span>
                    </div>
                    <div style={styles.codeMirrorWrapper}>
                      <CodeMirror
                        value={contohMembuatList}
                        height="auto"
                        theme="dark"
                        extensions={[
                          python(),
                          lineNumbers(),
                          EditorView.editable.of(false),
                        ]}
                        style={{ fontSize: '14px' }}
                        basicSetup={{
                          lineNumbers: true,
                          foldGutter: false,
                          highlightActiveLine: false,
                          indentOnInput: false,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Akses Elemen dengan Indeks Positif</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Indeks dimulai dari <strong>0</strong> untuk elemen pertama. Setiap elemen dapat diakses dengan menuliskan nama_list[indeks].
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
                    lineExplanations={lineExplanationsPositif}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Akses Elemen dengan Indeks Negatif</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Indeks negatif untuk mengakses elemen dari belakang. 
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
                    lineExplanations={lineExplanationsNegatif}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Slicing List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    <strong>Slicing</strong> adalah teknik untuk mengambil sebagian elemen dari list. 
                    Format penulisannya adalah list[awal:akhir], di mana:
                  </p>
                  <ul style={styles.list}>
                    <li>awal adalah indeks mulai (termasuk).</li>
                    <li>akhir adalah indeks berhenti (tidak termasuk).</li>
                    <li>Jika awal dikosongkan, berarti mulai dari indeks 0.</li>
                    <li>Jika akhir dikosongkan, berarti sampai akhir list.</li>
                  </ul>
                  <p style={styles.text}>
                    Contoh: list[:3] mengambil 3 elemen pertama (indeks 0,1,2).<br />
                    list[2:] mengambil elemen dari indeks 2 sampai akhir.<br />
                    list[1:4] mengambil elemen indeks 1,2,3.
                  </p>
                  <CodeEditorWithVisual
                    code={contohSlicing}
                    title="Contoh Kode Program"
                    visualData={angkaData}
                    visualTitle="Visualisasi List 'angka'"
                    highlightMapping={highlightSlicing}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplanationsSlicing}
                  />
                </div>
              </section>

              {/* <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Mengapa Perlu List?</h2>
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
                </div>
              </section> */}

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ayo Praktik!</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    <strong>Studi Kasus: Daftar Belanja</strong><br />
                    Buatlah program Python yang:
                  </p>
                  <ol style={styles.list}>
                    <li>Membuat list bernama belanja dengan isi apel, jeruk, mangga.</li>
                    <li>Menampilkan elemen pertama yaitu apel menggunakan indeks positif.</li>
                    <li>Menampilkan elemen terakhir yaitu mangga menggunakan indeks negatif.</li>
                  </ol>
                  <p style={styles.text}>
                    Tulis kode Anda di area editor di bawah. Klik Jalankan untuk menjalankan.
                  </p>

                  {praktikMessage && (
                    <div
                      style={{
                        ...styles.praktikMessageContainer,
                        ...(praktikMessageType === "warning" ? styles.warningMessage : styles.successMessage),
                      }}
                    >
                      {praktikMessage}
                    </div>
                  )}

                  <CodeEditorEditable
                    title="Ayo Praktik"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    onValidation={handlePraktikValidation}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <p style={styles.text}>Isilah bagian yang kosong pada kode di bawah ini dengan mengetikkan jawaban pada kotak yang tersedia.</p>

                  <CodeCompletionQuestion
                    question="1. Lengkapi kode untuk mencetak 'jeruk' (gunakan indeks positif) dari list berikut:"
                    codeParts={soal1CodeParts}
                    placeholders={soal1Placeholders}
                    expectedAnswers={soal1Expected}
                    explanation={soal1Explanation}
                    index={0}
                    onCorrectChange={handleCorrectChange}
                  />

                  <CodeCompletionQuestion
                    question="2. Lengkapi kode untuk mencetak angka 30 (gunakan indeks positif) dari list nilai:"
                    codeParts={soal2CodeParts}
                    placeholders={soal2Placeholders}
                    expectedAnswers={soal2Expected}
                    explanation={soal2Explanation}
                    index={1}
                    onCorrectChange={handleCorrectChange}
                  />

                  <CodeCompletionQuestion
                    question="3. Lengkapi kode (gunakan indeks negatif) untuk mencetak 15 dari list data:"
                    codeParts={soal3CodeParts}
                    placeholders={soal3Placeholders}
                    expectedAnswers={soal3Expected}
                    explanation={soal3Explanation}
                    index={2}
                    onCorrectChange={handleCorrectChange}
                  />

                  <GuessOutputQuestion
                    question="4. Output dari kode berikut adalah ...."
                    codeSnippet={soal4Code}
                    expectedOutput="jeruk"
                    explanation={soal4Explanation}
                    index={3}
                    onCorrectChange={handleCorrectChange}
                  />

                  <GuessOutputQuestion
                    question="5. Jika kita menjalankan kode berikut, maka yang akan tercetak adalah ...."
                    codeSnippet={soal5Code}
                    expectedOutput="200"
                    explanation={soal5Explanation}
                    index={4}
                    onCorrectChange={handleCorrectChange}
                  />

                  {allCorrect && (
                    <div style={styles.finalSuccessBox}>
                      Selamat! Semua jawaban sudah dijawab dengan benar.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      {/* Modal Sukses */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>🎉</div>
            <h2 style={styles.modalTitle}>Selamat!</h2>
            <p style={styles.modalText}>
              Kamu sudah menyelesaikan materi Pembuatan dan Akses Elemen List.<br />
              Materi selanjutnya sudah terbuka.
            </p>
            <button style={styles.modalButton} onClick={handleCompleteAndNavigate}>
              Lanjut ke materi selanjutnya
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modalButton:hover {
          transform: scale(1.02);
          box-shadow: 0 5px 15px rgba(49,130,206,0.3);
        }
      `}</style>
    </>
  );
}