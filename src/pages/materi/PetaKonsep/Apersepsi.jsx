import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { db } from "../../../config/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function Apersepsi() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
    e.target.style.opacity = "0.5";
  };
  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
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
        ? "✓ Benar! Variabel harus diawali huruf atau underscore, tidak boleh angka di awal."
        : "✗ Salah. Perhatikan aturan penamaan variabel di Python."
    );
  };

  const [tipeNilaiAnswer, setTipeNilaiAnswer] = useState("");
  const [tipeNilaiFeedback, setTipeNilaiFeedback] = useState("");
  const checkTipeNilai = () => {
    const jawaban = tipeNilaiAnswer.trim().toLowerCase();
    if (jawaban === "int" || jawaban === "integer") {
      setTipeNilaiFeedback("✓ Benar! 5 adalah bilangan bulat (integer).");
    } else {
      setTipeNilaiFeedback("✗ Salah. Coba lagi. Tipe data dari 5 adalah integer (int).");
    }
  };

  // ==================== MATERI 2: OPERATOR ====================
  const [operatorAnswer, setOperatorAnswer] = useState(null);
  const [operatorFeedback, setOperatorFeedback] = useState("");
  const operatorOptions = ["3.75", "3", "4", "1", "Error"];
  const operatorCorrect = 1;
  const handleOperator = (idx) => {
    setOperatorAnswer(idx);
    setOperatorFeedback(
      idx === operatorCorrect
        ? "✓ Benar! // adalah pembagian bulat, 15 // 4 = 3."
        : "✗ Salah. Ingat: // floor division membulatkan ke bawah."
    );
  };

  const [modulusAnswer, setModulusAnswer] = useState(null);
  const [modulusFeedback, setModulusFeedback] = useState("");
  const modulusOptions = ["3", "1", "0", "3.33", "Error"];
  const modulusCorrect = 1;
  const handleModulus = (idx) => {
    setModulusAnswer(idx);
    setModulusFeedback(
      idx === modulusCorrect
        ? "✓ Benar! 10 % 3 = 1 (sisa bagi)."
        : "✗ Salah. Operator % menghasilkan sisa pembagian."
    );
  };

  const [pangkatAnswer, setPangkatAnswer] = useState("");
  const [pangkatFeedback, setPangkatFeedback] = useState("");
  const checkPangkat = () => {
    const jawaban = pangkatAnswer.trim();
    if (jawaban === "8") {
      setPangkatFeedback("✓ Benar! 2 ** 3 = 8.");
    } else {
      setPangkatFeedback("✗ Salah. Ingat: ** adalah operator pangkat. 2 pangkat 3 = 8.");
    }
  };

  // ==================== MATERI 3: INPUT / OUTPUT ====================
  const [ioAnswer, setIoAnswer] = useState("");
  const [ioFeedback, setIoFeedback] = useState("");
  const checkIO = () => {
    const jawaban = ioAnswer.trim().toLowerCase();
    if (jawaban === "int" || jawaban === "int()") {
      setIoFeedback("✓ Benar! int() mengubah string menjadi integer.");
    } else {
      setIoFeedback("✗ Salah. Gunakan fungsi int() untuk konversi ke integer.");
    }
  };

  const [outputAnswer, setOutputAnswer] = useState(null);
  const [outputFeedback, setOutputFeedback] = useState("");
  const outputOptions = ["input()", "print()", "output()", "display()", "write()"];
  const outputCorrect = 1;
  const handleOutput = (idx) => {
    setOutputAnswer(idx);
    setOutputFeedback(
      idx === outputCorrect
        ? "✓ Benar! print() digunakan untuk mencetak output."
        : "✗ Salah. Fungsi yang benar adalah print()."
    );
  };

  const [printVarAnswer, setPrintVarAnswer] = useState("");
  const [printVarFeedback, setPrintVarFeedback] = useState("");
  const checkPrintVar = () => {
    const jawaban = printVarAnswer.trim().toLowerCase();
    if (jawaban === "nama") {
      setPrintVarFeedback("✓ Benar! Variabel 'nama' akan dicetak setelah 'Halo'.");
    } else {
      setPrintVarFeedback("✗ Coba lagi. Variabel yang menyimpan input nama adalah 'nama'.");
    }
  };

  // Ambil userId dari localStorage
  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) {
      navigate("/loginregister");
      return;
    }
    setUserId(uid);
  }, [navigate]);

  // Cek apakah sudah pernah memberikan bonus (untuk mencegah double)
  const [bonusGiven, setBonusGiven] = useState(false);
  useEffect(() => {
    const already = localStorage.getItem("apersepsi_bonus_done");
    if (already === "true") setBonusGiven(true);
  }, []);

  // Fungsi untuk mengecek apakah semua aktivitas sudah dijawab dengan benar
  const isAllActivitiesCorrect = () => {
    if (!dragDropAllDone) return false;
    if (varPilihanAnswer !== varPilihanCorrect) return false;
    if (!tipeNilaiFeedback.startsWith("✓")) return false;
    if (operatorAnswer !== operatorCorrect) return false;
    if (modulusAnswer !== modulusCorrect) return false;
    if (!pangkatFeedback.startsWith("✓")) return false;
    if (!ioFeedback.startsWith("✓")) return false;
    if (outputAnswer !== outputCorrect) return false;
    if (!printVarFeedback.startsWith("✓")) return false;
    return true;
  };

  // Effect untuk memunculkan modal ketika semua aktivitas benar dan bonus belum diberikan
  useEffect(() => {
    if (!userId) return;
    if (bonusGiven) return;
    if (isAllActivitiesCorrect() && !showCompletionModal && !isProcessing) {
      setShowCompletionModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dragDropAllDone,
    varPilihanAnswer,
    tipeNilaiFeedback,
    operatorAnswer,
    modulusAnswer,
    pangkatFeedback,
    ioFeedback,
    outputAnswer,
    printVarFeedback,
    userId,
    bonusGiven,
    showCompletionModal,
    isProcessing,
  ]);

  // Fungsi untuk menangani konfirmasi dari modal
  const handleCompleteAndContinue = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Update progres belajar di Firestore
      const mahasiswaRef = doc(db, "mahasiswa", userId);
      await updateDoc(mahasiswaRef, {
        progres_belajar: increment(1)
      });

      // Tandai bonus sudah diberikan di localStorage
      localStorage.setItem("apersepsi_bonus_done", "true");
      setBonusGiven(true);
      setShowCompletionModal(false);

      // Navigasi ke halaman list pendahuluan
      navigate("/list/pendahuluanlist");
    } catch (error) {
      console.error("Gagal update progres:", error);
      alert("Terjadi kesalahan saat menyimpan progres. Silakan coba lagi.");
      setIsProcessing(false);
      setShowCompletionModal(false);
    }
  };

  // Animasi fade-in
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

          {/* MATERI 1: VARIABEL & TIPE DATA */}
          <section style={styles.section}>
            <div style={styles.materialCard} className="fade-in">
              <div style={styles.materialHeader}>
                <div style={styles.materialIcon}>1</div>
                <div style={styles.materialTitle}>Variabel dan Tipe Data</div>
              </div>
              <p style={styles.text}>
                Variabel adalah tempat menyimpan data. Setiap variabel memiliki <strong>tipe data</strong> yang menentukan nilai apa yang bisa disimpan.
              </p>
              <p style={styles.text}>
                <strong>Tipe data dasar di Python:</strong>
              </p>
              <ul style={styles.list}>
                <li><code>int</code> → bilangan bulat, contoh: <code>10</code>, <code>-5</code>, <code>0</code></li>
                <li><code>float</code> → bilangan desimal, contoh: <code>3.14</code>, <code>-0.5</code>, <code>2.0</code></li>
                <li><code>str</code> → teks (string), diapit kutip, contoh: <code>"Halo"</code>, <code>'Python'</code></li>
                <li><code>bool</code> → nilai kebenaran, hanya <code>True</code> atau <code>False</code></li>
              </ul>
              <pre style={styles.codeBlock}>
                {`x = 10       # integer
y = 3.14     # float
nama = "Andi" # string
status = True # boolean`}
              </pre>

              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>🎯 Aktivitas 1.1 - Cocokkan Tipe Data</div>
                <p style={styles.instruction}>Seret kotak tipe data (int, float, str, bool) ke nilai yang sesuai.</p>
                <div style={styles.dragContainer}>
                  <div style={styles.dragItems}>
                    {dragItems.map((item) => (
                      <div
                        key={item}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                        style={styles.dragItem}
                      >
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
                {dragDropAllDone && <div style={styles.successMsg}>✨ Semua cocok! Bagus.</div>}
              </div>

              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>🎯 Aktivitas 1.2 - Aturan Penulisan Variabel</div>
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

              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>🎯 Aktivitas 1.3 - Tipe Data dari Nilai</div>
                <p style={styles.instruction}>Tentukan tipe data dari nilai 5. Tulis jawaban dalam huruf kecil (contoh: int).</p>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Jawaban"
                    value={tipeNilaiAnswer}
                    onChange={(e) => setTipeNilaiAnswer(e.target.value)}
                    style={styles.inputText}
                  />
                  <button style={styles.checkButton} onClick={checkTipeNilai}>Periksa Jawaban</button>
                </div>
                {tipeNilaiFeedback && <div style={styles.feedback}>{tipeNilaiFeedback}</div>}
              </div>
            </div>
          </section>

          {/* MATERI 2: OPERATOR ARITMATIKA */}
          <section style={styles.section}>
            <div style={styles.materialCard} className="fade-in">
              <div style={styles.materialHeader}>
                <div style={styles.materialIcon}>2</div>
                <div style={styles.materialTitle}>Operator Aritmatika</div>
              </div>
              <p style={styles.text}>
                Operator aritmatika digunakan untuk melakukan operasi matematika pada angka. Berikut tabel operator yang umum digunakan:
              </p>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableHeader}>Operator</th>
                      <th style={styles.tableHeader}>Nama</th>
                      <th style={styles.tableHeader}>Contoh</th>
                      <th style={styles.tableHeader}>Hasil</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={styles.tableRow}><td style={styles.tableCell}><code>+</code></td><td style={styles.tableCell}>Penjumlahan</td><td style={styles.tableCell}><code>10 + 5</code></td><td style={styles.tableCell}>15</td></tr>
                    <tr style={styles.tableRow}><td style={styles.tableCell}><code>-</code></td><td style={styles.tableCell}>Pengurangan</td><td style={styles.tableCell}><code>10 - 5</code></td><td style={styles.tableCell}>5</td></tr>
                    <tr style={styles.tableRow}><td style={styles.tableCell}><code>*</code></td><td style={styles.tableCell}>Perkalian</td><td style={styles.tableCell}><code>10 * 5</code></td><td style={styles.tableCell}>50</td></tr>
                    <tr style={styles.tableRow}><td style={styles.tableCell}><code>/</code></td><td style={styles.tableCell}>Pembagian float</td><td style={styles.tableCell}><code>10 / 3</code></td><td style={styles.tableCell}>3.333...</td></tr>
                    <tr style={styles.tableRow}><td style={styles.tableCell}><code>//</code></td><td style={styles.tableCell}>Pembagian bulat</td><td style={styles.tableCell}><code>10 // 3</code></td><td style={styles.tableCell}>3</td></tr>
                    <tr style={styles.tableRow}><td style={styles.tableCell}><code>%</code></td><td style={styles.tableCell}>Sisa bagi (modulus)</td><td style={styles.tableCell}><code>10 % 3</code></td><td style={styles.tableCell}>1</td></tr>
                    <tr style={styles.tableRow}><td style={styles.tableCell}><code>**</code></td><td style={styles.tableCell}>Pangkat</td><td style={styles.tableCell}><code>2 ** 3</code></td><td style={styles.tableCell}>8</td></tr>
                  </tbody>
                </table>
              </div>

              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>🎯 Aktivitas 2.1 - Pembagian Bulat</div>
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

              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>🎯 Aktivitas 2.2 - Sisa Bagi (Modulus)</div>
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

              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>🎯 Aktivitas 2.3 - Operator Pangkat</div>
                <p style={styles.instruction}>Hitung hasil dari 2 ** 3, lalu tulis jawabannya (angka).</p>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Jawaban angka"
                    value={pangkatAnswer}
                    onChange={(e) => setPangkatAnswer(e.target.value)}
                    style={styles.inputText}
                  />
                  <button style={styles.checkButton} onClick={checkPangkat}>Periksa Jawaban</button>
                </div>
                {pangkatFeedback && <div style={styles.feedback}>{pangkatFeedback}</div>}
              </div>
            </div>
          </section>

          {/* MATERI 3: INPUT DAN OUTPUT */}
          <section style={styles.section}>
            <div style={styles.materialCard} className="fade-in">
              <div style={styles.materialHeader}>
                <div style={styles.materialIcon}>3</div>
                <div style={styles.materialTitle}>Input dan Output</div>
              </div>
              <p style={styles.text}>
                <strong>Output:</strong> Fungsi <code>print()</code> digunakan untuk menampilkan teks atau nilai ke layar. Contoh: <code>print("Halo Dunia")</code>
              </p>
              <p style={styles.text}>
                <strong>Input:</strong> Fungsi <code>input()</code> digunakan untuk membaca masukan dari pengguna. Hasilnya selalu berupa <strong>string</strong>. 
                Jika ingin menerima angka, konversi dengan <code>int()</code> atau <code>float()</code>.
              </p>
              <pre style={styles.codeBlock}>
                {`nama = input("Nama: ")
print("Halo", nama)
umur = int(input("Umur: "))  # konversi ke integer`}
              </pre>

              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>🎯 Aktivitas 3.1 - Konversi ke Integer</div>
                <p style={styles.instruction}>Lengkapi kode agar variabel umur bertipe integer: <code>umur = ______(input("Umur: "))</code></p>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Fungsi yang tepat"
                    value={ioAnswer}
                    onChange={(e) => setIoAnswer(e.target.value)}
                    style={styles.inputText}
                  />
                  <button style={styles.checkButton} onClick={checkIO}>Periksa Jawaban</button>
                </div>
                {ioFeedback && <div style={styles.feedback}>{ioFeedback}</div>}
              </div>

              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>🎯 Aktivitas 3.2 - Fungsi Output</div>
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

              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>🎯 Aktivitas 3.3 - Mencetak Variabel</div>
                <p style={styles.instruction}>Lengkapi kode berikut agar program mencetak "Halo Andi". Tulis variabel yang tepat.</p>
                <pre style={styles.codeBlockSmall}>{`nama = input("Nama: ")
print("Halo", ______)`}</pre>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Variabel yang tepat"
                    value={printVarAnswer}
                    onChange={(e) => setPrintVarAnswer(e.target.value)}
                    style={styles.inputText}
                  />
                  <button style={styles.checkButton} onClick={checkPrintVar}>Periksa Jawaban</button>
                </div>
                {printVarFeedback && <div style={styles.feedback}>{printVarFeedback}</div>}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL POP-UP */}
      {showCompletionModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <div style={modalStyles.modalHeader}>
              <div style={modalStyles.icon}>🎉</div>
              <h2 style={modalStyles.title}>Selamat!</h2>
            </div>
            <p style={modalStyles.message}>
              Anda telah menyelesaikan semua aktivitas Apersepsi dengan sempurna.
            </p>
            <p style={modalStyles.subMessage}>
              Progres belajar Anda akan bertambah dan Anda akan melanjutkan ke materi berikutnya.
            </p>
            <button 
              style={modalStyles.button} 
              onClick={handleCompleteAndContinue}
              disabled={isProcessing}
            >
              {isProcessing ? "Memproses..." : "OKE, Lanjutkan"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in-visible { opacity: 1; transform: translateY(0); }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
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
  headerTitle: { fontSize: "38px", fontWeight: "700", margin: "0", letterSpacing: "-0.5px" },
  section: { marginBottom: "20px" },
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
  text: { fontSize: "16px", lineHeight: "1.6", color: "#1e293b", marginBottom: "16px" },
  list: { marginLeft: "24px", marginBottom: "16px", lineHeight: "1.6", color: "#1e293b" },
  codeBlock: { background: "#0f172a", color: "#e2e8f0", padding: "16px", borderRadius: "20px", fontFamily: "monospace", fontSize: "14px", overflow: "auto", margin: "20px 0" },
  codeBlockSmall: { background: "#0f172a", color: "#e2e8f0", padding: "12px", borderRadius: "16px", fontFamily: "monospace", fontSize: "13px", margin: "12px 0" },
  tableWrapper: { overflowX: "auto", margin: "20px 0", borderRadius: "16px", border: "1px solid #e2e8f0" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" },
  tableHeaderRow: { backgroundColor: "#306998", color: "white" },
  tableHeader: { padding: "12px 16px", textAlign: "left", fontWeight: "600", fontSize: "14px" },
  tableRow: { borderBottom: "1px solid #e2e8f0" },
  tableCell: { padding: "12px 16px", fontSize: "14px", color: "#1e293b" },
  activityWrapper: { marginTop: "28px", padding: "16px", backgroundColor: "#fefce8", borderRadius: "20px", borderLeft: "6px solid #FFD43B", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" },
  activityTitle: { fontWeight: "700", fontSize: "18px", marginBottom: "8px", color: "#1e293b" },
  instruction: { fontSize: "14px", color: "#475569", marginBottom: "16px", fontStyle: "italic", fontWeight: "500" },
  dragContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  dragItems: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" },
  dragItem: {
    background: "#306998",
    color: "white",
    padding: "8px 20px",
    borderRadius: "40px",
    cursor: "grab",
    userSelect: "none",
    fontWeight: "500",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "opacity 0.2s",
    display: "inline-block",
  },
  dropZones: { display: "flex", flexDirection: "column", gap: "12px" },
  dropZone: {
    borderRadius: "20px",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s",
    borderWidth: "2px",
    borderStyle: "solid",
  },
  targetValue: { fontWeight: "bold", fontFamily: "monospace", fontSize: "16px" },
  dropAnswer: { color: "#306998", fontStyle: "italic" },
  options: { display: "flex", flexDirection: "column", gap: "12px" },
  option: { padding: "12px 20px", borderRadius: "20px", cursor: "pointer", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "500", transition: "all 0.2s" },
  inputGroup: { display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" },
  inputText: { flex: "1", padding: "12px 16px", borderRadius: "20px", border: "1px solid #cbd5e1", fontSize: "16px", fontFamily: "monospace" },
  checkButton: { background: "#306998", color: "white", border: "none", padding: "10px 24px", borderRadius: "40px", cursor: "pointer", fontWeight: "600", transition: "0.2s" },
  feedback: { marginTop: "12px", padding: "10px 16px", borderRadius: "16px", background: "#f1f5f9", borderLeft: "5px solid #306998", fontWeight: "500", color: "#1e293b" },
  successMsg: { marginTop: "12px", padding: "10px", background: "#d1fae5", borderRadius: "16px", color: "#065f46", textAlign: "center", fontWeight: "500" },
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease-out",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "32px",
    padding: "32px",
    width: "90%",
    maxWidth: "450px",
    textAlign: "center",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    animation: "slideUp 0.3s ease-out",
  },
  modalHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  icon: { fontSize: "56px", marginBottom: "8px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#1e293b", margin: 0 },
  message: { fontSize: "18px", color: "#334155", marginBottom: "12px", lineHeight: "1.5" },
  subMessage: { fontSize: "14px", color: "#64748b", marginBottom: "28px", lineHeight: "1.5" },
  button: {
    background: "linear-gradient(135deg, #306998, #2b4b8a)",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
};