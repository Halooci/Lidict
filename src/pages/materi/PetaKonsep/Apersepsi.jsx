import { useState, useEffect } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function Apersepsi() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ==================== MATERI 1: VARIABEL & TIPE DATA ====================
  const [dragDropAnswers, setDragDropAnswers] = useState({
    "3.14": null,
    "True": null,
    "'Python'": null,
    "42": null,
  });
  const [dragDropStatus, setDragDropStatus] = useState({
    "3.14": false,
    "True": false,
    "'Python'": false,
    "42": false,
  });
  const [dragDropAllDone, setDragDropAllDone] = useState(false);
  const dragItems = ["int", "float", "str", "bool"];
  const targets = ["3.14", "True", "'Python'", "42"];
  const correctMatches = {
    "3.14": "float",
    "True": "bool",
    "'Python'": "str",
    "42": "int",
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item);
    e.dataTransfer.effectAllowed = "copy";
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const handleDrop = (e, targetKey) => {
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData("text/plain");
    const newAnswers = { ...dragDropAnswers, [targetKey]: draggedItem };
    setDragDropAnswers(newAnswers);
    const newStatus = { ...dragDropStatus };
    let allCorrect = true;
    for (const [target, expected] of Object.entries(correctMatches)) {
      const isCorrect = newAnswers[target] === expected;
      newStatus[target] = isCorrect;
      if (!isCorrect) allCorrect = false;
    }
    setDragDropStatus(newStatus);
    setDragDropAllDone(allCorrect);
  };

  const [varPilihanAnswer, setVarPilihanAnswer] = useState(null);
  const [varPilihanFeedback, setVarPilihanFeedback] = useState("");
  const varPilihanQuestion = "Manakah penulisan variabel yang benar di Python?";
  const varPilihanOptions = [
    "1nama = 'Andi'",
    "nama = 'Andi'",
    "nama-siswa = 'Andi'",
    "def = 10",
    "nama siswa = 'Andi'"
  ];
  const varPilihanCorrect = 1;
  const handleVarPilihan = (idx) => {
    setVarPilihanAnswer(idx);
    setVarPilihanFeedback(
      idx === varPilihanCorrect
        ? "Benar! Variabel harus diawali huruf atau underscore, tidak boleh angka di awal atau mengandung spasi."
        : "Salah. Perhatikan aturan penamaan variabel di Python."
    );
  };

  const [tipeNilaiAnswer, setTipeNilaiAnswer] = useState("");
  const [tipeNilaiFeedback, setTipeNilaiFeedback] = useState("");
  const checkTipeNilai = () => {
    const jawaban = tipeNilaiAnswer.trim().toLowerCase();
    setTipeNilaiFeedback(
      jawaban === "int" || jawaban === "integer"
        ? "Benar! 5 adalah bilangan bulat (integer)."
        : "Coba lagi. 5 termasuk tipe data integer."
    );
  };

  // ==================== MATERI 2: OPERATOR ====================
  const [operatorAnswer, setOperatorAnswer] = useState(null);
  const [operatorFeedback, setOperatorFeedback] = useState("");
  const operatorQuestion = "Berapakah hasil dari 15 // 4 ?";
  const operatorOptions = ["3.75", "3", "4", "1", "Error"];
  const operatorCorrect = 1;
  const handleOperator = (idx) => {
    setOperatorAnswer(idx);
    setOperatorFeedback(
      idx === operatorCorrect
        ? "Benar! // adalah pembagian bulat, 15 // 4 = 3."
        : "Salah. Ingat: // floor division membulatkan ke bawah."
    );
  };

  const [modulusAnswer, setModulusAnswer] = useState(null);
  const [modulusFeedback, setModulusFeedback] = useState("");
  const modulusQuestion = "Hasil dari 10 % 3 adalah ...";
  const modulusOptions = ["3", "1", "0", "3.33", "Error"];
  const modulusCorrect = 1;
  const handleModulus = (idx) => {
    setModulusAnswer(idx);
    setModulusFeedback(
      idx === modulusCorrect
        ? "Benar! 10 % 3 = 1 (sisa bagi)."
        : "Salah. Operator % menghasilkan sisa pembagian."
    );
  };

  const [pangkatAnswer, setPangkatAnswer] = useState("");
  const [pangkatFeedback, setPangkatFeedback] = useState("");
  const checkPangkat = () => {
    const jawaban = pangkatAnswer.trim();
    setPangkatFeedback(
      jawaban === "8"
        ? "Benar! 2 ** 3 = 8."
        : "Salah. ** adalah operator pangkat. 2 pangkat 3 = 8."
    );
  };

  // ==================== MATERI 3: INPUT / OUTPUT ====================
  const [ioAnswer, setIoAnswer] = useState("");
  const [ioFeedback, setIoFeedback] = useState("");
  const checkIO = () => {
    const jawaban = ioAnswer.trim().toLowerCase();
    setIoFeedback(
      jawaban === "int" || jawaban === "int()"
        ? "Benar! int() mengubah string menjadi integer."
        : "Salah. Gunakan fungsi int() untuk konversi ke integer."
    );
  };

  const [outputAnswer, setOutputAnswer] = useState(null);
  const [outputFeedback, setOutputFeedback] = useState("");
  const outputQuestion = "Fungsi untuk menampilkan teks ke layar adalah ...";
  const outputOptions = ["input()", "print()", "output()", "display()", "write()"];
  const outputCorrect = 1;
  const handleOutput = (idx) => {
    setOutputAnswer(idx);
    setOutputFeedback(
      idx === outputCorrect
        ? "Benar! print() digunakan untuk mencetak output."
        : "Salah. Fungsi yang benar adalah print()."
    );
  };

  const [printVarAnswer, setPrintVarAnswer] = useState("");
  const [printVarFeedback, setPrintVarFeedback] = useState("");
  const checkPrintVar = () => {
    const jawaban = printVarAnswer.trim().toLowerCase();
    setPrintVarFeedback(
      jawaban === "nama"
        ? "Benar! Variabel 'nama' akan dicetak setelah 'Halo'."
        : "Coba lagi. Variabel yang berisi input nama adalah 'nama'."
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("fade-in-visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <SidebarMateri isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div
        style={{
          marginLeft: isSidebarOpen ? "280px" : "0",
          transition: "margin-left 0.3s ease",
          paddingTop: "64px",
          minHeight: "100vh",
          width: "auto",
        }}
      >
        <div style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>APERSEPSI</h1>
          </div>

          {/* PERTANYAAN PEMANTIK YANG MENARIK */}
          <section style={styles.section}>
            <div style={styles.card} className="fade-in">
              <h3 style={styles.subTitle}>Mari Berpikir Sejenak</h3>
              <p style={styles.text}>
                Bayangkan Anda sedang merencanakan perjalanan jauh. Anda perlu membawa banyak barang: pakaian, perlengkapan mandi, makanan ringan, dan dokumen penting. 
                Jika Anda hanya menggunakan satu tas kecil, barang-barang akan berantakan dan sulit ditemukan. Namun, jika Anda memiliki tas ransel dengan kompartemen-kompartemen berbeda, 
                Anda dapat mengatur barang sesuai kategorinya. Begitu pula dalam pemrograman: ketika kita perlu menyimpan dan mengelola banyak data yang saling terkait, 
                kita memerlukan struktur data yang tepat seperti <strong>list</strong>, <strong>nested list</strong>, atau <strong>dictionary</strong>.
              </p>
              <p style={styles.text}>
                Namun, sebelum kita melangkah lebih jauh, ada baiknya kita mengingat kembali <strong>pondasi dasar</strong> yang akan sangat membantu: 
                bagaimana cara kita menyimpan nilai (variabel), apa saja jenis data yang bisa disimpan (tipe data), bagaimana melakukan perhitungan (operator), 
                dan bagaimana berinteraksi dengan pengguna (input-output). Tanpa pemahaman yang kuat tentang hal-hal tersebut, akan sulit bagi kita untuk mengatur data-data kompleks nantinya.
              </p>
              <div style={styles.explanationBox}>
                <p style={styles.text}>
                  <strong>Yuk, kita segarkan kembali:</strong> Ikuti aktivitas-aktivitas interaktif di bawah ini tentang variabel & tipe data, operator aritmatika, serta input-output. 
                  Setelah ini, Anda akan lebih siap menjelajahi struktur data yang lebih kaya.
                </p>
              </div>
            </div>
          </section>

          {/* MATERI 1: VARIABEL & TIPE DATA */}
          <section style={styles.section}>
            <div style={styles.card} className="fade-in">
              <h3 style={styles.subTitle}>1. Variabel dan Tipe Data</h3>
              <p style={styles.text}>
                Variabel adalah wadah untuk menyimpan data. Tipe data dasar: int (bilangan bulat), float (bilangan desimal), str (teks), bool (True/False).
              </p>
              <pre style={styles.codeBlock}>
                {`x = 10       # integer
y = 3.14     # float
nama = "Andi" # string
status = True # boolean`}
              </pre>

              <p style={styles.text}><strong>Aktivitas 1.1:</strong> Seret tipe data ke nilai yang sesuai.</p>
              <div style={styles.dragContainer}>
                <div style={styles.dragItems}>
                  {dragItems.map((item) => (
                    <div key={item} draggable onDragStart={(e) => handleDragStart(e, item)} style={styles.dragItem}>
                      {item}
                    </div>
                  ))}
                </div>
                <div style={styles.dropZones}>
                  {targets.map((target) => (
                    <div
                      key={target}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, target)}
                      style={{
                        ...styles.dropZone,
                        backgroundColor: dragDropStatus[target] ? "#e6f7ec" : "#f8fafc",
                        borderColor: dragDropStatus[target] ? "#28a745" : "#306998",
                      }}
                    >
                      <span style={styles.targetValue}>{target}</span>
                      <span style={styles.dropAnswer}>
                        {dragDropAnswers[target] ? ` → ${dragDropAnswers[target]}` : " (kosong)"}
                        {dragDropStatus[target] && " ✓"}
                        {dragDropAnswers[target] && !dragDropStatus[target] && " ✗"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {dragDropAllDone && <div style={{ ...styles.feedbackBox, backgroundColor: "#d4edda", color: "#155724" }}>Semua benar! Selamat.</div>}

              <p style={styles.text}><strong>Aktivitas 1.2:</strong> {varPilihanQuestion}</p>
              <div style={styles.options}>
                {varPilihanOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleVarPilihan(idx)}
                    style={{
                      ...styles.option,
                      backgroundColor: varPilihanAnswer === idx ? "#2fa69a" : "#fff",
                      color: varPilihanAnswer === idx ? "white" : "#1f2937",
                    }}
                  >
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                  </div>
                ))}
              </div>
              {varPilihanFeedback && <div style={styles.feedbackBox}>{varPilihanFeedback}</div>}

              <p style={styles.text}><strong>Aktivitas 1.3:</strong> Tentukan tipe data dari nilai <code>5</code> (tulis dalam huruf kecil).</p>
              <input
                type="text"
                placeholder="Jawaban"
                value={tipeNilaiAnswer}
                onChange={(e) => setTipeNilaiAnswer(e.target.value)}
                onBlur={checkTipeNilai}
                style={styles.inputText}
              />
              {tipeNilaiFeedback && <div style={styles.feedbackBox}>{tipeNilaiFeedback}</div>}
            </div>
          </section>

          {/* MATERI 2: OPERATOR */}
          <section style={styles.section}>
            <div style={styles.card} className="fade-in">
              <h3 style={styles.subTitle}>2. Operator Aritmatika</h3>
              <p style={styles.text}>
                Operator dasar: + (tambah), - (kurang), * (kali), / (bagi float), // (bagi bulat), % (sisa bagi), ** (pangkat).
              </p>
              <pre style={styles.codeBlock}>
                {`+   penjumlahan
-   pengurangan
*   perkalian
/   pembagian float
//  pembagian bulat
%   sisa bagi
**  pangkat`}
              </pre>

              <p style={styles.text}><strong>Aktivitas 2.1:</strong> {operatorQuestion}</p>
              <div style={styles.options}>
                {operatorOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOperator(idx)}
                    style={{
                      ...styles.option,
                      backgroundColor: operatorAnswer === idx ? "#2fa69a" : "#fff",
                      color: operatorAnswer === idx ? "white" : "#1f2937",
                    }}
                  >
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                  </div>
                ))}
              </div>
              {operatorFeedback && <div style={styles.feedbackBox}>{operatorFeedback}</div>}

              <p style={styles.text}><strong>Aktivitas 2.2:</strong> {modulusQuestion}</p>
              <div style={styles.options}>
                {modulusOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleModulus(idx)}
                    style={{
                      ...styles.option,
                      backgroundColor: modulusAnswer === idx ? "#2fa69a" : "#fff",
                      color: modulusAnswer === idx ? "white" : "#1f2937",
                    }}
                  >
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                  </div>
                ))}
              </div>
              {modulusFeedback && <div style={styles.feedbackBox}>{modulusFeedback}</div>}

              <p style={styles.text}><strong>Aktivitas 2.3:</strong> Hasil dari <code>2 ** 3</code> adalah ...</p>
              <input
                type="text"
                placeholder="Jawaban angka"
                value={pangkatAnswer}
                onChange={(e) => setPangkatAnswer(e.target.value)}
                onBlur={checkPangkat}
                style={styles.inputText}
              />
              {pangkatFeedback && <div style={styles.feedbackBox}>{pangkatFeedback}</div>}
            </div>
          </section>

          {/* MATERI 3: INPUT / OUTPUT */}
          <section style={styles.section}>
            <div style={styles.card} className="fade-in">
              <h3 style={styles.subTitle}>3. Input dan Output</h3>
              <p style={styles.text}>
                <code>print()</code> digunakan untuk menampilkan data. <code>input()</code> untuk menerima masukan (selalu menghasilkan string). Konversi ke integer/float menggunakan <code>int()</code> atau <code>float()</code>.
              </p>
              <pre style={styles.codeBlock}>
                {`nama = input("Nama: ")
print("Halo", nama)
umur = int(input("Umur: "))  # konversi ke integer`}
              </pre>

              <p style={styles.text}><strong>Aktivitas 3.1:</strong> Lengkapi kode agar <code>umur</code> bertipe integer: <code>umur = ______(input("Umur: "))</code></p>
              <input
                type="text"
                placeholder="Fungsi yang tepat"
                value={ioAnswer}
                onChange={(e) => setIoAnswer(e.target.value)}
                onBlur={checkIO}
                style={styles.inputText}
              />
              {ioFeedback && <div style={styles.feedbackBox}>{ioFeedback}</div>}

              <p style={styles.text}><strong>Aktivitas 3.2:</strong> {outputQuestion}</p>
              <div style={styles.options}>
                {outputOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOutput(idx)}
                    style={{
                      ...styles.option,
                      backgroundColor: outputAnswer === idx ? "#2fa69a" : "#fff",
                      color: outputAnswer === idx ? "white" : "#1f2937",
                    }}
                  >
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                  </div>
                ))}
              </div>
              {outputFeedback && <div style={styles.feedbackBox}>{outputFeedback}</div>}

              <p style={styles.text}><strong>Aktivitas 3.3:</strong> Lengkapi kode agar program mencetak "Halo Andi":</p>
              <pre style={styles.codeBlock}>{`nama = input("Nama: ")
print("Halo", ______)`}</pre>
              <input
                type="text"
                placeholder="Variabel yang tepat"
                value={printVarAnswer}
                onChange={(e) => setPrintVarAnswer(e.target.value)}
                onBlur={checkPrintVar}
                style={styles.inputText}
              />
              {printVarFeedback && <div style={styles.feedbackBox}>{printVarFeedback}</div>}
            </div>
          </section>

          {/* PENUTUP */}
          <section style={styles.section}>
            <div style={styles.card} className="fade-in">
              <p style={styles.text}>
                Selamat! Anda telah menyelesaikan semua aktivitas. Sekarang fondasi Anda sudah lebih kokoh. 
                Mari lanjutkan ke materi inti tentang <strong>List, Nested List, dan Dictionary</strong>.
              </p>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}

/* ================== STYLE ================== */
const styles = {
  page: {
    padding: "30px 40px",
    backgroundColor: "#f5f7fa",
    minHeight: "calc(100vh - 64px)",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
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
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)",
    border: "1px solid #eef2f6",
  },
  subTitle: {
    marginTop: "0",
    marginBottom: "15px",
    color: "#306998",
    fontSize: "22px",
    fontWeight: "600",
  },
  text: { lineHeight: "1.8", color: "#334155", marginBottom: "12px" },
  explanationBox: {
    backgroundColor: "#f0f7ff",
    padding: "15px 20px",
    borderRadius: "12px",
    borderLeft: "4px solid #306998",
    marginTop: "10px",
  },
  codeBlock: {
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    padding: "16px",
    borderRadius: "12px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflow: "auto",
    margin: "15px 0",
    lineHeight: "1.5",
  },
  dragContainer: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "15px" },
  dragItems: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" },
  dragItem: {
    backgroundColor: "#306998",
    color: "white",
    padding: "8px 20px",
    borderRadius: "40px",
    cursor: "grab",
    userSelect: "none",
    fontWeight: "500",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  dropZones: { display: "flex", flexDirection: "column", gap: "12px" },
  dropZone: {
    backgroundColor: "#f8fafc",
    border: "2px dashed #306998",
    borderRadius: "12px",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s",
  },
  targetValue: { fontWeight: "bold", fontFamily: "monospace", fontSize: "16px", color: "#0f172a" },
  dropAnswer: { color: "#306998", fontStyle: "italic" },
  options: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" },
  option: {
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    fontWeight: "500",
  },
  inputText: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginTop: "8px",
    fontSize: "14px",
    fontFamily: "monospace",
  },
  feedbackBox: {
    marginTop: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    backgroundColor: "#f1f5f9",
    color: "#1e293b",
    borderLeft: "4px solid #306998",
    fontWeight: "500",
  },
};