import React from "react";
import Navbar from "../Navbar";

const InformasiPage = () => {
  return (
    <>
      <Navbar />

      <style>{`
        body {
          margin: 0;
        }

        .info-wrapper {
          min-height: 100vh;
          padding-top: 100px;
          background: linear-gradient(135deg, #b89344, #3a86c4);
        }

        .info-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.5rem 4rem 1.5rem;
          font-family: "Poppins", sans-serif;
          color: #ffffff;
        }

        .info-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 2.5rem;
          font-weight: 700;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.95);
          color: #1f2937;
          padding: 2.5rem;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .info-card p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .info-judul {
          font-weight: bold;
          font-size: 1.1rem;
          margin: 1.5rem 0;
        }

        .info-identitas {
          text-align: left;
          margin-top: 1.5rem;
        }

        .info-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 0.4rem;
        }

        .info-label {
          width: 190px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .info-colon {
          margin-right: 10px;
          font-weight: 600;
        }

        .info-value {
          flex: 1;
        }

        /* Panduan Penggunaan */
        .panduan-card {
          background: rgba(255, 255, 255, 0.95);
          color: #1f2937;
          padding: 2rem 2.5rem;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          margin-bottom: 2.5rem;
        }

        .panduan-card h2 {
          font-size: 1.8rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
          border-left: 6px solid #FFD43B;
          padding-left: 12px;
        }

        .panduan-card .subtitle {
          color: #4b5563;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .pdf-embed-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 75%; /* 4:3 aspect ratio */
          height: 0;
          overflow: hidden;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          background: #f9fafb;
        }

        .pdf-embed-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 10px;
        }

        .pdf-link {
          display: inline-block;
          margin-top: 1.25rem;
          padding: 0.65rem 1.75rem;
          background: #3a86c4;
          color: #ffffff;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.2s ease;
          font-size: 0.95rem;
        }

        .pdf-link:hover {
          background: #2a6fa0;
          transform: translateY(-2px);
        }

        .pdf-link i {
          margin-right: 8px;
        }

        /* Daftar Pustaka */
        .daftar-pustaka-card {
          background: rgba(255, 255, 255, 0.95);
          color: #1f2937;
          padding: 2rem 2.5rem;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          margin-top: 2rem;
        }

        .daftar-pustaka-card h2 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
          border-left: 6px solid #FFD43B;
          padding-left: 12px;
        }

        .daftar-pustaka-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .daftar-pustaka-list li {
          margin-bottom: 0.8rem;
          padding-left: 2.5rem;
          text-indent: -2.5rem;
          line-height: 1.6;
        }

        .info-section {
          margin-bottom: 4rem;
        }

        .info-section h2 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: #ffffff;
          border-left: 6px solid #FFD43B;
          padding-left: 12px;
        }

        .concept-map {
          display: flex;
          justify-content: center;
        }

        .concept-map img {
          max-width: 100%;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .materi-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .materi-item {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(6px);
          padding: 1.5rem 2rem;
          border-radius: 12px;
          transition: transform 0.3s ease;
        }

        .materi-item:hover {
          transform: translateX(6px);
          background: rgba(255, 255, 255, 0.25);
        }

        .materi-item h3 {
          margin-bottom: 0.6rem;
          color: #ffffff;
        }

        .materi-item p {
          color: #f3f4f6;
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .info-title {
            font-size: 1.8rem;
          }

          .info-card,
          .panduan-card,
          .daftar-pustaka-card {
            padding: 1.5rem;
          }

          .info-row {
            flex-wrap: wrap;
          }

          .info-label {
            width: 140px;
          }

          .panduan-card h2,
          .daftar-pustaka-card h2 {
            font-size: 1.4rem;
          }

          .pdf-embed-wrapper {
            padding-bottom: 100%;
          }

          .pdf-link {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="info-wrapper">
        <div className="info-page">
          <h1 className="info-title">Informasi</h1>

          {/* Kartu identitas */}
          <div className="info-card">
            <p>
              Media pembelajaran ini dibuat untuk memenuhi persyaratan dalam
              menyelesaikan studi pada Program Strata-1 Pendidikan Komputer dengan
              judul:
            </p>

            <p className="info-judul">
              “Implementasi Web Interaktif Sebagai Media Pembelajaran Materi <i>List</i> dan <i>Dictionary</i> pada Mata Kuliah Struktur Data dengan Python”
            </p>

            <div className="info-identitas">
              <div className="info-row">
                <span className="info-label">Pengembang</span>
                <span className="info-colon">:</span>
                <span className="info-value">Rosian Margareth Princes Dalughu</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-colon">:</span>
                <span className="info-value">rosianmargareth@gmail.com</span>
              </div>
              <div className="info-row">
                <span className="info-label">Nomor Handphone</span>
                <span className="info-colon">:</span>
                <span className="info-value">081256981058</span>
              </div>
              <div className="info-row">
                <span className="info-label">Dosen Pembimbing I</span>
                <span className="info-colon">:</span>
                <span className="info-value">Dr. R. Ati Sukmawati, M.Kom.</span>
              </div>
              <div className="info-row">
                <span className="info-label">Dosen Pembimbing II</span>
                <span className="info-colon">:</span>
                <span className="info-value">Ihdalhubbi Maulida, S.Kom., M.Kom.</span>
              </div>
              <div className="info-row">
                <span className="info-label">Jurusan</span>
                <span className="info-colon">:</span>
                <span className="info-value">Pendidikan Komputer</span>
              </div>
              <div className="info-row">
                <span className="info-label">Fakultas</span>
                <span className="info-colon">:</span>
                <span className="info-value">Keguruan dan Ilmu Pendidikan (FKIP)</span>
              </div>
              <div className="info-row">
                <span className="info-label">Intansi</span>
                <span className="info-colon">:</span>
                <span className="info-value">Universitas Lambung Mangkurat</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tahun</span>
                <span className="info-colon">:</span>
                <span className="info-value">2026</span>
              </div>
            </div>
          </div>

          {/* Panduan Penggunaan Aplikasi */}
          <div className="panduan-card">
            <h2>Panduan Penggunaan Aplikasi</h2>
            <p className="subtitle">
              Baca panduan lengkap untuk memahami cara menggunakan media pembelajaran
              interaktif ini.
            </p>

            <div className="pdf-embed-wrapper">
              <iframe
                src="https://drive.google.com/file/d/1n5Z60lXMmtDZ1ZhqYdUBqsT7o5Y3J0Sh/preview"
                title="Panduan Penggunaan Aplikasi"
                allow="autoplay"
                loading="lazy"
              />
            </div>

            <a
              className="pdf-link"
              href="https://drive.google.com/file/d/1n5Z60lXMmtDZ1ZhqYdUBqsT7o5Y3J0Sh/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" /> Buka di Google Drive
            </a>
          </div>

          {/* Daftar Pustaka */}
          <div className="daftar-pustaka-card">
            <h2>Daftar Pustaka</h2>
            <ul className="daftar-pustaka-list">
              <li>Baka, B. (2017). Python data structures and algorithms: Improve the performance and speed of your applications. Packt Publishing.</li>
              <li>Necaise, R. D. (2011). Data structures and algorithms using Python. John Wiley &amp; Sons.</li>
              <li>Purba, H. S., Sukmawati, R. A., &amp; Adini, M. H. (2021). Pemrograman dasar menggunakan Python. Deepublish.</li>
              <li>Saputra, H., Arman, S. A., Fairuzabadi, M., Anshori, F. A., Impron, A., Winardi, S., Lumba, E., Syah, F., Saputra, N., Kadang, M. O., &amp; Hastomo, W. (2025). Struktur data dan algoritma dalam Python: Panduan praktis. Yash Media.</li>
              <li>Septian, R. F. (2013). Belajar pemrograman Python dasar. POSS – UPI.</li>
              <li>Sheehy, D. R. (2022). A first course on data structures in Python.</li>
            </ul>
          </div>

          {/* Bagian lain (peta konsep, ringkasan) – dikomentari sesuai permintaan */}
          {/* 
          <section className="info-section">
            <h2>Peta Konsep</h2>
            <div className="concept-map">
              <img src="/images/peta-konsep.png" alt="Peta Konsep" />
            </div>
          </section>
          <section className="info-section">
            <h2>Ringkasan Materi</h2>
            <div className="materi-list">
              <div className="materi-item">
                <h3>1. Pendahuluan</h3>
                <p>Mengenalkan konsep struktur data serta peran List dan Dictionary dalam Python.</p>
              </div>
              <div className="materi-item">
                <h3>2. List pada Python</h3>
                <p>Membahas pengertian, karakteristik, dan contoh penggunaan List.</p>
              </div>
              <div className="materi-item">
                <h3>3. Operasi List</h3>
                <p>Penambahan, penghapusan, pengubahan, dan pengaksesan elemen.</p>
              </div>
              <div className="materi-item">
                <h3>4. Dictionary pada Python</h3>
                <p>Konsep pasangan key–value serta pengelolaannya.</p>
              </div>
              <div className="materi-item">
                <h3>5. Evaluasi</h3>
                <p>Latihan dan evaluasi pemahaman mahasiswa.</p>
              </div>
            </div>
          </section>
          */}
        </div>
      </div>
    </>
  );
};

export default InformasiPage;