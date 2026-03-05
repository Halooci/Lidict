import { useState } from "react";

export default function SidebarMateri() {
  const currentPath = window.location.pathname;

  // Tentukan accordion aktif berdasarkan URL
  const getDefaultAccordion = () => {
    if (currentPath === "/List") return "list";
    // if (currentPath.startsWith("/List")) return "list";
    if (currentPath.startsWith("/NestedList")) return "NestedList";
    if (currentPath.startsWith("/Dictionary")) return "dictionary";
    if (currentPath.startsWith("/Evaluasi")) return "evaluasi";
    return null;
  };

  const [activeAccordion, setActiveAccordion] = useState(
    getDefaultAccordion()
  );

  return (
    <aside style={styles.sidebar}>
      {/* <Accordion
        id="pendahuluan"
        title="Pendahuluan"
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      >
        <SubItem label="Pengantar" to="/Pengantar" />
      </Accordion> */}

      <Accordion
        id="list"
        title="List"
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      >
        <SubItem label="Pendahuluan List" to="/List/PendahuluanList" />
        <SubItem label="Pembuatan dan Akses Element" to="/List/PembuatanAksesElement"/>
        <SubItem label="Operasi dan Manipulasi" to="/List/OperasiDanManipulasi" />
        <SubItem label="Rangkuman List" to="/List/Rangkuman" />
        <SubItem label="Kuis List" to="/List/Kuis1" />
      </Accordion>

      <Accordion
        id="NestedList"
        title="Nested List"
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      >
        <SubItem label="Pendahuluan Nested List" to="/NestedList/PendahuluanNestedList" />
        <SubItem label="Pembuatan dan Akses Element Nested List" to="/NestedList/PembuatanAksesNestedList"/>
        <SubItem label="Operasi dan Manipulasi Nested List" to="/NestedList/OperasiDanManipulasiNestedList" />
        <SubItem label="Rangkuman Nested List" to="/NestedList/RangkumanNestedList" />
        <SubItem label="Kuis Nested List" to="/NestedList/KuisNestedList" />
      </Accordion>

      <Accordion
        id="dictionary"
        title="Dictionary"
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      >
        <SubItem label="Konsep Dasar Dictionary" to="/Dictionary/KonsepDasarDictionary" />
        <SubItem label="Pembuatan dan Akses Dictionary" to="/Dictionary/PembuatanAksesElementDictionary" />
        <SubItem label="Operasi Dasar Dictionary" to="/Dictionary/OperasiDasarDictionary" />
        <SubItem label="Rangkuman Dictionary" to="/Dictionary/RangkumanDictionary" />
        <SubItem label="Kuis Dictionary" to="/Dictionary/Kuis2" />
      </Accordion>

      <Accordion
        id="evaluasi"
        title="Evaluasi"
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      >
        <SubItem label="Evaluasi Akhir"  to="/EvaluasiAkhir" />
      </Accordion>
    </aside>
  );
}

/* ================= ACCORDION ================= */

function Accordion({
  id,
  title,
  children,
  activeAccordion,
  setActiveAccordion,
}) {
  const isOpen = activeAccordion === id;

  return (
    <div style={styles.accordion}>
      <div
        style={{
          ...styles.accordionHeader,
          backgroundColor: isOpen ? "#e8f1ff" : "#ffffff",
        }}
        onClick={() =>
          setActiveAccordion(isOpen ? null : id)
        }
      >
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && <div style={styles.accordionContent}>{children}</div>}
    </div>
  );
}

/* ================= SUB ITEM ================= */

function SubItem({ label, locked, to }) {
  return (
    <div
      style={{
        ...styles.subItem,
        cursor: locked ? "not-allowed" : "pointer",
        opacity: locked ? 0.6 : 1,
      }}
      onClick={() => {
        if (!locked && to) {
          window.location.href = to;
        }
      }}
    >
      <span>{label}</span>
      {locked && <span style={styles.lock}>🔒</span>}
    </div>
  );
}

/* ================= STYLE ================= */

const styles = {
  sidebar: {
    position: "fixed",
    top: "64px",
    left: 0,

    width: "280px",
    height: "calc(100vh - 64px)",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",

    padding: "10px",
    fontFamily: "Poppins, sans-serif",

    overflowY: "auto",
    overflowX: "hidden",
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
  },

  accordionContent: {
    padding: "8px 0",
    backgroundColor: "#fafafa",
  },

  subItem: {
    padding: "8px 18px",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#2c7be5",
  },

  lock: {
    fontSize: "14px",
  },
};
