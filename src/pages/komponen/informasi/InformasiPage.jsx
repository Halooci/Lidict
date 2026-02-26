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
          margin-bottom: 4rem;
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
      `}</style>

      <div className="info-wrapper">
        <div className="info-page">

          <h1 className="info-title">Informasi</h1>

          <div className="info-card">
            <p>
              Media pembelajaran ini dibuat untuk memenuhi persyaratan dalam
              menyelesaikan studi pada Program Strata-1 Pendidikan Komputer dengan
              judul:
            </p>

            <p className="info-judul">
              “Implementasi Web Interaktif Sebagai Media Pembelajaran Materi List dan Dictionary
              pada Mata Kuliah Struktur Data dengan Python”
            </p>

            <p><b>Pengembang:</b> Rosian Margareth Princes Dalughu</p>
            <p><b>Dosen Pembimbing I:</b> Dr. R. Ati Sukmawati, M.Kom.</p>
            <p><b>Dosen Pembimbing II:</b> Ihdalhubbi Maulida, S.Kom., M.Kom.</p>
            <p><b>Program Studi:</b> Pendidikan Komputer</p>
          </div>

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

        </div>
      </div>
    </>
  );
};

export default InformasiPage;