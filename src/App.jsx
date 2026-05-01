import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { db } from "./config/firebase";
import { collection, getDocs } from "firebase/firestore";

import Landing from "./pages/Landing";
import LoginRegister from "./pages/LoginRegister";

import PetaKonsep from "./pages/materi/PetaKonsep/PetaKonsep";
import Apersepsi from "./pages/materi/PetaKonsep/Apersepsi";

// import Pengantar from "./pages/materi/pendahuluan/Pengantar";
import PendahuluanList from "./pages/materi/List/PendahuluanList";
import PembuatanAksesElement from "./pages/materi/List/PembuatanAksesElement";
import OperasiDanManipulasi from "./pages/materi/List/OperasiDanManipulasi";
import RangkumanList from "./pages/materi/List/RangkumanList";
import KuisList from "./pages/materi/List/KuisList";

import PendahuluanNestedList from "./pages/materi/NestedList/PendahuluanNestedList";
import PembuatanAksesNestedList from "./pages/materi/NestedList/PembuatanAksesNestedList";
import OperasiNestedList from "./pages/materi/NestedList/OperasiNestedList";
import RangkumanNestedList from "./pages/materi/NestedList/RangkumanNestedList";
import KuisNestedList from "./pages/materi/NestedList/KuisNestedList";

import PendahuluanDictionary from "./pages/materi/dictionary/PendahuluanDictionary";
import PembuatanAksesElementDictionary from "./pages/materi/dictionary/PembuatanAksesElementDictionary";
import ManipulasiDictionary from "./pages/materi/dictionary/ManipulasiDictionary";
import RangkumanDictionary from "./pages/materi/dictionary/RangkumanDictionary";
import KuisDictionary from "./pages/materi/dictionary/KuisDictionary";

import EvaluasiAkhir from "./pages/materi/evaluasi/EvaluasiAkhir";
import InformasiPage from "./pages/komponen/informasi/InformasiPage";

import DashboardDosen from "./pages/dosen/DashboardDosen";

function App() {
  // Cek koneksi Firestore (bisa dihapus nanti setelah yakin koneksi berhasil)
  useEffect(() => {
    const cekKoneksiFirestore = async () => {
      try {
        const testCollection = collection(db, "test");
        const snapshot = await getDocs(testCollection);
        console.log("✅ Firestore terhubung! Jumlah dokumen di koleksi 'test':", snapshot.size);
      } catch (error) {
        console.error("❌ Gagal koneksi ke Firestore:", error);
      }
    };
    cekKoneksiFirestore();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loginregister" element={<LoginRegister />} />
        {/* <Route path="/register" element={<LoginRegister />} /> */}
       

        <Route path="/PetaKonsep" element={<PetaKonsep />} />
        <Route path="/Apersepsi" element={<Apersepsi />} />
      
        
        {/* <Route path="/Pengantar" element={<Pengantar />} /> */}
        <Route path="/List/PendahuluanList" element={<PendahuluanList />} />
        <Route path="/List/PembuatanAksesElement" element={<PembuatanAksesElement />} />
        <Route path="/List/OperasiDanManipulasi" element={<OperasiDanManipulasi />} />
        <Route path="/List/RangkumanList" element={<RangkumanList />} />
        <Route path="/List/KuisList" element={<KuisList />} />

        <Route path="/NestedList/PendahuluanNestedList" element={<PendahuluanNestedList />} />
        <Route path="/NestedList/PembuatanAksesNestedList" element={<PembuatanAksesNestedList />} />
        <Route path="/NestedList/OperasiNestedList" element={<OperasiNestedList />} />
        <Route path="/NestedList/RangkumanNestedList" element={<RangkumanNestedList />} />
        <Route path="/NestedList/KuisNestedList" element={<KuisNestedList />} />

        <Route path="/Dictionary/PendahuluanDictionary" element={<PendahuluanDictionary />} />
        <Route path="/Dictionary/PembuatanAksesElementDictionary" element={<PembuatanAksesElementDictionary />} />
        <Route path="/Dictionary/ManipulasiDictionary" element={<ManipulasiDictionary />} />
        <Route path="/Dictionary/RangkumanDictionary" element={<RangkumanDictionary />} />
        <Route path="/Dictionary/KuisDictionary" element={<KuisDictionary />} />

        <Route path="/EvaluasiAkhir" element={<EvaluasiAkhir />} />
        <Route path="/InformasiPage" element={<InformasiPage />} />


        <Route path="/dashboard-dosen" element={<DashboardDosen />} />

        

      </Routes>
    </BrowserRouter>
  );
}

export default App;