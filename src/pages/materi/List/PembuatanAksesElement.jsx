import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// KOMPONEN TERPISAH untuk editor yang bisa diedit dengan VALIDASI KETAT
const CodeEditorEditable = ({ codeKey, title, expectedAnswer, validationRules, pyodideReady, runPythonCode }) => {
  const [localCode, setLocalCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  
  const handleChange = useCallback((e) => {
    setLocalCode(e.target.value);
    setError(""); // Clear error saat mengetik
  }, []);

  // Fungsi validasi ketat
  const validateCode = useCallback((code) => {
    const trimmedCode = code.trim();
    
    // Cek 1: Harus mengandung variabel bernama "data"
    if (!validationRules.requireVariable) {
      return { valid: true };
    }
    
    // Cek apakah variabel "data" dibuat
    const dataVariableRegex = /(\bdata\s*=)/;
    if (!dataVariableRegex.test(trimmedCode)) {
      return {
        valid: false,
        message: "❌ ERROR: Perhatikan lagi instruksi!"
      };
    }
    
    // Cek 2: Tidak boleh ada variabel lain selain "data" (kecuali built-in)
    const variableDeclarations = trimmedCode.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g) || [];
    const allowedVariables = ['data', 'print', 'len', 'range', 'list', 'str', 'int', 'float'];
    
    for (let decl of variableDeclarations) {
      const varName = decl.replace('=', '').trim();
      if (!allowedVariables.includes(varName)) {
        return {
          valid: false,
          message: `❌ ERROR: Perhatikan lagi instruksi!.`
        };
      }
    }
    
    // Cek 3: Value dari data harus [10, 20, 30, 40, 50]
    const dataValueRegex = /data\s*=\s*\[\s*10\s*,\s*20\s*,\s*30\s*,\s*40\s*,\s*50\s*\]/;
    if (!dataValueRegex.test(trimmedCode)) {
      return {
        valid: false,
        message: "❌ ERROR: Perhatikan lagi instruksi!"
      };
    }
    
    // Cek 4: Harus ada print(data[0]) untuk elemen pertama
    const printFirstRegex = /print\s*\(\s*data\s*\[\s*0\s*\]\s*\)/;
    if (!printFirstRegex.test(trimmedCode)) {
      return {
        valid: false,
        message: "❌ ERROR: Perhatikan lagi instruksi!!"
      };
    }
    
    // Cek 5: Harus ada print(data[-1]) untuk elemen terakhir
    const printLastRegex = /print\s*\(\s*data\s*\[\s*-\s*1\s*\]\s*\)/;
    if (!printLastRegex.test(trimmedCode)) {
      return {
        valid: false,
        message: "❌ ERROR: Perhatikan lagi instruksi!!"
      };
    }
    
    // Cek 6: Harus ada slicing print(data[1:4])
    const printSlicingRegex = /print\s*\(\s*data\s*\[\s*1\s*:\s*4\s*\]\s*\)/;
    if (!printSlicingRegex.test(trimmedCode)) {
      return {
        valid: false,
        message: "❌ ERROR: Perhatikan lagi instruksi!"
      };
    }
    
    // Cek 7: Urutan eksekusi harus benar (data dulu, baru print)
    const dataIndex = trimmedCode.indexOf('data =');
    const print0Index = trimmedCode.indexOf('print(data[0])');
    const printLastIndex = trimmedCode.indexOf('print(data[-1])');
    const printSliceIndex = trimmedCode.indexOf('print(data[1:4])');
    
    if (dataIndex === -1 || print0Index === -1 || printLastIndex === -1 || printSliceIndex === -1) {
      return {
        valid: false,
        message: "❌ ERROR: Struktur kode tidak lengkap!"
      };
    }
    
    if (print0Index < dataIndex || printLastIndex < dataIndex || printSliceIndex < dataIndex) {
      return {
        valid: false,
        message: "❌ ERROR: Variabel 'data' harus didefinisikan SEBELUM digunakan dalam print()!"
      };
    }
    
    // Semua validasi lolos
    return { valid: true };
  }, [validationRules]);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    
    // Reset output dan error
    setOutput("");
    setError("");
    
    // Validasi ketat sebelum dijalankan
    const validation = validateCode(localCode);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    
    // Jika validasi lolos, jalankan kode
    const result = await runPythonCode(localCode);
    setOutput(result);
    
    // Cek apakah output sesuai ekspektasi
    const expectedLines = ["10", "50", "[20, 30, 40]"];
    const actualLines = result.trim().split('\n').map(line => line.trim()).filter(line => line !== "");
    
    const allCorrect = expectedLines.every((expected, index) => 
      actualLines[index] === expected
    );
    
    if (allCorrect && actualLines.length === expectedLines.length) {
      setOutput(result + "\n\n✅ SELAMAT! Jawaban kamu BENAR semua!");
    } else {
      setOutput(result + "\n\n⚠️ Output tidak sesuai ekspektasi. Cek kembali kodemu!");
    }
  }, [pyodideReady, localCode, runPythonCode, validateCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button 
          style={styles.runButton}
          onClick={handleRun}
          disabled={!pyodideReady}
        >
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      
      {/* Tampilkan error jika ada */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}
      
      <textarea
        style={{
          ...styles.codeInputEditable,
          border: error ? "2px solid #ff4444" : "none",
        }}
        value={localCode}
        onChange={handleChange}
        placeholder={`Ketik kode kamu di sini...`}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
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

// KOMPONEN TERPISAH untuk editor read-only
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
        <button 
          style={styles.runButton}
          onClick={handleRun}
          disabled={!pyodideReady}
        >
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>
          {code}
        </pre>
      </div>
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

export default function PembuatanAksesElement() {
  /* ================= PYODIDE SETUP ================= */
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  // Kode contoh (read-only)
  const exampleCodes = {
    pembuatan: `buah = ["apel", "jeruk", "mangga"]
print(buah)`,
    akses: `buah = ["apel", "jeruk", "mangga"]
print(buah[0])
print(buah[1])`,
    negatif: `buah = ["apel", "jeruk", "mangga"]
print(buah[-1])
print(buah[-2])`,
    slicing: `angka = [1, 2, 3, 4, 5]
print(angka[1:4])`,
  };

  // Load Pyodide saat komponen mount
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

  // Fungsi untuk menjalankan kode Python
  const runPythonCode = useCallback(async (code) => {
    if (!pyodideRef.current) {
      return "⏳ Pyodide sedang dimuat, harap tunggu...";
    }

    try {
      const pyodide = pyodideRef.current;
      
      const escapedCode = code
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
      
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

      <div style={{ marginLeft: "280px" }}>
        <SidebarMateri />
        <div style={{ paddingTop: "64px" }}>
          <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>
                PEMBUATAN DAN AKSES ELEMEN LIST
              </h1>
            </div>

            {/* TUJUAN PEMBELAJARAN */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
              <div style={styles.card}>
                <ol style={styles.list}>
                  <li>Menjelaskan cara membuat list dalam Python.</li>
                  <li>Menjelaskan cara mengakses elemen list menggunakan indeks.</li>
                  <li>Menjelaskan penggunaan indeks positif dan indeks negatif.</li>
                  <li>Menjelaskan konsep slicing pada list.</li>
                </ol>
              </div>
            </section>

            {/* MATERI */}
            <section style={styles.section}>
              <div style={styles.card}>

                <p style={styles.text}>
                  Pembuatan list dalam Python dilakukan dengan menggunakan tanda
                  kurung siku <strong>[ ]</strong>. Setiap elemen di dalam list
                  dipisahkan menggunakan tanda koma. Elemen list dapat berupa
                  string, integer, float, maupun tipe data lainnya.
                </p>

                <CodeEditor 
                  code={exampleCodes.pembuatan} 
                  codeKey="pembuatan"
                  pyodideReady={pyodideReady}
                  runPythonCode={runPythonCode}
                />

                <p style={styles.text}>
                  Contoh di atas menunjukkan proses pembuatan sebuah list bernama
                  <code> buah </code> yang berisi tiga elemen bertipe string.
                  Ketika program dijalankan, seluruh isi list akan ditampilkan.
                </p>

                <h3 style={styles.subTitle}>Akses Elemen List</h3>

                <p style={styles.text}>
                  Setiap elemen dalam list memiliki indeks yang digunakan untuk
                  mengakses elemen tersebut. Python menggunakan indeks yang
                  dimulai dari angka 0 untuk elemen pertama.
                </p>

                <CodeEditor 
                  code={exampleCodes.akses} 
                  codeKey="akses"
                  pyodideReady={pyodideReady}
                  runPythonCode={runPythonCode}
                />

                <p style={styles.text}>
                  Pada contoh di atas, elemen "apel" berada pada indeks ke-0,
                  sedangkan elemen "jeruk" berada pada indeks ke-1.
                </p>

                <h3 style={styles.subTitle}>Indeks Negatif</h3>

                <p style={styles.text}>
                  Selain indeks positif, Python juga menyediakan indeks negatif
                  untuk mengakses elemen list dari belakang. Indeks -1 digunakan
                  untuk mengakses elemen terakhir.
                </p>

                <CodeEditor 
                  code={exampleCodes.negatif} 
                  codeKey="negatif"
                  pyodideReady={pyodideReady}
                  runPythonCode={runPythonCode}
                />

                <p style={styles.text}>
                  Elemen terakhir pada list dapat diakses menggunakan indeks -1,
                  sedangkan elemen sebelumnya menggunakan indeks -2.
                </p>

                <h3 style={styles.subTitle}>Slicing List</h3>

                <p style={styles.text}>
                  Slicing digunakan untuk mengambil sebagian elemen dari list.
                  Slicing dituliskan dengan format <code>list[awal:akhir]</code>.
                </p>

                <CodeEditor 
                  code={exampleCodes.slicing} 
                  codeKey="slicing"
                  pyodideReady={pyodideReady}
                  runPythonCode={runPythonCode}
                />

                <p style={styles.text}>
                  Kode tersebut akan mengambil elemen dari indeks ke-1 sampai
                  sebelum indeks ke-4, sehingga menghasilkan list baru.
                </p>

              </div>
            </section>

            {/* LATIHAN PRAKTIK DENGAN VALIDASI KETAT */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Latihan Praktik
              </h2>

              <div style={styles.card}>

                <div style={styles.alertBox}>
                  <strong>⚠️ Perhatian!</strong>
                  <p style={{ margin: "5px 0" }}>
                    Kode kamu <strong>WAJIB</strong> mengikuti aturan berikut:
                  </p>
                </div>

                <ol style={styles.list}>
                  
                  <li>Buatlah list bernama data berisi angka 10, 20, 30, 40, 50.</li>
                  <li>Tampilkan elemen pertama menggunakan indeks positif</li>
                  <li>Tampilkan elemen terakhir menggunakan indeks negatif.</li>
                  <li>Gunakan slicing untuk menampilkan elemen ke-2 sampai ke-4.</li>

                </ol>

                <CodeEditorEditable 
                  codeKey="latihan" 
                  title="Latihan Praktik"
                  validationRules={{
                    requireVariable: true,
                    exactMatch: true
                  }}
                  pyodideReady={pyodideReady}
                  runPythonCode={runPythonCode}
                />

              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================== STYLE ================== */
const styles = {
  page: {
    padding: "30px 40px",
    paddingTop: "40px",
    backgroundColor: "#f5f7fa",
    minHeight: "calc(100vh - 64px)",
    fontFamily: "Poppins, sans-serif",
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
  subTitle: { marginTop: "22px", color: "#306998" },
  alertBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "6px",
    padding: "15px",
    marginBottom: "15px",
    color: "#856404",
  },
  // Styles untuk Code Editor
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
    display: "flex",
    alignItems: "center",
    gap: "8px"
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
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },
  // Error box
  errorBox: {
    backgroundColor: "#ff4444",
    color: "white",
    padding: "12px 15px",
    fontSize: "14px",
    fontWeight: "500",
    borderBottom: "2px solid #cc0000",
  },
  // Style untuk area kode yang read-only
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
  // Style untuk textarea yang bisa diedit
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
    display: "block",
    boxSizing: "border-box",
    tabSize: 4,
  },
  // Header Output
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
  }
};