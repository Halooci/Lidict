import { useState, useEffect, useRef } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function RangkumanList() {
  /* ================= PYODIDE SETUP ================= */
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  
  // State untuk setiap editor kode
    // Ref untuk textarea latihan agar auto-focus
  const latihanTextareaRef = useRef(null);
  const [codeOutputs, setCodeOutputs] = useState({});
  const [codeInputs, setCodeInputs] = useState({
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
    nested: `nilai = [
  ["Nova", 80, 90],
  ["Cindy", 85, 88],
  ["Sabrina", 78, 92]
]
print(nilai)
print("Baris ke-2:", nilai[1])
print("Elemen [1][0]:", nilai[1][0])`,
        // LATIHAN KOSONG - hanya instruksi di komentar
    latihan: `

`
  });

  // Load Pyodide saat komponen mount
  useEffect(() => {
    const loadPyodide = async () => {
      if (!window.loadPyodide) {
        // Load script Pyodide jika belum ada
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

    // Auto-focus textarea latihan saat komponen dimuat
  // useEffect(() => {
    // Delay sedikit agar DOM sudah siap
    // const timer = setTimeout(() => {
    //   if (latihanTextareaRef.current) {
    //     latihanTextareaRef.current.focus();
        // Posisikan cursor di akhir text
  //       const length = latihanTextareaRef.current.value.length;
  //       latihanTextareaRef.current.setSelectionRange(length, length);
  //     }
  //   }, 500);
    
  //   return () => clearTimeout(timer);
  // }, []);

  // Fungsi untuk menjalankan kode Python
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
      
      // Redirect stdout ke variabel
      pyodide.setStdout({ batched: (text) => {
        setCodeOutputs(prev => ({
          ...prev,
          [codeKey]: (prev[codeKey] || "") + text
        }));
      }});
      
      // Clear output sebelumnya
      setCodeOutputs(prev => ({ ...prev, [codeKey]: "" }));
      
      // Jalankan kode
      await pyodide.runPythonAsync(codeInputs[codeKey]);
      
    } catch (error) {
      setCodeOutputs(prev => ({
        ...prev,
        [codeKey]: `❌ Error: ${error.message}`
      }));
    }
  };

  // Update code input untuk yang editable
  const updateCodeInput = (key, value) => {
    setCodeInputs(prev => ({ ...prev, [key]: value }));
  };

  // Komponen reusable untuk editor kode Pyodide - READ ONLY VERSION
  const CodeEditor = ({ codeKey, title }) => (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <div style={styles.codeEditorButtons}>
          <button 
            style={styles.runButton}
            onClick={() => runPythonCode(codeKey)}
            disabled={!pyodideReady}
          >
            {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
          </button>
        </div>
      </div>
      <div style={styles.codeInputReadOnly}>
        <pre style={styles.codePre}>
          {codeInputs[codeKey]}
        </pre>
      </div>
      {/* Header Output */}
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
        <div style={styles.codeEditorButtons}>
          <button 
            style={styles.runButton}
            onClick={() => runPythonCode(codeKey)}
            disabled={!pyodideReady}
          >
            {pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
          </button>
        </div>
      </div>
      {/* TEXTAREA - HAPUS autoFocus */}
      <textarea
        ref={codeKey === 'latihan' ? latihanTextareaRef : null}
        style={styles.codeInputEditable}
        value={codeInputs[codeKey]}
        onChange={(e) => updateCodeInput(codeKey, e.target.value)}
        spellCheck={false}
        // HAPUS: autoFocus={codeKey === 'latihan'}
      />
      {/* Header Output */}
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

            {/* ================= HEADER ================= */}
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}> RANGKUMAN LIST </h1>
            </div>

            {/* MATERI */}
            <section style={styles.section}>
              <div style={styles.card}>

                <p style={styles.text}>
                  List adalah salah satu struktur data linier di Python yang
                  digunakan untuk menyimpan sekumpulan elemen dalam satu variabel.
                  Dikatakan linier karena elemen-elemen di dalamnya disusun secara
                  berurutan dan dapat diakses menggunakan indeks. Python mengimplementasikan
                  list sebagai array dinamis. Dalam Python, list ditulis menggunakan tanda 
                  kurung siku [ ], dan setiap elemen dipisahkan dengan tanda koma. List memiliki
                  beberapa karakteristik sebagai berikut.
                </p>

                {/* 1. ORDERED */}
                <h3 style={styles.subTitle}>1. Ordered (Terurut)</h3>
                <p style={styles.text}>
                  Elemen di dalam list tersusun sesuai urutan saat list dibuat.
                  Urutan ini akan tetap sama kecuali dilakukan perubahan secara
                  langsung oleh pengguna.
                </p>

                <CodeEditor 
                  codeKey="ordered" 
                  title="Contoh Kode Program"
                />

                <p style={styles.text}>
                  Penjelasan: Urutan elemen pada list adalah durian, nanas,
                  mangga, dan rambutan. Urutan ini tidak akan berubah selama
                  tidak dilakukan pengubahan pada list tersebut.
                </p>

                {/* 2. INDEXED */}
                <h3 style={styles.subTitle}>2. Indexed (Memiliki Indeks)</h3>
                <p style={styles.text}>
                  Setiap elemen pada list memiliki indeks yang digunakan untuk
                  mengakses elemen berdasarkan posisinya. Python menyediakan
                  indeks positif (+) dan indeks negatif (-). Indeks positif 
                  digunakan untuk menghitung dari awal list (dari kiri ke kanan)
                  dan dimulai dari indeks ke-0. Sedangkan indeks negatif digunakan
                  untuk menghitung dari akhir list (dari kanan ke kiri), sangat berguna
                  bila kita ingin mengambil elemen terakhir tanpa mengetahui panjang list.
                </p>

                <CodeEditor 
                  codeKey="indexed" 
                  title="Contoh Kode Program"
                />

                <p style={styles.text}>
                  Penjelasan: List data memiliki empat elemen. Elemen pertama
                  dapat diakses menggunakan indeks 0, sedangkan elemen terakhir
                  dapat diakses menggunakan indeks -1.
                </p>

                {/* 3. MUTABLE */}
                <h3 style={styles.subTitle}>3. Mutable (Dapat Diubah)</h3>
                <p style={styles.text}>
                  List bersifat mutable, artinya elemen di dalam list dapat
                  diubah, ditambah, atau dihapus tanpa membuat list baru,
                  sifat ini meembuat list sangat fleksibel dalam pengolahan data.
                </p>

                <CodeEditor 
                  codeKey="mutable" 
                  title="Contoh Kode Program"
                />

                <p style={styles.text}>
                  Penjelasan: Elemen dengan indeks ke-1 diubah dari nanas
                  menjadi semangka.
                </p>

                {/* 4. HETEROGENEOUS */}
                <h3 style={styles.subTitle}>
                  4. Heterogeneous (Tipe Data Campuran)
                </h3>

                <p style={styles.text}>
                  List dapat menyimpan berbagai tipe data dalam satu struktur,
                  seperti string, integer, float, dan boolean.
                </p>
              
                <CodeEditor 
                  codeKey="heterogeneous" 
                  title="Contoh Kode Program"
                />

                <p style={styles.text}>
                  Penjelasan: Dalam satu list terdapat berbagai tipe data,
                  yaitu string ("Andi"), integer (20), float (175.5),
                  dan boolean (True).
                </p>

                {/* 5. DYNAMIC SIZE */}
                <h3 style={styles.subTitle}>
                  5. Dynamic Size (Ukuran Dinamis)
                </h3>

                <p style={styles.text}>
                  List memiliki ukuran yang dinamis, artinya ukuran list dapat
                  berubah secara otomatis ketika elemen ditambahkan atau
                  dihapus.
                </p>

                <CodeEditor 
                  codeKey="dynamic" 
                  title="Contoh Kode Program"
                />

                <p style={styles.text}>
                  Penjelasan: Python menyesuaikan ukuran list secara otomatis
                  saat elemen baru ditambahkan.
                </p>

                {/* 6. NESTED LIST */}
                <h3 style={styles.subTitle}>6. Nested List</h3>

                <p style={styles.text}>
                  Nested list adalah list yang berisi list lain di dalamnya.
                  Nested list digunakan untuk merepresentasikan data bertingkat
                  atau data dua dimensi, seperti tabel nilai, matriks, atau data kelompok.
                  Setiap elemen dalamn nested list dapat berupa list baru. Nested list 
                  banyak digunakan untuk membuat representasi tabel sederhana.
                </p>

                <p style={styles.text}>
                    <strong>Contoh data nilai mahasiswa:</strong>
                </p>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "15px",
                    marginBottom: "20px",
                  }}
                >

                                    <thead>
                    <tr style={{ backgroundColor: "#306998", color: "white" }}>
                      <th style={styles.td}>Nama</th>
                      <th style={styles.td}>UTS</th>
                      <th style={styles.td}>UAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={styles.td}>Nova</td>
                      <td style={styles.td}>80</td>
                      <td style={styles.td}>90</td>
                    </tr>
                    <tr>
                      <td style={styles.td}>Cindy</td>
                      <td style={styles.td}>85</td>
                      <td style={styles.td}>88</td>
                    </tr>
                    <tr>
                      <td style={styles.td}>Sabrina</td>
                      <td style={styles.td}>78</td>
                      <td style={styles.td}>92</td>
                    </tr>
                  </tbody>
                </table>

                <CodeEditor 
                  codeKey="nested" 
                  title="Contoh Kode Program"
                />

                <p style={styles.text}>
                  Penjelasan: Setiap baris tabel direpresentasikan sebagai satu
                  list, dan seluruh data disimpan dalam satu list utama.
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
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "15px",
    borderLeft: "5px solid #306998",
    paddingLeft: "12px"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
  },
  list: { paddingLeft: "20px", lineHeight: "1.8" },
  text: { lineHeight: "1.8", color: "#333" },
  subTitle: { marginTop: "22px", color: "#306998" },
  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontFamily: "monospace",
    overflow: "auto"
  },
  // Styles untuk Code Editor Pyodide
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
  codeEditorTitle: {
    fontWeight: "600",
    fontSize: "14px"
  },
  codeEditorButtons: {
    display: "flex",
    gap: "10px"
  },
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
  // Style untuk area kode yang read-only
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
  // BARU: Style untuk textarea yang bisa diedit
  codeInputEditable: {
    width: "100%",
    minHeight: "200px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "monospace",
    fontSize: "14px",
    lineHeight: "1.5",
    resize: "vertical",
    outline: "none",
    direction: "ltr",        // <-- TAMBAHKAN INI
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
    fontSize: "14px"
  },
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
  },
  quizBox: {
    border: "2px solid #2fa69a",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff"
  },
  quizHeader: {
    backgroundColor: "#cfd8e6",
    padding: "15px",
    fontWeight: "600"
  },
  quizContent: { padding: "20px" },
  quizQuestion: { marginBottom: "20px", whiteSpace: "pre-line" },
  quizOption: {
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #2fa69a",
    cursor: "pointer"
  },
  quizError: {
    marginTop: "15px",
    backgroundColor: "#f8d7da",
    color: "#842029",
    padding: "12px",
    borderRadius: "8px"
  },
  quizSuccess: {
    marginTop: "15px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    padding: "12px",
    borderRadius: "8px"
  },
  quizFooter: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px"
  },
  primaryButton: {
    backgroundColor: "#1e63d5",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  secondaryButton: {
    backgroundColor: "#9ca3af",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center"
  }
};