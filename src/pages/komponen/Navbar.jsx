import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo-media-terbaru.png"; 

export default function Navbar() {
  const [hovered, setHovered] = useState(null);

  const getNavItemStyle = (name) => ({
    ...styles.navItem,
    ...(hovered === name ? styles.navItemHover : {}),
  });

  return (
    <nav style={styles.navbar}>
      
      {/* LEFT (LOGO IMAGE) */}
      <div style={styles.left}>
        <Link to="/">
          <img src={logo} alt="ListDictionaryLearn Logo" style={styles.logoImage} 
          filter = "brightness(5) contrast(5)"/>
        </Link>
      </div>

      {/* RIGHT (MENU + AVATAR) */}
      <div style={styles.rightSection}>
        <Link
          to="/"
          style={getNavItemStyle("beranda")}
          onMouseEnter={() => setHovered("beranda")}
          onMouseLeave={() => setHovered(null)}
        >
          Beranda
        </Link>

        <Link
          to="/Pengantar"
          style={getNavItemStyle("materi")}
          onMouseEnter={() => setHovered("materi")}
          onMouseLeave={() => setHovered(null)}
        >
          Materi
        </Link>

        <Link
          to="/InformasiPage"
          style={getNavItemStyle("informasi")}
          onMouseEnter={() => setHovered("informasi")}
          onMouseLeave={() => setHovered(null)}
        >
          Informasi
        </Link>

        <div style={styles.avatar}>👤</div>
      </div>
    </nav>
  );
}

/* ================== STYLES ================== */
const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "64px",
    background: "linear-gradient(90deg, #2b518a, #2f6fa3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px", // 🔥 kiri lebih kecil
    boxSizing: "border-box",
    zIndex: 1000,
  },

  left: {
    display: "flex",
    alignItems: "center",
  },

  logoImage: {
  height: "50px",
  objectFit: "contain",
  cursor: "pointer",
  display: "block",
},

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },

  navItem: {
    textDecoration: "none",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "600",
    paddingBottom: "4px",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s ease",
  },

  navItemHover: {
    borderBottom: "2px solid #FFD43B",
    color: "#FFD43B",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "#FFD43B",
    color: "#2f6fa3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    cursor: "pointer",
  },
};