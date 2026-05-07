import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { db } from "../../../config/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

// ================= STYLE GLOBAL (SAMA PERSIS DENGAN KODE AWAL ANDA) =================
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
  strukturWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },
  strukturSeluruh: { textAlign: "center", cursor: "pointer" },
  strukturSeluruhButton: {
    padding: "20px",
    backgroundColor: "#306998",
    color: "white",
    borderRadius: "12px",
    minWidth: "150px",
  },
  strukturSeluruhActive: {
    padding: "20px",
    backgroundColor: "#FFD43B",
    color: "#306998",
    borderRadius: "12px",
    minWidth: "150px",
  },
  strukturLabel: { marginTop: "8px" },
  strukturTable: {
    borderCollapse: "collapse",
    backgroundColor: "white",
    border: "1px solid #ccc",
  },
  strukturTableHeader: { backgroundColor: "#e9ecef", border: "1px solid #ccc" },
  strukturTableRowLabel: {
    fontWeight: "bold",
    cursor: "pointer",
    padding: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f8f9fa",
  },
  strukturTableCell: {
    padding: "12px",
    cursor: "pointer",
    backgroundColor: "#f1f3f5",
    border: "1px solid #ccc",
  },
  strukturInfo: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#fff3cd",
    borderLeft: "5px solid #FFD43B",
    borderRadius: "8px",
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
};

// ================= KOMPONEN VISUALISASI NESTED LIST INTERAKTIF (BARU) =================
const NestedListVisualization = ({ data, title, highlightCell, processExplanation }) => {
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [explanationText, setExplanationText] = useState("");
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    if (!highlightCell) return;
    setCurrentHighlight(highlightCell);
    if (processExplanation) setExplanationText(processExplanation);
    const timer = setTimeout(() => {
      setCurrentHighlight(null);
      setExplanationText("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [highlightCell, processExplanation]);

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
              <td style={visStyles.rowLabel}>Baris {rowIdx}</td>
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
  rowLabel: { fontWeight: "bold", padding: "8px 12px", backgroundColor: "#e9ecef", border: "1px solid #ccc" },
  cell: { padding: "12px 16px", textAlign: "center", border: "1px solid #ccc", transition: "all 0.3s ease", cursor: "pointer" },
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

// ================= CODE EDITOR UNTUK CONTOH KODE PROGRAM (VERSI BARU DENGAN VISUALISASI) =================
const CodeEditorWithVisual = ({ code, title, visualData, visualTitle, highlightCellMapping, pyodideReady, runPythonCode, lineExplanations }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const [highlightCell, setHighlightCell] = useState(null);
  const [explanationStep, setExplanationStep] = useState("");
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

    if (highlightCellMapping) {
      const { cell, explanation } = highlightCellMapping();
      setHighlightCell(cell);
      setExplanationStep(explanation);
      setTimeout(() => {
        setHighlightCell(null);
        setExplanationStep("");
      }, 3000);
    }
  }, [pyodideReady, code, runPythonCode, highlightCellMapping]);

  const renderLineExplanations = () => {
    if (!lineExplanations || lineExplanations.length === 0) return null;
    const lines = code.split("\n");
    // Pastikan jumlah penjelasan sama dengan jumlah baris kode
    const maxLen = Math.max(lines.length, lineExplanations.length);
    const explanations = [];
    for (let i = 0; i < maxLen; i++) {
      explanations.push(lineExplanations[i] || "");
    }
    return (
      <div>
        {lines.map((line, idx) => {
          const explanation = explanations[idx] || "";
          // Jangan sembunyikan baris kosong, beri penjelasan jika diperlukan
          if (!explanation.trim() && line.trim() === "") return null;
          const lineNumber = idx + 1;
          return (
            <div key={idx} style={styles.explanationLine}>
              <span style={styles.explanationLineNumber}>Baris {lineNumber}:</span>
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

      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>{code}</pre>
      </div>

      <div style={styles.visualHeader}>Visualisasi Kode Program</div>
      <div style={styles.visualArea}>
        {showVisual && visualData ? (
          <NestedListVisualization
            data={visualData}
            title={visualTitle}
            highlightCell={highlightCell}
            processExplanation={explanationStep}
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

      {showExplanations && lineExplanations && lineExplanations.length > 0 && (
        <>
          <div style={styles.explanationHeader}>
            <span style={styles.outputTitle}>Penjelasan Kode (per baris)</span>
          </div>
          <div style={styles.explanationContent}>
            {renderLineExplanations()}
          </div>
        </>
      )}
    </div>
  );
};

// ================= PRAKTIK (CODE EDITOR EDITABLE) - SAMA PERSIS KODE AWAL =================
const CodeEditorEditable = ({ pyodideReady, runPythonCode }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [completedSteps, setCompletedSteps] = useState({
    1: false,
    2: false,
    3: false,
  });

  const validateStep = (code) => {
    const trimmed = code.trim();
    if (!/\bmatriks\s*=\s*\[\[.*?\]\s*,\s*\[.*?\]\]/.test(trimmed) && !completedSteps[1])
      return {
        valid: false,
        step: 1,
        msg: "📝 Belum membuat nested list 'matriks'.",
      };
    if (!/print\s*\(\s*matriks\s*\[\s*0\s*\]\s*\[\s*0\s*\]\s*\)/.test(trimmed) && !completedSteps[2])
      return {
        valid: false,
        step: 2,
        msg: "Bagus. Lanjut mencetak elemen 3.",
      };
    if (!/print\s*\(\s*matriks\s*\[\s*1\s*\]\s*\[\s*2\s*\]\s*\)/.test(trimmed) && !completedSteps[3])
      return {
        valid: false,
        step: 3,
        msg: "Bagus. Lanjut mencetak elemen 18.",
      };
    return { valid: true };
  };

  const handleRun = async () => {
    if (!localCode.trim()) {
      setInfoMessage("⚠️ Silakan isi jawaban Anda terlebih dahulu.");
      setOutput("");
      return;
    }
    const validation = validateStep(localCode);
    if (!validation.valid) {
      setInfoMessage(validation.msg);
      setOutput("");
      return;
    }
    setInfoMessage("");
    const result = await runPythonCode(localCode);
    setOutput(result);
    let newCompleted = { ...completedSteps };
    let changed = false;
    if (
      !completedSteps[1] &&
      /\bmatriks\s*=\s*\[\[.*?\]\s*,\s*\[.*?\]\]/.test(localCode)
    ) {
      newCompleted[1] = true;
      changed = true;
      setInfoMessage(
        "✅ Bagus! Nested list 'matriks' sudah dibuat. Lanjut ke instruksi berikutnya."
      );
    }
    if (
      !completedSteps[2] &&
      /print\s*\(\s*matriks\s*\[\s*0\s*\]\s*\[\s*0\s*\]\s*\)/.test(localCode)
    ) {
      newCompleted[2] = true;
      changed = true;
      setInfoMessage(
        "✅ Bagus! Elemen pertama baris pertama sudah dicetak. Lanjut ke instruksi berikutnya."
      );
    }
    if (
      !completedSteps[3] &&
      /print\s*\(\s*matriks\s*\[\s*1\s*\]\s*\[\s*2\s*\]\s*\)/.test(localCode)
    ) {
      newCompleted[3] = true;
      changed = true;
      setInfoMessage(
        "✅ Bagus! Elemen ketiga baris kedua sudah dicetak. Semua instruksi selesai! Kode Anda benar."
      );
    }
    if (changed) setCompletedSteps(newCompleted);
    else if (newCompleted[1] && newCompleted[2] && newCompleted[3]) {
      setInfoMessage(
        "✅ SELAMAT! Semua instruksi sudah dipenuhi dengan benar."
      );
    } else {
      setInfoMessage(
        "⚠️ Periksa kembali kode Anda. Pastikan semua instruksi diikuti."
      );
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
      {infoMessage && (
        <div
          style={
            infoMessage.startsWith("✅") || infoMessage.startsWith("📝")
              ? styles.infoBox
              : styles.warningBox
          }
        >
          {infoMessage}
        </div>
      )}
      <textarea
        style={{ ...styles.codeInputEditable }}
        value={localCode}
        onChange={(e) => setLocalCode(e.target.value)}
        placeholder="Tulis kode Python Anda di sini..."
        spellCheck={false}
      />
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

// ================= SOAL LATIHAN (SAMA PERSIS KODE AWAL, DENGAN TOLERANSI PETIK & SPASI) =================
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

// ================= EKSPLORASI (SAMA PERSIS KODE AWAL) =================
const Eksplorasi = ({ onComplete }) => {
  const [selected, setSelected] = useState([null, null]);
  const [feedback, setFeedback] = useState(["", ""]);
  const [hasAnswered, setHasAnswered] = useState([false, false]);

  const questions = [
    {
      text: "Nested list yang benar untuk merepresentasikan tabel 2 baris 3 kolom adalah ...",
      options: ["[[1,2,3],[4,5,6]]", "[1,2,3,4,5,6]", "[[1,2],[3,4],[5,6]]", "[(1,2,3),(4,5,6)]", "{1:2,3:4,5:6}"],
      correct: 0,
    },
    {
      text: "Cara mengakses elemen baris ke-2 kolom ke-3 dari nested list 'data = [[1,2,3],[4,5,6]]' adalah ...",
      options: ["data[2][3]", "data[1][2]", "data[2][2]", "data[1][1]", "data[2][1]"],
      correct: 1,
    },
  ];

  const handleAnswer = (qIdx, optIdx) => {
    if (hasAnswered[qIdx]) return;
    setSelected(prev => { const newSel = [...prev]; newSel[qIdx] = optIdx; return newSel; });
    const isCorrect = optIdx === questions[qIdx].correct;
    setFeedback(prev => { const newFb = [...prev]; newFb[qIdx] = isCorrect ? "Benar" : "Salah"; return newFb; });
    setHasAnswered(prev => { const newAns = [...prev]; newAns[qIdx] = true; return newAns; });
  };

  useEffect(() => { if (hasAnswered.every(v => v === true)) onComplete(); }, [hasAnswered, onComplete]);

  return (
    <div>
      <h2 style={styles.sectionTitle}>Eksplorasi Awal</h2>
      <div style={styles.card}>
        <p style={styles.text}>
          Sebelum belajar lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
          <strong style={{ color: "#0d6efd" }}> Materi akan terbuka setelah kedua pertanyaan dijawab.</strong>
        </p>
        {questions.map((q, idx) => {
          const isAnswered = hasAnswered[idx];
          const selectedIdx = selected[idx];
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
        {!hasAnswered.every(v => v === true) && <div style={styles.infoMessage}>Jawab kedua pertanyaan di atas untuk membuka materi pembelajaran.</div>}
      </div>
    </div>
  );
};

// ================= STRUKTUR INTERAKTIF (SAMA PERSIS KODE AWAL) =================
const StrukturInteraktif = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const data = [[85, 90, 78], [88, 92, 80]];

  const handleClick = (row, col) => {
    if (row === null && col === null)
      setSelectedElement({ text: "nilai_siswa → [[85, 90, 78], [88, 92, 80]] (seluruh nested list)" });
    else if (col === null)
      setSelectedElement({ text: `nilai_siswa[${row}] → [${data[row].join(", ")}] (seluruh baris ke-${row + 1})` });
    else
      setSelectedElement({ text: `nilai_siswa[${row}][${col}] → ${data[row][col]} (baris ${row + 1}, kolom ${col + 1})` });
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .strukturTableCell {
        transition: all 0.2s ease;
        cursor: pointer;
      }
      .strukturTableCell:hover {
        background-color: #e0e0e0 !important;
        transform: scale(1.02);
      }
      .strukturTableRowLabel {
        transition: all 0.2s ease;
        cursor: pointer;
      }
      .strukturTableRowLabel:hover {
        background-color: #e2e6ea !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.strukturContainer}>
      <h4 style={styles.strukturTitle}>Visualisasi Struktur Nested List (Klik pada elemen)</h4>
      <p style={styles.strukturPetunjuk}>💡 Petunjuk: Klik pada kotak "nilai_siswa", pada setiap judul baris, atau pada setiap angka dalam tabel.</p>
      <div style={styles.strukturKode}>
        <pre style={styles.strukturPre}>nilai_siswa = [[85, 90, 78], [88, 92, 80]]</pre>
      </div>
      <div style={styles.strukturWrapper}>
        <div style={styles.strukturSeluruh} onClick={() => handleClick(null, null)}>
          <div style={selectedElement?.text?.includes("seluruh") ? styles.strukturSeluruhActive : styles.strukturSeluruhButton}>
            Klik untuk info seluruh data
          </div>
          <div style={styles.strukturLabel}>nilai_siswa</div>
        </div>
        <table style={styles.strukturTable}>
          <thead>
            <tr style={styles.strukturTableHeader}>
              <th></th>
              <th>Kolom 0</th>
              <th>Kolom 1</th>
              <th>Kolom 2</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td style={styles.strukturTableRowLabel} onClick={() => handleClick(rowIdx, null)}>
                  Baris {rowIdx + 1}
                </td>
                {row.map((val, colIdx) => (
                  <td
                    key={colIdx}
                    className="strukturTableCell"
                    style={styles.strukturTableCell}
                    onClick={() => handleClick(rowIdx, colIdx)}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedElement && <div style={styles.strukturInfo}>{selectedElement.text}</div>}
    </div>
  );
};

// ================= KOMPONEN UTAMA =================
export default function PembuatanAksesNestedList() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) navigate('/loginregister');
  }, [navigate]);

  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [correctStatus, setCorrectStatus] = useState([false, false, false, false, false]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bonusGiven, setBonusGiven] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => { const already = localStorage.getItem("pembuatan_akses_nested_bonus_done"); if (already === "true") setBonusGiven(true); }, []);
  const allCorrect = correctStatus.every(v => v === true);
  useEffect(() => { if (allCorrect && !bonusGiven && userId) setShowModal(true); }, [allCorrect, bonusGiven, userId]);

  const handleCompleteAndNavigate = async () => {
    try {
      const mahasiswaRef = doc(db, "mahasiswa", userId);
      await updateDoc(mahasiswaRef, { progres_belajar: increment(1) });
      localStorage.setItem("pembuatan_akses_nested_bonus_done", "true");
      setShowModal(false);
      navigate("/NestedList/OperasiNestedList");
    } catch (error) { console.error("Gagal update progres:", error); alert("Terjadi kesalahan. Silakan coba lagi."); }
  };

  const handleCorrectChange = (index, isCorrect) => setCorrectStatus(prev => { const newStatus = [...prev]; newStatus[index] = isCorrect; return newStatus; });

  // Data untuk visualisasi contoh kode
  const nestedListData = [[1, 2, 3], [4, 5, 6]];
  const raggedData = [[1, 2], [3, 4, 5], [6]];

  // ================= PERBAIKAN LINE EXPLANATIONS (JELAS DAN LENGKAP) =================
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
  const highlightAksesMapping = () => ({ cell: "0,0", explanation: "Perintah `matriks[0][0]` mengambil elemen pada baris indeks 0, kolom indeks 0 → nilai 1." });

  const contohRagged = `# Nested list dengan panjang baris berbeda (ragged array)
data = [[1, 2],
        [3, 4, 5],
        [6]]
print(data[1][2])
print(data[2][0])`;
  const lineExplanationsRagged = [
    "Komentar: Membuat nested list dengan panjang baris berbeda (ragged array).",
    "Membuat variabel 'data' - baris pertama [1,2] (indeks 0, panjang 2).",
    "Baris kedua [3,4,5] (indeks 1, panjang 3).",
    "Baris ketiga [6] (indeks 2, panjang 1).",
    "Mencetak elemen baris indeks 1, kolom indeks 2 → 5.",
    "Mencetak elemen baris indeks 2, kolom indeks 0 → 6."
  ];

  // Soal latihan (kode asli)
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
            <Eksplorasi onComplete={handleEksplorasiComplete} />
          </section>

          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#306998" }}>Struktur Nested List</h3>
                  <p style={styles.text}>Nested list dapat dipandang sebagai tabel/matriks. Indeks pertama = baris, kedua = kolom.</p>
                  <StrukturInteraktif />
                </div>
              </section>

              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#306998" }}>Membuat Nested List</h3>
                  <p style={styles.text}>
                    <strong>Nested list</strong> adalah list yang di dalamnya berisi list lain. Struktur ini sangat berguna untuk
                    merepresentasikan data dua dimensi seperti tabel, matriks, atau kumpulan data yang berelasi. Contoh sederhana:{" "}
                    <code>matriks = [[1, 2, 3], [4, 5, 6]]</code> akan membuat sebuah nested list dengan 2 baris dan 3 kolom. Setiap baris
                    ditulis sebagai list terpisah, dipisahkan koma, dan seluruhnya diapit tanda kurung siku. Anda juga dapat membuat nested list
                    dengan panjang baris berbeda (dikenal sebagai <em>ragged array</em>), misalnya{" "}
                    <code>data = [[1,2], [3,4,5], [6]]</code>.
                  </p>
                  <p style={styles.text}>
                    Perhatikan penamaan variabel: gunakan nama yang deskriptif, misal <code>nilai_siswa</code>, <code>matriks</code>, atau{" "}
                    <code>data_penjualan</code>. Dengan memahami cara membuat nested list, Anda dapat menyimpan data terstruktur dengan mudah.
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
                  <p style={styles.text}>
                    Pengaksesan elemen sangat penting untuk memproses data tabel, misalnya mencari nilai maksimum pada setiap kolom,
                    atau menghitung rata-rata.
                  </p>
                  <CodeEditorWithVisual
                    code={contohAksesElemen}
                    title="Contoh Kode Program"
                    visualData={nestedListData}
                    visualTitle="Visualisasi Nested List 'matriks'"
                    highlightCellMapping={highlightAksesMapping}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    lineExplanations={lineExplanationsAkses}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#306998" }}>Mengapa Perlu Nested List?</h3>
                  <p style={styles.text}>
                    Tanpa nested list, kita harus membuat banyak variabel terpisah yang tidak efisien.
                  </p>
                  <div style={styles.highlightBox}>
                    <pre style={styles.code}>{`# Tidak efisien dengan variabel terpisah
baris1 = [1, 2, 3]
baris2 = [4, 5, 6]
# Sulit untuk diolah dalam perulangan

# Dengan nested list menjadi rapi
matriks = [[1, 2, 3], [4, 5, 6]]`}</pre>
                  </div>
                  <p style={styles.text}>
                    Dengan nested list, data menjadi terstruktur, mudah diakses dengan perulangan bersarang, dan lebih ringkas.
                    Materi selanjutnya akan membahas operasi dan manipulasi nested list.
                  </p>
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ayo Praktik!</h2>
                <div style={styles.card}>
                  <div style={styles.infoBox}>
                    <strong>📝 Studi Kasus: Matriks Sederhana</strong>
                    <p>Buatlah program Python yang:</p>
                    <ol style={styles.list}>
                      <li>Membuat nested list bernama <code>matriks</code> dengan isi <code>[[3,6,9],[12,15,18]]</code>.</li>
                      <li>Menampilkan elemen <strong>3</strong> (baris 1 kolom 1) menggunakan <code>print(matriks[0][0])</code>.</li>
                      <li>Menampilkan elemen <strong>18</strong> (baris 2 kolom 3) menggunakan <code>print(matriks[1][2])</code>.</li>
                    </ol>
                  </div>
                  <CodeEditorEditable
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Isilah bagian yang kosong pada kode (soal 1-3) dan tentukan output (soal 4-5). 
                    Jika jawaban salah, tombol reset akan muncul untuk mengulang per soal.
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
                    question="2. Lengkapi baris kedua nested list agar menjadi [[1,2],[3,4]]:"
                    codeParts={soal2CodeParts}
                    placeholders={soal2Placeholders}
                    expectedAnswers={soal2Expected}
                    index={1}
                    onCorrectChange={handleCorrectChange}
                  />

                  <CodeCompletionQuestion
                    question="3. Lengkapi kode untuk mencetak angka 60 (baris 3 kolom 2) dari nested list data:"
                    codeParts={soal3CodeParts}
                    placeholders={soal3Placeholders}
                    expectedAnswers={soal3Expected}
                    index={2}
                    onCorrectChange={handleCorrectChange}
                  />

                  <GuessOutputQuestion
                    question="4. Output dari kode berikut adalah ..."
                    codeSnippet={soal4Code}
                    expectedOutput="9"
                    index={3}
                    onCorrectChange={handleCorrectChange}
                  />

                  <GuessOutputQuestion
                    question="5. Output dari kode berikut adalah ..."
                    codeSnippet={soal5Code}
                    expectedOutput="4"
                    index={4}
                    onCorrectChange={handleCorrectChange}
                  />

                  {allCorrect && !bonusGiven && (
                    <div style={styles.finalSuccessBox}>
                      🎉 Selamat! Semua jawaban benar. Silakan lanjut ke materi berikutnya.
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
              Anda telah menyelesaikan semua latihan dengan sempurna.<br />
              Progres belajar Anda bertambah! Materi selanjutnya akan terbuka.
            </p>
            <button style={styles.modalButton} onClick={handleCompleteAndNavigate}>
              Lanjut ke Operasi Nested List 🚀
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