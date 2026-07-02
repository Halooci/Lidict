import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { db } from "../../../config/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

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
    minHeight: "calc(100vh - 64px)",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
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
  },
  headerTitle: { margin: 0, textAlign: "center", fontSize: "28px", fontWeight: "700" },
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
  list: { 
    paddingLeft: "20px", 
    lineHeight: "1.8",
    textAlign: "justify" 
  },
  text: { 
    lineHeight: "1.8", 
    color: "#333", 
    marginBottom: "15px",
    textAlign: "justify" 
  },
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
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ddd",
  },
  questionText: { 
    fontWeight: "500", 
    marginBottom: "10px",
    textAlign: "justify" 
  },
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
  strukturContainer: {
    margin: "20px 0",
    padding: "15px",
    backgroundColor: "#f0f4f8",
    borderRadius: "12px",
  },
  strukturTitle: { marginBottom: "15px", color: "#306998" },
  strukturPetunjuk: { marginBottom: "10px", fontSize: "14px", fontStyle: "italic" },
  strukturKode: { display: "flex", justifyContent: "center", marginBottom: "20px" },
  strukturPre: {
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
  },
  strukturInfo: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#fff3cd",
    borderLeft: "5px solid #FFD43B",
    borderRadius: "8px",
  },
  strukturPenjelasan: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#e8f1ff",
    borderLeft: "4px solid #306998",
    borderRadius: "8px",
    fontSize: "14px",
    lineHeight: "1.8",
    color: "#1f2937",
  },
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
  modalText: { 
    fontSize: "16px", 
    color: "#334155", 
    lineHeight: "1.5", 
    marginBottom: "24px",
    textAlign: "justify" 
  },
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

// ================= KOMPONEN VISUALISASI NESTED LIST (TANPA LABEL BARIS/KOLOM) =================
const visStyles = {
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "15px",
    margin: "15px 0",
    border: "1px solid #dee2e6",
  },
  title: { fontSize: "16px", fontWeight: "bold", marginBottom: "15px", color: "#306998", textAlign: "center" },
  table: { borderCollapse: "collapse", margin: "0 auto" },
  cell: { 
    padding: "12px 20px", 
    textAlign: "center", 
    border: "1px solid #ccc", 
    transition: "all 0.3s ease", 
    cursor: "pointer",
    minWidth: "50px",
  },
  hoverExplanationBox: {
    backgroundColor: "#fff3cd",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "10px",
    fontSize: "14px",
    color: "#856404",
    borderLeft: "4px solid #ffc107",
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

const NestedListVisualization = ({ data, title, highlightSequence = [], processExplanations = [] }) => {
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [explanationText, setExplanationText] = useState("");
  const [hoveredCell, setHoveredCell] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentHighlight(null);
    setExplanationText("");
    if (!highlightSequence || highlightSequence.length === 0) return;

    let step = 0;
    intervalRef.current = setInterval(() => {
      if (step < highlightSequence.length) {
        setCurrentHighlight(highlightSequence[step]);
        if (processExplanations && processExplanations[step]) {
          setExplanationText(processExplanations[step]);
        }
        step++;
      } else {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          setCurrentHighlight(null);
          setExplanationText("");
        }, 500);
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [highlightSequence, processExplanations]);

  const getBgColor = (row, col) => {
    const key = `${row},${col}`;
    if (currentHighlight === key) return "#FFD43B";
    if (hoveredCell === key) return "#FFA500";
    if (row % 2 === 0) return "#306998";
    return "#2c5282";
  };

  const getTextColor = (row, col) => {
    const key = `${row},${col}`;
    if (currentHighlight === key || hoveredCell === key) return "#1f2937";
    return "white";
  };

  const displayData = data && data.length > 0 ? data : [[1, 2, 3], [4, 5, 6]];

  return (
    <div style={visStyles.container}>
      <p style={visStyles.title}>{title}</p>
      <table style={visStyles.table}>
        <tbody>
          {displayData.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((value, colIdx) => (
                <td
                  key={colIdx}
                  style={{
                    ...visStyles.cell,
                    backgroundColor: getBgColor(rowIdx, colIdx),
                    color: getTextColor(rowIdx, colIdx),
                  }}
                  onMouseEnter={() => setHoveredCell(`${rowIdx},${colIdx}`)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {hoveredCell && (() => {
        const [r, c] = hoveredCell.split(",");
        return (
          <div style={visStyles.hoverExplanationBox}>
            <strong>data[{r}][{c}]</strong> → {displayData[parseInt(r)][parseInt(c)]}
            <br /> Indeks baris = {r}, indeks kolom = {c}
          </div>
        );
      })()}
      {explanationText && (
        <div style={visStyles.explanationBox}>
          <strong>Proses animasi:</strong> {explanationText}
        </div>
      )}
      <div style={visStyles.note}>
        <strong>Petunjuk:</strong> Arahkan kursor ke sel untuk melihat indeks dan nilai.
      </div>
    </div>
  );
};

// ================= CODE EDITOR UNTUK CONTOH KODE PROGRAM =================
const CodeEditorWithVisual = ({ code, title, visualData, visualTitle, highlightSequenceMapping, pyodideReady, runPythonCode, lineExplanations }) => {
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

    if (highlightSequenceMapping) {
      const { cells, explanations } = highlightSequenceMapping();
      setHighlightSequence(cells);
      setExplanationSteps(explanations);
      setTimeout(() => {
        setHighlightSequence([]);
        setExplanationSteps([]);
      }, cells.length * 3000 + 500);
    }
  }, [pyodideReady, code, runPythonCode, highlightSequenceMapping]);

  const renderLineExplanations = () => {
    if (!lineExplanations || lineExplanations.length === 0) return null;
    const lines = code.split("\n");
    const maxLen = Math.max(lines.length, lineExplanations.length);
    const explanations = [];
    for (let i = 0; i < maxLen; i++) {
      explanations.push(lineExplanations[i] || "");
    }
    return (
      <div>
        {lines.map((line, idx) => {
          const explanation = explanations[idx] || "";
          if (!explanation.trim() && line.trim() === "") return null;
          const lineNumber = idx + 1;
          return (
            <div key={idx} style={styles.explanationLine}>
              <span style={styles.explanationLineNumber}>{lineNumber}:</span>
              <code style={styles.explanationCode}>{line || "(baris kosong)"}</code>
              <span style={styles.explanationArrow}> → </span>
              <span style={styles.explanationText}>{explanation || "(Penjelasan tersedia setelah menjalankan kode)"}</span>
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

      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output}</pre>
      </div>

      <div style={styles.visualHeader}>Visualisasi</div>
      <div style={styles.visualArea}>
        {showVisual && visualData ? (
          <NestedListVisualization
            data={visualData}
            title={visualTitle}
            highlightSequence={highlightSequence}
            processExplanations={explanationSteps}
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

// ================= KOMPONEN PRAKTIK (CODE EDITOR EDITABLE) =================
const CodeEditorEditable = ({ pyodideReady, runPythonCode, onValidation }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleChange = useCallback((value) => {
    setLocalCode(value);
    if (onValidation) onValidation({ isValid: false, isComplete: false });
  }, [onValidation]);

  const hasNonCommentLine = (code, pattern) => {
    const lines = code.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('#')) continue;
      if (pattern.test(trimmed)) return true;
    }
    return false;
  };

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setOutput("");
    setIsRunning(true);

    let executionOutput = "";
    try {
      const result = await runPythonCode(localCode);
      executionOutput = result;
      if (result.startsWith("Error:")) {
        setOutput(result);
        if (onValidation) onValidation({ isValid: false, isComplete: false });
        setIsRunning(false);
        return;
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
      if (onValidation) onValidation({ isValid: false, isComplete: false });
      setIsRunning(false);
      return;
    }

    const listPattern = /matriks\s*=\s*\[\s*\[\s*3\s*,\s*6\s*,\s*9\s*\]\s*,\s*\[\s*12\s*,\s*15\s*,\s*18\s*\]\s*\]/;
    const printFirstPattern = /print\s*\(\s*matriks\s*\[\s*0\s*\]\s*\[\s*0\s*\]\s*\)/;
    const printLastPattern = /print\s*\(\s*matriks\s*\[\s*1\s*\]\s*\[\s*2\s*\]\s*\)/;

    const hasList = hasNonCommentLine(localCode, listPattern);
    const hasPrintFirst = hasNonCommentLine(localCode, printFirstPattern);
    const hasPrintLast = hasNonCommentLine(localCode, printLastPattern);

    const isComplete = hasList && hasPrintFirst && hasPrintLast;

    setOutput(executionOutput);
    setIsRunning(false);

    if (onValidation) {
      onValidation({ isValid: isComplete, isComplete: isComplete });
    }
  }, [localCode, pyodideReady, runPythonCode, onValidation]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>Ayo Praktik</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady || isRunning}>
          {isRunning ? "Menjalankan..." : pyodideReady ? "Jalankan" : "Memuat..."}
        </button>
      </div>

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
          placeholder="Tulis kode Python Anda di sini..."
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

// ================= SOAL LATIHAN =================
const normalizeAnswer = (str) => str.trim().replace(/'/g, '"').replace(/\s+/g, ' ');

const CodeCompletionQuestion = ({ question, codeParts, placeholders, expectedAnswers, index, onCorrectChange }) => {
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
      if (normalizeAnswer(answers[i]) !== normalizeAnswer(expectedAnswers[i])) {
        allCorrect = false;
        break;
      }
    }
    setChecked(true);
    if (allCorrect) {
      setFeedback("Benar!");
      setIsCorrect(true);
      if (onCorrectChange) onCorrectChange(index, true);
    } else {
      setFeedback("Salah. Coba lagi!");
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
      <pre style={styles.codeTemplateInline}>{renderCodeWithInputs()}</pre>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button style={styles.checkButton} onClick={handleCheck} disabled={checked && isCorrect}>
          Periksa
        </button>
        {showReset && <button style={styles.resetButtonPerSoal} onClick={resetQuestion}>Reset Jawaban</button>}
      </div>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

const GuessOutputQuestion = ({ question, codeSnippet, expectedOutput, index, onCorrectChange }) => {
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
    const correct = normalizeAnswer(userAnswer) === normalizeAnswer(expectedOutput);
    setChecked(true);
    if (correct) {
      setFeedback("Benar!");
      setIsCorrect(true);
      if (onCorrectChange) onCorrectChange(index, true);
    } else {
      setFeedback("Salah. Coba lagi!");
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
        {showReset && <button style={styles.resetButtonPerSoal} onClick={resetQuestion}>Reset Jawaban</button>}
      </div>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

// ================= EKSPLORASI =================
const Eksplorasi = ({ topicName, onComplete }) => {
  const EKSPLORASI_ANSWERS_KEY = `eksplorasi_${topicName}_answers`;

  const questions = [
    {
      text: "Nested list yang benar untuk merepresentasikan tabel 2 baris 3 kolom adalah ....",
      options: ["[[1,2,3],[4,5,6]]", "[1,2,3,4,5,6]", "[[1,2],[3,4],[5,6]]", "[(1,2,3),(4,5,6)]", "{1:2,3:4,5:6}"],
      correct: 0,
    },
    {
      text: "Cara mengakses elemen baris ke 2 kolom ke 3 dari nested list 'data = [[1,2,3],[4,5,6]]' adalah ....",
      options: ["data[2][3]", "data[1][2]", "data[2][2]", "data[1][1]", "data[2][1]"],
      correct: 1,
    },
  ];

  const [selected, setSelected] = useState(() => {
    try {
      const saved = localStorage.getItem(EKSPLORASI_ANSWERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === questions.length) {
          return parsed;
        }
      }
    } catch (e) {}
    return Array(questions.length).fill(null);
  });

  const feedback = selected.map((sel, i) => {
    if (sel === null) return "";
    return sel === questions[i].correct ? "Benar" : "Salah";
  });

  useEffect(() => {
    localStorage.setItem(EKSPLORASI_ANSWERS_KEY, JSON.stringify(selected));
    const allAnswered = selected.every(s => s !== null);
    if (allAnswered) {
      onComplete();
    }
  }, [selected, EKSPLORASI_ANSWERS_KEY, onComplete]);

  const handleAnswer = (qIdx, optIdx) => {
    if (selected[qIdx] !== null) return;
    setSelected(prev => {
      const newSel = [...prev];
      newSel[qIdx] = optIdx;
      return newSel;
    });
  };

  return (
    <div>
      <h2 style={styles.sectionTitle}>Eksplorasi Awal</h2>
      <div style={styles.card}>
        <p style={styles.text}>
          Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia. 
          Eksplorasi awal ini bertujuan untuk mengukur pemahaman awal Anda terhadap materi yang akan dipelajari.
          Maka dari itu, <strong>jawaban</strong> Anda <strong>tidak harus benar</strong>, jawab sesuai pemahaman Anda. 
          <strong> Materi akan terbuka setelah kedua pertanyaan dijawab.</strong>
          {selected.every(s => s !== null) && " (Anda sudah menyelesaikan eksplorasi ini sebelumnya.)"}
        </p>
        {questions.map((q, idx) => {
          const isAnswered = selected[idx] !== null;
          const selectedIdx = selected[idx];
          return (
            <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
              <p style={{ fontWeight: "600", marginBottom: "12px", textAlign: "justify" }}>{idx + 1}. {q.text}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {q.options.map((opt, optIdx) => {
                  let optionStyle = {};
                  if (isAnswered) {
                    optionStyle = styles.eksplorasiOptionDisabled;
                    if (selectedIdx === optIdx) {
                      const isCorrect = selectedIdx === q.correct;
                      optionStyle = { ...optionStyle, backgroundColor: isCorrect ? "#d4edda" : "#f8d7da", borderColor: isCorrect ? "#28a745" : "#dc3545", color: isCorrect ? "#155724" : "#842029" };
                    }
                  } else {
                    optionStyle = styles.eksplorasiOption;
                  }
                  return (
                    <div key={optIdx} onClick={() => !isAnswered && handleAnswer(idx, optIdx)} style={optionStyle}>
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </div>
                  );
                })}
              </div>
              {feedback[idx] && <div style={feedback[idx] === "Benar" ? styles.feedbackCorrect : styles.feedbackWrong}>{feedback[idx]}</div>}
            </div>
          );
        })}
        {!selected.every(s => s !== null) && <div style={styles.infoMessage}>Jawab kedua pertanyaan di atas untuk membuka materi pembelajaran.</div>}
      </div>
    </div>
  );
};

// ================= STRUKTUR INTERAKTIF (DIPERBAIKI: INFORMASI HANYA BARIS/KOLOM, TIDAK MENYEBUT CARA AKSES) =================
const StrukturInteraktif = () => {
  const [activeKey, setActiveKey] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [hoveredText, setHoveredText] = useState("");
  const data = [[85, 90, 78], [88, 92, 80]];

  // Informasi hanya menyebutkan baris, kolom, dan nilai, tanpa menyebut cara mengakses
  const getInfoText = (row, col) => {
    if (row === null && col === null) {
      return `Tabel ini memiliki 2 baris dan 3 kolom.`;
    } else if (col === null) {
      return `Baris ${row + 1} berisi nilai: ${data[row].join(", ")}`;
    } else {
      return `Baris ${row + 1}, Kolom ${col + 1} → ${data[row][col]}`;
    }
  };

  const handleClick = (row, col) => {
    let key;
    if (row === null && col === null) {
      key = 'all';
      setSelectedElement({ text: getInfoText(null, null) });
    } else if (col === null) {
      key = `row-${row}`;
      setSelectedElement({ text: getInfoText(row, null) });
    } else {
      key = `cell-${row}-${col}`;
      setSelectedElement({ text: getInfoText(row, col) });
    }
    setActiveKey(key);
  };

  const handleHover = (row, col) => {
    if (col === null) {
      setHoveredKey(`row-${row}`);
      setHoveredText(getInfoText(row, null));
    } else {
      setHoveredKey(`cell-${row}-${col}`);
      setHoveredText(getInfoText(row, col));
    }
  };

  const handleLeave = () => {
    setHoveredKey(null);
    setHoveredText("");
  };

  const isActive = (key) => activeKey === key;

  const getCellStyle = (rowIdx, colIdx) => {
    const key = `cell-${rowIdx}-${colIdx}`;
    const base = {
      padding: "12px 20px",
      border: "1px solid #ccc",
      textAlign: "center",
      cursor: "pointer",
      transition: "background 0.2s, border 0.2s, transform 0.1s",
    };
    if (isActive(key)) {
      return {
        ...base,
        backgroundColor: "#FFD43B",
        border: "2px solid #306998",
        fontWeight: "bold",
        transform: "scale(1.02)",
      };
    }
    if (hoveredKey === key) {
      return {
        ...base,
        backgroundColor: "#FFE082",
        border: "2px solid #FFA000",
      };
    }
    return {
      ...base,
      backgroundColor: rowIdx % 2 === 0 ? "#f8f9fa" : "#e9ecef",
    };
  };

  const getRowLabelStyle = (rowIdx) => {
    const key = `row-${rowIdx}`;
    const base = {
      fontWeight: "bold",
      padding: "10px 15px",
      border: "1px solid #ccc",
      cursor: "pointer",
      transition: "background 0.2s, border 0.2s",
    };
    if (isActive(key)) {
      return {
        ...base,
        backgroundColor: "#FFD43B",
        border: "2px solid #306998",
      };
    }
    if (hoveredKey === key) {
      return {
        ...base,
        backgroundColor: "#FFE082",
        border: "2px solid #FFA000",
      };
    }
    return { ...base, backgroundColor: "#e9ecef" };
  };

  const infoDisplay = hoveredText || (selectedElement ? selectedElement.text : "Arahkan kursor atau klik pada elemen tabel.");

  return (
    <div style={styles.strukturContainer}>
      <h4 style={styles.strukturTitle}>Visualisasi Struktur Nested List</h4>
      <p style={styles.strukturPetunjuk}>💡 Arahkan kursor untuk info sementara, klik untuk menandai dan melihat detail.</p>
      <div style={styles.strukturKode}>
        <pre style={styles.strukturPre}>nilai_siswa = [[85, 90, 78], [88, 92, 80]]</pre>
      </div>
      <table style={{ borderCollapse: "collapse", margin: "0 auto", backgroundColor: "white", border: "2px solid #306998", borderRadius: "8px", overflow: "hidden" }}>
        <thead>
          <tr style={{ backgroundColor: "#306998", color: "white" }}>
            <th style={{ padding: "10px 15px", border: "1px solid #306998" }}></th>
            <th style={{ padding: "10px 15px", border: "1px solid #306998" }}>Kolom 0</th>
            <th style={{ padding: "10px 15px", border: "1px solid #306998" }}>Kolom 1</th>
            <th style={{ padding: "10px 15px", border: "1px solid #306998" }}>Kolom 2</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <td
                style={getRowLabelStyle(rowIdx)}
                onMouseEnter={() => handleHover(rowIdx, null)}
                onMouseLeave={handleLeave}
                onClick={() => handleClick(rowIdx, null)}
              >
                Baris {rowIdx + 1}
              </td>
              {row.map((val, colIdx) => (
                <td
                  key={colIdx}
                  style={getCellStyle(rowIdx, colIdx)}
                  onMouseEnter={() => handleHover(rowIdx, colIdx)}
                  onMouseLeave={handleLeave}
                  onClick={() => handleClick(rowIdx, colIdx)}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.strukturInfo}>{infoDisplay}</div>
      
      {/* Penjelasan setelah tabel */}
      <div style={styles.strukturPenjelasan}>
        <strong>Penjelasan:</strong> Tabel di atas merepresentasikan nested list <code>nilai_siswa</code> yang memiliki 
        2 baris dan 3 kolom. Setiap baris adalah sebuah list, dan setiap kolom adalah elemen di dalam list tersebut. 
        Misalnya, baris pertama (indeks 0) berisi nilai [85, 90, 78] dan baris kedua (indeks 1) berisi [88, 92, 80]. 
        Dengan memahami struktur ini, kita dapat mengakses setiap elemen menggunakan indeks baris dan kolom.
      </div>
    </div>
  );
};

// ================= KOMPONEN UTAMA =================
export default function PembuatanAksesNestedList() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progresBelajar, setProgresBelajar] = useState(null);

  const TOPIC_NAME = "pembuatan_akses_nested_list";
  const BONUS_DONE_KEY = `${TOPIC_NAME}_bonus_done`;

  // Cek autentikasi user
  useEffect(() => {
    const uid = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!uid || !userEmail) {
      navigate('/loginregister');
    } else {
      setUserId(uid);
    }
  }, [navigate]);

  // Fetch progres_belajar dari Firestore
  useEffect(() => {
    if (!userId) return;

    const fetchProgres = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "mahasiswa", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const progres = data.progres_belajar || 0;
          setProgresBelajar(progres);

          // 🔒 Halaman hanya bisa diakses jika progres >= 6
          if (progres < 6) {
            navigate('/dashboard');
            return;
          }
          // Jika progres >= 6, boleh akses halaman
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Gagal mengambil progres:", error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProgres();
  }, [userId, navigate]);

  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [correctStatus, setCorrectStatus] = useState([false, false, false, false, false]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [praktikMessage, setPraktikMessage] = useState("");
  const [praktikMessageType, setPraktikMessageType] = useState("");

  // Tampilkan modal hanya jika:
  // 1. progresBelajar < 7 (belum mencapai level 7)
  // 2. semua latihan benar
  // 3. belum menampilkan modal
  useEffect(() => {
    if (!userId) return;
    if (progresBelajar === null) return;
    if (progresBelajar >= 7) {
      // Jika progres >= 7, tidak perlu tampilkan modal
      setShowModal(false);
      return;
    }
    const allCorrect = correctStatus.every(v => v === true);
    if (allCorrect && !showModal) {
      // Jika progres < 7 dan semua latihan benar, tampilkan modal
      setShowModal(true);
    }
  }, [correctStatus, userId, showModal, progresBelajar]);

  const handleCompleteAndNavigate = async () => {
    try {
      // Tambah progres hanya jika masih < 7
      if (progresBelajar < 7) {
        const mahasiswaRef = doc(db, "mahasiswa", userId);
        await updateDoc(mahasiswaRef, {
          progres_belajar: increment(1)
        });
        // Update state lokal
        setProgresBelajar(progresBelajar + 1);
      }
      
      // Tandai bonus sudah diberikan
      localStorage.setItem(BONUS_DONE_KEY, "true");
      setShowModal(false);
      navigate("/NestedList/OperasiNestedList");
    } catch (error) {
      console.error("Gagal update progres:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleCorrectChange = (index, isCorrect) => setCorrectStatus(prev => { const newStatus = [...prev]; newStatus[index] = isCorrect; return newStatus; });

  const nestedListData = [[1, 2, 3], [4, 5, 6]];
  const raggedData = [[1, 2], [3, 4, 5], [6]];

  const contohMembuatNested = `# Membuat nested list 2 baris 3 kolom
matriks = [[1, 2, 3],
           [4, 5, 6]]
print("Matriks:")
print(matriks)`;
  const lineExplanationsMembuat = [
    "Komentar: Memberi tahu bahwa kita akan membuat nested list 2 baris 3 kolom.",
    "Membuat variabel 'matriks' - baris pertama [1,2,3] (indeks 0).",
    "Melanjutkan baris kedua [4,5,6] (indeks 1).",
    'Mencetak string "Matriks:" ke layar.',
    "Mencetak seluruh isi nested list matriks ([[1,2,3],[4,5,6]])."
  ];

  const contohAksesElemen = `# Mengakses elemen nested list
matriks = [[1, 2, 3],
           [4, 5, 6]]
print("Elemen baris 1 kolom 1:", matriks[0][0])
print("Elemen baris 2 kolom 3:", matriks[1][2])`;
  const lineExplanationsAkses = [
    "Komentar: Akan mengakses elemen dari nested list.",
    "Membuat nested list matriks dengan baris pertama [1,2,3] (indeks 0).",
    "Baris kedua [4,5,6] (indeks 1).",
    'Mencetak "Elemen baris 1 kolom 1:" diikuti nilai matriks[0][0] yaitu 1.',
    'Mencetak "Elemen baris 2 kolom 3:" diikuti nilai matriks[1][2] yaitu 6.'
  ];
  
  const highlightAksesSequence = () => ({
    cells: ["0,0", "1,2"],
    explanations: [
      "Perintah `matriks[0][0]` mengambil elemen baris indeks 0, kolom indeks 0 → nilai 1.",
      "Perintah `matriks[1][2]` mengambil elemen baris indeks 1, kolom indeks 2 → nilai 6."
    ]
  });

  const contohRagged = `# Nested list dengan panjang baris berbeda
data = [[1, 2],
        [3, 4, 5],
        [6]]
print(data)`;
  const lineExplanationsRagged = [
    "Komentar: Membuat nested list dengan panjang baris berbeda.",
    "Membuat variabel 'data' - baris pertama [1,2].",
    "Baris kedua [3,4,5].",
    "Baris ketiga [6].",
    "Mencetak seluruh isi nested list variabel data",
  ];

  const soal1CodeParts = ["data = [[10,20,30],[40,50,60]]\nprint(data[", "][", "])"];
  const soal1Placeholders = ["", ""];
  const soal1Expected = ["0", "1"];
  const soal2CodeParts = ["matriks = [[1,2], ", "]\nprint(matriks)"];
  const soal2Placeholders = [""];
  const soal2Expected = ["[3,4]"];
  const soal3CodeParts = ["data = [[10,20],[30,40],[50,60]]\nprint(data[", "][", "])"];
  const soal3Placeholders = ["", ""];
  const soal3Expected = ["2", "1"];
  const soal4Code = `nilai = [[5,7],[9,11]]
print(nilai[1][0])`;
  const soal5Code = `a = [[2,4],[6,8]]
b = a[0][1]
print(b)`;

  const handlePraktikValidation = ({ isValid, isComplete }) => {
    if (isComplete) {
      setPraktikMessage("✅ Selamat! Semua instruksi sudah dikerjakan dengan benar.");
      setPraktikMessageType("success");
    } else {
      setPraktikMessage("⚠️ Periksa kembali instruksi!");
      setPraktikMessageType("warning");
    }
  };

  useEffect(() => {
    const loadPyodide = async () => {
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.async = true;
        script.onload = async () => { const pyodide = await window.loadPyodide(); pyodideRef.current = pyodide; setPyodideReady(true); };
        document.body.appendChild(script);
      } else { const pyodide = await window.loadPyodide(); pyodideRef.current = pyodide; setPyodideReady(true); }
    };
    loadPyodide();
  }, []);

  const runPythonCode = useCallback(async (code) => {
    if (!pyodideRef.current) return "Pyodide sedang dimuat...";
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
    } catch (error) { return `Error: ${error.message}`; }
  }, []);

  const handleEksplorasiComplete = () => setIsEksplorasiCompleted(true);

  // Tampilkan loading saat sedang mengambil data
  if (loading) {
    return (
      <>
        <Navbar />
        <SidebarMateri />
        <div className="main-content" style={{ paddingTop: "64px", textAlign: "center", padding: "40px" }}>
          <h2>Memuat data...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <SidebarMateri />
      <div className="main-content" style={{ paddingTop: "64px" }}>
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PEMBUATAN DAN AKSES ELEMEN NESTED LIST</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>Mahasiswa mampu membuat nested list sesuai kebutuhan representasi data.</li>
                <li>Mahasiswa mampu mengakses elemen nested list menggunakan indeks baris dan kolom.</li>
              </ol>
            </div>
          </section>

          <section style={styles.section}>
            <Eksplorasi topicName={TOPIC_NAME} onComplete={handleEksplorasiComplete} />
          </section>

          {isEksplorasiCompleted && (
            <>
              {/* Bagian Membuat Nested List */}
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#306998" }}>Membuat Nested List</h3>
                  <p style={styles.text}>
                    Setiap baris ditulis sebagai list terpisah, dipisahkan dengan koma, dan seluruhnya diapit tanda kurung siku. 
                    Nested list juga bisa dengan panjang baris berbeda, misalnya{" "}
                    <code>data = [[1,2], [3,4,5], [6]]</code>.
                  </p>
                  <p style={styles.text}>
                    Perhatikan penamaan variabel: gunakan nama yang deskriptif, misal <code>nilai_siswa</code>, <code>matriks</code>, atau{" "}
                    <code>data_penjualan</code>.
                  </p>
                  <CodeEditorWithVisual
                    code={contohMembuatNested}
                    title="Contoh Kode Program"
                    visualData={nestedListData}
                    visualTitle="Visualisasi Nested List 'matriks'"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplanationsMembuat}
                  />
                  <CodeEditorWithVisual
                    code={contohRagged}
                    title="Contoh Kode Program (Ragged Array)"
                    visualData={raggedData}
                    visualTitle="Visualisasi Nested List dengan Panjang Baris Berbeda"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplanationsRagged}
                  />
                </div>
              </section>

              {/* Bagian Struktur Nested List (dipindahkan ke sini) */}
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#306998" }}>Struktur Nested List</h3>
                  <p style={styles.text}>Nested list dapat dipandang sebagai tabel/matriks. Indeks pertama = baris, kedua = kolom.</p>
                  <StrukturInteraktif />
                </div>
              </section>

              {/* Bagian Mengakses Elemen */}
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#306998" }}>Mengakses Elemen</h3>
                  <p style={styles.text}>
                    Untuk mengambil nilai dari nested list, Anda perlu menggunakan <strong>dua indeks</strong> (baris dan kolom).
                    Indeks pertama menunjukkan nomor baris, indeks kedua menunjukkan nomor kolom. Ingatlah bahwa indeks dalam Python
                    selalu dimulai dari <strong>0</strong>. Jadi baris pertama adalah indeks 0, kolom pertama juga indeks 0.
                  </p>
                  <p style={styles.text}>
                    Misalkan <code>matriks = [[1, 2, 3], [4, 5, 6]]</code>:
                    <ul style={styles.list}>
                      <li><code>matriks[0][0]</code> → mengakses baris 1, kolom 1 → menghasilkan <strong>1</strong>.</li>
                      <li><code>matriks[1][2]</code> → mengakses baris 2, kolom 3 → menghasilkan <strong>6</strong>.</li>
                    </ul>
                    Cara ini analog dengan koordinat (baris, kolom). Anda juga bisa mengakses seluruh baris dengan satu indeks, misal{" "}
                    <code>matriks[0]</code> akan mengembalikan list <code>[1,2,3]</code>.
                  </p>
                  
                  <CodeEditorWithVisual
                    code={contohAksesElemen}
                    title="Contoh Kode Program"
                    visualData={nestedListData}
                    visualTitle="Visualisasi Nested List 'matriks'"
                    highlightSequenceMapping={highlightAksesSequence}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplanationsAkses}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ayo Praktik!</h2>
                <div style={styles.card}>
                  <div style={styles.infoBox}>
                    <strong>Studi Kasus: Matriks Sederhana</strong>
                    <p style={{ textAlign: "justify" }}>Buatlah program Python yang:</p>
                    <ol style={styles.list}>
                      <li>Membuat nested list bernama matriks dengan isi 3,6,9 dan 12,15,18.</li>
                      <li>Menampilkan elemen <strong>3</strong> (baris 1 kolom 1).</li>
                      <li>Menampilkan elemen <strong>18</strong> (baris 2 kolom 3).</li>
                    </ol>
                  </div>

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
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    onValidation={handlePraktikValidation}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Isilah bagian yang kosong pada kode dan tentukan output. 
                  </p>

                  <CodeCompletionQuestion
                    question="1. Lengkapi kode untuk mencetak angka 20 dari nested list data:"
                    codeParts={soal1CodeParts}
                    placeholders={soal1Placeholders}
                    expectedAnswers={soal1Expected}
                    index={0}
                    onCorrectChange={handleCorrectChange}
                  />

                  <CodeCompletionQuestion
                    question="2. Lengkapi baris kedua nested list agar menjadi 1,2 dan 3,4:"
                    codeParts={soal2CodeParts}
                    placeholders={soal2Placeholders}
                    expectedAnswers={soal2Expected}
                    index={1}
                    onCorrectChange={handleCorrectChange}
                  />

                  <CodeCompletionQuestion
                    question="3. Lengkapi kode untuk mencetak angka 60 dari nested list data:"
                    codeParts={soal3CodeParts}
                    placeholders={soal3Placeholders}
                    expectedAnswers={soal3Expected}
                    index={2}
                    onCorrectChange={handleCorrectChange}
                  />

                  <GuessOutputQuestion
                    question="4. Output dari kode berikut adalah ...."
                    codeSnippet={soal4Code}
                    expectedOutput="9"
                    index={3}
                    onCorrectChange={handleCorrectChange}
                  />

                  <GuessOutputQuestion
                    question="5. Output dari kode berikut adalah ...."
                    codeSnippet={soal5Code}
                    expectedOutput="4"
                    index={4}
                    onCorrectChange={handleCorrectChange}
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      {/* Modal - HANYA MUNCUL JIKA PROGRES < 7 */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>🎉</div>
            <h2 style={styles.modalTitle}>Selamat!</h2>
            <p style={styles.modalText}>
              Anda telah menyelesaikan semua latihan dengan sempurna.<br />
              Progres belajar Anda bertambah! Materi selanjutnya akan terbuka.
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