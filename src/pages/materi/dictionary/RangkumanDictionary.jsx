import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";

export default function RangkumanDictionary() {
  return (
    <>
      <Navbar />
      <div style={{ marginLeft: "280px" }}>
        <SidebarMateri />
        <div style={{ paddingTop: "64px" }}>
          <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.header}>
              <div style={styles.headerAccent}></div>
              <h1 style={styles.headerTitle}>RANGKUMAN DICTIONARY</h1>
            </div>

            {/* PENGERTIAN DAN KARAKTERISTIK */}
            <section style={styles.section}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>📖 Apa Itu Dictionary?</h2>
                <p style={styles.text}>
                  Dictionary adalah struktur data di Python yang menyimpan koleksi pasangan <strong>key-value</strong> (kunci-nilai). 
                  Setiap key bersifat unik dan digunakan untuk mengakses nilai yang terkait. Dictionary bersifat <strong>mutable</strong> (dapat diubah) 
                  dan sangat efisien untuk pencarian data (rata-rata O(1)).
                </p>
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>⚙️ Karakteristik Dictionary</h2>
                <ul style={styles.list}>
                  <li><strong>Key unik</strong> → Tidak boleh ada duplikasi key.</li>
                  <li><strong>Key immutable</strong> → Key harus berupa tipe data yang tidak dapat diubah (string, integer, tuple).</li>
                  <li><strong>Value dapat berupa apa saja</strong> → Bisa list, dictionary lain, fungsi, dll.</li>
                  <li><strong>Urutan terjaga (Python 3.7+)</strong> → Item disimpan sesuai urutan penyisipan.</li>
                  <li><strong>Mutable & Dinamis</strong> → Dapat ditambah, diubah, dihapus; ukuran otomatis menyesuaikan.</li>
                </ul>
              </div>
            </section>

            {/* CARA MEMBUAT DICTIONARY */}
            <section style={styles.section}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>🛠️ Cara Membuat Dictionary</h2>
                <pre style={styles.code}>
{`# 1. Kurung kurawal
mahasiswa = {"nama": "Budi", "umur": 20}

# 2. Fungsi dict()
data = dict(nama="Ani", kota="Jakarta")

# 3. Dictionary comprehension
kuadrat = {x: x**2 for x in range(1,6)}`}
                </pre>
              </div>
            </section>

            {/* MENGAKSES NILAI */}
            <section style={styles.section}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>🔍 Mengakses Nilai Dictionary</h2>
                <pre style={styles.code}>
{`# Menggunakan kurung siku (error jika key tidak ada)
print(mahasiswa["nama"])

# Menggunakan metode get() (return default jika key tidak ada)
print(mahasiswa.get("alamat", "Tidak tersedia"))`}
                </pre>
              </div>
            </section>

            {/* MANIPULASI DICTIONARY */}
            <section style={styles.section}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>✏️ Manipulasi Dictionary</h2>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.tableCell}>Operasi</th>
                        <th style={styles.tableCell}>Contoh Kode</th>
                        <th style={styles.tableCell}>Penjelasan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={styles.tableCell}>Tambah/Ubah</td>
                        <td style={styles.tableCell}><code>dict["key"] = value</code></td>
                        <td style={styles.tableCell}>Menambah pasangan baru atau mengubah nilai yang sudah ada.</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Update banyak</td>
                        <td style={styles.tableCell}><code>dict.update(&#123;"a":1, "b":2&#125;)</code></td>
                        <td style={styles.tableCell}>Menambah/memperbarui beberapa key sekaligus.</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Hapus dengan pop</td>
                        <td style={styles.tableCell}><code>value = dict.pop("key")</code></td>
                        <td style={styles.tableCell}>Menghapus key dan mengembalikan nilainya.</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Hapus terakhir</td>
                        <td style={styles.tableCell}><code>item = dict.popitem()</code></td>
                        <td style={styles.tableCell}>Menghapus item terakhir (kembalikan tuple key-value).</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Hapus semua</td>
                        <td style={styles.tableCell}><code>dict.clear()</code></td>
                        <td style={styles.tableCell}>Mengosongkan dictionary.</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Salin dictionary</td>
                        <td style={styles.tableCell}><code>baru = dict.copy()</code></td>
                        <td style={styles.tableCell}>Membuat salinan dangkal (shallow copy).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* METODE PENTING LAINNYA */}
            <section style={styles.section}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>📚 Metode Penting Dictionary</h2>
                <ul style={styles.list}>
                  <li><code>keys()</code> → Mengembalikan objek view berisi semua key.</li>
                  <li><code>values()</code> → Mengembalikan objek view berisi semua value.</li>
                  <li><code>items()</code> → Mengembalikan objek view berisi pasangan (key, value).</li>
                  <li><code>get(key, default)</code> → Mengambil nilai, aman jika key tidak ada.</li>
                  <li><code>setdefault(key, default)</code> → Mengambil nilai, jika key tidak ada maka membuat key dengan default.</li>
                  <li><code>fromkeys(iterable, value)</code> → Membuat dictionary baru dari iterable dengan nilai yang sama.</li>
                </ul>
              </div>
            </section>

            {/* PERBANDINGAN DICTIONARY vs LIST */}
            <section style={styles.section}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>📊 Perbandingan Dictionary vs List</h2>
                <div style={styles.tableWrapper}>
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
                        <td style={styles.tableCell}>Pengaksesan</td>
                        <td style={styles.tableCell}>Indeks angka (0,1,2,…)</td>
                        <td style={styles.tableCell}>Key (string, integer, dll)</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Kecepatan pencarian</td>
                        <td style={styles.tableCell}>O(n) - linear</td>
                        <td style={styles.tableCell}>O(1) rata-rata</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Urutan</td>
                        <td style={styles.tableCell}>Terurut</td>
                        <td style={styles.tableCell}>Terurut sejak Python 3.7</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>Batasan key</td>
                        <td style={styles.tableCell}>Tidak ada konsep key</td>
                        <td style={styles.tableCell}>Key harus immutable dan unik</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* CONTOH PENGGUNAAN NYATA */}
            <section style={styles.section}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>💡 Contoh Penggunaan dalam Kehidupan Nyata</h2>
                <ul style={styles.list}>
                  <li>📌 <strong>Data mahasiswa</strong> → NIM sebagai key, data diri sebagai value.</li>
                  <li>📌 <strong>Frekuensi kata</strong> → Kata sebagai key, jumlah kemunculan sebagai value.</li>
                  <li>📌 <strong>Konfigurasi aplikasi</strong> → Parameter sebagai key, nilai sebagai value (mirip JSON).</li>
                  <li>📌 <strong>Cache/memoization</strong> → Menyimpan hasil komputasi untuk input tertentu.</li>
                  <li>📌 <strong>Graf/network</strong> → Node sebagai key, daftar tetangga sebagai value.</li>
                </ul>
              </div>
            </section>

            {/* RINGKASAN METODE DALAM TABEL */}
            <section style={styles.section}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>📋 Ringkasan Metode Dictionary</h2>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.tableCell}>Metode</th>
                        <th style={styles.tableCell}>Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td style={styles.tableCell}><code>clear()</code></td><td style={styles.tableCell}>Menghapus semua item.</td></tr>
                      <tr><td style={styles.tableCell}><code>copy()</code></td><td style={styles.tableCell}>Mengembalikan salinan dictionary.</td></tr>
                      <tr><td style={styles.tableCell}><code>fromkeys(seq, v)</code></td><td style={styles.tableCell}>Membuat dictionary baru dengan key dari seq dan value v.</td></tr>
                      <tr><td style={styles.tableCell}><code>get(key, default)</code></td><td style={styles.tableCell}>Mengembalikan nilai key, atau default jika key tidak ada.</td></tr>
                      <tr><td style={styles.tableCell}><code>items()</code></td><td style={styles.tableCell}>Mengembalikan view of (key, value).</td></tr>
                      <tr><td style={styles.tableCell}><code>keys()</code></td><td style={styles.tableCell}>Mengembalikan view of keys.</td></tr>
                      <tr><td style={styles.tableCell}><code>pop(key, default)</code></td><td style={styles.tableCell}>Hapus key dan kembalikan value, atau default jika tidak ada.</td></tr>
                      <tr><td style={styles.tableCell}><code>popitem()</code></td><td style={styles.tableCell}>Hapus dan kembalikan (key, value) terakhir.</td></tr>
                      <tr><td style={styles.tableCell}><code>setdefault(key, default)</code></td><td style={styles.tableCell}>Kembalikan nilai key, jika tidak ada buat key dengan default.</td></tr>
                      <tr><td style={styles.tableCell}><code>update(dict2)</code></td><td style={styles.tableCell}>Update dictionary dengan pasangan dari dict2.</td></tr>
                      <tr><td style={styles.tableCell}><code>values()</code></td><td style={styles.tableCell}>Mengembalikan view of values.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
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
  section: {
    marginBottom: "40px",
  },
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
  list: {
    paddingLeft: "20px",
    lineHeight: "1.8",
  },
  text: {
    lineHeight: "1.8",
    color: "#333",
  },
  code: {
    backgroundColor: "#272822",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "8px",
    fontSize: "14px",
    overflowX: "auto",
    fontFamily: "monospace",
    marginTop: "10px",
    marginBottom: "10px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    lineHeight: "1.6",
    marginTop: "10px",
  },
  tableHeader: {
    backgroundColor: "#306998",
    color: "white",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
    verticalAlign: "top",
  },
};