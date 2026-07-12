import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AvatarDropdown from "./AvatarDropdown";
import logo from "../../assets/logo-media-terbaru.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [openLoginDropdown, setOpenLoginDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fungsi untuk menentukan tab aktif berdasarkan pathname
  const getActiveTab = (pathname) => {
    if (pathname === "/" || pathname === "") return "beranda";
    if (pathname.startsWith("/PetaKonsep") || pathname.startsWith("/dosen/materi")) return "materi";
    if (pathname.startsWith("/InformasiPage") || pathname.startsWith("/dosen/informasi")) return "informasi";
    if (pathname.startsWith("/dosen/dashboard")) return "dashboard";
    return "";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));

  // Update activeTab saat pathname berubah
  useEffect(() => {
    setActiveTab(getActiveTab(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");

    if (userId && userEmail) {
      setIsLoggedIn(true);
      setUserName(name || "User");
      setUserRole(role || "");
    } else {
      setIsLoggedIn(false);
      setUserRole("");
    }
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenLoginDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    setOpenLoginDropdown(false);
    navigate("/loginregister");
  };

  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/">
          <img src={logo} alt="ListDictionaryLearn Logo" className="logo-image" />
        </Link>
      </div>

      <div className="right-section">
        <Link to="/" className={`nav-item ${activeTab === "beranda" ? "active" : ""}`}>
          Beranda
        </Link>
        <Link to="/PetaKonsep" className={`nav-item ${activeTab === "materi" ? "active" : ""}`}>
          Materi
        </Link>
        <Link to="/InformasiPage" className={`nav-item ${activeTab === "informasi" ? "active" : ""}`}>
          Informasi
        </Link>
        
        {isLoggedIn && userRole === "dosen" && (
          <Link to="/dosen/dashboard" className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}>
            Dashboard
          </Link>
        )}

        {isLoggedIn ? (
          <AvatarDropdown userName={userName} userRole={userRole} />
        ) : (
          <div className="avatar-dropdown" ref={dropdownRef}>
            <div className="avatar" onClick={() => setOpenLoginDropdown(!openLoginDropdown)}>
              👤
            </div>
            {openLoginDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" style={{ fontWeight: "bold", color: "#333" }}>
                  Belum Login
                </div>
                <div className="dropdown-item" style={{ fontSize: "12px", color: "#666" }}>
                  Silakan login untuk mengakses fitur
                </div>
                <hr style={{ margin: "8px 0" }} />
                <div className="dropdown-item login-btn" onClick={handleLoginClick}>
                  🔑 Login
                </div>
              </div>
            )}
          </div>
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
          white-space: nowrap;
        }

        .nav-item:hover {
          border-bottom: 2px solid #FFD43B;
          color: #FFD43B;
        }

        .nav-item.active {
          border-bottom: 2px solid #FFD43B !important;
          color: #FFD43B !important;
        }

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
          font-size: 18px;
          transition: transform 0.2s;
        }

        .avatar:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .dropdown-menu {
          position: absolute;
          top: 45px;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          width: 180px;
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

        .login-btn {
          color: #306998;
          font-weight: 600;
        }

        .login-btn:hover {
          background: #e3f2fd;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 20px;
            height: auto;
            min-height: 56px;
            flex-wrap: wrap;
            justify-content: center;
          }
          .left {
            margin-right: auto;
          }
          .right-section {
            gap: 20px;
            flex-wrap: wrap;
            justify-content: flex-end;
            margin: 8px 0;
          }
          .nav-item {
            font-size: 14px;
          }
          .logo-image {
            height: 40px;
          }
          .avatar {
            width: 30px;
            height: 30px;
            font-size: 14px;
          }
          .dropdown-menu {
            width: 160px;
            right: 0;
          }
        }

        @media (max-width: 600px) {
          .navbar {
            padding: 0 12px;
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }
          .left {
            margin: 8px 0;
            justify-content: center;
          }
          .right-section {
            justify-content: center;
            gap: 14px;
            flex-wrap: wrap;
            margin: 0 0 10px 0;
          }
          .nav-item {
            font-size: 13px;
            white-space: normal;
          }
          .logo-image {
            height: 36px;
          }
          .avatar {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }
          .dropdown-menu {
            width: 150px;
            right: 0;
          }
        }

        @media (max-width: 480px) {
          .right-section {
            gap: 10px;
          }
          .nav-item {
            font-size: 12px;
          }
          .logo-image {
            height: 32px;
          }
          .dropdown-menu {
            width: 140px;
            right: 0;
          }
        }
      `}</style>
    </nav>
  );
}