import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { useNavigate } from 'react-router-dom';
import { db } from "../../../config/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

// ---------- IMPOR CODEMIRROR ----------
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { lineNumbers } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
// ---------------------------------------

// ================= STYLE GLOBAL =================
const styles = {
  page: {
    padding: "30px 39px",
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
  // Gaya untuk wrapper CodeMirror
  codeMirrorWrapper: {
    backgroundColor: "#272822",
    padding: "0",
  },
  // Hapus codeInputReadOnly dan codePre
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
  quizOption: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #306998",
    backgroundColor: "#fff",
    marginBottom: "8px",
  },
  quizOptionDisabled: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#e9ecef",
    color: "#6c757d",
    cursor: "not-allowed",
    opacity: 0.7,
    marginBottom: "8px",
  },
  checkAllButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
    marginTop: "10px",
  },
  quizWarning: {
    marginTop: "15px",
    marginBottom: "10px",
    padding: "12px",
    backgroundColor: "#fff3cd",
    color: "#856404",
    borderRadius: "8px",
    textAlign: "center",
  },
  resultBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#d1e7dd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#0f5132",
    fontWeight: "bold",
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
  finalSuccessBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
  },
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  modal: {
    background: "white",
    borderRadius: "32px",
    padding: "32px",
    maxWidth: "450px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 35px rgba(0,0,0,0.2)",
    animation: "fadeInUp 0.3s ease",
  },
  modalIcon: { fontSize: "64px", marginBottom: "16px" },
  modalTitle: { fontSize: "28px", fontWeight: "700", color: "#1e3a5f", marginBottom: "12px" },
  modalText: { fontSize: "16px", color: "#334155", lineHeight: "1.5", marginBottom: "24px" },
  modalButton: {
    background: "linear-gradient(135deg, #3182ce, #2c5282)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};

// ================= KOMPONEN CODE EDITOR (READ-ONLY) DENGAN CODEMIRROR =================
const CodeEditor = ({ code, title, pyodideReady, runPythonCode }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(async () => {
    if (!pyodideReady) {
      setOutput("Pyodide sedang dimuat, harap tunggu...");
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
          {isRunning ? "Menjalankan..." : pyodideReady ? "Jalankan" : "Memuat..."}
        </button>
      </div>
      {/* CodeMirror read-only */}
      <div style={styles.codeMirrorWrapper}>
        <CodeMirror
          value={code}
          height="auto"
          theme="dark"
          extensions={[
            python(),
            lineNumbers(),
            EditorView.editable.of(false),
          ]}
          style={{ fontSize: '14px' }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: false,
            indentOnInput: false,
          }}
        />
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

// ================= KOMPONEN UNTUK BLOK KODE STATIS (TIDAK BISA DIJALANKAN) =================
const StaticCodeBlock = ({ code }) => {
  return (
    <div style={styles.codeMirrorWrapper}>
      <CodeMirror
        value={code}
        height="auto"
        theme="dark"
        extensions={[
          python(),
          lineNumbers(),
          EditorView.editable.of(false),
        ]}
        style={{ fontSize: '14px' }}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: false,
          indentOnInput: false,
        }}
      />
    </div>
  );
};

// ================= KOMPONEN LATIHAN =================
const LatihanList = ({ onAllCorrectChange }) => {
  const quizQuestions = [
    {
      id: 0,
      question: "Fungsi utama List dalam Python yaitu ....",
      options: [
        "Melakukan operasi matematika kompleks",
        "Menyimpan kumpulan data dalam satu variabel",
        "Menggantikan fungsi percabangan",
        "Menampilkan output ke layar",
        "Mengurutkan data secara otomatis"
      ],
      answer: 1,
      explanation: "List adalah struktur data yang dirancang untuk menyimpan banyak nilai (koleksi) dalam satu variabel, sehingga memudahkan pengelolaan data."
    },
    {
      id: 1,
      question: "Yang dimaksud dengan 'list' dalam pemrograman Python adalah ....",
      options: [
        "Tipe data untuk menyimpan satu angka saja",
        "Fungsi untuk mencetak teks ke layar",
        "Struktur data untuk menyimpan banyak nilai dalam satu variabel",
        "Perintah untuk mengulang program",
        "Tipe data khusus untuk bilangan desimal"
      ],
      answer: 2,
      explanation: "List Struktur data untuk menyimpan banyak nilai dalam satu variabel`."
    },
    {
      id: 2,
      question: "`List dalam Python dapat menyimpan berbagai tipe data sekaligus.` Pernyataan ini adalah ....",
      options: [
        "Benar",
        "Salah",
        "Hanya untuk angka dan string",
        "Hanya untuk string dan boolean",
        "Tergantung versi Python"
      ],
      answer: 0,
      explanation: "Benar, Python list bersifat heterogen – dapat menampung tipe data berbeda (angka, string, boolean, bahkan list lain) dalam satu list."
    },
    {
      id: 3,
      question: "Output dari kode berikut:\n\nbuah = [\"apel\", \"jeruk\"]\nprint(len(buah)) \n\nadalah ....",
      options: ["0", "1", "2", "3", "4"],
      answer: 2,
      explanation: "Fungsi `len()` mengembalikan banyaknya elemen dalam list. Karena ada dua elemen ('apel' dan 'jeruk'), hasilnya adalah 2."
    },
    {
      id: 4,
      question: "Kita membutuhkan List dibanding variabel tunggal karena ....",
      options: [
        "program berjalan lebih cepat",
        "Untuk menyimpan banyak data secara terorganisir dalam satu variabel",
        "tidak perlu menggunakan perulangan",
        "tipe data lebih ketat",
        "Agar kode lebih sulit dibaca"
      ],
      answer: 1,
      explanation: "List memungkinkan kita menyimpan kumpulan data terstruktur dalam satu variabel, mempermudah pengolahan data secara berulang (looping) dan pengelolaan data yang jumlahnya banyak."
    },
  ];

  const [selected, setSelected] = useState(Array(quizQuestions.length).fill(null));
  const [locked, setLocked] = useState(Array(quizQuestions.length).fill(false));
  const [feedbackMsg, setFeedbackMsg] = useState(Array(quizQuestions.length).fill(""));
  const [warning, setWarning] = useState(null);
  const [allCorrect, setAllCorrect] = useState(false);

  useEffect(() => {
    onAllCorrectChange(allCorrect);
  }, [allCorrect, onAllCorrectChange]);

  const handleSelect = (qId, optionIndex) => {
    if (locked[qId]) return;
    const newSelected = [...selected];
    newSelected[qId] = optionIndex;
    setSelected(newSelected);
    if (allCorrect) setAllCorrect(false);
    const newFeedback = [...feedbackMsg];
    newFeedback[qId] = "";
    setFeedbackMsg(newFeedback);
    setWarning(null);
  };

  const handleCheckAll = () => {
    const allAnswered = selected.every(sel => sel !== null);
    if (!allAnswered) {
      setWarning("⚠️ Semua soal harus dijawab terlebih dahulu sebelum diperiksa.");
      return;
    }
    setWarning(null);

    let newLocked = [...locked];
    let newFeedback = [...feedbackMsg];
    let allNowCorrect = true;

    for (let i = 0; i < quizQuestions.length; i++) {
      if (locked[i]) {
        newFeedback[i] = "benar";
        continue;
      }
      const isCorrect = (selected[i] === quizQuestions[i].answer);
      if (isCorrect) {
        newLocked[i] = true;
        newFeedback[i] = "benar";
      } else {
        newLocked[i] = false;
        newFeedback[i] = "salah";
        allNowCorrect = false;
      }
    }
    setLocked(newLocked);
    setFeedbackMsg(newFeedback);
    setAllCorrect(allNowCorrect);
  };

  return (
    <div>
      <h2 style={styles.sectionTitle}>Latihan</h2>
      <div style={styles.card}>
        <p style={styles.text}>
          Jawab semua soal dengan memilih opsi yang benar. Klik "Cek Semua Jawaban" untuk memeriksa.
          Soal yang sudah benar akan terkunci. Soal yang salah dapat diperbaiki, lalu periksa kembali.
        </p>
        {quizQuestions.map((q, idx) => {
          const isLocked = locked[idx];
          const selectedIdx = selected[idx];
          const fb = feedbackMsg[idx];
          return (
            <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
              <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.question}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {q.options.map((opt, optIdx) => {
                  let optionStyle = styles.quizOption;
                  if (isLocked) {
                    optionStyle = { ...styles.quizOptionDisabled };
                    if (selectedIdx === optIdx) {
                      optionStyle = {
                        ...optionStyle,
                        backgroundColor: "#d4edda",
                        borderColor: "#28a745",
                        color: "#155724",
                      };
                    }
                  } else {
                    if (selectedIdx === optIdx) {
                      optionStyle = { ...optionStyle, backgroundColor: "#306998", color: "white", borderColor: "#306998" };
                    }
                  }
                  return (
                    <div
                      key={optIdx}
                      onClick={() => !isLocked && handleSelect(idx, optIdx)}
                      style={optionStyle}
                      onMouseEnter={(e) => {
                        if (!isLocked && selectedIdx !== optIdx) {
                          e.currentTarget.style.backgroundColor = "#fef9e6";
                          e.currentTarget.style.borderColor = "#FFD43B";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLocked && selectedIdx !== optIdx) {
                          e.currentTarget.style.backgroundColor = "#fff";
                          e.currentTarget.style.borderColor = "#306998";
                        }
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </div>
                  );
                })}
              </div>
              {fb === "benar" && (
                <div style={styles.feedbackCorrect}>
                  ✓ Benar – {quizQuestions[idx].explanation}
                </div>
              )}
              {fb === "salah" && (
                <div style={styles.feedbackWrong}>
                  ✗ Salah, coba pilih jawaban lain
                </div>
              )}
            </div>
          );
        })}
        {warning && <div style={styles.quizWarning}>{warning}</div>}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button style={styles.checkAllButton} onClick={handleCheckAll}>
            Cek Semua Jawaban
          </button>
        </div>
        {allCorrect && <div style={styles.resultBox}>🎉 Selamat! Semua jawaban sudah dijawab dengan benar.</div>}
      </div>
    </div>
  );
};

// ================= KOMPONEN UTAMA =================
export default function PendahuluanList() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bonusGiven, setBonusGiven] = useState(false);

  // ─────────── KONFIGURASI HALAMAN ───────────
  // Ubah TOPIC_NAME untuk halaman lain: "nested_list", "dictionary", dll.
  const TOPIC_NAME = "list";
  const EKSPLORASI_ANSWERS_KEY = `eksplorasi_${TOPIC_NAME}_answers`;
  const BONUS_DONE_KEY = `pendahuluan${TOPIC_NAME}_bonus_done`;
  // ────────────────────────────────────────────

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!uid || !userEmail) {
      navigate('/loginregister');
    } else {
      setUserId(uid);
    }
  }, [navigate]);

  useEffect(() => {
    const already = localStorage.getItem(BONUS_DONE_KEY);
    if (already === "true") setBonusGiven(true);
  }, [BONUS_DONE_KEY]);

  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  // Eksplorasi questions
  const eksplorasiQuestions = [
    {
      text: "Yang dimaksud dengan 'list' dalam pemrograman Python adalah ....",
      options: [
        "Tipe data untuk menyimpan satu angka saja",
        "Struktur data untuk menyimpan banyak nilai dalam satu variabel",
        "Fungsi untuk mencetak teks ke layar",
        "Perintah untuk mengulang program",
        "Tipe data khusus untuk bilangan desimal"
      ],
      correct: 1,
    },
    {
      text: "yang merupakan contoh penulisan list yang benar di Python adalah ....",
      options: [
        "{1, 2, 3}",
        "(1, 2, 3)",
        "[1, 2, 3]",
        "<1, 2, 3>",
        "list(1, 2, 3)"
      ],
      correct: 2,
    },
  ];

  // State eksplorasi diinisialisasi dari localStorage
  const [eksplorasiSelected, setEksplorasiSelected] = useState(() => {
    try {
      const saved = localStorage.getItem(EKSPLORASI_ANSWERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === eksplorasiQuestions.length) {
          return parsed;
        }
      }
    } catch (e) {
      // fallback
    }
    return Array(eksplorasiQuestions.length).fill(null);
  });

  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(() => {
    return eksplorasiSelected.map((selectedIdx, i) => {
      if (selectedIdx === null) return "";
      return selectedIdx === eksplorasiQuestions[i].correct ? "Benar" : "Salah";
    });
  });

  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(
    () => eksplorasiSelected.every(sel => sel !== null)
  );

  // Sinkronisasi: setiap kali eksplorasiSelected berubah, perbarui feedback dan simpan ke localStorage
  useEffect(() => {
    const newFeedback = eksplorasiSelected.map((sel, i) => {
      if (sel === null) return "";
      return sel === eksplorasiQuestions[i].correct ? "Benar" : "Salah";
    });
    setEksplorasiFeedback(newFeedback);
    const allAnswered = eksplorasiSelected.every(sel => sel !== null);
    setIsEksplorasiCompleted(allAnswered);
    // Simpan jawaban ke localStorage dengan kunci terstruktur
    localStorage.setItem(EKSPLORASI_ANSWERS_KEY, JSON.stringify(eksplorasiSelected));
  }, [eksplorasiSelected, EKSPLORASI_ANSWERS_KEY]);

  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    if (eksplorasiSelected[questionIdx] !== null) return; // sudah dijawab, terkunci
    setEksplorasiSelected(prev => {
      const newSelected = [...prev];
      newSelected[questionIdx] = optionIdx;
      return newSelected;
    });
  };

  // State untuk latihan (callback dari komponen LatihanList)
  const [allLatihanCorrect, setAllLatihanCorrect] = useState(false);

  useEffect(() => {
    if (!userId) return;
    if (bonusGiven) return;
    if (allLatihanCorrect && !showModal) {
      setShowModal(true);
    }
  }, [allLatihanCorrect, userId, bonusGiven, showModal]);

  const handleCompleteAndNavigate = async () => {
    try {
      const mahasiswaRef = doc(db, "mahasiswa", userId);
      await updateDoc(mahasiswaRef, {
        progres_belajar: increment(1)
      });
      localStorage.setItem(BONUS_DONE_KEY, "true");
      setShowModal(false);
      navigate("/List/PembuatanAksesElement");
    } catch (error) {
      console.error("Gagal update progres:", error);
      alert("Terjadi kesalahan saat menyimpan progres. Silakan coba lagi.");
    }
  };

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

  // Kode untuk blok statis (highlightBox)
  const staticCode = `# Tanpa list (tidak efisien)
nilai1 = 85
nilai2 = 90
nilai3 = 78
# ... sulit diolah`;

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
    if (!pyodideRef.current) return "Pyodide sedang dimuat...";
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
      return `Error: ${error.message}`;
    }
  }, []);

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

          {/* EKSPLORASI AWAL */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Eksplorasi Awal</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia. 
                Eksplorasi awal ini bertujuan untuk mengukur pemahaman awal Anda terhadap materi yang akan dipelajari.
                Maka dari itu, <strong>jawaban</strong> Anda <strong>tidak harus benar</strong>, jawab sesuai pemahaman Anda. 
                <strong> Materi akan terbuka setelah kedua pertanyaan dijawab.</strong>
                {isEksplorasiCompleted && " (Anda sudah menyelesaikan eksplorasi ini sebelumnya.)"}
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
                          optionStyle = styles.eksplorasiOptionDisabled;
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
                  Jawab kedua pertanyaan di atas untuk membuka materi pembelajaran.
                </div>
              )}
              {isEksplorasiCompleted && (
                <div style={styles.infoMessage}>
                  ✅ Eksplorasi selesai. Materi telah terbuka di bawah ini.
                </div>
              )}
            </div>
          </section>

          {/* MATERI UTAMA (muncul jika eksplorasi selesai) */}
          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Apa Itu List?</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    List adalah salah satu struktur data bawaan Python yang digunakan untuk menyimpan kumpulan item (elemen) dalam satu variabel. List bersifat mutable (dapat diubah) dan berurutan (ordered). Elemen dalam list dapat diakses melalui indeks yang dimulai dari 0.
                  </p>
                  <p style={styles.text}>
                    List sangat fleksibel karena dapat menampung berbagai tipe data sekaligus (angka, string, boolean, bahkan list lain).
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

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Fungsi dan Kegunaan List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    List digunakan ketika kita perlu menyimpan banyak data dan dengan tipe data yang berbeda di dalam satu wadah. Tanpa list, kita harus membuat banyak variabel terpisah (tidak efisien). Contoh tanpa list:
                  </p>
                  
                  <div style={styles.highlightBox}>
                    <StaticCodeBlock code={staticCode} />
                  </div>
                  <p style={styles.text}>
                    Dengan list, data menjadi terstruktur, mudah diakses, ringkas, menghemat jumlah variabel, dan dengan mudah dimanipulasi dengan cara mengakses langsung elemen atau nilai yang ingin dimanipulasi.
                  </p>
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Konsep Dasar List</h2>
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

              {/* LATIHAN */}
              <LatihanList onAllCorrectChange={setAllLatihanCorrect} />
            </>
          )}
        </div>
      </div>

      {/* MODAL POP-UP */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>🎉</div>
            <h2 style={styles.modalTitle}>Selamat!</h2>
            <p style={styles.modalText}>
              Anda telah menyelesaikan materi ini dengan sempurna.
              <br />
              Materi selanjutnya akan terbuka.
            </p>
            <button style={styles.modalButton} onClick={handleCompleteAndNavigate}>
              Lanjut ke materi selanjutnya
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modalButton:hover {
          transform: scale(1.02);
          box-shadow: 0 5px 15px rgba(49,130,206,0.3);
        }
      `}</style>
    </>
  );
}