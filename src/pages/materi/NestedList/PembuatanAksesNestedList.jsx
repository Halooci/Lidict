import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';

// ===================== PENJELASAN PER BARIS =====================
const PenjelasanPerBaris = ({ code }) => {
  const lines = code.split("\n").filter((l) => l.trim().length > 0);
  const getPenjelasan = (line, index) => {
    if (line.trim().startsWith("#")) return null;
    if (line.includes("=") && line.includes("[[")) {
      return `Membuat nested list dengan nama variabel dan struktur baris/kolom.`;
    }
    if (line.includes("print")) {
      if (line.includes("[0][0]"))
        return `Mencetak elemen baris pertama kolom pertama (indeks 0,0) → nilai 1.`;
      if (line.includes("[1][2]"))
        return `Mencetak elemen baris kedua kolom ketiga (indeks 1,2) → nilai 6.`;
      return `Mencetak nilai atau struktur data ke layar.`;
    }
    if (line.includes("data = ["))
      return `Membuat nested list dengan panjang baris berbeda (ragged array).`;
    return `Baris kode Python: ${line}`;
  };

  const filteredLines = lines.filter((line) => !line.trim().startsWith("#"));
  return (
    <div style={styles.penjelasanBox}>
      <h4 style={styles.penjelasanTitle}>Penjelasan baris kode program</h4>
      {filteredLines.map((line, idx) => {
        const penjelasan = getPenjelasan(line, idx);
        if (!penjelasan) return null;
        const lineNumber = idx + 1;
        return (
          <div key={idx} style={styles.penjelasanItem}>
            <div style={styles.penjelasanBaris}>
              <strong>Baris {lineNumber}:</strong>
            </div>
            <div style={styles.penjelasanKode}>{line}</div>
            <div style={styles.penjelasanArrow}>→</div>
            <div style={styles.penjelasanDeskripsi}>{penjelasan}</div>
          </div>
        );
      })}
    </div>
  );
};

// ===================== VISUALISASI CONTOH KODE =====================
const VisualisasiContoh = ({ codeKey, output }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (output) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [output]);

  if (codeKey === "pembuatan" || codeKey === "akses") {
    const cellStyle = (value) => ({
      border: "1px solid #306998",
      padding: "8px 12px",
      textAlign: "center",
      transition: "all 0.3s ease",
      backgroundColor: animate ? "#FFD43B" : "#f1f3f5",
      color: animate ? "#306998" : "inherit",
    });

    return (
      <div style={styles.visualisasiContainer}>
        <h4 style={styles.visualisasiTitle}>Visualisasi Nested List</h4>
        <table style={{ borderCollapse: "collapse", margin: "10px 0" }}>
          <tbody>
            <tr>
              <td style={cellStyle(1)}>1</td>
              <td style={cellStyle(2)}>2</td>
              <td style={cellStyle(3)}>3</td>
            </tr>
            <tr>
              <td style={cellStyle(4)}>4</td>
              <td style={cellStyle(5)}>5</td>
              <td style={cellStyle(6)}>6</td>
            </tr>
          </tbody>
        </table>
        {codeKey === "pembuatan" && (
          <p style={styles.visualisasiText}>
            Membuat matriks 2x3 dengan nama <code>matriks</code>
          </p>
        )}
        {codeKey === "akses" && (
          <div>
            <p style={styles.visualisasiText}>
              <code>matriks[0][0]</code> → <strong>1</strong> (baris 1, kolom 1)
            </p>
            <p style={styles.visualisasiText}>
              <code>matriks[1][2]</code> → <strong>6</strong> (baris 2, kolom 3)
            </p>
          </div>
        )}
      </div>
    );
  }
  if (codeKey === "panjangBerbeda") {
    return (
      <div style={styles.visualisasiContainer}>
        <h4 style={styles.visualisasiTitle}>Visualisasi Ragged Array</h4>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            margin: "10px 0",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", width: "60px" }}>Baris 0:</span>
            <div style={{ display: "flex", gap: "4px" }}>
              <div style={styles.raggedCell}>1</div>
              <div style={styles.raggedCell}>2</div>
            </div>
            <span style={{ marginLeft: "10px", fontSize: "12px" }}>
              (2 kolom)
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", width: "60px" }}>Baris 1:</span>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              <div style={styles.raggedCell}>3</div>
              <div style={styles.raggedCell}>4</div>
              <div style={styles.raggedCell}>5</div>
              <div style={styles.raggedCell}>6</div>
            </div>
            <span style={{ marginLeft: "10px", fontSize: "12px" }}>
              (4 kolom)
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", width: "60px" }}>Baris 2:</span>
            <div style={{ display: "flex", gap: "4px" }}>
              <div style={styles.raggedCell}>7</div>
              <div style={styles.raggedCell}>8</div>
              <div style={styles.raggedCell}>9</div>
            </div>
            <span style={{ marginLeft: "10px", fontSize: "12px" }}>
              (3 kolom)
            </span>
          </div>
        </div>
        <p style={styles.visualisasiText}>
          Setiap baris bisa memiliki jumlah kolom berbeda.
        </p>
      </div>
    );
  }
  return null;
};

// ===================== HAPUS KOMENTAR =====================
const removeComments = (code) => {
  return code
    .split("\n")
    .filter((line) => !line.trim().startsWith("#"))
    .join("\n");
};

// ===================== CODE EDITOR READ-ONLY (dengan pemisahan card) =====================
const CodeEditor = ({ code, codeKey, pyodideReady, runPythonCode }) => {
  const [output, setOutput] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const cleanCode = removeComments(code);

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
      {/* Bagian Contoh Kode Program */}
      <div style={styles.cardSection}>
        <div style={styles.codeEditorHeader}>
          <span style={styles.codeEditorTitle}>Contoh Kode Program</span>
          <button
            style={styles.runButton}
            onClick={handleRun}
            disabled={!pyodideReady}
          >
            {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
          </button>
        </div>
        <div style={styles.codeInputReadOnly}>
          <pre style={styles.codePre}>{cleanCode}</pre>
        </div>
      </div>

      {showDetail && (
        <>
          {/* Visualisasi Kode Program */}
          <div style={styles.cardSection}>
            <div style={styles.visualisasiHeader}>
              <span style={styles.visualisasiHeaderTitle}>
                Visualisasi Kode Program
              </span>
            </div>
            <VisualisasiContoh codeKey={codeKey} output={output} />
          </div>

          {/* Output */}
          <div style={styles.cardSection}>
            <div style={styles.outputHeader}>
              <span style={styles.outputTitle}>Output</span>
            </div>
            <div style={styles.codeOutput}>
              <pre style={styles.outputContent}>
                {output || "(Tidak ada output)"}
              </pre>
            </div>
          </div>

          {/* Penjelasan per baris */}
          <div style={styles.cardSection}>
            <PenjelasanPerBaris code={cleanCode} />
          </div>
        </>
      )}

      {!showDetail && (
        <div style={styles.promptBox}>
          ⚡ Klik tombol "Jalankan" untuk melihat visualisasi, output, dan
          penjelasan.
        </div>
      )}
    </div>
  );
};

// ===================== CODE EDITOR EDITABLE (PRAKTIK) =====================
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
        <button
          style={styles.runButton}
          onClick={handleRun}
          disabled={!pyodideReady}
        >
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

// ===================== SOAL MELENGKAPI KODE =====================
const CodeCompletionQuestion = ({
  id,
  question,
  codeParts,
  placeholders,
  expectedAnswers,
  onCheck,
}) => {
  const [answers, setAnswers] = useState(placeholders.map(() => ""));
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleAnswerChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
    setChecked(false);
    setFeedback("");
    setShowReset(false);
  };

  const handleCheck = () => {
    if (answers.some((a) => a.trim() === "")) {
      setFeedback("⚠️ Lengkapi semua kotak isian terlebih dahulu.");
      return;
    }
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
      setShowReset(false);
      if (onCheck) onCheck(id, true);
    } else {
      setFeedback("❌ Salah, coba lagi.");
      setShowReset(true);
      if (onCheck) onCheck(id, false);
    }
  };

  const handleReset = () => {
    setAnswers(placeholders.map(() => ""));
    setFeedback("");
    setChecked(false);
    setShowReset(false);
    if (onCheck) onCheck(id, false);
  };

  const renderCodeWithInputs = () => {
    const result = [];
    for (let i = 0; i < codeParts.length; i++) {
      result.push(<span key={`text-${i}`}>{codeParts[i]}</span>);
      if (i < placeholders.length) {
        let inputSize = Math.max(placeholders[i]?.length || 8, 12);
        if (expectedAnswers[i] && expectedAnswers[i].length > inputSize)
          inputSize = expectedAnswers[i].length + 2;
        result.push(
          <input
            key={`input-${i}`}
            type="text"
            size={inputSize}
            style={styles.inlineInput}
            value={answers[i]}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            disabled={checked && feedback === "✅ Benar!"}
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
      <div style={styles.buttonGroup}>
        <button
          style={styles.checkButton}
          onClick={handleCheck}
          disabled={checked && feedback === "✅ Benar!"}
        >
          Periksa
        </button>
        {showReset && (
          <button style={styles.resetButtonSmall} onClick={handleReset}>
            Reset Jawaban
          </button>
        )}
      </div>
      {feedback && (
        <div
          style={
            feedback.includes("Benar")
              ? styles.feedbackSuccess
              : styles.feedbackError
          }
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

// ===================== SOAL TEBAK OUTPUT =====================
const GuessOutputQuestion = ({ id, question, codeSnippet, expectedOutput, onCheck }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleCheck = () => {
    if (userAnswer.trim() === "") {
      setFeedback("⚠️ Isi jawaban Anda terlebih dahulu.");
      return;
    }
    const isCorrect = userAnswer.trim() === expectedOutput;
    setChecked(true);
    if (isCorrect) {
      setFeedback("✅ Benar!");
      setShowReset(false);
      if (onCheck) onCheck(id, true);
    } else {
      setFeedback("❌ Salah, coba lagi.");
      setShowReset(true);
      if (onCheck) onCheck(id, false);
    }
  };

  const handleReset = () => {
    setUserAnswer("");
    setFeedback("");
    setChecked(false);
    setShowReset(false);
    if (onCheck) onCheck(id, false);
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
        disabled={checked && feedback === "✅ Benar!"}
      />
      <div style={styles.buttonGroup}>
        <button
          style={styles.checkButton}
          onClick={handleCheck}
          disabled={checked && feedback === "✅ Benar!"}
        >
          Periksa
        </button>
        {showReset && (
          <button style={styles.resetButtonSmall} onClick={handleReset}>
            Reset Jawaban
          </button>
        )}
      </div>
      {feedback && (
        <div
          style={
            feedback.includes("Benar")
              ? styles.feedbackSuccess
              : styles.feedbackError
          }
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

// ===================== EKSPLORASI =====================
const Eksplorasi = ({ onComplete }) => {
  const [selected, setSelected] = useState([null, null]);
  const [feedback, setFeedback] = useState(["", ""]);
  const [hasAnswered, setHasAnswered] = useState([false, false]);

  const questions = [
    {
      text: "Berikut ini yang merupakan sintaks yang benar untuk membuat nested list adalah ...",
      options: ["[1,2,3]", "[[1,2],[3,4]]", "(1,2,3)", "{1,2,3}", "[1,2,[3,4]]"],
      correct: 1,
    },
    {
      text: "Jika `matriks = [[1,2,3],[4,5,6]]`, cara mengakses elemen 6 adalah ...",
      options: [
        "matriks[1][2]",
        "matriks[2][1]",
        "matriks[1][1]",
        "matriks[2][2]",
        "matriks[0][2]",
      ],
      correct: 0,
    },
  ];

  const handleAnswer = (qIdx, optIdx) => {
    if (hasAnswered[qIdx]) return;
    setSelected((prev) => {
      const newSel = [...prev];
      newSel[qIdx] = optIdx;
      return newSel;
    });
    const isCorrect = optIdx === questions[qIdx].correct;
    setFeedback((prev) => {
      const newFb = [...prev];
      newFb[qIdx] = isCorrect ? "Benar" : "Salah";
      return newFb;
    });
    setHasAnswered((prev) => {
      const newAns = [...prev];
      newAns[qIdx] = true;
      return newAns;
    });
  };

  useEffect(() => {
    if (hasAnswered.every((v) => v === true)) onComplete();
  }, [hasAnswered, onComplete]);

  return (
    <div>
      <h2 style={styles.sectionTitle}>Eksplorasi Awal</h2>
      <div style={styles.card}>
        <p style={styles.text}>
          Sebelum belajar, jawab pertanyaan berikut.{" "}
          <strong style={{ color: "#0d6efd" }}>
            Materi akan terbuka setelah kedua pertanyaan dijawab.
          </strong>
        </p>
        {questions.map((q, idx) => {
          const isAnswered = hasAnswered[idx];
          const selectedIdx = selected[idx];
          return (
            <div key={idx} style={styles.eksplorasiItem}>
              <p style={styles.eksplorasiQuestion}>
                {idx + 1}. {q.text}
              </p>
              <div style={styles.eksplorasiOptions}>
                {q.options.map((opt, optIdx) => {
                  let optionStyle = styles.eksplorasiOption;
                  if (isAnswered) {
                    optionStyle = { ...styles.eksplorasiOptionDisabled };
                    if (selectedIdx === optIdx) {
                      const isCorrect = selectedIdx === q.correct;
                      optionStyle = {
                        ...optionStyle,
                        backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
                        borderColor: isCorrect ? "#28a745" : "#dc3545",
                        color: isCorrect ? "#155724" : "#842029",
                      };
                    }
                  }
                  return (
                    <div
                      key={optIdx}
                      onClick={() => !isAnswered && handleAnswer(idx, optIdx)}
                      style={optionStyle}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
              {feedback[idx] && (
                <div
                  style={
                    feedback[idx] === "Benar"
                      ? styles.feedbackCorrect
                      : styles.feedbackWrong
                  }
                >
                  {feedback[idx]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===================== STRUKTUR INTERAKTIF (dengan hover & border) =====================
const StrukturInteraktif = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const data = [
    [85, 90, 78],
    [88, 92, 80],
  ];

  const handleClick = (row, col) => {
    if (row === null && col === null)
      setSelectedElement({
        text: "nilai_siswa → [[85, 90, 78], [88, 92, 80]] (seluruh nested list)",
      });
    else if (col === null)
      setSelectedElement({
        text: `nilai_siswa[${row}] → [${data[row].join(
          ", "
        )}] (seluruh baris ke-${row + 1})`,
      });
    else
      setSelectedElement({
        text: `nilai_siswa[${row}][${col}] → ${data[row][col]} (baris ${
          row + 1
        }, kolom ${col + 1})`,
      });
  };

  return (
    <div style={styles.strukturContainer}>
      <h4 style={styles.strukturTitle}>
        Visualisasi Struktur Nested List (Klik pada elemen)
      </h4>
      <p style={styles.strukturPetunjuk}>
        💡 Petunjuk: Klik pada kotak "nilai_siswa", pada setiap judul baris,
        atau pada setiap angka dalam tabel.
      </p>
      <div style={styles.strukturKode}>
        <pre style={styles.strukturPre}>
          nilai_siswa = [[85, 90, 78], [88, 92, 80]]
        </pre>
      </div>
      <div style={styles.strukturWrapper}>
        <div style={styles.strukturSeluruh} onClick={() => handleClick(null, null)}>
          <div
            style={
              selectedElement?.text?.includes("seluruh")
                ? styles.strukturSeluruhActive
                : styles.strukturSeluruhButton
            }
          >
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
                <td
                  style={styles.strukturTableRowLabel}
                  onClick={() => handleClick(rowIdx, null)}
                >
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
      {selectedElement && (
        <div style={styles.strukturInfo}>{selectedElement.text}</div>
      )}
    </div>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function PembuatanAksesNestedList() {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);
  const [exerciseStatus, setExerciseStatus] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  // Menambahkan CSS global untuk efek hover pada tabel interaktif
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

  const exampleCodes = {
    pembuatan: `# Membuat nested list 2 baris 3 kolom
matriks = [[1, 2, 3],
           [4, 5, 6]]
print("Matriks:")
print(matriks)`,
    akses: `# Mengakses elemen nested list
matriks = [[1, 2, 3],
           [4, 5, 6]]
print("Elemen baris 1 kolom 1:", matriks[0][0])
print("Elemen baris 2 kolom 3:", matriks[1][2])`,
    panjangBerbeda: `# Nested list dengan panjang baris berbeda
data = [[1, 2],
        [3, 4, 5],
        [6]]
print(data)`,
  };

  const soal1CodeParts = [
    "data = [[10,20,30],[40,50,60]]\nprint(data[",
    "][",
    "])",
  ];
  const soal1Expected = ["0", "1"];
  const soal2CodeParts = ["matriks = [[1,2], ", "]\nprint(matriks)"];
  const soal2Expected = ["[3,4]"];
  const soal3CodeParts = [
    "data = [[10,20],[30,40],[50,60]]\nprint(data[",
    "][",
    "])",
  ];
  const soal3Expected = ["2", "1"];

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
    } catch (error) {
      return `❌ Error: ${error.message}`;
    }
  }, []);

  const handleEksplorasiComplete = () => setIsEksplorasiCompleted(true);
  const handleExerciseCheck = (id, isCorrect) => {
    setExerciseStatus((prev) => {
      const newStatus = [...prev];
      newStatus[id] = isCorrect;
      return newStatus;
    });
  };
  const allExercisesCorrect = exerciseStatus.every((v) => v === true);

  return (
    <>
      <Navbar />
      <SidebarMateri
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        style={{
          marginLeft: isSidebarOpen ? "280px" : "0",
          transition: "margin-left 0.3s ease",
          paddingTop: "64px",
          minHeight: "100vh",
          width: "auto",
        }}
      >
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>
              PEMBUATAN DAN AKSES ELEMEN NESTED LIST
            </h1>
          </div>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>
                  Mahasiswa mampu membuat nested list sesuai kebutuhan
                  representasi data.
                </li>
                <li>
                  Mahasiswa mampu mengakses elemen nested list menggunakan
                  indeks baris dan kolom.
                </li>
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
                  <h3 style={styles.subTitle}>Struktur Nested List</h3>
                  <p style={styles.text}>
                    Nested list dapat dipandang sebagai tabel/matriks. Indeks
                    pertama = baris, kedua = kolom.
                  </p>
                  <StrukturInteraktif />
                </div>
              </section>
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={styles.subTitle}>Membuat Nested List</h3>
                  <p style={styles.text}>
                    <strong>Nested list</strong> adalah list yang di dalamnya
                    berisi list lain. Struktur ini sangat berguna untuk
                    merepresentasikan data dua dimensi seperti tabel, matriks,
                    atau kumpulan data yang berelasi. Contoh sederhana:{" "}
                    <code>matriks = [[1, 2, 3], [4, 5, 6]]</code> akan membuat
                    sebuah nested list dengan 2 baris dan 3 kolom. Setiap baris
                    ditulis sebagai list terpisah, dipisahkan koma, dan
                    seluruhnya diapit tanda kurung siku. Anda juga dapat
                    membuat nested list dengan panjang baris berbeda (dikenal
                    sebagai <em>ragged array</em>), misalnya{" "}
                    <code>data = [[1,2], [3,4,5], [6]]</code>.
                  </p>
                  <p style={styles.text}>
                    Perhatikan penamaan variabel: gunakan nama yang deskriptif,
                    misal <code>nilai_siswa</code>, <code>matriks</code>, atau{" "}
                    <code>data_penjualan</code>. Dengan memahami cara membuat
                    nested list, Anda dapat menyimpan data terstruktur dengan
                    mudah.
                  </p>
                  <CodeEditor
                    code={exampleCodes.pembuatan}
                    codeKey="pembuatan"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                  <CodeEditor
                    code={exampleCodes.panjangBerbeda}
                    codeKey="panjangBerbeda"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={styles.subTitle}>Mengakses Elemen</h3>
                  <p style={styles.text}>
                    Untuk mengambil nilai dari nested list, Anda perlu
                    menggunakan <strong>dua indeks</strong> (baris dan kolom).
                    Indeks pertama menunjukkan nomor baris, indeks kedua
                    menunjukkan nomor kolom. Ingatlah bahwa indeks dalam Python
                    selalu dimulai dari <strong>0</strong>. Jadi baris pertama
                    adalah indeks 0, kolom pertama juga indeks 0.
                  </p>
                  <p style={styles.text}>
                    Misalkan <code>matriks = [[1, 2, 3], [4, 5, 6]]</code>:
                    <ul style={styles.list}>
                      <li>
                        <code>matriks[0][0]</code> → mengakses baris 1, kolom 1
                        → menghasilkan <strong>1</strong>.
                      </li>
                      <li>
                        <code>matriks[1][2]</code> → mengakses baris 2, kolom 3
                        → menghasilkan <strong>6</strong>.
                      </li>
                    </ul>
                    Cara ini analog dengan koordinat (baris, kolom). Anda juga
                    bisa mengakses seluruh baris dengan satu indeks, misal{" "}
                    <code>matriks[0]</code> akan mengembalikan list{" "}
                    <code>[1,2,3]</code>.
                  </p>
                  <p style={styles.text}>
                    Pengaksesan elemen sangat penting untuk memproses data
                    tabel, misalnya mencari nilai maksimum pada setiap kolom,
                    atau menghitung rata-rata.
                  </p>
                  <CodeEditor
                    code={exampleCodes.akses}
                    codeKey="akses"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                  />
                </div>
              </section>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ayo Praktik!</h2>
                <div style={styles.card}>
                  <div style={styles.alertBox}>
                    <strong>Studi Kasus:</strong>
                    <p>
                      Data: Siswa A=[3,6,9], Siswa B=[12,15,18]. Buat nested
                      list 'matriks', cetak 3 dan 18.
                    </p>
                    <p>
                      <strong>Instruksi:</strong>
                    </p>
                    <ol style={styles.instruksiList}>
                      <li>
                        Buat nested list dengan variabel matriks dan berisi
                        [3,6,9] [12,15,18]
                      </li>
                      <li>Cetak elemen 3</li>
                      <li>Cetak elemen 18</li>
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
                    Isilah bagian kosong pada kode. Jawab semua soal. Jika
                    salah, Anda bisa mereset per soal. Setelah semua benar,
                    akan muncul ucapan selamat.
                  </p>
                  <CodeCompletionQuestion
                    id={0}
                    question="1. Akses elemen 20"
                    codeParts={soal1CodeParts}
                    placeholders={["", ""]}
                    expectedAnswers={soal1Expected}
                    onCheck={handleExerciseCheck}
                  />
                  <CodeCompletionQuestion
                    id={1}
                    question="2. Lengkapi baris kedua dengan angka 3 dan 4"
                    codeParts={soal2CodeParts}
                    placeholders={["..."]}
                    expectedAnswers={soal2Expected}
                    onCheck={handleExerciseCheck}
                  />
                  <CodeCompletionQuestion
                    id={2}
                    question="3. Cetak elemen terakhir (60)"
                    codeParts={soal3CodeParts}
                    placeholders={["", ""]}
                    expectedAnswers={soal3Expected}
                    onCheck={handleExerciseCheck}
                  />
                  <GuessOutputQuestion
                    id={3}
                    question="4. Output dari kode?"
                    codeSnippet={`nilai = [[5,7],[9,11]]\nprint(nilai[1][0])`}
                    expectedOutput="9"
                    onCheck={handleExerciseCheck}
                  />
                  <GuessOutputQuestion
                    id={4}
                    question="5. Output dari kode?"
                    codeSnippet={`a = [[2,4],[6,8]]\nb = a[0][1]\nprint(b)`}
                    expectedOutput="4"
                    onCheck={handleExerciseCheck}
                  />
                  {allExercisesCorrect && (
                    <div style={styles.finalSuccessBox}>
                      🎉 Selamat! Semua jawaban benar.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
          {!isEksplorasiCompleted && (
            <div style={styles.lockMessage}>
              🔒 Materi terkunci. Selesaikan eksplorasi di atas.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ===================== STYLES =====================
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
  subTitle: {
    marginTop: "20px",
    marginBottom: "15px",
    color: "#306998",
    fontSize: "22px",
    fontWeight: "700",
    borderLeft: "4px solid #FFD43B",
    paddingLeft: "12px",
  },
  alertBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "15px",
    color: "#856404",
  },
  instruksiList: { marginLeft: "20px" },
  lockMessage: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#cfe2ff",
    borderLeft: "5px solid #0d6efd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#084298",
  },
  eksplorasiItem: {
    marginBottom: "30px",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "20px",
  },
  eksplorasiQuestion: { fontWeight: "600", marginBottom: "12px" },
  eksplorasiOptions: { display: "flex", flexDirection: "column", gap: "10px" },
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
  penjelasanBox: {
    marginTop: "0",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    borderLeft: "4px solid #306998",
    fontFamily: "monospace",
  },
  penjelasanTitle: {
    margin: "0 0 12px 0",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#306998",
  },
  penjelasanItem: {
    marginBottom: "12px",
    padding: "8px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    border: "1px solid #e9ecef",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: "8px",
  },
  penjelasanBaris: { fontWeight: "bold", color: "#306998", minWidth: "60px" },
  penjelasanKode: {
    fontFamily: "monospace",
    backgroundColor: "#f0f0f0",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#d63384",
  },
  penjelasanArrow: { color: "#6c757d", fontWeight: "bold" },
  penjelasanDeskripsi: { color: "#333", flex: 1 },
  visualisasiContainer: {
    marginTop: "0",
    padding: "10px",
    backgroundColor: "#eef2fa",
    borderRadius: "8px",
    border: "1px solid #306998",
  },
  visualisasiTitle: { margin: "0 0 10px 0", color: "#306998", fontWeight: "bold" },
  visualisasiText: { marginTop: "8px", fontSize: "14px" },
  raggedCell: {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#f1f3f5",
    border: "1px solid #306998",
    borderRadius: "6px",
    margin: "2px",
  },
  codeEditorContainer: {
    border: "2px solid #306998",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "20px",
    backgroundColor: "#1e1e1e",
    marginTop: "15px",
  },
  cardSection: {
    margin: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    overflow: "hidden",
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
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
  },
  outputTitle: { fontWeight: "600", fontSize: "15px" },
  codeOutput: {
    backgroundColor: "#1e1e1e",
    padding: "15px",
    minHeight: "60px",
  },
  outputContent: {
    color: "#4af",
    fontFamily: "monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  codeInputReadOnly: {
    width: "100%",
    minHeight: "100px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflow: "auto",
  },
  codePre: { margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word" },
  infoBox: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "12px 15px",
    fontSize: "14px",
    borderLeft: "4px solid #28a745",
  },
  warningBox: {
    marginTop: "12px",
    padding: "10px",
    backgroundColor: "#fff3cd",
    color: "#856404",
    borderRadius: "6px",
    textAlign: "center",
  },
  codeInputEditable: {
    width: "100%",
    minHeight: "250px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    border: "none",
  },
  promptBox: { padding: "15px", textAlign: "center", color: "#666" },
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
    whiteSpace: "pre-wrap",
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
    minWidth: "120px",
  },
  fillInput: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  buttonGroup: { display: "flex", gap: "10px", alignItems: "center" },
  checkButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  resetButtonSmall: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
  feedbackSuccess: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#155724",
    backgroundColor: "#d4edda",
    padding: "8px",
    borderRadius: "6px",
  },
  feedbackError: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#721c24",
    backgroundColor: "#f8d7da",
    padding: "8px",
    borderRadius: "6px",
  },
  finalSuccessBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#d1e7dd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#0f5132",
    fontWeight: "bold",
  },
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
  visualisasiHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
  },
  visualisasiHeaderTitle: { fontWeight: "600", fontSize: "15px" },
};