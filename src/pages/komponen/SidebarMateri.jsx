import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function SidebarMateri() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [progres, setProgres] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    setUserRole(role);
    if (role === "mahasiswa" && userId) {
      const fetchProgres = async () => {
        try {
          const docRef = doc(db, "mahasiswa", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setProgres(docSnap.data().progres_belajar ?? 0);
        } catch (error) { console.error(error); }
      };
      fetchProgres();
    } else if (role === "dosen") setProgres(999);
  }, []);

  const getDefaultAccordion = () => {
    if (currentPath.startsWith("/List")) return "list";
    if (currentPath.startsWith("/NestedList")) return "NestedList";
    if (currentPath.startsWith("/Dictionary")) return "dictionary";
    if (currentPath.startsWith("/Evaluasi")) return "evaluasi";
    if (currentPath.startsWith("/PetaKonsep")) return "petaKonsep";
    if (currentPath.startsWith("/Apersepsi")) return "petaKonsep";
    return null;
  };
  const [activeAccordion, setActiveAccordion] = useState(getDefaultAccordion());

  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      if (isMobile) mainContent.style.marginLeft = "0";
      else mainContent.style.marginLeft = isSidebarOpen ? "280px" : "0";
      mainContent.style.transition = "margin-left 0.3s ease";
    }
  }, [isSidebarOpen, isMobile]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const isUnlocked = (requiredLevel) => progres >= requiredLevel;

  return (
    <>
      {isMobile && isSidebarOpen && <div className="sidebar-overlay-mobile" onClick={closeSidebar}></div>}
      {!isSidebarOpen && (
        <button onClick={toggleSidebar} className="floating-hamburger" style={styles.floatingHamburger}>
          ☰
        </button>
      )}
      <aside
        style={{
          ...styles.sidebar,
          width: isSidebarOpen ? "280px" : "0",
          padding: isSidebarOpen ? "10px" : "0",
          overflow: isSidebarOpen ? "auto" : "hidden",
          top: "64px",
          transition: "width 0.3s ease",
        }}
      >
        {isSidebarOpen && (
          <div style={styles.hamburgerInside} onClick={toggleSidebar}>
            ☰
          </div>
        )}
        <Accordion id="petaKonsep" title="Peta Konsep" activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion}>
          <SubItem label="Peta Konsep" to="/PetaKonsep" currentPath={currentPath} requiredLevel={0} unlocked={isUnlocked(0)} />
          <SubItem label="Apersepsi" to="/Apersepsi" currentPath={currentPath} requiredLevel={0} unlocked={isUnlocked(0)} />
        </Accordion>
        <Accordion id="list" title="List" activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion}>
          <SubItem label="Pendahuluan List" to="/List/PendahuluanList" currentPath={currentPath} requiredLevel={1} unlocked={isUnlocked(1)} />
          <SubItem label="Pembuatan dan Akses Elemen" to="/List/PembuatanAksesElement" currentPath={currentPath} requiredLevel={2} unlocked={isUnlocked(2)} />
          <SubItem label="Operasi dan Manipulasi" to="/List/OperasiDanManipulasi" currentPath={currentPath} requiredLevel={3} unlocked={isUnlocked(3)} />
          <SubItem label="Rangkuman List" to="/List/RangkumanList" currentPath={currentPath} requiredLevel={4} unlocked={isUnlocked(4)} />
          <SubItem label="Kuis List" to="/List/KuisList" currentPath={currentPath} requiredLevel={4} unlocked={isUnlocked(4)} />
        </Accordion>
        <Accordion id="NestedList" title="Nested List" activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion}>
          <SubItem label="Pendahuluan Nested List" to="/NestedList/PendahuluanNestedList" currentPath={currentPath} requiredLevel={5} unlocked={isUnlocked(5)} />
          <SubItem label="Pembuatan dan Akses Elemen Nested List" to="/NestedList/PembuatanAksesNestedList" currentPath={currentPath} requiredLevel={6} unlocked={isUnlocked(6)} />
          <SubItem label="Operasi dan Manipulasi Nested List" to="/NestedList/OperasiNestedList" currentPath={currentPath} requiredLevel={7} unlocked={isUnlocked(7)} />
          <SubItem label="Rangkuman Nested List" to="/NestedList/RangkumanNestedList" currentPath={currentPath} requiredLevel={8} unlocked={isUnlocked(8)} />
          <SubItem label="Kuis Nested List" to="/NestedList/KuisNestedList" currentPath={currentPath} requiredLevel={8} unlocked={isUnlocked(8)} />
        </Accordion>
        <Accordion id="dictionary" title="Dictionary" activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion}>
          <SubItem label="Pendahuluan Dictionary" to="/Dictionary/PendahuluanDictionary" currentPath={currentPath} requiredLevel={9} unlocked={isUnlocked(9)} />
          <SubItem label="Pembuatan dan Akses Dictionary" to="/Dictionary/PembuatanAksesElementDictionary" currentPath={currentPath} requiredLevel={10} unlocked={isUnlocked(10)} />
          <SubItem label="Manipulasi Dictionary" to="/Dictionary/ManipulasiDictionary" currentPath={currentPath} requiredLevel={11} unlocked={isUnlocked(11)} />
          <SubItem label="Rangkuman Dictionary" to="/Dictionary/RangkumanDictionary" currentPath={currentPath} requiredLevel={12} unlocked={isUnlocked(12)} />
          <SubItem label="Kuis Dictionary" to="/Dictionary/KuisDictionary" currentPath={currentPath} requiredLevel={12} unlocked={isUnlocked(12)} />
        </Accordion>
        <Accordion id="evaluasi" title="Evaluasi" activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion}>
          <SubItem label="Evaluasi Akhir" to="/EvaluasiAkhir" currentPath={currentPath} requiredLevel={13} unlocked={isUnlocked(13)} />
        </Accordion>
      </aside>

      <style>{`
        /* Perbaikan utama: tombol burger harus muncul dan tidak tertutup */
        .floating-hamburger {
          position: fixed !important;
          top: 72px !important;
          left: 16px !important;
          z-index: 9999 !important;
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          font-size: 20px !important;
          cursor: pointer !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
          color: #306998 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        /* Pastikan navbar tidak menimpa tombol */
        .navbar {
          z-index: 1000 !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 64px !important;
        }
        /* Overlay tidak menutup tombol burger */
        .sidebar-overlay-mobile {
          position: fixed;
          top: 64px;
          left: 0;
          width: 100%;
          height: calc(100% - 64px);
          background: rgba(0,0,0,0.4);
          z-index: 900;
          cursor: pointer;
        }
        /* Sidebar di bawah navbar */
        aside {
          z-index: 950 !important;
          top: 64px !important;
        }
        @media (max-width: 768px) {
          aside {
            height: calc(100vh - 64px) !important;
          }
        }
      `}</style>
    </>
  );
}

function Accordion({ id, title, children, activeAccordion, setActiveAccordion }) {
  const isOpen = activeAccordion === id;
  return (
    <div style={styles.accordion}>
      <div
        style={{
          ...styles.accordionHeader,
          backgroundColor: isOpen ? "#eef2ff" : "#ffffff",
          borderBottom: isOpen ? "2px solid #FFD43B" : "1px solid #e9ecef",
          cursor: "pointer",
        }}
        onClick={() => setActiveAccordion(isOpen ? null : id)}
      >
        <span style={{ fontWeight: isOpen ? "600" : "500" }}>{title}</span>
        <span style={styles.accordionIcon}>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div style={styles.accordionContent}>{children}</div>}
    </div>
  );
}

function SubItem({ label, to, currentPath, requiredLevel, unlocked }) {
  const isActive = currentPath === to;
  const handleClick = (e) => {
    if (!unlocked) {
      e.preventDefault();
      alert(`Materi "${label}" membutuhkan progres level ${requiredLevel}. Selesaikan materi sebelumnya terlebih dahulu.`);
    }
  };
  const linkStyle = {
    ...styles.subItem,
    backgroundColor: isActive ? "#FFD43B" : "#f8fafc",
    color: isActive ? "#081527" : "#2c7be5",
    fontWeight: isActive ? "600" : "500",
    border: "1px solid #e2e8f0",
    opacity: unlocked ? 1 : 0.5,
    pointerEvents: unlocked ? "auto" : "none",
    cursor: unlocked ? "pointer" : "not-allowed",
  };
  return (
    <Link to={to} style={{ textDecoration: "none" }} onClick={handleClick}>
      <div style={linkStyle}><span>{label}</span></div>
    </Link>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    left: 0,
    height: "calc(100vh - 64px)",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #eef2f6",
    fontFamily: "Poppins, sans-serif",
    overflowY: "auto",
    overflowX: "hidden",
    transition: "width 0.3s ease, padding 0.3s ease",
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
    top: "72px",
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
    transition: "all 0.2s ease",
    borderRadius: "12px",
  },
};