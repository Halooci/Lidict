import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN LATIHAN INTERAKTIF (1 TOMBOL PERIKSA DI BAWAH, OPSI A-E) =====================
const InteractiveLatihan = () => {
  const [answers, setAnswers] = useState([null, null, null, null, null]);
  const [feedback, setFeedback] = useState(["", "", "", "", ""]);
  const [globalError, setGlobalError] = useState("");

  const questions = [
    {
      text: "Struktur data yang digunakan untuk menyimpan pasangan key-value di Python adalah ...",
      options: ["List", "Tuple", "Dictionary", "Set", "Semua benar"],
      correct: 2, // Dictionary
    },
    {
      text: "Pernyataan berikut yang benar tentang key pada dictionary adalah ...",
      options: [
        "Key boleh duplikat",
        "Key harus berupa tipe data yang mutable",
        "Key harus unik dan immutable",
        "Key hanya bisa berupa string",
        "Key bisa berupa list",
      ],
      correct: 2, // Key harus unik dan immutable
    },
    {
      text: "Pernyataan berikut yang BENAR tentang sifat dictionary di Python adalah ...",
      options: [
        "Dictionary tidak mempertahankan urutan item",
        "Dictionary bersifat immutable (tidak bisa diubah)",
        "Dictionary hanya bisa menyimpan satu tipe data",
        "Dictionary mempertahankan urutan item sesuai urutan penyisipan",
        "Key dalam dictionary boleh berupa list",
      ],
      correct: 3, // Mempertahankan urutan item sesuai urutan penyisipan
    },
    {
      text: "Tipe data berikut yang TIDAK bisa dijadikan key dalam dictionary adalah ...",
      options: ["String", "Integer", "List", "Tuple", "Float"],
      correct: 2, // List
    },
    {
      text: "Yang terjadi jika kita menggunakan key yang sama dua kali saat membuat dictionary adalah ...",
      options: [
        "Akan menghasilkan error (SyntaxError)",
        "Nilai pertama akan dipertahankan, nilai kedua diabaikan",
        "Nilai kedua akan menimpa nilai pertama",
        "Dictionary akan menyimpan kedua nilai dalam bentuk list",
        "Program akan berhenti (crash)",
      ],
      correct: 2, // Nilai kedua menimpa nilai pertama
    },
  ];

  const handleAnswerChange = (qIdx, optIdx) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = optIdx;
    setAnswers(newAnswers);
    const newFeedback = [...feedback];
    newFeedback[qIdx] = "";
    setFeedback(newFeedback);
    setGlobalError("");
  };

  const handleCheckAll = () => {
    const allAnswered = answers.every((ans) => ans !== null);
    if (!allAnswered) {
      setGlobalError("❌ Anda harus menjawab semua soal terlebih dahulu!");
      return;
    }
    setGlobalError("");
    const newFeedback = answers.map((ans, idx) => {
      if (ans === questions[idx].correct) {
        return "✅ Benar";
      } else {
        const correctLetter = String.fromCharCode(65 + questions[idx].correct);
        return `❌ Salah. Coba lagi!`;
      }
    });
    setFeedback(newFeedback);
  };

  const allCorrect = feedback.every((f) => f === "✅ Benar") && feedback.some((f) => f !== "");

  return (
    <div>
      {questions.map((q, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "30px",
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: "20px",
          }}
        >
          <p style={{ fontWeight: "600", marginBottom: "12px" }}>
            {idx + 1}. {q.text}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {q.options.map((opt, optIdx) => (
              <div
                key={optIdx}
                onClick={() => handleAnswerChange(idx, optIdx)}
                style={{
                  ...styles.eksplorasiOption,
                  backgroundColor: answers[idx] === optIdx ? "#2fa69a" : "#f9f9f9",
                  color: answers[idx] === optIdx ? "white" : "#1f2937",
                }}
              >
                <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
              </div>
            ))}
          </div>
          {feedback[idx] && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: feedback[idx].includes("Benar") ? "#d1e7dd" : "#f8d7da",
              }}
            >
              {feedback[idx]}
            </div>
          )}
        </div>
      ))}
      {globalError && (
        <div
          style={{
            marginTop: "10px",
            marginBottom: "15px",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#f8d7da",
            color: "#842029",
          }}
        >
          {globalError}
        </div>
      )}
      <button style={styles.checkAllButton} onClick={handleCheckAll}>
        Periksa Semua Jawaban
      </button>
      {allCorrect && (
        <div
          style={{
            marginTop: "15px",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#d1e7dd",
            color: "#0f5132",
            textAlign: "center",
          }}
        >
          🎉 Selamat! Semua jawaban Anda benar.
        </div>
      )}
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
export default function PendahuluanDictionary() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ================= EKSPLORASI (DIREVISI) =================
  const [eksplorasiSelected, setEksplorasiSelected] = useState([null, null, null]); // pilihan user (index opsi)
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", "", ""]);
  const [eksplorasiHasAnswered, setEksplorasiHasAnswered] = useState([false, false, false]); // apakah sudah menjawab (terkunci)
  const [isEksplorasiCompleted, setIsEksplorasiCompleted] = useState(false);

  const eksplorasiQuestions = [
    {
      text: "Dictionary dalam Python adalah ...",
      options: [
        "Kumpulan data berurutan yang diakses dengan indeks angka",
        "Kumpulan pasangan key-value yang memiliki key unik",
        "Kumpulan data yang hanya bisa menyimpan tipe angka",
        "Struktur data yang hanya bisa diubah sekali (immutable)",
        "Sama seperti list tetapi lebih cepat",
      ],
      correct: 1,
    },
    {
      text: "Tipe data berikut yang TIDAK boleh digunakan sebagai key dalam dictionary adalah ...",
      options: ["String", "Integer", "Tuple", "List", "Float"],
      correct: 3,
    },
    {
      text: "Cara mengakses nilai dari key 'nama' pada dictionary `data = {'nama': 'Andi', 'umur': 20}` adalah ...",
      options: [
        "data['nama']",
        "data{nama}",
        "data.get[0]",
        "data('nama')",
        "data.nama",
      ],
      correct: 0,
    },
  ];

  // Fungsi menangani klik opsi (sekali pilih, langsung terkunci)
  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    if (eksplorasiHasAnswered[questionIdx]) return; // sudah terjawab, tidak bisa diubah

    // Simpan pilihan
    setEksplorasiSelected(prev => {
      const newSel = [...prev];
      newSel[questionIdx] = optionIdx;
      return newSel;
    });

    // Tentukan feedback Benar/Salah
    const isCorrect = optionIdx === eksplorasiQuestions[questionIdx].correct;
    setEksplorasiFeedback(prev => {
      const newFb = [...prev];
      newFb[questionIdx] = isCorrect ? "Benar" : "Salah";
      return newFb;
    });

    // Tandai sudah dijawab
    setEksplorasiHasAnswered(prev => {
      const newAns = [...prev];
      newAns[questionIdx] = true;
      return newAns;
    });
  };

  // Memantau apakah semua pertanyaan sudah dijawab
  useEffect(() => {
    const allAnswered = eksplorasiHasAnswered.every(v => v === true);
    if (allAnswered && !isEksplorasiCompleted) {
      setIsEksplorasiCompleted(true);
    }
  }, [eksplorasiHasAnswered, isEksplorasiCompleted]);

  // Load Pyodide (tetap ada meskipun tidak digunakan)
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
      const escapedCode = code
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");
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
      <SidebarMateri
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
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
            <h1 style={styles.headerTitle}>PENDAHULUAN DICTIONARY</h1>
          </div>

          {/* TUJUAN PEMBELAJARAN */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li>
                  Mahasiswa mampu memahami pengertian dan konsep dasar dictionary dalam Python.
                </li>
                <li>Mahasiswa mampu mengidentifikasi karakteristik dictionary.</li>
              </ul>
            </div>
          </section>

          {/* EKSPLORASI AWAL (DIREVISI) */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🔍 Eksplorasi</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
                <strong style={{ color: "#0d6efd" }}>
                  {" "}
                  Materi akan terbuka setelah ketiga pertanyaan dijawab (apapun jawabannya).
                </strong>
              </p>
              {eksplorasiQuestions.map((q, idx) => {
                const isAnswered = eksplorasiHasAnswered[idx];
                const selectedIdx = eksplorasiSelected[idx];
                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "30px",
                      borderBottom: "1px solid #e0e0e0",
                      paddingBottom: "20px",
                    }}
                  >
                    <p style={{ fontWeight: "600", marginBottom: "12px" }}>
                      {idx + 1}. {q.text}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {q.options.map((opt, optIdx) => {
                        let optionStyle = {
                          ...styles.eksplorasiOption,
                          cursor: "pointer",
                        };
                        if (isAnswered) {
                          optionStyle.cursor = "not-allowed";
                          optionStyle.opacity = 0.7;
                          if (selectedIdx === optIdx) {
                            const isCorrect = (selectedIdx === q.correct);
                            optionStyle.backgroundColor = isCorrect ? "#d4edda" : "#f8d7da";
                            optionStyle.borderColor = isCorrect ? "#28a745" : "#dc3545";
                            optionStyle.color = isCorrect ? "#155724" : "#842029";
                          } else {
                            optionStyle.backgroundColor = "#e9ecef";
                            optionStyle.color = "#6c757d";
                          }
                        } else {
                          optionStyle.backgroundColor = eksplorasiSelected[idx] === optIdx ? "#2fa69a" : "#f9f9f9";
                          optionStyle.color = eksplorasiSelected[idx] === optIdx ? "white" : "#1f2937";
                        }
                        return (
                          <div
                            key={optIdx}
                            onClick={() => !isAnswered && handleEksplorasiSelect(idx, optIdx)}
                            style={optionStyle}
                          >
                            <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </div>
                        );
                      })}
                    </div>
                    {eksplorasiFeedback[idx] && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "10px",
                          borderRadius: "8px",
                          backgroundColor: eksplorasiFeedback[idx] === "Benar" ? "#d1e7dd" : "#f8d7da",
                          color: eksplorasiFeedback[idx] === "Benar" ? "#0f5132" : "#842029",
                        }}
                      >
                        {eksplorasiFeedback[idx] === "Benar" ? "✅ Benar" : "❌ Salah"}
                      </div>
                    )}
                  </div>
                );
              })}
              {!isEksplorasiCompleted && (
                <div style={styles.lockMessage}>
                  🔒 Materi terkunci. Jawab semua pertanyaan di atas untuk membuka materi.
                </div>
              )}
            </div>
          </section>

          {/* MATERI UTAMA (hanya tampil jika eksplorasi sudah selesai) */}
          {isEksplorasiCompleted && (
            <>
              {/* PENGERTIAN DICTIONARY */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Apa Itu Dictionary?</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    <strong>Dictionary</strong> adalah struktur data dalam
                    Python yang digunakan untuk menyimpan kumpulan data dalam
                    bentuk <strong>pasangan key (kunci) dan value (nilai)</strong>
                    . Setiap key bersifat unik dan digunakan untuk mengakses
                    nilai yang terkait. Dictionary bersifat{" "}
                    <strong>mutable</strong> (dapat diubah) dan tidak memiliki
                    indeks numerik seperti list, melainkan menggunakan key
                    sebagai pengganti indeks.
                  </p>
                  <p style={styles.text}>
                    Dictionary didefinisikan dengan kurung kurawal{" "}
                    <code style={styles.inlineCode}>{`{}`}</code> dan setiap
                    pasangan key-value dipisahkan oleh titik dua{" "}
                    <code style={styles.inlineCode}>:</code>. Key harus berupa
                    tipe data yang immutable (string, integer, tuple), sedangkan
                    value dapat berupa tipe data apa pun (list, dictionary lain,
                    fungsi, dll).
                  </p>
                  <div style={styles.infoBox}>
                    <strong>📖 Analogi:</strong> Seperti kamus bahasa, kita
                    mencari arti (value) berdasarkan kata (key).
                  </div>
                </div>
              </section>

              {/* KARAKTERISTIK DASAR DICTIONARY */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Karakteristik Dasar Dictionary
                </h2>
                <div style={styles.card}>
                  <ul style={styles.list}>
                    <li>
                      <strong>Key unik</strong> → Tidak boleh ada dua key yang
                      sama. Jika kamu menuliskan key yang sama lagi, nilai
                      sebelumnya akan tertimpa. Ini seperti di kamus: satu kata
                      hanya punya satu arti.
                    </li>
                    <li>
                      <strong>Key harus immutable (tidak bisa diubah)</strong> →
                      Key hanya boleh menggunakan tipe data yang nilainya tetap
                      setelah dibuat. Contoh key yang boleh: string (
                      <code>"nama"</code>), integer (<code>10</code>), tuple (
                      <code>("x", "y")</code>). <br />
                      <strong>Mengapa list tidak bisa dijadikan key?</strong>{" "}
                      Karena list bersifat mutable (bisa diubah-ubah isinya).
                      Jika list dijadikan key lalu isinya diubah, maka
                      dictionary akan bingung karena key-nya berubah. Bayangkan
                      kamu menyimpan barang di lemari dengan label yang bisa
                      berubah sendiri – pasti kacau. Maka Python melarang list
                      sebagai key.
                    </li>
                    <li>
                      <strong>Value boleh mutable (bisa diubah)</strong> →
                      Berbeda dengan key, nilai (value) dalam dictionary bisa
                      berupa tipe data apa pun, termasuk yang mutable seperti
                      list atau dictionary lain. Kamu bisa mengubah isi value
                      kapan saja.
                    </li>
                    <li>
                      <strong>Dictionary itu sendiri mutable</strong> → Kamu
                      bisa menambah, mengubah, atau menghapus pasangan key-value
                      setelah dictionary dibuat. Ukuran dictionary otomatis
                      menyesuaikan.
                    </li>
                    <li>
                      <strong>Urutan item terjaga sesuai urutan penyisipan</strong>{" "}
                      → Dictionary “mengingat” urutan saat kamu memasukkan item.
                      Misalnya kamu tambah key 'nama' dulu, lalu 'umur', maka
                      saat dilihat atau diiterasi, urutannya tetap 'nama' dulu
                      baru 'umur'.
                    </li>
                  </ul>
                  <div style={styles.infoBox}>
                    <strong>💡 Ringkasan:</strong> Key ={" "}
                    <strong>immutable</strong> (tidak boleh berubah), Value ={" "}
                    <strong>bebas</strong> (bisa mutable atau immutable),
                    Dictionary = <strong>mutable</strong> (bisa diubah struktur
                    dan isinya).
                  </div>
                </div>
              </section>

              {/* PERBANDINGAN DICTIONARY VS LIST */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Perbandingan Dictionary vs List
                </h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    Agar lebih paham, mari bandingkan dictionary dengan list
                    (struktur data yang mungkin sudah kamu kenal).
                  </p>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.tableCell}>Aspek</th>
                        <th style={styles.tableCell}>List</th>
                        <th style={styles.tableCell}>Dictionary</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={styles.tableCell}>Cara mengakses data</td>
                        <td style={styles.tableCell}>
                          Menggunakan nomor urut (indeks): <code>data[0]</code>,{" "}
                          <code>data[1]</code>, dst.
                        </td>
                        <td style={styles.tableCell}>
                          Menggunakan kunci (key) yang kita tentukan sendiri:{" "}
                          <code>data["nama"]</code>, <code>data["umur"]</code>.
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Urutan data</td>
                        <td style={styles.tableCell}>
                          Urutan pasti sesuai indeks. Bisa dipotong (slice).
                        </td>
                        <td style={styles.tableCell}>
                          Urutan diingat sesuai urutan saat kita memasukkan
                          (tidak bisa dipotong seperti list).
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Batasan “kunci”</td>
                        <td style={styles.tableCell}>
                          Tidak ada konsep kunci, hanya indeks angka.
                        </td>
                        <td style={styles.tableCell}>
                          Key harus unik dan tidak boleh berubah (immutable).
                          Contoh yang boleh: string, integer, tuple. Yang tidak
                          boleh: list (karena bisa berubah).
                        </td>
                      </tr>
                    </tbody>
                   </table>
                  <div style={styles.infoBox}>
                    <strong>💡 Analogi sederhana:</strong> List seperti rak buku
                    bernomor (indeks 0,1,2,...). Dictionary seperti lemari
                    dengan label (key) seperti "buku resep", "novel", dsb.
                    Mencari buku di rak bernomor harus hitung urutan, tapi
                    mencari di lemari berlabel langsung lihat labelnya.
                  </div>
                </div>
              </section>

              {/* LATIHAN INTERAKTIF */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Latihan</h2>
                <div style={styles.card}>
                  <InteractiveLatihan />
                </div>
              </section>
            </>
          )}
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
  inlineCode: {
    backgroundColor: "#f0f0f0",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
  },
  infoBox: {
    backgroundColor: "#e7f3ff",
    borderLeft: "5px solid #306998",
    padding: "12px 15px",
    margin: "15px 0",
    borderRadius: "6px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    lineHeight: "1.8",
  },
  tableHeader: {
    backgroundColor: "#306998",
    color: "white",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
    verticalAlign: "top",
  },
  eksplorasiOption: {
    padding: "12px",
    borderRadius: "8px",
    transition: "all 0.2s",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  checkEksplorasiButton: {
    marginTop: "12px",
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  checkAllButton: {
    marginTop: "20px",
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    width: "100%",
  },
  lockMessage: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#cfe2ff",
    borderLeft: "5px solid #0d6efd",
    borderRadius: "8px",
    textAlign: "center",
    color: "#084298",
  },
};