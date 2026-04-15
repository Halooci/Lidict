import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN EDITOR DENGAN VALIDASI (UNTUK LATIHAN) =====================
const CodeEditorEditable = ({ codeKey, title, expectedAnswer, validationRules, pyodideReady, runPythonCode }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setError("");
  }, []);

  const validateCode = useCallback((code) => {
    const trimmedCode = code.trim();
    const dictRegex = /(\bdata\s*=\s*\{[^}]*\})/;
    if (!dictRegex.test(trimmedCode)) {
      return {
        valid: false,
        message: "❌ ERROR: Kamu harus membuat dictionary dengan nama 'data' menggunakan kurung kurawal {}."
      };
    }
    if (!/print\s*\(\s*data\s*\)/.test(trimmedCode)) {
      return {
        valid: false,
        message: "❌ ERROR: Kamu harus menampilkan dictionary menggunakan print(data)."
      };
    }
    const defIndex = trimmedCode.indexOf('data =');
    const printIndex = trimmedCode.indexOf('print(data)');
    if (defIndex === -1 || printIndex === -1) return { valid: false, message: "❌ ERROR: Struktur kode tidak lengkap." };
    if (printIndex < defIndex) return { valid: false, message: "❌ ERROR: Variabel 'data' harus didefinisikan SEBELUM digunakan dalam print." };
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
    if (result.includes("{") && result.includes("}")) {
      setOutput(result + "\n\n✅ SELAMAT! Dictionary kamu sudah benar!");
    } else {
      setOutput(result + "\n\n⚠️ Output tidak sesuai ekspektasi. Cek kembali kodemu!");
    }
  }, [pyodideReady, localCode, runPythonCode, validateCode]);

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
        placeholder="Tulis kode Python untuk membuat dictionary di sini..."
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
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

// ===================== KOMPONEN EDITOR READ-ONLY (CONTOH KODE) =====================
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
        <span style={styles.codeEditorTitle}>📘 Contoh Kode Program</span>
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

// ===================== KOMPONEN KUIS (5 SOAL) =====================
const QuizDictionary = () => {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Apa struktur data yang digunakan untuk menyimpan pasangan key-value di Python?",
      options: ["List", "Tuple", "Dictionary", "Set"],
      correct: 2,
    },
    {
      id: 2,
      text: "Manakah pernyataan yang benar tentang key pada dictionary?",
      options: [
        "Key boleh duplikat",
        "Key harus berupa tipe data yang mutable",
        "Key harus unik dan immutable",
        "Key hanya bisa berupa string",
      ],
      correct: 2,
    },
    {
      id: 3,
      text: "Apa output dari kode berikut?\n\n`data = {'a': 1, 'b': 2}`\n`print(data.get('c', 0))`",
      options: ["Error", "None", "0", "c"],
      correct: 2,
    },
    {
      id: 4,
      text: "Manakah yang TIDAK bisa dijadikan key dalam dictionary?",
      options: ["String", "Integer", "List", "Tuple"],
      correct: 2,
    },
    {
      id: 5,
      text: "Bagaimana cara menambah pasangan key-value baru ke dictionary `mahasiswa` dengan key 'umur' dan value 21?",
      options: [
        "mahasiswa.add('umur', 21)",
        "mahasiswa['umur'] = 21",
        "mahasiswa.insert('umur', 21)",
        "mahasiswa.update('umur': 21)",
      ],
      correct: 1,
    }
  ];

  const handleSelect = (qId, optionIndex) => {
    if (!submitted) {
      setSelected({ ...selected, [qId]: optionIndex });
    }
  };

  const checkAnswers = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selected[q.id] === q.correct) correct++;
    });
    return correct;
  };

  return (
    <div style={styles.quizContainer}>
      <h3 style={styles.quizTitle}>📝 Latihan Interaktif: Kuis Pilihan Ganda</h3>
      {questions.map(q => (
        <div key={q.id} style={styles.questionCard}>
          <p style={styles.questionText}>{q.id}. {q.text}</p>
          <div style={styles.options}>
            {q.options.map((opt, idx) => (
              <label key={idx} style={styles.optionLabel}>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={idx}
                  checked={selected[q.id] === idx}
                  onChange={() => handleSelect(q.id, idx)}
                  disabled={submitted}
                  style={styles.radio}
                />
                <span style={{ marginLeft: "8px" }}>{opt}</span>
              </label>
            ))}
          </div>
          {submitted && (
            <div style={styles.feedback}>
              {selected[q.id] === q.correct ? "✅ Benar" : `❌ Salah. Jawaban yang benar: ${q.options[q.correct]}`}
            </div>
          )}
        </div>
      ))}
      {!submitted && (
        <button style={styles.submitButton} onClick={checkAnswers}>Kumpulkan Jawaban</button>
      )}
      {submitted && (
        <div style={styles.resultBox}>
          <strong>Skor Anda: {calculateScore()} / {questions.length}</strong>
        </div>
      )}
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
export default function PendahuluanDictionary() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State untuk sidebar

  const exampleCodes = {
    basic: `# Membuat dictionary sederhana
mahasiswa = {
    "nama": "Budi Santoso",
    "nim": "12345678",
    "jurusan": "Informatika",
    "aktif": True,
    "nilai": [85, 90, 78]
}

# Mengakses nilai
print("Nama:", mahasiswa["nama"])
print("NIM:", mahasiswa.get("nim"))

# Menambah item baru
mahasiswa["angkatan"] = 2025

# Mengubah nilai
mahasiswa["nilai"].append(92)

# Menghapus item
del mahasiswa["aktif"]

# Iterasi dictionary
print("\\nData mahasiswa setelah perubahan:")
for key, value in mahasiswa.items():
    print(f"{key}: {value}")`,
  };

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
            <h1 style={styles.headerTitle}>📖 PENDAHULUAN DICTIONARY</h1>
          </div>

          {/* TUJUAN PEMBELAJARAN */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🎯 Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li>Memahami pengertian dan konsep dasar dictionary dalam Python.</li>
                <li>Mengetahui karakteristik utama dictionary (key unik, immutable key, mutable value).</li>
                <li>Membedakan dictionary dengan struktur data lain seperti list.</li>
                <li>Menguasai operasi dasar pada dictionary (membuat, mengakses, mengubah, menghapus).</li>
                <li>Mampu mengimplementasikan dictionary dalam kasus sederhana.</li>
              </ul>
            </div>
          </section>

          {/* EKSPLORASI AWAL */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🔍 Eksplorasi Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                <strong>Tahukah kamu?</strong> Dictionary di Python terinspirasi dari struktur data <strong>hash table</strong> yang memungkinkan pencarian data dalam waktu <strong>O(1)</strong> rata-rata, sangat cepat bahkan untuk data besar.
              </p>
              <p style={styles.text}>
                <strong>Contoh nyata penggunaan dictionary:</strong>
              </p>
              <ul style={styles.list}>
                <li>Menyimpan data mahasiswa berdasarkan NIM (key) → data diri (value).</li>
                <li>Menghitung frekuensi kata dalam sebuah teks.</li>
                <li>Konfigurasi aplikasi dalam format JSON (mirip dictionary).</li>
                <li>Mengimplementasikan cache atau memoization untuk optimasi fungsi.</li>
              </ul>
              <div style={styles.infoBox}>
                <strong>💡 Catatan:</strong> Mulai Python 3.7, dictionary mempertahankan urutan item sesuai urutan penyisipan. Sebelumnya, dictionary tidak terurut.
              </div>
            </div>
          </section>

          {/* PENGERTIAN DICTIONARY */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>📌 Apa Itu Dictionary?</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                <strong>Dictionary</strong> adalah struktur data dalam Python yang digunakan untuk menyimpan kumpulan data dalam bentuk <strong>pasangan key (kunci) dan value (nilai)</strong>. 
                Setiap key bersifat unik dan digunakan untuk mengakses nilai yang terkait. Dictionary bersifat <strong>mutable</strong> (dapat diubah) dan tidak memiliki indeks numerik seperti list, melainkan menggunakan key sebagai pengganti indeks.
              </p>
              <p style={styles.text}>
                Dictionary didefinisikan dengan kurung kurawal <code style={styles.inlineCode}>{`{}`}</code> dan setiap pasangan key-value dipisahkan oleh titik dua <code style={styles.inlineCode}>:</code>. 
                Key harus berupa tipe data yang immutable (string, integer, tuple), sedangkan value dapat berupa tipe data apa pun (list, dictionary lain, fungsi, dll).
              </p>
              <div style={styles.infoBox}>
                <strong>📖 Analogi:</strong> Seperti kamus bahasa, kita mencari arti (value) berdasarkan kata (key).
              </div>
            </div>
          </section>

          {/* KARAKTERISTIK DASAR */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>⚙️ Karakteristik Dasar Dictionary</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li><strong>Key unik</strong> → Tidak boleh ada dua key yang sama; jika key yang sama digunakan lagi, nilai sebelumnya akan ditimpa.</li>
                <li><strong>Key harus immutable</strong> → String, integer, float, tuple (dengan elemen immutable). List <strong>tidak bisa</strong> dijadikan key.</li>
                <li><strong>Value dapat berupa apa saja</strong> → Angka, string, boolean, list, dictionary, bahkan fungsi.</li>
                <li><strong>Urutan terjaga (Python 3.7+)</strong> → Item disimpan sesuai urutan penyisipan.</li>
                <li><strong>Mutable & Dinamis</strong> → Bisa menambah, mengubah, menghapus item; ukuran otomatis menyesuaikan.</li>
              </ul>
            </div>
          </section>

          {/* PERBEDAAN DENGAN LIST */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>📊 Perbandingan Dictionary vs List</h2>
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableCell}>Aspek</th>
                    <th style={styles.tableCell}>List</th>
                    <th style={styles.tableCell}>Dictionary</th>
                   </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.tableCell}>Pengaksesan</td>
                    <td style={styles.tableCell}>Menggunakan indeks angka (0,1,2,…)</td>
                    <td style={styles.tableCell}>Menggunakan key (string, integer, dll)</td>
                   </tr>
                  <tr>
                    <td style={styles.tableCell}>Urutan</td>
                    <td style={styles.tableCell}>Terurut dan bisa di-slice</td>
                    <td style={styles.tableCell}>Terurut sejak Python 3.7 (insertion order)</td>
                   </tr>
                  <tr>
                    <td style={styles.tableCell}>Kecepatan pencarian</td>
                    <td style={styles.tableCell}>O(n) – perlu scan linear</td>
                    <td style={styles.tableCell}>O(1) rata-rata – langsung ke key via hash</td>
                   </tr>
                  <tr>
                    <td style={styles.tableCell}>Batasan key</td>
                    <td style={styles.tableCell}>Tidak ada konsep key</td>
                    <td style={styles.tableCell}>Key harus immutable dan unik</td>
                   </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* OPERASI DASAR */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🛠️ Operasi Dasar Dictionary</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li><strong>Membuat dictionary kosong</strong> → <code style={styles.inlineCode}>data = {`{}`}</code> atau <code style={styles.inlineCode}>data = dict()</code></li>
                <li><strong>Menambah / mengubah item</strong> → <code style={styles.inlineCode}>data["key"] = "value"</code></li>
                <li><strong>Mengakses nilai</strong> → <code style={styles.inlineCode}>data["key"]</code> (error jika key tidak ada) atau <code style={styles.inlineCode}>.get("key", default)</code> (aman)</li>
                <li><strong>Menghapus item</strong> → <code style={styles.inlineCode}>del data["key"]</code> atau <code style={styles.inlineCode}>data.pop("key")</code></li>
                <li><strong>Mengecek keberadaan key</strong> → <code style={styles.inlineCode}>if "key" in data:</code></li>
                <li><strong>Mendapatkan semua key, value, atau pasangan</strong> → <code style={styles.inlineCode}>.keys()</code>, <code style={styles.inlineCode}>.values()</code>, <code style={styles.inlineCode}>.items()</code></li>
                <li><strong>Panjang dictionary</strong> → <code style={styles.inlineCode}>len(data)</code></li>
              </ul>
            </div>
          </section>

          {/* CONTOH KODE PROGRAM (BISA DIJALANKAN) */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>💻 Contoh Implementasi Dictionary</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Berikut adalah contoh penggunaan dictionary untuk menyimpan data mahasiswa. Kode ini bisa langsung dijalankan dan diedit.
              </p>
              <CodeEditor
                code={exampleCodes.basic}
                codeKey="dict_example"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
              />
              <p style={styles.text}>
                <strong>Penjelasan:</strong> Dictionary <code>mahasiswa</code> memiliki key berupa string dan value yang bervariasi. 
                Kita dapat mengakses nilai dengan key, menambah key baru, mengubah nilai (termasuk list di dalamnya), menghapus key, dan melakukan iterasi.
              </p>
            </div>
          </section>

          {/* LATIHAN PRAKTIK (EDITOR INTERAKTIF) */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>✏️ Latihan Praktik</h2>
            <div style={styles.card}>
              <div style={styles.alertBox}>
                <strong>⚠️ Instruksi Latihan:</strong>
                <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                  <li>Buatlah sebuah dictionary dengan nama variabel <code>data</code>.</li>
                  <li>Dictionary harus berisi tiga pasangan key-value: <br/>
                    - key <code>"nama"</code> dengan value <code>"Andi"</code><br/>
                    - key <code>"usia"</code> dengan value <code>20</code><br/>
                    - key <code>"hobi"</code> dengan value <code>["membaca", "coding"]</code>
                  </li>
                  <li>Setelah membuat dictionary, tampilkan seluruh isinya menggunakan <code>print(data)</code>.</li>
                </ul>
              </div>
              <CodeEditorEditable
                codeKey="latihan_dict"
                title="Latihan: Membuat Dictionary Sederhana"
                validationRules={{}}
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
              />
            </div>
          </section>

          {/* KUIS PILIHAN GANDA */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>📝 Latihan Interaktif</h2>
            <div style={styles.card}>
              <QuizDictionary />
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
  inlineCode: {
    backgroundColor: "#f0f0f0",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
  },
  infoBox: {
    backgroundColor: "#e7f3ff",
    borderLeft: "5px solid #306998",
    padding: "12px 15px",
    margin: "15px 0",
    borderRadius: "6px",
  },
  alertBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "15px",
    color: "#856404",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    lineHeight: "1.8",
  },
  tableHeader: {
    backgroundColor: "#306998",
    color: "white",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  // Code editor styles
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
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    lineHeight: "1.6",
    overflow: "auto"
  },
  codePre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace"
  },
  codeInputEditable: {
    width: "100%",
    minHeight: "250px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    lineHeight: "1.6",
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
  outputTitle: {
    fontWeight: "600",
    fontSize: "15px"
  },
  codeOutput: {
    backgroundColor: "#1e1e1e",
    padding: "15px",
    minHeight: "80px"
  },
  outputContent: {
    color: "#4af",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5"
  },
  // Quiz styles
  quizContainer: {
    marginTop: "20px"
  },
  quizTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "15px"
  },
  questionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd"
  },
  questionText: {
    fontWeight: "500",
    marginBottom: "10px",
    whiteSpace: "pre-line"
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "10px"
  },
  optionLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },
  radio: {
    marginRight: "5px"
  },
  feedback: {
    marginTop: "8px",
    fontSize: "14px",
    fontStyle: "italic"
  },
  submitButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px"
  },
  resultBox: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#e7f3ff",
    borderRadius: "6px",
    textAlign: "center"
  }
};