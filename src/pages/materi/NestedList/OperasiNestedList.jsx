import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';

// ===================== PENJELASAN PER BARIS =====================
const PenjelasanPerBaris = ({ code }) => {
  const lines = code.split('\n').filter(l => l.trim().length > 0);
  const getPenjelasan = (line) => {
    if (line.includes('=') && line.includes('[[')) return "Membuat nested list dan menyimpannya ke variabel.";
    if (line.includes('print')) {
      if (line.includes('[0][1]')) return "Mencetak elemen baris 1 kolom 2 (indeks 0,1).";
      if (line.includes('[2][2]')) return "Mencetak elemen baris 3 kolom 3 (indeks 2,2).";
      if (line.includes('data[2][1]')) return "Mencetak elemen baris 3 kolom 2 (indeks 2,1).";
      return "Mencetak nilai ke layar.";
    }
    if (line.includes('=') && line.includes('data[0][0] = 99')) return "Mengubah elemen baris 1 kolom 1 menjadi 99.";
    if (line.includes('=') && line.includes('data[1][2] = 88')) return "Mengubah elemen baris 2 kolom 3 menjadi 88.";
    if (line.includes('=') && line.includes('data[2][1] = 77')) return "Mengubah elemen baris 3 kolom 2 menjadi 77.";
    if (line.includes('.append(')) return "Menambahkan elemen/baris baru di akhir list.";
    if (line.includes('.insert(')) return "Menyisipkan elemen/baris pada posisi tertentu.";
    if (line.includes('pop(')) return "Menghapus elemen pada indeks tertentu.";
    if (line.includes('del ')) return "Menghapus elemen dengan keyword del.";
    if (line.includes('for')) return "Perulangan untuk memproses setiap baris.";
    if (line.includes('if')) return "Percabangan kondisi.";
    return "Baris kode Python biasa.";
  };

  return (
    <div style={styles.penjelasanBox}>
      <h4 style={styles.penjelasanTitle}>Penjelasan Kode (per baris)</h4>
      {lines.map((line, idx) => {
        const penjelasan = getPenjelasan(line);
        if (!penjelasan) return null;
        return (
          <div key={idx} style={styles.penjelasanItem}>
            <div style={styles.penjelasanBaris}><strong>Baris {idx+1}:</strong></div>
            <div style={styles.penjelasanKode}>{line}</div>
            <div style={styles.penjelasanArrow}>→</div>
            <div style={styles.penjelasanDeskripsi}>{penjelasan}</div>
          </div>
        );
      })}
    </div>
  );
};

// ===================== VISUALISASI INTERAKTIF DENGAN ANIMASI =====================
const VisualisasiOperasi = ({ dataAwal, dataAkhir, operation }) => {
  const [animating, setAnimating] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  useEffect(() => {
    if (operation === 'ubah' || operation === 'tambahBaris' || operation === 'sisipBaris' || 
        operation === 'hapusBaris' || operation === 'tambahKolom' || operation === 'hapusKolom') {
      setShowBeforeAfter(true);
    }
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 3300);
    return () => clearTimeout(timer);
  }, [dataAwal, dataAkhir, operation]);

  const handleCellClick = (row, col, value) => {
    setSelectedCell({ row, col, value });
    setTimeout(() => setSelectedCell(null), 2000);
  };

  const renderMatrix = (data, title, isAfter = false) => {
    if (!data) return null;
    return (
      <div style={{ marginBottom: "15px" }}>
        <h5 style={{ margin: "0 0 8px 0", color: isAfter ? "#28a745" : "#306998" }}>{title}</h5>
        <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td
                    key={`${i}-${j}`}
                    style={{
                      border: "1px solid #306998",
                      padding: "10px 15px",
                      textAlign: "center",
                      backgroundColor: animating ? (isAfter ? "#FFD43B" : "#d4edda") : "#f8f9fa",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCellClick(i, j, val)}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={styles.visualisasiContainer}>
      <h4 style={styles.visualisasiTitle}>Visualisasi Proses</h4>
      {showBeforeAfter ? (
        <>
          {renderMatrix(dataAwal, "🔹 Sebelum operasi", false)}
          <div style={{ textAlign: "center", margin: "10px 0" }}>
            <span style={{ fontSize: "24px", animation: animating ? "pulse 0.5s infinite" : "none" }}>⬇️</span>
            <p style={{ fontStyle: "italic", color: "#306998" }}>{animating ? "✨ Operasi sedang berlangsung..." : "✅ Selesai"}</p>
          </div>
          {renderMatrix(dataAkhir, "🔸 Setelah operasi", true)}
        </>
      ) : (
        renderMatrix(dataAwal, "📌 Struktur Data", false)
      )}
      {selectedCell && (
        <div style={styles.visualisasiPopup}>
          <strong>Detail Elemen:</strong> baris {selectedCell.row+1}, kolom {selectedCell.col+1} → nilai <code>{selectedCell.value}</code>
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

// ===================== KODE EDITOR LENGKAP =====================
const CodeEditorEnhanced = ({ code, codeKey, pyodideReady, runPythonCode }) => {
  const [output, setOutput] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [visualData, setVisualData] = useState(null);
  const [visualDataAfter, setVisualDataAfter] = useState(null);
  const [operationType, setOperationType] = useState("");
  const cleanCode = code; // sudah tanpa komentar

  useEffect(() => {
    // Setup data visualisasi berdasarkan codeKey
    if (codeKey === 'mengakses') {
      setVisualData([[1,2,3],[4,5,6],[7,8,9]]);
      setOperationType("akses");
    } else if (codeKey === 'mengubah') {
      setVisualData([[1,2,3],[4,5,6],[7,8,9]]);
      setVisualDataAfter([[99,2,3],[4,5,88],[7,77,9]]);
      setOperationType("ubah");
    } else if (codeKey === 'menambahBaris') {
      setVisualData([[1,2,3],[4,5,6]]);
      setVisualDataAfter([[1,2,3],[4,5,6],[7,8,9]]);
      setOperationType("tambahBaris");
    } else if (codeKey === 'menyisipBaris') {
      setVisualData([[1,2,3],[4,5,6]]);
      setVisualDataAfter([[1,2,3],[10,11,12],[4,5,6]]);
      setOperationType("sisipBaris");
    } else if (codeKey === 'menghapusBaris') {
      setVisualData([[1,2,3],[4,5,6],[7,8,9]]);
      setVisualDataAfter([[1,2,3],[4,5,6]]);
      setOperationType("hapusBaris");
    } else if (codeKey === 'menambahKolom') {
      setVisualData([[1,2,3],[4,5,6],[7,8,9]]);
      setVisualDataAfter([[1,2,3,0],[4,5,6,0],[7,8,9,0]]);
      setOperationType("tambahKolom");
    } else if (codeKey === 'menghapusKolom') {
      setVisualData([[1,2,3],[4,5,6],[7,8,9]]);
      setVisualDataAfter([[1,3],[4,6],[7,9]]);
      setOperationType("hapusKolom");
    } else if (codeKey === 'mencari') {
      setVisualData([[1,2,3],[4,5,6],[7,8,9]]);
      setOperationType("cari");
    } else if (codeKey === 'mengaksesRagged') {
      setVisualData([[1,2],[3,4,5,6],[7]]);
      setOperationType("ragged");
    } else if (codeKey === 'iterasi') {
      setVisualData([[1,2,3],[4,5,6]]);
      setOperationType("iterasi");
    } else if (codeKey === 'listComprehension') {
      setVisualData([[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
      setOperationType("comprehension");
    } else if (codeKey === 'menggabungkan') {
      setVisualData([[[1,2],[3,4]], [[5,6],[7,8]]]);
      setOperationType("gabung");
    }
  }, [codeKey]);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat...");
      setShowDetail(true);
      return;
    }
    const result = await runPythonCode(cleanCode);
    setOutput(result);
    setShowDetail(true);
  }, [pyodideReady, cleanCode, runPythonCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>Contoh Kode Program</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady}>
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>{cleanCode}</pre>
      </div>
      {showDetail && (
        <>
          {visualData && (
            <VisualisasiOperasi
              dataAwal={visualData}
              dataAkhir={visualDataAfter}
              operation={operationType}
            />
          )}
          <div style={styles.outputBox}>
            <div style={styles.outputHeader}>
              <span style={styles.outputTitle}>Output</span>
            </div>
            <div style={styles.codeOutput}>
              <pre style={styles.outputContent}>{output || "(Tidak ada output)"}</pre>
            </div>
          </div>
          <PenjelasanPerBaris code={cleanCode} />
        </>
      )}
      {!showDetail && (
        <div style={styles.promptBox}>
          ⚡ Klik tombol "Jalankan" untuk melihat visualisasi, output, dan penjelasan.
        </div>
      )}
    </div>
  );
};

// ===================== KOMPONEN LAIN (TIDAK BERUBAH) =====================
const CodeEditorEditable = ({ codeKey, title, validationRules, pyodideReady, runPythonCode, expectedOutput }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setError("");
  }, []);

  const validateCode = useCallback((code) => {
    const trimmedCode = code.trim();
    if (!/\bdata\s*=\s*\[\[.*?\]\s*,\s*\[.*?\]\s*,\s*\[.*?\]\]/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Buatlah nested list dengan nama 'data' berisi tiga baris." };
    }
    if (!/print\s*\(\s*data\s*\[\s*2\s*\]\s*\[\s*1\s*\]\s*\)/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Tampilkan elemen baris ke-3 kolom ke-2 dengan print(data[2][1])." };
    }
    if (!/data\s*\[\s*0\s*\]\s*\[\s*0\s*\]\s*=\s*100/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Ubah elemen pertama baris pertama menjadi 100." };
    }
    return { valid: true };
  }, []);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setOutput("");
    setError("");

    const validation = validateCode(localCode);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    const result = await runPythonCode(localCode);
    setOutput(result);
    
    const lines = result.trim().split('\n').filter(l => l.trim() !== "");
    if (expectedOutput && lines[0] === expectedOutput[0]) {
      setOutput(result + "\n\n✅ SELAMAT! Kode kamu benar!");
    } else if (expectedOutput) {
      setOutput(result + "\n\n⚠️ Output tidak sesuai. Cek kembali nilai yang dicetak.");
    }
  }, [pyodideReady, localCode, runPythonCode, validateCode, expectedOutput]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady}>
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      {error && <div style={styles.errorBox}>{error}</div>}
      <textarea
        style={{ ...styles.codeInputEditable, border: error ? "2px solid #ff4444" : "none" }}
        value={localCode}
        onChange={handleChange}
        placeholder="Ketik kode Python kamu di sini..."
        spellCheck={false}
        autoComplete="off"
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

const CodeCompletionQuestion = ({ question, codeParts, placeholders, expectedAnswers, onCheck, resetTrigger }) => {
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
    setChecked(false);
    setFeedback("");
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
      setFeedback("✅ Benar! Jawaban tepat.");
      if (onCheck) onCheck(true);
    } else {
      const expectedStr = expectedAnswers.join(", ");
      setFeedback(`❌ Salah. Jawaban yang benar: ${expectedStr}`);
      if (onCheck) onCheck(false);
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
      <button style={styles.checkButton} onClick={handleCheck}>Periksa</button>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

const DragDropCompletionQuestion = ({ question, codeTemplate, placeholders, options, expectedAnswers, resetTrigger }) => {
  const [answers, setAnswers] = useState(placeholders.map(() => ""));
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAnswers(placeholders.map(() => ""));
    setFeedback("");
    setChecked(false);
  }, [resetTrigger, placeholders]);

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
    }
  }, []);

  const handleResetSlot = useCallback((idx) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[idx] = "";
      return newAnswers;
    });
    setChecked(false);
    setFeedback("");
  }, []);

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
      setFeedback("✅ Benar! Semua placeholder terisi dengan benar.");
    } else {
      setFeedback("❌ Salah. Ada placeholder yang belum benar. Coba lagi!");
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
                <span style={{ color: "#888", fontStyle: "italic" }}>___</span>
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
      <button style={styles.checkButton} onClick={handleCheck}>Periksa</button>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

const Eksplorasi = ({ onComplete }) => {
  const [selected, setSelected] = useState([null, null]);
  const [feedback, setFeedback] = useState(["", ""]);
  const [hasAnswered, setHasAnswered] = useState([false, false]);

  const questions = [
    {
      text: "Untuk menambahkan baris baru (list) di akhir nested list, method yang tepat adalah ...",
      options: ["insert()", "append()", "pop()", "remove()", "extend()"],
      correct: 1,
    },
    {
      text: "Jika ingin menghapus baris dengan indeks 1 dari nested list `data`, perintah yang tepat adalah ...",
      options: ["data.remove(1)", "data.pop(1)", "data.del(1)", "delete data[1]", "data[1].pop()"],
      correct: 1,
    }
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
        <p style={styles.text}>
          Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
          <strong style={{ color: "#0d6efd" }}> Materi akan terbuka setelah kedua pertanyaan dijawab.</strong>
        </p>
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

// ===================== KOMPONEN UTAMA =====================
export default function OperasiNestedList() {
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
  const [resetInteractives, setResetInteractives] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  // Contoh kode (tanpa komentar)
  const exampleCodes = {
    mengakses: `data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
print("Elemen baris 1 kolom 2:", data[0][1])
print("Elemen baris 3 kolom 3:", data[2][2])`,
    mengubah: `data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
print("Sebelum diubah:", data)
data[0][0] = 99
data[1][2] = 88
data[2][1] = 77
print("Setelah diubah:", data)`,
    menambahBaris: `data = [[1, 2, 3],
        [4, 5, 6]]
baris_baru = [7, 8, 9]
data.append(baris_baru)
print("Setelah append:", data)`,
    menyisipBaris: `data = [[1, 2, 3],
        [4, 5, 6]]
data.insert(1, [10, 11, 12])
print("Setelah insert:", data)`,
    menghapusBaris: `data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
data.pop()
print("Setelah pop():", data)
del data[0]
print("Setelah del data[0]:", data)`,
    menambahKolom: `data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
for baris in data:
    baris.append(0)
print("Setiap baris ditambah kolom:", data)`,
    menghapusKolom: `data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
for baris in data:
    baris.pop(1)
print("Setelah hapus kolom ke-2:", data)`,
    mencari: `data = [[1, 2, 3],
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
    print(f"Nilai {cari} tidak ditemukan")`,
    mengaksesRagged: `data = [[1, 2],
        [3, 4, 5, 6],
        [7]]
print(data[1][2])
print(data[2][0])`,
    iterasi: `data = [[1, 2, 3],
        [4, 5, 6]]
for i in range(len(data)):
    for j in range(len(data[i])):
        print(f"data[{i}][{j}] = {data[i][j]}")`,
    listComprehension: `baris = 3
kolom = 4
matriks = [[0 for j in range(kolom)] for i in range(baris)]
print("Matriks 3x4 dengan nilai 0:")
print(matriks)`,
    menggabungkan: `a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]
hasil = a + b
print("Hasil penggabungan:", hasil)`,
  };

  const soal1CodeParts = [
    "data = [[10, 20, 30], [40, 50, 60]]\n# Ubah elemen baris pertama kolom kedua menjadi 99\ndata[",
    "][",
    "] = 99\nprint(data)"
  ];
  const soal1Placeholders = ["indeks baris", "indeks kolom"];
  const soal1Expected = ["0", "1"];

  const soal2CodeParts = [
    "data = [[1, 2], [3, 4]]\n# Tambahkan baris baru [5,6] di akhir\ndata.",
    "([5, 6])\nprint(data)"
  ];
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
      return `❌ Error: ${error.message}`;
    }
  }, []);

  const resetInteractiveQuestions = () => setResetInteractives(prev => prev + 1);
  const handleEksplorasiComplete = () => setIsEksplorasiCompleted(true);

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
            <Eksplorasi onComplete={handleEksplorasiComplete} />
          </section>

          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Operasi Dasar Nested List</h2>
                <div style={styles.card}>
                  <h3>1. Mengakses Elemen</h3>
                  <p style={styles.text}>Gunakan dua indeks: <code>nama[indeks_baris][indeks_kolom]</code></p>
                  <CodeEditorEnhanced code={exampleCodes.mengakses} codeKey="mengakses" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>2. Mengubah Nilai Elemen</h3>
                  <p style={styles.text}>Akses lalu tetapkan nilai baru.</p>
                  <CodeEditorEnhanced code={exampleCodes.mengubah} codeKey="mengubah" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>3. Mencari Nilai</h3>
                  <p style={styles.text}>Perulangan bersarang.</p>
                  <CodeEditorEnhanced code={exampleCodes.mencari} codeKey="mencari" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>4. Iterasi Seluruh Elemen</h3>
                  <p style={styles.text}>Perulangan bersarang.</p>
                  <CodeEditorEnhanced code={exampleCodes.iterasi} codeKey="iterasi" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>5. Panjang Baris Berbeda (Ragged Array)</h3>
                  <p style={styles.text}>Setiap baris bisa beda panjang.</p>
                  <CodeEditorEnhanced code={exampleCodes.mengaksesRagged} codeKey="mengaksesRagged" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>6. Membuat dengan List Comprehension</h3>
                  <p style={styles.text}>Cara ringkas membuat matriks.</p>
                  <CodeEditorEnhanced code={exampleCodes.listComprehension} codeKey="listComprehension" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>7. Menggabungkan Dua Nested List</h3>
                  <p style={styles.text}>Operator +</p>
                  <CodeEditorEnhanced code={exampleCodes.menggabungkan} codeKey="menggabungkan" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Manipulasi Nested List</h2>
                <div style={styles.card}>
                  <h3>1. Menambah Baris (append)</h3>
                  <CodeEditorEnhanced code={exampleCodes.menambahBaris} codeKey="menambahBaris" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>2. Menyisipkan Baris (insert)</h3>
                  <CodeEditorEnhanced code={exampleCodes.menyisipBaris} codeKey="menyisipBaris" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>3. Menghapus Baris (pop, del)</h3>
                  <CodeEditorEnhanced code={exampleCodes.menghapusBaris} codeKey="menghapusBaris" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>4. Menambah Kolom</h3>
                  <CodeEditorEnhanced code={exampleCodes.menambahKolom} codeKey="menambahKolom" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />

                  <h3>5. Menghapus Kolom</h3>
                  <CodeEditorEnhanced code={exampleCodes.menghapusKolom} codeKey="menghapusKolom" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ayo Praktik!</h2>
                <div style={styles.card}>
                  <div style={styles.alertBox}>
                    <strong>📝 Instruksi:</strong>
                    <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                      <li>Buatlah nested list dengan nama <code>data</code> yang berisi tiga baris: [1,2,3], [4,5,6], [7,8,9].</li>
                      <li>Ubah elemen baris pertama kolom pertama menjadi 100.</li>
                      <li>Tampilkan elemen baris ketiga kolom kedua (nilai 8) menggunakan print.</li>
                    </ul>
                  </div>
                  <CodeEditorEditable
                    codeKey="latihan"
                    title="Ayo Praktik"
                    validationRules={{}}
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    expectedOutput={["8"]}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <p style={styles.text}>Isilah bagian yang kosong pada kode (soal 1-2) dan drag pilihan ke area kosong (soal 3-5). Anda dapat mencoba berulang kali hingga jawaban benar.</p>
                  <button style={styles.resetButton} onClick={resetInteractiveQuestions}>↻ Reset Semua Jawaban</button>
                  
                  <CodeCompletionQuestion
                    question="1. Lengkapi kode untuk mengubah elemen baris pertama kolom kedua menjadi 99."
                    codeParts={soal1CodeParts}
                    placeholders={soal1Placeholders}
                    expectedAnswers={soal1Expected}
                    resetTrigger={resetInteractives}
                  />

                  <CodeCompletionQuestion
                    question="2. Lengkapi kode untuk menambahkan baris baru [5,6] di akhir nested list."
                    codeParts={soal2CodeParts}
                    placeholders={soal2Placeholders}
                    expectedAnswers={soal2Expected}
                    resetTrigger={resetInteractives}
                  />

                  <DragDropCompletionQuestion
                    question="3. Lengkapi kode berikut untuk menambahkan kolom (nilai 0) pada setiap baris nested list."
                    codeTemplate={soal3Template}
                    placeholders={soal3Placeholders}
                    options={soal3Options}
                    expectedAnswers={soal3Expected}
                    resetTrigger={resetInteractives}
                  />

                  <DragDropCompletionQuestion
                    question="4. Lengkapi kode berikut untuk menghapus baris pertama dari nested list."
                    codeTemplate={soal4Template}
                    placeholders={soal4Placeholders}
                    options={soal4Options}
                    expectedAnswers={soal4Expected}
                    resetTrigger={resetInteractives}
                  />

                  <DragDropCompletionQuestion
                    question="5. Lengkapi kode berikut untuk mengubah elemen baris kedua kolom pertama menjadi 99."
                    codeTemplate={soal5Template}
                    placeholders={soal5Placeholders}
                    options={soal5Options}
                    expectedAnswers={soal5Expected}
                    resetTrigger={resetInteractives}
                  />
                </div>
              </section>
            </>
          )}

          {!isEksplorasiCompleted && (
            <div style={styles.lockMessage}>🔒 Materi terkunci. Selesaikan eksplorasi di atas dengan menjawab kedua pertanyaan.</div>
          )}
        </div>
      </div>
    </>
  );
}

// ===================== STYLES =====================
const styles = {
  page: { padding: "30px 40px", paddingTop: "30px", backgroundColor: "#f5f7fa", minHeight: "calc(100vh - 64px)", fontFamily: "Poppins, sans-serif", width: "100%", boxSizing: "border-box" },
  header: { backgroundColor: "#306998", color: "white", padding: "18px 24px", position: "relative", marginBottom: "30px", borderRadius: "6px" },
  headerAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: "8px", backgroundColor: "#FFD43B", borderRadius: "6px 0 0 6px" },
  headerTitle: { margin: 0, textAlign: "center", fontSize: "28px", fontWeight: "700" },
  section: { marginBottom: "40px" },
  sectionTitle: { fontSize: "22px", fontWeight: "700", marginBottom: "15px", borderLeft: "5px solid #306998", paddingLeft: "12px" },
  card: { backgroundColor: "white", borderRadius: "10px", padding: "25px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
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
  errorBox: { backgroundColor: "#ff4444", color: "white", padding: "12px 15px", fontSize: "14px", fontWeight: "500", borderBottom: "2px solid #cc0000" },
  codeInputReadOnly: { width: "100%", minHeight: "100px", backgroundColor: "#272822", color: "#f8f8f2", border: "none", padding: "15px", fontFamily: "monospace", fontSize: "14px", overflow: "auto" },
  codePre: { margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word", fontFamily: "monospace" },
  codeInputEditable: { width: "100%", minHeight: "250px", backgroundColor: "#272822", color: "#f8f8f2", border: "none", padding: "15px", fontFamily: "monospace", fontSize: "14px", resize: "vertical", outline: "none", boxSizing: "border-box", tabSize: 4 },
  outputHeader: { backgroundColor: "#306998", color: "white", padding: "10px 15px", borderTop: "2px solid #1e1e1e" },
  outputTitle: { fontWeight: "600", fontSize: "15px" },
  codeOutput: { backgroundColor: "#1e1e1e", padding: "15px", minHeight: "80px" },
  outputContent: { color: "#4af", fontFamily: "monospace", fontSize: "14px", margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word", lineHeight: "1.5" },
  outputBox: { marginTop: "10px" },
  promptBox: { padding: "15px", textAlign: "center", color: "#666" },
  questionCard: { backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "15px", marginBottom: "20px", border: "1px solid #ddd" },
  questionText: { fontWeight: "500", marginBottom: "10px" },
  codeTemplateInline: { backgroundColor: "#272822", color: "#f8f8f2", padding: "10px", borderRadius: "6px", fontFamily: "monospace", fontSize: "14px", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", marginBottom: "10px" },
  inlineInput: { backgroundColor: "#fff", color: "#000", border: "1px solid #ccc", borderRadius: "4px", padding: "2px 6px", margin: "0 2px", fontFamily: "monospace", fontSize: "14px", textAlign: "center", outline: "none" },
  checkButton: { backgroundColor: "#28a745", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", marginRight: "10px" },
  resetButton: { backgroundColor: "#6c757d", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", marginBottom: "20px" },
  feedback: { marginTop: "8px", fontSize: "14px", fontStyle: "italic", color: "#333" },
  bubbleContainer: { marginTop: "15px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "8px" },
  dragBubble: { display: "inline-block", padding: "6px 12px", margin: "4px", backgroundColor: "#306998", color: "white", borderRadius: "20px", cursor: "grab", fontSize: "14px", userSelect: "none", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  penjelasanBox: { marginTop: "15px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px", borderLeft: "4px solid #306998" },
  penjelasanTitle: { margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#306998" },
  penjelasanItem: { marginBottom: "12px", padding: "8px", backgroundColor: "#fff", borderRadius: "6px", border: "1px solid #e9ecef", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px" },
  penjelasanBaris: { fontWeight: "bold", color: "#306998", minWidth: "60px" },
  penjelasanKode: { fontFamily: "monospace", backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: "4px", color: "#d63384" },
  penjelasanArrow: { color: "#6c757d", fontWeight: "bold" },
  penjelasanDeskripsi: { color: "#333", flex: 1 },
  visualisasiContainer: { marginTop: "15px", padding: "15px", backgroundColor: "#eef2fa", borderRadius: "8px", border: "1px solid #306998", textAlign: "center" },
  visualisasiTitle: { margin: "0 0 12px 0", color: "#306998", fontWeight: "bold" },
  visualisasiPopup: { marginTop: "12px", padding: "8px", backgroundColor: "#fff3cd", borderLeft: "5px solid #FFD43B", borderRadius: "8px", fontSize: "14px" },
};