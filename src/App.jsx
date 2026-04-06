import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginRegister from "./pages/LoginRegister";
import Materi1 from "./pages/materi/Materi1";
import Materi2 from "./pages/materi/Materi2";
// import Pengantar from "./pages/materi/pendahuluan/Pengantar";
import PendahuluanList from "./pages/materi/List/PendahuluanList";
import PembuatanAksesElement from "./pages/materi/List/PembuatanAksesElement";
import OperasiDanManipulasi from "./pages/materi/List/OperasiDanManipulasi";
import RangkumanList from "./pages/materi/List/RangkumanList";
import KuisList from "./pages/materi/List/KuisList";

import PendahuluanNestedList from "./pages/materi/NestedList/PendahuluanNestedList";
import PembuatanAksesNestedList from "./pages/materi/NestedList/PembuatanAksesNestedList";
import OperasiDanManipulasiNestedList from "./pages/materi/NestedList/OperasiDanManipulasiNestedList";
import RangkumanNestedList from "./pages/materi/NestedList/RangkumanNestedList";
import KuisNestedList from "./pages/materi/NestedList/KuisNestedList";

import PendahuluanDictionary from "./pages/materi/dictionary/PendahuluanDictionary";
// import { PendahuluanDiction } from "./pages/materi/dictionary/PendahuluanDiction";
import PembuatanAksesElementDictionary from "./pages/materi/dictionary/PembuatanAksesElementDictionary";
import ManipulasiDictionary from "./pages/materi/dictionary/ManipulasiDictionary";
import RangkumanDictionary from "./pages/materi/dictionary/RangkumanDictionary";
import KuisDictionary from "./pages/materi/dictionary/KuisDictionary";

import EvaluasiAkhir from "./pages/materi/evaluasi/EvaluasiAkhir";
import InformasiPage from "./pages/komponen/informasi/InformasiPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loginregister" element={<LoginRegister />} />
        {/* <Route path="/register" element={<LoginRegister />} /> */}
        <Route path="/Materi1" element={<Materi1 />} />
        <Route path="/Materi2" element={<Materi2 />} />
        {/* <Route path="/Pengantar" element={<Pengantar />} /> */}
        <Route path="/List/PendahuluanList" element={<PendahuluanList />} />
        <Route path="/List/PembuatanAksesElement" element={<PembuatanAksesElement />} />
        <Route path="/List/OperasiDanManipulasi" element={<OperasiDanManipulasi />} />
        <Route path="/List/RangkumanList" element={<RangkumanList />} />
        <Route path="/List/KuisList" element={<KuisList />} />

        <Route path="/NestedList/PendahuluanNestedList" element={<PendahuluanNestedList />} />
        <Route path="/NestedList/PembuatanAksesNestedList" element={<PembuatanAksesNestedList />} />
        <Route path="/NestedList/OperasiDanManipulasiNestedList" element={<OperasiDanManipulasiNestedList />} />
        <Route path="/NestedList/RangkumanNestedList" element={<RangkumanNestedList />} />
        <Route path="/NestedList/KuisNestedList" element={<KuisNestedList />} />

        <Route path="/Dictionary/PendahuluanDictionary" element={<PendahuluanDictionary />} />
        <Route path="/Dictionary/PembuatanAksesElementDictionary" element={<PembuatanAksesElementDictionary />} />
        <Route path="/Dictionary/ManipulasiDictionary" element={<ManipulasiDictionary />} />
        <Route path="/Dictionary/RangkumanDictionary" element={<RangkumanDictionary />} />
        <Route path="/Dictionary/KuisDictionary" element={<KuisDictionary />} />

        <Route path="/EvaluasiAkhir" element={<EvaluasiAkhir />} />
        <Route path="/InformasiPage" element={<InformasiPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;