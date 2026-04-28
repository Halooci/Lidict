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
        ? "Benar! Variabel harus diawali huruf atau underscore, tidak boleh angka di awal."
        : "Salah. Perhatikan aturan penamaan variabel di Python."
    );
  };

  // Isian tipe data - dengan tombol periksa
  const [tipeNilaiAnswer, setTipeNilaiAnswer] = useState("");
  const [tipeNilaiFeedback, setTipeNilaiFeedback] = useState("");
  const checkTipeNilai = () => {
    const jawaban = tipeNilaiAnswer.trim().toLowerCase();
    if (jawaban === "int" || jawaban === "integer") {
      setTipeNilaiFeedback("Benar! 5 adalah bilangan bulat (integer).");
    } else {
      setTipeNilaiFeedback("Salah. Coba lagi. Tipe data dari 5 adalah integer (int).");
    }
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
    if (jawaban === "8") {
      setPangkatFeedback("Benar! 2 ** 3 = 8.");
    } else {
      setPangkatFeedback("Salah. Ingat: ** adalah operator pangkat. 2 pangkat 3 = 8.");
    }
  };

  // ==================== MATERI 3: INPUT / OUTPUT ====================
  const [ioAnswer, setIoAnswer] = useState("");
  const [ioFeedback, setIoFeedback] = useState("");
  const checkIO = () => {
    const jawaban = ioAnswer.trim().toLowerCase();
    if (jawaban === "int" || jawaban === "int()") {
      setIoFeedback("Benar! int() mengubah string menjadi integer.");
    } else {
      setIoFeedback("Salah. Gunakan fungsi int() untuk konversi ke integer.");
    }
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
    if (jawaban === "nama") {
      setPrintVarFeedback("Benar! Variabel 'nama' akan dicetak setelah 'Halo'.");
    } else {
      setPrintVarFeedback("Coba lagi. Variabel yang menyimpan input nama adalah 'nama'.");
    }
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
            {/* <div style={styles.headerSub}>Bangun fondasi Anda sebelum melangkah lebih jauh</div> */}
          </div>

          {/* PEMANTIK VISUAL */}
          <section style={styles.section}>
            <div style={styles.heroCard} className="fade-in">
              <div style={styles.heroLeft}>
                <div style={styles.heroIcon}>🎒</div>
              </div>
              <div style={styles.heroRight}>
                <h3 style={styles.heroTitle}>Seperti perjalanan, kita butuh tas yang tepat</h3>
                <p style={styles.heroText}>
                  Menyimpan banyak data tanpa struktur akan berantakan. List, Nested List, dan Dictionary adalah "kompartemen" Python 
                  yang akan mengatur data Anda. Tapi sebelumnya, pastikan Anda menguasai dasar-dasarnya.
                </p>
                <div style={styles.heroBadge}>
                  <span>Variabel</span> <span>Tipe Data</span> <span>Operator</span> <span>Input/Output</span>
                </div>
              </div>
            </div>
          </section>

          {/* MATERI 1 */}
          <section style={styles.section}>
            <div style={styles.materialCard} className="fade-in">
              <div style={styles.materialHeader}>
                <div style={styles.materialIcon}>1</div>
                <div style={styles.materialTitle}>Variabel dan Tipe Data</div>
              </div>
              <p style={styles.text}>
                Variabel adalah wadah untuk menyimpan data. Tipe data dasar: int (bilangan bulat), float (bilangan desimal), str (teks), bool (True/False).
              </p>
              <pre style={styles.codeBlock}>
                {`x = 10       # integer
y = 3.14     # float
nama = "Andi" # string
status = True # boolean`}
              </pre>

              {/* Drag & Drop */}
              <div style={styles.activity}>
                <div style={styles.activityTitle}>Aktivitas 1.1 - Cocokkan Tipe Data</div>
                <p style={styles.instruction}>Seret kotak tipe data (int, float, str, bool) ke nilai yang sesuai.</p>
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
                          backgroundColor: dragDropStatus[target] ? "#d1fae5" : "#f8fafc",
                          borderColor: dragDropStatus[target] ? "#10b981" : "#306998",
                        }}
                      >
                        <span style={styles.targetValue}>{target}</span>
                        <span style={styles.dropAnswer}>
                          {dragDropAnswers[target] ? ` → ${dragDropAnswers[target]}` : " (kosong)"}
                          {dragDropStatus[target] && " ✓"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {dragDropAllDone && <div style={styles.successMsg}>Semua cocok! Bagus.</div>}
              </div>

              {/* Pilihan Ganda */}
              <div style={styles.activity}>
                <div style={styles.activityTitle}>Aktivitas 1.2 - Aturan Penulisan Variabel</div>
                <p style={styles.instruction}>Pilih satu jawaban yang paling benar.</p>
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
                {varPilihanFeedback && <div style={styles.feedback}>{varPilihanFeedback}</div>}
              </div>

              {/* Isian tipe data */}
              <div style={styles.activity}>
                <div style={styles.activityTitle}>Aktivitas 1.3 - Tipe Data dari Nilai</div>
                <p style={styles.instruction}>Tentukan tipe data dari nilai 5. Tulis jawaban dalam huruf kecil (contoh: int).</p>
                <input
                  type="text"
                  placeholder="Jawaban"
                  value={tipeNilaiAnswer}
                  onChange={(e) => setTipeNilaiAnswer(e.target.value)}
                  style={styles.inputText}
                />
                <button style={styles.checkButton} onClick={checkTipeNilai}>Periksa Jawaban</button>
                {tipeNilaiFeedback && <div style={styles.feedback}>{tipeNilaiFeedback}</div>}
              </div>
            </div>
          </section>

          {/* MATERI 2 */}
          <section style={styles.section}>
            <div style={styles.materialCard} className="fade-in">
              <div style={styles.materialHeader}>
                <div style={styles.materialIcon}>2</div>
                <div style={styles.materialTitle}>Operator Aritmatika</div>
              </div>
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

              <div style={styles.activity}>
                <div style={styles.activityTitle}>Aktivitas 2.1 - Pembagian Bulat</div>
                <p style={styles.instruction}>Pilih hasil dari 15 // 4 (pembagian bulat).</p>
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
                {operatorFeedback && <div style={styles.feedback}>{operatorFeedback}</div>}
              </div>

              <div style={styles.activity}>
                <div style={styles.activityTitle}>Aktivitas 2.2 - Sisa Bagi (Modulus)</div>
                <p style={styles.instruction}>Pilih hasil dari 10 % 3 (sisa bagi).</p>
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
                {modulusFeedback && <div style={styles.feedback}>{modulusFeedback}</div>}
              </div>

              <div style={styles.activity}>
                <div style={styles.activityTitle}>Aktivitas 2.3 - Operator Pangkat</div>
                <p style={styles.instruction}>Hitung hasil dari 2 ** 3, lalu tulis jawabannya (angka).</p>
                <input
                  type="text"
                  placeholder="Jawaban angka"
                  value={pangkatAnswer}
                  onChange={(e) => setPangkatAnswer(e.target.value)}
                  style={styles.inputText}
                />
                <button style={styles.checkButton} onClick={checkPangkat}>Periksa Jawaban</button>
                {pangkatFeedback && <div style={styles.feedback}>{pangkatFeedback}</div>}
              </div>
            </div>
          </section>

          {/* MATERI 3 */}
          <section style={styles.section}>
            <div style={styles.materialCard} className="fade-in">
              <div style={styles.materialHeader}>
                <div style={styles.materialIcon}>3</div>
                <div style={styles.materialTitle}>Input dan Output</div>
              </div>
              <p style={styles.text}>
                print() untuk menampilkan data. input() untuk menerima masukan (selalu menghasilkan string). Konversi ke integer/float menggunakan int() atau float().
              </p>
              <pre style={styles.codeBlock}>
                {`nama = input("Nama: ")
print("Halo", nama)
umur = int(input("Umur: "))  # konversi ke integer`}
              </pre>

              <div style={styles.activity}>
                <div style={styles.activityTitle}>Aktivitas 3.1 - Konversi ke Integer</div>
                <p style={styles.instruction}>Lengkapi kode agar variabel umur bertipe integer: <code>umur = ______(input("Umur: "))</code></p>
                <input
                  type="text"
                  placeholder="Tulis fungsi yang tepat"
                  value={ioAnswer}
                  onChange={(e) => setIoAnswer(e.target.value)}
                  style={styles.inputText}
                />
                <button style={styles.checkButton} onClick={checkIO}>Periksa Jawaban</button>
                {ioFeedback && <div style={styles.feedback}>{ioFeedback}</div>}
              </div>

              <div style={styles.activity}>
                <div style={styles.activityTitle}>Aktivitas 3.2 - Fungsi Output</div>
                <p style={styles.instruction}>Pilih fungsi yang benar untuk menampilkan teks ke layar.</p>
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
                {outputFeedback && <div style={styles.feedback}>{outputFeedback}</div>}
              </div>

              <div style={styles.activity}>
                <div style={styles.activityTitle}>Aktivitas 3.3 - Mencetak Variabel</div>
                <p style={styles.instruction}>Lengkapi kode berikut agar program mencetak "Halo Andi". Tulis variabel yang tepat.</p>
                <pre style={styles.codeBlockSmall}>{`nama = input("Nama: ")
print("Halo", ______)`}</pre>
                <input
                  type="text"
                  placeholder="Variabel yang tepat"
                  value={printVarAnswer}
                  onChange={(e) => setPrintVarAnswer(e.target.value)}
                  style={styles.inputText}
                />
                <button style={styles.checkButton} onClick={checkPrintVar}>Periksa Jawaban</button>
                {printVarFeedback && <div style={styles.feedback}>{printVarFeedback}</div>}
              </div>
            </div>
          </section>

          {/* <section style={styles.section}>
            <div style={styles.closingCard} className="fade-in">
              <div style={styles.closingIcon}>🏁</div>
              <p style={styles.closingText}>Selamat! Sekarang fondasi Anda lebih kuat. Saatnya menjelajahi List, Nested List, dan Dictionary.</p>
            </div>
          </section> */}
        </div>
      </div>

      <style>{`
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in-visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </>
  );
}

const styles = {
  page: {
    padding: "30px 40px",
    backgroundColor: "#f1f5f9",
    minHeight: "calc(100vh - 64px)",
    fontFamily: "'Poppins', sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    background: "linear-gradient(145deg, #1e3c72, #2b4b8a)",
    borderRadius: "32px",
    padding: "32px 40px",
    marginBottom: "40px",
    textAlign: "center",
    color: "white",
    position: "relative",
    boxShadow: "0 20px 35px -10px rgba(0,0,0,0.2)",
  },
  headerAccent: {
    position: "absolute",
    bottom: "0",
    left: "10%",
    width: "80%",
    height: "6px",
    background: "#FFD43B",
    borderRadius: "3px",
  },
  headerTitle: { fontSize: "38px", fontWeight: "700", margin: "0 0 8px 0", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "18px", opacity: "0.9", fontWeight: "500" },
  heroCard: {
    background: "linear-gradient(135deg, #ffffff, #fef9e3)",
    borderRadius: "32px",
    padding: "30px",
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    boxShadow: "0 15px 30px -10px rgba(0,0,0,0.1)",
    marginBottom: "40px",
  },
  heroLeft: { flex: "0 0 80px", display: "flex", alignItems: "center", justifyContent: "center" },
  heroIcon: { fontSize: "64px" },
  heroRight: { flex: "1" },
  heroTitle: { fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" },
  heroText: { fontSize: "18px", lineHeight: "1.5", color: "#334155", marginBottom: "20px" },
  heroBadge: { display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "14px", marginTop: "12px" },
  materialCard: {
    background: "white",
    borderRadius: "28px",
    padding: "28px",
    marginBottom: "30px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  materialHeader: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" },
  materialIcon: {
    background: "#eef2ff",
    width: "48px",
    height: "48px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#306998",
  },
  materialTitle: { fontSize: "24px", fontWeight: "700", color: "#0f172a" },
  text: { fontSize: "16px", lineHeight: "1.6", color: "#334155", marginBottom: "16px" },
  codeBlock: { background: "#0f172a", color: "#e2e8f0", padding: "16px", borderRadius: "20px", fontFamily: "monospace", fontSize: "14px", overflow: "auto", margin: "20px 0" },
  codeBlockSmall: { background: "#0f172a", color: "#e2e8f0", padding: "12px", borderRadius: "16px", fontFamily: "monospace", fontSize: "13px", margin: "12px 0" },
  activity: { marginTop: "28px", paddingTop: "20px", borderTop: "1px dashed #cbd5e1" },
  activityTitle: { fontWeight: "600", fontSize: "18px", marginBottom: "8px", color: "#2c3e50" },
  instruction: { fontSize: "14px", color: "#475569", marginBottom: "16px", fontStyle: "italic" },
  dragContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  dragItems: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" },
  dragItem: { background: "#306998", color: "white", padding: "8px 20px", borderRadius: "40px", cursor: "grab", userSelect: "none", fontWeight: "500", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  dropZones: { display: "flex", flexDirection: "column", gap: "12px" },
  dropZone: { background: "#f8fafc", border: "2px dashed #306998", borderRadius: "20px", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  targetValue: { fontWeight: "bold", fontFamily: "monospace", fontSize: "16px" },
  dropAnswer: { color: "#306998", fontStyle: "italic" },
  options: { display: "flex", flexDirection: "column", gap: "12px" },
  option: { padding: "12px 20px", borderRadius: "20px", cursor: "pointer", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "500", transition: "all 0.2s" },
  inputText: { width: "100%", padding: "12px 16px", borderRadius: "20px", border: "1px solid #cbd5e1", fontSize: "16px", marginBottom: "12px", fontFamily: "monospace" },
  checkButton: { background: "#306998", color: "white", border: "none", padding: "10px 24px", borderRadius: "40px", cursor: "pointer", fontWeight: "600", marginTop: "4px", transition: "0.2s" },
  feedback: { marginTop: "12px", padding: "10px 16px", borderRadius: "16px", background: "#f1f5f9", borderLeft: "5px solid #306998", fontWeight: "500" },
  successMsg: { marginTop: "12px", padding: "10px", background: "#d1fae5", borderRadius: "16px", color: "#065f46", textAlign: "center" },
  closingCard: { background: "linear-gradient(120deg, #1e293b, #0f172a)", borderRadius: "32px", padding: "32px", textAlign: "center", color: "white" },
  closingIcon: { fontSize: "48px", marginBottom: "16px" },
  closingText: { fontSize: "20px", fontWeight: "500", lineHeight: "1.4" },
};