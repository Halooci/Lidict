import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';

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
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    textAlign: "center",
    transition: "all 0.2s",
    color: "white",
    fontWeight: "bold",
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
  checkMatchingButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "15px",
    marginRight: "10px",
  },
  resetWrongButton: {
    backgroundColor: "#ffc107",
    color: "#212529",
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
  warningBox: {
    marginTop: "12px",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    textAlign: "center",
  },
  successBoxLarge: {
    marginTop: "12px",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    textAlign: "center",
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "2px solid #28a745",
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
  // PERBAIKAN: header penjelasan menjadi biru, teks putih
  explanationHeader: {
    backgroundColor: "#306998", // biru seperti contoh gambar
    color: "white",
    padding: "10px 15px",
    fontWeight: "600",
    borderTop: "1px solid #444",
  },
  explanationContent: {
    backgroundColor: "#1e1e1e", // tetap gelap
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
  explanationTitle: {
    fontWeight: "bold",
    marginBottom: "10px",
    color: "white", // putih di atas biru
  },
};

// ================= KOMPONEN VISUALISASI LIST SATU KOLOM =================
const SingleListVisualization = ({ data, title, hoverContext = {}, highlightIndex = null, highlightPair = [], changedIndices = [], explanation = "", extraBadge = null, hideIndices = false, disableHover = false }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const negativeIndices = data.map((_, i) => -(data.length - i));

  const getHoverExplanation = (idx, item) => {
    if (disableHover) return null;
    if (highlightPair.includes(idx) && explanation) {
      return `Proses: ${explanation}`;
    }
    if (idx === highlightIndex && explanation) {
      return `Proses: ${explanation}`;
    }
    const customMsg = hoverContext[idx];
    if (customMsg) return customMsg;
    return `Elemen: "${item}"\nIndeks positif: ${idx} -> data[${idx}]\nIndeks negatif: ${negativeIndices[idx]} -> data[${negativeIndices[idx]}]`;
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
      {explanation && !disableHover && (
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

// ================= KOMPONEN UNTUK MENAMPILKAN DUA LIST SECARA HORIZONTAL (UNTUK CONCAT) =================
const TwoListsHorizontal = ({ dataA, dataB, titleA, titleB, hoverContextA, hoverContextB, highlightIndexA, highlightIndexB, highlightPairA, highlightPairB, changedIndicesA, changedIndicesB, explanationA, explanationB }) => {
  return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: "250px" }}>
        <SingleListVisualization
          data={dataA}
          title={titleA}
          hoverContext={hoverContextA}
          highlightIndex={highlightIndexA}
          highlightPair={highlightPairA}
          changedIndices={changedIndicesA}
          explanation={explanationA}
        />
      </div>
      <div style={{ flex: 1, minWidth: "250px" }}>
        <SingleListVisualization
          data={dataB}
          title={titleB}
          hoverContext={hoverContextB}
          highlightIndex={highlightIndexB}
          highlightPair={highlightPairB}
          changedIndices={changedIndicesB}
          explanation={explanationB}
        />
      </div>
    </div>
  );
};

// ================= KOMPONEN UTAMA DENGAN ANIMASI =================
const AnimatedVisualization = ({ beforeData, afterData, beforeTitle, afterTitle, hoverContextBefore, hoverContextAfter, animationSteps, operationName, extraAfterBadge = null, beforeDataDouble = null }) => {
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [showExtraBadge, setShowExtraBadge] = useState(false);
  
  const [highlightA, setHighlightA] = useState(null);
  const [highlightB, setHighlightB] = useState(null);
  const [highlightBefore, setHighlightBefore] = useState(null);
  const [highlightAfter, setHighlightAfter] = useState(null);
  const [highlightBeforePair, setHighlightBeforePair] = useState([]);
  const [highlightAfterPair, setHighlightAfterPair] = useState([]);
  const [explanationA, setExplanationA] = useState("");
  const [explanationB, setExplanationB] = useState("");

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
    setExplanationA("");
    setExplanationB("");
    const interval = setInterval(() => {
      if (stepIdx < animationSteps.length) {
        const step = animationSteps[stepIdx];
        if (operationName === 'sort') {
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
        else if (beforeDataDouble && operationName === 'concat') {
          if (step.highlightIndex < 3) {
            setHighlightA(step.highlightIndex);
            setHighlightB(null);
            setExplanationA(step.explanation);
            setExplanationB("");
          } else {
            setHighlightA(null);
            setHighlightB(step.highlightIndex - 3);
            setExplanationB(step.explanation);
            setExplanationA("");
          }
          setCurrentHighlight(null);
          setCurrentExplanation("");
        }
        else {
          setCurrentHighlight(step.highlightIndex);
          setHighlightBefore(null);
          setHighlightAfter(null);
          setCurrentExplanation(step.explanation);
        }
        if (operationName !== 'concat') {
          setCurrentExplanation(step.explanation);
        }
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
          setExplanationA("");
          setExplanationB("");
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

  let rightHighlightIndex = null;
  let rightHighlightPair = [];
  let rightHideIndices = false;
  let rightDisableHover = false;

  if (operationName === 'sort') {
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

  let beforeDisableHover = false;
  if (operationName === 'insert') {
    beforeDisableHover = true;
  }

  if (operationName === 'concat' && beforeDataDouble) {
    return (
      <div>
        <TwoListsHorizontal
          dataA={beforeDataDouble.dataA}
          dataB={beforeDataDouble.dataB}
          titleA={beforeDataDouble.titleA}
          titleB={beforeDataDouble.titleB}
          hoverContextA={beforeDataDouble.hoverContextA}
          hoverContextB={beforeDataDouble.hoverContextB}
          highlightIndexA={highlightA}
          highlightIndexB={highlightB}
          highlightPairA={[]}
          highlightPairB={[]}
          changedIndicesA={showDiff ? changedIndicesBefore : []}
          changedIndicesB={showDiff ? changedIndicesBefore : []}
          explanationA={explanationA}
          explanationB={explanationB}
        />
        <div style={{ marginTop: "20px" }}>
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
            <strong>Proses animasi:</strong> {currentExplanation}
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
            <strong>Perubahan selesai!</strong> Elemen yang berubah ditandai dengan warna hijau dan tanda centang.
          </div>
        )}
      </div>
    );
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
              highlightPairA={[]}
              highlightPairB={[]}
              changedIndicesA={showDiff ? changedIndicesBefore : []}
              changedIndicesB={showDiff ? changedIndicesBefore : []}
              explanation={currentExplanation}
            />
          ) : (
            <SingleListVisualization
              data={beforeData}
              title={beforeTitle}
              hoverContext={hoverContextBefore}
              highlightIndex={operationName === 'sort' ? highlightBefore : (operationName === 'reverse' ? null : currentHighlight)}
              highlightPair={operationName === 'reverse' ? highlightBeforePair : []}
              changedIndices={showDiff ? changedIndicesBefore : []}
              explanation={currentExplanation}
              disableHover={beforeDisableHover}
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
          <strong>Proses animasi:</strong> {currentExplanation}
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
          <strong>Perubahan selesai!</strong> Elemen yang berubah ditandai dengan warna hijau dan tanda centang.
        </div>
      )}
    </div>
  );
};

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

// ================= KOMPONEN CODE EDITOR DENGAN ANIMASI DAN PENJELASAN (MUNCUL SETELAH JALANKAN) =================
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
  codeExplanation = null,
}) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setIsRunning(true);
    setShowVisual(false);
    setShowExplanation(false);
    const result = await runPythonCode(code);
    setOutput(result);
    setIsRunning(false);
    setShowVisual(true);
    setShowExplanation(true);
    setTriggerAnimation(prev => prev + 1);
  }, [pyodideReady, code, runPythonCode]);

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
      {showExplanation && codeExplanation && (
        <div>
          <div style={styles.explanationHeader}>
            <span style={styles.outputTitle}>Penjelasan baris kode program</span>
          </div>
          <div style={styles.explanationContent}>
            {Array.isArray(codeExplanation) ? (
              codeExplanation.map((line, idx) => (
                <div key={idx} style={styles.explanationLine}>{line}</div>
              ))
            ) : (
              <div style={styles.explanationLine}>{codeExplanation}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ================= KOMPONEN UNTUK LATIHAN PRAKTIK CODING =================
const CodeEditorEditable = ({ title, pyodideReady, runPythonCode }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleChange = (e) => {
    setLocalCode(e.target.value);
    setMessage(null);
  };

  const validateAndRun = useCallback(async () => {
    if (!pyodideReady) {
      setMessage({ type: 'error', text: "Pyodide sedang dimuat, harap tunggu..." });
      return;
    }
    setOutput("");
    setMessage(null);
    setIsRunning(true);

    const code = localCode;
    
    const varRegex = /belanja\s*\s*=\s*\s*\[\s*['"]\s*\s*apel\s*\s*['"]\s*,\s*['"]\s*\s*jeruk\s*\s*['"]\s*,\s*['"]\s*\s*mangga\s*\s*['"]\s*\]/;
    const hasCorrectList = varRegex.test(code);
    const appendRegex = /belanja\.append\s*\s*\(\s*\s*['"]\s*\s*pisang\s*\s*['"]\s*\s*\)/;
    const hasAppend = appendRegex.test(code);
    const removeByValue = /belanja\.remove\s*\s*\(\s*\s*['"]\s*\s*jeruk\s*\s*['"]\s*\s*\)/.test(code);
    const removeByIndex = /belanja\.pop\s*\s*\(\s*\s*1\s*\s*\)/.test(code);
    const hasRemove = removeByValue || removeByIndex;
    const printRegex = /print\s*\s*\(\s*\s*belanja\s*\s*\)/;
    const hasPrint = printRegex.test(code);
    
    if (!hasCorrectList) {
      setMessage({ type: 'error', text: "Periksa kembali kode Anda. Pastikan Anda membuat variabel 'belanja' dengan tiga buah: apel, jeruk, mangga." });
      setIsRunning(false);
      return;
    }
    if (!hasAppend) {
      setMessage({ type: 'success', text: "Bagus! Variabel 'belanja' sudah benar. Sekarang, tambahkan 'pisang' ke dalam daftar belanja." });
      setIsRunning(false);
      return;
    }
    if (!hasRemove) {
      setMessage({ type: 'success', text: "Bagus! 'pisang' sudah ditambahkan. Sekarang, hapus 'jeruk' dari daftar belanja." });
      setIsRunning(false);
      return;
    }
    if (!hasPrint) {
      setMessage({ type: 'success', text: "Bagus! Penghapusan 'jeruk' sudah dilakukan. Terakhir, cetak daftar belanja yang sudah diperbarui." });
      setIsRunning(false);
      return;
    }
    
    try {
      const result = await runPythonCode(code);
      if (result.includes("apel") && result.includes("mangga") && result.includes("pisang") && !result.includes("jeruk")) {
        setOutput(result + "\n\nSELAMAT! Semua instruksi sudah benar.");
        setMessage({ type: 'success', text: "Selamat! Anda berhasil menyelesaikan studi kasus." });
      } else {
        setOutput(result + "\n\nOutput tidak sesuai. Pastikan list akhir berisi ['apel','mangga','pisang'].");
        setMessage({ type: 'error', text: "Output akhir tidak sesuai. Periksa kembali urutan operasi Anda." });
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Terjadi kesalahan saat menjalankan: ${err.message}` });
    } finally {
      setIsRunning(false);
    }
  }, [localCode, pyodideReady, runPythonCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={validateAndRun} disabled={!pyodideReady || isRunning}>
          {isRunning ? "Menjalankan..." : pyodideReady ? "Jalankan" : "Memuat..."}
        </button>
      </div>
      {message && (
        <div style={message.type === 'error' ? styles.errorBox : styles.successBox}>
          {message.text}
        </div>
      )}
      <textarea style={styles.codeInputEditable} value={localCode} onChange={handleChange} placeholder="Tulis kode Python di sini..." spellCheck={false} />
      <div style={styles.outputHeader}><span style={styles.outputTitle}>Output</span></div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik 'Jalankan' untuk melihat hasil)"}</pre>
      </div>
    </div>
  );
};

// ================= KOMPONEN DRAG-N-DROP MATCHING (DENGAN PERBAIKAN PESAN) =================
const DragDropMatching = ({ items, resetTrigger }) => {
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initFunctions = () => {
    return shuffleArray(items.map((item, idx) => ({ id: idx, text: item.func, matchedDescId: null })));
  };
  const initDescriptions = () => {
    return shuffleArray(items.map((item, idx) => ({ id: idx, text: item.desc, matchedFuncId: null })));
  };

  const [functions, setFunctions] = useState(initFunctions);
  const [descriptions, setDescriptions] = useState(initDescriptions);
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [correctFuncIds, setCorrectFuncIds] = useState(new Set());
  const [correctDescIds, setCorrectDescIds] = useState(new Set());

  const recalculateCorrect = useCallback(() => {
    const newCorrectFuncIds = new Set();
    const newCorrectDescIds = new Set();
    for (const func of functions) {
      if (func.matchedDescId !== null) {
        const matchedDesc = descriptions.find(d => d.id === func.matchedDescId);
        if (matchedDesc && func.id === matchedDesc.id) {
          newCorrectFuncIds.add(func.id);
          newCorrectDescIds.add(matchedDesc.id);
        }
      }
    }
    setCorrectFuncIds(newCorrectFuncIds);
    setCorrectDescIds(newCorrectDescIds);
    const allMatched = functions.every(f => f.matchedDescId !== null);
    if (allMatched && newCorrectFuncIds.size === items.length) {
      setAllCorrect(true);
      setFeedbackMsg("🎉 SELAMAT! Semua jawaban benar! 🎉");
    } else {
      setAllCorrect(false);
      if (checked && allMatched) {
        setFeedbackMsg(`❌ Masih ada ${items.length - newCorrectFuncIds.size} pasangan yang salah. Silakan perbaiki.`);
      }
    }
  }, [functions, descriptions, items.length, checked]);

  const resetWrongOnly = () => {
    // Cek apakah sudah pernah diperiksa
    if (!checked) {
      setFeedbackMsg("⚠️ Silakan lengkapi jawaban terlebih dahulu! ⚠️");
      return;
    }
    if (allCorrect) {
      setFeedbackMsg("✅ Semua jawaban sudah benar, tidak perlu reset.");
      return;
    }
    const wrongFuncs = functions.filter(f => !correctFuncIds.has(f.id));
    wrongFuncs.forEach(f => f.matchedDescId = null);
    const shuffledWrongFuncs = shuffleArray(wrongFuncs);
    const newFunctions = [
      ...functions.filter(f => correctFuncIds.has(f.id)),
      ...shuffledWrongFuncs
    ];
    
    const wrongDescs = descriptions.filter(d => !correctDescIds.has(d.id));
    wrongDescs.forEach(d => d.matchedFuncId = null);
    const shuffledWrongDescs = shuffleArray(wrongDescs);
    const newDescriptions = [
      ...descriptions.filter(d => correctDescIds.has(d.id)),
      ...shuffledWrongDescs
    ];
    
    setFunctions(newFunctions);
    setDescriptions(newDescriptions);
    setFeedbackMsg("🔄 Pasangan yang salah telah direset dan diacak. Silakan perbaiki pasangan yang masih salah.");
    setTimeout(() => {
      recalculateCorrect();
    }, 0);
  };

  const fullReset = () => {
    setFunctions(initFunctions());
    setDescriptions(initDescriptions());
    setChecked(false);
    setAllCorrect(false);
    setFeedbackMsg("");
    setCorrectFuncIds(new Set());
    setCorrectDescIds(new Set());
  };

  useEffect(() => {
    fullReset();
  }, [resetTrigger, items]);

  useEffect(() => {
    if (checked) {
      recalculateCorrect();
    }
  }, [functions, descriptions, checked, recalculateCorrect]);

  const handleDragStart = (e, funcId) => {
    if (correctFuncIds.has(funcId)) {
      e.preventDefault();
      return false;
    }
    e.dataTransfer.setData("text/plain", funcId);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e, descId) => {
    e.preventDefault();
    if (correctDescIds.has(descId)) {
      setFeedbackMsg("✅ Pasangan yang sudah benar tidak dapat diubah.");
      return;
    }
    const funcId = parseInt(e.dataTransfer.getData("text/plain"));
    const func = functions.find(f => f.id === funcId);
    const desc = descriptions.find(d => d.id === descId);
    if (!func || !desc) return;
    if (correctFuncIds.has(func.id)) return;

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

    if (checked) {
      setFeedbackMsg("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleCheck = () => {
    const totalMatched = functions.filter(f => f.matchedDescId !== null).length;
    if (totalMatched !== items.length) {
      setFeedbackMsg(`⚠️ Lengkapi semua pasangan terlebih dahulu. ⚠️`);
      setChecked(false);
      setAllCorrect(false);
      return;
    }
    setChecked(true);
  };

  const getDragItemStyle = (func) => {
    if (checked) {
      if (correctFuncIds.has(func.id)) {
        return { backgroundColor: "#28a745", cursor: "default", opacity: 0.8, text: `${func.text} [Benar]` };
      }
      if (func.matchedDescId !== null && !correctFuncIds.has(func.id)) {
        return { backgroundColor: "#dc3545", cursor: "grab", text: `${func.text} [Salah]` };
      }
      return { backgroundColor: "#306998", cursor: "grab", text: func.text };
    } else {
      if (func.matchedDescId !== null) {
        return { backgroundColor: "#17a2b8", cursor: "grab", text: func.text };
      }
      return { backgroundColor: "#306998", cursor: "grab", text: func.text };
    }
  };

  const getDropZoneStyle = (desc) => {
    if (checked) {
      if (correctDescIds.has(desc.id)) {
        return { backgroundColor: "#d1e7dd", border: "2px solid #198754", text: `${desc.text} [Benar]` };
      }
      if (desc.matchedFuncId !== null && !correctDescIds.has(desc.id)) {
        return { backgroundColor: "#f8d7da", border: "2px solid #dc3545", text: `${desc.text} [Salah]` };
      }
      if (desc.matchedFuncId !== null) {
        return { backgroundColor: "#cfe2ff", border: "2px solid #17a2b8", text: desc.text };
      }
      return { backgroundColor: "#e9ecef", border: "2px dashed #6c757d", text: desc.text };
    } else {
      if (desc.matchedFuncId !== null) {
        return { backgroundColor: "#cfe2ff", border: "2px solid #17a2b8", text: desc.text };
      }
      return { backgroundColor: "#e9ecef", border: "2px dashed #6c757d", text: desc.text };
    }
  };

  return (
    <div>
      <div style={styles.matchingContainer}>
        <div style={styles.matchingColumn}>
          <div style={styles.matchingTitle}>Method List</div>
          {functions.map(func => {
            const { backgroundColor, cursor, text } = getDragItemStyle(func);
            return (
              <div
                key={func.id}
                draggable={!(checked && correctFuncIds.has(func.id))}
                onDragStart={(e) => handleDragStart(e, func.id)}
                style={{
                  ...styles.dragItem,
                  backgroundColor,
                  cursor,
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
        <div style={styles.matchingColumn}>
          <div style={styles.matchingTitle}>Kegunaan</div>
          {descriptions.map(desc => {
            const { backgroundColor, border, text } = getDropZoneStyle(desc);
            return (
              <div
                key={desc.id}
                onDrop={(e) => handleDrop(e, desc.id)}
                onDragOver={handleDragOver}
                style={{
                  ...styles.dropZone,
                  backgroundColor,
                  border,
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      </div>
      {feedbackMsg && (
        <div style={feedbackMsg.includes("Lengkapi") || feedbackMsg.includes("lengkapi jawaban") ? styles.warningBox : (feedbackMsg.includes("SELAMAT") ? styles.successBoxLarge : styles.feedback)}>
          {feedbackMsg}
        </div>
      )}
      <div>
        <button 
          style={styles.checkMatchingButton} 
          onClick={handleCheck} 
          disabled={allCorrect}
        >
          {allCorrect ? "✅ Semua Benar" : "🔍 Periksa Jawaban"}
        </button>
        <button 
          style={styles.resetWrongButton} 
          onClick={resetWrongOnly}
          disabled={allCorrect}
        >
          ↻ Reset Jawaban Salah
        </button>
      </div>
    </div>
  );
};

// ================= KOMPONEN UTAMA =================
export default function OperasiManipulasiList() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) {
      navigate('/loginregister');
    }
  }, [navigate]);

  
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [resetMatching, setResetMatching] = useState(0);

  // EKSPLORASI AWAL
  const [eksplorasiSelected, setEksplorasiSelected] = useState([null, null]);
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", ""]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const eksplorasiQuestions = [
    { 
      text: "Method yang digunakan untuk menambahkan elemen di akhir list adalah ...", 
      options: ["append()", "insert()", "extend()", "add()", "push()"], 
      correct: 0
    },
    { 
      text: "Fungsi dari method `remove()` pada list adalah ...", 
      options: [
        "Menghapus elemen berdasarkan indeks", 
        "Menghapus elemen berdasarkan nilai pertama yang cocok", 
        "Menghapus semua elemen", 
        "Menghapus elemen terakhir",
        "Menghapus elemen berdasarkan indeks terakhir"
      ], 
      correct: 1
    },
  ];

  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    if (eksplorasiSelected[questionIdx] !== null) return;
    setEksplorasiSelected(prev => {
      const newSelected = [...prev];
      newSelected[questionIdx] = optionIdx;
      return newSelected;
    });
    const isCorrect = optionIdx === eksplorasiQuestions[questionIdx].correct;
    setEksplorasiFeedback(prev => {
      const newFeedback = [...prev];
      newFeedback[questionIdx] = isCorrect ? "Benar" : "Salah";
      return newFeedback;
    });
  };

  useEffect(() => {
    const allSelected = eksplorasiSelected.every(selected => selected !== null);
    if (allSelected && !isEksplorasiCompleted) {
      setIsEksplorasiCompleted(true);
    }
  }, [eksplorasiSelected, isEksplorasiCompleted]);

  // DATA VISUALISASI
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
  const delHoverBefore = { 0:"10",1:"20",2:"30",3:"40" };
  const delHoverAfter = { 0:"10",1:"40" };
  const lengthHoverBefore = { 0:"1",1:"2",2:"3",3:"4" };
  const lengthHoverAfter = {};

  // ANIMATION STEPS
  const concatSteps = [
    { highlightIndex: 0, explanation: "Mengambil elemen pertama dari a (1)" },
    { highlightIndex: 1, explanation: "Mengambil elemen kedua dari a (2)" },
    { highlightIndex: 2, explanation: "Mengambil elemen ketiga dari a (3)" },
    { highlightIndex: 3, explanation: "Menambahkan elemen pertama dari b (4)" },
    { highlightIndex: 4, explanation: "Menambahkan elemen kedua dari b (5)" },
    { highlightIndex: 5, explanation: "Menambahkan elemen ketiga dari b (6) -> hasil akhir [1,2,3,4,5,6]" },
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
    { highlightIndex: 8, explanation: "Mengulang elemen 3 (salinan ke-3) ke indeks 8 -> hasil [1,2,3,1,2,3,1,2,3]" },
  ];
  const searchSteps = [
    { highlightIndex: 0, explanation: "Cek 'apel' = 'mangga'? Tidak" },
    { highlightIndex: 1, explanation: "Cek 'jeruk' = 'mangga'? Tidak" },
    { highlightIndex: 2, explanation: "Cek 'mangga' = 'mangga'? Ya -> True" },
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
    { highlightIndex: 1, explanation: "index(20) mencari nilai 20 pertama kali -> ditemukan di indeks 1." },
  ];
  const delSteps = [
    { highlightIndex: 1, explanation: "Menghapus elemen indeks 1 (20)" },
    { highlightIndex: 2, explanation: "Menghapus elemen indeks 2 (30) -> hasil [10,40]" },
  ];
  const lengthSteps = [
    { highlightIndex: 0, explanation: "Menghitung elemen ke-1 (durian)" },
    { highlightIndex: 1, explanation: "Menghitung elemen ke-2 (nanas)" },
    { highlightIndex: 2, explanation: "Menghitung elemen ke-3 (mangga)" },
    { highlightIndex: 3, explanation: "Menghitung elemen ke-4 (rambutan) -> panjang = 4" },
  ];

  // Penjelasan kode per baris
  const codeExplanations = {
    concat: [
      "Baris 1: a = [1, 2, 3]  -> Membuat list a dengan elemen 1,2,3.",
      "Baris 2: b = [4, 5, 6]  -> Membuat list b dengan elemen 4,5,6.",
      "Baris 3: c = a + b       -> Menggabungkan list a dan b menjadi list baru c = [1,2,3,4,5,6].",
      "Baris 4: print(c)        -> Mencetak isi list c ke layar."
    ],
    repeat: [
      "Baris 1: data = [1, 2, 3]    -> Membuat list data.",
      "Baris 2: print(data * 3)     -> Mengulang list data sebanyak 3 kali, menghasilkan [1,2,3,1,2,3,1,2,3], lalu dicetak."
    ],
    search: [
      "Baris 1: buah = [\"apel\", \"jeruk\", \"mangga\"]  -> Membuat list buah.",
      "Baris 2: print(\"mangga\" in buah)                 -> Mengecek apakah 'mangga' ada di list, hasil True.",
      "Baris 3: print(\"pisang\" in buah)                 -> Mengecek apakah 'pisang' ada di list, hasil False."
    ],
    sort: [
      "Baris 1: angka = [5, 3, 8, 1, 7, 2]  -> Membuat list angka.",
      "Baris 2: angka.sort()                 -> Mengurutkan list secara ascending (menjadi [1,2,3,5,7,8]).",
      "Baris 3: print(angka)                -> Mencetak list yang sudah terurut."
    ],
    append: [
      "Baris 1: buah = [\"durian\", \"nanas\", \"mangga\", \"rambutan\"] -> Membuat list buah.",
      "Baris 2: buah.append(\"alpukat\")                               -> Menambahkan 'alpukat' di akhir list.",
      "Baris 3: print(buah)                                          -> Mencetak list setelah ditambah."
    ],
    insert: [
      "Baris 1: buah = [\"durian\", \"nanas\", \"mangga\", \"rambutan\"] -> Membuat list buah.",
      "Baris 2: buah.insert(1, \"alpukat\")                           -> Menyisipkan 'alpukat' pada indeks 1.",
      "Baris 3: print(buah)                                          -> Mencetak list setelah penyisipan."
    ],
    extend: [
      "Baris 1: buah = [\"durian\", \"nanas\", \"mangga\", \"rambutan\"] -> Membuat list buah.",
      "Baris 2: buah.extend([\"salak\", \"jeruk\", \"manggis\"])        -> Menambahkan semua elemen dari list lain ke akhir buah.",
      "Baris 3: print(buah)                                          -> Mencetak list setelah extend."
    ],
    remove: [
      "Baris 1: buah = [\"durian\", \"nanas\", \"mangga\", \"rambutan\", \"jeruk\"] -> Membuat list buah.",
      "Baris 2: buah.remove(\"jeruk\")                                            -> Menghapus elemen 'jeruk' pertama yang ditemukan.",
      "Baris 3: print(buah)                                                      -> Mencetak list setelah penghapusan."
    ],
    pop: [
      "Baris 1: buah = [\"durian\", \"nanas\", \"mangga\", \"rambutan\"] -> Membuat list buah.",
      "Baris 2: buah.pop(2)                                         -> Menghapus elemen pada indeks 2 ('mangga').",
      "Baris 3: print(buah)                                         -> Mencetak list setelah penghapusan."
    ],
    change: [
      "Baris 1: buah = [\"durian\", \"nanas\", \"mangga\", \"rambutan\"] -> Membuat list buah.",
      "Baris 2: buah[3] = \"belimbing\"                               -> Mengubah nilai indeks 3 menjadi 'belimbing'.",
      "Baris 3: print(buah)                                          -> Mencetak list setelah perubahan."
    ],
    reverse: [
      "Baris 1: angka = [1, 2, 3, 4]  -> Membuat list angka.",
      "Baris 2: angka.reverse()       -> Membalik urutan list menjadi [4,3,2,1].",
      "Baris 3: print(angka)         -> Mencetak list yang sudah dibalik."
    ],
    clear: [
      "Baris 1: data = [1, 2, 3]  -> Membuat list data.",
      "Baris 2: data.clear()      -> Menghapus semua elemen list.",
      "Baris 3: print(data)       -> Mencetak list kosong []."
    ],
    count: [
      "Baris 1: data = [1, 2, 2, 3]  -> Membuat list data.",
      "Baris 2: print(data.count(2)) -> Menghitung jumlah kemunculan angka 2, hasil 2."
    ],
    index: [
      "Baris 1: data = [10, 20, 30, 20] -> Membuat list data.",
      "Baris 2: print(data.index(20))   -> Mencari indeks pertama nilai 20, hasil 1."
    ],
    del_example: [
      "Baris 1: angka = [10, 20, 30, 40] -> Membuat list angka.",
      "Baris 2: del angka[1:3]           -> Menghapus elemen indeks 1 sampai 2 (20 dan 30).",
      "Baris 3: print(angka)            -> Mencetak list setelah penghapusan [10,40]."
    ],
    length: [
      "Baris 1: buah = [\"durian\", \"nanas\", \"mangga\", \"rambutan\"] -> Membuat list buah.",
      "Baris 2: print(len(buah))                                      -> Menghitung panjang list, hasil 4."
    ],
  };

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
    if (!pyodideRef.current) return "Pyodide sedang dimuat...";
    try {
      const pyodide = pyodideRef.current;
      await pyodide.runPythonAsync(`import sys\nfrom io import StringIO\nsys.stdout = StringIO()`);
      await pyodide.runPythonAsync(code);
      const output = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      await pyodide.runPythonAsync("sys.stdout = sys.__stdout__");
      return output || "(Tidak ada output)";
    } catch (error) {
      return `Error: ${error.message}`;
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

  return (
    <>
      <Navbar />
      <SidebarMateri />
      <div className="main-content" style={{ paddingTop: "64px" }}>
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>OPERASI DAN MANIPULASI LIST</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <p style={styles.text}>1. Mahasiswa mampu menerapkan operasi dan manipulasi list dalam pengolahan data.</p>
            </div>
          </section>

          {/* EKSPLORASI AWAL */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Eksplorasi Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum belajar lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
                <strong style={{ color: "#0d6efd" }}> Materi akan terbuka setelah kedua pertanyaan dijawab.</strong>
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

          {/* MATERI UTAMA */}
          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Operasi Dasar List</h2>
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
                    extraAfterBadge="Hasil penggabungan a + b = [1,2,3,4,5,6]"
                    beforeDataDouble={{
                      dataA: concatBeforeA,
                      dataB: concatBeforeB,
                      titleA: "List a",
                      titleB: "List b",
                      hoverContextA: concatHoverBeforeA,
                      hoverContextB: concatHoverBeforeB,
                    }}
                    codeExplanation={codeExplanations.concat}
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
                    codeExplanation={codeExplanations.repeat}
                  />

                  <h3>3. Pencarian (in) – Mengecek Keberadaan Elemen</h3>
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
                      <div>
                        Hasil: 'mangga' ditemukan -&gt; True<br />
                        Hasil: 'pisang' tidak ditemukan -&gt; False
                      </div>
                    }
                    codeExplanation={codeExplanations.search}
                  />

                  <h3>4. Pengurutan (sort()) – Mengurutkan List</h3>
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
                    codeExplanation={codeExplanations.sort}
                  />

                  <h3>5. Pembalikan (reverse()) – Membalik Urutan List</h3>
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
                    codeExplanation={codeExplanations.reverse}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Manipulasi List</h2>
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
                    extraAfterBadge="'alpukat' berhasil ditambahkan di indeks terakhir (indeks 4)"
                    codeExplanation={codeExplanations.append}
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
                    extraAfterBadge="'alpukat' berhasil ditambahkan di indeks 1 dan menggeser posisi elemen pada indeks 1 sebelumnya"
                    codeExplanation={codeExplanations.insert}
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
                    extraAfterBadge="'salak', 'jeruk', 'manggis' berhasil ditambahkan ke dalam list"
                    codeExplanation={codeExplanations.extend}
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
                    extraAfterBadge="'jeruk' berhasil dihapus dari list"
                    codeExplanation={codeExplanations.remove}
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
                    extraAfterBadge="'mangga' berhasil dihapus dari list"
                    codeExplanation={codeExplanations.pop}
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
                    extraAfterBadge="indeks 3 dari variabel buah berhasil diubah menjadi 'belimbing'"
                    codeExplanation={codeExplanations.change}
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
                    extraAfterBadge="indeks 1 sampai 3-1 sudah dihapus"
                    codeExplanation={codeExplanations.del_example}
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
                    extraAfterBadge="Semua elemen list telah dihapus (clear)"
                    codeExplanation={codeExplanations.clear}
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
                    extraAfterBadge="Angka 2 muncul sebanyak 2 kali dalam list"
                    codeExplanation={codeExplanations.count}
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
                    extraAfterBadge="Nilai 20 pertama kali ditemukan di indeks 1"
                    codeExplanation={codeExplanations.index}
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
                    extraAfterBadge="Panjang list buah adalah 4 (durian, nanas, mangga, rambutan)"
                    codeExplanation={codeExplanations.length}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>AYO PRAKTIK!</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    <strong>Studi Kasus: Manajemen Daftar Belanja</strong>
                  </p>
                  <p style={styles.text}>
                    Andi pergi ke pasar untuk membeli buah. Ia ingin membeli apel, jeruk, dan mangga. 
                    Karena lupa membawa catatan, ia menyimpan daftar belanjanya dalam sebuah list Python bernama <code>belanja</code>.
                    Ikuti langkah-langkah berikut untuk menyelesaikan studi kasus ini:
                  </p>
                  <ol style={styles.list}>
                    <li>Buat list bernama <code>belanja</code> yang berisi apel, jeruk, mangga</li>
                    <li>Tambahkan pisang ke dalam list <code>belanja</code> menggunakan method <code>append()</code>.</li>
                    <li>Hapus jeruk dari list <code>belanja</code> menggunakan <code>remove()</code> atau <code>pop()</code>.</li>
                    <li>Cetak isi list <code>belanja</code> yang sudah diperbarui menggunakan <code>print()</code>.</li>
                  </ol>
                  <p style={styles.text}>Buatlah program Python sesuai langkah-langkah di atas!</p>
                  <CodeEditorEditable title="Ayo Praktik" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <p>Seret method list ke kegunaan yang sesuai. Klik "Periksa Jawaban" setelah semua pasangan sudah lengkapi. Pasangan yang salah bisa diperbaiki. Tombol "Reset Jawaban Salah" akan mengacak ulang hanya pasangan yang masih salah.</p>
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