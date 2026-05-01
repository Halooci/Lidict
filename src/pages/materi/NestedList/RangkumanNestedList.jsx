import { useState, useEffect, useRef } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';

export default function RangkumanNestedList() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) {
      navigate('/loginregister');
    }
  }, [navigate]);


  /* ================= PYODIDE SETUP ================= */
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [codeOutputs, setCodeOutputs] = useState({});
  const [codeInputs, setCodeInputs] = useState({
    pengertian: `# Nested list adalah list di dalam list
data = [[1, 2, 3], [4, 5, 6]]
print(data)`,
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

          {/* PENGERTIAN DAN KARAKTERISTIK */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>📖 Pengertian Nested List</h2>
              <p style={styles.text}>
                <strong>Nested list</strong> (list bersarang) adalah struktur data di mana sebuah list menjadi elemen dari list lain. 
                Nested list sangat berguna untuk merepresentasikan data dua dimensi atau lebih, seperti tabel, matriks, atau data hierarkis.
              </p>
              <CodeEditor codeKey="pengertian" title="Contoh Nested List" />
              <ul style={styles.list}>
                <li><strong>Ordered:</strong> Urutan baris dan kolom tetap sesuai penyisipan.</li>
                <li><strong>Mutable:</strong> Dapat diubah (ditambah, dihapus, diubah) baik baris maupun kolom.</li>
                <li><strong>Heterogeneous:</strong> Setiap baris dapat memiliki panjang berbeda (ragged array).</li>
                <li><strong>Akses:</strong> Menggunakan dua indeks: <code>list[baris][kolom]</code>.</li>
              </ul>
            </div>
          </section>

          {/* PEMBUATAN DAN AKSES ELEMEN */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>🛠️ Membuat dan Mengakses Nested List</h2>
              <p style={styles.text}>
                <strong>Membuat nested list:</strong> Tulis list di dalam list, pisahkan dengan koma.
              </p>
              <pre style={styles.code}>{`# Cara membuat nested list
data = [[1, 2, 3], [4, 5, 6]]          # 2 baris, 3 kolom
matriks = [[1, 2], [3, 4], [5, 6]]    # 3 baris, 2 kolom
ragged = [[1, 2], [3, 4, 5], [6]]     # panjang baris berbeda`}</pre>
              <p style={styles.text}>
                <strong>Mengakses elemen:</strong> Gunakan indeks baris dan kolom (keduanya mulai dari 0).
              </p>
              <CodeEditor codeKey="akses" title="Akses Elemen Nested List" />
              <p style={styles.text}>
                <strong>Indeks negatif:</strong> <code>data[-1][-2]</code> mengakses elemen kedua dari akhir pada baris terakhir.
              </p>
            </div>
          </section>

          {/* OPERASI DASAR NESTED LIST */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>📊 Operasi Dasar Nested List</h2>
              <ul style={styles.list}>
                <li><strong>Mengubah nilai elemen:</strong> <code>data[baris][kolom] = nilai_baru</code></li>
                <li><strong>Mencari nilai:</strong> Perulangan bersarang dengan pengecekan kondisi.</li>
                <li><strong>Iterasi seluruh elemen:</strong> Loop <code>for i in range(len(data))</code> di dalam <code>for j in range(len(data[i]))</code>.</li>
                <li><strong>Menggabungkan nested list:</strong> Operator <code>+</code> menggabungkan dua nested list.</li>
                <li><strong>Membuat nested list dengan list comprehension:</strong> <code>[[0 for j in range(kolom)] for i in range(baris)]</code>.</li>
              </ul>
              <CodeEditor codeKey="ubah" title="Mengubah Elemen" />
              <CodeEditor codeKey="mencari" title="Mencari Nilai" />
              <CodeEditor codeKey="iterasi" title="Iterasi Seluruh Elemen" />
              <CodeEditor codeKey="menggabung" title="Menggabungkan Nested List" />
              <CodeEditor codeKey="listComprehension" title="List Comprehension" />
            </div>
          </section>

          {/* MANIPULASI NESTED LIST (BARIS DAN KOLOM) */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>✏️ Manipulasi Nested List</h2>
              <h3 style={styles.subTitle}>Manipulasi Baris</h3>
              <ul style={styles.list}>
                <li><strong>Menambah baris di akhir:</strong> <code>data.append([baris_baru])</code></li>
                <li><strong>Menyisipkan baris:</strong> <code>data.insert(posisi, [baris_baru])</code></li>
                <li><strong>Menghapus baris terakhir:</strong> <code>data.pop()</code></li>
                <li><strong>Menghapus baris berdasarkan indeks:</strong> <code>del data[indeks]</code></li>
              </ul>
              <CodeEditor codeKey="tambahBaris" title="Menambah Baris (append)" />
              <CodeEditor codeKey="sisipBaris" title="Menyisip Baris (insert)" />
              <CodeEditor codeKey="hapusBaris" title="Menghapus Baris (pop & del)" />

              <h3 style={styles.subTitle}>Manipulasi Kolom</h3>
              <ul style={styles.list}>
                <li><strong>Menambah kolom di setiap baris:</strong> Loop dan <code>baris.append(nilai)</code></li>
                <li><strong>Menghapus kolom tertentu dari setiap baris:</strong> Loop dan <code>baris.pop(indeks_kolom)</code></li>
              </ul>
              <CodeEditor codeKey="tambahKolom" title="Menambah Kolom" />
              <CodeEditor codeKey="hapusKolom" title="Menghapus Kolom" />
            </div>
          </section>

          {/* RINGKASAN METODE PENTING */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>📋 Ringkasan Metode dan Operasi</h2>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.tableCell}>Operasi/Metode</th>
                      <th style={styles.tableCell}>Contoh</th>
                      <th style={styles.tableCell}>Penjelasan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={styles.tableCell}>Akses elemen</td><td style={styles.tableCell}><code>data[i][j]</code></td><td style={styles.tableCell}>Mengambil elemen baris i kolom j</td></tr>
                    <tr><td style={styles.tableCell}>Ubah elemen</td><td style={styles.tableCell}><code>data[i][j] = x</code></td><td style={styles.tableCell}>Mengubah nilai pada posisi tertentu</td></tr>
                    <tr><td style={styles.tableCell}>Tambah baris (append)</td><td style={styles.tableCell}><code>data.append([a,b,c])</code></td><td style={styles.tableCell}>Menambah baris baru di akhir</td></tr>
                    <tr><td style={styles.tableCell}>Sisip baris (insert)</td><td style={styles.tableCell}><code>data.insert(i, [a,b,c])</code></td><td style={styles.tableCell}>Menyisip baris pada indeks i</td></tr>
                    <tr><td style={styles.tableCell}>Hapus baris (pop)</td><td style={styles.tableCell}><code>data.pop()</code> atau <code>data.pop(i)</code></td><td style={styles.tableCell}>Hapus baris terakhir atau baris ke-i</td></tr>
                    <tr><td style={styles.tableCell}>Hapus baris (del)</td><td style={styles.tableCell}><code>del data[i]</code></td><td style={styles.tableCell}>Hapus baris ke-i</td></tr>
                    <tr><td style={styles.tableCell}>Tambah kolom</td><td style={styles.tableCell}><code>for row in data: row.append(x)</code></td><td style={styles.tableCell}>Menambah kolom baru di semua baris</td></tr>
                    <tr><td style={styles.tableCell}>Hapus kolom</td><td style={styles.tableCell}><code>for row in data: row.pop(j)</code></td><td style={styles.tableCell}>Hapus kolom ke-j dari semua baris</td></tr>
                    <tr><td style={styles.tableCell}>Iterasi</td><td style={styles.tableCell}><code>for i in range(len(data)): for j in range(len(data[i])): ...</code></td><td style={styles.tableCell}>Perulangan bersarang untuk mengakses semua elemen</td></tr>
                    <tr><td style={styles.tableCell}>Penggabungan</td><td style={styles.tableCell}><code>c = a + b</code></td><td style={styles.tableCell}>Menggabungkan dua nested list</td></tr>
                    <tr><td style={styles.tableCell}>List comprehension</td><td style={styles.tableCell}><code>[[0 for j in range(3)] for i in range(4)]</code></td><td style={styles.tableCell}>Membuat matriks 4x3 dengan nilai 0</td></tr>
                  </tbody>
                </table>
              </div>
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
  list: { paddingLeft: "20px", lineHeight: "1.8", marginBottom: "15px" },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
  subTitle: { marginTop: "20px", marginBottom: "10px", color: "#306998" },
  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflowX: "auto",
    marginBottom: "15px",
  },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    lineHeight: "1.6",
    marginTop: "10px",
  },
  tableHeader: { backgroundColor: "#306998", color: "white" },
  tableCell: { padding: "10px", border: "1px solid #ddd", textAlign: "left", verticalAlign: "top" },
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
  codeOutput: { backgroundColor: "#1e1e1e", padding: "15px", minHeight: "60px" },
  outputContent: {
    color: "#4af",
    fontFamily: "monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};