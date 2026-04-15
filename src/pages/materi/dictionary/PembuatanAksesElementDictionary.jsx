import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN EDITOR READ-ONLY DENGAN PENJELASAN (MUNCUL SETELAH DIJALANKAN) =====================
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
      {hasRun && hasExplanations && (
        <div style={styles.explanationsContainer}>
          <div style={styles.explanationsHeader}>
            <span style={styles.explanationsTitle}>📖 Penjelasan Kode (per baris)</span>
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

// ===================== KOMPONEN LATIHAN PRAKTIK (EDITOR DENGAN VALIDASI) =====================
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
    if (!/\bdata_mahasiswa\s*=\s*\{[^}]*\}/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Buatlah dictionary dengan nama 'data_mahasiswa'." };
    }
    if (!/print\s*\(\s*data_mahasiswa\s*\[\s*["']nama["']\s*\]\s*\)/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Tampilkan nilai dari key 'nama' dengan print(data_mahasiswa['nama'])." };
    }
    if (!/print\s*\(\s*data_mahasiswa\s*\[\s*["']usia["']\s*\]\s*\)/.test(trimmedCode)) {
      return { valid: false, message: "❌ ERROR: Tampilkan nilai dari key 'usia' dengan print(data_mahasiswa['usia'])." };
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
    if (expectedOutput && lines[0] === expectedOutput[0] && lines[1] === expectedOutput[1]) {
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

// ===================== KOMPONEN SOAL MELENGKAPI KODE (DENGAN INPUT INLINE) =====================
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
      setFeedback("✅ Benar!");
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
            disabled={checked}
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
      <button style={styles.checkButton} onClick={handleCheck} disabled={checked}>
        Periksa
      </button>
      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function PembuatanAksesElementDictionary() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [resetInteractives, setResetInteractives] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State untuk sidebar

  // Kode contoh (tanpa komentar)
  const exampleCodes = {
    membuatDict: `mahasiswa = {
    "nama": "Budi Santoso",
    "nim": "12345678",
    "jurusan": "Informatika"
}
print("Dictionary mahasiswa:")
print(mahasiswa)

data = dict(nama="Ani", usia=20, kota="Jakarta")
print("\\nDictionary data:")
print(data)`,
    
    aksesDict: `mahasiswa = {
    "nama": "Budi Santoso",
    "nim": "12345678",
    "jurusan": "Informatika"
}

print("Nama:", mahasiswa["nama"])
print("NIM:", mahasiswa["nim"])

print("Jurusan:", mahasiswa.get("jurusan"))
print("Alamat:", mahasiswa.get("alamat", "Tidak tersedia"))`,
    
    ubahTambah: `mahasiswa = {
    "nama": "Budi Santoso",
    "nim": "12345678"
}

mahasiswa["nama"] = "Budi Wijaya"
print("Setelah ubah nama:", mahasiswa)

mahasiswa["jurusan"] = "Informatika"
mahasiswa["angkatan"] = 2025
print("Setelah tambah:", mahasiswa)`,
    
    hapusItem: `mahasiswa = {
    "nama": "Budi Santoso",
    "nim": "12345678",
    "jurusan": "Informatika",
    "angkatan": 2025
}

del mahasiswa["angkatan"]
print("Setelah del angkatan:", mahasiswa)

nilai_nim = mahasiswa.pop("nim")
print("NIM yang dihapus:", nilai_nim)
print("Dictionary setelah pop:", mahasiswa)`,
    
    iterasiDict: `mahasiswa = {
    "nama": "Budi Santoso",
    "nim": "12345678",
    "jurusan": "Informatika"
}

print("Key-key:")
for key in mahasiswa.keys():
    print("-", key)

print("\\nValue-value:")
for value in mahasiswa.values():
    print("-", value)

print("\\nPasangan key-value:")
for key, value in mahasiswa.items():
    print(f"{key}: {value}")`,
  };

  // Penjelasan untuk setiap contoh (per baris)
  const explanations = {
    membuatDict: [
      "Mendeklarasikan dictionary dengan nama 'mahasiswa' menggunakan kurung kurawal.",
      "Key 'nama' dengan value 'Budi Santoso' (string).",
      "Key 'nim' dengan value '12345678' (string).",
      "Key 'jurusan' dengan value 'Informatika' (string).",
      "Menutup kurung kurawal dictionary.",
      "Mencetak teks 'Dictionary mahasiswa:' ke layar.",
      "Mencetak isi dictionary 'mahasiswa' (menampilkan semua pasangan key-value).",
      "Baris kosong sebagai pemisah output.",
      "Membuat dictionary 'data' menggunakan fungsi dict() dengan argumen keyword: nama='Ani', usia=20, kota='Jakarta'.",
      "Mencetak teks '\\nDictionary data:' (newline di awal).",
      "Mencetak isi dictionary 'data'."
    ],
    aksesDict: [
      "Mendeklarasikan dictionary 'mahasiswa' dengan 3 pasangan key-value.",
      "Key 'nama' dengan value 'Budi Santoso'.",
      "Key 'nim' dengan value '12345678'.",
      "Key 'jurusan' dengan value 'Informatika'.",
      "Menutup kurung kurawal.",
      "Baris kosong.",
      "Mencetak teks 'Nama:' diikuti dengan nilai dari key 'nama' menggunakan tanda kurung siku (akses langsung).",
      "Mencetak teks 'NIM:' diikuti dengan nilai dari key 'nim'.",
      "Baris kosong.",
      "Mencetak 'Jurusan:' dengan nilai dari key 'jurusan' menggunakan metode get(). get() akan mengembalikan None jika key tidak ada, tapi di sini key ada.",
      "Mencetak 'Alamat:' dengan nilai dari key 'alamat'. Karena key 'alamat' tidak ada, get() mengembalikan nilai default 'Tidak tersedia'."
    ],
    ubahTambah: [
      "Membuat dictionary 'mahasiswa' dengan dua key: 'nama' dan 'nim'.",
      "Key 'nama' = 'Budi Santoso'.",
      "Key 'nim' = '12345678'.",
      "Menutup kurung kurawal.",
      "Baris kosong.",
      "Mengubah nilai key 'nama' menjadi 'Budi Wijaya' (assignment).",
      "Mencetak teks dan isi dictionary setelah perubahan.",
      "Baris kosong.",
      "Menambah key baru 'jurusan' dengan value 'Informatika' (karena key belum ada).",
      "Menambah key baru 'angkatan' dengan value 2025.",
      "Mencetak teks dan isi dictionary setelah penambahan."
    ],
    hapusItem: [
      "Membuat dictionary 'mahasiswa' dengan 4 pasangan key-value.",
      "Key 'nama' = 'Budi Santoso'.",
      "Key 'nim' = '12345678'.",
      "Key 'jurusan' = 'Informatika'.",
      "Key 'angkatan' = 2025.",
      "Menutup kurung kurawal.",
      "Baris kosong.",
      "Menghapus key 'angkatan' menggunakan perintah del.",
      "Mencetak teks dan isi dictionary setelah penghapusan.",
      "Baris kosong.",
      "Menghapus key 'nim' menggunakan metode pop(). Metode ini mengembalikan nilai yang dihapus dan menyimpannya ke variabel 'nilai_nim'.",
      "Mencetak teks dan nilai yang dihapus (12345678).",
      "Mencetak teks dan isi dictionary setelah pop()."
    ],
    iterasiDict: [
      "Membuat dictionary 'mahasiswa' dengan 3 key.",
      "Key 'nama' = 'Budi Santoso'.",
      "Key 'nim' = '12345678'.",
      "Key 'jurusan' = 'Informatika'.",
      "Menutup kurung kurawal.",
      "Baris kosong.",
      "Mencetak teks 'Key-key:'.",
      "Perulangan for untuk setiap key yang diperoleh dari method keys().",
      "Mencetak tanda strip dan key yang sedang diiterasi.",
      "Baris kosong.",
      "Mencetak teks 'Value-value:'.",
      "Perulangan for untuk setiap value dari method values().",
      "Mencetak tanda strip dan value.",
      "Baris kosong.",
      "Mencetak teks 'Pasangan key-value:'.",
      "Perulangan for untuk setiap pasangan (key, value) dari method items().",
      "Mencetak key dan value menggunakan f-string."
    ]
  };

  // Data untuk 5 soal melengkapi kode
  const soal1CodeParts = [
    "data = {\n    \"nama\": \"Andi\",\n    \"usia\": 21,\n    ",
    ": \"Jakarta\"\n}\nprint(data[\"",
    "\"])  # ingin mencetak 'Andi'"
  ];
  const soal1Placeholders = ["key", "key"];
  const soal1Expected = ["\"kota\"", "nama"];

  const soal2CodeParts = [
    "nilai = {\n    \"Matematika\": 85,\n    \"Fisika\": 90,\n    \"Kimia\": 78\n}\n# Cetak nilai Fisika\nprint(nilai.",
    ")  # menggunakan metode get"
  ];
  const soal2Placeholders = ["get('Fisika')"];
  const soal2Expected = ["get(\"Fisika\")"];

  const soal3CodeParts = [
    "siswa = {\n    \"nama\": \"Rina\",\n    \"umur\": 19\n}\n# Tambahkan key 'kota' dengan value 'Bandung'\n",
    " = \"Bandung\"\nprint(siswa)"
  ];
  const soal3Placeholders = ["siswa['kota']"];
  const soal3Expected = ["siswa[\"kota\"]"];

  const soal4CodeParts = [
    "buku = {\n    \"judul\": \"Python Dasar\",\n    \"penulis\": \"John Doe\",\n    \"tahun\": 2020\n}\n# Hapus key 'tahun'\ndel ",
    "\nprint(buku)"
  ];
  const soal4Placeholders = ["buku['tahun']"];
  const soal4Expected = ["buku[\"tahun\"]"];

  const soal5CodeParts = [
    "harga = {\n    \"apel\": 5000,\n    \"mangga\": 8000,\n    \"jeruk\": 6000\n}\n# Cetak semua key menggunakan loop\nfor ",
    " in harga:\n    print(",
    ")"
  ];
  const soal5Placeholders = ["key", "key"];
  const soal5Expected = ["key", "key"];

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
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PEMBUATAN DAN AKSES ELEMEN DICTIONARY</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🎯 Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li>Mahasiswa mampu membuat dictionary dengan berbagai cara (kurung kurawal dan fungsi dict()).</li>
                <li>Mahasiswa mampu mengakses nilai dari dictionary menggunakan tanda kurung siku dan metode get().</li>
                <li>Mahasiswa mampu menambah, mengubah, dan menghapus pasangan key-value dalam dictionary.</li>
                <li>Mahasiswa mampu melakukan iterasi pada dictionary (keys, values, items).</li>
                <li>Mahasiswa mampu menerapkan dictionary dalam studi kasus sederhana.</li>
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>1. Membuat Dictionary</h3>
              <p style={styles.text}>
                Dictionary dapat dibuat dengan dua cara: menggunakan kurung kurawal <code>{`{}`}</code> atau fungsi <code>dict()</code>.
              </p>
              <CodeEditor
                code={exampleCodes.membuatDict}
                codeKey="membuatDict"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
                explanations={explanations.membuatDict}
              />

              <h3 style={styles.subTitle}>2. Mengakses Nilai Dictionary</h3>
              <p style={styles.text}>
                Ada dua cara mengakses nilai: menggunakan <code>nama_dict["key"]</code> (akan error jika key tidak ada) atau metode <code>.get("key", default)</code> (lebih aman).
              </p>
              <CodeEditor
                code={exampleCodes.aksesDict}
                codeKey="aksesDict"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
                explanations={explanations.aksesDict}
              />

              <h3 style={styles.subTitle}>3. Mengubah dan Menambah Item</h3>
              <p style={styles.text}>
                Gunakan sintaks <code>nama_dict["key"] = nilai_baru</code>. Jika key sudah ada, nilai akan diubah; jika belum ada, pasangan baru akan ditambahkan.
              </p>
              <CodeEditor
                code={exampleCodes.ubahTambah}
                codeKey="ubahTambah"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
                explanations={explanations.ubahTambah}
              />

              <h3 style={styles.subTitle}>4. Menghapus Item</h3>
              <p style={styles.text}>
                Gunakan <code>del nama_dict["key"]</code> atau metode <code>.pop("key")</code> yang mengembalikan nilai yang dihapus.
              </p>
              <CodeEditor
                code={exampleCodes.hapusItem}
                codeKey="hapusItem"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
                explanations={explanations.hapusItem}
              />

              <h3 style={styles.subTitle}>5. Iterasi (Perulangan) pada Dictionary</h3>
              <p style={styles.text}>
                Kita bisa melakukan iterasi terhadap key, value, atau pasangan key-value menggunakan method <code>.keys()</code>, <code>.values()</code>, dan <code>.items()</code>.
              </p>
              <CodeEditor
                code={exampleCodes.iterasiDict}
                codeKey="iterasiDict"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
                explanations={explanations.iterasiDict}
              />
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>✏️ Latihan Praktik (Studi Kasus)</h2>
            <div style={styles.card}>
              <div style={styles.alertBox}>
                <strong>📝 Studi Kasus: Data Mahasiswa</strong>
                <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                  <li>Buatlah dictionary dengan nama <code>data_mahasiswa</code> yang berisi key: <code>"nama"</code> dengan value <code>"Citra"</code>, key <code>"usia"</code> dengan value <code>22</code>, dan key <code>"jurusan"</code> dengan value <code>"Sistem Informasi"</code>.</li>
                  <li>Tampilkan nilai dari key <code>"nama"</code> menggunakan <code>print()</code>.</li>
                  <li>Tampilkan nilai dari key <code>"usia"</code> menggunakan <code>print()</code>.</li>
                </ul>
              </div>
              <CodeEditorEditable
                codeKey="latihan"
                title="Latihan: Membuat dan Mengakses Dictionary"
                pyodideReady={pyodideReady}
                runPythonCode={runPythonCode}
                expectedOutput={["Citra", "22"]}
              />
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>📝 Latihan Interaktif</h2>
            <div style={styles.card}>
              <p style={styles.text}>Lengkapi kode berikut dengan mengetikkan jawaban pada kotak yang tersedia.</p>
              <button style={styles.resetButton} onClick={resetInteractiveQuestions}>↻ Reset Semua Jawaban</button>
              
              <CodeCompletionQuestion
                question="1. Lengkapi kode untuk membuat dictionary dengan key 'kota' dan mencetak nilai 'Andi'."
                codeParts={soal1CodeParts}
                placeholders={soal1Placeholders}
                expectedAnswers={soal1Expected}
                resetTrigger={resetInteractives}
              />

              <CodeCompletionQuestion
                question="2. Lengkapi kode untuk mencetak nilai Fisika menggunakan metode get()."
                codeParts={soal2CodeParts}
                placeholders={soal2Placeholders}
                expectedAnswers={soal2Expected}
                resetTrigger={resetInteractives}
              />

              <CodeCompletionQuestion
                question="3. Lengkapi kode untuk menambahkan key 'kota' dengan value 'Bandung' ke dictionary siswa."
                codeParts={soal3CodeParts}
                placeholders={soal3Placeholders}
                expectedAnswers={soal3Expected}
                resetTrigger={resetInteractives}
              />

              <CodeCompletionQuestion
                question="4. Lengkapi kode untuk menghapus key 'tahun' dari dictionary buku."
                codeParts={soal4CodeParts}
                placeholders={soal4Placeholders}
                expectedAnswers={soal4Expected}
                resetTrigger={resetInteractives}
              />

              <CodeCompletionQuestion
                question="5. Lengkapi kode untuk melakukan iterasi dan mencetak semua key dari dictionary harga."
                codeParts={soal5CodeParts}
                placeholders={soal5Placeholders}
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
  feedback: { marginTop: "8px", fontSize: "14px", fontStyle: "italic", color: "#333" }
};