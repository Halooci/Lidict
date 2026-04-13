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
  section: {
    marginBottom: "40px",
  },
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
  },
  text: {
    lineHeight: "1.8",
    color: "#333",
    marginBottom: "15px",
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
  codeEditorTitle: {
    fontWeight: "600",
    fontSize: "15px",
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
  codePre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    borderTop: "2px solid #1e1e1e",
  },
  outputTitle: {
    fontWeight: "600",
    fontSize: "15px",
  },
  codeOutput: {
    backgroundColor: "#1e1e1e",
    padding: "15px",
    minHeight: "80px",
  },
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
  matchingContainer: {
    display: "flex",
    gap: "40px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  matchingColumn: {
    flex: 1,
    minWidth: "250px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "15px",
    border: "1px solid #dee2e6",
  },
  matchingTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    textAlign: "center",
    color: "#306998",
  },
  dragItem: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "grab",
    textAlign: "center",
    transition: "all 0.2s",
  },
  dropZone: {
    backgroundColor: "#e9ecef",
    border: "2px dashed #6c757d",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "10px",
    minHeight: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  dropZoneFilled: {
    backgroundColor: "#d1e7dd",
    border: "2px solid #198754",
    color: "#0f5132",
  },
  resetMatchingButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "15px",
  },
  feedback: {
    marginTop: "8px",
    fontSize: "14px",
    fontStyle: "italic",
    color: "#333",
  },
  visualWrapper: {
    display: "flex",
    gap: "20px",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  visualColumn: {
    flex: 1,
    minWidth: "250px",
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
};

// ================= KOMPONEN VISUALISASI LIST SATU KOLOM =================
const SingleListVisualization = ({ data, title, hoverContext = {}, highlightIndex = null }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const negativeIndices = data.map((_, i) => -(data.length - i));

  const getHoverExplanation = (idx, item) => {
    const customMsg = hoverContext[idx];
    if (customMsg) return customMsg;
    return `📌 Elemen: "${item}"\n✅ Indeks positif: ${idx} → data[${idx}]\n✅ Indeks negatif: ${negativeIndices[idx]} → data[${negativeIndices[idx]}]`;
  };

  return (
    <div style={{
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      padding: "15px",
      margin: "10px 0",
      border: "1px solid #dee2e6",
    }}>
      <div style={{
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "15px",
        textAlign: "center",
        color: "#306998",
      }}>{title}</div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        flexWrap: "wrap",
        marginBottom: "15px",
      }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            style={{ textAlign: "center" }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div style={{
              width: "70px",
              padding: "10px 5px",
              borderRadius: "8px",
              fontWeight: "500",
              marginBottom: "5px",
              fontSize: "13px",
              backgroundColor: highlightIndex === idx
                ? "#FFD43B"
                : (hoveredIndex === idx ? "#FFA500" : "#306998"),
              color: (highlightIndex === idx || hoveredIndex === idx) ? "#1f2937" : "white",
              transform: (highlightIndex === idx || hoveredIndex === idx) ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}>
              <div>{String(item)}</div>
            </div>
            <div style={{ fontSize: "10px", color: "#555" }}>Indeks +{idx}</div>
            <div style={{ fontSize: "10px", color: "#888" }}>Indeks {negativeIndices[idx]}</div>
          </div>
        ))}
      </div>
      {hoveredIndex !== null && (
        <div style={{
          backgroundColor: "#fff3cd",
          padding: "10px",
          borderRadius: "8px",
          marginTop: "10px",
          fontSize: "13px",
          color: "#856404",
          borderLeft: "4px solid #ffc107",
          whiteSpace: "pre-line",
        }}>
          {getHoverExplanation(hoveredIndex, data[hoveredIndex])}
        </div>
      )}
    </div>
  );
};

// ================= KOMPONEN VISUALISASI SEBELUM & SESUDAH =================
const BeforeAfterVisualization = ({
  beforeData,
  afterData,
  beforeTitle,
  afterTitle,
  hoverContextBefore = {},
  hoverContextAfter = {},
  highlightSequence = [],
  processExplanation = "",
}) => {
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [explanationText, setExplanationText] = useState("");

  useEffect(() => {
    if (!highlightSequence || highlightSequence.length === 0) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < highlightSequence.length) {
        setCurrentHighlight(highlightSequence[idx].index);
        if (processExplanation) setExplanationText(processExplanation);
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

  return (
    <div>
      <div style={styles.visualWrapper}>
        <div style={styles.visualColumn}>
          <SingleListVisualization
            data={beforeData}
            title={beforeTitle}
            hoverContext={hoverContextBefore}
            highlightIndex={currentHighlight}
          />
        </div>
        <div style={styles.visualColumn}>
          <SingleListVisualization
            data={afterData}
            title={afterTitle}
            hoverContext={hoverContextAfter}
            highlightIndex={currentHighlight}
          />
        </div>
      </div>
      {explanationText && (
        <div style={{
          width: "100%",
          marginTop: "10px",
          backgroundColor: "#e8f1ff",
          padding: "10px",
          borderRadius: "8px",
          fontSize: "13px",
          borderLeft: "4px solid #306998",
        }}>
          <strong>📖 Proses animasi:</strong> {explanationText}
        </div>
      )}
    </div>
  );
};

// ================= KOMPONEN CODE EDITOR DENGAN VISUALISASI =================
const CodeEditorWithVisual = ({
  code,
  title,
  beforeData,
  afterData,
  beforeTitle,
  afterTitle,
  hoverContextBefore,
  hoverContextAfter,
  pyodideReady,
  runPythonCode,
  explanationText = "",
}) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const [highlightSequence, setHighlightSequence] = useState([]);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setIsRunning(true);
    setShowVisual(false);
    const result = await runPythonCode(code);
    setOutput(result);
    setIsRunning(false);
    setShowVisual(true);
    const indices = afterData.map((_, i) => i);
    setHighlightSequence(indices.map(i => ({ index: i })));
    setTimeout(() => setHighlightSequence([]), 3000);
  }, [pyodideReady, code, runPythonCode, afterData]);

  return (
    <div style={styles.codeEditorContainer}>
      {/* Header: Contoh Kode Program */}
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button
          style={styles.runButton}
          onClick={handleRun}
          disabled={!pyodideReady || isRunning}
        >
          {isRunning
            ? "⏳ Menjalankan..."
            : pyodideReady
            ? "▶ Jalankan"
            : "⏳ Memuat..."}
        </button>
      </div>
      {/* Area kode program */}
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>{code}</pre>
      </div>

      {/* Bar pemisah Visualisasi Kode Program */}
      <div style={styles.visualHeader}>
        📊 Visualisasi Kode Program
      </div>
      {/* Area visualisasi (seperti area output) */}
      <div style={styles.visualArea}>
        {showVisual ? (
          <BeforeAfterVisualization
            beforeData={beforeData}
            afterData={afterData}
            beforeTitle={beforeTitle}
            afterTitle={afterTitle}
            hoverContextBefore={hoverContextBefore}
            hoverContextAfter={hoverContextAfter}
            highlightSequence={highlightSequence}
            processExplanation={explanationText}
          />
        ) : (
          <div style={styles.visualPlaceholder}>
            (Klik 'Jalankan' untuk melihat hasil)
          </div>
        )}
      </div>

      {/* Bar Output Program */}
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output Program</span>
      </div>
      {/* Area output program */}
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>
          {output || "(Klik 'Jalankan' untuk melihat hasil)"}
        </pre>
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

  const handleChange = (e) => {
    setLocalCode(e.target.value);
    setError("");
  };

  const validateAndRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setOutput("");
    setError("");
    setIsRunning(true);

    const trimmed = localCode.trim();
    if (!trimmed.includes("belanja =")) {
      setError("❌ ERROR: Buat variabel 'belanja' dengan isi ['apel','jeruk','mangga'].");
      setIsRunning(false);
      return;
    }
    const regex = /belanja\s*=\s*\[\s*["']apel["']\s*,\s*["']jeruk["']\s*,\s*["']mangga["']\s*\]/;
    if (!regex.test(trimmed)) {
      setError("❌ ERROR: Isi list harus ['apel', 'jeruk', 'mangga'].");
      setIsRunning(false);
      return;
    }
    if (!/belanja\.append\s*\(\s*["']pisang["']\s*\)/.test(trimmed)) {
      setError("❌ ERROR: Tambahkan 'pisang' dengan belanja.append('pisang').");
      setIsRunning(false);
      return;
    }
    if (!/belanja\.remove\s*\(\s*["']jeruk["']\s*\)/.test(trimmed)) {
      setError("❌ ERROR: Hapus 'jeruk' dengan belanja.remove('jeruk').");
      setIsRunning(false);
      return;
    }
    if (!/print\s*\(\s*belanja\s*\)/.test(trimmed)) {
      setError("❌ ERROR: Cetak list akhir dengan print(belanja).");
      setIsRunning(false);
      return;
    }

    const result = await runPythonCode(localCode);
    setOutput(result);
    if (
      result.includes("apel") &&
      result.includes("mangga") &&
      result.includes("pisang") &&
      !result.includes("jeruk")
    ) {
      setOutput(result + "\n\n✅ SELAMAT! Jawaban kamu BENAR!");
    } else {
      setOutput(
        result + "\n\n⚠️ Output tidak sesuai. Pastikan list berisi ['apel','mangga','pisang']."
      );
    }
    setIsRunning(false);
  }, [localCode, pyodideReady, runPythonCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button
          style={styles.runButton}
          onClick={validateAndRun}
          disabled={!pyodideReady || isRunning}
        >
          {isRunning
            ? "⏳ Menjalankan..."
            : pyodideReady
            ? "▶ Jalankan"
            : "⏳ Memuat..."}
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
        <pre style={styles.outputContent}>
          {output || "(Klik 'Jalankan' untuk melihat hasil)"}
        </pre>
      </div>
    </div>
  );
};

// ================= KOMPONEN DRAG-N-DROP MATCHING =================
const DragDropMatching = ({ items, resetTrigger }) => {
  const [functions, setFunctions] = useState(() =>
    items.map((item, idx) => ({ id: idx, text: item.func, matched: false }))
  );
  const [descriptions, setDescriptions] = useState(() =>
    items.map((item, idx) => ({ id: idx, text: item.desc, matched: false }))
  );
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setFunctions(
      items.map((item, idx) => ({ id: idx, text: item.func, matched: false }))
    );
    setDescriptions(
      items.map((item, idx) => ({ id: idx, text: item.desc, matched: false }))
    );
    setFeedback("");
  }, [resetTrigger, items]);

  const handleDragStart = (e, funcId) => {
    e.dataTransfer.setData("text/plain", funcId);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e, descId) => {
    e.preventDefault();
    const funcId = parseInt(e.dataTransfer.getData("text/plain"));
    const func = functions.find((f) => f.id === funcId);
    const desc = descriptions.find((d) => d.id === descId);
    if (!func || !desc || func.matched || desc.matched) {
      setFeedback("❌ Salah satu sudah dipasangkan!");
      return;
    }
    if (func.id === desc.id) {
      setFunctions((prev) =>
        prev.map((f) => (f.id === funcId ? { ...f, matched: true } : f))
      );
      setDescriptions((prev) =>
        prev.map((d) => (d.id === descId ? { ...d, matched: true } : d))
      );
      setFeedback("");
    } else {
      setFeedback(
        `❌ Salah! '${func.text}' tidak cocok dengan '${desc.text}'. Coba lagi.`
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const allMatched = functions.every((f) => f.matched);

  return (
    <div>
      <div style={styles.matchingContainer}>
        <div style={styles.matchingColumn}>
          <div style={styles.matchingTitle}>📌 Fungsi/Method List</div>
          {functions.map((func) => (
            <div
              key={func.id}
              draggable={!func.matched}
              onDragStart={(e) => handleDragStart(e, func.id)}
              style={{
                ...styles.dragItem,
                backgroundColor: func.matched ? "#6c757d" : "#306998",
                opacity: func.matched ? 0.6 : 1,
              }}
            >
              {func.text}
            </div>
          ))}
        </div>
        <div style={styles.matchingColumn}>
          <div style={styles.matchingTitle}>🎯 Kegunaan</div>
          {descriptions.map((desc) => (
            <div
              key={desc.id}
              onDrop={(e) => handleDrop(e, desc.id)}
              onDragOver={handleDragOver}
              style={{
                ...styles.dropZone,
                ...(desc.matched ? styles.dropZoneFilled : {}),
                backgroundColor: desc.matched ? "#d1e7dd" : "#e9ecef",
              }}
            >
              {desc.matched ? `✅ ${desc.text}` : desc.text}
            </div>
          ))}
        </div>
      </div>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
      {allMatched && (
        <div
          style={{
            ...styles.feedback,
            backgroundColor: "#d1e7dd",
            color: "#0f5132",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          🎉 Selamat! Semua jawaban benar!
        </div>
      )}
    </div>
  );
};

// ================= KOMPONEN UTAMA =================
export default function OperasiManipulasiList() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [resetMatching, setResetMatching] = useState(0);

  // State eksplorasi
  const [eksplorasiTempAnswers, setEksplorasiTempAnswers] = useState([null, null]);
  const [eksplorasiSavedAnswers, setEksplorasiSavedAnswers] = useState([null, null]);
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", ""]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const eksplorasiQuestions = [
    {
      text: "Method apa yang digunakan untuk menambahkan elemen di akhir list?",
      options: ["insert()", "append()", "extend()", "add()"],
      correct: 1,
    },
    {
      text: "Apa fungsi dari method `remove()` pada list?",
      options: [
        "Menghapus elemen berdasarkan indeks",
        "Menghapus elemen berdasarkan nilai pertama yang cocok",
        "Menghapus semua elemen",
        "Menghapus elemen terakhir",
      ],
      correct: 1,
    },
  ];

  const checkEksplorasiAnswer = (questionIdx) => {
    const selected = eksplorasiTempAnswers[questionIdx];
    if (selected === null) {
      setEksplorasiFeedback((prev) => {
        const newF = [...prev];
        newF[questionIdx] = "❌ Pilih jawaban terlebih dahulu!";
        return newF;
      });
      return;
    }
    const isCorrect = selected === eksplorasiQuestions[questionIdx].correct;
    if (isCorrect) {
      const newSaved = [...eksplorasiSavedAnswers];
      newSaved[questionIdx] = selected;
      setEksplorasiSavedAnswers(newSaved);
      setEksplorasiFeedback((prev) => {
        const newF = [...prev];
        newF[questionIdx] = "✅ Benar! Jawaban tersimpan.";
        return newF;
      });
    } else {
      setEksplorasiFeedback((prev) => {
        const newF = [...prev];
        newF[questionIdx] = "❌ Salah. Coba lagi!";
        return newF;
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
      const newF = [...prev];
      newF[questionIdx] = "";
      return newF;
    });
  };

  // ================= DATA UNTUK VISUALISASI =================
  const concatBefore = [1, 2, 3];
  const concatAfter = [1, 2, 3, 4, 5, 6];
  const repeatBefore = [1, 2, 3];
  const repeatAfter = [1, 2, 3, 1, 2, 3, 1, 2, 3];
  const searchBefore = ["apel", "jeruk", "mangga"];
  const searchAfter = ["apel", "jeruk", "mangga"];
  const sortBefore = [5, 3, 8, 1, 7, 2];
  const sortAfter = [1, 2, 3, 5, 7, 8];
  const appendBefore = ["durian", "nanas", "mangga", "rambutan"];
  const appendAfter = ["durian", "nanas", "mangga", "rambutan", "alpukat"];
  const insertBefore = ["durian", "nanas", "mangga", "rambutan"];
  const insertAfter = ["durian", "alpukat", "nanas", "mangga", "rambutan"];
  const extendBefore = ["durian", "nanas", "mangga", "rambutan"];
  const extendAfter = [
    "durian",
    "nanas",
    "mangga",
    "rambutan",
    "salak",
    "jeruk",
    "manggis",
  ];
  const removeBefore = ["durian", "nanas", "mangga", "rambutan", "jeruk"];
  const removeAfter = ["durian", "nanas", "mangga", "rambutan"];
  const popBefore = ["durian", "nanas", "mangga", "rambutan"];
  const popAfter = ["durian", "nanas", "rambutan"];
  const changeBefore = ["durian", "nanas", "mangga", "rambutan"];
  const changeAfter = ["durian", "nanas", "mangga", "belimbing"];
  const reverseBefore = [1, 2, 3, 4];
  const reverseAfter = [4, 3, 2, 1];
  const clearBefore = [1, 2, 3];
  const clearAfter = [];
  const copyBefore = [1, 2, 3];
  const copyAfter = [1, 2, 3];
  const countBefore = [1, 2, 2, 3];
  const countAfter = [1, 2, 2, 3];
  const indexBefore = [10, 20, 30, 20];
  const indexAfter = [10, 20, 30, 20];
  const slicingBefore = [10, 20, 30, 40, 50];
  const slicingAfter = [20, 30, 40];
  const delBefore = [10, 20, 30, 40];
  const delAfter = [10, 40];
  const lengthBefore = [1, 2, 3, 4];
  const lengthAfter = [1, 2, 3, 4];

  // Hover context
  const concatHoverBefore = { 0: "Elemen 1 dari a", 1: "Elemen 2", 2: "Elemen 3" };
  const concatHoverAfter = {
    0: "Dari a",
    1: "Dari a",
    2: "Dari a",
    3: "Dari b (4)",
    4: "Dari b (5)",
    5: "Dari b (6)",
  };
  const repeatHoverBefore = { 0: "1", 1: "2", 2: "3" };
  const repeatHoverAfter = {
    0: "ulangan1",
    1: "ulangan1",
    2: "ulangan1",
    3: "ulangan2",
    4: "ulangan2",
    5: "ulangan2",
    6: "ulangan3",
    7: "ulangan3",
    8: "ulangan3",
  };
  const searchHoverBefore = {
    0: "🔎 'apel' bukan 'mangga'",
    1: "🔎 'jeruk' bukan",
    2: "🔎 'mangga' ditemukan → True",
  };
  const searchHoverAfter = {};
  const sortHoverBefore = { 0: "5", 1: "3", 2: "8", 3: "1", 4: "7", 5: "2" };
  const sortHoverAfter = { 0: "terkecil 1", 1: "2", 2: "3", 3: "5", 4: "7", 5: "8" };
  const appendHoverBefore = { 0: "durian", 1: "nanas", 2: "mangga", 3: "rambutan" };
  const appendHoverAfter = {
    0: "durian",
    1: "nanas",
    2: "mangga",
    3: "rambutan",
    4: "alpukat (baru)",
  };
  const insertHoverBefore = { 0: "durian", 1: "nanas", 2: "mangga", 3: "rambutan" };
  const insertHoverAfter = {
    0: "durian",
    1: "alpukat (disisip)",
    2: "nanas",
    3: "mangga",
    4: "rambutan",
  };
  const extendHoverBefore = { 0: "durian", 1: "nanas", 2: "mangga", 3: "rambutan" };
  const extendHoverAfter = {
    0: "durian",
    1: "nanas",
    2: "mangga",
    3: "rambutan",
    4: "salak",
    5: "jeruk",
    6: "manggis",
  };
  const removeHoverBefore = {
    0: "durian",
    1: "nanas",
    2: "mangga",
    3: "rambutan",
    4: "jeruk (akan dihapus)",
  };
  const removeHoverAfter = { 0: "durian", 1: "nanas", 2: "mangga", 3: "rambutan" };
  const popHoverBefore = {
    0: "durian",
    1: "nanas",
    2: "mangga (akan dihapus)",
    3: "rambutan",
  };
  const popHoverAfter = { 0: "durian", 1: "nanas", 2: "rambutan" };
  const changeHoverBefore = {
    0: "durian",
    1: "nanas",
    2: "mangga",
    3: "rambutan (akan diubah)",
  };
  const changeHoverAfter = { 0: "durian", 1: "nanas", 2: "mangga", 3: "belimbing" };
  const reverseHoverBefore = { 0: "1", 1: "2", 2: "3", 3: "4" };
  const reverseHoverAfter = { 0: "4", 1: "3", 2: "2", 3: "1" };
  const clearHoverBefore = { 0: "1", 1: "2", 2: "3" };
  const clearHoverAfter = {};
  const copyHoverBefore = { 0: "1", 1: "2", 2: "3" };
  const copyHoverAfter = { 0: "1 (salinan)", 1: "2 (salinan)", 2: "3 (salinan)" };
  const countHoverBefore = { 0: "1", 1: "2", 2: "2", 3: "3" };
  const countHoverAfter = { 0: "1", 1: "2", 2: "2", 3: "3" };
  const indexHoverBefore = { 0: "10", 1: "20", 2: "30", 3: "20" };
  const indexHoverAfter = { 0: "10", 1: "20", 2: "30", 3: "20" };
  const slicingHoverBefore = { 0: "10", 1: "20", 2: "30", 3: "40", 4: "50" };
  const slicingHoverAfter = { 0: "20 (indeks 1)", 1: "30 (indeks 2)", 2: "40 (indeks 3)" };
  const delHoverBefore = { 0: "10", 1: "20 (akan dihapus)", 2: "30 (akan dihapus)", 3: "40" };
  const delHoverAfter = { 0: "10", 1: "40" };
  const lengthHoverBefore = { 0: "1", 1: "2", 2: "3", 3: "4" };
  const lengthHoverAfter = { 0: "1", 1: "2", 2: "3", 3: "4" };

  // Kode contoh
  const codeExamples = {
    concat: `a = [1, 2, 3]\nb = [4, 5, 6]\nc = a + b\nprint(c)`,
    repeat: `data = [1, 2, 3]\nprint(data * 3)`,
    search: `buah = ["apel", "jeruk", "mangga"]\nprint("mangga" in buah)\nprint("pisang" in buah)`,
    sort: `angka = [5, 3, 8, 1, 7, 2]\nangka.sort()\nprint(angka)`,
    append: `buah = ["durian", "nanas", "mangga", "rambutan"]\nbuah.append("alpukat")\nprint(buah)`,
    insert: `buah = ["durian", "nanas", "mangga", "rambutan"]\nbuah.insert(1, "alpukat")\nprint(buah)`,
    extend: `buah = ["durian", "nanas", "mangga", "rambutan"]\nbuah.extend(["salak", "jeruk", "manggis"])\nprint(buah)`,
    remove: `buah = ["durian", "nanas", "mangga", "rambutan", "jeruk"]\nbuah.remove("jeruk")\nprint(buah)`,
    pop: `buah = ["durian", "nanas", "mangga", "rambutan"]\nbuah.pop(2)\nprint(buah)`,
    change: `buah = ["durian", "nanas", "mangga", "rambutan"]\nbuah[3] = "belimbing"\nprint(buah)`,
    reverse: `angka = [1, 2, 3, 4]\nangka.reverse()\nprint(angka)`,
    clear: `data = [1, 2, 3]\ndata.clear()\nprint(data)`,
    copy: `asli = [1, 2, 3]\nsalinan = asli.copy()\nprint(salinan)`,
    count: `data = [1, 2, 2, 3]\nprint(data.count(2))`,
    index: `data = [10, 20, 30, 20]\nprint(data.index(20))`,
    slicing: `angka = [10, 20, 30, 40, 50]\nprint(angka[1:4])`,
    del_example: `angka = [10, 20, 30, 40]\ndel angka[1:3]\nprint(angka)`,
    length: `buah = ["durian", "nanas", "mangga", "rambutan"]\nprint(len(buah))`,
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

  const matchingItems = [
    { func: "append()", desc: "Menambah elemen di akhir list" },
    { func: "insert()", desc: "Menyisipkan elemen pada posisi tertentu" },
    { func: "extend()", desc: "Menambah beberapa elemen sekaligus" },
    { func: "remove()", desc: "Menghapus elemen berdasarkan nilai pertama yang cocok" },
    { func: "pop()", desc: "Menghapus elemen berdasarkan indeks dan mengembalikannya" },
    { func: "sort()", desc: "Mengurutkan list secara ascending" },
    { func: "reverse()", desc: "Membalik urutan list" },
    { func: "clear()", desc: "Menghapus semua elemen" },
    { func: "copy()", desc: "Membuat salinan list" },
    { func: "count()", desc: "Menghitung jumlah kemunculan nilai" },
    { func: "index()", desc: "Mencari indeks pertama dari nilai" },
  ];

  const resetMatchingGame = () => setResetMatching((prev) => prev + 1);

  return (
    <>
      <Navbar />
      <SidebarMateri />
      <div className="main-content" style={{ paddingTop: "64px" }}>
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>OPERASI DAN MANIPULASI LIST</h1>
            <p style={styles.headerSubtitle}>
              Belajar Mengubah, Menambah, Menghapus, dan Mengelola Data dalam List
            </p>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🎯 Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>
                  Memahami berbagai operasi dasar list (concatenation, repetition,
                  slicing, keanggotaan).
                </li>
                <li>
                  Menguasai method manipulasi list (append, insert, extend, remove,
                  pop, sort, reverse, clear, copy, count, index).
                </li>
                <li>
                  Mampu mengubah, menghapus, dan mengakses elemen list dengan indeks
                  dan slicing.
                </li>
                <li>
                  Menerapkan operasi pada nested list dan menggunakan fungsi len().
                </li>
              </ol>
            </div>
          </section>

          {/* EKSPLORASI AWAL */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🔍 Eksplorasi Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum belajar lebih dalam, jawab pertanyaan berikut. Pilih jawaban,
                lalu klik "Periksa Jawaban".{" "}
                <strong style={{ color: "#d9534f" }}>
                  {" "}
                  Materi akan terbuka setelah kedua jawaban benar.
                </strong>
              </p>
              {eksplorasiQuestions.map((q, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "30px",
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: "20px",
                  }}
                >
                  <p style={{ fontWeight: "600", marginBottom: "12px" }}>
                    {idx + 1}. {q.text}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        onClick={() => handleTempAnswer(idx, optIdx)}
                        style={{
                          ...styles.eksplorasiOption,
                          backgroundColor:
                            eksplorasiTempAnswers[idx] === optIdx ? "#2fa69a" : "#f9f9f9",
                          color: eksplorasiTempAnswers[idx] === optIdx ? "white" : "#1f2937",
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                  <button
                    style={styles.checkEksplorasiButton}
                    onClick={() => checkEksplorasiAnswer(idx)}
                  >
                    Periksa Jawaban
                  </button>
                  {eksplorasiFeedback[idx] && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: eksplorasiFeedback[idx].includes("Benar")
                          ? "#d1e7dd"
                          : "#f8d7da",
                      }}
                    >
                      {eksplorasiFeedback[idx]}
                    </div>
                  )}
                </div>
              ))}
              {!isEksplorasiCompleted && (
                <div style={styles.lockMessage}>
                  🔒 Materi terkunci. Jawab kedua pertanyaan dengan benar.
                </div>
              )}
            </div>
          </section>

          {/* MATERI UTAMA */}
          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>📊 Operasi Dasar List</h2>
                <div style={styles.card}>
                  <h3>1. Concatenation (+)</h3>
                  <p>Menggabungkan dua list menjadi list baru.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.concat}
                    title="Contoh: Penggabungan List"
                    beforeData={concatBefore}
                    afterData={concatAfter}
                    beforeTitle="Sebelum (a dan b)"
                    afterTitle="Setelah (a+b)"
                    hoverContextBefore={concatHoverBefore}
                    hoverContextAfter={concatHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="➕ a + b menggabungkan semua elemen a lalu b."
                  />

                  <h3>2. Repetition (*)</h3>
                  <p>Mengulang list sebanyak n kali.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.repeat}
                    title="Contoh: Pengulangan List"
                    beforeData={repeatBefore}
                    afterData={repeatAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah *3"
                    hoverContextBefore={repeatHoverBefore}
                    hoverContextAfter={repeatHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="🔄 data * 3 menghasilkan list baru dengan tiga salinan."
                  />

                  <h3>3. Slicing (:)</h3>
                  <p>Mengambil sebagian elemen list.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.slicing}
                    title="Contoh: Slicing [1:4]"
                    beforeData={slicingBefore}
                    afterData={slicingAfter}
                    beforeTitle="List awal"
                    afterTitle="Hasil slicing [1:4]"
                    hoverContextBefore={slicingHoverBefore}
                    hoverContextAfter={slicingHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="✂️ Slicing [1:4] mengambil indeks 1,2,3 (20,30,40)."
                  />

                  <h3>4. Pencarian (in)</h3>
                  <p>Memeriksa keberadaan elemen dalam list.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.search}
                    title="Contoh: Operator in"
                    beforeData={searchBefore}
                    afterData={searchAfter}
                    beforeTitle="List buah"
                    afterTitle="List (tetap)"
                    hoverContextBefore={searchHoverBefore}
                    hoverContextAfter={searchHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="🔍 'mangga' in buah → True, 'pisang' → False."
                  />

                  <h3>5. Pengurutan (sort())</h3>
                  <p>Mengurutkan list secara ascending (permanen).</p>
                  <CodeEditorWithVisual
                    code={codeExamples.sort}
                    title="Contoh: sort()"
                    beforeData={sortBefore}
                    afterData={sortAfter}
                    beforeTitle="Sebelum diurutkan"
                    afterTitle="Setelah sort()"
                    hoverContextBefore={sortHoverBefore}
                    hoverContextAfter={sortHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="📊 sort() mengurutkan list menjadi [1,2,3,5,7,8]."
                  />

                  <h3>6. Pembalikan (reverse())</h3>
                  <p>Membalik urutan list.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.reverse}
                    title="Contoh: reverse()"
                    beforeData={reverseBefore}
                    afterData={reverseAfter}
                    beforeTitle="Sebelum reverse"
                    afterTitle="Setelah reverse()"
                    hoverContextBefore={reverseHoverBefore}
                    hoverContextAfter={reverseHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="🔄 reverse() membalik urutan list."
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  ✏️ Manipulasi List (Menambah, Menghapus, Mengubah)
                </h2>
                <div style={styles.card}>
                  <h3>append() – Tambah di akhir</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.append}
                    title="append()"
                    beforeData={appendBefore}
                    afterData={appendAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah append('alpukat')"
                    hoverContextBefore={appendHoverBefore}
                    hoverContextAfter={appendHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="➕ append('alpukat') menambah di indeks terakhir."
                  />

                  <h3>insert() – Sisip di posisi tertentu</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.insert}
                    title="insert()"
                    beforeData={insertBefore}
                    afterData={insertAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah insert(1,'alpukat')"
                    hoverContextBefore={insertHoverBefore}
                    hoverContextAfter={insertHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="📍 insert(1,'alpukat') menyisip di indeks 1."
                  />

                  <h3>extend() – Tambah banyak elemen</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.extend}
                    title="extend()"
                    beforeData={extendBefore}
                    afterData={extendAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah extend()"
                    hoverContextBefore={extendHoverBefore}
                    hoverContextAfter={extendHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="🔗 extend(['salak','jeruk','manggis']) menambah tiga elemen di akhir."
                  />

                  <h3>remove() – Hapus berdasarkan nilai</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.remove}
                    title="remove()"
                    beforeData={removeBefore}
                    afterData={removeAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah remove('jeruk')"
                    hoverContextBefore={removeHoverBefore}
                    hoverContextAfter={removeHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="✂️ remove('jeruk') menghapus elemen bernilai 'jeruk' pertama."
                  />

                  <h3>pop() – Hapus berdasarkan indeks</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.pop}
                    title="pop()"
                    beforeData={popBefore}
                    afterData={popAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah pop(2)"
                    hoverContextBefore={popHoverBefore}
                    hoverContextAfter={popHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="🗑️ pop(2) menghapus elemen indeks 2 ('mangga')."
                  />

                  <h3>Mengubah elemen dengan indeks</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.change}
                    title="Ubah Elemen"
                    beforeData={changeBefore}
                    afterData={changeAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah buah[3]='belimbing'"
                    hoverContextBefore={changeHoverBefore}
                    hoverContextAfter={changeHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="✏️ buah[3] = 'belimbing' mengubah nilai indeks 3."
                  />

                  <h3>del – Hapus dengan slicing</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.del_example}
                    title="del"
                    beforeData={delBefore}
                    afterData={delAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah del angka[1:3]"
                    hoverContextBefore={delHoverBefore}
                    hoverContextAfter={delHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="❌ del angka[1:3] menghapus indeks 1 dan 2."
                  />

                  <h3>clear() – Hapus semua elemen</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.clear}
                    title="clear()"
                    beforeData={clearBefore}
                    afterData={clearAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah clear()"
                    hoverContextBefore={clearHoverBefore}
                    hoverContextAfter={clearHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="🧹 clear() menghapus semua elemen."
                  />

                  <h3>copy() – Membuat salinan</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.copy}
                    title="copy()"
                    beforeData={copyBefore}
                    afterData={copyAfter}
                    beforeTitle="List asli"
                    afterTitle="Salinan (copy)"
                    hoverContextBefore={copyHoverBefore}
                    hoverContextAfter={copyHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="📑 copy() membuat salinan list baru."
                  />

                  <h3>count() – Menghitung kemunculan nilai</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.count}
                    title="count()"
                    beforeData={countBefore}
                    afterData={countAfter}
                    beforeTitle="List"
                    afterTitle="List (sama)"
                    hoverContextBefore={countHoverBefore}
                    hoverContextAfter={countHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="🔢 count(2) mengembalikan jumlah kemunculan 2."
                  />

                  <h3>index() – Mencari indeks pertama</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.index}
                    title="index()"
                    beforeData={indexBefore}
                    afterData={indexAfter}
                    beforeTitle="List"
                    afterTitle="List (sama)"
                    hoverContextBefore={indexHoverBefore}
                    hoverContextAfter={indexHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="🔍 index(20) mengembalikan indeks pertama nilai 20."
                  />

                  <h3>len() – Panjang list</h3>
                  <CodeEditorWithVisual
                    code={codeExamples.length}
                    title="len()"
                    beforeData={lengthBefore}
                    afterData={lengthAfter}
                    beforeTitle="List"
                    afterTitle="List (sama)"
                    hoverContextBefore={lengthHoverBefore}
                    hoverContextAfter={lengthHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    explanationText="📏 len() mengembalikan jumlah elemen."
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>💻 Latihan Praktik</h2>
                <div style={styles.card}>
                  <p>
                    <strong>Studi Kasus: Manajemen Daftar Belanja</strong>
                  </p>
                  <ol>
                    <li>Buat list <code>belanja = ["apel", "jeruk", "mangga"]</code>.</li>
                    <li>Tambahkan "pisang" di akhir.</li>
                    <li>Hapus "jeruk".</li>
                    <li>Cetak list akhir.</li>
                  </ol>
                  <CodeEditorEditable
                    title="Latihan Daftar Belanja"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  🧩 Latihan Interaktif: Drag & Drop Matching
                </h2>
                <div style={styles.card}>
                  <p>Seret fungsi/method list ke kegunaan yang sesuai.</p>
                  <DragDropMatching items={matchingItems} resetTrigger={resetMatching} />
                  <button style={styles.resetMatchingButton} onClick={resetMatchingGame}>
                    ↻ Reset Matching
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}