import { useState, useEffect, useRef } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function OperasiManipulasiList() {
  /* ================= PYODIDE SETUP ================= */
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  
  // State untuk output setiap editor kode
  const [codeOutputs, setCodeOutputs] = useState({});
  
  // State untuk menyimpan kode contoh (read-only)
  const codeExamples = {
    concat: `a = [1, 2, 3]
b = [4, 5, 6]
c = a + b
print(c)`,
    repeat: `data = [1, 2, 3]
print(data * 3)`,
    search: `buah = ["apel", "jeruk", "mangga"]
print("mangga" in buah)
print("pisang" in buah)`,
    sort: `angka = [5, 3, 8, 1, 7, 2]
angka.sort()
print(angka)`,
    append: `buah = ["durian", "nanas", "mangga", "rambutan"]
buah.append("alpukat")
print(buah)`,
    insert: `buah = ["durian", "nanas", "mangga", "rambutan"]
buah.insert(1, "alpukat")
print(buah)`,
    extend: `buah = ["durian", "nanas", "mangga", "rambutan"]
buah.extend(["salak", "jeruk", "manggis"])
print(buah)`,
    remove: `buah = ["durian", "nanas", "mangga", "rambutan", "jeruk"]
buah.remove("jeruk")
print(buah)`,
    pop: `buah = ["durian", "nanas", "mangga", "rambutan"]
buah.pop(2)
print(buah)`,
    change: `buah = ["durian", "nanas", "mangga", "rambutan"]
buah[3] = "belimbing"
print(buah)`,
    length: `buah = ["durian", "nanas", "mangga", "rambutan"]
print(len(buah))`,
    nested: `data = [["Nitta", 80], ["Lita", 85]]
data[1][1] = 90
print(data)`,
    appendNested: `data = [["Nitta", 80], ["Lita", 85]]
data.append(["Citra", 78])
print(data)`
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

  // Fungsi untuk menjalankan kode Python - VERSI FIX
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
      const escapedCode = codeExamples[codeKey]
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

  // Komponen reusable untuk editor kode Pyodide - READ ONLY
  const CodeEditor = ({ codeKey, title }) => (
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
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>
          {codeExamples[codeKey]}
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
              <h1 style={styles.headerTitle}>OPERASI DAN MANIPULASI LIST</h1>
            </div>

            {/* TUJUAN PEMBELAJARAN */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
              <div style={styles.card}>
                <ol style={styles.list}>
                  <li>
                    Mengoperasikan list menggunakan teknik penjumlahan,
                    pengulangan, pencarian, dan pengurutan.
                  </li>
                  <li>
                    Melakukan manipulasi list seperti menambah, menghapus,
                    mengubah, dan menggabungkan elemen sesuai kebutuhan.
                  </li>
                  <li>
                    Menerapkan operasi dasar pada nested list, baik untuk
                    mengakses, memodifikasi, atau menggabungkan data.
                  </li>
                </ol>
              </div>
            </section>

            {/* MATERI */}
            <section style={styles.section}>
              <div style={styles.card}>

                <p style={styles.text}>
                  Operasi dasar pada list meliputi penjumlahan (concatenation),
                  pengulangan, pencarian nilai, serta pengurutan. Operasi-operasi
                  ini sangat penting untuk mengolah data yang bersifat dinamis
                  dan dapat berubah-ubah.
                </p>

                {/* CONCATENATION */}
                <h3 style={styles.subTitle}>
                  Operasi Penjumlahan (Concatenation)
                </h3>

                <p style={styles.text}>
                  Concatenation digunakan untuk menggabungkan dua atau lebih
                  list menjadi satu list baru dengan menggunakan operator tanda
                  tambah (+).
                </p>

                <CodeEditor codeKey="concat" title="Contoh Kode Program" />

                <p style={styles.text}>
                  Dengan menggunakan tanda tambah (+), list a dan b dapat
                  digabungkan menjadi satu list baru.
                </p>

                {/* REPETITION */}
                <h3 style={styles.subTitle}>
                  Operasi Perulangan (Repetition)
                </h3>

                <p style={styles.text}>
                  Repetition digunakan untuk menggandakan atau mengulang elemen
                  dalam suatu list menggunakan operator tanda bintang (*).
                </p>

                <CodeEditor codeKey="repeat" title="Contoh Kode Program" />

                <p style={styles.text}>
                  Dengan tanda bintang (*), elemen list akan diulang sebanyak
                  jumlah yang ditentukan.
                </p>

                {/* SEARCH */}
                <h3 style={styles.subTitle}>Operasi Pencarian</h3>

                <p style={styles.text}>
                  Operasi pencarian digunakan untuk memeriksa apakah suatu nilai
                  terdapat di dalam list atau tidak menggunakan operator <code>in</code>.
                </p>

                <CodeEditor codeKey="search" title="Contoh Kode Program" />

                <p style={styles.text}>
                  Nilai "mangga" ditemukan dalam list sehingga menghasilkan True,
                  sedangkan "pisang" tidak ditemukan sehingga menghasilkan False.
                </p>

                {/* SORTING */}
                <h3 style={styles.subTitle}>
                  Operasi Pengurutan (Sorting)
                </h3>

                <p style={styles.text}>
                  Sorting digunakan untuk mengurutkan elemen list dari nilai
                  terkecil ke nilai terbesar menggunakan perintah <code>sort()</code>.
                </p>

                <CodeEditor codeKey="sort" title="Contoh Kode Program" />

                <p style={styles.text}>
                  List yang sebelumnya tidak terurut menjadi terurut setelah
                  menggunakan perintah sort().
                </p>

                {/* MANIPULASI */}
                <h3 style={styles.subTitle}>Menambahkan Elemen</h3>

                <p style={styles.text}>
                  Penambahan elemen ke dalam list dapat dilakukan dengan beberapa
                  cara, salah satunya menggunakan perintah append().
                </p>

                <CodeEditor codeKey="append" title="Contoh Kode Program" />

                <p style={styles.text}>
                  Dengan append(), elemen baru akan ditambahkan pada indeks
                  terakhir list.
                </p>

                <h3 style={styles.subTitle}>Menambahkan pada Posisi Tertentu</h3>

                <CodeEditor codeKey="insert" title="Contoh Kode Program" />

                <p style={styles.text}>
                  Dengan insert(), elemen baru ditambahkan pada indeks yang
                  ditentukan.
                </p>

                <h3 style={styles.subTitle}>Menambahkan Banyak Elemen</h3>

                <CodeEditor codeKey="extend" title="Contoh Kode Program" />

                <p style={styles.text}>
                  Dengan extend(), banyak elemen dapat ditambahkan sekaligus ke
                  dalam list.
                </p>

                {/* REMOVE */}
                <h3 style={styles.subTitle}>
                  Menghapus dan Mengganti Elemen
                </h3>

                <CodeEditor codeKey="remove" title="Contoh Kode Program - remove()" />

                <p style={styles.text}>
                  Elemen "jeruk" dihapus dari list menggunakan perintah remove().
                </p>

                <CodeEditor codeKey="pop" title="Contoh Kode Program - pop()" />

                <p style={styles.text}>
                  Elemen pada indeks ke-2 dihapus menggunakan perintah pop().
                </p>

                <CodeEditor codeKey="change" title="Contoh Kode Program - Ubah Elemen" />

                <p style={styles.text}>
                  Elemen pada indeks tertentu dapat diubah dengan mengganti nilai
                  lama dengan nilai baru.
                </p>

                {/* LENGTH */}
                <h3 style={styles.subTitle}>Memeriksa Panjang List</h3>

                <CodeEditor codeKey="length" title="Contoh Kode Program" />

                <p style={styles.text}>
                  Perintah len() digunakan untuk mengetahui jumlah elemen di
                  dalam list.
                </p>

                {/* NESTED */}
                <h3 style={styles.subTitle}>
                  Operasi pada Nested List
                </h3>

                <CodeEditor codeKey="nested" title="Contoh Kode Program" />

                <p style={styles.text}>
                  Elemen pada nested list dapat diubah menggunakan dua indeks,
                  yaitu indeks baris dan kolom.
                </p>

                <h3 style={styles.subTitle}>Menambah Baris Baru</h3>
                
                <CodeEditor codeKey="appendNested" title="Contoh Kode Program" />

                <p style={styles.text}>
                  Baris baru dapat ditambahkan ke dalam nested list menggunakan
                  perintah append().
                </p>

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
  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontSize: "14px",
    overflowX: "auto",
  },
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
    fontSize: "15px"
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
    transition: "all 0.2s"
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