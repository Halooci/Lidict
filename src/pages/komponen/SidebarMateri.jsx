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
          title="📖 Peta Konsep"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          {/* Anak 1: Peta Konsep */}
          <SubItem 
            label="Peta Konsep" 
            to="/PetaKonsep" 
            currentPath={currentPath} 
          />
          {/* Anak 2: Apersepsi */}
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
          <SubItem label="Operasi Nested List" to="/NestedList/OperasiNestedList" currentPath={currentPath} />
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
          backgroundColor: isOpen ? "#e8f1ff" : "#ffffff",
        }}
        onClick={() => setActiveAccordion(isOpen ? null : id)}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = "#fef9e6";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = "#ffffff";
        }}
      >
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div style={styles.accordionContent}>{children}</div>}
    </div>
  );
}

/* ================= SUB ITEM (dengan outline, hover, active) ================= */
function SubItem({ label, to, currentPath }) {
  const isActive = currentPath === to;

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        style={{
          ...styles.subItem,
          backgroundColor: isActive ? "#FFD43B" : "transparent",
          color: isActive ? "#081527" : "#2c7be5",
          fontWeight: isActive ? "600" : "400",
          borderLeft: isActive ? "4px solid #081527" : "4px solid transparent",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "#fef9e6";
            e.currentTarget.style.color = "#081527";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#2c7be5";
          }
        }}
      >
        <span>{label}</span>
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
    borderRight: "1px solid #e0e0e0",
    fontFamily: "Poppins, sans-serif",
    overflowY: "auto",
    overflowX: "hidden",
    transition: "width 0.3s ease, padding 0.3s ease",
    zIndex: 1000,
    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
  },
  hamburgerInside: {
    fontSize: "24px",
    cursor: "pointer",
    padding: "8px 12px",
    display: "inline-block",
    color: "#2c7be5",
    marginBottom: "10px",
    width: "fit-content",
    borderRadius: "8px",
    transition: "background 0.2s",
  },
  floatingHamburger: {
    position: "fixed",
    top: "74px",
    left: "10px",
    fontSize: "24px",
    background: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    padding: "6px 12px",
    zIndex: 1100,
    color: "#2c7be5",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "all 0.2s",
  },
  accordion: {
    marginBottom: "8px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  accordionHeader: {
    padding: "12px 16px",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  accordionContent: {
    padding: "4px 0",
    backgroundColor: "#fafafa",
  },
  subItem: {
    padding: "10px 16px 10px 28px",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderBottom: "1px solid #e5e7eb",
  },
};