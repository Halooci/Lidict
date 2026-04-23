import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarMateri() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Tentukan accordion aktif berdasarkan URL
  const getDefaultAccordion = () => {
    if (currentPath.startsWith("/List")) return "list";
    if (currentPath.startsWith("/NestedList")) return "NestedList";
    if (currentPath.startsWith("/Dictionary")) return "dictionary";
    if (currentPath.startsWith("/Evaluasi")) return "evaluasi";
    if (currentPath.startsWith("/PetaKonsep/")) return "petaKonsep";
    return null;
  };

  const [activeAccordion, setActiveAccordion] = useState(getDefaultAccordion());

  // Efek untuk mengatur margin kiri konten utama saat sidebar terbuka/tutup
  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.style.marginLeft = isSidebarOpen ? "280px" : "0";
      mainContent.style.transition = "margin-left 0.3s ease";
    }
    document.body.style.overflowX = "hidden";
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Tombol hamburger floating saat sidebar tertutup */}
      {!isSidebarOpen && (
        <button onClick={toggleSidebar} style={styles.floatingHamburger}>
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: isSidebarOpen ? "280px" : "0", padding: isSidebarOpen ? "10px" : "0", overflow: isSidebarOpen ? "auto" : "hidden" }}>
        {/* Tombol hamburger di dalam sidebar (kiri atas) */}
        {isSidebarOpen && (
          <div style={styles.hamburgerInside} onClick={toggleSidebar}>
            ☰
          </div>
        )}

        {/* ========= ACCORDION PETA KONSEP (induk) dengan 2 anak ========= */}
        <Accordion
          id="petaKonsep"
          title="Peta Konsep"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          <SubItem 
            label="Peta Konsep" 
            to="/PetaKonsep" 
            currentPath={currentPath} 
          />
          <SubItem 
            label="Apersepsi" 
            to="/Apersepsi" 
            currentPath={currentPath} 
          />
        </Accordion>

        {/* ACCORDION List */}
        <Accordion
          id="list"
          title="List"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          <SubItem label="Pendahuluan List" to="/List/PendahuluanList" currentPath={currentPath} />
          <SubItem label="Pembuatan dan Akses Elemen" to="/List/PembuatanAksesElement" currentPath={currentPath} />
          <SubItem label="Operasi dan Manipulasi" to="/List/OperasiDanManipulasi" currentPath={currentPath} />
          <SubItem label="Rangkuman List" to="/List/RangkumanList" currentPath={currentPath} />
          <SubItem label="Kuis List" to="/List/KuisList" currentPath={currentPath} />
        </Accordion>

        <Accordion
          id="NestedList"
          title="Nested List"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          <SubItem label="Pendahuluan Nested List" to="/NestedList/PendahuluanNestedList" currentPath={currentPath} />
          <SubItem label="Pembuatan dan Akses Elemen Nested List" to="/NestedList/PembuatanAksesNestedList" currentPath={currentPath} />
          <SubItem label="Operasi dan Manipulasi Nested List" to="/NestedList/OperasiNestedList" currentPath={currentPath} />
          <SubItem label="Rangkuman Nested List" to="/NestedList/RangkumanNestedList" currentPath={currentPath} />
          <SubItem label="Kuis Nested List" to="/NestedList/KuisNestedList" currentPath={currentPath} />
        </Accordion>

        <Accordion
          id="dictionary"
          title="Dictionary"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          <SubItem label="Pendahuluan Dictionary" to="/Dictionary/PendahuluanDictionary" currentPath={currentPath} />
          <SubItem label="Pembuatan dan Akses Dictionary" to="/Dictionary/PembuatanAksesElementDictionary" currentPath={currentPath} />
          <SubItem label="Manipulasi Dictionary" to="/Dictionary/ManipulasiDictionary" currentPath={currentPath} />
          <SubItem label="Rangkuman Dictionary" to="/Dictionary/RangkumanDictionary" currentPath={currentPath} />
          <SubItem label="Kuis Dictionary" to="/Dictionary/KuisDictionary" currentPath={currentPath} />
        </Accordion>

        <Accordion
          id="evaluasi"
          title="Evaluasi"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          <SubItem label="Evaluasi Akhir" to="/EvaluasiAkhir" currentPath={currentPath} />
        </Accordion>
      </aside>
    </>
  );
}

/* ================= ACCORDION ================= */
function Accordion({ id, title, children, activeAccordion, setActiveAccordion }) {
  const isOpen = activeAccordion === id;

  return (
    <div style={styles.accordion}>
      <div
        style={{
          ...styles.accordionHeader,
          backgroundColor: isOpen ? "#eef2ff" : "#ffffff",
          borderBottom: isOpen ? "2px solid #FFD43B" : "1px solid #e9ecef",
          boxShadow: isOpen ? "0 2px 6px rgba(0,0,0,0.05)" : "none",
        }}
        onClick={() => setActiveAccordion(isOpen ? null : id)}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = "#fffbeb";
            e.currentTarget.style.borderLeftColor = "#FFD43B";
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderLeftColor = "transparent";
          }
        }}
      >
        <span style={{ fontWeight: isOpen ? "600" : "500" }}>{title}</span>
        <span style={styles.accordionIcon}>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div style={styles.accordionContent}>{children}</div>}
    </div>
  );
}

/* ================= SUB ITEM (dengan efek tombol, tanpa indikator titik) ================= */
function SubItem({ label, to, currentPath }) {
  const isActive = currentPath === to;

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        style={{
          ...styles.subItem,
          backgroundColor: isActive ? "#FFD43B" : "#f8fafc",
          color: isActive ? "#081527" : "#2c7be5",
          fontWeight: isActive ? "600" : "500",
          border: "1px solid #e2e8f0",
          boxShadow: isActive ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "#fef9e6";
            e.currentTarget.style.borderColor = "#FFD43B";
            e.currentTarget.style.transform = "translateX(4px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "#f8fafc";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.transform = "translateX(0)";
          }
        }}
      >
        <span>{label}</span>
        {/* Indikator titik (●) telah dihapus */}
      </div>
    </Link>
  );
}

/* ================= STYLES ================= */
const styles = {
  sidebar: {
    position: "fixed",
    top: "64px",
    left: 0,
    height: "calc(100vh - 64px)",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #eef2f6",
    fontFamily: "Poppins, sans-serif",
    overflowY: "auto",
    overflowX: "hidden",
    transition: "width 0.3s ease, padding 0.3s ease",
    zIndex: 1000,
    boxShadow: "4px 0 12px rgba(0,0,0,0.03)",
  },
  hamburgerInside: {
    fontSize: "22px",
    cursor: "pointer",
    padding: "8px 12px",
    display: "inline-block",
    color: "#306998",
    marginBottom: "16px",
    width: "fit-content",
    borderRadius: "12px",
    transition: "all 0.2s",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  floatingHamburger: {
    position: "fixed",
    top: "74px",
    left: "16px",
    fontSize: "22px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    padding: "8px 14px",
    zIndex: 1100,
    color: "#306998",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
  },
  accordion: {
    marginBottom: "10px",
    borderRadius: "14px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    transition: "all 0.2s",
  },
  accordionHeader: {
    padding: "14px 18px",
    fontSize: "15px",
    fontWeight: "500",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderLeft: "3px solid transparent",
    borderRadius: "14px 14px 0 0",
  },
  accordionIcon: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#306998",
    transition: "transform 0.2s",
  },
  accordionContent: {
    padding: "10px 8px 14px 8px",
    backgroundColor: "#fefefc",
    borderTop: "1px solid #f0f2f5",
  },
  subItem: {
    padding: "12px 16px",
    margin: "6px 4px",
    fontSize: "14.5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderRadius: "12px",
  },
};