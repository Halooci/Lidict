import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN VISUALISASI DICTIONARY =====================
const DictionaryVisualization = ({ data, title, changedKeys = [], accessSequence = [], showClickDetail = true }) => {
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHighlightedKey(null);
    setAnimationStep(0);

    if (!accessSequence || accessSequence.length === 0) return;

    let step = 0;
    intervalRef.current = setInterval(() => {
      if (step < accessSequence.length) {
        setHighlightedKey(accessSequence[step]);
        setAnimationStep(step + 1);
        step++;
      } else {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          setHighlightedKey(null);
          setAnimationStep(0);
        }, 500);
      }
    }, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [accessSequence]);

  const handleCardClick = (key) => {
    if (showClickDetail) setSelectedKey(selectedKey === key ? null : key);
  };

  const selectedDetail = selectedKey ? {
    key: selectedKey,
    value: data[selectedKey] !== undefined ? data[selectedKey] : "Tidak ditemukan",
    type: typeof data[selectedKey]
  } : null;

  const isChanged = (key) => changedKeys.includes(key);

  return (
    <div style={visStyles.container}>
      <div style={visStyles.title}>{title}</div>
      <div style={visStyles.dictContainer}>
        {Object.entries(data).map(([key, value]) => {
          const isHighlighted = highlightedKey === key;
          const isSelected = selectedKey === key;
          const hasChanged = isChanged(key);
          return (
            <div
              key={key}
              style={{
                ...visStyles.card,
                backgroundColor: isHighlighted ? "#FFD43B" : (isSelected ? "#2fa69a" : "#306998"),
                transform: isHighlighted ? "scale(1.02)" : "scale(1)",
                transition: "all 0.3s ease",
                cursor: showClickDetail ? "pointer" : "default",
                border: isSelected ? "2px solid #FFD43B" : (hasChanged ? "2px solid #28a745" : "none"),
                position: "relative",
              }}
              onClick={() => handleCardClick(key)}
            >
              <div style={visStyles.key}>{key}</div>
              <div style={visStyles.arrow}>→</div>
              <div style={visStyles.value}>{typeof value === 'string' ? value : JSON.stringify(value)}</div>
              {hasChanged && (
                <div style={visStyles.checkmark}>✓</div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDetail && (
        <div style={visStyles.detailPanel}>
          <div style={visStyles.detailTitle}>Detail Elemen</div>
          <div style={visStyles.detailItem}><strong>Key:</strong> {selectedDetail.key}</div>
          <div style={visStyles.detailItem}><strong>Value:</strong> {selectedDetail.value}</div>
          <div style={visStyles.detailItem}><strong>Tipe Data:</strong> {selectedDetail.type}</div>
        </div>
      )}
      {accessSequence.length > 0 && (
        <div style={visStyles.info}>
          {highlightedKey ? (
            <span>🔍 Mengakses key <strong>"{highlightedKey}"</strong> → nilai: <strong>{data[highlightedKey] !== undefined ? data[highlightedKey] : "Tidak ditemukan"}</strong></span>
          ) : animationStep === accessSequence.length ? (
            <span>✅ Semua akses selesai!</span>
          ) : (
            <span>🎬 Animasi akan berjalan... Klik Jalankan</span>
          )}
        </div>
      )}
      {accessSequence.length === 0 && <div style={visStyles.info}>📦 Klik pada elemen untuk melihat detail.</div>}
    </div>
  );
};

const visStyles = {
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "15px",
    margin: "10px 0",
    border: "1px solid #dee2e6",
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#306998",
    textAlign: "center",
  },
  dictContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    padding: "10px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "500",
    position: "relative",
  },
  key: { fontWeight: "bold", fontSize: "14px" },
  arrow: { fontSize: "18px", margin: "0 15px" },
  value: { fontSize: "14px" },
  checkmark: {
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
  },
  info: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "13px",
    color: "#555",
    backgroundColor: "#e9ecef",
    padding: "8px",
    borderRadius: "8px",
  },
  detailPanel: {
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#e8f1ff",
    borderRadius: "8px",
    borderLeft: "4px solid #306998",
  },
  detailTitle: { fontWeight: "bold", marginBottom: "8px", color: "#306998" },
  detailItem: { fontSize: "13px", marginBottom: "4px", color: "#333" },
};

// ===================== KOMPONEN PERBANDINGAN SEBELUM DAN SESUDAH =====================
const DictionaryComparison = ({ beforeData, afterData, beforeTitle, afterTitle, addedKeys = [], removedKeys = [], accessSequenceAfter = [], showClickDetail = true }) => {
  // Tandai key yang ditambahkan di after
  const afterChangedKeys = addedKeys;
  // Tandai key yang dihapus di before (akan tampil merah)
  const beforeChangedKeys = removedKeys;

  return (
    <div>
      <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", flexWrap: "wrap", marginBottom: "15px" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <DictionaryVisualization 
            data={beforeData} 
            title={beforeTitle} 
            changedKeys={beforeChangedKeys}
            accessSequence={[]} 
            showClickDetail={showClickDetail} 
          />
        </div>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <DictionaryVisualization 
            data={afterData} 
            title={afterTitle} 
            changedKeys={afterChangedKeys}
            accessSequence={accessSequenceAfter} 
            showClickDetail={showClickDetail} 
          />
        </div>
      </div>
      {/* Keterangan perubahan yang lebih besar dan jelas */}
      {(removedKeys.length > 0 || addedKeys.length > 0) && (
        <div style={{
          marginTop: "15px",
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6"
        }}>
          {removedKeys.length > 0 && (
            <div style={{
              fontSize: "15px",
              fontWeight: "500",
              color: "#dc3545",
              marginBottom: addedKeys.length > 0 ? "8px" : "0",
              padding: "5px 10px",
              backgroundColor: "#fff5f5",
              borderRadius: "6px"
            }}>
              🔴 Elemen yang dihapus: <strong>{removedKeys.join(", ")}</strong>
            </div>
          )}
          {addedKeys.length > 0 && (
            <div style={{
              fontSize: "15px",
              fontWeight: "500",
              color: "#28a745",
              padding: "5px 10px",
              backgroundColor: "#f0fff0",
              borderRadius: "6px"
            }}>
              🟢 Elemen yang ditambahkan: <strong>{addedKeys.join(", ")}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===================== KOMPONEN EDITOR READ-ONLY DENGAN VISUALISASI PERBANDINGAN =====================
const CodeEditor = ({ code, codeKey, pyodideReady, runPythonCode, explanations, beforeData, afterData, beforeTitle, afterTitle, addedKeys = [], removedKeys = [], accessSequenceAfter = [] }) => {
  const [output, setOutput] = useState("");
  const [hasRun, setHasRun] = useState(false);
  const [showVisual, setShowVisual] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setShowVisual(false);
    setHasRun(false);
    const result = await runPythonCode(code);
    setOutput(result);
    setHasRun(true);
    setShowVisual(true);
  }, [pyodideReady, code, runPythonCode]);

  const codeLines = code.split('\n');
  const hasExplanations = explanations && explanations.length === codeLines.length;

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>Contoh Kode Program</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady}>
          {pyodideReady ? "Jalankan" : "Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>{code}</pre>
      </div>
      {showVisual && beforeData && afterData && (
        <DictionaryComparison
          beforeData={beforeData}
          afterData={afterData}
          beforeTitle={beforeTitle || "Sebelum"}
          afterTitle={afterTitle || "Sesudah"}
          addedKeys={addedKeys}
          removedKeys={removedKeys}
          accessSequenceAfter={accessSequenceAfter}
          showClickDetail={true}
        />
      )}
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik 'Jalankan' untuk melihat hasil)"}</pre>
      </div>
      {hasRun && hasExplanations && (
        <div style={styles.explanationsContainer}>
          <div style={styles.explanationsHeader}>
            <span style={styles.explanationsTitle}>Penjelasan Kode (per baris)</span>
          </div>
          <div style={styles.explanationsContent}>
            {codeLines.map((line, idx) => {
              if (line.trim() === "" && !explanations[idx]) return null;
              return (
                <div key={idx} style={styles.explanationItem}>
                  <span style={styles.lineNumber}>Baris {idx+1}:</span>
                  <code style={styles.lineCode}>{line}</code>
                  <span style={styles.lineExplanation}>→ {explanations[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ===================== KOMPONEN LATIHAN PRAKTIK (VALIDASI BERTAHAP) =====================
const CodeEditorEditable = ({ codeKey, title, pyodideReady, runPythonCode, expectedOutput, successMessage }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setMessage(null);
  }, []);

  const validateAndRun = useCallback(async () => {
    if (!pyodideReady) {
      setMessage({ type: 'error', text: "Pyodide sedang dimuat, harap tunggu..." });
      return;
    }
    setOutput("");
    setMessage(null);
    setIsRunning(true);

    const code = localCode;
    
    if (code.trim() === "") {
      setMessage({ type: 'error', text: "Silakan isi jawaban Anda terlebih dahulu." });
      setIsRunning(false);
      return;
    }
    
    const varRegex = /inventaris\s*=\s*\{\s*(?:"|')\s*Python\s+Dasar\s*(?:"|')\s*:\s*\d+\s*,\s*(?:"|')\s*Data\s+Science\s*(?:"|')\s*:\s*\d+\s*,\s*(?:"|')\s*Web\s+Programming\s*(?:"|')\s*:\s*\d+\s*\}/is;
    const hasCorrectDict = varRegex.test(code);
    const updateRegex = /inventaris\.update\s*\(\s*\{\s*(?:"|')\s*Machine\s+Learning\s*(?:"|')\s*:\s*\d+\s*\}\s*\)/;
    const hasUpdate = updateRegex.test(code);
    const popRegex = /inventaris\.pop\s*\(\s*(?:"|')\s*Data\s+Science\s*(?:"|')\s*\)/;
    const hasPop = popRegex.test(code);
    const printRegex = /print\s*\(\s*inventaris\s*\)/;
    const hasPrint = printRegex.test(code);
    
    if (!hasCorrectDict) {
      setMessage({ 
        type: 'error', 
        text: "Periksa kembali kode Anda. Pastikan Anda membuat dictionary 'inventaris' dengan stok awal: 'Python Dasar', 'Data Science', 'Web Programming'." 
      });
      setIsRunning(false);
      return;
    }
    
    if (!hasUpdate) {
      setMessage({ 
        type: 'success', 
        text: "Bagus! Dictionary 'inventaris' sudah benar. Sekarang, tambahkan buku 'Machine Learning' dengan stok 3 menggunakan update()." 
      });
      setIsRunning(false);
      return;
    }
    
    if (!hasPop) {
      setMessage({ 
        type: 'success', 
        text: "Bagus! Buku 'Machine Learning' sudah ditambahkan. Sekarang, hapus buku 'Data Science' dari inventaris menggunakan pop()." 
      });
      setIsRunning(false);
      return;
    }
    
    if (!hasPrint) {
      setMessage({ 
        type: 'success', 
        text: "Bagus! Penghapusan 'Data Science' sudah dilakukan. Terakhir, cetak isi inventaris menggunakan print(inventaris)." 
      });
      setIsRunning(false);
      return;
    }
    
    try {
      const result = await runPythonCode(code);
      setOutput(result);
      if (result.includes("Python Dasar") && result.includes("Web Programming") && result.includes("Machine Learning") && !result.includes("Data Science")) {
        setOutput(result + "\n\nSELAMAT! Semua instruksi sudah benar.");
        setMessage({ type: 'success', text: "Semua instruksi selesai! Kode berjalan dengan baik." });
      } else {
        setOutput(result + "\n\nOutput tidak sesuai. Pastikan inventaris akhir berisi 'Python Dasar', 'Web Programming', dan 'Machine Learning'.");
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
      <textarea
        style={{ ...styles.codeInputEditable, border: message?.type === 'error' && message.text.includes("Periksa") ? "2px solid #ff4444" : "none" }}
        value={localCode}
        onChange={handleChange}
        placeholder="Tulis kode Python untuk memanipulasi dictionary di sini..."
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

// ===================== KOMPONEN LATIHAN SOAL (LOCK PER SOAL) =====================
const LatihanSoal = ({ questions, resetTrigger }) => {
  const [answers, setAnswers] = useState(questions.map(() => null));
  const [feedback, setFeedback] = useState(questions.map(() => ""));
  const [locked, setLocked] = useState(questions.map(() => false));
  const [globalError, setGlobalError] = useState("");
  const [allCorrect, setAllCorrect] = useState(false);

  useEffect(() => {
    setAnswers(questions.map(() => null));
    setFeedback(questions.map(() => ""));
    setLocked(questions.map(() => false));
    setGlobalError("");
    setAllCorrect(false);
  }, [resetTrigger, questions]);

  const handleAnswerChange = (qIdx, optIdx) => {
    if (locked[qIdx]) return;
    const newAnswers = [...answers];
    newAnswers[qIdx] = optIdx;
    setAnswers(newAnswers);
    const newFeedback = [...feedback];
    newFeedback[qIdx] = "";
    setFeedback(newFeedback);
    setGlobalError("");
    if (allCorrect) setAllCorrect(false);
  };

  const handleCheckAll = () => {
    const allAnswered = answers.every(ans => ans !== null);
    if (!allAnswered) {
      setGlobalError("Anda harus menjawab semua soal terlebih dahulu!");
      return;
    }
    setGlobalError("");

    const newFeedback = answers.map((ans, idx) => {
      if (ans === questions[idx].correctIndex) {
        return "Benar";
      } else {
        return "Salah. Coba lagi!";
      }
    });
    setFeedback(newFeedback);

    const newLocked = answers.map((ans, idx) => ans === questions[idx].correctIndex);
    setLocked(newLocked);

    const semuaBenar = newLocked.every(v => v === true);
    setAllCorrect(semuaBenar);
  };

  return (
    <div>
      {questions.map((q, idx) => (
        <div key={idx} style={styles.latihanCard}>
          <p style={styles.latihanQuestionText}>{idx+1}. {q.text}</p>
          <div style={styles.latihanOptions}>
            {q.options.map((opt, optIdx) => (
              <div
                key={optIdx}
                onClick={() => handleAnswerChange(idx, optIdx)}
                style={{
                  ...styles.eksplorasiOption,
                  backgroundColor: answers[idx] === optIdx ? "#2fa69a" : "#f9f9f9",
                  color: answers[idx] === optIdx ? "white" : "#1f2937",
                  cursor: locked[idx] ? "not-allowed" : "pointer",
                  opacity: locked[idx] ? 0.7 : 1,
                }}
              >
                <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
              </div>
            ))}
          </div>
          {feedback[idx] && (
            <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", backgroundColor: feedback[idx] === "Benar" ? "#d1e7dd" : "#f8d7da" }}>
              {feedback[idx] === "Benar" ? "Benar" : "Salah"}
            </div>
          )}
        </div>
      ))}
      {globalError && (
        <div style={{ marginTop: "10px", marginBottom: "15px", padding: "12px", borderRadius: "8px", backgroundColor: "#f8d7da", color: "#842029" }}>
          {globalError}
        </div>
      )}
      <button style={styles.checkAllButton} onClick={handleCheckAll} disabled={allCorrect}>
        {allCorrect ? "Semua Jawaban Benar" : "Periksa Semua Jawaban"}
      </button>
      {allCorrect && (
        <div style={styles.successBoxFinal}>
          Selamat! Semua jawaban Anda benar.
        </div>
      )}
    </div>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function ManipulasiDictionary() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [resetInteractives, setResetInteractives] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // EKSPLORASI
  const [eksplorasiSelected, setEksplorasiSelected] = useState([null, null, null]);
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", "", ""]);
  const [eksplorasiHasAnswered, setEksplorasiHasAnswered] = useState([false, false, false]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const eksplorasiQuestions = [
    {
      text: "Metode dictionary yang digunakan untuk menambah atau memperbarui beberapa pasangan key-value sekaligus adalah ...",
      options: ["append()", "update()", "add()", "insert()", "merge()"],
      correct: 1,
    },
    {
      text: "Perhatikan dictionary: `stok = {'apel': 10, 'mangga': 5}`. Kode manakah yang akan menghapus key 'mangga' beserta nilainya?",
      options: ["stok.remove('mangga')", "del stok['mangga']", "stok.delete('mangga')", "stok.pop('mangga')", "stok.popitem('mangga')"],
      correct: 3,
    },
    {
      text: "Metode dictionary yang menghapus semua item sehingga menghasilkan dictionary kosong adalah ...",
      options: ["delete()", "removeAll()", "clear()", "empty()", "reset()"],
      correct: 2,
    },
  ];

  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    if (eksplorasiHasAnswered[questionIdx]) return;
    setEksplorasiSelected(prev => {
      const newSel = [...prev];
      newSel[questionIdx] = optionIdx;
      return newSel;
    });
    const isCorrect = optionIdx === eksplorasiQuestions[questionIdx].correct;
    setEksplorasiFeedback(prev => {
      const newFb = [...prev];
      newFb[questionIdx] = isCorrect ? "Benar" : "Salah";
      return newFb;
    });
    setEksplorasiHasAnswered(prev => {
      const newAns = [...prev];
      newAns[questionIdx] = true;
      return newAns;
    });
  };

  useEffect(() => {
    const allAnswered = eksplorasiHasAnswered.every(v => v === true);
    if (allAnswered && !isEksplorasiCompleted) {
      setIsEksplorasiCompleted(true);
    }
  }, [eksplorasiHasAnswered, isEksplorasiCompleted]);

  // Data untuk visualisasi perbandingan
  const dataUpdateBefore = { a: 1, b: 2 };
  const dataUpdateAfter = { a: 1, b: 2, c: 3, d: 4 };
  const dataPopBefore = { apel: 5000, mangga: 8000, jeruk: 6000 };
  const dataPopAfter = { apel: 5000, jeruk: 6000 };
  const dataPopitemBefore = { x: 100, y: 200, z: 300 };
  const dataPopitemAfter = { x: 100, y: 200 };
  const dataClearBefore = { nama: "Andi", usia: 25, kota: "Jakarta" };
  const dataClearAfter = {};

  // Access sequences untuk animasi pada kolom "Sesudah"
  const accessUpdate = ["c", "d"];
  const accessPop = ["mangga"];
  const accessPopitem = ["z"];
  const accessClear = [];

  // Kode contoh
  const exampleCodes = {
    update: `data = {"a": 1, "b": 2}
data.update({"c": 3, "d": 4})
print("Setelah update:", data)`,
    pop: `data = {"apel": 5000, "mangga": 8000, "jeruk": 6000}
nilai = data.pop("mangga")
print("Nilai yang dihapus:", nilai)
print("Dictionary setelah pop:", data)`,
    popitem: `data = {"x": 100, "y": 200, "z": 300}
item = data.popitem()
print("Item yang dihapus:", item)
print("Dictionary setelah popitem:", data)`,
    clear: `data = {"nama": "Andi", "usia": 25, "kota": "Jakarta"}
data.clear()
print("Setelah clear:", data)`,
  };

  const explanations = {
    update: [
      "Membuat dictionary 'data' dengan key 'a':1 dan 'b':2.",
      "Menggunakan metode update() untuk menambah beberapa key sekaligus. Menambah key 'c':3 dan 'd':4.",
      "Mencetak teks 'Setelah update:' diikuti isi dictionary 'data'."
    ],
    pop: [
      "Membuat dictionary 'data' berisi harga buah.",
      "Menghapus key 'mangga' menggunakan pop() dan menyimpan nilainya ke variabel 'nilai'.",
      "Mencetak teks dan nilai yang dihapus (8000).",
      "Mencetak dictionary setelah pop, key 'mangga' sudah tidak ada."
    ],
    popitem: [
      "Membuat dictionary 'data' dengan tiga pasangan key-value.",
      "Menghapus item terakhir (karena Python 3.7+ mempertahankan urutan) menggunakan popitem(), mengembalikan tuple (key, value).",
      "Mencetak item yang dihapus.",
      "Mencetak dictionary setelah popitem."
    ],
    clear: [
      "Membuat dictionary 'data' dengan tiga key.",
      "Menghapus semua item menggunakan metode clear().",
      "Mencetak dictionary kosong {}."
    ],
  };

  // Latihan soal
  const latihanQuestions = [
    {
      text: "Kode yang BENAR untuk menambahkan pasangan key-value baru 'kota': 'Bandung' ke dalam dictionary `data` yang sudah ada adalah ...",
      options: [
        "data.add('kota', 'Bandung')",
        "data['kota'] = 'Bandung'",
        "data.insert('kota', 'Bandung')",
        "data.append('kota', 'Bandung')",
        "data.put('kota', 'Bandung')"
      ],
      correctIndex: 1
    },
    {
      text: "Perhatikan dictionary: `nilai = {'Matematika': 85, 'Fisika': 90, 'Kimia': 78}`. Kode yang akan menghapus key 'Fisika' beserta nilainya adalah ...",
      options: [
        "nilai.remove('Fisika')",
        "del nilai['Fisika']",
        "nilai.delete('Fisika')",
        "nilai.popitem('Fisika')",
        "nilai.pop('Fisika')"
      ],
      correctIndex: 1
    },
    {
      text: "Kode yang tepat untuk menggabungkan dictionary `a = {'x':1}` dan `b = {'y':2}` menjadi satu dictionary `c` yang berisi {'x':1, 'y':2} adalah ...",
      options: [
        "c = a + b",
        "c = a.update(b)",
        "c = {**a, **b}",
        "c = a.concat(b)",
        "c = a.merge(b)"
      ],
      correctIndex: 2
    },
    {
      text: "Fungsi yang digunakan untuk menghapus semua item dalam dictionary adalah ...",
      options: [
        "delete()",
        "removeAll()",
        "clear()",
        "popall()",
        "reset()"
      ],
      correctIndex: 2
    },
    {
      text: "Perhatikan kode berikut:\n`data = {'a': 10, 'b': 20, 'c': 30}`\n`hasil = data.pop('b')`\nNilai dari variabel `hasil` setelah kode dijalankan adalah ...",
      options: ["10", "20", "30", "Error", "0"],
      correctIndex: 1
    }
  ];

  // Load Pyodide
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

  return (
    <>
      <Navbar />
      <SidebarMateri isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div 
        className="main-content"
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
            <h1 style={styles.headerTitle}>MANIPULASI DICTIONARY</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.listAngka}>
                <li>Mahasiswa mampu melakukan manipulasi dasar pada dictionary.</li>
                <li>Mahasiswa mampu menerapkan manipulasi dictionary dalam pemecahan masalah nyata (studi kasus).</li>
              </ol>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Eksplorasi</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
                <strong style={{ color: "#0d6efd" }}>
                  {" "}
                  Materi akan terbuka setelah ketiga pertanyaan dijawab.
                </strong>
              </p>
              {eksplorasiQuestions.map((q, idx) => {
                const isAnswered = eksplorasiHasAnswered[idx];
                const selectedIdx = eksplorasiSelected[idx];
                return (
                  <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
                    <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {q.options.map((opt, optIdx) => {
                        let optionStyle = { ...styles.eksplorasiOption, cursor: "pointer" };
                        if (isAnswered) {
                          optionStyle.cursor = "not-allowed";
                          optionStyle.opacity = 0.7;
                          if (selectedIdx === optIdx) {
                            const isCorrect = (selectedIdx === q.correct);
                            optionStyle.backgroundColor = isCorrect ? "#d4edda" : "#f8d7da";
                            optionStyle.borderColor = isCorrect ? "#28a745" : "#dc3545";
                            optionStyle.color = isCorrect ? "#155724" : "#842029";
                          } else {
                            optionStyle.backgroundColor = "#e9ecef";
                            optionStyle.color = "#6c757d";
                          }
                        } else {
                          optionStyle.backgroundColor = eksplorasiSelected[idx] === optIdx ? "#2fa69a" : "#f9f9f9";
                          optionStyle.color = eksplorasiSelected[idx] === optIdx ? "white" : "#1f2937";
                        }
                        return (
                          <div key={optIdx} onClick={() => !isAnswered && handleEksplorasiSelect(idx, optIdx)} style={optionStyle}>
                            <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </div>
                        );
                      })}
                    </div>
                    {eksplorasiFeedback[idx] && (
                      <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", backgroundColor: eksplorasiFeedback[idx] === "Benar" ? "#d1e7dd" : "#f8d7da", color: eksplorasiFeedback[idx] === "Benar" ? "#0f5132" : "#842029" }}>
                        {eksplorasiFeedback[idx] === "Benar" ? "Benar" : "Salah"}
                      </div>
                    )}
                  </div>
                );
              })}
              {!isEksplorasiCompleted && (
                <div style={styles.lockMessageInfo}>Materi terkunci. Jawab semua pertanyaan di atas untuk membuka materi.</div>
              )}
            </div>
          </section>

          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={styles.subTitle}>1. Menambah/Mengupdate dengan update()</h3>
                  <p style={styles.text}>Metode <code>update()</code> digunakan untuk menambah atau memperbarui beberapa pasangan key-value sekaligus.</p>
                  <CodeEditor 
                    code={exampleCodes.update} 
                    codeKey="update" 
                    pyodideReady={pyodideReady} 
                    runPythonCode={runPythonCode} 
                    explanations={explanations.update}
                    beforeData={dataUpdateBefore}
                    afterData={dataUpdateAfter}
                    beforeTitle="Sebelum update()"
                    afterTitle="Sesudah update()"
                    addedKeys={["c", "d"]}
                    removedKeys={[]}
                    accessSequenceAfter={accessUpdate}
                  />

                  <h3 style={styles.subTitle}>2. Menghapus dengan pop()</h3>
                  <p style={styles.text}><code>pop(key)</code> menghapus item dengan key tertentu dan mengembalikan nilainya.</p>
                  <CodeEditor 
                    code={exampleCodes.pop} 
                    codeKey="pop" 
                    pyodideReady={pyodideReady} 
                    runPythonCode={runPythonCode} 
                    explanations={explanations.pop}
                    beforeData={dataPopBefore}
                    afterData={dataPopAfter}
                    beforeTitle="Sebelum pop('mangga')"
                    afterTitle="Sesudah pop('mangga')"
                    addedKeys={[]}
                    removedKeys={["mangga"]}
                    accessSequenceAfter={accessPop}
                  />

                  <h3 style={styles.subTitle}>3. Menghapus Item Terakhir dengan popitem()</h3>
                  <p style={styles.text}><code>popitem()</code> menghapus item terakhir (berdasarkan urutan penyisipan) dan mengembalikan tuple (key, value).</p>
                  <CodeEditor 
                    code={exampleCodes.popitem} 
                    codeKey="popitem" 
                    pyodideReady={pyodideReady} 
                    runPythonCode={runPythonCode} 
                    explanations={explanations.popitem}
                    beforeData={dataPopitemBefore}
                    afterData={dataPopitemAfter}
                    beforeTitle="Sebelum popitem()"
                    afterTitle="Sesudah popitem()"
                    addedKeys={[]}
                    removedKeys={["z"]}
                    accessSequenceAfter={accessPopitem}
                  />

                  <h3 style={styles.subTitle}>4. Menghapus Semua Item dengan clear()</h3>
                  <p style={styles.text}><code>clear()</code> menghapus semua item dalam dictionary, menghasilkan dictionary kosong.</p>
                  <CodeEditor 
                    code={exampleCodes.clear} 
                    codeKey="clear" 
                    pyodideReady={pyodideReady} 
                    runPythonCode={runPythonCode} 
                    explanations={explanations.clear}
                    beforeData={dataClearBefore}
                    afterData={dataClearAfter}
                    beforeTitle="Sebelum clear()"
                    afterTitle="Sesudah clear()"
                    addedKeys={[]}
                    removedKeys={["nama", "usia", "kota"]}
                    accessSequenceAfter={accessClear}
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ayo Praktik</h2>
                <div style={styles.card}>
                  <div style={styles.alertBox}>
                    <strong>Cerita Kasus: Inventaris Toko Buku</strong>
                    <p style={{ marginTop: "8px" }}>
                      Sebuah toko buku memiliki dictionary <code>inventaris</code> yang menyimpan stok buku dengan format <code>{"{'judul buku': jumlah_stok}"}</code>. 
                      Saat ini inventaris berisi: <code>{"{'Python Dasar': 10, 'Data Science': 5, 'Web Programming': 7}"}</code>.
                    </p>
                    <p><strong>Petunjuk:</strong> Ikuti instruksi secara berurutan. Kode Anda akan diperiksa langkah demi langkah. Pastikan Anda mengikuti setiap instruksi.</p>
                    <ol style={{ marginLeft: "20px", lineHeight: "1.8", marginTop: "8px" }}>
                      <li>Buat dictionary <code>inventaris</code> dengan stok awal: 'Python Dasar':10, 'Data Science':5, 'Web Programming':7.</li>
                      <li>Tambah stok buku baru <code>"Machine Learning"</code> sebanyak 3 eksemplar menggunakan metode <code>update()</code>.</li>
                      <li>Buku <code>"Data Science"</code> habis terjual, hapus buku tersebut dari inventaris menggunakan <code>pop()</code>.</li>
                      <li>Tampilkan isi <code>inventaris</code> terakhir menggunakan <code>print()</code>.</li>
                    </ol>
                  </div>
                  <CodeEditorEditable
                    codeKey="latihan_inventaris"
                    title="Ayo Praktik: Manipulasi Inventaris Toko Buku"
                    pyodideReady={pyodideReady}
                    runPythonCode={runPythonCode}
                    expectedOutput="'Python Dasar': 10, 'Web Programming': 7, 'Machine Learning': 3"
                    successMessage="Selamat! Anda berhasil memanipulasi dictionary inventaris dengan benar."
                  />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <p style={styles.text}>Pilihlah jawaban yang tepat untuk setiap soal. Jawab semua soal, lalu klik "Periksa Semua Jawaban". Soal yang benar akan terkunci, soal yang salah dapat diperbaiki. Setelah semua jawaban benar, akan muncul pesan sukses.</p>
                  <LatihanSoal questions={latihanQuestions} resetTrigger={resetInteractives} />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ================== STYLE ================== */
const styles = {
  page: {
    padding: "30px 40px",
    paddingTop: "30px",
    backgroundColor: "#f5f7fa",
    minHeight: "calc(100vh - 64px)",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
    maxWidth: "100%",
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
    borderRadius: "6px 0 0 6px",
  },
  headerTitle: {
    margin: 0,
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
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
  listAngka: {
    paddingLeft: "20px",
    lineHeight: "1.8",
  },
  text: { lineHeight: "1.8", color: "#333" },
  subTitle: { marginTop: "20px", marginBottom: "10px", color: "#306998", fontSize: "1.2rem", fontWeight: "600" },
  alertBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "15px",
    color: "#856404",
  },
  codeEditorContainer: {
    border: "2px solid #306998",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "20px",
    backgroundColor: "#1e1e1e",
    marginTop: "15px"
  },
  codeEditorHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "12px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  codeEditorTitle: { fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" },
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
  codeInputReadOnly: {
    width: "100%",
    minHeight: "100px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflow: "auto"
  },
  codePre: { margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word", fontFamily: "monospace" },
  codeInputEditable: {
    width: "100%",
    minHeight: "250px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    tabSize: 4,
  },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    borderTop: "2px solid #1e1e1e"
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
    lineHeight: "1.5"
  },
  explanationsContainer: {
    borderTop: "1px solid #444",
    backgroundColor: "#2d2d2d",
    marginTop: "0",
  },
  explanationsHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
  },
  explanationsTitle: {
    fontWeight: "600",
    fontSize: "15px",
  },
  explanationsContent: {
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#ddd",
  },
  explanationItem: {
    marginBottom: "8px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: "8px",
  },
  lineNumber: {
    color: "#FFD43B",
    fontWeight: "bold",
    minWidth: "60px",
  },
  lineCode: {
    backgroundColor: "#3c3c3c",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#f8f8f2",
    fontFamily: "monospace",
  },
  lineExplanation: {
    color: "#ccc",
    flex: "1",
  },
  eksplorasiOption: {
    padding: "12px",
    borderRadius: "8px",
    transition: "all 0.2s",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  lockMessageInfo: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#cfe2ff",
    borderLeft: "5px solid #0d6efd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#084298",
  },
  latihanCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ddd"
  },
  latihanQuestionText: {
    fontWeight: "600",
    marginBottom: "12px",
    whiteSpace: "pre-line"
  },
  latihanOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  checkAllButton: {
    marginTop: "20px",
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    width: "100%",
  },
  successBoxFinal: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    textAlign: "center",
    fontWeight: "bold"
  },
};