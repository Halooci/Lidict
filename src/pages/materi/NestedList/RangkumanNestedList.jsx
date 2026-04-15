import { useState, useEffect, useRef } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function RangkumanNestedList() {
  /* ================= PYODIDE SETUP ================= */
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [codeOutputs, setCodeOutputs] = useState({});
  const [codeInputs, setCodeInputs] = useState({
    akses: `# Mengakses elemen nested list
data = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
print("data[0][1] =", data[0][1])   # baris 1 kolom 2
print("data[2][2] =", data[2][2])   # baris 3 kolom 3
print("data[1][0] =", data[1][0])   # baris 2 kolom 1`,
    
    ubah: `# Mengubah nilai elemen
data = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
print("Sebelum:", data)
data[0][0] = 99
data[1][2] = 88
data[2][1] = 77
print("Setelah :", data)`,
    
    tambahBaris: `# Menambah baris baru (append)
data = [[1, 2, 3], [4, 5, 6]]
baris_baru = [7, 8, 9]
data.append(baris_baru)
print("Setelah append:", data)`,
    
    sisipBaris: `# Menyisipkan baris di posisi tertentu (insert)
data = [[1, 2, 3], [4, 5, 6]]
data.insert(1, [10, 11, 12])   # sisip di indeks 1
print("Setelah insert:", data)`,
    
    hapusBaris: `# Menghapus baris (pop, del)
data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
data.pop()           # hapus baris terakhir
print("Setelah pop():", data)
del data[0]          # hapus baris pertama
print("Setelah del data[0]:", data)`,
    
    tambahKolom: `# Menambah kolom (append ke setiap baris)
data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
for baris in data:
    baris.append(0)
print("Setiap baris ditambah kolom 0:")
print(data)`,
    
    hapusKolom: `# Menghapus kolom (pop dari setiap baris)
data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
for baris in data:
    baris.pop(1)   # hapus kolom ke-2 (indeks 1)
print("Setelah hapus kolom ke-2:")
print(data)`,
    
    iterasi: `# Iterasi seluruh elemen nested list
data = [[1, 2], [3, 4, 5], [6]]
for i in range(len(data)):
    for j in range(len(data[i])):
        print(f"data[{i}][{j}] = {data[i][j]}")`,
    
    listComprehension: `# Membuat nested list dengan list comprehension
baris = 3
kolom = 4
matriks = [[0 for j in range(kolom)] for i in range(baris)]
print("Matriks 3x4 dengan nilai 0:")
print(matriks)`,
    
    menggabung: `# Menggabungkan dua nested list
a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]
hasil = a + b
print("Hasil penggabungan:", hasil)`,
    
    mencari: `# Mencari nilai dalam nested list
data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
cari = 5
ditemukan = False
for i in range(len(data)):
    for j in range(len(data[i])):
        if data[i][j] == cari:
            print(f"Nilai {cari} ditemukan di baris {i}, kolom {j}")
            ditemukan = True
if not ditemukan:
    print(f"Nilai {cari} tidak ditemukan")`,
  });

  // State untuk sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      // Redirect stdout ke StringIO agar newline tetap terjaga
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);
      await pyodide.runPythonAsync(codeInputs[codeKey]);
      const output = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      await pyodide.runPythonAsync("sys.stdout = sys.__stdout__");
      setCodeOutputs(prev => ({ ...prev, [codeKey]: output || "(Tidak ada output)" }));
    } catch (error) {
      setCodeOutputs(prev => ({
        ...prev,
        [codeKey]: `❌ Error: ${error.message}`
      }));
    }
  };

  // Komponen CodeEditor read-only
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
        <pre style={styles.codePre}>{codeInputs[codeKey]}</pre>
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
            <h1 style={styles.headerTitle}>RANGKUMAN NESTED LIST</h1>
          </div>

          {/* PENDAHULUAN */}
          <section style={styles.section}>
            <div style={styles.card}>
              <p style={styles.text}>
                <strong>Nested list</strong> adalah list yang di dalamnya berisi list lain. 
                Struktur ini sangat berguna untuk merepresentasikan data dua dimensi 
                seperti tabel, matriks, atau data yang memiliki hierarki. Setiap elemen 
                dalam nested list dapat diakses menggunakan dua indeks: 
                <code> list[indeks_baris][indeks_kolom]</code>. Berikut adalah berbagai 
                operasi yang dapat dilakukan pada nested list.
              </p>
            </div>
          </section>

          {/* 1. MENGAKSES ELEMEN */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>1. Mengakses Elemen Nested List</h3>
              <p style={styles.text}>
                Gunakan dua buah indeks: indeks pertama untuk memilih baris, indeks kedua 
                untuk memilih kolom. Indeks dimulai dari 0.
              </p>
              <CodeEditor codeKey="akses" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 2. MENGUBAH NILAI ELEMEN */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>2. Mengubah Nilai Elemen</h3>
              <p style={styles.text}>
                Kita dapat mengubah nilai elemen tertentu dengan mengaksesnya lalu 
                menetapkan nilai baru.
              </p>
              <CodeEditor codeKey="ubah" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 3. MENAMBAH BARIS */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>3. Menambah Baris Baru (append)</h3>
              <p style={styles.text}>
                Gunakan method <code>append()</code> untuk menambahkan list baru sebagai baris 
                di akhir nested list.
              </p>
              <CodeEditor codeKey="tambahBaris" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 4. MENYISIPKAN BARIS */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>4. Menyisipkan Baris (insert)</h3>
              <p style={styles.text}>
                Method <code>insert(posisi, baris_baru)</code> menyisipkan baris baru pada 
                indeks tertentu.
              </p>
              <CodeEditor codeKey="sisipBaris" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 5. MENGHAPUS BARIS */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>5. Menghapus Baris</h3>
              <p style={styles.text}>
                Gunakan <code>pop()</code> untuk menghapus baris terakhir, atau <code>del</code> 
                untuk menghapus berdasarkan indeks.
              </p>
              <CodeEditor codeKey="hapusBaris" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 6. MENAMBAH KOLOM */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>6. Menambah Kolom (Elemen pada Setiap Baris)</h3>
              <p style={styles.text}>
                Iterasi setiap baris dan gunakan <code>append()</code> untuk menambahkan 
                elemen baru di akhir setiap baris.
              </p>
              <CodeEditor codeKey="tambahKolom" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 7. MENGHAPUS KOLOM */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>7. Menghapus Kolom</h3>
              <p style={styles.text}>
                Iterasi setiap baris dan gunakan <code>pop(indeks_kolom)</code> atau 
                <code>del</code> untuk menghapus kolom tertentu dari semua baris.
              </p>
              <CodeEditor codeKey="hapusKolom" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 8. ITERASI SELURUH ELEMEN */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>8. Iterasi Seluruh Elemen</h3>
              <p style={styles.text}>
                Gunakan perulangan bersarang (<code>for</code> di dalam <code>for</code>) 
                untuk mengakses semua elemen nested list.
              </p>
              <CodeEditor codeKey="iterasi" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 9. MEMBUAT NESTED LIST DENGAN LIST COMPREHENSION */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>9. Membuat Nested List dengan List Comprehension</h3>
              <p style={styles.text}>
                Cara ringkas untuk membuat matriks berukuran tertentu, misalnya matriks 3x4 
                dengan nilai 0.
              </p>
              <CodeEditor codeKey="listComprehension" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 10. MENGGABUNGKAN DUA NESTED LIST */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>10. Menggabungkan Dua Nested List</h3>
              <p style={styles.text}>
                Operator <code>+</code> dapat digunakan untuk menggabungkan dua nested list 
                menjadi satu.
              </p>
              <CodeEditor codeKey="menggabung" title="Contoh Kode Program" />
            </div>
          </section>

          {/* 11. MENCARI NILAI DALAM NESTED LIST */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>11. Mencari Nilai dalam Nested List</h3>
              <p style={styles.text}>
                Gunakan perulangan bersarang dan pengecekan kondisi untuk menemukan nilai 
                tertentu.
              </p>
              <CodeEditor codeKey="mencari" title="Contoh Kode Program" />
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
  codeEditorContainer: {
    border: "2px solid #306998",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "20px",
    backgroundColor: "#1e1e1e",
    marginTop: "15px",
  },
  codeEditorHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeEditorTitle: { fontWeight: "600", fontSize: "14px" },
  runButton: {
    backgroundColor: "#FFD43B",
    color: "#306998",
    border: "none",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  codeInputReadOnly: {
    width: "100%",
    minHeight: "120px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflow: "auto",
  },
  codePre: { margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word", fontFamily: "monospace" },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    borderTop: "2px solid #1e1e1e",
  },
  outputTitle: { fontWeight: "600", fontSize: "14px" },
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
    wordWrap: "break-word",
  },
};