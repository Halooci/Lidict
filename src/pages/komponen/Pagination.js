

export const daftarMateri = [
    // ===== PETA KONSEP & PENGANTAR (Bab: Pendahuluan) =====
    {
      id: 'peta-konsep',
      label: 'Peta Konsep',
      path: '/PetaKonsep',
      level: 0,
      bab: 'Pendahuluan',
    },
    {
      id: 'apersepsi',
      label: 'Pengantar',
      path: '/Apersepsi',
      level: 0,
      bab: 'Pendahuluan',
    },
  
    // ===== LIST (Bab: List) =====
    {
      id: 'pendahuluan-list',
      label: 'Pendahuluan List',
      path: '/List/PendahuluanList',
      level: 1,
      bab: 'List',
    },
    {
      id: 'pembuatan-akses-list',
      label: 'Pembuatan dan Akses Elemen List',
      path: '/List/PembuatanAksesElement',
      level: 2,
      bab: 'List',
    },
    {
      id: 'operasi-manipulasi-list',
      label: 'Operasi dan Manipulasi List',
      path: '/List/OperasiDanManipulasi',
      level: 3,
      bab: 'List',
    },
    {
      id: 'rangkuman-list',
      label: 'Rangkuman List',
      path: '/List/RangkumanList',
      level: 4,
      bab: 'List',
    },
    {
      id: 'kuis-list',
      label: 'Kuis List',
      path: '/List/KuisList',
      level: 4,
      bab: 'List',
    },
  
    // ===== NESTED LIST (Bab: Nested List) =====
    {
      id: 'pendahuluan-nested',
      label: 'Pendahuluan Nested List',
      path: '/NestedList/PendahuluanNestedList',
      level: 5,
      bab: 'Nested List',
    },
    {
      id: 'pembuatan-akses-nested',
      label: 'Pembuatan dan Akses Elemen Nested List',
      path: '/NestedList/PembuatanAksesNestedList',
      level: 6,
      bab: 'Nested List',
    },
    {
      id: 'operasi-nested',
      label: 'Operasi dan Manipulasi Nested List',
      path: '/NestedList/OperasiNestedList',
      level: 7,
      bab: 'Nested List',
    },
    {
      id: 'rangkuman-nested',
      label: 'Rangkuman Nested List',
      path: '/NestedList/RangkumanNestedList',
      level: 8,
      bab: 'Nested List',
    },
    {
      id: 'kuis-nested',
      label: 'Kuis Nested List',
      path: '/NestedList/KuisNestedList',
      level: 8,
      bab: 'Nested List',
    },
  
    // ===== DICTIONARY (Bab: Dictionary) =====
    {
      id: 'pendahuluan-dict',
      label: 'Pendahuluan Dictionary',
      path: '/Dictionary/PendahuluanDictionary',
      level: 9,
      bab: 'Dictionary',
    },
    {
      id: 'pembuatan-akses-dict',
      label: 'Pembuatan dan Akses Dictionary',
      path: '/Dictionary/PembuatanAksesElementDictionary',
      level: 10,
      bab: 'Dictionary',
    },
    {
      id: 'manipulasi-dict',
      label: 'Manipulasi Dictionary',
      path: '/Dictionary/ManipulasiDictionary',
      level: 11,
      bab: 'Dictionary',
    },
    {
      id: 'rangkuman-dict',
      label: 'Rangkuman Dictionary',
      path: '/Dictionary/RangkumanDictionary',
      level: 12,
      bab: 'Dictionary',
    },
    {
      id: 'kuis-dict',
      label: 'Kuis Dictionary',
      path: '/Dictionary/KuisDictionary',
      level: 12,
      bab: 'Dictionary',
    },
  
    // ===== EVALUASI (Bab: Evaluasi) =====
    {
      id: 'evaluasi-akhir',
      label: 'Evaluasi Akhir',
      path: '/EvaluasiAkhir',
      level: 13,
      bab: 'Evaluasi',
    },
  ];
  
  // --- Fungsi bantu untuk pagination per bab ---
  
  // Mengelompokkan materi berdasarkan bab
  export const getMateriPerBab = () => {
    const grouped = {};
    daftarMateri.forEach((item) => {
      if (!grouped[item.bab]) grouped[item.bab] = [];
      grouped[item.bab].push(item);
    });
    return grouped;
  };
  
  // Mendapatkan indeks materi dalam bab-nya sendiri
  export const getIndexInBab = (path) => {
    const grouped = getMateriPerBab();
    for (const bab in grouped) {
      const items = grouped[bab];
      const idx = items.findIndex((item) => item.path === path);
      if (idx !== -1) {
        return { bab, items, index: idx };
      }
    }
    return null;
  };
  
  // Mendapatkan materi sebelumnya dalam bab yang sama
  export const getPrevMateriInBab = (currentPath) => {
    const result = getIndexInBab(currentPath);
    if (!result) return null;
    const { items, index } = result;
    if (index > 0) return items[index - 1];
    return null;
  };
  
  // Mendapatkan materi selanjutnya dalam bab yang sama
  export const getNextMateriInBab = (currentPath) => {
    const result = getIndexInBab(currentPath);
    if (!result) return null;
    const { items, index } = result;
    if (index < items.length - 1) return items[index + 1];
    return null;
  };