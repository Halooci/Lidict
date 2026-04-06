import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import Navbar from './komponen/Navbar';

// ==================== STYLES ====================
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
  justify-content: center;
  padding: 80px 60px 60px 60px;
  background: white;
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 5;
}

.form-section.login-section {
  right: 0;
  transform: translateX(0);
  opacity: 1;
}

.form-section.register-section {
  left: 0;
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
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
  }
  
  .panels-container:not(.register-active) .form-section.login-section {
    display: flex;
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
`;

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
      <p>
        {isLogin 
          ? 'Daftar Disini!' 
          : 'Masuk Disini!'}
      </p>
      <button className="panel-btn" onClick={onToggle}>
        {isLogin ? 'Daftar' : 'Masuk'}
      </button>
    </div>
  </div>
);

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted');
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Masuk</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-icon"><Mail size={20} /></div>
          <input 
            type="email" 
            className="input-field" 
            placeholder="Email" 
            required 
          />
        </div>
        
        <div className="input-group">
          <div className="input-icon"><Lock size={20} /></div>
          <input 
            type={showPassword ? "text" : "password"}
            className="input-field" 
            placeholder="Password" 
            required 
          />
          <span 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        
        <button type="submit" className="submit-btn login-btn">
          Masuk
        </button>
      </form>
    </div>
  );
};

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register submitted with role:', role);
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Daftar</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-icon"><User size={20} /></div>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Nama Lengkap" 
            required 
          />
        </div>
        
        <div className="input-group">
          <div className="input-icon"><Mail size={20} /></div>
          <input 
            type="email" 
            className="input-field" 
            placeholder="Email" 
            required 
          />
        </div>
        
        <div className="input-group">
          <div className="input-icon"><Lock size={20} /></div>
          <input 
            type={showPassword ? "text" : "password"}
            className="input-field" 
            placeholder="Password" 
            required 
          />
          <span 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        
        <div className="input-group">
          <div className="input-icon"><Lock size={20} /></div>
          <input 
            type={showConfirmPassword ? "text" : "password"}
            className="input-field" 
            placeholder="Konfirmasi Password" 
            required 
          />
          <span 
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <div className="select-group">
          <div className="select-icon"><User size={20} /></div>
          <select 
            className="select-field" 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>Daftar Sebagai</option>
            <option value="dosen">Dosen</option>
            <option value="mahasiswa">Mahasiswa</option>
          </select>
          <div className="select-arrow"><ChevronDown size={20} /></div>
        </div>
        
        <button type="submit" className="submit-btn register-btn">
          Daftar
        </button>
      </form>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <Navbar />
        <div className="auth-main">
          <div className={`panels-container ${isLogin ? '' : 'register-active'}`}>
            
            <div className="form-section register-section">
              <RegisterForm />
            </div>

            <SlidingPanel 
              isLogin={isLogin} 
              onToggle={toggleMode} 
            />

            <div className="form-section login-section">
              <LoginForm />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegister;