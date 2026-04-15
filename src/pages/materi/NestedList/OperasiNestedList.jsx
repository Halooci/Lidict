import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN EDITOR READ-ONLY =====================
const CodeEditor = ({ code, codeKey, pyodideReady, runPythonCode }) => {
  const [output, setOutput] = useState("");

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    const result = await runPythonCode(code);
    setOutput(result);
  }, [pyodideReady, code, runPythonCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>Contoh Kode Program</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady}>
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>{code}</pre>
      </div>
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>{output || "(Klik 'Jalankan' untuk melihat hasil)"}</pre>
      </div>
    </div>
  );
};

// ===================== KOMPONEN LATIHAN PRAKTIK (CODING) =====================
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

// ===================== KOMPONEN SOAL MELENGKAPI KODE (INPUT LANGSUNG) =====================
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
      <pre style={styles.codeTemplateInline}>
        {renderCodeWithInputs()}
      </pre>
      <button style={styles.checkButton} onClick={handleCheck}>
        Periksa
      </button>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

// ===================== KOMPONEN DRAG DROP COMPLETION (DIPERBAIKI - INDEPENDEN PER SLOT) =====================
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
      <pre style={styles.codeTemplateInline}>
        {renderCodeWithDropZones()}
      </pre>
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
      <button style={styles.checkButton} onClick={handleCheck}>
        Periksa
      </button>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function OperasiNestedList() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [resetInteractives, setResetInteractives] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State untuk sidebar

  // Contoh kode read-only (tetap sama)
  const exampleCodes = {
    mengakses: `# Mengakses elemen nested list
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
print("Elemen baris 1 kolom 2:", data[0][1])
print("Elemen baris 3 kolom 3:", data[2][2])`,
    
    mengubah: `# Mengubah nilai elemen nested list
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
print("Sebelum diubah:", data)
data[0][0] = 99
data[1][2] = 88
data[2][1] = 77
print("Setelah diubah:", data)`,
    
    menambahBaris: `# Menambahkan baris baru (append)
data = [[1, 2, 3],
        [4, 5, 6]]
baris_baru = [7, 8, 9]
data.append(baris_baru)
print("Setelah append:", data)`,
    
    menyisipBaris: `# Menyisipkan baris di posisi tertentu (insert)
data = [[1, 2, 3],
        [4, 5, 6]]
data.insert(1, [10, 11, 12])  # sisipkan di indeks 1
print("Setelah insert:", data)`,
    
    menghapusBaris: `# Menghapus baris (pop, del, remove)
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
# Hapus baris terakhir
data.pop()
print("Setelah pop():", data)
# Hapus baris pertama
del data[0]
print("Setelah del data[0]:", data)`,
    
    menambahKolom: `# Menambahkan elemen ke setiap baris (menambah kolom)
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
for baris in data:
    baris.append(0)  # tambah kolom baru dengan nilai 0
print("Setiap baris ditambah kolom:", data)`,
    
    menghapusKolom: `# Menghapus elemen tertentu dari setiap baris (hapus kolom)
data = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
for baris in data:
    baris.pop(1)  # hapus kolom ke-2 (indeks 1)
print("Setelah hapus kolom ke-2:", data)`,
    
    mencari: `# Mencari nilai dalam nested list
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
    print(f"Nilai {cari} tidak ditemukan")`,
    
    mengaksesRagged: `# Nested list dengan panjang baris berbeda (ragged)
data = [[1, 2],
        [3, 4, 5, 6],
        [7]]
print(data[1][2])  # output: 5
print(data[2][0])  # output: 7`,
    
    iterasi: `# Iterasi seluruh elemen
data = [[1, 2, 3],
        [4, 5, 6]]
for i in range(len(data)):
    for j in range(len(data[i])):
        print(f"data[{i}][{j}] = {data[i][j]}")`,
    
    listComprehension: `# Membuat nested list dengan list comprehension
baris = 3
kolom = 4
matriks = [[0 for j in range(kolom)] for i in range(baris)]
print("Matriks 3x4 dengan nilai 0:")
print(matriks)`,
    
    menggabungkan: `# Menggabungkan dua nested list
a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]
hasil = a + b
print("Hasil penggabungan:", hasil)`,
  };

  // Soal 1-2: input langsung
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

  // Soal 3: Drag drop - menambah kolom
  const soal3Template = `data = [[1, 2, 3], [4, 5, 6]]
for baris in ___:
    baris.___(0)
print(data)`;
  const soal3Placeholders = ["data", "append"];
  const soal3Options = ["data", "range(len(data))", "append", "insert", "extend", "baris"];
  const soal3Expected = ["data", "append"];

  // Soal 4: Drag drop - menghapus baris pertama
  const soal4Template = `data = [[1, 2], [3, 4], [5, 6]]
___ data[0]
print(data)`;
  const soal4Placeholders = ["del"];
  const soal4Options = ["del", "pop", "remove", "delete", "data.pop(0)", "data.remove([1,2])"];
  const soal4Expected = ["del"];

  // Soal 5: Drag drop - mengubah elemen baris kedua kolom pertama menjadi 99
  const soal5Template = `data = [[10, 20], [30, 40]]
data[___][___] = 99
print(data[1][0])`;
  const soal5Placeholders = ["baris", "kolom"];
  const soal5Options = ["0", "1", "2", "3", "baris", "kolom"];
  const soal5Expected = ["1", "0"];

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

  const resetInteractiveQuestions = () => {
    setResetInteractives(prev => prev + 1);
  };

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
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>OPERASI  DAN MANIPULASI NESTED LIST</h1>
          </div>

          {/* TUJUAN PEMBELAJARAN */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>Mahasiswa mampu mengakses elemen dalam nested list menggunakan indeks.</li>
                <li>Mahasiswa mampu mengubah nilai elemen dalam nested list.</li>
                <li>Mahasiswa mampu menambah, menyisipkan, dan menghapus baris pada nested list.</li>
                <li>Mahasiswa mampu menambah dan menghapus kolom (elemen) pada setiap baris.</li>
                <li>Mahasiswa mampu mencari nilai dalam nested list.</li>
                <li>Mahasiswa mampu melakukan iterasi pada nested list.</li>
                <li>Mahasiswa mampu menggabungkan dua nested list.</li>
              </ol>
            </div>
          </section>

          {/* MATERI (lengkap) */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>1. Mengakses Elemen Nested List</h3>
              <p style={styles.text}>Gunakan dua indeks: <code>nama_list[indeks_baris][indeks_kolom]</code>. Indeks dimulai dari 0.</p>
              <CodeEditor code={exampleCodes.mengakses} codeKey="mengakses" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>2. Mengubah Nilai Elemen</h3>
              <p style={styles.text}>Kita dapat mengubah nilai elemen tertentu dengan mengaksesnya lalu menetapkan nilai baru.</p>
              <CodeEditor code={exampleCodes.mengubah} codeKey="mengubah" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>3. Menambah Baris Baru (append)</h3>
              <p style={styles.text}>Gunakan method <code>append()</code> untuk menambahkan baris (list) baru di akhir nested list.</p>
              <CodeEditor code={exampleCodes.menambahBaris} codeKey="menambahBaris" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>4. Menyisipkan Baris (insert)</h3>
              <p style={styles.text}>Gunakan method <code>insert(posisi, baris_baru)</code> untuk menyisipkan baris di posisi tertentu.</p>
              <CodeEditor code={exampleCodes.menyisipBaris} codeKey="menyisipBaris" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>5. Menghapus Baris</h3>
              <p style={styles.text}>Gunakan <code>pop()</code> untuk menghapus baris terakhir, atau <code>del</code> untuk menghapus baris berdasarkan indeks.</p>
              <CodeEditor code={exampleCodes.menghapusBaris} codeKey="menghapusBaris" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>6. Menambah Kolom (Elemen pada Setiap Baris)</h3>
              <p style={styles.text}>Iterasi setiap baris dan gunakan <code>append()</code> pada baris tersebut untuk menambah kolom.</p>
              <CodeEditor code={exampleCodes.menambahKolom} codeKey="menambahKolom" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>7. Menghapus Kolom</h3>
              <p style={styles.text}>Iterasi setiap baris dan gunakan <code>pop(indeks_kolom)</code> atau <code>del</code> untuk menghapus kolom tertentu.</p>
              <CodeEditor code={exampleCodes.menghapusKolom} codeKey="menghapusKolom" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>8. Mencari Nilai dalam Nested List</h3>
              <p style={styles.text}>Gunakan perulangan bersarang untuk memeriksa setiap elemen.</p>
              <CodeEditor code={exampleCodes.mencari} codeKey="mencari" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>9. Nested List dengan Panjang Baris Berbeda (Ragged Array)</h3>
              <p style={styles.text}>Setiap baris dapat memiliki jumlah kolom yang berbeda.</p>
              <CodeEditor code={exampleCodes.mengaksesRagged} codeKey="mengaksesRagged" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>10. Iterasi Seluruh Elemen</h3>
              <p style={styles.text}>Gunakan perulangan bersarang untuk mengakses semua elemen.</p>
              <CodeEditor code={exampleCodes.iterasi} codeKey="iterasi" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>11. Membuat Nested List dengan List Comprehension</h3>
              <p style={styles.text}>Cara ringkas membuat matriks berukuran tertentu.</p>
              <CodeEditor code={exampleCodes.listComprehension} codeKey="listComprehension" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
              <h3 style={styles.subTitle}>12. Menggabungkan Dua Nested List</h3>
              <p style={styles.text}>Operator <code>+</code> dapat digunakan untuk menggabungkan dua nested list.</p>
              <CodeEditor code={exampleCodes.menggabungkan} codeKey="menggabungkan" pyodideReady={pyodideReady} runPythonCode={runPythonCode} />
            </div>
          </section>

          {/* LATIHAN PRAKTIK (CODING) */}
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

          {/* LATIHAN INTERAKTIF - 5 SOAL */}
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
  list: { paddingLeft: "20px", lineHeight: "1.8" },
  text: { lineHeight: "1.8", color: "#333" },
  subTitle: { marginTop: "20px", marginBottom: "10px", color: "#306998" },
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
  // Styles untuk soal interaktif
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ddd"
  },
  questionText: { fontWeight: "500", marginBottom: "10px" },
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
    marginBottom: "10px"
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
    outline: "none"
  },
  checkButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "10px"
  },
  resetButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px"
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
    transition: "transform 0.1s",
    ":active": { cursor: "grabbing" }
  },
};