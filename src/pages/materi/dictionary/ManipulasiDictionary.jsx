import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN EDITOR READ-ONLY =====================
const CodeEditor = ({ code, codeKey, pyodideReady, runPythonCode, explanations }) => {
  const [output, setOutput] = useState("");
  const [hasRun, setHasRun] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    const result = await runPythonCode(code);
    setOutput(result);
    setHasRun(true);
  }, [pyodideReady, code, runPythonCode]);

  const codeLines = code.split('\n');
  const hasExplanations = explanations && explanations.length === codeLines.length;

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

// ===================== KOMPONEN LATIHAN PRAKTIK (VALIDASI TOLERAN) =====================
const CodeEditorEditable = ({ codeKey, title, pyodideReady, runPythonCode, expectedOutput, successMessage }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setError("");
  }, []);

  const validateCode = useCallback((code) => {
    const trimmedCode = code.trim();
    if (!/\binventaris\s*=\s*\{[^}]*\}/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Buatlah dictionary dengan nama 'inventaris'." };
    }
    if (!/inventaris\.update\s*\(/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Gunakan metode update() untuk menambah stok barang baru." };
    }
    if (!/inventaris\.pop\s*\(/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Gunakan metode pop() untuk menghapus barang yang habis." };
    }
    if (!/print\s*\(\s*inventaris\s*\)/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Tampilkan isi inventaris dengan print(inventaris) di akhir." };
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
    if (expectedOutput && result.includes(expectedOutput)) {
      setOutput(result + `\n\n✅ ${successMessage || "SELAMAT! Kode kamu benar!"}`);
    } else if (expectedOutput) {
      setOutput(result + "\n\n⚠️ Output tidak sesuai. Cek kembali operasi manipulasi dictionary Anda.");
    }
  }, [pyodideReady, localCode, runPythonCode, validateCode, expectedOutput, successMessage]);

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

// ===================== KOMPONEN LATIHAN (DENGAN LOCK PER SOAL) =====================
const LatihanSoal = ({ questions, resetTrigger }) => {
  const [answers, setAnswers] = useState(questions.map(() => null));
  const [feedback, setFeedback] = useState(questions.map(() => ""));
  const [locked, setLocked] = useState(questions.map(() => false));
  const [globalError, setGlobalError] = useState("");
  const [allCorrect, setAllCorrect] = useState(false);

  // Reset semua state ketika resetTrigger berubah (dari tombol reset di parent, tapi kita tidak menyediakan tombol reset di UI, namun tetap support jika ada)
  useEffect(() => {
    setAnswers(questions.map(() => null));
    setFeedback(questions.map(() => ""));
    setLocked(questions.map(() => false));
    setGlobalError("");
    setAllCorrect(false);
  }, [resetTrigger, questions]);

  const handleAnswerChange = (qIdx, optIdx) => {
    // Jika soal sudah terkunci (jawaban sudah benar), tidak boleh diubah
    if (locked[qIdx]) return;

    const newAnswers = [...answers];
    newAnswers[qIdx] = optIdx;
    setAnswers(newAnswers);
    // Hapus feedback untuk soal ini karena jawaban berubah
    const newFeedback = [...feedback];
    newFeedback[qIdx] = "";
    setFeedback(newFeedback);
    setGlobalError("");
    // Jika sebelumnya semua benar, sekarang tidak lagi
    if (allCorrect) setAllCorrect(false);
  };

  const handleCheckAll = () => {
    // Cek apakah semua soal sudah dijawab
    const allAnswered = answers.every(ans => ans !== null);
    if (!allAnswered) {
      setGlobalError("❌ Anda harus menjawab semua soal terlebih dahulu!");
      return;
    }
    setGlobalError("");

    // Evaluasi semua jawaban
    const newFeedback = answers.map((ans, idx) => {
      if (ans === questions[idx].correctIndex) {
        return "✅ Benar";
      } else {
        return "❌ Salah. Coba lagi!";
      }
    });
    setFeedback(newFeedback);

    // Tentukan soal mana yang benar, lalu kunci
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
            <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", backgroundColor: feedback[idx].includes("Benar") ? "#d1e7dd" : "#f8d7da" }}>
              {feedback[idx]}
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
        {allCorrect ? "✅ Semua Jawaban Benar" : "Periksa Semua Jawaban"}
      </button>
      {allCorrect && (
        <div style={styles.successBox}>
          🎉 Selamat! Semua jawaban Anda benar.
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
    copy: `asli = {"a": 1, "b": 2, "c": 3}
salinan = asli.copy()
salinan["a"] = 99
print("Dictionary asli:", asli)
print("Dictionary salinan:", salinan)`,
    dictComp: `kuadrat = {x: x**2 for x in range(1, 6)}
print("Dictionary kuadrat:", kuadrat)`,
  };

  const explanations = {
    update: [
      "Membuat dictionary 'data' dengan key 'a':1 dan 'b':2.",
      "Menggunakan metode update() untuk menambah atau mengupdate beberapa key sekaligus. Menambah key 'c':3 dan 'd':4.",
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
    copy: [
      "Membuat dictionary 'asli' dengan tiga key.",
      "Membuat salinan (shallow copy) menggunakan metode copy().",
      "Mengubah nilai key 'a' pada dictionary salinan menjadi 99.",
      "Mencetak dictionary asli (tidak berubah).",
      "Mencetak dictionary salinan (key 'a' berubah jadi 99)."
    ],
    dictComp: [
      "Dictionary comprehension: membuat dictionary dengan key dari 1 sampai 5 dan nilai berupa kuadrat key.",
      "Mencetak dictionary yang dihasilkan."
    ]
  };

  // Data latihan (5 soal)
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

  // Fungsi reset untuk latihan (tetap ada karena dipanggil dari tombol reset yang tidak ada? kita bisa hapus tombol reset, tapi state resetTrigger masih bisa digunakan jika diperlukan)
  // Karena tidak ada tombol reset, kita tidak perlu memanggil resetLatihan. Namun kita tetap menyediakan resetTrigger untuk kemungkinan lain.
  // Tapi di UI kita tidak menampilkan tombol reset. Jadi kita bisa hapus tombol reset dari render.
  // Namun agar kode tidak error, kita tetap definisikan fungsi tapi tidak digunakan.
  // Atau kita hapus saja tombol reset dari bagian Latihan di render.

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

          {/* TUJUAN PEMBELAJARAN */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.listAngka}>
                <li>Mahasiswa mampu melakukan manipulasi dasar pada dictionary.</li>
                <li>Mahasiswa mampu menerapkan manipulasi dictionary dalam pemecahan masalah nyata (studi kasus).</li>
              </ol>
            </div>
          </section>

          {/* EKSPLORASI AWAL */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🔍 Eksplorasi</h2>
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
                        {eksplorasiFeedback[idx] === "Benar" ? "✅ Benar" : "❌ Salah"}
                      </div>
                    )}
                  </div>
                );
              })}
              {!isEksplorasiCompleted && (
                <div style={styles.lockMessageInfo}>🔒 Materi terkunci. Jawab semua pertanyaan di atas untuk membuka materi.</div>
              )}
            </div>
          </section>

          {/* MATERI UTAMA */}
          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <div style={styles.card}>
                  <h3 style={styles.subTitle}>1. Menambah/Mengupdate dengan update()</h3>
                  <p style={styles.text}>Metode <code>update()</code> digunakan untuk menambah atau memperbarui beberapa pasangan key-value sekaligus.</p>
                  <CodeEditor code={exampleCodes.update} codeKey="update" pyodideReady={pyodideReady} runPythonCode={runPythonCode} explanations={explanations.update} />

                  <h3 style={styles.subTitle}>2. Menghapus dengan pop()</h3>
                  <p style={styles.text}><code>pop(key)</code> menghapus item dengan key tertentu dan mengembalikan nilainya.</p>
                  <CodeEditor code={exampleCodes.pop} codeKey="pop" pyodideReady={pyodideReady} runPythonCode={runPythonCode} explanations={explanations.pop} />

                  <h3 style={styles.subTitle}>3. Menghapus Item Terakhir dengan popitem()</h3>
                  <p style={styles.text}><code>popitem()</code> menghapus item terakhir (berdasarkan urutan penyisipan) dan mengembalikan tuple (key, value).</p>
                  <CodeEditor code={exampleCodes.popitem} codeKey="popitem" pyodideReady={pyodideReady} runPythonCode={runPythonCode} explanations={explanations.popitem} />

                  <h3 style={styles.subTitle}>4. Menghapus Semua Item dengan clear()</h3>
                  <p style={styles.text}><code>clear()</code> menghapus semua item dalam dictionary, menghasilkan dictionary kosong.</p>
                  <CodeEditor code={exampleCodes.clear} codeKey="clear" pyodideReady={pyodideReady} runPythonCode={runPythonCode} explanations={explanations.clear} />

                  <h3 style={styles.subTitle}>5. Menyalin Dictionary dengan copy()</h3>
                  <p style={styles.text}><code>copy()</code> membuat salinan dangkal (shallow copy) dari dictionary.</p>
                  <CodeEditor code={exampleCodes.copy} codeKey="copy" pyodideReady={pyodideReady} runPythonCode={runPythonCode} explanations={explanations.copy} />

                  <h3 style={styles.subTitle}>6. Dictionary Comprehension</h3>
                  <p style={styles.text}>Dictionary comprehension adalah cara ringkas membuat dictionary dengan ekspresi dan perulangan.</p>
                  <CodeEditor code={exampleCodes.dictComp} codeKey="dictComp" pyodideReady={pyodideReady} runPythonCode={runPythonCode} explanations={explanations.dictComp} />
                </div>
              </section>

              {/* AYO PRAKTIK */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ayo Praktik</h2>
                <div style={styles.card}>
                  <div style={styles.alertBox}>
                    <strong>📖 Cerita Kasus: Inventaris Toko Buku</strong>
                    <p style={{ marginTop: "8px" }}>
                      Sebuah toko buku memiliki dictionary <code>inventaris</code> yang menyimpan stok buku dengan format <code>{"{'judul buku': jumlah_stok}"}</code>. 
                      Saat ini inventaris berisi: <code>{"{'Python Dasar': 10, 'Data Science': 5, 'Web Programming': 7}"}</code>.
                    </p>
                    <p>Lakukan operasi berikut secara berurutan:</p>
                    <ol style={{ marginLeft: "20px", lineHeight: "1.8" }}>
                      <li>Buat dictionary <code>inventaris</code> sesuai data awal.</li>
                      <li>Tambah stok buku baru <code>"Machine Learning"</code> sebanyak 3 eksemplar menggunakan <code>update()</code>.</li>
                      <li>Buku <code>"Data Science"</code> habis terjual, hapus buku tersebut dari inventaris menggunakan <code>pop()</code>.</li>
                      <li>Tampilkan isi <code>inventaris</code> terakhir.</li>
                    </ol>
                    <p style={{ marginTop: "8px" }}>
                      <strong>Petunjuk:</strong> Gunakan metode <code>update()</code> untuk menambah, <code>pop()</code> untuk menghapus, dan <code>print(inventaris)</code> di akhir.
                    </p>
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

              {/* LATIHAN (tanpa tombol reset) */}
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
  successBox: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    textAlign: "center",
    fontWeight: "bold"
  },
  resetQuizButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px",
    marginRight: "10px"
  },
};