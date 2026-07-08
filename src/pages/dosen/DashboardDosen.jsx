import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import Navbar from '../komponen/Navbar';
import SidebarDosen from './SidebarDosen';
import {
  Copy,
  CheckCircle,
  LogOut,
  Users,
  ClipboardList,
  Save,
  BookOpen,
  PlusCircle,
  X,
  UserPlus,
  Trash2,
  Edit,
} from 'lucide-react';

// ==================== STYLES ====================
const styles = `
  .dashboard-content {
    margin-left: 250px;
    min-height: 100vh;
    background: #f3f4f6;
  }
  .content-inner {
    padding: 2rem;
    padding-top: 80px;
    max-width: 1280px;
    margin: 0 auto;
  }
  .card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 1.5rem;
    padding: 1.5rem;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .card-subtitle {
    color: #6b7280;
    margin-top: 0.25rem;
  }
  .token-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }
  .token-code {
    background: #f3f4f6;
    font-family: monospace;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    letter-spacing: 1px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }
  .btn-blue { background: #3b82f6; color: white; }
  .btn-blue:hover { background: #2563eb; }
  .btn-green { background: #10b981; color: white; }
  .btn-green:hover { background: #059669; }
  .btn-red { background: #ef4444; color: white; }
  .btn-red:hover { background: #dc2626; }
  .btn-outline {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
  }
  .btn-outline:hover { background: #f3f4f6; }
  .kkm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .kkm-item label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }
  .kkm-item input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  .logout-btn {
    background: #ef4444;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    border: none;
  }
  .logout-btn:hover { background: #dc2626; }
  .kelas-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .kelas-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: space-between;
  }
  .kelas-btn {
    background: white;
    border: 1px solid #d1d5db;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    flex: 1;
    text-align: left;
  }
  .kelas-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
  }
  .modal-close {
    position: absolute;
    top: 1rem; right: 1rem;
    cursor: pointer;
    color: #6b7280;
  }
  .modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: #374151;
  }
  .form-group input, .form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  .dosen-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }
  .dosen-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #f3f4f6;
  }
  .loading-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-size: 1.25rem;
    color: #4b5563;
  }
`;

// ==================== HELPER COMPONENT (Nilai Cell) ====================
const NilaiCell = ({ nim, jenis }) => {
  const [nilai, setNilai] = useState(null);

  useEffect(() => {
    const fetchNilai = async () => {
      if (!nim) return;
      const nilaiRef = doc(db, 'nilai', nim);
      const nilaiSnap = await getDoc(nilaiRef);
      if (nilaiSnap.exists()) {
        const data = nilaiSnap.data();
        setNilai(data[jenis] ?? '-');
      } else {
        setNilai('-');
      }
    };
    fetchNilai();
  }, [nim, jenis]);

  return <span style={{ display: 'inline-block' }}>{nilai !== null ? (nilai === null || nilai === undefined ? '-' : nilai) : '...'}</span>;
};

// ==================== FUNGSI GENERATE TOKEN ====================
const generateRandomToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// ==================== DATA SOAL DEFAULT ====================
const getDefaultQuizzes = () => [
  {
    judul: 'Kuis List',
    tipe: 'list',
    soal: [
      {
        pertanyaan: 'Cara membuat list kosong yang benar adalah ....',
        pilihan: ['list = ()', 'list = []', 'list = {}', 'list = list[]', 'list = empty()'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: "Output dari kode berikut adalah ….\nbuah = ['apel', 'mangga', 'jeruk']\nprint(buah[-1])",
        pilihan: ['apel', 'mangga', 'jeruk', 'Error', 'None'],
        jawaban_benar: 2,
        bobot: 10,
      },
      {
        pertanyaan: 'Perhatikan kode berikut:\nangka = [10, 20, 30, 40, 50]\nprint(angka[1:4])\nOutputnya adalah ...',
        pilihan: ['[10, 20, 30]', '[20, 30, 40]', '[20, 30, 40, 50]', '[10, 20, 30, 40]', '[30, 40, 50]'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: 'Method yang digunakan untuk menambahkan elemen di akhir list adalah ....',
        pilihan: ['insert()', 'extend()', 'add()', 'append()', 'push()'],
        jawaban_benar: 3,
        bobot: 10,
      },
      {
        pertanyaan: 'Hasil dari kode berikut adalah ….\na = [1, 2, 3]\nb = a\na.append(4)\nprint(b)',
        pilihan: ['[1, 2, 3]', '[1, 2, 3, 4]', 'Error', '[1, 2, 3, 4, 4]', 'None'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: "Elemen ke 3 dari list warna = ['merah', 'kuning', 'hijau', 'biru'] memiliki indeks ....",
        pilihan: ['0', '1', '2', '3', '4'],
        jawaban_benar: 2,
        bobot: 10,
      },
      {
        pertanyaan: "Perintah yang benar untuk mengubah elemen pertama list bahasa = ['Java', 'C++', 'JavaScript'] menjadi 'Python' adalah ....",
        pilihan: ["bahasa[0] = 'Python'", "bahasa[1] = 'Python'", "bahasa[-1] = 'Python'", "bahasa.append('Python')", "bahasa.insert(0, 'Python')"],
        jawaban_benar: 0,
        bobot: 10,
      },
      {
        pertanyaan: 'Method yang tepat untuk menggabungkan list2 ke dalam list1 sehingga list1 berisi semua elemen dari kedua list adalah ....',
        pilihan: ['append()', 'extend()', 'merge()', 'join()', 'add()'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: "Perintah yang tepat untuk menghapus elemen terakhir dari list buah = ['apel', 'mangga', 'jeruk'] dan mengembalikan nilai elemen tersebut adalah ....",
        pilihan: ['buah.pop()', 'buah.remove(-1)', 'buah.del[-1]', 'buah.pop(-1)', 'buah.delete()'],
        jawaban_benar: 0,
        bobot: 10,
      },
      {
        pertanyaan: "Perintah yang tepat untuk menghapus elemen 'mangga' dari list buah = ['apel', 'mangga', 'jeruk'] adalah ....",
        pilihan: ["buah.pop('mangga')", "buah.remove('mangga')", "del buah['mangga']", "buah.delete('mangga')", "buah.discard('mangga')"],
        jawaban_benar: 1,
        bobot: 10,
      },
      // SOAL ESAI dengan jawaban benar
      {
        pertanyaan: "Buatlah list bernama 'buah' yang berisi 'apel', 'anggur', dan 'jeruk'.",
        pilihan: [],
        jawaban_benar: "buah = ['apel', 'anggur', 'jeruk']",
        bobot: 10,
        isEssay: true,
      },
    ],
  },
  {
    judul: 'Kuis Nested List',
    tipe: 'nested_list',
    soal: [
      {
        pertanyaan: 'Cara mengakses angka 30 dari nested list berikut adalah ….\ndata = [[10, 20], [30, 40]]',
        pilihan: ['data[0][1]', 'data[1][0]', 'data[1][1]', 'data[0][0]', 'data[2][0]'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: 'Output dari kode berikut adalah ….\nmatrix = [[1,2,3],[4,5,6],[7,8,9]]\nprint(matrix[1][2])',
        pilihan: ['2', '4', '5', '6', '8'],
        jawaban_benar: 3,
        bobot: 10,
      },
      {
        pertanyaan: 'Perhatikan kode berikut:\nnested = [[1], [2, 3], [4, 5, 6]]\nprint(len(nested[1]))\nOutputnya adalah ....',
        pilihan: ['1', '2', '3', '4', 'Error'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: 'Pernyataan berikut yang BENAR tentang nested list di Python adalah ....',
        pilihan: ['Nested list hanya bisa memiliki 2 tingkat kedalaman', 'Setiap elemen dalam nested list harus memiliki tipe data yang sama', 'Nested list dapat diakses menggunakan beberapa indeks berurutan', 'Nested list tidak dapat diubah setelah dibuat', 'Nested list hanya bisa berisi angka'],
        jawaban_benar: 2,
        bobot: 10,
      },
      {
        pertanyaan: 'Hasil dari kode berikut adalah ....\nlst = [[0] * 3] * 3\nlst[0][1] = 5\nprint(lst)',
        pilihan: ['[[0,5,0],[0,0,0],[0,0,0]]', '[[0,5,0],[0,5,0],[0,5,0]]', '[[0,0,0],[0,5,0],[0,0,0]]', 'Error', '[[5,0,0],[0,0,0],[0,0,0]]'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: 'Diberikan nested list nilai = [[80, 90], [70, 85]]. Perintah yang benar untuk mengakses nilai 85 adalah ....',
        pilihan: ['nilai[0][1]', 'nilai[1][0]', 'nilai[1][1]', 'nilai[2][1]', 'nilai[1][2]'],
        jawaban_benar: 2,
        bobot: 10,
      },
      {
        pertanyaan: 'Diberikan nested list data = [[1,2],[3,4],[5,6,7]]. Perintah yang benar untuk mengakses angka tujuh adalah ....',
        pilihan: ['data[2][2]', 'data[3][0]', 'data[2][1]', 'data[1][2]', 'data[2][3]'],
        jawaban_benar: 0,
        bobot: 10,
      },
      {
        pertanyaan: 'Perhatikan kode berikut:\nmatrix = [[1, 2], [3, 4]]\nmatrix[0].append(5)\nprint(matrix)\nOutput dari kode diatas adalah ....',
        pilihan: ['[[1,2,5],[3,4]]', '[[1,2],[3,4,5]]', '[[1,2,5],[3,4,5]]', '[[1,2],[3,4]]', 'Error'],
        jawaban_benar: 0,
        bobot: 10,
      },
      {
        pertanyaan: 'Diberikan matrix = [[1,2],[3,4]]. Perintah untuk menambahkan angka 99 ke dalam sublist kedua (indeks 1) adalah ....',
        pilihan: ['matrix[0].append(99)', 'matrix[1].append(99)', 'matrix[2].append(99)', 'matrix[-1].append(99)', 'matrix.append(99)'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: 'Cara yang benar untuk membuat nested list dengan isi baris pertama [1,2] dan baris kedua [3,4] secara manual adalah ....',
        pilihan: ['matrix = [1,2,3,4]', 'matrix = [[1,2],[3,4]]', 'matrix = [(1,2),(3,4)]', 'matrix = [[1,2,3,4]]', 'matrix = [1,2],[3,4]'],
        jawaban_benar: 1,
        bobot: 10,
      },
      // SOAL ESAI dengan jawaban benar
      {
        pertanyaan: "Buatlah nested list bernama 'matriks' dengan baris pertama [5,6] dan baris kedua [7,8].",
        pilihan: [],
        jawaban_benar: "matriks = [[5, 6], [7, 8]]",
        bobot: 10,
        isEssay: true,
      },
    ],
  },
  {
    judul: 'Kuis Dictionary',
    tipe: 'dictionary',
    soal: [
      {
        pertanyaan: 'Pernyataan yang BENAR tentang dictionary di Python adalah ...',
        pilihan: ['Dictionary dapat diakses menggunakan indeks angka seperti list', 'Key dalam dictionary harus bersifat unik dan immutable', 'Dictionary tidak dapat diubah setelah dibuat (immutable)', 'Dictionary hanya bisa menyimpan tipe data string sebagai value', 'Key dalam dictionary boleh berupa list'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: "Output dari kode berikut adalah ….\ndata = {'a': 1, 'b': 2, 'c': 3}\nprint(data.get('d', 0))",
        pilihan: ['None', 'Error', '0', "'d'", '3'],
        jawaban_benar: 2,
        bobot: 10,
      },
      {
        pertanyaan: 'Metode yang digunakan untuk menggabungkan dua dictionary adalah ...',
        pilihan: ['merge()', 'combine()', 'update()', 'join()', 'concat()'],
        jawaban_benar: 2,
        bobot: 10,
      },
      {
        pertanyaan: "Perhatikan kode berikut:\ndata = {'a': 1, 'b': 2, 'c': 3}\ndata['b'] = 99\nprint(data['b'])\nOutputnya adalah ...",
        pilihan: ['1', '2', '3', '99', 'Error'],
        jawaban_benar: 3,
        bobot: 10,
      },
      {
        pertanyaan: 'Cara yang benar untuk menghapus semua item dalam dictionary data adalah ...',
        pilihan: ['data.removeAll()', 'data.delete()', 'data.clear()', 'data.popall()', 'del data'],
        jawaban_benar: 2,
        bobot: 10,
      },
      {
        pertanyaan: "Perhatikan kode berikut:\nnilai = {'fisika': 85, 'kimia': 90, 'matematika': 95}\nprint(nilai['biologi'])\nMaka outputnya adalah ….",
        pilihan: ['None', '0', "Error KeyError karena key 'biologi' tidak ditemukan", "'biologi'", '95'],
        jawaban_benar: 2,
        bobot: 10,
      },
      {
        pertanyaan: 'Method dictionary yang digunakan untuk mengembalikan nilai dari suatu key, dan jika key tidak ada mengembalikan nilai default (tanpa error) adalah ....',
        pilihan: ['get()', 'pop()', 'setdefault()', 'items()', 'values()'],
        jawaban_benar: 0,
        bobot: 10,
      },
      {
        pertanyaan: "Perintah untuk menghapus key 'mangga' dari dictionary buah = {'apel': 5000, 'mangga': 8000, 'jeruk': 6000} sekaligus mengembalikan nilainya adalah ....",
        pilihan: ["buah.del('mangga')", "buah.pop('mangga')", "buah.remove('mangga')", "del buah['mangga']", "buah.popitem('mangga')"],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: 'Method dictionary yang menghapus dan mengembalikan pasangan (key, value) terakhir yang ditambahkan adalah ....',
        pilihan: ['pop()', 'popitem()', 'clear()', 'del', 'remove()'],
        jawaban_benar: 1,
        bobot: 10,
      },
      {
        pertanyaan: 'Perintah untuk menggabungkan dictionary b ke dalam dictionary a (memperbarui atau menambah) adalah ....',
        pilihan: ['a.merge(b)', 'a.extend(b)', 'a.append(b)', 'a.update(b)', 'a+b'],
        jawaban_benar: 3,
        bobot: 10,
      },
      // SOAL ESAI dengan jawaban benar
      {
        pertanyaan: "Buatlah dictionary bernama 'data' dengan key 'nama' bernilai 'Budi' dan key 'usia' bernilai 20.",
        pilihan: [],
        jawaban_benar: "data = {'nama': 'Budi', 'usia': 20}",
        bobot: 10,
        isEssay: true,
      },
    ],
  },
  {
    judul: 'Evaluasi',
    tipe: 'evaluasi',
    soal: [
      {
        pertanyaan: 'Perhatikan pernyataan tentang list pada Python:\n(1) List dapat menyimpan elemen dengan tipe data berbeda.\n(2) List bersifat immutable (tidak bisa diubah).\n(3) List didefinisikan dengan tanda kurung siku [].\n(4) Elemen list dapat diakses menggunakan indeks mulai dari 0.\nPernyataan yang benar adalah ….',
        pilihan: ['(1), (2), dan (3)', '(1), (3), dan (4)', '(2) dan (4)', '(1), (2), dan (4)', 'Semua benar'],
        jawaban_benar: 1,
        bobot: 5,
      },
      {
        pertanyaan: "Diberikan kode berikut:\nbuah = ['apel', 'pisang', 'jeruk', 'mangga']\nprint(buah[-2])\nOutput yang dihasilkan adalah ….",
        pilihan: ['apel', 'pisang', 'jeruk', 'mangga', 'Error'],
        jawaban_benar: 2,
        bobot: 5,
      },
      {
        pertanyaan: 'Cara yang tepat untuk membuat list berisi angka 1, 2, 3, 4, 5 secara berurutan adalah ….',
        pilihan: ['list(1,2,3,4,5)', '[1;2;3;4;5]', '{1,2,3,4,5}', '[1,2,3,4,5]', '(1,2,3,4,5)'],
        jawaban_benar: 3,
        bobot: 5,
      },
      {
        pertanyaan: 'Perhatikan potongan kode berikut:\nnilai = [80, 75, 90, 85]\nnilai.append(95)\nnilai.insert(1, 70)\nPanjang list nilai setelah kedua operasi tersebut adalah ….',
        pilihan: ['4', '5', '6', '7', 'Error'],
        jawaban_benar: 2,
        bobot: 5,
      },
      {
        pertanyaan: 'Method yang paling tepat digunakan untuk menghapus elemen terakhir dari list sekaligus mengembalikan nilainya adalah ….',
        pilihan: ['remove()', 'pop()', 'delete()', 'discard()', 'clear()'],
        jawaban_benar: 1,
        bobot: 5,
      },
      {
        pertanyaan: 'Analisislah kode berikut:\ndata = [3, 1, 4, 1, 5]\ndata.sort(reverse=True)\nprint(data[2])\nOutput yang dihasilkan adalah ….',
        pilihan: ['1', '4', '3', '5', 'Error'],
        jawaban_benar: 2,
        bobot: 5,
      },
      {
        pertanyaan: 'Operasi yang menghasilkan list baru [10, 20, 30, 40] jika diketahui list awal a = [10, 20, 30] adalah ….',
        pilihan: ['a.append(40)', 'a + [40]', 'a.extend([40])', 'a.insert(3, 40)', 'a.add(40)'],
        jawaban_benar: 1,
        bobot: 5,
      },
      {
        pertanyaan: 'Yang dimaksud dengan nested list dalam Python adalah ….',
        pilihan: ['List yang hanya berisi tipe data numerik', 'List yang di dalamnya terdapat list lain sebagai elemen', 'List yang didefinisikan di dalam fungsi', 'List yang tidak memiliki indeks', 'List yang hanya memiliki satu elemen'],
        jawaban_benar: 1,
        bobot: 5,
      },
      {
        pertanyaan: 'Diberikan nested list:\nmatrix = [[1,2,3], [4,5,6], [7,8,9]]\nCara mengakses angka 5 adalah ….',
        pilihan: ['matrix[1][1]', 'matrix[2][1]', 'matrix[1][2]', 'matrix[2][2]', 'matrix[0][1]'],
        jawaban_benar: 0,
        bobot: 5,
      },
      {
        pertanyaan: 'Kode yang benar untuk membuat nested list dengan tiga baris dan dua kolom, semua elemen bernilai 0 adalah ….',
        pilihan: ['[[0]*2]*3', '[[0 for _ in range(2)] for _ in range(3)]', '[0,0] * 3', 'A dan B benar', 'Hanya B yang benar'],
        jawaban_benar: 4,
        bobot: 5,
      },
      {
        pertanyaan: 'Perhatikan kode berikut:\nA = [[1,2], [3,4]]\nB = A[0]\nB.append(5)\nprint(A)\nOutput yang dihasilkan adalah ….',
        pilihan: ['[[1,2],[3,4]]', '[[1,2,5],[3,4]]', 'Error', '[[1,2],[3,4,5]]', '[[1,2,5],[3,4,5]]'],
        jawaban_benar: 1,
        bobot: 5,
      },
      {
        pertanyaan: "Jika diketahui nested list data = [['a','b'], ['c','d'], ['e','f']], maka perintah yang akan mengubah elemen 'd' menjadi 'z' adalah ….",
        pilihan: ["data[1][1] = 'z'", "data[2][1] = 'z'", "data[1][2] = 'z'", "data[2][2] = 'z'", "data[0][1] = 'z'"],
        jawaban_benar: 0,
        bobot: 5,
      },
      {
        pertanyaan: 'Pernyataan berikut yang tepat tentang operasi pada nested list adalah ….',
        pilihan: ['Kita dapat menggunakan perulangan bersarang (nested loop) untuk mengakses setiap elemen', 'Nested list tidak bisa digabung dengan operator +', 'Method append() hanya dapat menambah elemen di level paling luar', 'Nested list bersifat immutable seperti string', 'Semua pernyataan salah'],
        jawaban_benar: 0,
        bobot: 5,
      },
      {
        pertanyaan: 'Analisislah kode berikut:\nmatrix = [[i*j for j in range(3)] for i in range(2)]\nprint(matrix[1][2])\nOutput yang dihasilkan adalah ….',
        pilihan: ['0', '1', '2', '3', 'Error'],
        jawaban_benar: 2,
        bobot: 5,
      },
      {
        pertanyaan: 'Pernyataan yang benar tentang dictionary di Python adalah ….',
        pilihan: ['Dictionary menyimpan data dalam pasangan key-value', 'Key dalam dictionary harus unik dan immutable', 'Dictionary didefinisikan dengan tanda kurung siku []', 'A dan B benar', 'Semua benar'],
        jawaban_benar: 3,
        bobot: 5,
      },
      {
        pertanyaan: "Diberikan kode:\nsiswa = {'nama': 'Andi', 'umur': 17}\nprint(siswa.get('kelas', 'Tidak ada'))\nOutput yang dihasilkan adalah ….",
        pilihan: ['Error', 'None', 'Tidak ada', 'kelas', "'' (string kosong)"],
        jawaban_benar: 2,
        bobot: 5,
      },
      {
        pertanyaan: "Cara yang benar untuk mengubah nilai dari key 'hobi' menjadi 'membaca' pada dictionary profil = {'nama': 'Budi', 'hobi': 'berenang'} adalah ….",
        pilihan: ["profil['hobi'] = 'membaca'", "profil.update(hobi='membaca')", "profil.setdefault('hobi', 'membaca')", 'A dan B benar', 'Hanya A yang benar'],
        jawaban_benar: 3,
        bobot: 5,
      },
      {
        pertanyaan: "Perhatikan kode berikut:\ndata = {'a':1, 'b':2, 'c':3}\ndel data['b']\ndata['d'] = 4\nprint(len(data))\nOutputnya adalah ….",
        pilihan: ['2', '3', '4', 'Error', '5'],
        jawaban_benar: 1,
        bobot: 5,
      },
      {
        pertanyaan: 'Method yang digunakan untuk mengambil semua key dari dictionary adalah ….',
        pilihan: ['values()', 'items()', 'keys()', 'get()', 'pop()'],
        jawaban_benar: 2,
        bobot: 5,
      },
      {
        pertanyaan: "Analisislah potongan kode berikut:\ncounter = {}\nkata = 'python'\nfor huruf in kata:\n\tcounter[huruf] = counter.get(huruf, 0) + 1\nprint(counter['p'])\nOutput yang dihasilkan adalah ….",
        pilihan: ['0', '1', '2', 'Error', 'None'],
        jawaban_benar: 1,
        bobot: 5,
      },
      // SOAL ESAI dengan jawaban benar
      {
        pertanyaan: "Buatlah list bernama 'angka' berisi 5 elemen pertama dari deret bilangan genap (2,4,6,8,10).",
        pilihan: [],
        jawaban_benar: "angka = [2, 4, 6, 8, 10]",
        bobot: 5,
        isEssay: true,
      },
    ],
  },
];

// ==================== MAIN COMPONENT ====================
const DashboardDosen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dosenData, setDosenData] = useState(null);

  const [daftarKelas, setDaftarKelas] = useState([]);
  const [kelasAktif, setKelasAktif] = useState(null);

  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [kkmData, setKkmData] = useState({
    kkm_kuis_list: 75,
    kkm_kuis_nested_list: 75,
    kkm_kuis_dictionary: 75,
    kkm_evaluasi: 75,
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [updatingKKM, setUpdatingKKM] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKelas, setNewKelas] = useState({
    nama_kelas: '',
    tahun_ajaran: '',
    semester: 'Ganjil',
  });
  const [creating, setCreating] = useState(false);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  const [joining, setJoining] = useState(false);

  const [showManageDosen, setShowManageDosen] = useState(false);
  const [dosenInClass, setDosenInClass] = useState([]);
  const [newDosenNIP, setNewDosenNIP] = useState('');
  const [addingDosen, setAddingDosen] = useState(false);
  const [error, setError] = useState('');

  // State untuk edit kelas
  const [showEditModal, setShowEditModal] = useState(false);
  const [editKelasData, setEditKelasData] = useState(null);
  const [editingKelas, setEditingKelas] = useState(false);

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userId || !userEmail) {
      navigate('/loginregister');
    }
  }, [userId, userEmail, navigate]);

  useEffect(() => {
    if (!userId) return;
    const fetchDosenDanKelas = async () => {
      try {
        const dosenRef = doc(db, 'dosen', userId);
        const dosenSnap = await getDoc(dosenRef);
        if (!dosenSnap.exists()) {
          alert('Data dosen tidak ditemukan.');
          localStorage.clear();
          navigate('/loginregister');
          return;
        }
        setDosenData(dosenSnap.data());

        const kelasQuery = query(collection(db, 'kelas'), where('dosen_ids', 'array-contains', userId));
        const kelasSnapshot = await getDocs(kelasQuery);
        const kelasList = [];
        kelasSnapshot.forEach((docSnap) => {
          kelasList.push({ id: docSnap.id, ...docSnap.data() });
        });
        setDaftarKelas(kelasList);
        if (kelasList.length > 0) {
          setKelasAktif(kelasList[0]);
        } else {
          setKelasAktif(null);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert('Gagal memuat data.');
        setLoading(false);
      }
    };
    fetchDosenDanKelas();
  }, [userId, navigate]);

  useEffect(() => {
    if (kelasAktif) {
      localStorage.setItem('activeKelasToken', kelasAktif.token);
      localStorage.setItem('activeKelasId', kelasAktif.id);
    } else {
      localStorage.removeItem('activeKelasToken');
      localStorage.removeItem('activeKelasId');
    }
  }, [kelasAktif]);

  useEffect(() => {
    if (!kelasAktif) {
      setMahasiswaList([]);
      return;
    }
    setKkmData({
      kkm_kuis_list: kelasAktif.kkm_kuis_list ?? 75,
      kkm_kuis_nested_list: kelasAktif.kkm_kuis_nested_list ?? 75,
      kkm_kuis_dictionary: kelasAktif.kkm_kuis_dictionary ?? 75,
      kkm_evaluasi: kelasAktif.kkm_evaluasi ?? 75,
    });

    const token = kelasAktif.token;
    const q = query(collection(db, 'mahasiswa'), where('Token_mahasiswa', '==', token));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const siswa = [];
      snapshot.forEach((docSnap) => {
        siswa.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMahasiswaList(siswa);
    });
    return () => unsubscribe();
  }, [kelasAktif]);

  useEffect(() => {
    if (!kelasAktif || !showManageDosen) return;
    const fetchDosenInClass = async () => {
      const dosenIds = kelasAktif.dosen_ids || [];
      const dosenDataArr = [];
      for (const nip of dosenIds) {
        const snap = await getDoc(doc(db, 'dosen', nip));
        if (snap.exists()) {
          dosenDataArr.push({ nip, nama: snap.data().Nama });
        } else {
          dosenDataArr.push({ nip, nama: '(Tidak ditemukan)' });
        }
      }
      setDosenInClass(dosenDataArr);
    };
    fetchDosenInClass();
  }, [kelasAktif, showManageDosen]);

  const handleKKMChange = (field, value) => {
    setKkmData(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const saveKKM = async () => {
    if (!kelasAktif) return;
    setUpdatingKKM(true);
    try {
      const kelasRef = doc(db, 'kelas', kelasAktif.id);
      await updateDoc(kelasRef, {
        kkm_kuis_list: kkmData.kkm_kuis_list,
        kkm_kuis_nested_list: kkmData.kkm_kuis_nested_list,
        kkm_kuis_dictionary: kkmData.kkm_kuis_dictionary,
        kkm_evaluasi: kkmData.kkm_evaluasi,
      });
      alert('KKM berhasil disimpan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan KKM.');
    } finally {
      setUpdatingKKM(false);
    }
  };

  const copyToken = () => {
    if (kelasAktif?.token) {
      navigator.clipboard.writeText(kelasAktif.token);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/loginregister');
  };

  // === Fungsi untuk membuat kuis default dengan ID unik per kelas ===
  const buatKuisDefault = async (kelasId) => {
    const quizzes = getDefaultQuizzes();
    const batch = writeBatch(db);

    const idMap = {
      'Kuis List': `${kelasId}_List`,
      'Kuis Nested List': `${kelasId}_NestedList`,
      'Kuis Dictionary': `${kelasId}_Dictionary`,
      'Evaluasi': `${kelasId}_Evaluasi`
    };

    for (const quiz of quizzes) {
      const kuisId = idMap[quiz.judul];
      const kuisRef = doc(db, 'kuis', kuisId);
      batch.set(kuisRef, {
        kelas_id: kelasId,
        judul: quiz.judul,
        tipe: quiz.tipe,
        deskripsi: `Kuis default ${quiz.judul}`,
      });

      quiz.soal.forEach((soal, index) => {
        const soalRef = doc(collection(db, 'soal_kuis'));
        batch.set(soalRef, {
          kuis_id: kuisRef.id,
          nomor: index + 1,
          pertanyaan: soal.pertanyaan,
          pilihan: soal.pilihan,
          jawaban_benar: soal.jawaban_benar,
          bobot: soal.bobot,
          pembahasan: soal.pembahasan || '',
          isEssay: soal.isEssay || false,
        });
      });
    }

    await batch.commit();
  };

  // === BUAT KELAS BARU ===
  const openCreateModal = () => {
    setNewKelas({ nama_kelas: '', tahun_ajaran: '', semester: 'Ganjil' });
    setShowCreateModal(true);
  };

  const handleCreateKelas = async (e) => {
    e.preventDefault();
    if (!newKelas.nama_kelas.trim() || !newKelas.tahun_ajaran.trim()) {
      alert('Nama kelas dan tahun ajaran harus diisi.');
      return;
    }
    setCreating(true);
    try {
      const token = generateRandomToken();
      const kelasBaru = {
        dosen_ids: [userId],
        token: token,
        nama_kelas: newKelas.nama_kelas,
        tahun_ajaran: newKelas.tahun_ajaran,
        semester: newKelas.semester,
        kkm_kuis_list: 75,
        kkm_kuis_nested_list: 75,
        kkm_kuis_dictionary: 75,
        kkm_evaluasi: 75,
      };
      await setDoc(doc(db, 'kelas', token), kelasBaru);
      const kelasDenganId = { id: token, ...kelasBaru };
      setDaftarKelas(prev => [...prev, kelasDenganId]);
      setKelasAktif(kelasDenganId);
      setShowCreateModal(false);
      await buatKuisDefault(token);
      alert(`Kelas berhasil dibuat! Token: ${token}`);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat kelas.');
    } finally {
      setCreating(false);
    }
  };

  // === EDIT KELAS ===
  const openEditModal = (kelas) => {
    setEditKelasData({
      id: kelas.id,
      nama_kelas: kelas.nama_kelas,
      tahun_ajaran: kelas.tahun_ajaran,
      semester: kelas.semester,
    });
    setShowEditModal(true);
  };

  const handleEditKelas = async (e) => {
    e.preventDefault();
    if (!editKelasData.nama_kelas.trim() || !editKelasData.tahun_ajaran.trim()) {
      alert('Nama kelas dan tahun ajaran harus diisi.');
      return;
    }
    setEditingKelas(true);
    try {
      const kelasRef = doc(db, 'kelas', editKelasData.id);
      await updateDoc(kelasRef, {
        nama_kelas: editKelasData.nama_kelas,
        tahun_ajaran: editKelasData.tahun_ajaran,
        semester: editKelasData.semester,
      });
      // Update state daftarKelas
      setDaftarKelas(prev =>
        prev.map(k => k.id === editKelasData.id ? { ...k, ...editKelasData } : k)
      );
      // Jika kelas yang diedit adalah kelas aktif, update juga kelasAktif
      if (kelasAktif && kelasAktif.id === editKelasData.id) {
        setKelasAktif(prev => ({ ...prev, ...editKelasData }));
      }
      setShowEditModal(false);
      alert('Kelas berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui kelas.');
    } finally {
      setEditingKelas(false);
    }
  };

  // === HAPUS KELAS ===
  const handleDeleteKelas = async (kelasId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kelas ini? Semua data terkait (mahasiswa, kuis) tidak akan dihapus secara otomatis, tetapi kelas akan hilang dari daftar.')) return;
    try {
      await deleteDoc(doc(db, 'kelas', kelasId));
      setDaftarKelas(prev => prev.filter(k => k.id !== kelasId));
      if (kelasAktif && kelasAktif.id === kelasId) {
        // Pilih kelas pertama yang tersisa atau null
        const remaining = daftarKelas.filter(k => k.id !== kelasId);
        setKelasAktif(remaining.length > 0 ? remaining[0] : null);
      }
      alert('Kelas berhasil dihapus.');
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus kelas.');
    }
  };

  // === GABUNG KELAS ===
  const openJoinModal = () => {
    setJoinToken('');
    setShowJoinModal(true);
  };

  const handleJoinKelas = async (e) => {
    e.preventDefault();
    if (!joinToken.trim()) return;
    setJoining(true);
    setError('');
    try {
      const q = query(collection(db, 'kelas'), where('token', '==', joinToken.trim().toUpperCase()));
      const snap = await getDocs(q);
      if (snap.empty) {
        setError('Token tidak valid atau kelas tidak ditemukan.');
        setJoining(false);
        return;
      }
      const kelasDoc = snap.docs[0];
      const kelasData = kelasDoc.data();
      const dosenIds = kelasData.dosen_ids || [];
      if (dosenIds.includes(userId)) {
        setError('Anda sudah bergabung di kelas ini.');
        setJoining(false);
        return;
      }
      await updateDoc(doc(db, 'kelas', kelasDoc.id), {
        dosen_ids: arrayUnion(userId)
      });
      const updatedKelas = { id: kelasDoc.id, ...kelasData, dosen_ids: [...dosenIds, userId] };
      setDaftarKelas(prev => {
        const exists = prev.find(k => k.id === updatedKelas.id);
        if (exists) {
          return prev.map(k => k.id === updatedKelas.id ? updatedKelas : k);
        } else {
          return [...prev, updatedKelas];
        }
      });
      setKelasAktif(updatedKelas);
      setShowJoinModal(false);
      alert('Berhasil bergabung ke kelas!');
    } catch (err) {
      console.error(err);
      setError('Gagal bergabung ke kelas.');
    } finally {
      setJoining(false);
    }
  };

  // === KELOLA DOSEN ===
  const openManageDosen = () => {
    setNewDosenNIP('');
    setError('');
    setShowManageDosen(true);
  };

  const addDosenToClass = async () => {
    if (!newDosenNIP.trim()) return;
    setAddingDosen(true);
    setError('');
    try {
      const dosenSnap = await getDoc(doc(db, 'dosen', newDosenNIP.trim()));
      if (!dosenSnap.exists()) {
        setError('NIP dosen tidak ditemukan.');
        setAddingDosen(false);
        return;
      }
      const nipToAdd = dosenSnap.id;
      if ((kelasAktif.dosen_ids || []).includes(nipToAdd)) {
        setError('Dosen tersebut sudah ada di kelas.');
        setAddingDosen(false);
        return;
      }
      const kelasRef = doc(db, 'kelas', kelasAktif.id);
      await updateDoc(kelasRef, { dosen_ids: arrayUnion(nipToAdd) });
      setKelasAktif(prev => ({
        ...prev,
        dosen_ids: [...(prev.dosen_ids || []), nipToAdd]
      }));
      setNewDosenNIP('');
      const newDosenSnap = await getDoc(doc(db, 'dosen', nipToAdd));
      setDosenInClass(prev => [...prev, { nip: nipToAdd, nama: newDosenSnap.exists() ? newDosenSnap.data().Nama : '(baru)' }]);
    } catch (err) {
      console.error(err);
      setError('Gagal menambah dosen.');
    } finally {
      setAddingDosen(false);
    }
  };

  const removeDosenFromClass = async (nipToRemove) => {
    if (!window.confirm(`Hapus dosen dengan NIP ${nipToRemove} dari kelas?`)) return;
    try {
      const kelasRef = doc(db, 'kelas', kelasAktif.id);
      await updateDoc(kelasRef, { dosen_ids: arrayRemove(nipToRemove) });
      setKelasAktif(prev => ({
        ...prev,
        dosen_ids: prev.dosen_ids.filter(nip => nip !== nipToRemove)
      }));
      setDosenInClass(prev => prev.filter(d => d.nip !== nipToRemove));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus dosen.');
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <SidebarDosen />
        <div className="dashboard-content">
          <Navbar />
          <div className="loading-page">Memuat dashboard...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <SidebarDosen />
      <div className="dashboard-content">
        <Navbar />
        <div className="content-inner">
          {/* Header Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <h1 className="card-title">Dashboard Dosen</h1>
                <p className="card-subtitle">{dosenData?.Nama} ({dosenData?.Email})</p>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* ===== KELAS ANDA (dengan token di setiap baris, ukuran lebih besar) ===== */}
          <div className="card">
            <div className="card-title"><BookOpen size={22} /> Kelas Anda</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                {daftarKelas.length === 0 ? (
                  <span style={{ color: '#6b7280' }}>Belum ada kelas.</span>
                ) : (
                  <div className="kelas-list">
                    {daftarKelas.map(kelas => (
                      <div key={kelas.id} className="kelas-item">
                        <button
                          className={`kelas-btn ${kelasAktif?.id === kelas.id ? 'active' : ''}`}
                          onClick={() => setKelasAktif(kelas)}
                        >
                          {kelas.nama_kelas} ({kelas.tahun_ajaran} {kelas.semester})
                        </button>
                        {/* Token dengan ukuran lebih besar */}
                        <span
                          className="token-code"
                          style={{
                            fontSize: '1rem',
                            padding: '0.4rem 0.8rem',
                            background: '#e5e7eb',
                            borderRadius: '0.375rem',
                            letterSpacing: '1px',
                            fontFamily: 'monospace',
                            color: '#1f2937',
                            fontWeight: '600',
                          }}
                        >
                          {kelas.token}
                        </span>
                        <button className="btn btn-outline" onClick={() => openEditModal(kelas)} title="Edit Kelas">
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-red" onClick={() => handleDeleteKelas(kelas.id)} title="Hapus Kelas">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-outline" onClick={openJoinModal}>
                  <UserPlus size={18} /> Gabung Kelas
                </button>
                <button className="btn btn-blue" onClick={openCreateModal}>
                  <PlusCircle size={18} /> Buat Kelas Baru
                </button>
              </div>
            </div>

            {/* Blok aksi cepat (Salin Token & Kelola Dosen) untuk kelas aktif */}
            {kelasAktif && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Aksi untuk kelas aktif:</span>
                  <button className="btn btn-blue" onClick={copyToken}>
                    {copySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                    {copySuccess ? 'Tersalin!' : 'Salin Token'}
                  </button>
                  <button className="btn btn-outline" onClick={openManageDosen}>
                    <Users size={18} /> Kelola Dosen
                  </button>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Token dibagikan ke mahasiswa. Dosen lain bisa bergabung dengan token ini.
                </p>
              </div>
            )}
          </div>

          {kelasAktif && (
            <>
              {/* KKM */}
              <div className="card">
                <div className="card-title">KKM - {kelasAktif.nama_kelas} ({kelasAktif.tahun_ajaran} {kelasAktif.semester})</div>
                <div className="kkm-grid">
                  <div className="kkm-item">
                    <label>Kuis List</label>
                    <input type="number" value={kkmData.kkm_kuis_list} onChange={(e) => handleKKMChange('kkm_kuis_list', e.target.value)} />
                  </div>
                  <div className="kkm-item">
                    <label>Kuis Nested List</label>
                    <input type="number" value={kkmData.kkm_kuis_nested_list} onChange={(e) => handleKKMChange('kkm_kuis_nested_list', e.target.value)} />
                  </div>
                  <div className="kkm-item">
                    <label>Kuis Dictionary</label>
                    <input type="number" value={kkmData.kkm_kuis_dictionary} onChange={(e) => handleKKMChange('kkm_kuis_dictionary', e.target.value)} />
                  </div>
                  <div className="kkm-item">
                    <label>Evaluasi</label>
                    <input type="number" value={kkmData.kkm_evaluasi} onChange={(e) => handleKKMChange('kkm_evaluasi', e.target.value)} />
                  </div>
                </div>
                <button className="btn btn-green" onClick={saveKKM} disabled={updatingKKM}>
                  <Save size={18} /> {updatingKKM ? 'Menyimpan...' : 'Simpan KKM'}
                </button>
              </div>

              {/* Daftar Mahasiswa */}
              <div className="card">
                <div className="card-title"><Users size={22} /> Mahasiswa ({mahasiswaList.length})</div>
                {mahasiswaList.length === 0 ? (
                  <p style={{ color: '#6b7280' }}>Belum ada mahasiswa yang mendaftar dengan token ini.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                      <thead>
                        <tr>
                          <th style={{ width: '15%', textAlign: 'center', verticalAlign: 'middle', padding: '12px 8px', borderBottom: '2px solid #e5e7eb' }}>NIM</th>
                          <th style={{ width: '20%', textAlign: 'center', verticalAlign: 'middle', padding: '12px 8px', borderBottom: '2px solid #e5e7eb' }}>Nama</th>
                          <th style={{ width: '25%', textAlign: 'center', verticalAlign: 'middle', padding: '12px 8px', borderBottom: '2px solid #e5e7eb' }}>Email</th>
                          <th style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle', padding: '12px 8px', borderBottom: '2px solid #e5e7eb' }}>Kuis List</th>
                          <th style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle', padding: '12px 8px', borderBottom: '2px solid #e5e7eb' }}>Kuis Nested</th>
                          <th style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle', padding: '12px 8px', borderBottom: '2px solid #e5e7eb' }}>Kuis Dict</th>
                          <th style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle', padding: '12px 8px', borderBottom: '2px solid #e5e7eb' }}>Evaluasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mahasiswaList.map(mhs => (
                          <tr key={mhs.id}>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '10px 8px', borderBottom: '1px solid #e5e7eb', wordBreak: 'break-word' }}>{mhs.NIM}</td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '10px 8px', borderBottom: '1px solid #e5e7eb', wordBreak: 'break-word' }}>{mhs.Nama}</td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '10px 8px', borderBottom: '1px solid #e5e7eb', wordBreak: 'break-word' }}>{mhs.Email}</td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '10px 8px', borderBottom: '1px solid #e5e7eb' }}><NilaiCell nim={mhs.NIM} jenis="Kuis List" /></td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '10px 8px', borderBottom: '1px solid #e5e7eb' }}><NilaiCell nim={mhs.NIM} jenis="Kuis Nested List" /></td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '10px 8px', borderBottom: '1px solid #e5e7eb' }}><NilaiCell nim={mhs.NIM} jenis="Kuis Dictionary" /></td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '10px 8px', borderBottom: '1px solid #e5e7eb' }}><NilaiCell nim={mhs.NIM} jenis="Evaluasi" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Buat Kelas Baru */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close" onClick={() => setShowCreateModal(false)}><X size={24} /></div>
              <h2 className="modal-title">Buat Kelas Baru</h2>
              <form onSubmit={handleCreateKelas}>
                <div className="form-group">
                  <label>Nama Kelas / Mata Kuliah</label>
                  <input type="text" placeholder="Contoh: Algoritma" value={newKelas.nama_kelas} onChange={e => setNewKelas({...newKelas, nama_kelas: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Tahun Ajaran</label>
                  <input type="text" placeholder="2025/2026" value={newKelas.tahun_ajaran} onChange={e => setNewKelas({...newKelas, tahun_ajaran: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <select value={newKelas.semester} onChange={e => setNewKelas({...newKelas, semester: e.target.value})}>
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-blue" disabled={creating}>{creating ? 'Membuat...' : 'Buat Kelas'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Kelas */}
        {showEditModal && editKelasData && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close" onClick={() => setShowEditModal(false)}><X size={24} /></div>
              <h2 className="modal-title">Edit Kelas</h2>
              <form onSubmit={handleEditKelas}>
                <div className="form-group">
                  <label>Nama Kelas / Mata Kuliah</label>
                  <input type="text" value={editKelasData.nama_kelas} onChange={e => setEditKelasData({...editKelasData, nama_kelas: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Tahun Ajaran</label>
                  <input type="text" value={editKelasData.tahun_ajaran} onChange={e => setEditKelasData({...editKelasData, tahun_ajaran: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <select value={editKelasData.semester} onChange={e => setEditKelasData({...editKelasData, semester: e.target.value})}>
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowEditModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-blue" disabled={editingKelas}>{editingKelas ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Gabung Kelas */}
        {showJoinModal && (
          <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close" onClick={() => setShowJoinModal(false)}><X size={24} /></div>
              <h2 className="modal-title">Gabung ke Kelas</h2>
              <form onSubmit={handleJoinKelas}>
                <div className="form-group">
                  <label>Masukkan Token Kelas</label>
                  <input type="text" placeholder="Token 8 karakter" value={joinToken} onChange={e => setJoinToken(e.target.value)} maxLength={8} required />
                </div>
                {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowJoinModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-blue" disabled={joining}>{joining ? 'Menggabungkan...' : 'Gabung'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Kelola Dosen */}
        {showManageDosen && (
          <div className="modal-overlay" onClick={() => setShowManageDosen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close" onClick={() => setShowManageDosen(false)}><X size={24} /></div>
              <h2 className="modal-title">Tim Pengajar - {kelasAktif?.nama_kelas}</h2>
              <ul className="dosen-list">
                {dosenInClass.map(d => (
                  <li key={d.nip}>
                    <span>{d.nama} ({d.nip})</span>
                    {(kelasAktif?.dosen_ids?.length > 1) && (
                      <button className="btn btn-red" onClick={() => removeDosenFromClass(d.nip)}><Trash2 size={14} /></button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="form-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label>Tambah Dosen (masukkan NIP)</label>
                  <input type="text" placeholder="NIP dosen" value={newDosenNIP} onChange={e => setNewDosenNIP(e.target.value)} />
                </div>
                <button className="btn btn-blue" onClick={addDosenToClass} disabled={addingDosen}>{addingDosen ? '...' : <PlusCircle size={18} />}</button>
              </div>
              {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setShowManageDosen(false)}>Tutup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardDosen;