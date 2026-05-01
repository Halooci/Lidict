import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import PetaKonsepImage from '../../../assets/PetaKonsepImage.png';

const styles = {
  page: {
    padding: "30px 40px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
  },
  header: {
    backgroundColor: "#306998",
    color: "white",
    padding: "18px 24px",
    borderRadius: "6px",
    marginBottom: "30px",
    position: "relative",
  },
  headerAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "8px",
    backgroundColor: "#FFD43B",
  },
  headerTitle: {
    margin: 0,
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
  },
  section: { marginBottom: "40px" },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "15px",
    borderLeft: "5px solid #306998",
    paddingLeft: "12px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
  image: {
    maxWidth: "100%",
    height: "auto",
    display: "block",
    margin: "0 auto",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};

const PetaKonsep = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah user sudah login (ada data di localStorage)
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) {
      // Jika belum login, redirect ke halaman login/register
      navigate('/loginregister');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <SidebarMateri />
      <div className="main-content" style={{ paddingTop: "64px" }}>
        <div style={styles.page}>
          <section style={styles.section}>
            <div style={styles.card}>
              <img 
                src={PetaKonsepImage} 
                alt="Peta Konsep List Python" 
                style={styles.image} 
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PetaKonsep;