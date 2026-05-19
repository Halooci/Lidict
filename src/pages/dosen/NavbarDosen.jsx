import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo-media-terbaru.png";

// Komponen AvatarDropdown built-in
const AvatarDropdown = ({ userName, userRole }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/loginregister");
  };

  return (
    <div className="avatar-dropdown" ref={dropdownRef}>
      <div className="avatar" onClick={() => setOpen(!open)}>
        {userName?.charAt(0) || "U"}
      </div>
      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-item" style={{ fontWeight: "bold" }}>
            {userName}
          </div>
          <div className="dropdown-item" style={{ fontSize: "12px", color: "#666" }}>
            {userRole === "dosen" ? "Dosen" : "Mahasiswa"}
          </div>
          <hr style={{ margin: "8px 0" }} />
          <div className="dropdown-item" onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
      <style>{`
        .avatar-dropdown {
          position: relative;
          display: inline-block;
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
        .dropdown-menu {
          position: absolute;
          top: 45px;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          width: 160px;
          padding: 8px 0;
          z-index: 1000;
        }
        .dropdown-item {
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
          color: #333;
        }
        .dropdown-item:hover {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default function NavbarDosen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");

    if (userId && userEmail) {
      setIsLoggedIn(true);
      setUserName(name || "User");

      // Redirect ke dashboard dosen jika di halaman root
      if (userRole === "dosen" && window.location.pathname === "/") {
        navigate("/dosen/dashboard");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/dosen/dashboard">
          <img src={logo} alt="ListDictionaryLearn Logo" className="logo-image" />
        </Link>
      </div>

      <div className="right-section">
        <Link to="/dosen/dashboard" className="nav-item">Dashboard Dosen</Link>
        <Link to="/dosen/materi" className="nav-item">Materi</Link>
        <Link to="/dosen/informasi" className="nav-item">Informasi</Link>
        {isLoggedIn ? (
          <AvatarDropdown userName={userName} userRole={localStorage.getItem("userRole")} />
        ) : (
        <div className="avatar">👤</div>
        )}
      </div>

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
        @media (max-width: 768px) {
          .navbar {
            padding: 0 16px;
            height: auto;
            min-height: 56px;
            flex-wrap: wrap;
          }
          .logo-image { height: 40px; }
          .right-section { gap: 16px; margin: 8px 0; }
          .nav-item { font-size: 14px; }
          .avatar { width: 28px; height: 28px; font-size: 14px; }
        }
        @media (max-width: 480px) {
          .navbar { padding: 0 12px; }
          .logo-image { height: 32px; }
          .right-section { gap: 12px; }
          .nav-item { font-size: 12px; }
          .avatar { width: 26px; height: 26px; font-size: 12px; }
        }
      `}</style>
    </nav>
  );
}