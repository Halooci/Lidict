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
  dropZoneWrong: {
    backgroundColor: "#f8d7da",
    border: "2px solid #dc3545",
    color: "#721c24",
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
    marginRight: "10px",
  },
  checkMatchingButton: {
    backgroundColor: "#28a745",
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
const SingleListVisualization = ({ data, title, hoverContext = {}, highlightIndex = null, highlightPair = [], changedIndices = [], explanation = "", extraBadge = null, hideIndices = false, disableHover = false }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const negativeIndices = data.map((_, i) => -(data.length - i));

  const getHoverExplanation = (idx, item) => {
    if (disableHover) return null;
    if (highlightPair.includes(idx) && explanation) {
      return `📖 ${explanation}`;
    }
    if (idx === highlightIndex && explanation) {
      return `📖 ${explanation}`;
    }
    const customMsg = hoverContext[idx];
    if (customMsg) return customMsg;
    return `📌 Elemen: "${item}"\n✅ Indeks positif: ${idx} → data[${idx}]\n✅ Indeks negatif: ${negativeIndices[idx]} → data[${negativeIndices[idx]}]`;
  };

  const getBgColor = (idx) => {
    if (highlightPair.includes(idx)) return "#FFD43B";
    if (highlightIndex === idx) return "#FFD43B";
    if (changedIndices.includes(idx)) return "#28a745";
    if (hoveredIndex === idx && !disableHover) return "#FFA500";
    return "#306998";
  };

  const getTextColor = (idx) => {
    if (highlightPair.includes(idx) || highlightIndex === idx || changedIndices.includes(idx) || (hoveredIndex === idx && !disableHover)) return "#1f2937";
    return "white";
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
            style={{ textAlign: "center", position: "relative" }}
            onMouseEnter={() => !disableHover && setHoveredIndex(idx)}
            onMouseLeave={() => !disableHover && setHoveredIndex(null)}
          >
            <div style={{
              width: "70px",
              padding: "10px 5px",
              borderRadius: "8px",
              fontWeight: "500",
              marginBottom: "5px",
              fontSize: "13px",
              backgroundColor: getBgColor(idx),
              color: getTextColor(idx),
              transform: (highlightPair.includes(idx) || highlightIndex === idx || changedIndices.includes(idx) || (hoveredIndex === idx && !disableHover)) ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s ease",
              cursor: !disableHover ? "pointer" : "default",
              border: changedIndices.includes(idx) ? "2px solid #ffc107" : "none",
            }}>
              <div>{String(item)}</div>
            </div>
            {!hideIndices && (
              <>
                <div style={{ fontSize: "10px", color: "#555" }}>Indeks +{idx}</div>
                <div style={{ fontSize: "10px", color: "#888" }}>Indeks {negativeIndices[idx]}</div>
              </>
            )}
            {changedIndices.includes(idx) && (
              <div style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#28a745",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}>✓</div>
            )}
          </div>
        ))}
      </div>
      {!disableHover && hoveredIndex !== null && (
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
      {explanation && highlightIndex === null && highlightPair.length === 0 && !disableHover && (
        <div style={{
          backgroundColor: "#e8f1ff",
          padding: "10px",
          borderRadius: "8px",
          marginTop: "10px",
          fontSize: "13px",
          color: "#1f2937",
          borderLeft: "4px solid #306998",
        }}>
          {explanation}
        </div>
      )}
      {extraBadge && (
        <div style={{
          backgroundColor: "#d4edda",
          padding: "8px",
          borderRadius: "8px",
          marginTop: "10px",
          fontSize: "13px",
          textAlign: "center",
          color: "#155724",
          fontWeight: "bold",
        }}>
          {extraBadge}
        </div>
      )}
    </div>
  );
};

// ================= KOMPONEN UNTUK MENAMPILKAN DUA LIST SEBELUM (CONCAT) =================
const DoubleBeforeVisualization = ({ dataA, dataB, titleA, titleB, hoverContextA, hoverContextB, highlightIndexA, highlightIndexB, highlightPairA, highlightPairB, changedIndicesA, changedIndicesB, explanation }) => {
  return (
    <div style={styles.visualWrapper}>
      <div style={styles.visualColumn}>
        <SingleListVisualization
          data={dataA}
          title={titleA}
          hoverContext={hoverContextA}
          highlightIndex={highlightIndexA}
          highlightPair={highlightPairA}
          changedIndices={changedIndicesA}
          explanation={explanation}
        />
      </div>
      <div style={styles.visualColumn}>
        <SingleListVisualization
          data={dataB}
          title={titleB}
          hoverContext={hoverContextB}
          highlightIndex={highlightIndexB}
          highlightPair={highlightPairB}
          changedIndices={changedIndicesB}
          explanation={explanation}
        />
      </div>
    </div>
  );
};

// ================= KOMPONEN UTAMA DENGAN ANIMASI =================
const AnimatedVisualization = ({ beforeData, afterData, beforeTitle, afterTitle, hoverContextBefore, hoverContextAfter, animationSteps, operationName, extraAfterBadge = null, beforeDataDouble = null }) => {
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [currentHighlightPair, setCurrentHighlightPair] = useState([]);
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [showExtraBadge, setShowExtraBadge] = useState(false);
  
  const [highlightA, setHighlightA] = useState(null);
  const [highlightB, setHighlightB] = useState(null);
  const [highlightPairA, setHighlightPairA] = useState([]);
  const [highlightPairB, setHighlightPairB] = useState([]);
  const [highlightBefore, setHighlightBefore] = useState(null);
  const [highlightAfter, setHighlightAfter] = useState(null);
  const [highlightBeforePair, setHighlightBeforePair] = useState([]);
  const [highlightAfterPair, setHighlightAfterPair] = useState([]);

  const defaultChangedIndicesBefore = (() => {
    if (!beforeData) return [];
    const changed = [];
    const maxLen = Math.max(beforeData.length, afterData.length);
    for (let i = 0; i < maxLen; i++) {
      if (beforeData[i] !== afterData[i]) changed.push(i);
    }
    if (afterData.length > beforeData.length) {
      for (let i = beforeData.length; i < afterData.length; i++) changed.push(i);
    }
    return changed;
  })();
  const defaultChangedIndicesAfter = defaultChangedIndicesBefore;

  let changedIndicesBefore = defaultChangedIndicesBefore;
  let changedIndicesAfter = defaultChangedIndicesAfter;
  if (operationName === 'insert') {
    changedIndicesAfter = [1];
    changedIndicesBefore = [];
  } else if (operationName === 'pop' || operationName === 'remove' || operationName === 'change' || operationName === 'del' || operationName === 'clear' || operationName === 'count' || operationName === 'index' || operationName === 'length' || operationName === 'search') {
    changedIndicesAfter = [];
    changedIndicesBefore = [];
  }

  const shouldShowDiff = () => {
    if (operationName === 'concat') return false;
    if (operationName === 'repeat') return false;
    if (operationName === 'slicing') return false;
    if (operationName === 'sort') return false;
    if (operationName === 'reverse') return false;
    if (operationName === 'pop') return false;
    if (operationName === 'remove') return false;
    if (operationName === 'change') return false;
    if (operationName === 'del') return false;
    if (operationName === 'clear') return false;
    if (operationName === 'count') return false;
    if (operationName === 'index') return false;
    if (operationName === 'length') return false;
    if (operationName === 'search') return false;
    return true;
  };

  useEffect(() => {
    if (!animationSteps || animationSteps.length === 0) return;
    let stepIdx = 0;
    setShowDiff(false);
    setShowExtraBadge(false);
    setHighlightBeforePair([]);
    setHighlightAfterPair([]);
    const interval = setInterval(() => {
      if (stepIdx < animationSteps.length) {
        const step = animationSteps[stepIdx];
        if (operationName === 'slicing') {
          setHighlightBefore(step.highlightIndex + 1);
          setHighlightAfter(step.highlightIndex);
          setCurrentHighlight(null);
        } 
        else if (operationName === 'sort') {
          setHighlightBefore(step.highlightIndex);
          const targetValue = beforeData[step.highlightIndex];
          const afterIndex = afterData.findIndex(val => val === targetValue);
          setHighlightAfter(afterIndex);
          setCurrentHighlight(null);
        }
        else if (operationName === 'reverse') {
          if (step.pair) {
            setHighlightBeforePair(step.pair);
            setHighlightAfterPair(step.pair);
            setCurrentHighlight(null);
          }
        }
        else if (operationName === 'del') {
          setCurrentHighlight(step.highlightIndex);
          setHighlightBefore(null);
          setHighlightAfter(null);
        }
        else if (operationName === 'count') {
          setCurrentHighlight(step.highlightIndex);
          setHighlightBefore(null);
          setHighlightAfter(null);
        }
        else if (beforeDataDouble) {
          if (step.highlightIndex < 3) {
            setHighlightA(step.highlightIndex);
            setHighlightB(null);
          } else {
            setHighlightA(null);
            setHighlightB(step.highlightIndex - 3);
          }
          setCurrentHighlight(null);
        }
        else {
          setCurrentHighlight(step.highlightIndex);
          setHighlightBefore(null);
          setHighlightAfter(null);
        }
        setCurrentExplanation(step.explanation);
        stepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentHighlight(null);
          setHighlightBefore(null);
          setHighlightAfter(null);
          setHighlightBeforePair([]);
          setHighlightAfterPair([]);
          setHighlightA(null);
          setHighlightB(null);
          setHighlightPairA([]);
          setHighlightPairB([]);
          setCurrentExplanation("");
          if (shouldShowDiff()) {
            setShowDiff(true);
          }
          if (extraAfterBadge) {
            setShowExtraBadge(true);
          }
        }, 500);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [animationSteps, beforeDataDouble, operationName, beforeData, afterData, extraAfterBadge]);

  // Tentukan highlightIndex untuk kolom kanan (setelah)
  let rightHighlightIndex = null;
  let rightHighlightPair = [];
  let rightHideIndices = false;
  let rightDisableHover = false;

  if (operationName === 'slicing') {
    rightHighlightIndex = highlightAfter;
  } else if (operationName === 'sort') {
    rightHighlightIndex = highlightAfter;
  } else if (operationName === 'reverse') {
    rightHighlightPair = highlightAfterPair;
  } else if (operationName === 'pop' || operationName === 'del') {
    rightHighlightIndex = null;
    rightHighlightPair = [];
  } else if (operationName === 'count' || operationName === 'index' || operationName === 'length') {
    rightHighlightIndex = null;
    rightHighlightPair = [];
    rightHideIndices = true;
    rightDisableHover = true;
  } else {
    rightHighlightIndex = currentHighlight;
  }

  return (
    <div>
      <div style={styles.visualWrapper}>
        <div style={styles.visualColumn}>
          {beforeDataDouble ? (
            <DoubleBeforeVisualization
              dataA={beforeDataDouble.dataA}
              dataB={beforeDataDouble.dataB}
              titleA={beforeDataDouble.titleA}
              titleB={beforeDataDouble.titleB}
              hoverContextA={beforeDataDouble.hoverContextA}
              hoverContextB={beforeDataDouble.hoverContextB}
              highlightIndexA={highlightA}
              highlightIndexB={highlightB}
              highlightPairA={highlightPairA}
              highlightPairB={highlightPairB}
              changedIndicesA={showDiff ? changedIndicesBefore : []}
              changedIndicesB={showDiff ? changedIndicesBefore : []}
              explanation={currentExplanation}
            />
          ) : (
            <SingleListVisualization
              data={beforeData}
              title={beforeTitle}
              hoverContext={hoverContextBefore}
              highlightIndex={operationName === 'slicing' ? highlightBefore : (operationName === 'sort' ? highlightBefore : (operationName === 'reverse' ? null : currentHighlight))}
              highlightPair={operationName === 'reverse' ? highlightBeforePair : []}
              changedIndices={showDiff ? changedIndicesBefore : []}
              explanation={currentExplanation}
            />
          )}
        </div>
        <div style={styles.visualColumn}>
          <SingleListVisualization
            data={afterData}
            title={afterTitle}
            hoverContext={hoverContextAfter}
            highlightIndex={rightHighlightIndex}
            highlightPair={rightHighlightPair}
            changedIndices={showDiff ? changedIndicesAfter : []}
            explanation={currentExplanation}
            extraBadge={showExtraBadge ? extraAfterBadge : null}
            hideIndices={rightHideIndices}
            disableHover={rightDisableHover}
          />
        </div>
      </div>
      {!showDiff && currentExplanation && (
        <div style={{
          width: "100%",
          marginTop: "10px",
          backgroundColor: "#e8f1ff",
          padding: "10px",
          borderRadius: "8px",
          fontSize: "13px",
          borderLeft: "4px solid #306998",
        }}>
          <strong>📖 Proses animasi:</strong> {currentExplanation}
        </div>
      )}
      {showDiff && (
        <div style={{
          width: "100%",
          marginTop: "10px",
          backgroundColor: "#d4edda",
          padding: "10px",
          borderRadius: "8px",
          fontSize: "13px",
          borderLeft: "4px solid #28a745",
          textAlign: "center",
        }}>
          ✅ <strong>Perubahan selesai!</strong> Elemen yang berubah ditandai dengan warna hijau dan tanda centang.
        </div>
      )}
    </div>
  );
};

// ================= KOMPONEN CODE EDITOR DENGAN ANIMASI =================
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
  animationSteps,
  operationName,
  extraAfterBadge = null,
  beforeDataDouble = null,
}) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(0);

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
    setTriggerAnimation(prev => prev + 1);
  }, [pyodideReady, code, runPythonCode]);

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
        {showVisual ? (
          <AnimatedVisualization
            key={triggerAnimation}
            beforeData={beforeData}
            afterData={afterData}
            beforeTitle={beforeTitle}
            afterTitle={afterTitle}
            hoverContextBefore={hoverContextBefore}
            hoverContextAfter={hoverContextAfter}
            animationSteps={animationSteps}
            operationName={operationName}
            extraAfterBadge={extraAfterBadge}
            beforeDataDouble={beforeDataDouble}
          />
        ) : (
          <div style={styles.visualPlaceholder}>(Klik 'Jalankan' untuk melihat hasil)</div>
        )}
      </div>
      <div style={styles.outputHeader}><span style={styles.outputTitle}>Output</span></div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik 'Jalankan' untuk melihat hasil)"}</pre>
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
    const regexCreate = /belanja\s*=\s*\[\s*["']apel["']\s*,\s*["']jeruk["']\s*,\s*["']mangga["']\s*\]/;
    if (!regexCreate.test(trimmed)) {
      setError("❌ ERROR: Isi list harus ['apel', 'jeruk', 'mangga'].");
      setIsRunning(false);
      return;
    }
    
    if (!/belanja\.append\s*\(\s*["']pisang["']\s*\)/.test(trimmed)) {
      setError("❌ ERROR: Tambahkan 'pisang' dengan belanja.append('pisang').");
      setIsRunning(false);
      return;
    }
    
    const removeByValue = /belanja\.remove\s*\(\s*["']jeruk["']\s*\)/.test(trimmed);
    const removeByIndex = /belanja\.pop\s*\(\s*1\s*\)/.test(trimmed);
    if (!removeByValue && !removeByIndex) {
      setError("❌ ERROR: Hapus 'jeruk' dengan belanja.remove('jeruk') atau belanja.pop(1).");
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
    if (result.includes("apel") && result.includes("mangga") && result.includes("pisang") && !result.includes("jeruk")) {
      setOutput(result + "\n\n✅ SELAMAT! Jawaban kamu BENAR!");
    } else {
      setOutput(result + "\n\n⚠️ Output tidak sesuai. Pastikan list berisi ['apel','mangga','pisang'].");
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
      <textarea style={styles.codeInputEditable} value={localCode} onChange={handleChange} placeholder="Tulis kode Python di sini..." spellCheck={false} />
      <div style={styles.outputHeader}><span style={styles.outputTitle}>Output</span></div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik 'Jalankan' untuk melihat hasil)"}</pre>
      </div>
    </div>
  );
};

// ================= KOMPONEN DRAG-N-DROP MATCHING DENGAN SATU TOMBOL RESET =================
const DragDropMatching = ({ items, resetTrigger }) => {
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [functions, setFunctions] = useState(() => 
    shuffleArray(items.map((item, idx) => ({ id: idx, text: item.func, matchedDescId: null })))
  );
  const [descriptions, setDescriptions] = useState(() => 
    shuffleArray(items.map((item, idx) => ({ id: idx, text: item.desc, matchedFuncId: null })))
  );
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    setFunctions(shuffleArray(items.map((item, idx) => ({ id: idx, text: item.func, matchedDescId: null }))));
    setDescriptions(shuffleArray(items.map((item, idx) => ({ id: idx, text: item.desc, matchedFuncId: null }))));
    setChecked(false);
    setAllCorrect(false);
    setFeedbackMsg("");
  }, [resetTrigger, items]);

  const handleDragStart = (e, funcId) => {
    e.dataTransfer.setData("text/plain", funcId);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e, descId) => {
    e.preventDefault();
    if (checked) {
      setFeedbackMsg("Silahkan reset jika ingin mengubah pasangan setelah diperiksa.");
      return;
    }
    const funcId = parseInt(e.dataTransfer.getData("text/plain"));
    const func = functions.find(f => f.id === funcId);
    const desc = descriptions.find(d => d.id === descId);
    if (!func || !desc) return;

    if (func.matchedDescId !== null) {
      const oldDescId = func.matchedDescId;
      setDescriptions(prev => prev.map(d => d.id === oldDescId ? { ...d, matchedFuncId: null } : d));
    }
    if (desc.matchedFuncId !== null) {
      const oldFuncId = desc.matchedFuncId;
      setFunctions(prev => prev.map(f => f.id === oldFuncId ? { ...f, matchedDescId: null } : f));
    }
    setFunctions(prev => prev.map(f => f.id === funcId ? { ...f, matchedDescId: descId } : f));
    setDescriptions(prev => prev.map(d => d.id === descId ? { ...d, matchedFuncId: funcId } : d));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleCheck = () => {
    const totalMatched = functions.filter(f => f.matchedDescId !== null).length;
    if (totalMatched !== items.length) {
      setFeedbackMsg(`❌ Belum semua fungsi dipasangkan. (${totalMatched}/${items.length}) Silakan lengkapi semua pasangan terlebih dahulu.`);
      setChecked(false);
      setAllCorrect(false);
      return;
    }
    let correctCount = 0;
    for (const func of functions) {
      if (func.matchedDescId !== null) {
        const matchedDesc = descriptions.find(d => d.id === func.matchedDescId);
        if (matchedDesc && func.id === matchedDesc.id) {
          correctCount++;
        }
      }
    }
    setChecked(true);
    if (correctCount === items.length) {
      setFeedbackMsg("🎉 Selamat! Semua jawaban benar!");
      setAllCorrect(true);
    } else {
      setFeedbackMsg(`❌ Masih ada ${items.length - correctCount} pasangan yang salah. Coba lagi!`);
      setAllCorrect(false);
    }
  };

  const isDescMatchedToCorrectFunc = (desc) => {
    if (!checked) return false;
    if (desc.matchedFuncId === null) return false;
    const matchedFunc = functions.find(f => f.id === desc.matchedFuncId);
    return matchedFunc && matchedFunc.id === desc.id;
  };

  const isFuncMatchedToCorrectDesc = (func) => {
    if (!checked) return false;
    if (func.matchedDescId === null) return false;
    const matchedDesc = descriptions.find(d => d.id === func.matchedDescId);
    return matchedDesc && matchedDesc.id === func.id;
  };

  const allMatched = functions.every(f => f.matchedDescId !== null);

  return (
    <div>
      <div style={styles.matchingContainer}>
        <div style={styles.matchingColumn}>
          <div style={styles.matchingTitle}>📌 Fungsi/Method List</div>
          {functions.map(func => (
            <div
              key={func.id}
              draggable={!checked}
              onDragStart={(e) => handleDragStart(e, func.id)}
              style={{
                ...styles.dragItem,
                backgroundColor: (checked && isFuncMatchedToCorrectDesc(func)) ? "#28a745" : (checked && func.matchedDescId !== null && !isFuncMatchedToCorrectDesc(func)) ? "#dc3545" : (func.matchedDescId !== null ? "#17a2b8" : "#306998"),
                opacity: (checked && func.matchedDescId !== null) ? 0.8 : 1,
                cursor: checked ? "default" : "grab",
              }}
            >
              {func.text}
              {checked && isFuncMatchedToCorrectDesc(func) && " ✅"}
              {checked && func.matchedDescId !== null && !isFuncMatchedToCorrectDesc(func) && " ❌"}
            </div>
          ))}
        </div>
        <div style={styles.matchingColumn}>
          <div style={styles.matchingTitle}>🎯 Kegunaan</div>
          {descriptions.map(desc => (
            <div
              key={desc.id}
              onDrop={(e) => handleDrop(e, desc.id)}
              onDragOver={handleDragOver}
              style={{
                ...styles.dropZone,
                ...(checked && isDescMatchedToCorrectFunc(desc) ? styles.dropZoneFilled : {}),
                backgroundColor: (checked && isDescMatchedToCorrectFunc(desc)) ? "#d1e7dd" : (checked && desc.matchedFuncId !== null && !isDescMatchedToCorrectFunc(desc)) ? "#f8d7da" : (desc.matchedFuncId !== null ? "#cfe2ff" : "#e9ecef"),
                border: (checked && desc.matchedFuncId !== null && !isDescMatchedToCorrectFunc(desc)) ? "2px solid #dc3545" : (desc.matchedFuncId !== null ? "2px solid #17a2b8" : "2px dashed #6c757d"),
              }}
            >
              {desc.matchedFuncId !== null ? (
                <>
                  {desc.text}
                  {checked && isDescMatchedToCorrectFunc(desc) && " ✅"}
                  {checked && desc.matchedFuncId !== null && !isDescMatchedToCorrectFunc(desc) && " ❌"}
                </>
              ) : (
                desc.text
              )}
            </div>
          ))}
        </div>
      </div>
      {feedbackMsg && <div style={styles.feedback}>{feedbackMsg}</div>}
      <div>
        <button 
          style={styles.checkMatchingButton} 
          onClick={handleCheck} 
          disabled={checked && allCorrect}
        >
          {checked && allCorrect ? "✅ Semua Benar" : "🔍 Periksa Jawaban"}
        </button>
        <button style={styles.resetMatchingButton} onClick={() => window.dispatchEvent(new Event('resetMatching'))}>
          ↻ Reset Matching
        </button>
      </div>
    </div>
  );
};

// ================= KOMPONEN UTAMA =================
export default function OperasiManipulasiList() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [resetMatching, setResetMatching] = useState(0);

  const [eksplorasiTempAnswers, setEksplorasiTempAnswers] = useState([null, null]);
  const [eksplorasiSavedAnswers, setEksplorasiSavedAnswers] = useState([null, null]);
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", ""]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const eksplorasiQuestions = [
    { text: "Method apa yang digunakan untuk menambahkan elemen di akhir list?", options: ["insert()", "append()", "extend()", "add()"], correct: 1 },
    { text: "Apa fungsi dari method `remove()` pada list?", options: ["Menghapus elemen berdasarkan indeks", "Menghapus elemen berdasarkan nilai pertama yang cocok", "Menghapus semua elemen", "Menghapus elemen terakhir"], correct: 1 },
  ];

  const checkEksplorasiAnswer = (questionIdx) => {
    const selected = eksplorasiTempAnswers[questionIdx];
    if (selected === null) {
      setEksplorasiFeedback(prev => { const newF = [...prev]; newF[questionIdx] = "❌ Pilih jawaban terlebih dahulu!"; return newF; });
      return;
    }
    const isCorrect = selected === eksplorasiQuestions[questionIdx].correct;
    if (isCorrect) {
      const newSaved = [...eksplorasiSavedAnswers]; newSaved[questionIdx] = selected; setEksplorasiSavedAnswers(newSaved);
      setEksplorasiFeedback(prev => { const newF = [...prev]; newF[questionIdx] = "✅ Benar! Jawaban tersimpan."; return newF; });
    } else {
      setEksplorasiFeedback(prev => { const newF = [...prev]; newF[questionIdx] = "❌ Salah. Coba lagi!"; return newF; });
    }
  };

  useEffect(() => {
    const allCorrect = eksplorasiSavedAnswers.every((ans, idx) => ans !== null && ans === eksplorasiQuestions[idx].correct);
    setIsEksplorasiCompleted(allCorrect);
  }, [eksplorasiSavedAnswers]);

  const handleTempAnswer = (questionIdx, optionIdx) => {
    const newTemp = [...eksplorasiTempAnswers]; newTemp[questionIdx] = optionIdx; setEksplorasiTempAnswers(newTemp);
    setEksplorasiFeedback(prev => { const newF = [...prev]; newF[questionIdx] = ""; return newF; });
  };

  // ================= DATA UNTUK VISUALISASI =================
  const concatBeforeA = [1,2,3];
  const concatBeforeB = [4,5,6];
  const concatAfter = [1,2,3,4,5,6];
  const repeatBefore = [1,2,3];
  const repeatAfter = [1,2,3,1,2,3,1,2,3];
  const searchBefore = ["apel","jeruk","mangga"];
  const searchAfter = ["apel","jeruk","mangga"];
  const sortBefore = [5,3,8,1,7,2];
  const sortAfter = [1,2,3,5,7,8];
  const appendBefore = ["durian","nanas","mangga","rambutan"];
  const appendAfter = ["durian","nanas","mangga","rambutan","alpukat"];
  const insertBefore = ["durian","nanas","mangga","rambutan"];
  const insertAfter = ["durian","alpukat","nanas","mangga","rambutan"];
  const extendBefore = ["durian","nanas","mangga","rambutan"];
  const extendAfter = ["durian","nanas","mangga","rambutan","salak","jeruk","manggis"];
  const removeBefore = ["durian","nanas","mangga","rambutan","jeruk"];
  const removeAfter = ["durian","nanas","mangga","rambutan"];
  const popBefore = ["durian","nanas","mangga","rambutan"];
  const popAfter = ["durian","nanas","rambutan"];
  const changeBefore = ["durian","nanas","mangga","rambutan"];
  const changeAfter = ["durian","nanas","mangga","belimbing"];
  const reverseBefore = [1,2,3,4];
  const reverseAfter = [4,3,2,1];
  const clearBefore = [1,2,3];
  const clearAfter = [];
  const countBefore = [1,2,2,3];
  const countAfter = [2];
  const indexBefore = [10,20,30,20];
  const indexAfter = [1];
  const slicingBefore = [10,20,30,40,50];
  const slicingAfter = [20,30,40];
  const delBefore = [10,20,30,40];
  const delAfter = [10,40];
  const lengthBefore = [1,2,3,4];
  const lengthAfter = [4];

  // Hover context
  const concatHoverBeforeA = { 0:"a:1",1:"a:2",2:"a:3" };
  const concatHoverBeforeB = { 0:"b:4",1:"b:5",2:"b:6" };
  const concatHoverAfter = { 0:"1",1:"2",2:"3",3:"4",4:"5",5:"6" };
  const repeatHoverBefore = { 0:"1",1:"2",2:"3" };
  const repeatHoverAfter = {};
  for (let i = 0; i < 9; i++) {
    repeatHoverAfter[i] = i < 3 ? `Elemen ${repeatAfter[i]} (salinan ke-1)` :
                         (i < 6 ? `Elemen ${repeatAfter[i]} (salinan ke-2)` :
                                  `Elemen ${repeatAfter[i]} (salinan ke-3)`);
  }
  const searchHoverBefore = { 0:"apel",1:"jeruk",2:"mangga" };
  const searchHoverAfter = {};
  const sortHoverBefore = { 0:"5",1:"3",2:"8",3:"1",4:"7",5:"2" };
  const sortHoverAfter = { 0:"1",1:"2",2:"3",3:"5",4:"7",5:"8" };
  const appendHoverBefore = { 0:"durian",1:"nanas",2:"mangga",3:"rambutan" };
  const appendHoverAfter = { 0:"durian",1:"nanas",2:"mangga",3:"rambutan",4:"alpukat" };
  const insertHoverBefore = { 0:"durian",1:"nanas",2:"mangga",3:"rambutan" };
  const insertHoverAfter = { 0:"durian",1:"alpukat",2:"nanas",3:"mangga",4:"rambutan" };
  const extendHoverBefore = { 0:"durian",1:"nanas",2:"mangga",3:"rambutan" };
  const extendHoverAfter = { 0:"durian",1:"nanas",2:"mangga",3:"rambutan",4:"salak",5:"jeruk",6:"manggis" };
  const removeHoverBefore = { 0:"durian",1:"nanas",2:"mangga",3:"rambutan",4:"jeruk" };
  const removeHoverAfter = { 0:"durian",1:"nanas",2:"mangga",3:"rambutan" };
  const popHoverBefore = { 0:"durian",1:"nanas",2:"mangga",3:"rambutan" };
  const popHoverAfter = { 0:"durian",1:"nanas",2:"rambutan" };
  const changeHoverBefore = { 0:"durian",1:"nanas",2:"mangga",3:"rambutan" };
  const changeHoverAfter = { 0:"durian",1:"nanas",2:"mangga",3:"belimbing" };
  const reverseHoverBefore = { 0:"1",1:"2",2:"3",3:"4" };
  const reverseHoverAfter = { 0:"4",1:"3",2:"2",3:"1" };
  const clearHoverBefore = { 0:"1",1:"2",2:"3" };
  const clearHoverAfter = {};
  const countHoverBefore = { 0:"1",1:"2",2:"2",3:"3" };
  const countHoverAfter = {};
  const indexHoverBefore = { 0:"10",1:"20",2:"30",3:"20" };
  const indexHoverAfter = {};
  const slicingHoverBefore = { 0:"10",1:"20",2:"30",3:"40",4:"50" };
  const slicingHoverAfter = { 0:"20",1:"30",2:"40" };
  const delHoverBefore = { 0:"10",1:"20",2:"30",3:"40" };
  const delHoverAfter = { 0:"10",1:"40" };
  const lengthHoverBefore = { 0:"1",1:"2",2:"3",3:"4" };
  const lengthHoverAfter = {};

  // ================= ANIMATION STEPS =================
  const concatSteps = [
    { highlightIndex: 0, explanation: "Mengambil elemen pertama dari a (1)" },
    { highlightIndex: 1, explanation: "Mengambil elemen kedua dari a (2)" },
    { highlightIndex: 2, explanation: "Mengambil elemen ketiga dari a (3)" },
    { highlightIndex: 3, explanation: "Menambahkan elemen pertama dari b (4)" },
    { highlightIndex: 4, explanation: "Menambahkan elemen kedua dari b (5)" },
    { highlightIndex: 5, explanation: "Menambahkan elemen ketiga dari b (6) → hasil akhir [1,2,3,4,5,6]" },
  ];
  const repeatSteps = [
    { highlightIndex: 0, explanation: "Mengulang elemen 1 (salinan ke-1) ke indeks 0" },
    { highlightIndex: 1, explanation: "Mengulang elemen 2 (salinan ke-1) ke indeks 1" },
    { highlightIndex: 2, explanation: "Mengulang elemen 3 (salinan ke-1) ke indeks 2" },
    { highlightIndex: 3, explanation: "Mengulang elemen 1 (salinan ke-2) ke indeks 3" },
    { highlightIndex: 4, explanation: "Mengulang elemen 2 (salinan ke-2) ke indeks 4" },
    { highlightIndex: 5, explanation: "Mengulang elemen 3 (salinan ke-2) ke indeks 5" },
    { highlightIndex: 6, explanation: "Mengulang elemen 1 (salinan ke-3) ke indeks 6" },
    { highlightIndex: 7, explanation: "Mengulang elemen 2 (salinan ke-3) ke indeks 7" },
    { highlightIndex: 8, explanation: "Mengulang elemen 3 (salinan ke-3) ke indeks 8 → hasil [1,2,3,1,2,3,1,2,3]" },
  ];
  const searchSteps = [
    { highlightIndex: 0, explanation: "Cek 'apel' = 'mangga'? Tidak" },
    { highlightIndex: 1, explanation: "Cek 'jeruk' = 'mangga'? Tidak" },
    { highlightIndex: 2, explanation: "Cek 'mangga' = 'mangga'? Ya → True" },
  ];
  const sortSteps = [
    { highlightIndex: 3, explanation: "Langkah 1: Mencari nilai terkecil (1) di indeks 3. Pindahkan ke indeks 0." },
    { highlightIndex: 5, explanation: "Langkah 2: Mencari nilai terkecil berikutnya (2) di indeks 5. Pindahkan ke indeks 1." },
    { highlightIndex: 1, explanation: "Langkah 3: Mencari nilai terkecil berikutnya (3) di indeks 1. Pindahkan ke indeks 2." },
    { highlightIndex: 0, explanation: "Langkah 4: Mencari nilai 5 (sekarang di indeks 3 setelah penukaran)." },
    { highlightIndex: 4, explanation: "Langkah 5: Mencari nilai 7 di indeks 4." },
    { highlightIndex: 2, explanation: "Langkah 6: Mencari nilai 8 di indeks 2. List menjadi terurut [1,2,3,5,7,8]." },
  ];
  const appendSteps = [
    { highlightIndex: 4, explanation: "append('alpukat') menambahkan 'alpukat' di indeks terakhir (4)." },
  ];
  const insertSteps = [
    { highlightIndex: 1, explanation: "insert(1,'alpukat') menyisipkan 'alpukat' di indeks 1, elemen lain bergeser ke kanan." },
  ];
  const extendSteps = [
    { highlightIndex: 4, explanation: "Menambah 'salak' di indeks 4" },
    { highlightIndex: 5, explanation: "Menambah 'jeruk' di indeks 5" },
    { highlightIndex: 6, explanation: "Menambah 'manggis' di indeks 6" },
  ];
  const removeSteps = [
    { highlightIndex: 4, explanation: "remove('jeruk') menghapus elemen bernilai 'jeruk' di indeks 4" },
  ];
  const popSteps = [
    { highlightIndex: 2, explanation: "pop(2) menghapus elemen indeks 2 ('mangga')" },
  ];
  const changeSteps = [
    { highlightIndex: 3, explanation: "buah[3] = 'belimbing' mengubah nilai indeks 3 dari 'rambutan' menjadi 'belimbing'" },
  ];
  const reverseSteps = [
    { pair: [0, 3], explanation: "Langkah 1: Menukar elemen indeks 0 (1) dengan indeks 3 (4)." },
    { pair: [1, 2], explanation: "Langkah 2: Menukar elemen indeks 1 (2) dengan indeks 2 (3). Hasil akhir [4,3,2,1]." },
  ];
  const clearSteps = [
    { highlightIndex: 0, explanation: "clear() menghapus semua elemen dari list." },
  ];
  const countSteps = [
    { highlightIndex: 1, explanation: "Menemukan angka 2 pertama di indeks 1." },
    { highlightIndex: 2, explanation: "Menemukan angka 2 kedua di indeks 2. Total ada 2 kali." },
  ];
  const indexSteps = [
    { highlightIndex: 1, explanation: "index(20) mencari nilai 20 pertama kali → ditemukan di indeks 1." },
  ];
  const slicingSteps = [
    { highlightIndex: 0, explanation: "Mengambil elemen indeks 1 dari list awal (20)" },
    { highlightIndex: 1, explanation: "Mengambil elemen indeks 2 dari list awal (30)" },
    { highlightIndex: 2, explanation: "Mengambil elemen indeks 3 dari list awal (40) → hasil slicing [20,30,40]" },
  ];
  const delSteps = [
    { highlightIndex: 1, explanation: "Menghapus elemen indeks 1 (20)" },
    { highlightIndex: 2, explanation: "Menghapus elemen indeks 2 (30) → hasil [10,40]" },
  ];
  const lengthSteps = [
    { highlightIndex: 0, explanation: "Menghitung elemen ke-1 (durian)" },
    { highlightIndex: 1, explanation: "Menghitung elemen ke-2 (nanas)" },
    { highlightIndex: 2, explanation: "Menghitung elemen ke-3 (mangga)" },
    { highlightIndex: 3, explanation: "Menghitung elemen ke-4 (rambutan) → panjang = 4" },
  ];

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
      await pyodide.runPythonAsync(`import sys\nfrom io import StringIO\nsys.stdout = StringIO()`);
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
    { func: "count()", desc: "Menghitung jumlah kemunculan nilai" },
    { func: "index()", desc: "Mencari indeks pertama dari nilai" },
  ];

  const resetMatchingGame = () => {
    setResetMatching(prev => prev + 1);
    window.dispatchEvent(new Event('resetMatching'));
  };

  useEffect(() => {
    const handleReset = () => {
      setResetMatching(prev => prev + 1);
    };
    window.addEventListener('resetMatching', handleReset);
    return () => window.removeEventListener('resetMatching', handleReset);
  }, []);

  return (
    <>
      <Navbar />
      <SidebarMateri />
      <div className="main-content" style={{ paddingTop: "64px" }}>
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>OPERASI DAN MANIPULASI LIST</h1>
            {/* <p style={styles.headerSubtitle}>Belajar Mengubah, Menambah, Menghapus, dan Mengelola Data dalam List</p> */}
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🎯 Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <p style={styles.text}>1. Mahasiswa mampu menerapkan operasi dan manipulasi list dalam pengolahan data.</p>
            </div>
          </section>

          {/* EKSPLORASI AWAL */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🔍 Eksplorasi Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>Jawab pertanyaan berikut. Pilih jawaban, lalu klik "Periksa Jawaban". <strong style={{ color: "#d9534f" }}> Materi akan terbuka setelah kedua jawaban benar.</strong></p>
              {eksplorasiQuestions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
                  <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} onClick={() => handleTempAnswer(idx, optIdx)} style={{ ...styles.eksplorasiOption, backgroundColor: eksplorasiTempAnswers[idx] === optIdx ? "#2fa69a" : "#f9f9f9", color: eksplorasiTempAnswers[idx] === optIdx ? "white" : "#1f2937" }}>
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                  <button style={styles.checkEksplorasiButton} onClick={() => checkEksplorasiAnswer(idx)}>Periksa Jawaban</button>
                  {eksplorasiFeedback[idx] && <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", backgroundColor: eksplorasiFeedback[idx].includes("Benar") ? "#d1e7dd" : "#f8d7da" }}>{eksplorasiFeedback[idx]}</div>}
                </div>
              ))}
              {!isEksplorasiCompleted && <div style={styles.lockMessage}>🔒 Materi terkunci. Jawab kedua pertanyaan dengan benar.</div>}
            </div>
          </section>

          {/* MATERI UTAMA */}
          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>📊 Operasi Dasar List</h2>
                <div style={styles.card}>
                  <h3>1. Concatenation (+) – Menggabungkan List</h3>
                  <p>Operasi <code>+</code> menggabungkan dua list menjadi satu list baru. Semua elemen list kiri diikuti semua elemen list kanan.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.concat}
                    title="Contoh Kode Program"
                    beforeData={null}
                    afterData={concatAfter}
                    beforeTitle=""
                    afterTitle="Setelah (a + b)"
                    hoverContextBefore={{}}
                    hoverContextAfter={concatHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={concatSteps}
                    operationName="concat"
                    beforeDataDouble={{
                      dataA: concatBeforeA,
                      dataB: concatBeforeB,
                      titleA: "List a",
                      titleB: "List b",
                      hoverContextA: concatHoverBeforeA,
                      hoverContextB: concatHoverBeforeB,
                    }}
                  />

                  <h3>2. Repetition (*) – Mengulang List</h3>
                  <p>Operator <code>*</code> mengulang isi list sebanyak n kali, menghasilkan list baru dengan elemen berulang.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.repeat}
                    title="Contoh Kode Program"
                    beforeData={repeatBefore}
                    afterData={repeatAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah *3"
                    hoverContextBefore={repeatHoverBefore}
                    hoverContextAfter={repeatHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={repeatSteps}
                    operationName="repeat"
                  />

                  <h3>3. Slicing (:) – Mengambil Sebagian Elemen</h3>
                  <p>Slicing <code>list[awal:akhir]</code> mengambil elemen dari indeks <code>awal</code> hingga sebelum <code>akhir</code>. Contoh <code>angka[1:4]</code> mengambil indeks 1,2,3 (20,30,40).</p>
                  <CodeEditorWithVisual
                    code={codeExamples.slicing}
                    title="Contoh Kode Program"
                    beforeData={slicingBefore}
                    afterData={slicingAfter}
                    beforeTitle="List awal"
                    afterTitle="Hasil slicing [1:4]"
                    hoverContextBefore={slicingHoverBefore}
                    hoverContextAfter={slicingHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={slicingSteps}
                    operationName="slicing"
                  />

                  <h3>4. Pencarian (in) – Mengecek Keberadaan Elemen</h3>
                  <p>Operator <code>in</code> mengembalikan <code>True</code> jika nilai ditemukan dalam list, <code>False</code> jika tidak.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.search}
                    title="Contoh Kode Program"
                    beforeData={searchBefore}
                    afterData={searchAfter}
                    beforeTitle="List buah"
                    afterTitle="Hasil pengecekan"
                    hoverContextBefore={searchHoverBefore}
                    hoverContextAfter={searchHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={searchSteps}
                    operationName="search"
                    extraAfterBadge={
                      <>
                        ✅ Hasil: 'mangga' ditemukan → True<br />
                        ❌ Hasil: 'pisang' tidak ditemukan → False
                      </>
                    }
                  />

                  <h3>5. Pengurutan (sort()) – Mengurutkan List</h3>
                  <p>Method <code>sort()</code> mengurutkan list secara ascending (kecil ke besar) secara permanen. Prosesnya membandingkan dan menukar elemen hingga terurut.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.sort}
                    title="Contoh Kode Program"
                    beforeData={sortBefore}
                    afterData={sortAfter}
                    beforeTitle="Sebelum diurutkan"
                    afterTitle="Setelah sort()"
                    hoverContextBefore={sortHoverBefore}
                    hoverContextAfter={sortHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={sortSteps}
                    operationName="sort"
                  />

                  <h3>6. Pembalikan (reverse()) – Membalik Urutan List</h3>
                  <p>Method <code>reverse()</code> membalik urutan elemen dalam list secara permanen.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.reverse}
                    title="Contoh Kode Program"
                    beforeData={reverseBefore}
                    afterData={reverseAfter}
                    beforeTitle="Sebelum reverse"
                    afterTitle="Setelah reverse()"
                    hoverContextBefore={reverseHoverBefore}
                    hoverContextAfter={reverseHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={reverseSteps}
                    operationName="reverse"
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>✏️ Manipulasi List </h2>
                <div style={styles.card}>
                  <h3>append() – Menambah Elemen di Akhir</h3>
                  <p>Method <code>append()</code> menambahkan satu elemen baru di akhir list.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.append}
                    title="Contoh Kode Program"
                    beforeData={appendBefore}
                    afterData={appendAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah append('alpukat')"
                    hoverContextBefore={appendHoverBefore}
                    hoverContextAfter={appendHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={appendSteps}
                    operationName="append"
                    extraAfterBadge="✅ 'alpukat' berhasil ditambahkan di indeks terakhir (indeks 4)"
                  />

                  <h3>insert() – Menyisipkan Elemen di Posisi Tertentu</h3>
                  <p><code>insert(posisi, elemen)</code> menyisipkan elemen pada indeks yang ditentukan, elemen lain bergeser ke kanan.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.insert}
                    title="Contoh Kode Program"
                    beforeData={insertBefore}
                    afterData={insertAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah insert(1,'alpukat')"
                    hoverContextBefore={insertHoverBefore}
                    hoverContextAfter={insertHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={insertSteps}
                    operationName="insert"
                    extraAfterBadge="✅ 'alpukat' berhasil ditambahkan di indeks 1 dan menggeser posisi elemen pada indeks 1 sebelumnya"
                  />

                  <h3>extend() – Menambah Banyak Elemen Sekaligus</h3>
                  <p><code>extend([elemen1, elemen2, ...])</code> menambahkan semua elemen dari list lain ke akhir list.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.extend}
                    title="Contoh Kode Program"
                    beforeData={extendBefore}
                    afterData={extendAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah extend()"
                    hoverContextBefore={extendHoverBefore}
                    hoverContextAfter={extendHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={extendSteps}
                    operationName="extend"
                    extraAfterBadge="✅ 'salak', 'jeruk', 'manggis' berhasil ditambahkan ke dalam list"
                  />

                  <h3>remove() – Menghapus Elemen Berdasarkan Nilai</h3>
                  <p><code>remove(nilai)</code> menghapus elemen pertama yang nilainya cocok dengan nilai yang diberikan.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.remove}
                    title="Contoh Kode Program"
                    beforeData={removeBefore}
                    afterData={removeAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah remove('jeruk')"
                    hoverContextBefore={removeHoverBefore}
                    hoverContextAfter={removeHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={removeSteps}
                    operationName="remove"
                    extraAfterBadge="✅ 'jeruk' berhasil dihapus dari list"
                  />

                  <h3>pop() – Menghapus Elemen Berdasarkan Indeks</h3>
                  <p><code>pop(indeks)</code> menghapus elemen pada indeks tertentu dan mengembalikannya. Jika indeks tidak diberikan, menghapus elemen terakhir.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.pop}
                    title="Contoh Kode Program"
                    beforeData={popBefore}
                    afterData={popAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah pop(2)"
                    hoverContextBefore={popHoverBefore}
                    hoverContextAfter={popHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={popSteps}
                    operationName="pop"
                    extraAfterBadge="✅ 'mangga' berhasil dihapus dari list"
                  />

                  <h3>Mengubah Elemen dengan Indeks</h3>
                  <p>Kita bisa mengubah nilai elemen dengan mengakses indeksnya: <code>list[indeks] = nilai_baru</code>.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.change}
                    title="Contoh Kode Program"
                    beforeData={changeBefore}
                    afterData={changeAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah buah[3]='belimbing'"
                    hoverContextBefore={changeHoverBefore}
                    hoverContextAfter={changeHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={changeSteps}
                    operationName="change"
                    extraAfterBadge="✅ indeks 3 dari variabel buah berhasil diubah menjadi 'belimbing'"
                  />

                  <h3>del – Menghapus dengan Slicing</h3>
                  <p>Keyword <code>del</code> dapat digunakan untuk menghapus elemen berdasarkan indeks atau slice, misalnya <code>del list[1:3]</code>.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.del_example}
                    title="Contoh Kode Program"
                    beforeData={delBefore}
                    afterData={delAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah del angka[1:3]"
                    hoverContextBefore={delHoverBefore}
                    hoverContextAfter={delHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={delSteps}
                    operationName="del"
                    extraAfterBadge="✅ indeks 1 sampai 3-1 sudah dihapus"
                  />

                  <h3>clear() – Menghapus Semua Elemen</h3>
                  <p><code>clear()</code> mengosongkan list (menghapus semua elemen).</p>
                  <CodeEditorWithVisual
                    code={codeExamples.clear}
                    title="Contoh Kode Program"
                    beforeData={clearBefore}
                    afterData={clearAfter}
                    beforeTitle="List awal"
                    afterTitle="Setelah clear()"
                    hoverContextBefore={clearHoverBefore}
                    hoverContextAfter={clearHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={clearSteps}
                    operationName="clear"
                    extraAfterBadge="✅ Semua elemen list telah dihapus (clear)"
                  />

                  <h3>count() – Menghitung Kemunculan Nilai</h3>
                  <p><code>count(nilai)</code> mengembalikan jumlah kemunculan nilai dalam list.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.count}
                    title="Contoh Kode Program"
                    beforeData={countBefore}
                    afterData={countAfter}
                    beforeTitle="List"
                    afterTitle="Jumlah kemunculan 2"
                    hoverContextBefore={countHoverBefore}
                    hoverContextAfter={countHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={countSteps}
                    operationName="count"
                    extraAfterBadge="✅ Angka 2 muncul sebanyak 2 kali dalam list"
                  />

                  <h3>index() – Mencari Indeks Pertama</h3>
                  <p><code>index(nilai)</code> mengembalikan indeks pertama di mana nilai ditemukan.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.index}
                    title="Contoh Kode Program"
                    beforeData={indexBefore}
                    afterData={indexAfter}
                    beforeTitle="List"
                    afterTitle="Indeks pertama nilai 20"
                    hoverContextBefore={indexHoverBefore}
                    hoverContextAfter={indexHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={indexSteps}
                    operationName="index"
                    extraAfterBadge="✅ Nilai 20 pertama kali ditemukan di indeks 1"
                  />

                  <h3>len() – Panjang List</h3>
                  <p>Fungsi <code>len()</code> mengembalikan jumlah elemen dalam list.</p>
                  <CodeEditorWithVisual
                    code={codeExamples.length}
                    title="Contoh Kode Program"
                    beforeData={lengthBefore}
                    afterData={lengthAfter}
                    beforeTitle="List"
                    afterTitle="Panjang list"
                    hoverContextBefore={lengthHoverBefore}
                    hoverContextAfter={lengthHoverAfter}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    animationSteps={lengthSteps}
                    operationName="length"
                    extraAfterBadge="✅ Panjang list buah adalah 4 (durian, nanas, mangga, rambutan)"
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>💻 AYO PRAKTIK!</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    <strong>📖 Studi Kasus: Manajemen Daftar Belanja</strong><br />
                    Andi pergi ke pasar untuk membeli buah. Ia ingin membeli apel, jeruk, dan mangga. 
                    Karena lupa membawa catatan, ia menyimpan daftar belanjanya dalam sebuah list Python bernama <code>belanja</code>.
                    Sesampainya di pasar, ia melihat pisang yang segar dan memutuskan untuk menambahkannya ke dalam daftar belanja di akhir.
                    Kemudian, karena jeruk sedang tidak ada, ia memutuskan untuk menghapus jeruk dari daftar belanja. 
                    (Petunjuk: Kamu bisa menghapus berdasarkan nilai <code>remove('jeruk')</code> atau berdasarkan indeks <code>pop(1)</code> karena jeruk berada di indeks 1).
                    Terakhir, ia ingin melihat isi daftar belanjanya yang sudah diperbarui.
                  </p>
                  <p style={styles.text}>Buatlah program Python sesuai cerita di atas!</p>
                  <CodeEditorEditable title="Ayo Praktik" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🧩 Latihan</h2>
                <div style={styles.card}>
                  <p>Seret fungsi/method list ke kegunaan yang sesuai. Setelah semua terisi, klik "Periksa Jawaban".</p>
                  <DragDropMatching items={matchingItems} resetTrigger={resetMatching} />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}