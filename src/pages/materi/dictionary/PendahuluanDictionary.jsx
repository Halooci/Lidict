import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

// ===================== KOMPONEN LATIHAN INTERAKTIF (DENGAN LOCK PER SOAL) =====================
const InteractiveLatihan = () => {
  const [answers, setAnswers] = useState([null, null, null, null, null]);
  const [feedback, setFeedback] = useState(["", "", "", "", ""]);
  const [locked, setLocked] = useState([false, false, false, false, false]);
  const [globalError, setGlobalError] = useState("");

  const questions = [
    {
      text: "Struktur data yang digunakan untuk menyimpan pasangan key-value di Python adalah ...",
      options: ["List", "Tuple", "Dictionary", "Set", "Semua benar"],
      correct: 2,
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
      correct: 2,
    },
    {
      text: "Pernyataan yang BENAR tentang sifat dictionary di Python adalah ...",
      options: [
        "Dictionary bersifat immutable (tidak bisa diubah)",
        "Dictionary tidak mempertahankan urutan item",
        "Dictionary hanya bisa menyimpan satu tipe data",
        "Dictionary mempertahankan urutan item sesuai urutan penyisipan",
        "Key dalam dictionary boleh berupa list",
      ],
      correct: 3,
    },
    {
      text: "Tipe data berikut yang TIDAK bisa dijadikan key dalam dictionary adalah ...",
      options: ["String", "Integer", "List", "Tuple", "Float"],
      correct: 2,
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
      correct: 2,
    },
  ];

  const handleAnswerChange = (qIdx, optIdx) => {
    if (locked[qIdx]) return;
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
      setGlobalError("Anda harus menjawab semua soal terlebih dahulu!");
      return;
    }
    setGlobalError("");

    const newFeedback = answers.map((ans, idx) => {
      if (ans === questions[idx].correct) {
        return "Benar";
      } else {
        return "Salah. Coba lagi!";
      }
    });
    setFeedback(newFeedback);
    const newLocked = answers.map((ans, idx) => ans === questions[idx].correct);
    setLocked(newLocked);
  };

  const allCorrect = locked.every((v) => v === true);

  return (
    <div>
      {questions.map((q, idx) => (
        <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
          <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {q.options.map((opt, optIdx) => (
              <div
                key={optIdx}
                onClick={() => handleAnswerChange(idx, optIdx)}
                style={{
                  ...styles.eksplorasiOption,
                  backgroundColor: answers[idx] === optIdx ? "#2fa69a" : "#f9f9f9",
                  color: answers[idx] === optIdx ? "white" : "#1f2937",
                  cursor: locked[idx] ? "not-allowed" : "pointer",
                  opacity: locked[idx] ? 0.7 : 1,
                }}
              >
                <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
              </div>
            ))}
          </div>
          {feedback[idx] && (
            <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", backgroundColor: feedback[idx] === "Benar" ? "#d1e7dd" : "#f8d7da" }}>
              {feedback[idx] === "Benar" ? "✅ Benar" : "❌ Salah"}
            </div>
          )}
        </div>
      ))}
      {globalError && (
        <div style={{ marginTop: "10px", marginBottom: "15px", padding: "12px", borderRadius: "8px", backgroundColor: "#f8d7da", color: "#842029" }}>
          {globalError}
        </div>
      )}
      <button style={styles.checkAllButton} onClick={handleCheckAll} disabled={allCorrect}>
        {allCorrect ? "Semua Jawaban Benar" : "Periksa Semua Jawaban"}
      </button>
      {allCorrect && (
        <div style={{ marginTop: "15px", padding: "12px", borderRadius: "8px", backgroundColor: "#d1e7dd", color: "#0f5132", textAlign: "center" }}>
          🎉 Selamat! Semua jawaban Anda benar.
        </div>
      )}
    </div>
  );
};

// ===================== KOMPONEN VISUALISASI ANALOGI DICTIONARY =====================
const KamusAnalogiVisual = () => {
  const [selectedKey, setSelectedKey] = useState(null);

  const data = [
    { key: "apel", value: "merah" },
    { key: "pisang", value: "kuning" },
    { key: "anggur", value: "ungu" },
  ];

  return (
    <div style={{ margin: "20px 0", padding: "15px", backgroundColor: "#fef9e6", borderRadius: "12px", borderLeft: "5px solid #f4c542" }}>
      <p style={{ fontWeight: "bold", marginBottom: "15px", textAlign: "center" }}>Analogi Dictionary: Key → Value</p>
      <div style={{ display: "flex", gap: "30px", justifyContent: "center", flexWrap: "wrap" }}>
        {/* Kolom Key */}
        <div style={{ flex: 1, minWidth: "150px", backgroundColor: "#fff3cf", borderRadius: "10px", padding: "10px" }}>
          <p style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "#f4c542", padding: "8px", borderRadius: "8px", marginTop: 0 }}>Key (Kunci)</p>
          {data.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedKey(selectedKey === idx ? null : idx)}
              style={{
                padding: "12px",
                marginBottom: "10px",
                backgroundColor: selectedKey === idx ? "#306998" : "#ffffff",
                color: selectedKey === idx ? "white" : "#333",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "0.2s",
                textAlign: "center",
                fontWeight: "bold",
                border: selectedKey === idx ? "1px solid #FFD43B" : "1px solid #ddd",
              }}
            >
              {item.key}
            </div>
          ))}
        </div>
        {/* Kolom Value */}
        <div style={{ flex: 1, minWidth: "150px", backgroundColor: "#fff3cf", borderRadius: "10px", padding: "10px" }}>
          <p style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "#f4c542", padding: "8px", borderRadius: "8px", marginTop: 0 }}>Value (Nilai)</p>
          {selectedKey !== null ? (
            <div style={{ padding: "15px", backgroundColor: "#e8f1ff", borderRadius: "8px", minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold" }}>
              {data[selectedKey].value}
            </div>
          ) : (
            <div style={{ padding: "15px", backgroundColor: "#e9ecef", borderRadius: "8px", minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6c757d" }}>
              Klik key untuk melihat value
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: "15px", backgroundColor: "#e8f1ff", padding: "10px", borderRadius: "8px" }}>
        <strong>📌 Dalam Python:</strong>
        <pre style={{ backgroundColor: "#272822", color: "#f8f8f2", padding: "10px", borderRadius: "6px", overflow: "auto", fontSize: "13px", marginTop: "8px" }}>
{`warna = {"apel": "merah", "pisang": "kuning", "anggur": "ungu"}
print(warna["apel"])  # output: merah`}
        </pre>
      </div>
      <p style={{ fontSize: "13px", marginTop: "15px", textAlign: "center", color: "#555" }}>
        💡 Klik pada key (apel, pisang, atau anggur) → value (warna) akan muncul. Ini simulasi cara dictionary bekerja.
      </p>
    </div>
  );
};

// ===================== KOMPONEN KARAKTERISTIK INTERAKTIF =====================
const KarakteristikList = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const karakteristik = [
    {
      judul: "Key unik",
      penjelasan: "Tidak boleh ada dua key yang sama. Jika kamu menuliskan key yang sama lagi, nilai sebelumnya akan tertimpa. Ini seperti di kamus: satu kata hanya punya satu arti."
    },
    {
      judul: "Key harus immutable (tidak bisa diubah)",
      penjelasan: "Key hanya boleh menggunakan tipe data yang nilainya tetap setelah dibuat. Contoh key yang boleh: string (\"nama\"), integer (10), tuple ((\"x\", \"y\")). Mengapa list tidak bisa dijadikan key? Karena list bersifat mutable (bisa diubah-ubah isinya). Jika list dijadikan key lalu isinya diubah, maka dictionary akan bingung karena key-nya berubah."
    },
    {
      judul: "Value boleh mutable (bisa diubah)",
      penjelasan: "Berbeda dengan key, nilai (value) dalam dictionary bisa berupa tipe data apa pun, termasuk yang mutable seperti list atau dictionary lain. Kamu bisa mengubah isi value kapan saja."
    },
    {
      judul: "Dictionary itu sendiri mutable",
      penjelasan: "Kamu bisa menambah, mengubah, atau menghapus pasangan key-value setelah dictionary dibuat. Ukuran dictionary otomatis menyesuaikan."
    },
    {
      judul: "Urutan item terjaga sesuai urutan penyisipan",
      penjelasan: "Dictionary 'mengingat' urutan saat kamu memasukkan item. Misalnya kamu tambah key 'nama' dulu, lalu 'umur', maka saat dilihat atau diiterasi, urutannya tetap 'nama' dulu baru 'umur'."
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
      {karakteristik.map((item, idx) => (
        <div key={idx} style={{ border: "1px solid #306998", borderRadius: "10px", overflow: "hidden", transition: "0.2s" }}>
          <div
            onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
            style={{
              padding: "15px",
              backgroundColor: activeIndex === idx ? "#306998" : "#f0f6ff",
              color: activeIndex === idx ? "white" : "#306998",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>{item.judul}</span>
            <span style={{ fontSize: "18px" }}>{activeIndex === idx ? "▲" : "▼"}</span>
          </div>
          {activeIndex === idx && (
            <div style={{ padding: "15px", backgroundColor: "#ffffff", borderTop: "1px solid #306998", lineHeight: "1.6" }}>
              {item.penjelasan}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
export default function PendahuluanDictionary() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // EKSPLORASI
  const [eksplorasiSelected, setEksplorasiSelected] = useState([null, null, null]);
  const [eksplorasiFeedback, setEksplorasiFeedback] = useState(["", "", ""]);
  const [eksplorasiHasAnswered, setEksplorasiHasAnswered] = useState([false, false, false]);
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
      text: "Sifat dictionary di Python yang benar adalah ...",
      options: [
        "Dictionary bersifat immutable (tidak bisa diubah)",
        "Dictionary tidak mempertahankan urutan item",
        "Dictionary bersifat mutable dan mempertahankan urutan item sesuai penyisipan",
        "Dictionary hanya bisa menyimpan data bertipe string",
        "Dictionary memiliki indeks numerik seperti list",
      ],
      correct: 2,
    },
  ];

  const handleEksplorasiSelect = (questionIdx, optionIdx) => {
    if (eksplorasiHasAnswered[questionIdx]) return;
    setEksplorasiSelected(prev => {
      const newSel = [...prev];
      newSel[questionIdx] = optionIdx;
      return newSel;
    });
    const isCorrect = optionIdx === eksplorasiQuestions[questionIdx].correct;
    setEksplorasiFeedback(prev => {
      const newFb = [...prev];
      newFb[questionIdx] = isCorrect ? "Benar" : "Salah";
      return newFb;
    });
    setEksplorasiHasAnswered(prev => {
      const newAns = [...prev];
      newAns[questionIdx] = true;
      return newAns;
    });
  };

  useEffect(() => {
    const allAnswered = eksplorasiHasAnswered.every(v => v === true);
    if (allAnswered && !isEksplorasiCompleted) {
      setIsEksplorasiCompleted(true);
    }
  }, [eksplorasiHasAnswered, isEksplorasiCompleted]);

  // Pyodide (tetap untuk kebutuhan lain)
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
      const escapedCode = code.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
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
      return `Error: ${error.message}`;
    }
  }, []);

  return (
    <>
      <Navbar />
      <SidebarMateri isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="main-content" style={{ marginLeft: isSidebarOpen ? "280px" : "0", transition: "margin-left 0.3s ease", paddingTop: "64px", minHeight: "100vh", width: "auto" }}>
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PENDAHULUAN DICTIONARY</h1>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Tujuan Pembelajaran</h2>
            <div style={styles.card}>
              <ul style={styles.list}>
                <li>Mahasiswa mampu memahami pengertian dan konsep dasar dictionary dalam Python.</li>
                <li>Mahasiswa mampu mengidentifikasi karakteristik dictionary.</li>
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Eksplorasi</h2>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum mempelajari lebih dalam, jawab pertanyaan berikut dengan memilih opsi yang tersedia.
                <strong style={{ color: "#0d6efd" }}> Materi akan terbuka setelah ketiga pertanyaan dijawab.</strong>
              </p>
              {eksplorasiQuestions.map((q, idx) => {
                const isAnswered = eksplorasiHasAnswered[idx];
                const selectedIdx = eksplorasiSelected[idx];
                return (
                  <div key={idx} style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px" }}>
                    <p style={{ fontWeight: "600", marginBottom: "12px" }}>{idx + 1}. {q.text}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {q.options.map((opt, optIdx) => {
                        let optionStyle = { ...styles.eksplorasiOption, cursor: "pointer" };
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
                          <div key={optIdx} onClick={() => !isAnswered && handleEksplorasiSelect(idx, optIdx)} style={optionStyle}>
                            <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </div>
                        );
                      })}
                    </div>
                    {eksplorasiFeedback[idx] && (
                      <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", backgroundColor: eksplorasiFeedback[idx] === "Benar" ? "#d1e7dd" : "#f8d7da", color: eksplorasiFeedback[idx] === "Benar" ? "#0f5132" : "#842029" }}>
                        {eksplorasiFeedback[idx] === "Benar" ? "✅ Benar" : "❌ Salah"}
                      </div>
                    )}
                  </div>
                );
              })}
              {!isEksplorasiCompleted && (
                <div style={styles.lockMessage}>🔒 Materi terkunci. Jawab semua pertanyaan di atas untuk membuka materi.</div>
              )}
            </div>
          </section>

          {isEksplorasiCompleted && (
            <>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Apa Itu Dictionary?</h2>
                <div style={styles.card}>
                  <p style={styles.text}>
                    <strong>Dictionary</strong> adalah struktur data dalam Python yang digunakan untuk menyimpan kumpulan data dalam
                    bentuk <strong>pasangan key (kunci) dan value (nilai)</strong>. Setiap key bersifat unik dan digunakan untuk mengakses
                    nilai yang terkait. Dictionary bersifat <strong>mutable</strong> (dapat diubah) dan tidak memiliki
                    indeks numerik seperti list, melainkan menggunakan key sebagai pengganti indeks.
                  </p>
                  <p style={styles.text}>
                    Dictionary didefinisikan dengan kurung kurawal <code style={styles.inlineCode}>{`{}`}</code> dan setiap
                    pasangan key-value dipisahkan oleh titik dua <code style={styles.inlineCode}>:</code>. Key harus berupa
                    tipe data yang immutable (string, integer, tuple), sedangkan value dapat berupa tipe data apa pun (list, dictionary lain,
                    fungsi, dll).
                  </p>
                  <div style={styles.infoBox}>
                    <strong>📖 Analogi:</strong> Seperti kamus, kita mencari arti (value) berdasarkan kata (key). Di bawah ini adalah simulasi interaktif:
                  </div>
                  <KamusAnalogiVisual />
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Karakteristik Dasar Dictionary</h2>
                <div style={styles.card}>
                  <KarakteristikList />
                  <div style={{ ...styles.infoBox, marginTop: "20px" }}>
                    <strong>💡 Ringkasan:</strong> Key = <strong>immutable</strong> (tidak boleh berubah), Value = <strong>bebas</strong> (bisa mutable atau immutable),
                    Dictionary = <strong>mutable</strong> (bisa diubah struktur dan isinya).
                  </div>
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Perbandingan Dictionary vs List</h2>
                <div style={styles.card}>
                  <p style={styles.text}>Agar lebih paham, mari bandingkan dictionary dengan list.</p>
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
                        <td style={styles.tableCell}>Menggunakan nomor urut (indeks): <code>data[0]</code>, <code>data[1]</code>, dst.</td>
                        <td style={styles.tableCell}>Menggunakan kunci (key): <code>data["nama"]</code>, <code>data["umur"]</code>.</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Urutan data</td>
                        <td style={styles.tableCell}>Urutan pasti sesuai indeks. Bisa dipotong (slice).</td>
                        <td style={styles.tableCell}>Urutan diingat sesuai urutan penyisipan (tidak bisa slice).</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Batasan “kunci”</td>
                        <td style={styles.tableCell}>Tidak ada konsep kunci, hanya indeks angka.</td>
                        <td style={styles.tableCell}>Key harus unik dan immutable (string, integer, tuple).</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={styles.infoBox}>
                    <strong>💡 Analogi sederhana:</strong> List seperti rak buku bernomor. Dictionary seperti lemari berlabel.
                  </div>
                </div>
              </section>

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