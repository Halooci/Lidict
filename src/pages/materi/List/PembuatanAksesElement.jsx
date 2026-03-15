import { useState, useEffect, useRef } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function PembuatanAksesElement() {
  /* ================= PYODIDE SETUP ================= */
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  
  // Ref untuk textarea latihan
  const latihanTextareaRef = useRef(null);
  
  // State untuk output setiap editor kode
  const [codeOutputs, setCodeOutputs] = useState({});
  
  // State untuk menyimpan kode contoh (read-only) dan latihan (editable)
  const [codeInputs, setCodeInputs] = useState({
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
    // LATIHAN KOSONG - hanya instruksi di komentar
    latihan: `

`
  });

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

  // Fungsi untuk menjalankan kode Python - VERSI FIX dengan StringIO
  const runPythonCode = async (codeKey) => {
    if (!pyodideReady || !pyodideRef.current) {
      setCodeOutputs(prev => ({
        ...prev,
        [codeKey]: "⏳ Pyodide sedang dimuat, harap tunggu..."
      }));
      return;
    }

    try {
      const pyodide = pyodideRef.current;
      
      // Clear output sebelumnya
      setCodeOutputs(prev => ({ ...prev, [codeKey]: "" }));
      
      // Escape kode untuk dimasukkan ke dalam template string Python
      const escapedCode = codeInputs[codeKey]
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
      
      // Jalankan kode dengan StringIO untuk capture output
      const result = await pyodide.runPythonAsync(`
import sys
from io import StringIO

# Simpan stdout asli
_old_stdout = sys.stdout

# Ganti dengan StringIO
sys.stdout = _buffer = StringIO()

try:
    exec("""
${escapedCode}
""")
finally:
    # Kembalikan stdout asli
    sys.stdout = _old_stdout

# Return hasil
_buffer.getvalue()
      `);
      
      setCodeOutputs(prev => ({
        ...prev,
        [codeKey]: result
      }));
      
    } catch (error) {
      setCodeOutputs(prev => ({
        ...prev,
        [codeKey]: `❌ Error: ${error.message}`
      }));
    }
  };

  // Update code input untuk latihan
  const updateCodeInput = (key, value) => {
    setCodeInputs(prev => ({ ...prev, [key]: value }));
  };

  // Komponen reusable untuk editor kode Pyodide - READ ONLY
  const CodeEditor = ({ codeKey }) => (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>Contoh Kode Program</span>
        <button 
          style={styles.runButton}
          onClick={() => runPythonCode(codeKey)}
          disabled={!pyodideReady}
        >
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>
          {codeInputs[codeKey]}
        </pre>
      </div>
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>
          {codeOutputs[codeKey] || "(Klik 'Jalankan' untuk melihat hasil)"}
        </pre>
      </div>
    </div>
  );

  // Komponen untuk editor kode yang BISA DIEDIT (Latihan Praktik)
  const CodeEditorEditable = ({ codeKey, title }) => (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button 
          style={styles.runButton}
          onClick={() => runPythonCode(codeKey)}
          disabled={!pyodideReady}
        >
          {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
        </button>
      </div>
      {/* TEXTAREA untuk input yang bisa diedit */}
      <textarea
        ref={latihanTextareaRef}
        style={styles.codeInputEditable}
        value={codeInputs[codeKey]}
        onChange={(e) => updateCodeInput(codeKey, e.target.value)}
        spellCheck={false}
      />
      <div style={styles.outputHeader}>
        <span style={styles.outputTitle}>Output</span>
      </div>
      <div style={styles.codeOutput}>
        <pre style={styles.outputContent}>
          {codeOutputs[codeKey] || "(Klik 'Jalankan' untuk melihat hasil)"}
        </pre>
      </div>
    </div>
  );

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
                  {/* HAPUS: Tujuan tentang nested list */}
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

                <CodeEditor codeKey="pembuatan" />

                <p style={styles.text}>
                  Contoh di atas menunjukkan proses pembuatan sebuah list bernama
                  <code> buah </code> yang berisi tiga elemen bertipe string.
                  Ketika program dijalankan, seluruh isi list akan ditampilkan.
                </p>

                {/* AKSES ELEMEN */}
                <h3 style={styles.subTitle}>Akses Elemen List</h3>

                <p style={styles.text}>
                  Setiap elemen dalam list memiliki indeks yang digunakan untuk
                  mengakses elemen tersebut. Python menggunakan indeks yang
                  dimulai dari angka 0 untuk elemen pertama.
                </p>

                <CodeEditor codeKey="akses" />

                <p style={styles.text}>
                  Pada contoh di atas, elemen "apel" berada pada indeks ke-0,
                  sedangkan elemen "jeruk" berada pada indeks ke-1.
                </p>

                {/* INDEKS NEGATIF */}
                <h3 style={styles.subTitle}>Indeks Negatif</h3>

                <p style={styles.text}>
                  Selain indeks positif, Python juga menyediakan indeks negatif
                  untuk mengakses elemen list dari belakang. Indeks -1 digunakan
                  untuk mengakses elemen terakhir.
                </p>

                <CodeEditor codeKey="negatif" />

                <p style={styles.text}>
                  Elemen terakhir pada list dapat diakses menggunakan indeks -1,
                  sedangkan elemen sebelumnya menggunakan indeks -2.
                </p>

                {/* SLICING */}
                <h3 style={styles.subTitle}>Slicing List</h3>

                <p style={styles.text}>
                  Slicing digunakan untuk mengambil sebagian elemen dari list.
                  Slicing dituliskan dengan format <code>list[awal:akhir]</code>.
                </p>

                <CodeEditor codeKey="slicing" />

                <p style={styles.text}>
                  Kode tersebut akan mengambil elemen dari indeks ke-1 sampai
                  sebelum indeks ke-4, sehingga menghasilkan list baru.
                </p>

                {/* HAPUS: MATERI NESTED LIST */}
                {/* Bagian nested list dan aksesNested dihapus */}

              </div>
            </section>

            {/* ================= LATIHAN PRAKTIK ================= */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Latihan Praktik
              </h2>

              <div style={styles.card}>

                <p style={styles.text}>
                  <strong>Instruksi Pengerjaan:</strong>
                </p>

                {/* INSTRUKSI TANPA NESTED LIST */}
                <ol style={styles.list}>
                  <li>Buatlah list bernama <b>data</b> berisi angka 10, 20, 30, 40, 50.</li>
                  <li>Tampilkan elemen pertama menggunakan indeks positif.</li>
                  <li>Tampilkan elemen terakhir menggunakan indeks negatif.</li>
                  <li>Gunakan slicing untuk menampilkan elemen ke-2 sampai ke-4.</li>
                  {/* HAPUS: Instruksi tentang nested list */}
                </ol>

                {/* GANTI: Trinket diganti dengan Pyodide editable */}
                <CodeEditorEditable 
                  codeKey="latihan" 
                  title="Latihan Praktik - Edit & Jalankan"
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
  // Styles untuk Code Editor Pyodide
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
  // BARU: Style untuk textarea yang bisa diedit
  codeInputEditable: {
    width: "100%",
    minHeight: "200px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    lineHeight: "1.5",
    resize: "vertical",
    outline: "none",
    direction: "ltr",
    textAlign: "left"
  },
  // BARU: Header Output
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
    minHeight: "60px"
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