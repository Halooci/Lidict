import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ================= STYLE GLOBAL =================
const styles = {
  page: {
    padding: "30px 40px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "18px 24px",
    borderRadius: "6px",
    marginBottom: "30px",
    position: "relative",
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
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    overflow: "auto",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: 0,
  },
  highlightBox: {
    backgroundColor: "#e3f2fd",
    borderLeft: "4px solid #2196f3",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "0 8px 8px 0",
  },
  infoBox: {
    backgroundColor: "#e8f5e9",
    borderLeft: "4px solid #4caf50",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "0 8px 8px 0",
  },
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
    padding: "12px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeEditorTitle: { fontWeight: "600", fontSize: "15px" },
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
  },
  codeInputReadOnly: {
    width: "100%",
    minHeight: "120px",
    backgroundColor: "#272822",
    color: "#f8f8f2",
    border: "none",
    padding: "15px",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    lineHeight: "1.6",
    overflow: "auto",
  },
  codePre: { margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word" },
  outputHeader: {
    backgroundColor: "#306998",
    color: "white",
    padding: "10px 15px",
    borderTop: "2px solid #1e1e1e",
  },
  outputTitle: { fontWeight: "600", fontSize: "15px" },
  codeOutput: { backgroundColor: "#1e1e1e", padding: "15px", minHeight: "80px" },
  outputContent: {
    color: "#4af",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.5",
  },
  eksplorasiOption: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  eksplorasiOptionDisabled: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#e9ecef",
    color: "#6c757d",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  infoMessage: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#cfe2ff",
    borderLeft: "5px solid #0d6efd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#084298",
  },
  quizBox: {
    border: "2px solid #2fa69a",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  quizHeader: { backgroundColor: "#cfd8e6", padding: "15px", fontWeight: "600" },
  quizContent: { padding: "20px" },
  quizQuestion: { marginBottom: "20px", whiteSpace: "pre-line" },
  quizOption: {
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #2fa69a",
    cursor: "pointer",
  },
  quizError: {
    marginTop: "15px",
    backgroundColor: "#f8d7da",
    color: "#842029",
    padding: "12px",
    borderRadius: "8px",
  },
  quizSuccess: {
    marginTop: "15px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    padding: "12px",
    borderRadius: "8px",
  },
  quizFooter: { display: "flex", justifyContent: "space-between", padding: "15px" },
  quizNavButton: {
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  feedbackCorrect: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    borderRadius: "6px",
    fontWeight: "500",
  },
  feedbackWrong: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#f8d7da",
    color: "#842029",
    borderRadius: "6px",
    fontWeight: "500",
  },
};

// ================= KOMPONEN CODE EDITOR (READ-ONLY) =================
const CodeEditor = ({ code, title, pyodideReady, runPythonCode }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("⏳ Pyodide sedang dimuat, harap tunggu...");
      return;
    }
    setIsRunning(true);
    const result = await runPythonCode(code);
    setOutput(result);
    setIsRunning(false);
  }, [pyodideReady, code, runPythonCode]);

  return (
    <div style={styles.codeEditorContainer}>
      <div style={styles.codeEditorHeader}>
        <span style={styles.codeEditorTitle}>{title}</span>
        <button style={styles.runButton} onClick={handleRun} disabled={!pyodideReady || isRunning}>
          {isRunning ? "⏳ Menjalankan..." : pyodideReady ? "▶ Jalankan" : "⏳ Memuat..."}
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

// ================= KOMPONEN UTAMA =================
export default function PendahuluanList() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  // State untuk eksplorasi (cukup dijawab, tidak harus benar)
  const [eksplorasiSelected, setEksplorasiSelected] = useState([null, null]); // menyimpan pilihan user (index opsi)
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", ""]);
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const eksplorasiQuestions = [
    {
      text: "Yang dimaksud dengan 'list' dalam pemrograman Python adalah ...",
      options: [
        "Tipe data untuk menyimpan satu angka saja",
        "Struktur data untuk menyimpan banyak nilai dalam satu variabel",
        "Fungsi untuk mencetak teks ke layar",
        "Perintah untuk mengulang program",
      ],
      correct: 1,
    },
    {
      text: "yang merupakan contoh penulisan list yang benar di Python adalah ...",
      options: ["{1, 2, 3}", "(1, 2, 3)", "[1, 2, 3]", "<1, 2, 3>"],
      correct: 2,
    },
  ];

  // Fungsi untuk menangani klik opsi (sekali pilih, langsung terkunci)
  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    // Jika pertanyaan sudah dipilih, tidak bisa diubah
    if (eksplorasiSelected[questionIdx] !== null) return;

    // Simpan pilihan
    setEksplorasiSelected(prev => {
      const newSelected = [...prev];
      newSelected[questionIdx] = optionIdx;
      return newSelected;
    });

    // Tentukan feedback Benar/Salah
    const isCorrect = optionIdx === eksplorasiQuestions[questionIdx].correct;
    setEksplorasiFeedback(prev => {
      const newFeedback = [...prev];
      newFeedback[questionIdx] = isCorrect ? "Benar" : "Salah";
      return newFeedback;
    });
  };

  // Memantau apakah semua pertanyaan sudah dipilih (jawaban apapun)
  useEffect(() => {
    const allSelected = eksplorasiSelected.every(selected => selected !== null);
    if (allSelected && !isEksplorasiCompleted) {
      setIsEksplorasiCompleted(true);
    }
  }, [eksplorasiSelected, isEksplorasiCompleted]);

  // Kode contoh
  const exampleCodes = {
    listSederhana: `# Membuat list sederhana
buah = ["apel", "jeruk", "mangga"]
angka = [10, 20, 30]

print(buah)
print(angka)`,
    aksesElemen: `# Mengakses elemen list berdasarkan indeks
buah = ["apel", "jeruk", "mangga"]
print(buah[0])   # elemen pertama
print(buah[1])   # elemen kedua
print(buah[-1])  # elemen terakhir`,
  };

  // Load Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      if (!window.loadPyodide) {
        const script = document.createElement("script");
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
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);
      await pyodide.runPythonAsync(code);
      const output = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      await pyodide.runPythonAsync("sys.stdout = sys.__stdout__");
      return output || "(Tidak ada output)";
    } catch (error) {
      return `❌ Error: ${error.message}`;
    }
  }, []);

  // Quiz
  const quizQuestions = [
    {
      question: "Fungsi utama List dalam Python yaitu ...",
      options: [
        "Melakukan operasi matematika kompleks",
        "Menyimpan kumpulan data dalam satu variabel",
        "Menggantikan fungsi percabangan",
        "Menampilkan output ke layar",
      ],
      answer: 1,
    },
    {
      question: "Cara membuat list kosong dalam Python yaitu ...",
      options: ["list = ()", "list = {}", "list = []", 'list = ""'],
      answer: 2,
    },
    {
      question: "List dalam Python dapat menyimpan berbagai tipe data sekaligus. Pernyataan ini adalah ...",
      options: ["Benar", "Salah"],
      answer: 0,
    },
    {
      question: "Output dari kode berikut?\n\nbuah = [\"apel\", \"jeruk\"]\nprint(len(buah)) adalah ...",
      options: ["0", "1", "2", "3"],
      answer: 2,
    },
    {
      question: "Kita membutuhkan List dibanding variabel tunggal karena ...",
      options: [
        "program berjalan lebih cepat",
        "Untuk menyimpan banyak data secara terorganisir dalam satu variabel",
        "tidak perlu menggunakan perulangan",
        "tipe data lebih ketat",
      ],
      answer: 1,
    },
  ];

  const [quizCurrent, setQuizCurrent] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverCheck, setHoverCheck] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  const checkQuizAnswer = () => {
    if (quizSelected === null) return;
    setQuizFeedback(quizSelected === quizQuestions[quizCurrent].answer ? "benar" : "salah");
  };

  const nextQuiz = () => {
    if (quizCurrent < quizQuestions.length - 1) {
      setQuizCurrent(quizCurrent + 1);
      setQuizSelected(null);
      setQuizFeedback(null);
    }
  };

  const prevQuiz = () => {
    if (quizCurrent > 0) {
      setQuizCurrent(quizCurrent - 1);
      setQuizSelected(null);
      setQuizFeedback(null);
    }
  };

  return (
    <>
      <Navbar />
      <SidebarMateri />
      <div className="main-content" style={{ paddingTop: "64px" }}>
        <div style={styles.page}>
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PENDAHULUAN LIST</h1>
          </div>

          {/* TUJUAN PEMBELAJARAN */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ol style={styles.list}>
                <li>Mahasiswa mampu menjelaskan pengertian list sebagai struktur data untuk menyimpan kumpulan data dalam Python.</li>
                <li>Mahasiswa mampu mengidentifikasi fungsi dan keunggulan list dibandingkan variabel tunggal.</li>
                <li>Mahasiswa memahami konsep dasar list (indeks, mutable, tipe data campuran).</li>
              </ol>
            </div>
          </section>

          {/* EKSPLORASI AWAL (cukup dijawab, materi langsung terbuka) */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🔍 Eksplorasi Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
                <strong style={{ color: "#0d6efd" }}> Materi akan terbuka setelah kedua pertanyaan dijawab (apapun jawabannya).</strong>
              </p>
              {eksplorasiQuestions.map((q, idx) => {
                const isAnswered = eksplorasiSelected[idx] !== null;
                const selectedIdx = eksplorasiSelected[idx];
                return (
                  <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
                    <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {q.options.map((opt, optIdx) => {
                        let optionStyle = {};
                        if (isAnswered) {
                          // Jika sudah dipilih, semua opsi dinonaktifkan
                          optionStyle = styles.eksplorasiOptionDisabled;
                          // Jika opsi ini adalah jawaban yang dipilih, beri warna hijau jika benar, merah jika salah? Bisa optional
                          if (selectedIdx === optIdx) {
                            const isCorrect = selectedIdx === q.correct;
                            optionStyle = {
                              ...optionStyle,
                              backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
                              borderColor: isCorrect ? "#28a745" : "#dc3545",
                              color: isCorrect ? "#155724" : "#842029",
                            };
                          }
                        } else {
                          optionStyle = styles.eksplorasiOption;
                        }
                        return (
                          <div
                            key={optIdx}
                            onClick={() => !isAnswered && handleEksplorasiSelect(idx, optIdx)}
                            style={optionStyle}
                          >
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </div>
                        );
                      })}
                    </div>
                    {eksplorasiFeedback[idx] && (
                      <div style={eksplorasiFeedback[idx] === "Benar" ? styles.feedbackCorrect : styles.feedbackWrong}>
                        {eksplorasiFeedback[idx]}
                      </div>
                    )}
                  </div>
                );
              })}
              {!isEksplorasiCompleted && (
                <div style={styles.infoMessage}>
                  ℹ️ Jawab kedua pertanyaan di atas untuk membuka materi pembelajaran.
                </div>
              )}
            </div>
          </section>

          {/* MATERI UTAMA (muncul otomatis setelah eksplorasi selesai) */}
          {isEksplorasiCompleted && (
            <>
              {/* APA ITU LIST */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>📖 Apa Itu List?</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    <strong>List</strong> adalah salah satu struktur data bawaan Python yang digunakan untuk menyimpan <strong>kumpulan item (elemen)</strong> dalam satu variabel. List bersifat <strong>mutable</strong> (dapat diubah) dan <strong>berurutan (ordered)</strong>. Elemen dalam list dapat diakses melalui <strong>indeks</strong> yang dimulai dari 0.
                  </p>
                  <p style={styles.text}>
                    List sangat fleksibel karena dapat menampung <strong>berbagai tipe data</strong> sekaligus (angka, string, boolean, bahkan list lain).
                  </p>
                  <div style={styles.infoBox}>
                    <strong>Ciri-ciri List:</strong>
                    <ul style={styles.list}>
                      <li>Dibuat dengan tanda kurung siku <code>[]</code></li>
                      <li>Elemen dipisahkan dengan koma</li>
                      <li>Dapat berisi tipe data campuran</li>
                      <li>Dapat diubah setelah dibuat (mutable)</li>
                      <li>Mempertahankan urutan elemen</li>
                    </ul>
                  </div>
                  <CodeEditor 
                    code={exampleCodes.listSederhana} 
                    title="Contoh Kode Program" 
                    pyodideReady={pyodideReady} 
                    runPythonCode={runPythonCode} 
                  />
                </div>
              </section>

              {/* FUNGSI DAN KEGUNAAN LIST */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🎯 Fungsi dan Kegunaan List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    List digunakan ketika kita perlu menyimpan <strong>banyak data</strong> dalam satu wadah. Tanpa list, kita harus membuat banyak variabel terpisah (tidak efisien).
                  </p>
                  <div style={styles.highlightBox}>
                    <pre style={styles.code}>{`# Tanpa list (tidak efisien)
nilai1 = 85
nilai2 = 90
nilai3 = 78
# ... sulit diolah`}</pre>
                  </div>
                  <p style={styles.text}>
                    Dengan list, data menjadi <strong>terstruktur</strong>, <strong>mudah diakses</strong>, <strong>ringkas</strong>, menghemat <strong>jumlah variabel</strong>, dan dengan mudah di<strong>manipulasi</strong> dengan cara mengakses langsung elemen atau nilai yang ingin dimanipulasi.
                  </p>
                </div>
              </section>

              {/* KONSEP DASAR LIST */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🧠 Konsep Dasar List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Beberapa konsep penting yang harus dipahami tentang list:
                  </p>
                  <ul style={styles.list}>
                    <li><strong>Indeks:</strong> Setiap elemen memiliki posisi numerik mulai dari 0. Indeks negatif untuk akses dari akhir (-1 = elemen terakhir).</li>
                    <li><strong>Mutable:</strong> Elemen list dapat diubah, ditambah, atau dihapus setelah list dibuat.</li>
                    <li><strong>Tipe data campuran:</strong> Satu list bisa berisi angka, string, boolean, bahkan list lain.</li>
                  </ul>
                  <CodeEditor 
                    code={exampleCodes.aksesElemen} 
                    title="Contoh Kode Program" 
                    pyodideReady={pyodideReady} 
                    runPythonCode={runPythonCode} 
                  />
                  <p style={styles.text}>
                    Materi selanjutnya akan membahas lebih detail tentang <strong>pembuatan, akses, operasi, dan manipulasi list</strong>.
                  </p>
                </div>
              </section>

              {/* LATIHAN (QUIZ) */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>📝 Latihan</h2>
                <div style={styles.quizBox}>
                  <div style={styles.quizHeader}>Soal {quizCurrent+1} dari {quizQuestions.length}</div>
                  <div style={styles.quizContent}>
                    <p style={styles.quizQuestion}>{quizQuestions[quizCurrent].question}</p>
                    {quizQuestions[quizCurrent].options.map((opt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setQuizSelected(idx)}
                        style={{
                          ...styles.quizOption,
                          backgroundColor: quizSelected === idx ? "#2fa69a" : "#ffffff",
                          color: quizSelected === idx ? "white" : "#1f2937",
                        }}
                      >
                        {String.fromCharCode(65+idx)}. {opt}
                      </div>
                    ))}
                    {quizFeedback === "salah" && <div style={styles.quizError}>❌ Salah! Coba periksa kembali.</div>}
                    {quizFeedback === "benar" && <div style={styles.quizSuccess}>✅ Benar! Jawaban tepat.</div>}
                  </div>
                  <div style={styles.quizFooter}>
                    <button
                      style={{
                        ...styles.quizNavButton,
                        backgroundColor: hoverPrev ? "#FFD43B" : "#9ca3af",
                        color: hoverPrev ? "#306998" : "white",
                      }}
                      onClick={prevQuiz}
                      disabled={quizCurrent === 0}
                      onMouseEnter={() => setHoverPrev(true)}
                      onMouseLeave={() => setHoverPrev(false)}
                    >
                      Sebelumnya
                    </button>
                    <button
                      style={{
                        ...styles.quizNavButton,
                        backgroundColor: "#1e63d5",
                        color: "white",
                        ...(hoverCheck && { backgroundColor: "#FFD43B", color: "#306998" }),
                      }}
                      onClick={checkQuizAnswer}
                      onMouseEnter={() => setHoverCheck(true)}
                      onMouseLeave={() => setHoverCheck(false)}
                    >
                      Periksa Jawaban
                    </button>
                    <button
                      style={{
                        ...styles.quizNavButton,
                        backgroundColor: hoverNext ? "#FFD43B" : "#9ca3af",
                        color: hoverNext ? "#306998" : "white",
                      }}
                      onClick={nextQuiz}
                      disabled={quizCurrent === quizQuestions.length - 1}
                      onMouseEnter={() => setHoverNext(true)}
                      onMouseLeave={() => setHoverNext(false)}
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}