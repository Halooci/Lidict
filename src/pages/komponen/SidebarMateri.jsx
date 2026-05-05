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

  // Ambil progres dari Firestore jika mahasiswa
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    setUserRole(role);

    if (role === "mahasiswa" && userId) {
      const fetchProgres = async () => {
        try {
          const docRef = doc(db, "mahasiswa", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProgres(data.progres_belajar ?? 0);
          }
        } catch (error) {
          console.error("Gagal ambil progres:", error);
        }
      };
      fetchProgres();
    } else if (role === "dosen") {
      setProgres(999); // Dosen akses semua
    }
  }, []);

  // Tentukan accordion aktif berdasarkan URL
  const getDefaultAccordion = () => {
    if (currentPath.startsWith("/List")) return "list";
    if (currentPath.startsWith("/NestedList")) return "NestedList";
    if (currentPath.startsWith("/Dictionary")) return "dictionary";
    if (currentPath.startsWith("/Evaluasi")) return "evaluasi";
    if (currentPath.startsWith("/PetaKonsep")) return "petaKonsep";
    return null;
  };

  const [activeAccordion, setActiveAccordion] = useState(getDefaultAccordion());

  // Efek untuk margin konten utama
  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.style.marginLeft = isSidebarOpen ? "280px" : "0";
      mainContent.style.transition = "margin-left 0.3s ease";
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fungsi pengecekan apakah suatu sub item dapat diakses
  const isUnlocked = (requiredLevel) => progres >= requiredLevel;

  return (
    <>
      {!isSidebarOpen && (
        <button onClick={toggleSidebar} style={styles.floatingHamburger}>
          ☰
        </button>
      )}

      <aside
        style={{
          ...styles.sidebar,
          width: isSidebarOpen ? "280px" : "0",
          padding: isSidebarOpen ? "10px" : "0",
          overflow: isSidebarOpen ? "auto" : "hidden",
        }}
      >
        {isSidebarOpen && (
          <div style={styles.hamburgerInside} onClick={toggleSidebar}>
            ☰
          </div>
        )}

        {/* ========= PETA KONSEP (level 0) ========= */}
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
            requiredLevel={0}
            unlocked={isUnlocked(0)}
          />
          <SubItem
            label="Apersepsi"
            to="/Apersepsi"
            currentPath={currentPath}
            requiredLevel={0}
            unlocked={isUnlocked(0)}
          />
        </Accordion>

        {/* ========= LIST ========= */}
        <Accordion
          id="list"
          title="List"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          <SubItem
            label="Pendahuluan List"
            to="/List/PendahuluanList"
            currentPath={currentPath}
            requiredLevel={1}
            unlocked={isUnlocked(1)}
          />
          <SubItem
            label="Pembuatan dan Akses Elemen"
            to="/List/PembuatanAksesElement"
            currentPath={currentPath}
            requiredLevel={2}
            unlocked={isUnlocked(2)}
          />
          <SubItem
            label="Operasi dan Manipulasi"
            to="/List/OperasiDanManipulasi"
            currentPath={currentPath}
            requiredLevel={3}
            unlocked={isUnlocked(3)}
          />
          <SubItem
            label="Rangkuman List"
            to="/List/RangkumanList"
            currentPath={currentPath}
            requiredLevel={4}
            unlocked={isUnlocked(4)}
          />
          <SubItem
            label="Kuis List"
            to="/List/KuisList"
            currentPath={currentPath}
            requiredLevel={4}
            unlocked={isUnlocked(4)}
          />
        </Accordion>

        {/* ========= NESTED LIST ========= */}
        <Accordion
          id="NestedList"
          title="Nested List"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          <SubItem
            label="Pendahuluan Nested List"
            to="/NestedList/PendahuluanNestedList"
            currentPath={currentPath}
            requiredLevel={5}
            unlocked={isUnlocked(5)}
          />
          <SubItem
            label="Pembuatan dan Akses Elemen Nested List"
            to="/NestedList/PembuatanAksesNestedList"
            currentPath={currentPath}
            requiredLevel={6}
            unlocked={isUnlocked(6)}
          />
          <SubItem
            label="Operasi dan Manipulasi Nested List"
            to="/NestedList/OperasiNestedList"
            currentPath={currentPath}
            requiredLevel={7}
            unlocked={isUnlocked(7)}
          />
          <SubItem
            label="Rangkuman Nested List"
            to="/NestedList/RangkumanNestedList"
            currentPath={currentPath}
            requiredLevel={8}
            unlocked={isUnlocked(8)}
          />
          <SubItem
            label="Kuis Nested List"
            to="/NestedList/KuisNestedList"
            currentPath={currentPath}
            requiredLevel={8}
            unlocked={isUnlocked(8)}
          />
        </Accordion>

        {/* ========= DICTIONARY ========= */}
        <Accordion
          id="dictionary"
          title="Dictionary"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          <SubItem
            label="Pendahuluan Dictionary"
            to="/Dictionary/PendahuluanDictionary"
            currentPath={currentPath}
            requiredLevel={9}
            unlocked={isUnlocked(9)}
          />
          <SubItem
            label="Pembuatan dan Akses Dictionary"
            to="/Dictionary/PembuatanAksesElementDictionary"
            currentPath={currentPath}
            requiredLevel={10}
            unlocked={isUnlocked(10)}
          />
          <SubItem
            label="Manipulasi Dictionary"
            to="/Dictionary/ManipulasiDictionary"
            currentPath={currentPath}
            requiredLevel={11}
            unlocked={isUnlocked(11)}
          />
          <SubItem
            label="Rangkuman Dictionary"
            to="/Dictionary/RangkumanDictionary"
            currentPath={currentPath}
            requiredLevel={12}
            unlocked={isUnlocked(12)}
          />
          <SubItem
            label="Kuis Dictionary"
            to="/Dictionary/KuisDictionary"
            currentPath={currentPath}
            requiredLevel={12}
            unlocked={isUnlocked(12)}
          />
        </Accordion>

        {/* ========= EVALUASI ========= */}
        <Accordion
          id="evaluasi"
          title="Evaluasi"
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
        >
          <SubItem
            label="Evaluasi Akhir"
            to="/EvaluasiAkhir"
            currentPath={currentPath}
            requiredLevel={13}
            unlocked={isUnlocked(13)}
          />
        </Accordion>
      </aside>
    </>
  );
}

// Komponen Accordion (tetap bisa dibuka)
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

// Komponen SubItem dengan sistem kunci per sub
function SubItem({ label, to, currentPath, requiredLevel, unlocked }) {
  const isActive = currentPath === to;

  const handleClick = (e) => {
    if (!unlocked) {
      e.preventDefault();
      alert(`Materi "${label}" membutuhkan progres level ${requiredLevel}. Level Anda saat ini ${localStorage.getItem("userRole") === "mahasiswa" ? require("../firebase").getDoc ? "..." : "belum cukup" : "? "}Selesaikan materi sebelumnya terlebih dahulu.`);
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
      <div style={linkStyle}>
        <span>{label}</span>
      </div>
    </Link>
  );
}

// Styles (sama seperti sebelumnya)
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