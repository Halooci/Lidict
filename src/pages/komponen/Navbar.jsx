import { Link } from "react-router-dom";
import logo from "../../assets/logo-media-terbaru.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/">
          <img src={logo} alt="ListDictionaryLearn Logo" className="logo-image" />
        </Link>
      </div>

      <div className="right-section">
        <Link to="/" className="nav-item">Beranda</Link>
        <Link to="/List/PendahuluanList" className="nav-item">Materi</Link>
        <Link to="/InformasiPage" className="nav-item">Informasi</Link>
        <div className="avatar">👤</div>
      </div>

      {/* CSS Media Queries untuk Responsif */}
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(90deg, #081527, #296596);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          box-sizing: border-box;
          z-index: 1000;
          height: 64px;
        }

        .left {
          display: flex;
          align-items: center;
        }

        .logo-image {
          height: 50px;
          object-fit: contain;
          cursor: pointer;
          display: block;
        }

        .right-section {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .nav-item {
          text-decoration: none;
          color: #ffffff;
          font-size: 18px;
          font-weight: 600;
          padding-bottom: 4px;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          border-bottom: 2px solid #FFD43B;
          color: #FFD43B;
        }

        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: #FFD43B;
          color: #2f6fa3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          cursor: pointer;
        }

        /* Responsif untuk tablet & HP (max-width: 768px) */
        @media (max-width: 768px) {
          .navbar {
            padding: 0 16px;
            height: auto;
            min-height: 56px;
            flex-wrap: wrap;
          }

          .logo-image {
            height: 40px;
          }

          .right-section {
            gap: 16px;
            margin: 8px 0;
          }

          .nav-item {
            font-size: 14px;
          }

          .avatar {
            width: 28px;
            height: 28px;
            font-size: 14px;
          }
        }

        /* Responsif untuk HP kecil (max-width: 480px) */
        @media (max-width: 480px) {
          .navbar {
            padding: 0 12px;
          }

          .logo-image {
            height: 32px;
          }

          .right-section {
            gap: 12px;
          }

          .nav-item {
            font-size: 12px;
          }

          .avatar {
            width: 26px;
            height: 26px;
            font-size: 12px;
          }
        }
      `}</style>
    </nav>
  );
}