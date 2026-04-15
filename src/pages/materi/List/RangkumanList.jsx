import { useState, useEffect, useRef } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function RangkumanList() {
  /* ================= PYODIDE SETUP ================= */
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  
  // State untuk setiap editor kode
  const [codeOutputs, setCodeOutputs] = useState({});
  const [codeInputs, setCodeInputs] = useState({
    // Karakteristik List (tanpa nested)
    ordered: `buah = ["durian", "nanas", "mangga", "rambutan"]
print(buah)`,
    indexed: `data = ["durian", "nanas", "mangga", "rambutan"]
print(data[0])
print(data[-1])`,
    mutable: `buah = ["durian", "nanas", "mangga"]
buah[1] = "semangka"
print(buah)`,
    heterogeneous: `data = ["Andi", 20, 175.5, True]
print(data)`,
    dynamic: `angka = [1, 2, 3]
angka.append(4)
print(angka)`,
    
    // Membuat List
    createList: `# List kosong
kosong = []

# List dengan nilai
buah = ["apel", "jeruk", "mangga"]
angka = [10, 20, 30]
campuran = ["teks", 100, True, 3.14]

print("buah:", buah)
print("angka:", angka)
print("campuran:", campuran)`,

    // Akses Indeks Positif & Negatif
    aksesPositif: `data = ["apel", 100, True, 3.14]
print("data[0]:", data[0])
print("data[1]:", data[1])
print("data[2]:", data[2])
print("data[3]:", data[3])`,
    aksesNegatif: `data = ["apel", 100, True, 3.14]
print("data[-1]:", data[-1])
print("data[-2]:", data[-2])
print("data[-3]:", data[-3])
print("data[-4]:", data[-4])`,
    slicing: `angka = [10, 20, 30, 40, 50]
print("angka[1:4]:", angka[1:4])   # indeks 1,2,3
print("angka[:3]:", angka[:3])     # 3 elemen pertama
print("angka[2:]:", angka[2:])     # dari indeks 2 sampai akhir`,

    // Operasi Dasar
    concat: `a = [1, 2, 3]
b = [4, 5, 6]
c = a + b
print("a + b =", c)`,
    repeat: `data = [1, 2, 3]
print("data * 3 =", data * 3)`,
    keanggotaan: `buah = ["apel", "jeruk", "mangga"]
print("apel" in buah)
print("pisang" in buah)`,
    panjang: `buah = ["apel", "jeruk", "mangga"]
print("len(buah) =", len(buah))`,

    // Manipulasi List
    append: `buah = ["durian", "nanas", "mangga"]
buah.append("rambutan")
print(buah)`,
    insert: `buah = ["durian", "nanas", "mangga"]
buah.insert(1, "alpukat")
print(buah)`,
    extend: `buah = ["durian", "nanas"]
buah.extend(["mangga", "rambutan"])
print(buah)`,
    remove: `buah = ["durian", "nanas", "mangga", "jeruk"]
buah.remove("jeruk")
print(buah)`,
    pop: `buah = ["durian", "nanas", "mangga"]
buah.pop(1)
print(buah)`,
    ubah: `buah = ["durian", "nanas", "mangga"]
buah[2] = "semangka"
print(buah)`,
    sort: `angka = [5, 3, 8, 1, 7, 2]
angka.sort()
print(angka)`,
    reverse: `angka = [1, 2, 3, 4]
angka.reverse()
print(angka)`,
    clear: `buah = ["apel", "jeruk", "mangga"]
buah.clear()
print(buah)`,
    count: `data = [1, 2, 2, 3]
print("Jumlah angka 2:", data.count(2))`,
    index: `data = [10, 20, 30, 20]
print("Indeks pertama 20:", data.index(20))`,
    del_slice: `angka = [10, 20, 30, 40, 50]
del angka[1:4]
print(angka)`,
  });

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

  // Fungsi menjalankan kode Python dengan metode StringIO (agar newline tetap terjaga)
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
      // Redirect stdout ke StringIO
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);
      await pyodide.runPythonAsync(codeInputs[codeKey]);
      const output = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      // Kembalikan stdout ke default
      await pyodide.runPythonAsync("sys.stdout = sys.__stdout__");
      setCodeOutputs(prev => ({ ...prev, [codeKey]: output || "(Tidak ada output)" }));
    } catch (error) {
      setCodeOutputs(prev => ({
        ...prev,
        [codeKey]: `❌ Error: ${error.message}`
      }));
    }
  };

  // Komponen editor read-only
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
      <div style={{ marginLeft: "280px" }}>
        <SidebarMateri />
        <div style={{ paddingTop: "64px" }}>
          <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>RANGKUMAN LIST</h1>
            </div>

            <section style={styles.section}>
              <div style={styles.card}>
                <p style={styles.text}>
                  <strong>List</strong> adalah struktur data bawaan Python yang bersifat <strong>linier</strong>, 
                  <strong>ordered</strong>, <strong>mutable</strong>, dan dapat menyimpan <strong>tipe data campuran</strong>. 
                  Elemen list diakses menggunakan <strong>indeks</strong> (positif dari kiri, negatif dari kanan). 
                  List sangat fleksibel karena ukurannya dapat berubah secara dinamis.
                </p>

                {/* ========== 1. KARAKTERISTIK LIST ========== */}
                <h3 style={styles.subTitle}>1. Karakteristik List</h3>
                <ul style={styles.list}>
                  <li><strong>Ordered (Terurut):</strong> Urutan elemen sesuai saat dibuat.</li>
                  <li><strong>Indexed (Memiliki Indeks):</strong> Indeks positif (0,1,2,...) dan negatif (-1,-2,...).</li>
                  <li><strong>Mutable (Dapat Diubah):</strong> Elemen dapat ditambah, dihapus, atau diubah.</li>
                  <li><strong>Heterogeneous (Tipe Campuran):</strong> Bisa berisi integer, string, boolean, float, dll.</li>
                  <li><strong>Dynamic Size (Ukuran Dinamis):</strong> Ukuran otomatis bertambah saat ditambah elemen.</li>
                </ul>

                <CodeEditor codeKey="ordered" title="Contoh Ordered" />
                <CodeEditor codeKey="indexed" title="Contoh Indeks Positif & Negatif" />
                <CodeEditor codeKey="mutable" title="Contoh Mutable (Ubah Elemen)" />
                <CodeEditor codeKey="heterogeneous" title="Contoh Tipe Data Campuran" />
                <CodeEditor codeKey="dynamic" title="Contoh Ukuran Dinamis (append)" />

                {/* ========== 2. MEMBUAT LIST ========== */}
                <h3 style={styles.subTitle}>2. Membuat List</h3>
                <p style={styles.text}>
                  List dibuat dengan tanda kurung siku <code>[]</code>, elemen dipisahkan koma. 
                  Dapat berupa list kosong, list dengan satu tipe data, atau campuran.
                </p>
                <CodeEditor codeKey="createList" title="Berbagai Cara Membuat List" />

                {/* ========== 3. AKSES ELEMEN LIST ========== */}
                <h3 style={styles.subTitle}>3. Akses Elemen List</h3>
                <p style={styles.text}>
                  <strong>Indeks positif:</strong> dimulai dari 0 (elemen pertama).<br />
                  <strong>Indeks negatif:</strong> dimulai dari -1 (elemen terakhir).<br />
                  <strong>Slicing:</strong> <code>list[awal:akhir]</code> mengambil elemen dari indeks <code>awal</code> hingga sebelum <code>akhir</code>.
                </p>
                <CodeEditor codeKey="aksesPositif" title="Akses dengan Indeks Positif" />
                <CodeEditor codeKey="aksesNegatif" title="Akses dengan Indeks Negatif" />
                <CodeEditor codeKey="slicing" title="Slicing List" />

                {/* ========== 4. OPERASI DASAR LIST ========== */}
                <h3 style={styles.subTitle}>4. Operasi Dasar List</h3>
                <ul style={styles.list}>
                  <li><strong>Concatenation (+):</strong> Menggabungkan dua list.</li>
                  <li><strong>Repetition (*):</strong> Mengulang list sebanyak n kali.</li>
                  <li><strong>Keanggotaan (in):</strong> Mengecek apakah nilai ada di dalam list.</li>
                  <li><strong>Panjang (len):</strong> Menghitung jumlah elemen.</li>
                </ul>
                <CodeEditor codeKey="concat" title="Concatenation (+)" />
                <CodeEditor codeKey="repeat" title="Repetition (*)" />
                <CodeEditor codeKey="keanggotaan" title="Operator in" />
                <CodeEditor codeKey="panjang" title="Fungsi len()" />

                {/* ========== 5. MANIPULASI LIST ========== */}
                <h3 style={styles.subTitle}>5. Manipulasi List (Menambah, Mengubah, Menghapus)</h3>
                
                <h4 style={styles.subSubTitle}>a. Menambah Elemen</h4>
                <ul style={styles.list}>
                  <li><code>append(x)</code> – tambah x di akhir.</li>
                  <li><code>insert(i, x)</code> – sisip x pada indeks i.</li>
                  <li><code>extend(iterable)</code> – tambah semua elemen dari iterable.</li>
                </ul>
                <CodeEditor codeKey="append" title="append()" />
                <CodeEditor codeKey="insert" title="insert()" />
                <CodeEditor codeKey="extend" title="extend()" />

                <h4 style={styles.subSubTitle}>b. Menghapus Elemen</h4>
                <ul style={styles.list}>
                  <li><code>remove(x)</code> – hapus elemen pertama yang bernilai x.</li>
                  <li><code>pop(i)</code> – hapus elemen indeks i (kembalikan nilainya).</li>
                  <li><code>clear()</code> – hapus semua elemen.</li>
                  <li><code>del list[i]</code> atau <code>del list[i:j]</code> – hapus berdasarkan indeks/slice.</li>
                </ul>
                <CodeEditor codeKey="remove" title="remove()" />
                <CodeEditor codeKey="pop" title="pop()" />
                <CodeEditor codeKey="clear" title="clear()" />
                <CodeEditor codeKey="del_slice" title="del (slice)" />

                <h4 style={styles.subSubTitle}>c. Mengubah Elemen</h4>
                <p style={styles.text}>Menugaskan nilai baru ke indeks tertentu: <code>list[indeks] = nilai_baru</code></p>
                <CodeEditor codeKey="ubah" title="Mengubah Elemen" />

                <h4 style={styles.subSubTitle}>d. Pengurutan & Pembalikan</h4>
                <ul style={styles.list}>
                  <li><code>sort()</code> – mengurutkan ascending (permanen).</li>
                  <li><code>reverse()</code> – membalik urutan (permanen).</li>
                </ul>
                <CodeEditor codeKey="sort" title="sort()" />
                <CodeEditor codeKey="reverse" title="reverse()" />

                <h4 style={styles.subSubTitle}>e. Method Informasi Lainnya</h4>
                <ul style={styles.list}>
                  <li><code>count(x)</code> – jumlah kemunculan x.</li>
                  <li><code>index(x)</code> – indeks pertama x.</li>
                </ul>
                <CodeEditor codeKey="count" title="count()" />
                <CodeEditor codeKey="index" title="index()" />

                <p style={styles.text}>
                  Dengan memahami karakteristik, pembuatan, akses, operasi dasar, dan manipulasi list, 
                  Anda siap menggunakan list untuk menyelesaikan berbagai masalah pemrograman secara efisien.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    padding: "30px 40px",
    paddingTop: "40px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif"
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "18px 24px",
    borderRadius: "6px",
    marginBottom: "30px",
    position: "relative"
  },
  headerAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "8px",
    backgroundColor: "#FFD43B"
  },
  headerTitle: {
    margin: 0,
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700"
  },
  section: { marginBottom: "40px" },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
  },
  list: { paddingLeft: "20px", lineHeight: "1.8", marginBottom: "15px" },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
  subTitle: { marginTop: "28px", marginBottom: "10px", color: "#306998", fontSize: "1.4rem", fontWeight: "600" },
  subSubTitle: { marginTop: "20px", marginBottom: "8px", color: "#2c5282", fontSize: "1.2rem", fontWeight: "600" },
  codeEditorContainer: {
    border: "2px solid #306998",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "20px",
    backgroundColor: "#1e1e1e"
  },
  codeEditorHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
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
    transition: "all 0.2s"
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
    lineHeight: "1.5",
    overflow: "auto"
  },
  codePre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontFamily: "monospace"
  },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    borderTop: "2px solid #1e1e1e"
  },
  outputTitle: { fontWeight: "600", fontSize: "14px" },
  codeOutput: {
    backgroundColor: "#1e1e1e",
    padding: "15px",
    minHeight: "60px"
  },
  outputContent: {
    color: "#4af",
    fontFamily: "monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word"
  }
};