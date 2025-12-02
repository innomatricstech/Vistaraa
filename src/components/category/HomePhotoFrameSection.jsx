// src/components/category/HomePhotoFrameSection.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Badge,
} from "react-bootstrap";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// 🎨 STYLE CONSTANTS
const PRIMARY_TEXT_COLOR = "#101010";
const ACCENT_COLOR = "#198754";
const SALE_COLOR = "#dc3545";
const WHITE_COLOR = "#FFFFFF";

// 🎨 CUSTOM STYLES
const customStyles = {
  sectionContainer: {
    backgroundColor: WHITE_COLOR,
    borderRadius: "25px",
    padding: "3rem 1rem",
    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.08)",
  },
  productCard: {
    border: "1px solid #e9ecef",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    backgroundColor: WHITE_COLOR,
    cursor: "pointer",
    height: "100%",
    position: "relative",
  },
  imageContainer: (isMobile) => ({
    width: "100%",
    height: isMobile ? "180px" : "220px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  }),
  productImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    transition: "transform 0.3s ease-in-out",
    padding: "3px",
  },
  discountBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: SALE_COLOR,
    color: WHITE_COLOR,
    padding: "0.2rem 0.5rem",
    borderRadius: "50px",
    fontSize: "0.75rem",
    fontWeight: "900",
    zIndex: 10,
    boxShadow: "0 2px 5px rgba(220, 53, 69, 0.3)",
    letterSpacing: "0.5px",
  },
  brandText: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: ACCENT_COLOR,
    marginBottom: "1px",
    letterSpacing: "0.5px",
  },
  title: {
    fontSize: "1rem",
    fontWeight: "700",
    color: PRIMARY_TEXT_COLOR,
    marginBottom: "4px",
  },
  price: {
    fontSize: "1.4rem",
    fontWeight: "900",
    color: SALE_COLOR,
    letterSpacing: "-0.5px",
  },
  originalPrice: { fontSize: "0.8rem", color: "#adb5bd" },
  header: {
    fontSize: "2.5rem",
    fontWeight: "900",
    color: PRIMARY_TEXT_COLOR,
    letterSpacing: "-1.5px",
    display: "inline-block",
    position: "relative",
    paddingBottom: "12px",
  },
  headerUnderline: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100px",
    height: "3px",
    backgroundColor: ACCENT_COLOR,
    borderRadius: "2px",
  },
  viewDealButton: {
    transition: "all 0.3s ease",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "700",
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    padding: "0.4rem 0.8rem",
  },
  viewDealButtonHover: {
    backgroundColor: SALE_COLOR,
    borderColor: SALE_COLOR,
    transform: "translateY(-2px)",
    boxShadow: `0 5px 15px ${SALE_COLOR}80`,
  },
  exploreButton: {
    backgroundColor: PRIMARY_TEXT_COLOR,
    color: "white",
    borderColor: PRIMARY_TEXT_COLOR,
    transition: "all 0.3s ease-in-out",
    borderRadius: "50px",
    fontSize: "1.1rem",
    padding: "0.6rem 3rem",
    boxShadow: `0 8px 25px ${PRIMARY_TEXT_COLOR}40`,
  },
  exploreButtonHover: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    transform: "scale(1.03)",
    boxShadow: `0 5px 15px ${ACCENT_COLOR}60`,
  },
};

// 🧠 Utility Functions
const handleCardMouseEnter = (e) => {
  e.currentTarget.style.transform = "translateY(-8px)";
  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
  e.currentTarget.querySelector("img").style.transform = "scale(1.03)";
};
const handleCardMouseLeave = (e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = customStyles.productCard.boxShadow;
  e.currentTarget.querySelector("img").style.transform = "scale(1)";
};
const handleViewDealMouseEnter = (e) =>
  Object.assign(e.currentTarget.style, customStyles.viewDealButtonHover);
const handleViewDealMouseLeave = (e) =>
  Object.assign(e.currentTarget.style, {
    ...customStyles.viewDealButton,
    transform: "none",
    boxShadow: "none",
  });
const handleExploreMouseEnter = (e) =>
  Object.assign(e.currentTarget.style, customStyles.exploreButtonHover);
const handleExploreMouseLeave = (e) =>
  Object.assign(e.currentTarget.style, {
    ...customStyles.exploreButton,
    transform: "none",
    boxShadow: customStyles.exploreButton.boxShadow,
  });

const getProductImageSource = (product) => {
  if (typeof product.image === "string" && product.image.trim() !== "")
    return product.image;
  if (Array.isArray(product.images) && product.images.length > 0)
    return product.images[0];
  return "https://placehold.co/300x380/e0e0e0/555?text=NO+IMAGE";
};
const calculateDiscount = (price, originalPrice) => {
  if (originalPrice > price)
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  return 0;
};
const generateDummyProduct = (index) => {
  const basePrice = Math.floor(Math.random() * 800) + 1500;
  const discountFactor = Math.random() * 0.5 + 0.3;
  const finalPrice = Math.floor(basePrice * discountFactor);
  const originalPrice =
    basePrice <= finalPrice
      ? finalPrice + Math.floor(Math.random() * 500) + 500
      : basePrice;
  return {
    id: `home-dummy-${index}`,
    name: `Elegant Photo Frame ${index + 1}`,
    brand: "HOME GALLERY",
    price: finalPrice,
    originalPrice,
    image: `https://picsum.photos/seed/home${index}/300/300`,
  };
};

// 🧩 MAIN COMPONENT
function HomePhotoFrameSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 576);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchHomeFrames = async () => {
      setLoading(true);
      try {
        // 🧠 LocalStorage cache check
        const cached = localStorage.getItem("homeProducts");
        if (cached) {
          setProducts(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const categoryName = "Home";
        const productLimit = 4;
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", categoryName));
        const snapshot = await getDocs(q);

        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          price: doc.data().price ? Number(doc.data().price) : 499,
          originalPrice: doc.data().originalPrice
            ? Number(doc.data().originalPrice)
            : 999,
        }));

        // Ensure at least 4 items
        while (data.length < productLimit)
          data.push(generateDummyProduct(data.length));

        // Shuffle & limit
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }

        data = data.slice(0, productLimit);
        setProducts(data);
        localStorage.setItem("homeProducts", JSON.stringify(data)); // Cache
      } catch (err) {
        console.warn("Firebase fetch failed, using dummy products:", err);
        setProducts(Array.from({ length: 4 }, (_, i) => generateDummyProduct(i)));
      } finally {
        setLoading(false);
      }
    };
    fetchHomeFrames();
  }, []);

  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      <Container className="py-4" style={customStyles.sectionContainer}>
        {/* Header */}
        <div className="text-center mb-3 mb-md-4">
          <h3 style={customStyles.header}>
            FRAME YOUR MEMORIES <span style={{ color: ACCENT_COLOR }}>ON SALE</span>
            <div style={customStyles.headerUnderline}></div>
          </h3>
          <p className="text-muted mt-2 fs-6 fw-light d-none d-sm-block">
            Discover premium photo frames and home décor deals.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted fs-6">Loading home products...</p>
          </div>
        ) : (
          <>
            <Row
              xs={2}
              sm={2}
              md={3}
              lg={4}
              className="g-2 g-md-3 justify-content-center"
            >
              {products.map((product) => {
                const discountPercent = calculateDiscount(
                  product.price,
                  product.originalPrice
                );
                return (
                  <Col key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      className="text-decoration-none d-block"
                    >
                      <Card
                        className="h-100 product-card"
                        style={customStyles.productCard}
                        onMouseEnter={handleCardMouseEnter}
                        onMouseLeave={handleCardMouseLeave}
                      >
                        {discountPercent > 0 && (
                          <Badge style={customStyles.discountBadge}>
                            -{discountPercent}% OFF
                          </Badge>
                        )}
                        <div style={customStyles.imageContainer(isMobile)}>
                          <LazyLoadImage
                            src={getProductImageSource(product)}
                            alt={product.name}
                            effect="blur"
                            style={customStyles.productImage}
                            onError={(e) =>
                              (e.target.src =
                                "https://placehold.co/300x380/e0e0e0/555?text=Image+Error")
                            }
                          />
                        </div>
                        <Card.Body className="text-start p-2 p-md-3 d-flex flex-column">
                          <p
                            style={customStyles.brandText}
                            className="text-uppercase"
                          >
                            {product.brand}
                          </p>
                          <Card.Title
                            style={customStyles.title}
                            className="text-truncate"
                          >
                            {product.name}
                          </Card.Title>
                          <div className="d-flex align-items-baseline justify-content-between mt-auto pt-1 pt-md-2">
                            <Card.Text style={customStyles.price}>
                              ₹{product.price}
                            </Card.Text>
                            {product.originalPrice > product.price && (
                              <small
                                style={customStyles.originalPrice}
                                className="text-decoration-line-through"
                              >
                                ₹{product.originalPrice}
                              </small>
                            )}
                          </div>
                          <Button
                            variant="success"
                            style={customStyles.viewDealButton}
                            className="w-100 mt-2 text-uppercase"
                            onMouseEnter={handleViewDealMouseEnter}
                            onMouseLeave={handleViewDealMouseLeave}
                          >
                            View Deal
                          </Button>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>

            <div className="text-center mt-4 pt-3">
              <Link to="/photoframe">
                <Button
                  style={customStyles.exploreButton}
                  size="md"
                  className="fw-bold"
                  onMouseEnter={handleExploreMouseEnter}
                  onMouseLeave={handleExploreMouseLeave}
                >
                  Explore All Frames →
                </Button>
              </Link>
            </div>
          </>
        )}
      </Container>
    </Container>
  );
}

export default HomePhotoFrameSection;
