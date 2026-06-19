import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import { db } from "../../../config/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function Apersepsi() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ==================== MATERI 1: VARIABEL & TIPE DATA ====================
  // Drag & Drop
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
  const [dragDropFeedback, setDragDropFeedback] = useState("");
  const dragItems = ["integer", "float", "string", "boolean"];
  const targets = ["3.14", "True", "'Python'", "42"];
  const correctMatches = {
    "3.14": "float",
    "True": "boolean",
    "'Python'": "string",
    "42": "integer",
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
    // Update status
    const newStatus = { ...dragDropStatus };
    let allCorrect = true;
    for (const [target, expected] of Object.entries(correctMatches)) {
      const isCorrect = newAnswers[target] === expected;
      newStatus[target] = isCorrect;
      if (!isCorrect) allCorrect = false;
    }
    setDragDropStatus(newStatus);
    setDragDropAllDone(allCorrect);
    setDragDropFeedback("");
  };

  const checkDragDrop = () => {
    const newStatus = { ...dragDropStatus };
    let allCorrect = true;
    for (const [target, expected] of Object.entries(correctMatches)) {
      const isCorrect = dragDropAnswers[target] === expected;
      newStatus[target] = isCorrect;
      if (!isCorrect) allCorrect = false;
    }
    setDragDropStatus(newStatus);
    setDragDropAllDone(allCorrect);
    if (allCorrect) {
      setDragDropFeedback("✨ Semua cocok! Bagus.");
    } else {
      setDragDropFeedback("❌ Masih ada yang salah. Periksa kembali pasangan tipe data.");
    }
  };

  const resetDragDrop = () => {
    setDragDropAnswers({
      "3.14": null,
      "True": null,
      "'Python'": null,
      "42": null,
    });
    setDragDropStatus({
      "3.14": false,
      "True": false,
      "'Python'": false,
      "42": false,
    });
    setDragDropAllDone(false);
    setDragDropFeedback("");
  };

  // Aktivitas 1.2 - Pilihan Ganda Aturan Penulisan Variabel
  const [varPilihanSelected, setVarPilihanSelected] = useState(null);
  const [varPilihanFeedback, setVarPilihanFeedback] = useState("");
  const varPilihanOptions = [
    "1nama = 'Andi'",
    "nama = 'Andi'",
    "nama-siswa = 'Andi'",
    "def = 10",
    "nama siswa = 'Andi'"
  ];
  const varPilihanCorrect = 1; // indeks ke-1 (B)
  const checkVarPilihan = () => {
    if (varPilihanSelected === null) {
      setVarPilihanFeedback("❌ Silakan pilih salah satu opsi terlebih dahulu.");
      return;
    }
    if (varPilihanSelected === varPilihanCorrect) {
      setVarPilihanFeedback("✓ Benar! 'nama = \"Andi\"' adalah penulisan variabel yang benar. Variabel harus diawali huruf atau underscore, tidak boleh diawali angka, tidak boleh ada spasi, dan tidak boleh menggunakan kata kunci Python.");
    } else {
      let pesan = "";
      if (varPilihanSelected === 0) pesan = "✗ Salah. Variabel tidak boleh diawali angka.";
      else if (varPilihanSelected === 2) pesan = "✗ Salah. Tanda hubung (-) tidak diperbolehkan dalam nama variabel. Gunakan garis bawah (_).";
      else if (varPilihanSelected === 3) pesan = "✗ Salah. 'def' adalah kata kunci (keyword) Python, tidak bisa dijadikan nama variabel.";
      else if (varPilihanSelected === 4) pesan = "✗ Salah. Nama variabel tidak boleh mengandung spasi.";
      setVarPilihanFeedback(pesan);
    }
  };
  const resetVarPilihan = () => {
    setVarPilihanSelected(null);
    setVarPilihanFeedback("");
  };

  // Aktivitas 1.3 - Tipe Data dari Nilai
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
  const resetTipeNilai = () => {
    setTipeNilaiAnswer("");
    setTipeNilaiFeedback("");
  };

  // ==================== MATERI 2: OPERATOR ====================
  const [operatorAnswer, setOperatorAnswer] = useState(null);
  const [operatorFeedback, setOperatorFeedback] = useState("");
  const operatorOptions = ["3.75", "3", "4", "1", "Error"];
  const operatorCorrect = 1;
  const checkOperator = () => {
    if (operatorAnswer === null) {
      setOperatorFeedback("❌ Silakan pilih salah satu opsi.");
      return;
    }
    if (operatorAnswer === operatorCorrect) {
      setOperatorFeedback("✓ Benar! // adalah pembagian bulat, 15 // 4 = 3.");
    } else {
      setOperatorFeedback("✗ Salah. Ingat: // floor division membulatkan ke bawah.");
    }
  };
  const resetOperator = () => {
    setOperatorAnswer(null);
    setOperatorFeedback("");
  };

  const [modulusAnswer, setModulusAnswer] = useState(null);
  const [modulusFeedback, setModulusFeedback] = useState("");
  const modulusOptions = ["3", "1", "0", "3.33", "Error"];
  const modulusCorrect = 1;
  const checkModulus = () => {
    if (modulusAnswer === null) {
      setModulusFeedback("❌ Silakan pilih salah satu opsi.");
      return;
    }
    if (modulusAnswer === modulusCorrect) {
      setModulusFeedback("✓ Benar! 7 % 3 = 1 (sisa bagi).");
    } else {
      setModulusFeedback("✗ Salah. Operator % menghasilkan sisa pembagian.");
    }
  };
  const resetModulus = () => {
    setModulusAnswer(null);
    setModulusFeedback("");
  };

  const [pangkatAnswer, setPangkatAnswer] = useState("");
  const [pangkatFeedback, setPangkatFeedback] = useState("");
  const checkPangkat = () => {
    const jawaban = pangkatAnswer.trim();
    if (jawaban === "27") {
      setPangkatFeedback("✓ Benar! 3 ** 3 = 27.");
    } else {
      setPangkatFeedback("✗ Salah. Ingat: ** adalah operator pangkat. 3 pangkat 3 = 27.");
    }
  };
  const resetPangkat = () => {
    setPangkatAnswer("");
    setPangkatFeedback("");
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
  const resetIO = () => {
    setIoAnswer("");
    setIoFeedback("");
  };

  const [outputAnswer, setOutputAnswer] = useState(null);
  const [outputFeedback, setOutputFeedback] = useState("");
  const outputOptions = ["input()", "print()", "output()", "display()", "write()"];
  const outputCorrect = 1;
  const checkOutput = () => {
    if (outputAnswer === null) {
      setOutputFeedback("❌ Silakan pilih salah satu opsi.");
      return;
    }
    if (outputAnswer === outputCorrect) {
      setOutputFeedback("✓ Benar! print() digunakan untuk mencetak output.");
    } else {
      setOutputFeedback("✗ Salah. Fungsi yang benar adalah print().");
    }
  };
  const resetOutput = () => {
    setOutputAnswer(null);
    setOutputFeedback("");
  };

  const [printVarAnswer, setPrintVarAnswer] = useState("");
  const [printVarFeedback, setPrintVarFeedback] = useState("");
  const checkPrintVar = () => {
    const jawaban = printVarAnswer.trim().toLowerCase();
    if (jawaban === "nama") {
      setPrintVarFeedback("✓ Benar! Nilai dari variabel 'nama' akan ditampilkan setelah kata 'Halo'.");
    } else {
      setPrintVarFeedback("✗ Coba lagi. Variabel yang menyimpan input nama adalah 'nama'.");
    }
  };
  const resetPrintVar = () => {
    setPrintVarAnswer("");
    setPrintVarFeedback("");
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

  const [bonusGiven, setBonusGiven] = useState(false);
  useEffect(() => {
    const already = localStorage.getItem("apersepsi_bonus_done");
    if (already === "true") setBonusGiven(true);
  }, []);

  // Fungsi untuk mengecek apakah semua aktivitas sudah dijawab dengan benar
  const isAllActivitiesCorrect = () => {
    if (!dragDropAllDone) return false;
    if (!varPilihanFeedback.startsWith("✓")) return false;
    if (!tipeNilaiFeedback.startsWith("✓")) return false;
    if (operatorAnswer !== operatorCorrect) return false;
    if (modulusAnswer !== modulusCorrect) return false;
    if (!pangkatFeedback.startsWith("✓")) return false;
    if (!ioFeedback.startsWith("✓")) return false;
    if (outputAnswer !== outputCorrect) return false;
    if (!printVarFeedback.startsWith("✓")) return false;
    return true;
  };

  useEffect(() => {
    if (!userId) return;
    if (bonusGiven) return;
    if (isAllActivitiesCorrect() && !showCompletionModal && !isProcessing) {
      setShowCompletionModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dragDropAllDone,
    varPilihanFeedback,
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

  const handleCompleteAndContinue = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const mahasiswaRef = doc(db, "mahasiswa", userId);
      await updateDoc(mahasiswaRef, {
        progres_belajar: increment(1)
      });
      localStorage.setItem("apersepsi_bonus_done", "true");
      setBonusGiven(true);
      setShowCompletionModal(false);
      navigate("/list/pendahuluanlist");
    } catch (error) {
      console.error("Gagal update progres:", error);
      alert("Terjadi kesalahan saat menyimpan progres. Silakan coba lagi.");
      setIsProcessing(false);
      setShowCompletionModal(false);
    }
  };

  const formatCodeWithComments = (code) => {
    const lines = code.split('\n');
    return lines.map((line, i) => {
      const commentIndex = line.indexOf('#');
      if (commentIndex !== -1) {
        const codePart = line.substring(0, commentIndex);
        const commentPart = line.substring(commentIndex);
        return (
          <div key={i}>
            <span>{codePart}</span>
            <span style={{ color: "#6a9955", fontStyle: "italic" }}>{commentPart}</span>
          </div>
        );
      }
      return <div key={i}>{line}</div>;
    });
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
      <SidebarMateri />
      <div className="main-content" style={{ paddingTop: "64px" }}>
        <div className="apersepsi-page" style={styles.page}>
          <div style={styles.header}>
            <div style={styles.headerAccent}></div>
            <h1 style={styles.headerTitle}>PENGANTAR</h1>
          </div>

          {/* PEMANTIK VISUAL */}
          <section style={styles.section}>
            <div style={styles.heroCard} className="fade-in">
              <div style={styles.heroLeft}>
                <div style={styles.heroIcon}>🎒</div>
              </div>
              <div style={styles.heroRight}>
                <h3 style={styles.heroTitle}>Seperti perjalanan, kita butuh tas yang tepat untuk menyimpan barang-barang</h3>
                <p style={styles.heroText}>
                  Menyimpan banyak data tanpa struktur akan berantakan. List, Nested List, dan Dictionary adalah <strong>struktur</strong> Python 
                  yang akan mengatur data Anda. Tapi sebelumnya, mari mengingat kembali dasar-dasarnya.
                </p>
                <div style={styles.heroBadge}>
                  <span><strong>Variabel</strong></span> <span>|  <strong>Tipe Data</strong>    |</span> <span><strong>Operator</strong></span> <span>|   <strong>Input/Output</strong></span>
                </div>
              </div>
            </div>
          </section>

          {/* MATERI 1: VARIABEL & TIPE DATA */}
          <section style={styles.section}>
            <div style={styles.materialCard} className="fade-in">
              <div style={styles.materialHeader}>
                <div style={styles.materialIcon}>1</div>
                <div style={styles.materialTitle}><strong>Variabel</strong> dan <strong>Tipe Data</strong></div>
              </div>
              <p style={styles.text}>
                <strong>Variabel</strong> adalah wadah untuk menyimpan data. Sederhananya, <strong>variabel</strong> seperti sebuah kotak kecil yang diberi label nama. 
                Kotak ini bisa diisi dengan berbagai macam nilai, seperti angka, huruf, atau nilai kebenaran. Isi kotak (nilai <strong>variabel</strong>) 
                dapat berubah sewaktu-waktu selama program berjalan. Penulisan <strong>variabel</strong> di Python memiliki beberapa aturan sebagai berikut:
              </p>
              <ol style={styles.listOrdered}>
                <li>
                  Hanya boleh mengandung huruf (a-z, A-Z), angka (0-9), dan garis bawah (_).
                  <br />
                   nama, _data, nilai_akhir, data2 → <strong style={{color: "#10b981"}}>BENAR</strong>
                  <br />
                  nama@siswa, angka#1 → <strong style={{color: "#ef4444"}}>SALAH</strong>
                </li>
                <li>
                  Harus diawali dengan huruf atau garis bawah. Tidak boleh diawali angka.
                  <br />
                  nama_siswa → <strong style={{color: "#10b981"}}>BENAR</strong>
                  <br />
                  _nilai, angka1 → <strong style={{color: "#10b981"}}>BENAR</strong>
                  <br />
                  1siswa → <strong style={{color: "#ef4444"}}>SALAH</strong>
                  <br />
                  2nilai → <strong style={{color: "#ef4444"}}>SALAH</strong>
                </li>
                <li>
                  Tidak boleh ada spasi. Gunakan garis bawah untuk memisahkan kata.
                  <br />
                  jumlah_mahasiswa → <strong style={{color: "#10b981"}}>BENAR</strong>
                  <br />
                  jumlah mahasiswa → <strong style={{color: "#ef4444"}}>SALAH</strong>
                </li>
                <li>
                  Tidak boleh sama dengan kata kunci (keyword) Python, seperti print, if, for, while, input, return, def, True, False, and, or, dll.
                  <br />
                  if = 5, print = "halo", def = 10 → <strong style={{color: "#ef4444"}}>SALAH</strong>
                  <br />
                  print_data, if_statement → <strong style={{color: "#10b981"}}>BENAR</strong>
                </li>
                <li>
                  Bersifat case-sensitive, huruf besar dan kecil dibedakan. Jadi Harga, harga, dan HARGA adalah variabel yang berbeda.
                  <br />
                  nama, Nama, NAMA → <strong>tiga variabel berbeda.</strong>
                </li>
                <li>
                  Buat nama yang deskriptif agar mudah dipahami. Misalnya rata_rata lebih jelas daripada rt dan total_nilai lebih baik daripada tn
                  <br />
                  
                </li>
              </ol>
              <p style={styles.text}>
                Tipe data dasar di Python:
              </p>
              <ul style={styles.list}>
                <li>
                  <strong>integer</strong> → bilangan bulat (tanpa koma), seperti 10, -5, 0.
                  <br />
                  Contoh:  
                  <strong style={{ color: "#306998" }}> panjang</strong> = <strong style={{ color: "#306998" }}>int(input("Masukkan panjang: "))</strong>
                </li>
                <li>
                  <strong>float</strong> → bilangan desimal (ada koma), seperti 3.14, -0.5, 2.0.
                  <br />
                  Contoh:  
                  <strong style={{ color: "#306998" }}> lebar</strong> = <strong style={{ color: "#306998" }}> float(input("Masukkan lebar: "))</strong>
                </li>
                <li>
                  <strong>string</strong> → teks, diapit kutip (bisa kutip satu atau kutip dua).
                  <br />
                  Contoh:   
                  <strong style={{ color: "#306998" }}> jurusan</strong> = <strong style={{ color: "#306998" }}>"Pendidikan Komputer"</strong>
                </li>
                <li>
                  <strong>boolean</strong> → nilai kebenaran, hanya <code>True</code> atau <code>False</code>.
                  <br />
                  Contoh: (konteks apakah siswa masih aktif bersekolah)
                  <br />
                  <strong style={{ color: "#306998" }}>status_lulus</strong> = <strong style={{ color: "#306998" }}>True</strong>
                  <br />
                  <strong style={{ color: "#306998" }}>status_aktif</strong> = <strong style={{ color: "#306998" }}>True</strong>
                </li>
              </ul>

              <p style={styles.text}>Contoh Kode:</p>
              <pre style={styles.codeBlock}>
                {formatCodeWithComments(`panjang = int(input("Masukkan panjang: "))  # input panjang dalam cm
lebar = float(input("Masukkan lebar: "))      # input lebar dalam cm
jurusan = "Pendidikan Komputer"               # data string
status_lulus = True                           # boolean`)}
              </pre>

              {/* AKTIVITAS 1 - GABUNGAN */}
              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>Aktivitas</div>
                <p style={styles.instruction}>Kerjakan semua soal di bawah ini. Setiap soal memiliki tombol Periksa dan Reset.</p>

                {/* Soal 1.1 - Drag & Drop */}
                <div style={styles.subActivity}>
                  {/* <p style={styles.subLabel}>Soal 1: Cocokkan Tipe Data</p> */}
                  <p style={styles.instruction}>Seret kotak tipe data (integer, float, string, boolean) ke nilai yang sesuai dibawah ini.</p>
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
                  <div style={styles.buttonGroup}>
                    <button style={styles.checkButton} onClick={checkDragDrop}>Periksa Jawaban</button>
                    <button style={styles.resetButton} onClick={resetDragDrop}>Reset</button>
                  </div>
                  {dragDropFeedback && <div style={styles.feedback}>{dragDropFeedback}</div>}
                </div>

                {/* Soal 1.2 - Pilihan Ganda */}
                <div style={styles.subActivity}>
                  {/* <p style={styles.subLabel}>Soal 2: Aturan Penulisan Variabel</p> */}
                  <p style={styles.instruction}>Pilihlah penulisan variabel yang benar di Python:</p>
                  <div style={styles.options}>
                    {varPilihanOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setVarPilihanSelected(idx)}
                        style={{
                          ...styles.option,
                          backgroundColor: varPilihanSelected === idx ? "#2fa69a" : "#fff",
                          color: varPilihanSelected === idx ? "white" : "#1f2937",
                        }}
                      >
                        <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                      </div>
                    ))}
                  </div>
                  <div style={styles.buttonGroup}>
                    <button style={styles.checkButton} onClick={checkVarPilihan}>Periksa Jawaban</button>
                    <button style={styles.resetButton} onClick={resetVarPilihan}>Reset</button>
                  </div>
                  {varPilihanFeedback && <div style={styles.feedback}>{varPilihanFeedback}</div>}
                </div>

                {/* Soal 1.3 - Input Tipe Data */}
                <div style={styles.subActivity}>
                  {/* <p style={styles.subLabel}>Soal 3: Tipe Data dari Nilai</p> */}
                  <p style={styles.instruction}>(Tulis jawaban dalam huruf kecil contoh : string/integer/float/boolean)</p>
                  <p style={styles.instruction}>Tipe data dari nilai 5 adalah ....</p>
                  <div style={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder=""
                      value={tipeNilaiAnswer}
                      onChange={(e) => setTipeNilaiAnswer(e.target.value)}
                      style={styles.inputText}
                    />
                    <button style={styles.checkButton} onClick={checkTipeNilai}>Periksa Jawaban</button>
                    <button style={styles.resetButton} onClick={resetTipeNilai}>Reset</button>
                  </div>
                  {tipeNilaiFeedback && <div style={styles.feedback}>{tipeNilaiFeedback}</div>}
                </div>
              </div>
            </div>
          </section>

          {/* MATERI 2: OPERATOR ARITMATIKA */}
          <section style={styles.section}>
            <div style={styles.materialCard} className="fade-in">
              <div style={styles.materialHeader}>
                <div style={styles.materialIcon}>2</div>
                <div style={styles.materialTitle}><strong>Operator Aritmatika</strong></div>
              </div>
              <p style={styles.text}>
                <strong>Operator aritmatika</strong> digunakan untuk melakukan operasi matematika pada angka. Berikut tabel operator yang umum digunakan:
              </p>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableHeader}><strong>Operator</strong></th>
                      <th style={styles.tableHeader}><strong>Nama</strong></th>
                      <th style={styles.tableHeader}><strong>Contoh</strong></th>
                      <th style={styles.tableHeader}><strong>Hasil</strong></th>
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

              {/* AKTIVITAS 2 - GABUNGAN */}
              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>Aktivitas</div>
                <p style={styles.instruction}>Kerjakan semua soal di bawah ini. Setiap soal memiliki tombol Periksa dan Reset.</p>

                {/* Soal 2.1 - Pembagian Bulat */}
                <div style={styles.subActivity}>
                  {/* <p style={styles.subLabel}>Soal 1: Pembagian Bulat</p> */}
                  <p style={styles.instruction}>Hasil dari 15 // 4 adalah ….</p>
                  <div style={styles.options}>
                    {operatorOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setOperatorAnswer(idx)}
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
                  <div style={styles.buttonGroup}>
                    <button style={styles.checkButton} onClick={checkOperator}>Periksa Jawaban</button>
                    <button style={styles.resetButton} onClick={resetOperator}>Reset</button>
                  </div>
                  {operatorFeedback && <div style={styles.feedback}>{operatorFeedback}</div>}
                </div>

                {/* Soal 2.2 - Modulus */}
                <div style={styles.subActivity}>
                  {/* <p style={styles.subLabel}>Soal 2: Sisa Bagi (Modulus)</p> */}
                  <p style={styles.instruction}>Hasil dari 7 % 3 adalah ….</p>
                  <div style={styles.options}>
                    {modulusOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setModulusAnswer(idx)}
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
                  <div style={styles.buttonGroup}>
                    <button style={styles.checkButton} onClick={checkModulus}>Periksa Jawaban</button>
                    <button style={styles.resetButton} onClick={resetModulus}>Reset</button>
                  </div>
                  {modulusFeedback && <div style={styles.feedback}>{modulusFeedback}</div>}
                </div>

                {/* Soal 2.3 - Pangkat */}
                <div style={styles.subActivity}>
                  {/* <p style={styles.subLabel}>Soal 3: Operator Pangkat</p> */}
                  <p style={styles.instruction}>(Tulis jawabannya dengan angka)</p>
                  <p style={styles.instruction}>Hasil dari 3 ** 3 adalah ….</p>
                  <div style={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder=""
                      value={pangkatAnswer}
                      onChange={(e) => setPangkatAnswer(e.target.value)}
                      style={styles.inputText}
                    />
                    <button style={styles.checkButton} onClick={checkPangkat}>Periksa Jawaban</button>
                    <button style={styles.resetButton} onClick={resetPangkat}>Reset</button>
                  </div>
                  {pangkatFeedback && <div style={styles.feedback}>{pangkatFeedback}</div>}
                </div>
              </div>
            </div>
          </section>

          {/* MATERI 3: INPUT DAN OUTPUT */}
          <section style={styles.section}>
            <div style={styles.materialCard} className="fade-in">
              <div style={styles.materialHeader}>
                <div style={styles.materialIcon}>3</div>
                <div style={styles.materialTitle}><strong>Input</strong> dan <strong>Output</strong></div>
              </div>
              <p style={styles.text}>
                <strong>Output:</strong> Fungsi <code>print()</code> digunakan untuk menampilkan teks atau nilai ke layar. Contoh: <code>print("Hello World!")</code>
              </p>
              <p style={styles.text}>
                <strong>Input:</strong> Fungsi <code>input()</code> digunakan untuk membaca masukan dari pengguna. Hasilnya selalu berupa <strong>string</strong>. 
                Jika ingin menerima angka, konversi dengan <code>int()</code> atau <code>float()</code>.
              </p>

              <p style={styles.text}>Contoh Kode Program:</p>
              <pre style={styles.codeBlock}>
                {formatCodeWithComments(`nama = input("Nama: ")          # membaca input dari user
print("Halo", nama)             # menampilkan sapaan
umur = int(input("Umur: "))     # konversi ke integer`)}
              </pre>

              {/* AKTIVITAS 3 - GABUNGAN */}
              <div style={styles.activityWrapper}>
                <div style={styles.activityTitle}>Aktivitas</div>
                <p style={styles.instruction}>Kerjakan semua soal di bawah ini. Setiap soal memiliki tombol Periksa dan Reset.</p>

                {/* Soal 3.1 - Konversi ke Integer */}
                <div style={styles.subActivity}>
                  {/* <p style={styles.subLabel}>Soal 1: Konversi ke Integer</p> */}
                  <p style={styles.instruction}>Lengkapi kode agar variabel nim bertipe integer:<br /> <code>nim = ______(input("NIM: "))</code></p>
                  <div style={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder=""
                      value={ioAnswer}
                      onChange={(e) => setIoAnswer(e.target.value)}
                      style={styles.inputText}
                    />
                    <button style={styles.checkButton} onClick={checkIO}>Periksa Jawaban</button>
                    <button style={styles.resetButton} onClick={resetIO}>Reset</button>
                  </div>
                  {ioFeedback && <div style={styles.feedback}>{ioFeedback}</div>}
                </div>

                {/* Soal 3.2 - Fungsi Output */}
                <div style={styles.subActivity}>
                  {/* <p style={styles.subLabel}>Soal 2: Fungsi Output</p> */}
                  <p style={styles.instruction}>Fungsi yang benar untuk menampilkan teks ke layar adalah ....</p>
                  <div style={styles.options}>
                    {outputOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setOutputAnswer(idx)}
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
                  <div style={styles.buttonGroup}>
                    <button style={styles.checkButton} onClick={checkOutput}>Periksa Jawaban</button>
                    <button style={styles.resetButton} onClick={resetOutput}>Reset</button>
                  </div>
                  {outputFeedback && <div style={styles.feedback}>{outputFeedback}</div>}
                </div>

                {/* Soal 3.3 - Mencetak Variabel */}
                <div style={styles.subActivity}>
                  {/* <p style={styles.subLabel}>Soal 3: Mencetak Variabel</p> */}
                  <p style={styles.instruction}>Semisal user menginput namanya Andi, lengkapi agar program mencetak "Halo Andi". Tulis variabel yang tepat.</p>
                  <pre style={styles.codeBlockSmall}>{`nama = input("Nama: ")
print("Halo", ______)`}</pre>
                  <div style={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder=""
                      value={printVarAnswer}
                      onChange={(e) => setPrintVarAnswer(e.target.value)}
                      style={styles.inputText}
                    />
                    <button style={styles.checkButton} onClick={checkPrintVar}>Periksa Jawaban</button>
                    <button style={styles.resetButton} onClick={resetPrintVar}>Reset</button>
                  </div>
                  {printVarFeedback && <div style={styles.feedback}>{printVarFeedback}</div>}
                </div>
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
              Kamu sudah menyelesaikan semua aktivitas Apersepsi.
            </p>
            <p style={modalStyles.subMessage}>
              Materi berikutnya sudah terbuka.
            </p>
            <button 
              style={modalStyles.button} 
              onClick={handleCompleteAndContinue}
              disabled={isProcessing}
            >
              {isProcessing ? "Memproses..." : "Materi berikutnya"}
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
        @media (max-width: 768px) {
          .apersepsi-page {
            padding: 20px 16px !important;
          }
          .drag-items, .drop-zones {
            flex-direction: column;
          }
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
    maxWidth: "100%",
    overflowX: "hidden",
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
  listOrdered: { marginLeft: "24px", marginBottom: "16px", lineHeight: "1.8", color: "#1e293b" },
  codeBlock: { 
    background: "#0f172a", 
    color: "#e2e8f0", 
    padding: "16px", 
    borderRadius: "20px", 
    fontFamily: "monospace", 
    fontSize: "14px", 
    overflow: "auto", 
    margin: "20px 0",
    whiteSpace: "pre-wrap",
  },
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
  subActivity: { marginTop: "20px", paddingTop: "16px", borderTop: "1px dashed #e2e8f0" },
  subLabel: { fontWeight: "600", fontSize: "15px", color: "#1e293b", marginBottom: "8px" },
  dragContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  dragItems: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" },
  dragItem: {
    background: "#306998",
    color: "white",
    padding: "8px 20px",
    borderRadius: "0px",
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
  resetButton: { background: "#ef4444", color: "white", border: "none", padding: "10px 24px", borderRadius: "40px", cursor: "pointer", fontWeight: "600", transition: "0.2s" },
  buttonGroup: { display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" },
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