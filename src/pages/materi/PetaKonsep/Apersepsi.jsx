import { useState } from "react";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function Apersepsi() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ========== STATE DRAG & DROP TIPE DATA ==========
  const [dragDropAnswers, setDragDropAnswers] = useState({
    "3.14": null,
    "True": null,
    "'Python'": null,
    "42": null,
  });
  const [dragDropFeedback, setDragDropFeedback] = useState("");
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
    setDragDropAnswers((prev) => ({ ...prev, [targetKey]: draggedItem }));
  };
  const checkDragDrop = () => {
    let allCorrect = true;
    for (const [target, expected] of Object.entries(correctMatches)) {
      if (dragDropAnswers[target] !== expected) allCorrect = false;
    }
    setDragDropFeedback(allCorrect ? "✅ Benar! Semua tipe data cocok." : "❌ Masih ada yang salah. Coba perbaiki.");
  };

  // ========== STATE PILIHAN GANDA OPERATOR ==========
  const [operatorAnswer, setOperatorAnswer] = useState(null);
  const [operatorFeedback, setOperatorFeedback] = useState("");
  const operatorQuestion = "Berapakah hasil dari 15 // 4 ?";
  const operatorOptions = ["3.75", "3", "4", "1", "Error"];
  const operatorCorrect = 1;
  const checkOperator = () => {
    if (operatorAnswer === null) {
      setOperatorFeedback("❌ Pilih jawaban terlebih dahulu!");
      return;
    }
    setOperatorFeedback(operatorAnswer === operatorCorrect ? "✅ Benar! // adalah pembagian bulat, 15 // 4 = 3." : "❌ Salah. Ingat: // floor division membulatkan ke bawah.");
  };

  // ========== STATE ISIAN INPUT/OUTPUT ==========
  const [ioAnswer, setIoAnswer] = useState("");
  const [ioFeedback, setIoFeedback] = useState("");
  const checkIO = () => {
    const jawaban = ioAnswer.trim().toLowerCase();
    setIoFeedback(jawaban === "int" || jawaban === "int()" ? "✅ Benar! int() mengubah string menjadi integer." : "❌ Salah. Gunakan fungsi int() untuk konversi.");
  };

  // ========== STATE PILIHAN GANDA FUNGSI ==========
  const [fungsiAnswer, setFungsiAnswer] = useState(null);
  const [fungsiFeedback, setFungsiFeedback] = useState("");
  const fungsiOptions = [
    "def kuadrat(x): return x*x",
    "function kuadrat(x) { return x*x }",
    "def kuadrat(x): x*x",
    "kuadrat(x) = x*x",
    "def kuadrat(x) -> x*x",
  ];
  const fungsiCorrect = 0;
  const checkFungsi = () => {
    if (fungsiAnswer === null) {
      setFungsiFeedback("❌ Pilih jawaban terlebih dahulu!");
      return;
    }
    setFungsiFeedback(fungsiAnswer === fungsiCorrect ? "✅ Benar! Itulah cara mendefinisikan fungsi dengan return." : "❌ Salah. Fungsi di Python diawali 'def' dan diakhiri 'return' untuk mengembalikan nilai.");
  };

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
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>APERSEPSI</h1>
          </div>

          {/* PENGANTAR */}
          <section style={styles.section}>
            <div style={styles.card}>
              <p style={styles.text}>
                Sebelum mempelajari <strong>List, Nested List, dan Dictionary</strong> dalam Struktur Data,
                mari kita segarkan kembali materi dasar pemrograman Python. Setiap bagian berisi penjelasan dan aktivitas interaktif.
              </p>
            </div>
          </section>

          {/* 1. VARIABEL & TIPE DATA */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>1. Variabel dan Tipe Data</h3>
              <p style={styles.text}>
                Variabel adalah wadah untuk menyimpan data. Setiap data memiliki tipe (type): 
                <code> int </code> (bilangan bulat), <code> float </code> (bilangan desimal), 
                <code> str </code> (teks), <code> bool </code> (True/False).
              </p>
              <pre style={styles.codeBlock}>
                {`x = 10       # integer
y = 3.14     # float
nama = "Andi" # string
status = True # boolean`}
              </pre>
              <p style={styles.text}>
                <strong>Aktivitas:</strong> Seret tipe data ke nilai yang sesuai.
              </p>
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
                    <div key={target} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, target)} style={styles.dropZone}>
                      <span style={styles.targetValue}>{target}</span>
                      <span style={styles.dropAnswer}>{dragDropAnswers[target] ? ` → ${dragDropAnswers[target]}` : " (kosong)"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button style={styles.smallButton} onClick={checkDragDrop}>Periksa Drag & Drop</button>
              {dragDropFeedback && <div style={styles.feedbackBox}>{dragDropFeedback}</div>}
            </div>
          </section>

          {/* 2. OPERATOR */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>2. Operator Aritmatika</h3>
              <p style={styles.text}>
                Operator digunakan untuk melakukan operasi matematika. Yang perlu diingat:
                <code> / </code> menghasilkan float, <code> // </code> pembagian bulat, <code> % </code> sisa bagi, <code> ** </code> pangkat.
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
              <p style={styles.text}>
                <strong>Aktivitas:</strong> {operatorQuestion}
              </p>
              <div style={styles.options}>
                {operatorOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setOperatorAnswer(idx)}
                    style={{
                      ...styles.option,
                      backgroundColor: operatorAnswer === idx ? "#2fa69a" : "#f9f9f9",
                      color: operatorAnswer === idx ? "white" : "#1f2937",
                    }}
                  >
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                  </div>
                ))}
              </div>
              <button style={styles.smallButton} onClick={checkOperator}>Periksa Jawaban</button>
              {operatorFeedback && <div style={styles.feedbackBox}>{operatorFeedback}</div>}
            </div>
          </section>

          {/* 3. INPUT / OUTPUT */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>3. Input dan Output</h3>
              <p style={styles.text}>
                <code>print()</code> menampilkan data ke layar. <code>input()</code> membaca masukan dari pengguna (selalu menghasilkan string). 
                Untuk bilangan, konversi dengan <code>int()</code> atau <code>float()</code>.
              </p>
              <pre style={styles.codeBlock}>
                {`nama = input("Nama: ")
print("Halo", nama)
umur = int(input("Umur: "))  # konversi ke integer`}
              </pre>
              <p style={styles.text}>
                <strong>Aktivitas:</strong> Lengkapi kode agar variabel <code>umur</code> bertipe integer.
              </p>
              <pre style={styles.codeBlock}>{`umur = ______(input("Umur: "))`}</pre>
              <input type="text" placeholder="Tulis fungsi yang tepat" value={ioAnswer} onChange={(e) => setIoAnswer(e.target.value)} style={styles.inputText} />
              <button style={styles.smallButton} onClick={checkIO}>Periksa Jawaban</button>
              {ioFeedback && <div style={styles.feedbackBox}>{ioFeedback}</div>}
            </div>
          </section>

          {/* 4. FUNGSI */}
          <section style={styles.section}>
            <div style={styles.card}>
              <h3 style={styles.subTitle}>4. Fungsi (def)</h3>
              <p style={styles.text}>
                Fungsi adalah blok kode yang dapat dipanggil berulang. Dibuat dengan keyword <code>def</code>, diikuti nama fungsi dan parameter.
                Gunakan <code>return</code> untuk mengembalikan nilai.
              </p>
              <pre style={styles.codeBlock}>
                {`def kuadrat(x):
    return x * x

print(kuadrat(5))  # Output: 25`}
              </pre>
              <p style={styles.text}>
                <strong>Aktivitas:</strong> Manakah definisi fungsi yang benar untuk menghitung kuadrat?
              </p>
              <div style={styles.options}>
                {fungsiOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setFungsiAnswer(idx)}
                    style={{
                      ...styles.option,
                      backgroundColor: fungsiAnswer === idx ? "#2fa69a" : "#f9f9f9",
                      color: fungsiAnswer === idx ? "white" : "#1f2937",
                    }}
                  >
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                  </div>
                ))}
              </div>
              <button style={styles.smallButton} onClick={checkFungsi}>Periksa Jawaban</button>
              {fungsiFeedback && <div style={styles.feedbackBox}>{fungsiFeedback}</div>}
            </div>
          </section>

          {/* PENUTUP */}
          <section style={styles.section}>
            {/* <div style={styles.card}>
              <p style={styles.text}>
                Setelah menyelesaikan semua aktivitas, Anda telah mengingat kembali materi prasyarat. 
                Sekarang Anda siap mempelajari List, Nested List, dan Dictionary. Selamat belajar!
              </p>
            </div> */}
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
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },
  subTitle: { marginTop: "0", marginBottom: "15px", color: "#306998", fontSize: "20px" },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "12px" },
  codeBlock: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "12px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflow: "auto",
    margin: "15px 0",
  },
  dragContainer: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "15px" },
  dragItems: { display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" },
  dragItem: {
    backgroundColor: "#306998",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "grab",
    userSelect: "none",
  },
  dropZones: { display: "flex", flexDirection: "column", gap: "10px" },
  dropZone: {
    backgroundColor: "#f0f0f0",
    border: "2px dashed #306998",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  targetValue: { fontWeight: "bold", fontFamily: "monospace" },
  dropAnswer: { color: "#306998", fontStyle: "italic" },
  options: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" },
  option: {
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #ddd",
  },
  smallButton: {
    backgroundColor: "#306998",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "8px",
  },
  inputText: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "8px",
    fontSize: "14px",
  },
  feedbackBox: {
    marginTop: "12px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    color: "#333",
  },
};