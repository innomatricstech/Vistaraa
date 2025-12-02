// src/pages/Home.jsx
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Home.css"
import Banner from "../components/Banner";

// Category Previews
import HomeFashionSection from "../components/category/HomeFashionSection";
import HomeAccessoriesSection from "../components/category/HomeAccessoriesSection";
import HomeToysSection from "../components/category/HomeToysSection";
import HomeStationarySection from "../components/category/HomeStationarySection";
import HomePhotoFrameSection from "../components/category/HomePhotoFrameSection";
import HomeFootWearsSection from "../components/category/HomeFootWearsSection";
import HomeJewellerySection from "../components/category/HomeJewellerySection";
import HomeMensSection from "../components/category/HomeMensSection";
import HomeKidsSection from "../components/category/HomeKidsSection";
import HomePersonalCareSection from "../components/category/HomePersonalCareSection";

// Full Components
import Cosmetics from "../components/category/Cosmetics";
import Book from "../components/category/Book";
import Electronics from "../components/category/Electronics";


function Home() {
  return (
    <div className="homepage-content">

      {/* ===== Hero Banner ===== */}
      <section className="banner-fade-in mb-5">
        <Banner />
      </section>

      {/* ===== Fashion Section ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomeFashionSection />
        </Container>
      </section>

      {/* ===== Accessories Section ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomeAccessoriesSection />
        </Container>
      </section>

      {/* ===== Cosmetics ===== */}
      <section className="category-section mb-5">
        <Container>
          <Cosmetics />
        </Container>
      </section>

      {/* ===== Toys ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomeToysSection />
        </Container>
      </section>

      {/* ===== Stationary ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomeStationarySection />
        </Container>
      </section>

      {/* ===== Books ===== */}
      <section className="category-section mb-5">
        <Container>
          <Book />
        </Container>
      </section>

      {/* ===== Photo Frames ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomePhotoFrameSection />
        </Container>
      </section>

      {/* ===== Footwears ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomeFootWearsSection />
        </Container>
      </section>

      {/* ===== Jewellery ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomeJewellerySection />
        </Container>
      </section>

      {/* ===== Mens ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomeMensSection />
        </Container>
      </section>

      {/* ===== Kids ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomeKidsSection />
        </Container>
      </section>

      {/* ===== Electronics ===== */}
      <section className="category-section mb-5">
        <Container>
          <Electronics />
        </Container>
      </section>

      {/* ===== Personal Care ===== */}
      <section className="category-section mb-5">
        <Container>
          <HomePersonalCareSection />
        </Container>
      </section>

    </div>
  );
}

export default Home;
