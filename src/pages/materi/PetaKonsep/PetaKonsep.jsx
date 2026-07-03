import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../komponen/Navbar";
import SidebarMateri from "../../komponen/SidebarMateri";
import PetaKonsepImage from '../../../assets/PetaKonsepImage.png';
import MateriPagination from "../../komponen/MateriPagination";

const styles = {
  page: {
    padding: "20px 20px", // tambah padding atas-bawah agar tidak terlalu rapat
    backgroundColor: "#f5f7fa",
    minHeight: "100%",
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  section: {
    width: "100%",
    maxWidth: "1100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "15px 25px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    maxHeight: "calc(100vh - 250px)", // sesuaikan agar ada ruang untuk navbar + pagination + padding
    objectFit: "contain",
    display: "block",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  paginationWrapper: {
    width: "100%",
    marginTop: "15px",
    flexShrink: 0,
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
          minHeight: "calc(100vh - 64px)",
          boxSizing: "border-box",
          overflowY: "auto", // biarkan scroll jika konten melebihi layar
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
            <div style={styles.paginationWrapper}>
              <MateriPagination />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PetaKonsep;