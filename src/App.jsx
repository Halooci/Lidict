import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Materi1 from "./pages/materi/Materi1";
import Materi2 from "./pages/materi/Materi2";
// import Pengantar from "./pages/materi/pendahuluan/Pengantar";
import PendahuluanList from "./pages/materi/List/PendahuluanList";
import PembuatanAksesElement from "./pages/materi/List/PembuatanAksesElement";
import OperasiDanManipulasi from "./pages/materi/List/OperasiDanManipulasi";
import Rangkuman from "./pages/materi/List/Rangkuman";
import Kuis1 from "./pages/materi/List/Kuis1";

import PendahuluanNestedList from "./pages/materi/NestedList/PendahuluanNestedList";
import PembuatanAksesNestedList from "./pages/materi/NestedList/PembuatanAksesNestedList";
import OperasiDanManipulasiNestedList from "./pages/materi/NestedList/OperasiDanManipulasiNestedList";
import RangkumanNestedList from "./pages/materi/NestedList/RangkumanNestedList";
import KuisNestedList from "./pages/materi/NestedList/KuisNestedList";

import KonsepDasarDictionary from "./pages/materi/Dictionary/KonsepDasarDictionary";
import PembuatanAksesElementDictionary from "./pages/materi/Dictionary/PembuatanAksesElementDictionary";
import OperasiDasarDictionary from "./pages/materi/Dictionary/OperasiDasarDictionary";
import RangkumanDictionary from "./pages/materi/Dictionary/RangkumanDictionary";
import Kuis2 from "./pages/materi/Dictionary/Kuis2";
import EvaluasiAkhir from "./pages/materi/Evaluasi/EvaluasiAkhir";
import InformasiPage from "./pages/komponen/informasi/InformasiPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Materi1" element={<Materi1 />} />
        <Route path="/Materi2" element={<Materi2 />} />
        {/* <Route path="/Pengantar" element={<Pengantar />} /> */}
        <Route path="/List/PendahuluanList" element={<PendahuluanList />} />
        <Route path="/List/PembuatanAksesElement" element={<PembuatanAksesElement />} />
        <Route path="/List/OperasiDanManipulasi" element={<OperasiDanManipulasi />} />
        <Route path="/List/Rangkuman" element={<Rangkuman />} />
        <Route path="/List/Kuis1" element={<Kuis1 />} />

        <Route path="/NestedList/PendahuluanNestedList" element={<PendahuluanNestedList />} />
        <Route path="/NestedList/PembuatanAksesNestedList" element={<PembuatanAksesNestedList />} />
        <Route path="/NestedList/OperasiDanManipulasiNestedList" element={<OperasiDanManipulasiNestedList />} />
        <Route path="/NestedList/RangkumanNestedList" element={<RangkumanNestedList />} />
        <Route path="/NestedList/KuisNestedList" element={<KuisNestedList />} />

        <Route path="/Dictionary/KonsepDasarDictionary" element={<KonsepDasarDictionary />} />
        <Route path="/Dictionary/PembuatanAksesElementDictionary" element={<PembuatanAksesElementDictionary />} />
        <Route path="/Dictionary/OperasiDasarDictionary" element={<OperasiDasarDictionary />} />
        <Route path="/Dictionary/RangkumanDictionary" element={<RangkumanDictionary />} />
        <Route path="/Dictionary/Kuis2" element={<Kuis2 />} />
        <Route path="/EvaluasiAkhir" element={<EvaluasiAkhir />} />
        <Route path="/InformasiPage" element={<InformasiPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;