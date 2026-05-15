import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { User, Mail, Lock, Eye, EyeOff, ChevronDown, Key, AlertCircle, X } from 'lucide-react';
import Navbar from './komponen/Navbar';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

// ==================== STYLES (dengan perbaikan posisi login) ====================
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.auth-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.auth-main {
  display: flex;
  width: 100%;
  flex: 1;
  position: relative;
}

.panels-container {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 70px);
  position: relative;
  overflow: hidden;
  background: white;
}

.form-section {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 60px 40px 60px;
  background: white;
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 5;
  overflow-y: auto;
}

/* Perbaikan: form login di tengah vertikal */
.form-section.login-section {
  right: 0;
  transform: translateX(0);
  opacity: 1;
  justify-content: center;
}

/* Form register tetap di atas agar bisa scroll */
.form-section.register-section {
  left: 0;
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
  justify-content: flex-start;
  padding-bottom: 60px;
}

.panels-container.register-active .form-section.login-section {
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
}

.panels-container.register-active .form-section.register-section {
  transform: translateX(0);
  opacity: 1;
  pointer-events: all;
}

.sliding-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #3182ce 100%);
}

.panels-container.register-active .sliding-panel {
  left: 50%;
  background: linear-gradient(135deg, #d69e2e 0%, #ecc94b 50%, #f6e05e 100%);
}

.panel-content {
  color: white;
  max-width: 400px;
  z-index: 20;
  transition: opacity 0.4s ease;
}

.panel-content h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 15px;
}

.panel-content p {
  font-size: 16px;
  margin-bottom: 30px;
  opacity: 0.95;
  line-height: 1.6;
}

.panel-btn {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 12px 45px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.panel-btn:hover {
  background: white;
  color: #1e3a5f;
  transform: scale(1.05);
}

.form-container {
  width: 100%;
  max-width: 380px;
  animation: formFadeIn 0.6s ease;
  margin-top: 20px;
  margin-bottom: 30px;
}

@keyframes formFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-title {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 35px;
  text-align: center;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  z-index: 2;
}

.input-group:focus-within .input-icon {
  color: #3182ce;
}

.input-field {
  width: 100%;
  padding: 15px 20px 15px 50px;
  border: none;
  background: #f0f0f0;
  border-radius: 50px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: all 0.3s ease;
}

.input-field:focus {
  background: #e8e8e8;
  box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1);
}

.input-field::placeholder {
  color: #999;
}

.password-toggle {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  z-index: 2;
}

.password-toggle:hover {
  color: #666;
}

.select-group {
  position: relative;
  margin-bottom: 20px;
}

.select-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
}

.select-arrow {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
}

.select-field {
  width: 100%;
  padding: 15px 50px;
  border: none;
  background: #f0f0f0;
  border-radius: 50px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.select-field:focus {
  background: #e8e8e8;
  box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1);
}

.select-field option {
  padding: 10px;
  font-size: 15px;
}

.select-field option:first-child {
  color: #999;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 10px;
}

.login-btn {
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  color: white;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(49, 130, 206, 0.3);
}

.register-btn {
  background: linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%);
  color: #1e3a5f;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(236, 201, 75, 0.3);
}

.forgot-link {
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #3182ce;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #2c5282;
  text-decoration: underline;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  top: 0;
  left: 0;
}

.shape {
  position: absolute;
  opacity: 0.1;
  background: white;
  animation: float 15s infinite ease-in-out;
}

.shape:nth-child(1) {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.shape:nth-child(2) {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  top: 60%;
  right: 20%;
  animation-delay: 5s;
}

.shape:nth-child(3) {
  width: 60px;
  height: 60px;
  transform: rotate(45deg);
  bottom: 20%;
  left: 30%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(10deg);
  }
}

@media (max-width: 768px) {
  .panels-container {
    flex-direction: column;
    min-height: auto;
  }
  
  .sliding-panel {
    position: relative;
    width: 100%;
    height: 200px;
    left: 0 !important;
    order: -1;
  }
  
  .form-section {
    position: relative;
    width: 100%;
    padding: 40px 20px 30px 20px;
    transform: none !important;
    opacity: 1 !important;
    pointer-events: all !important;
    display: none;
    overflow-y: visible;
    padding-bottom: 40px;
  }
  
  .panels-container:not(.register-active) .form-section.login-section {
    display: flex;
    justify-content: center;
  }
  
  .panels-container.register-active .form-section.register-section {
    display: flex;
  }
  
  .form-title {
    font-size: 28px;
  }
  
  .panel-content h2 {
    font-size: 24px;
  }
  
  .form-container {
    margin-top: 10px;
  }
}

/* ===== MODAL FULL SCREEN OVERLAY ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  padding: 20px;
  text-align: center;
  color: white;
}

.modal-header .icon {
  margin-bottom: 8px;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.modal-body {
  padding: 30px 24px;
  text-align: center;
}

.modal-body p {
  font-size: 16px;
  color: #2d3748;
  line-height: 1.6;
  margin: 0;
}

.modal-footer {
  padding: 0 24px 28px 24px;
  display: flex;
  justify-content: center;
}

.modal-btn {
  background: linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%);
  border: none;
  padding: 12px 32px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 600;
  color: #1e3a5f;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 200px;
}

.modal-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 14px rgba(214, 158, 46, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
`;

// ==================== Helper: Generate random token 8 karakter ====================
const generateRandomToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// ==================== COMPONENTS ====================

const SlidingPanel = ({ isLogin, onToggle }) => (
  <div className="sliding-panel">
    <div className="floating-shapes">
      <div className="shape"></div>
      <div className="shape"></div>
      <div className="shape"></div>
    </div>
    <div className="panel-content">
      <h2>{isLogin ? 'Belum Punya Akun ?' : 'Sudah Punya Akun ?'}</h2>
      <p>{isLogin ? 'Daftar Disini!' : 'Masuk Disini!'}</p>
      <button className="panel-btn" onClick={onToggle}>
        {isLogin ? 'Daftar' : 'Masuk'}
      </button>
    </div>
  </div>
);

// ==================== LOGIN FORM ====================
const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const mahasiswaQuery = query(collection(db, 'mahasiswa'), where('Email', '==', email));
      const mahasiswaSnapshot = await getDocs(mahasiswaQuery);
      const dosenQuery = query(collection(db, 'dosen'), where('Email', '==', email));
      const dosenSnapshot = await getDocs(dosenQuery);

      let userData = null;
      let role = null;
      let docId = null;

      if (!mahasiswaSnapshot.empty) {
        userData = mahasiswaSnapshot.docs[0].data();
        role = 'mahasiswa';
        docId = mahasiswaSnapshot.docs[0].id;
      } else if (!dosenSnapshot.empty) {
        userData = dosenSnapshot.docs[0].data();
        role = 'dosen';
        docId = dosenSnapshot.docs[0].id;
      } else {
        throw new Error('Email tidak ditemukan.');
      }

      if (userData.Password !== password) {
        throw new Error('Password salah.');
      }

      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', docId);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', userData.Nama);

      if (onLoginSuccess) onLoginSuccess(role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Masuk</h1>
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-icon"><Mail size={20} /></div>
          <input type="email" className="input-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <div className="input-icon"><Lock size={20} /></div>
          <input type={showPassword ? 'text' : 'password'} className="input-field" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <button type="submit" className="submit-btn login-btn" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
};

// ==================== MODAL COMPONENT (menggunakan Portal) ====================
const CustomAlertModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="icon"><AlertCircle size={40} /></div>
          <h3>Perhatian</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>OKE</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ==================== REGISTER FORM (revisi: pengecekan NIM unik + modal custom) ====================
const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    nim: '',
    nip: '',
    tokenKelas: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData({ ...formData, role, nim: '', nip: '', tokenKelas: '' });
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (formData.role === 'mahasiswa') {
      if (!formData.nim) {
        setError('NIM wajib diisi untuk mahasiswa.');
        return;
      }
      if (!formData.tokenKelas) {
        setError('Token Kelas wajib diisi untuk mahasiswa.');
        return;
      }
    }
    if (formData.role === 'dosen' && !formData.nip) {
      setError('NIP wajib diisi untuk dosen.');
      return;
    }

    // Cek email sudah terdaftar
    const emailQueryMahasiswa = query(collection(db, 'mahasiswa'), where('Email', '==', formData.email));
    const emailSnapshotMahasiswa = await getDocs(emailQueryMahasiswa);
    const emailQueryDosen = query(collection(db, 'dosen'), where('Email', '==', formData.email));
    const emailSnapshotDosen = await getDocs(emailQueryDosen);
    if (!emailSnapshotMahasiswa.empty || !emailSnapshotDosen.empty) {
      setError('Email sudah terdaftar. Gunakan email lain.');
      return;
    }

    // Cek apakah NIM sudah terdaftar untuk mahasiswa (menggunakan modal)
    if (formData.role === 'mahasiswa') {
      const nimRef = doc(db, 'mahasiswa', formData.nim);
      const nimSnap = await getDoc(nimRef);
      if (nimSnap.exists()) {
        showModal('NIM tersebut sudah terdaftar. Silakan login.');
        return;
      }
    }

    setLoading(true);
    try {
      if (formData.role === 'mahasiswa') {
        const mahasiswaRef = doc(db, 'mahasiswa', formData.nim);
        await setDoc(mahasiswaRef, {
          Nama: formData.nama,
          Email: formData.email,
          NIM: formData.nim,
          Password: formData.password,
          Token_mahasiswa: formData.tokenKelas,
          progres_belajar: 0,
        });
        await setDoc(doc(db, 'nilai', formData.nim), {
          NIM: formData.nim,
          'Kuis List': null,
          'Kuis Nested List': null,
          'Kuis Dictionary': null,
          Evaluasi: null,
        });
        localStorage.setItem('userRole', 'mahasiswa');
        localStorage.setItem('userId', formData.nim);
      } 
      else if (formData.role === 'dosen') {
        const dosenRef = doc(db, 'dosen', formData.nip);
        await setDoc(dosenRef, {
          Nama: formData.nama,
          Email: formData.email,
          NIP: formData.nip,
          Password: formData.password,
        });

        localStorage.setItem('userRole', 'dosen');
        localStorage.setItem('userId', formData.nip);
      }

      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', formData.nama);

      if (onRegisterSuccess) onRegisterSuccess(formData.role);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-container">
        <h1 className="form-title">Daftar</h1>
        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon"><User size={20} /></div>
            <input type="text" name="nama" className="input-field" placeholder="Nama Lengkap" value={formData.nama} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <div className="input-icon"><Mail size={20} /></div>
            <input type="email" name="email" className="input-field" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <div className="input-icon"><Lock size={20} /></div>
            <input type={showPassword ? 'text' : 'password'} name="password" className="input-field" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <div className="input-group">
            <div className="input-icon"><Lock size={20} /></div>
            <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" className="input-field" placeholder="Konfirmasi Password" value={formData.confirmPassword} onChange={handleChange} required />
            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <div className="select-group">
            <div className="select-icon"><User size={20} /></div>
            <select className="select-field" name="role" value={formData.role} onChange={handleRoleChange} required>
              <option value="" disabled>Daftar Sebagai</option>
              <option value="dosen">Dosen</option>
              <option value="mahasiswa">Mahasiswa</option>
            </select>
            <div className="select-arrow"><ChevronDown size={20} /></div>
          </div>
          {formData.role === 'mahasiswa' && (
            <>
              <div className="input-group">
                <div className="input-icon"><User size={20} /></div>
                <input type="text" name="nim" className="input-field" placeholder="NIM" value={formData.nim} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <div className="input-icon"><Key size={20} /></div>
                <input type="text" name="tokenKelas" className="input-field" placeholder="Token Kelas (dari dosen)" value={formData.tokenKelas} onChange={handleChange} required />
              </div>
            </>
          )}
          {formData.role === 'dosen' && (
            <div className="input-group">
              <div className="input-icon"><User size={20} /></div>
              <input type="text" name="nip" className="input-field" placeholder="NIP" value={formData.nip} onChange={handleChange} required />
            </div>
          )}
          <button type="submit" className="submit-btn register-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
      </div>

      {/* Modal dengan Portal ke document.body */}
      <CustomAlertModal 
        isOpen={modalOpen} 
        message={modalMessage} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
};

// ==================== MAIN COMPONENT ====================
const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleMode = () => setIsLogin(!isLogin);
  const handleAuthSuccess = (role) => {
    if (role === 'mahasiswa') {
      window.location.href = '/PetaKonsep';
    } else if (role === 'dosen') {
      window.location.href = '/dosen/dashboard';
    }
  };
  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <Navbar />
        <div className="auth-main">
          <div className={`panels-container ${isLogin ? '' : 'register-active'}`}>
            <div className="form-section register-section">
              <RegisterForm onRegisterSuccess={handleAuthSuccess} />
            </div>
            <SlidingPanel isLogin={isLogin} onToggle={toggleMode} />
            <div className="form-section login-section">
              <LoginForm onLoginSuccess={handleAuthSuccess} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegister;