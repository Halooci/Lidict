import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import PetaKonsepImage from '../../../assets/PetaKonsepImage.png';

const styles = {
  page: {
    padding: "5px 20px", // padding vertikal sangat kecil
    backgroundColor: "#f5f7fa",
    height: "100%",
    overflow: "hidden",
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
  section: {
    marginBottom: 0,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
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
    padding: "8px 25px", // padding card diperkecil
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "1100px", // lebih lebar agar gambar bisa lebih besar
    margin: "0 auto",
  },
  text: { lineHeight: "1.8", color: "#333", marginBottom: "15px" },
  image: {
    maxWidth: "100%",
    maxHeight: "calc(100vh - 100px)", // lebih besar, memperhitungkan navbar + padding tipis
    width: "auto",
    height: "auto",
    display: "block",
    margin: "0 auto",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    objectFit: "contain",
  },
};

const PetaKonsep = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !userEmail) {
      navigate('/loginregister');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <SidebarMateri />
      <div 
        className="main-content" 
        style={{ 
          paddingTop: "64px", 
          height: "calc(100vh - 64px)", 
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
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