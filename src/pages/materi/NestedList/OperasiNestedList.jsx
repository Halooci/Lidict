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
  text: { 
    lineHeight: "1.8", 
    color: "#333", 
    marginBottom: "15px",
    textAlign: "justify" 
  },
  alertBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "15px",
    color: "#856404",
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
    fontFamily: "monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5",
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
    fontFamily: "monospace",
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
  promptBox: { padding: "15px", textAlign: "center", color: "#666" },
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
  resetButtonInline: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  feedback: { marginTop: "8px", fontSize: "14px", fontStyle: "italic", color: "#333" },
  bubbleContainer: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
  },
  dragBubble: {
    display: "inline-block",
    padding: "6px 12px",
    margin: "4px",
    backgroundColor: "#306998",
    color: "white",
    borderRadius: "20px",
    cursor: "grab",
    fontSize: "14px",
    userSelect: "none",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
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

// ================= KOMPONEN VISUALISASI NESTED LIST =================
const NestedListVisualization = ({ data, title, highlightCell = null, processExplanation = "", highlightSequence = [], processExplanations = [] }) => {
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [explanationText, setExplanationText] = useState("");
  const [hoveredCell, setHoveredCell] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentHighlight(null);
    setExplanationText("");

    if (!highlightSequence || highlightSequence.length === 0) {
      if (highlightCell) setCurrentHighlight(highlightCell);
      if (processExplanation) setExplanationText(processExplanation);
      return;
    }

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
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [highlightSequence, processExplanations, highlightCell, processExplanation]);

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

  const displayData = data || [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

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
  cell: { padding: "12px 16px", textAlign: "center", border: "1px solid #ccc", transition: "all 0.3s ease", cursor: "pointer", minWidth: "60px" },
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

// ================= KOMPONEN PERBANDINGAN DUA NESTED LIST =================
const ComparisonVisualization = ({ beforeData, afterData, beforeTitle, afterTitle, beforeHighlight = null, afterHighlight = null, beforeSequence = [], afterSequence = [], beforeExplanations = [], afterExplanations = [] }) => {
  return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: "250px" }}>
        <NestedListVisualization
          data={beforeData}
          title={beforeTitle}
          highlightSequence={beforeSequence}
          processExplanations={beforeExplanations}
          highlightCell={beforeHighlight}
        />
      </div>
      <div style={{ flex: 1, minWidth: "250px" }}>
        <NestedListVisualization
          data={afterData}
          title={afterTitle}
          highlightSequence={afterSequence}
          processExplanations={afterExplanations}
          highlightCell={afterHighlight}
        />
      </div>
    </div>
  );
};

// ================= CODE EDITOR DENGAN VISUALISASI PERBANDINGAN =================
const CodeEditorWithVisual = ({ code, title, visualData, visualTitle, pyodideReady, runPythonCode, lineExplanations, beforeData, afterData, beforeTitle, afterTitle, highlightSequence, processExplanations }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [useComparison, setUseComparison] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat...");
      setShowDetail(true);
      return;
    }
    setIsRunning(true);
    setShowDetail(false);
    const result = await runPythonCode(code);
    setOutput(result);
    setIsRunning(false);
    setShowDetail(true);
    setUseComparison(!!(beforeData && afterData));
  }, [pyodideReady, code, runPythonCode, beforeData, afterData]);

  const renderLineExplanations = () => {
    if (!lineExplanations || lineExplanations.length === 0) return null;
    const lines = code.split("\n");
    const maxLen = Math.max(lines.length, lineExplanations.length);
    const explanations = [];
    for (let i = 0; i < maxLen; i++) explanations.push(lineExplanations[i] || "");
    return (
      <div style={styles.explanationContent}>
        {lines.map((line, idx) => {
          const explanation = explanations[idx] || "";
          if (!explanation.trim() && line.trim() === "") return null;
          return (
            <div key={idx} style={styles.explanationLine}>
              <span style={styles.explanationLineNumber}>{idx+1}:</span>
              <code style={styles.explanationCode}>{line || "(baris kosong)"}</code>
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
        {showDetail && (
          useComparison && beforeData && afterData ? (
            <ComparisonVisualization
              beforeData={beforeData}
              afterData={afterData}
              beforeTitle={beforeTitle || "Sebelum"}
              afterTitle={afterTitle || "Sesudah"}
              beforeSequence={highlightSequence && highlightSequence.before ? highlightSequence.before : []}
              afterSequence={highlightSequence && highlightSequence.after ? highlightSequence.after : []}
              beforeExplanations={processExplanations && processExplanations.before ? processExplanations.before : []}
              afterExplanations={processExplanations && processExplanations.after ? processExplanations.after : []}
            />
          ) : (
            <NestedListVisualization data={visualData} title={visualTitle} />
          )
        )}
        {!showDetail && <div style={styles.visualPlaceholder}>(Klik 'Jalankan' untuk melihat hasil)</div>}
      </div>

      {showDetail && lineExplanations && lineExplanations.length > 0 && (
        <>
          <div style={styles.explanationHeader}>
            <span style={styles.outputTitle}>Penjelasan Kode Program</span>
          </div>
          {renderLineExplanations()}
        </>
      )}
    </div>
  );
};

// ================= CODE EDITOR DENGAN TIGA VISUALISASI (UNTUK GABUNGAN) =================
const CodeEditorWithTripleVisual = ({ code, title, pyodideReady, runPythonCode, lineExplanations, dataA, dataB, dataResult, titleA, titleB, titleResult }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat...");
      setShowDetail(true);
      return;
    }
    setIsRunning(true);
    setShowDetail(false);
    const result = await runPythonCode(code);
    setOutput(result);
    setIsRunning(false);
    setShowDetail(true);
  }, [pyodideReady, code, runPythonCode]);

  const renderLineExplanations = () => {
    if (!lineExplanations || lineExplanations.length === 0) return null;
    const lines = code.split("\n");
    const maxLen = Math.max(lines.length, lineExplanations.length);
    const explanations = [];
    for (let i = 0; i < maxLen; i++) explanations.push(lineExplanations[i] || "");
    return (
      <div style={styles.explanationContent}>
        {lines.map((line, idx) => {
          const explanation = explanations[idx] || "";
          if (!explanation.trim() && line.trim() === "") return null;
          return (
            <div key={idx} style={styles.explanationLine}>
              <span style={styles.explanationLineNumber}>{idx+1}:</span>
              <code style={styles.explanationCode}>{line || "(baris kosong)"}</code>
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
        {showDetail && dataA && dataB && dataResult ? (
          <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <NestedListVisualization data={dataA} title={titleA || "List a"} />
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <NestedListVisualization data={dataB} title={titleB || "List b"} />
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <NestedListVisualization data={dataResult} title={titleResult || "Hasil penggabungan"} />
            </div>
          </div>
        ) : (
          <div style={styles.visualPlaceholder}>(Klik 'Jalankan' untuk melihat hasil)</div>
        )}
      </div>

      {showDetail && lineExplanations && lineExplanations.length > 0 && (
        <>
          <div style={styles.explanationHeader}>
            <span style={styles.outputTitle}>Penjelasan Kode Program</span>
          </div>
          {renderLineExplanations()}
        </>
      )}
    </div>
  );
};

// ================= KOMPONEN PRAKTIK (EDITOR) =================
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

    const listPattern = /data\s*=\s*\[\s*\[\s*1\s*,\s*2\s*,\s*3\s*\]\s*,\s*\[\s*4\s*,\s*5\s*,\s*6\s*\]\s*,\s*\[\s*7\s*,\s*8\s*,\s*9\s*\]\s*\]/;
    const changePattern = /data\s*\[\s*0\s*\]\s*\[\s*0\s*\]\s*=\s*100/;
    const printPattern = /print\s*\(\s*data\s*\[\s*2\s*\]\s*\[\s*1\s*\]\s*\)/;
    const printAllPattern = /print\s*\(\s*data\s*\)/;

    const hasList = hasNonCommentLine(localCode, listPattern);
    const hasChange = hasNonCommentLine(localCode, changePattern);
    const hasPrint = hasNonCommentLine(localCode, printPattern);
    const hasPrintAll = hasNonCommentLine(localCode, printAllPattern);

    const isComplete = hasList && hasChange && hasPrint && hasPrintAll;

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

const CodeCompletionQuestion = ({ question, codeParts, placeholders, expectedAnswers, onCheck }) => {
  const [answers, setAnswers] = useState(placeholders.map(() => ""));
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
    setChecked(false);
    setFeedback("");
    if (isCorrect) {
      setIsCorrect(false);
      if (onCheck) onCheck(false);
    }
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
      setFeedback("✅ Benar!");
      setIsCorrect(true);
      if (onCheck) onCheck(true);
    } else {
      setFeedback("❌ Jawaban salah. Coba lagi!");
      setIsCorrect(false);
      if (onCheck) onCheck(false);
    }
  };

  const handleReset = () => {
    setAnswers(placeholders.map(() => ""));
    setFeedback("");
    setChecked(false);
    setIsCorrect(false);
    if (onCheck) onCheck(false);
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
            size={8}
            style={styles.inlineInput}
            value={answers[i]}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            placeholder="..."
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
      <div>
        <button style={styles.checkButton} onClick={handleCheck}>Periksa</button>
        <button style={styles.resetButtonInline} onClick={handleReset}>Reset</button>
      </div>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

const DragDropCompletionQuestion = ({ question, codeTemplate, placeholders, options, expectedAnswers, onCheck }) => {
  const [answers, setAnswers] = useState(placeholders.map(() => ""));
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDragStart = (e, value) => {
    e.dataTransfer.setData("text/plain", value);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = useCallback((e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedValue = e.dataTransfer.getData("text/plain");
    if (droppedValue) {
      setAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[idx] = droppedValue;
        return newAnswers;
      });
      setChecked(false);
      setFeedback("");
      if (isCorrect) {
        setIsCorrect(false);
        if (onCheck) onCheck(false);
      }
    }
  }, [isCorrect, onCheck]);

  const handleResetSlot = useCallback((idx) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[idx] = "";
      return newAnswers;
    });
    setChecked(false);
    setFeedback("");
    if (isCorrect) {
      setIsCorrect(false);
      if (onCheck) onCheck(false);
    }
  }, [isCorrect, onCheck]);

  const handleResetAll = () => {
    setAnswers(placeholders.map(() => ""));
    setFeedback("");
    setChecked(false);
    setIsCorrect(false);
    if (onCheck) onCheck(false);
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
      setFeedback("✅ Benar! Semua placeholder terisi dengan benar.");
      setIsCorrect(true);
      if (onCheck) onCheck(true);
    } else {
      setFeedback("❌ Jawaban salah. Coba lagi!");
      setIsCorrect(false);
      if (onCheck) onCheck(false);
    }
  };

  const renderCodeWithDropZones = () => {
    const parts = codeTemplate.split(/(___)/g);
    let placeholderIndex = 0;
    return parts.map((part, idx) => {
      if (part === "___") {
        const currentAnswer = answers[placeholderIndex];
        const slotIndex = placeholderIndex;
        placeholderIndex++;
        return (
          <span key={`dropzone-${idx}`} style={{ display: "inline-block", margin: "0 4px" }}>
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slotIndex)}
              style={{
                display: "inline-block",
                minWidth: "100px",
                padding: "6px 12px",
                border: currentAnswer ? "2px solid #4caf50" : "2px dashed #ff9800",
                borderRadius: "8px",
                backgroundColor: currentAnswer ? "#fff9c4" : "#f0f0f0",
                textAlign: "center",
                cursor: "pointer",
                fontWeight: currentAnswer ? "bold" : "normal",
                color: "#000",
                boxShadow: currentAnswer ? "0 0 0 1px #4caf50" : "none",
              }}
            >
              {currentAnswer ? (
                <span>
                  <span style={{ fontSize: "15px", fontWeight: "bold", color: "#2c3e50" }}>{currentAnswer}</span>
                  <button
                    onClick={() => handleResetSlot(slotIndex)}
                    style={{
                      marginLeft: "10px",
                      background: "#e0e0e0",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                      color: "#d32f2f",
                      fontSize: "12px",
                      width: "20px",
                      height: "20px",
                      lineHeight: "1",
                      fontWeight: "bold",
                    }}
                    title="Hapus"
                  >
                    ✖
                  </button>
                </span>
              ) : (
                <span style={{ color: "#888", fontStyle: "italic" }}>...</span>
              )}
            </div>
          </span>
        );
      }
      return <span key={`text-${idx}`}>{part}</span>;
    });
  };

  return (
    <div style={styles.questionCard}>
      <p style={styles.questionText}>{question}</p>
      <pre style={styles.codeTemplateInline}>{renderCodeWithDropZones()}</pre>
      <div style={styles.bubbleContainer}>
        <p style={{ marginBottom: "8px", fontWeight: "500" }}>📦 Drag ke area kosong di atas:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {options.map((opt, idx) => (
            <div
              key={idx}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, opt)}
              style={styles.dragBubble}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
      <div>
        <button style={styles.checkButton} onClick={handleCheck}>Periksa</button>
        <button style={styles.resetButtonInline} onClick={handleResetAll}>Reset</button>
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
      text: "Untuk menambahkan baris baru (list) di akhir nested list, method yang tepat adalah ....",
      options: ["insert()", "append()", "pop()", "remove()", "extend()"],
      correct: 1,
    },
    {
      text: "Jika ingin menghapus baris dengan indeks 1 dari nested list `data`, perintah yang tepat adalah ....",
      options: ["data.remove(1)", "data.pop(1)", "data.del(1)", "delete data[1]", "data[1].pop()"],
      correct: 1,
    }
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
              <p style={{ fontWeight: "600", marginBottom: "12px", textAlign: "justify" }}>{idx+1}. {q.text}</p>
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

// ================= KOMPONEN UTAMA =================
export default function OperasiNestedList() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progresBelajar, setProgresBelajar] = useState(null);

  const TOPIC_NAME = "operasi_nested_list";
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

          // 🔒 Halaman hanya bisa diakses jika progres >= 7
          if (progres < 7) {
            navigate('/dashboard');
            return;
          }
          // Jika progres >= 7, boleh akses halaman
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);
  const [exerciseStatus, setExerciseStatus] = useState([false, false, false, false, false]);
  const [allExercisesCorrect, setAllExercisesCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [praktikMessage, setPraktikMessage] = useState("");
  const [praktikMessageType, setPraktikMessageType] = useState("");

  // Tampilkan modal hanya jika:
  // 1. progresBelajar < 8 (belum mencapai level 8)
  // 2. semua latihan benar
  // 3. belum menampilkan modal
  useEffect(() => {
    if (!userId) return;
    if (progresBelajar === null) return;
    if (progresBelajar >= 8) {
      // Jika progres >= 8, tidak perlu tampilkan modal
      setShowModal(false);
      return;
    }
    if (allExercisesCorrect && !showModal) {
      // Jika progres < 8 dan semua latihan benar, tampilkan modal
      setShowModal(true);
    }
  }, [allExercisesCorrect, userId, showModal, progresBelajar]);

  const handleCompleteAndNavigate = async () => {
    try {
      // Tambah progres hanya jika masih < 8
      if (progresBelajar < 8) {
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
      navigate("/NestedList/RangkumanNestedList");
    } catch (error) {
      console.error("Gagal update progres:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const updateExerciseStatus = (index, isCorrect) => {
    setExerciseStatus(prev => { const newStatus = [...prev]; newStatus[index] = isCorrect; return newStatus; });
  };

  useEffect(() => {
    setAllExercisesCorrect(exerciseStatus.every(v => v === true));
  }, [exerciseStatus]);

  const handlePraktikValidation = ({ isValid, isComplete }) => {
    if (isComplete) {
      setPraktikMessage("✅ Selamat! Semua instruksi sudah dikerjakan dengan benar.");
      setPraktikMessageType("success");
    } else {
      setPraktikMessage("⚠️ Periksa kembali instruksi!");
      setPraktikMessageType("warning");
    }
  };

  // Data untuk contoh kode
  const matrix3x3 = [[1,2,3],[4,5,6],[7,8,9]];
  const matrix2x3 = [[1,2,3],[4,5,6]];
  const gabungan = [[1,2],[3,4],[5,6],[7,8]];

  // Data untuk visualisasi perbandingan manipulasi
  const matrix3x3_before = [[1,2,3],[4,5,6],[7,8,9]];
  const matrix3x3_after_change = [[99,2,3],[4,5,88],[7,77,9]];
  const matrix2x3_before_append = [[1,2,3],[4,5,6]];
  const matrix2x3_after_append = [[1,2,3],[4,5,6],[7,8,9]];
  const matrix2x3_before_insert = [[1,2,3],[4,5,6]];
  const matrix2x3_after_insert = [[1,2,3],[10,11,12],[4,5,6]];
  const matrix3x3_before_pop = [[1,2,3],[4,5,6],[7,8,9]];
  const matrix3x3_after_pop = [[1,2,3],[4,5,6]];
  const matrix3x3_before_del = [[1,2,3],[4,5,6],[7,8,9]];
  const matrix3x3_after_del = [[7,8,9]];
  const matrix3x3_before_addcol = [[1,2,3],[4,5,6],[7,8,9]];
  const matrix3x3_after_addcol = [[1,2,3,0],[4,5,6,0],[7,8,9,0]];
  const matrix3x3_before_delcol = [[1,2,3],[4,5,6],[7,8,9]];
  const matrix3x3_after_delcol = [[1,3],[4,6],[7,9]];

  // Sequence untuk pencarian
  const searchSequenceBefore = [
    "0,0", "0,1", "0,2", "1,0", "1,1"
  ];
  const searchExplanationsBefore = [
    "Memeriksa data[0][0] = 1, bukan 5.",
    "Memeriksa data[0][1] = 2, bukan 5.",
    "Memeriksa data[0][2] = 3, bukan 5.",
    "Memeriksa data[1][0] = 4, bukan 5.",
    "Memeriksa data[1][1] = 5 → ditemukan! Menampilkan pesan."
  ];

  // Sequence untuk iterasi
  const iterasiSequenceBefore = [
    "0,0", "0,1", "0,2", "1,0", "1,1", "1,2"
  ];
  const iterasiExplanationsBefore = [
    "data[0][0] = 1",
    "data[0][1] = 2",
    "data[0][2] = 3",
    "data[1][0] = 4",
    "data[1][1] = 5",
    "data[1][2] = 6"
  ];

  // Sequence untuk mengubah nilai
  const changeSequence = {
    before: ["0,0", "1,2", "2,1"],
    after: ["0,0", "1,2", "2,1"]
  };
  const changeExplanations = {
    before: ["Mengubah data[0][0] menjadi 99", "Mengubah data[1][2] menjadi 88", "Mengubah data[2][1] menjadi 77"],
    after: ["data[0][0] telah menjadi 99", "data[1][2] telah menjadi 88", "data[2][1] telah menjadi 77"]
  };

  // Line explanations
  const lineExplMengubah = [
    "Komentar: Mengubah nilai elemen nested list.",
    "Membuat nested list data 3x3.",
    "Baris kedua.",
    "Baris ketiga.",
    "Menampilkan data sebelum perubahan.",
    "Mengubah elemen baris 1 kolom 1 menjadi 99.",
    "Mengubah elemen baris 2 kolom 3 menjadi 88.",
    "Mengubah elemen baris 3 kolom 2 menjadi 77.",
    "Menampilkan data setelah perubahan."
  ];

  const lineExplMencari = [
    "Komentar: Mencari nilai dalam nested list.",
    "Membuat data 3x3.",
    "Baris kedua.",
    "Baris ketiga.",
    "Nilai yang dicari = 5.",
    "Flag ditemukan = False.",
    "Perulangan untuk setiap baris (i).",
    "Perulangan untuk setiap kolom (j).",
    "data[i][j] mengambil nilai pada baris ke-i dan kolom ke-j",
    "Menampilkan pesan bahwa nilai yang dicari telah ditemukan.",
    "Jika nilai sama dengan cari, menampilkan posisi dan set ditemukan = True.",
    "Jika tidak ditemukan.",
    "Akan menampilkan pesan tidak ditemukan."
  ];

  const lineExplIterasi = [
    "Komentar: Iterasi seluruh elemen nested list.",
    "Membuat data 2x3.",
    "Baris 2.",
    "Perulangan untuk setiap baris (i).",
    "Perulangan untuk setiap kolom (j).",
    "Menampilkan nilai setiap elemen dengan indeksnya."
  ];

  const lineExplGabung = [
    "Komentar: Menggabungkan dua nested list dengan operator +.",
    "Membuat nested list a (2x2).",
    "Membuat nested list b (2x2).",
    "Menggabungkan a dan b menjadi list baru dengan operasi +.",
    "Menampilkan hasil."
  ];

  const lineExplTambahBaris = [
    "Komentar: Menambah baris baru di akhir nested list.",
    "Membuat data 2 baris.",
    "Baris 2.",
    "Membuat baris baru [7,8,9].",
    "Menambahkan baris_baru ke data dengan append().",
    "Menampilkan data setelah append."
  ];

  const lineExplSisipBaris = [
    "Komentar: Menyisipkan baris pada indeks tertentu.",
    "Membuat data 2 baris.",
    "Baris 2.",
    "insert(1, [10,11,12]) menyisipkan baris baru di indeks 1.",
    "Menampilkan data setelah insert."
  ];

  const lineExplHapusBaris = [
    "Komentar: Menghapus baris dengan pop() dan del.",
    "Membuat data 3 baris. Baris 1",
    "Baris 2",
    "Baris 3",
    "pop() menghapus baris terakhir.",
    "Menampilkan data setelah pop.",
    "del data[0] menghapus baris pertama.",
    "Menampilkan data setelah del."
  ];

  const lineExplTambahKolom = [
    "Komentar: Menambah kolom 0 di setiap baris.",
    "Membuat data 3x3. Baris 1",
    "Baris 2.",
    "Baris 3.",
    "Perulangan untuk setiap baris.",
    "Menambahkan nilai 0 di akhir setiap baris.",
    "Menampilkan data yang sudah ditambah kolom."
  ];

  const lineExplHapusKolom = [
    "Komentar: Menghapus kolom kedua (indeks 1) dari setiap baris.",
    "Membuat data 3x3. Baris 1",
    "Baris 2.",
    "Baris 3.",
    "Perulangan untuk setiap baris.",
    "pop(1) menghapus elemen indeks 1 (kolom kedua).",
    "Menampilkan data setelah penghapusan kolom."
  ];

  const codeMengubah = `# Mengubah nilai elemen nested list
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
print("Sebelum diubah:", data)
data[0][0] = 99
data[1][2] = 88
data[2][1] = 77
print("Setelah diubah:", data)`;

  const codeMencari = `# Mencari nilai dalam nested list
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
cari = 5
ditemukan = False
for i in range(len(data)):
    for j in range(len(data[i])):
        if data[i][j] == cari:
            print(f"Nilai {cari} ditemukan di baris {i}, kolom {j}")
            ditemukan = True
if not ditemukan:
    print(f"Nilai {cari} tidak ditemukan")`;

  const codeIterasi = `# Iterasi seluruh elemen nested list
data = [[1, 2, 3],
        [4, 5, 6]]
for i in range(len(data)):
    for j in range(len(data[i])):
        print(f"data[{i}][{j}] = {data[i][j]}")`;

  const codeGabung = `# Menggabungkan dua nested list
a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]
hasil = a + b
print("Hasil penggabungan:", hasil)`;

  const codeTambahBaris = `# Menambah baris (append)
data = [[1, 2, 3],
        [4, 5, 6]]
baris_baru = [7, 8, 9]
data.append(baris_baru)
print("Setelah append:", data)`;

  const codeSisipBaris = `# Menyisipkan baris (insert)
data = [[1, 2, 3],
        [4, 5, 6]]
data.insert(1, [10, 11, 12])
print("Setelah insert:", data)`;

  const codeHapusBaris = `# Menghapus baris (pop, del)
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
data.pop()
print("Setelah pop():", data)
del data[0]
print("Setelah del data[0]:", data)`;

  const codeTambahKolom = `# Menambah kolom pada setiap baris
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
for baris in data:
    baris.append(0)
print("Setiap baris ditambah kolom:", data)`;

  const codeHapusKolom = `# Menghapus kolom (indeks 1) pada setiap baris
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
for baris in data:
    baris.pop(1)
print("Setelah hapus kolom ke-2:", data)`;

  // Soal latihan
  const soal1CodeParts = ["data = [[10, 20, 30], [40, 50, 60]]\ndata[", "][", "] = 99\nprint(data)"];
  const soal1Placeholders = ["indeks baris", "indeks kolom"];
  const soal1Expected = ["0", "1"];

  const soal2CodeParts = ["data = [[1, 2], [3, 4]]\ndata.", "([5, 6])\nprint(data)"];
  const soal2Placeholders = ["method"];
  const soal2Expected = ["append"];

  const soal3Template = `data = [[1, 2, 3], [4, 5, 6]]
for baris in ___:
    baris.___(0)
print(data)`;
  const soal3Placeholders = ["data", "append"];
  const soal3Options = ["data", "range(len(data))", "append", "insert", "extend", "baris"];
  const soal3Expected = ["data", "append"];

  const soal4Template = `data = [[1, 2], [3, 4], [5, 6]]
___ data[0]
print(data)`;
  const soal4Placeholders = ["del"];
  const soal4Options = ["del", "pop", "remove", "delete", "data.pop(0)", "data.remove([1,2])"];
  const soal4Expected = ["del"];

  const soal5Template = `data = [[10, 20], [30, 40]]
data[___][___] = 99
print(data[1][0])`;
  const soal5Placeholders = ["baris", "kolom"];
  const soal5Options = ["0", "1", "2", "3", "baris", "kolom"];
  const soal5Expected = ["1", "0"];

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

  const handleEksplorasiComplete = () => setIsEksplorasiCompleted(true);

  // Tampilkan loading saat sedang mengambil data
  if (loading) {
    return (
      <>
        <Navbar />
        <SidebarMateri isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main-content" style={{ marginLeft: isSidebarOpen ? "280px" : "0", transition: "margin-left 0.3s ease", paddingTop: "64px", minHeight: "100vh", width: "auto" }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
              <div style={{ fontSize: '18px', color: '#306998' }}>Memuat data...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <SidebarMateri isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="main-content" style={{ marginLeft: isSidebarOpen ? "280px" : "0", transition: "margin-left 0.3s ease", paddingTop: "64px", minHeight: "100vh", width: "auto" }}>
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>OPERASI DAN MANIPULASI NESTED LIST</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <p style={styles.text}>1. Mahasiswa mampu menerapkan operasi dan manipulasi nested list dalam pengolahan data.</p>
            </div>
          </section>

          <section style={styles.section}>
            <Eksplorasi topicName={TOPIC_NAME} onComplete={handleEksplorasiComplete} />
          </section>

          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Operasi Dasar Nested List</h2>
                <div style={styles.card}>
                  <h3>1. Mengubah Nilai Elemen</h3>
                  <p style={styles.text}>Untuk mengubah nilai elemen yang harus dilakukan adalah 
                    dengan mengakses elemen melalui indeks baris dan kolom yang ingin diubah lalu 
                    tetapkan nilai baru, dengan struktur nama_variabel[indeks_baris][indeks_kolom] = nilai_baru.</p>
                  <CodeEditorWithVisual
                    code={codeMengubah}
                    title="Contoh Kode Program"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplMengubah}
                    beforeData={matrix3x3_before}
                    afterData={matrix3x3_after_change}
                    beforeTitle="Sebelum diubah"
                    afterTitle="Sesudah diubah"
                    highlightSequence={changeSequence}
                    processExplanations={changeExplanations}
                  />

                  <h3>2. Mencari Nilai</h3>
                  <p style={styles.text}>Mencari nilai tertentu dalam nested list menggunakan perulangan bersarang.</p>
                  <CodeEditorWithVisual
                    code={codeMencari}
                    title="Contoh Kode Program"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplMencari}
                    beforeData={matrix3x3}
                    afterData={null}
                    beforeTitle="Visualisasi Pencarian"
                    highlightSequence={{ before: searchSequenceBefore, after: [] }}
                    processExplanations={{ before: searchExplanationsBefore, after: [] }}
                  />

                  <h3>3. Iterasi Seluruh Elemen</h3>
                  <p style={styles.text}>Melakukan iterasi seluruh elemen nested list bisa menggunakan perulangan bersarang.</p>
                  <CodeEditorWithVisual
                    code={codeIterasi}
                    title="Contoh Kode Program"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplIterasi}
                    beforeData={matrix2x3}
                    afterData={null}
                    beforeTitle="Visualisasi Iterasi"
                    highlightSequence={{ before: iterasiSequenceBefore, after: [] }}
                    processExplanations={{ before: iterasiExplanationsBefore, after: [] }}
                  />

                  <h3>4. Menggabungkan Banyak Nested List</h3>
                  <p style={styles.text}>Operator + bisa digunakan untuk mengabungkan dua atau lebih nested list,
                     menggunakan struktur nama_variabel_baru = variable_lama_1 + variable_lama_2 + dst ….</p>
                  <CodeEditorWithTripleVisual
                    code={codeGabung}
                    title="Contoh Kode Program"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplGabung}
                    dataA={[[1,2],[3,4]]}
                    dataB={[[5,6],[7,8]]}
                    dataResult={gabungan}
                    titleA="List a"
                    titleB="List b"
                    titleResult="Hasil penggabungan a + b"
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Manipulasi Nested List</h2>
                <div style={styles.card}>
                  <h3>1. Menambah Baris (append)</h3>
                  <p style={styles.text}>Untuk menambahkan baris baru pada nested list, dapat menggunakan append 
                    dengan struktur <strong>nama_variabel.append(variable_baris_baru)</strong>. 
                    Baris baru akan otomatis ditambahkan di indeks paling belakang.</p>
                  <CodeEditorWithVisual
                    code={codeTambahBaris}
                    title="Contoh Kode Program"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplTambahBaris}
                    beforeData={matrix2x3_before_append}
                    afterData={matrix2x3_after_append}
                    beforeTitle="Sebelum append"
                    afterTitle="Sesudah append"
                  />

                  <h3>2. Menyisipkan Baris (insert)</h3>
                  <p style={styles.text}>Untuk menyisipkan baris baru pada nested list, 
                    dapat menggunakan insert dengan struktur <strong>nama_variabel.insert(indeks_baris[baris_baru])</strong>.  
                    Baris baru akan ditambahkan sesuai indeks baris yang ditentukan.</p>
                  <CodeEditorWithVisual
                    code={codeSisipBaris}
                    title="Contoh Kode Program"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplSisipBaris}
                    beforeData={matrix2x3_before_insert}
                    afterData={matrix2x3_after_insert}
                    beforeTitle="Sebelum insert"
                    afterTitle="Sesudah insert"
                  />

                  <h3>3. Menghapus Baris (pop, del)</h3>
                  <p style={styles.text}>
                    Untuk menghapus baris pada nested list, dapat menggunakan dua cara yaitu pop() dan del. Berikut penjelasannya.
                    <br />
                    • <strong>pop()</strong> digunakan untuk menghapus baris pada indeks tertentu sekaligus mengembalikan 
                    nilai baris yang dihapus. Jika tidak diberikan indeks, maka pop() akan menghapus baris terakhir. 
                    Struktur penulisannya: <strong>nama_variabel.pop(indeks_baris)</strong>.
                    <br />
                    • <strong>del</strong> digunakan untuk menghapus baris pada indeks tertentu tanpa mengembalikan nilai. 
                    Struktur penulisannya: <strong>del nama_variabel[indeks_baris]</strong>.
                  </p>
                  <CodeEditorWithVisual
                    code={codeHapusBaris}
                    title="Contoh Kode Program"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplHapusBaris}
                    beforeData={matrix3x3_before_pop}
                    afterData={matrix3x3_after_del}
                    beforeTitle="Sebelum penghapusan"
                    afterTitle="Sesudah penghapusan"
                  />

                  <h3>4. Menambah Kolom</h3>
                  <p style={styles.text}>Untuk menambah kolom di nested list, kita 
                    dapat menggunakan perulangan untuk mengakses baris dan menambahkan 
                    elemen baru di akhir baris menggunakan append(). 
                    Karena setiap baris adalah list, menambah kolom berarti menambah 
                    elemen baru pada sub‑list tersebut. 
                    Strukturnya for baris in data: baris.append(nilai_baru).</p>
                  <CodeEditorWithVisual
                    code={codeTambahKolom}
                    title="Contoh Kode Program"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplTambahKolom}
                    beforeData={matrix3x3_before_addcol}
                    afterData={matrix3x3_after_addcol}
                    beforeTitle="Sebelum tambah kolom"
                    afterTitle="Sesudah tambah kolom"
                  />

                  <h3>5. Menghapus Kolom</h3>
                  <p style={styles.text}>Untuk menghapus kolom pada setiap baris di nested list, 
                    kita dapat menggunakan perulangan untuk mengakses setiap baris (yang merupakan list) 
                    dan menghapus elemen pada indeks kolom tertentu menggunakan method pop(). Karena setiap baris 
                    adalah list, menghapus kolom berarti menghapus elemen pada posisi yang sama di setiap sub‑list.
                    Struktur penulisannya <strong>for baris in data: baris.pop(indeks_kolom)</strong>. Dengan menggunakan struktur kode ini akan 
                    menghapus elemen pada indeks yang diberikan dan mengembalikan nilai yang dihapus
                  </p>
                  <CodeEditorWithVisual
                    code={codeHapusKolom}
                    title="Contoh Kode Program"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplHapusKolom}
                    beforeData={matrix3x3_before_delcol}
                    afterData={matrix3x3_after_delcol}
                    beforeTitle="Sebelum hapus kolom"
                    afterTitle="Sesudah hapus kolom"
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ayo Praktik!</h2>
                <div style={styles.card}>
                  <div style={styles.alertBox}>
                    <strong>Instruksi:</strong>
                    <ul style={{ marginTop: "5px", paddingLeft: "20px", textAlign: "justify" }}>
                      <li>Buatlah nested list dengan nama data yang berisi tiga baris. Baris 1 berisi 1,2,3, baris 2 berisi 4,5,6, baris 3 berisi 7,8,9.</li>
                      <li>Ubah elemen baris pertama kolom pertama menjadi 100.</li>
                      <li>Tampilkan elemen baris ketiga kolom kedua yaitu nilai 8.</li>
                      <li>Tampilkan semua isi data.</li>
                    </ul>
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
                  <p style={styles.text}>Isilah bagian yang kosong pada kode dan drag pilihan ke area kosong.</p>
                  
                  <CodeCompletionQuestion question="1. Lengkapi kode untuk mengubah elemen baris pertama kolom kedua menjadi 99." codeParts={soal1CodeParts} placeholders={soal1Placeholders} expectedAnswers={soal1Expected} onCheck={(isCorrect) => updateExerciseStatus(0, isCorrect)} />
                  <CodeCompletionQuestion question="2. Lengkapi kode untuk menambahkan baris baru [5,6] di akhir nested list." codeParts={soal2CodeParts} placeholders={soal2Placeholders} expectedAnswers={soal2Expected} onCheck={(isCorrect) => updateExerciseStatus(1, isCorrect)} />
                  <DragDropCompletionQuestion question="3. Lengkapi kode berikut untuk menambahkan kolom (nilai 0) pada setiap baris nested list." codeTemplate={soal3Template} placeholders={soal3Placeholders} options={soal3Options} expectedAnswers={soal3Expected} onCheck={(isCorrect) => updateExerciseStatus(2, isCorrect)} />
                  <DragDropCompletionQuestion question="4. Lengkapi kode berikut untuk menghapus baris pertama dari nested list." codeTemplate={soal4Template} placeholders={soal4Placeholders} options={soal4Options} expectedAnswers={soal4Expected} onCheck={(isCorrect) => updateExerciseStatus(3, isCorrect)} />
                  <DragDropCompletionQuestion question="5. Lengkapi kode berikut untuk mengubah elemen baris kedua kolom pertama menjadi 99." codeTemplate={soal5Template} placeholders={soal5Placeholders} options={soal5Options} expectedAnswers={soal5Expected} onCheck={(isCorrect) => updateExerciseStatus(4, isCorrect)} />
                </div>
              </section>
            </>
          )}

          {!isEksplorasiCompleted && <div style={styles.lockMessage}>🔒 Materi terkunci. Selesaikan eksplorasi di atas dengan menjawab kedua pertanyaan.</div>}
        </div>
      </div>

      {/* Modal - HANYA MUNCUL JIKA PROGRES < 8 */}
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
        textarea::placeholder {
          color: #888;
          font-style: italic;
        }
      `}</style>
    </>
  );
}