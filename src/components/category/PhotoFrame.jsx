import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Spinner, Row, Col, Card, Alert } from "react-bootstrap";
import { db } from "../../firebase"; // Firebase Configuration
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { Link } from "react-router-dom";

// 🌈 Utility: Extract color from description
const extractColorFromDescription = (description) => {
  if (!description || typeof description !== "string") return "N/A";
  const match = description.match(/color:\s*([a-zA-Z]+)/i);
  return match ? match[1] : "N/A";
};

// 💎 Product Card (Copied and adjusted for PhotoFrame)
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const productColor =
    product.color || extractColorFromDescription(product.description);

  const cardStyle = {
    border: "none",
    borderRadius: "16px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxShadow: isHovered
      ? "0 10px 25px rgba(0,0,0,0.15)"
      : "0 4px 12px rgba(0,0,0,0.1)",
    transform: isHovered ? "translateY(-8px) scale(1.03)" : "scale(1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const imageContainer = {
    height: "250px",
    backgroundColor: "#f8f9fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  };

  const imageStyle = {
    height: "100%",
    width: "100%",
    objectFit: "contain",
    transition: "transform 0.4s ease",
    transform: isHovered ? "scale(1.1)" : "scale(1)",
  };

  // Utility to get the correct image source (handling single string or array)
  const getProductImageSource = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
    if (typeof product.image === "string" && product.image.trim() !== "") return product.image;
    return "https://via.placeholder.com/250x300.png?text=No+Image";
  };

  return (
    <Col>
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card style={cardStyle} className="h-100">
          <div style={imageContainer}>
            <Card.Img
              variant="top"
              src={getProductImageSource(product)}
              alt={product.name || "Unnamed Photo Frame"}
              style={imageStyle}
            />
          </div>
          <Card.Body className="p-3 text-center">
            <Card.Title className="fs-6 fw-semibold text-dark text-truncate">
              {product.name || "Unnamed Photo Frame"}
            </Card.Title>
            <Card.Text className="text-secondary small mb-2">
              Color:{" "}
              <strong
                style={{ color: productColor !== "N/A" ? "black" : "grey" }}
              >
                {productColor}
              </strong>
            </Card.Text>
            <Card.Text className="text-success fw-bold fs-5">
              ₹{product.price || "N/A"}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

// -------------------------------------------------------------
function PhotoFrame() {
  // ✅ CHANGE MADE HERE: Set categoryName to "Home" to match your Firestore data.
  const categoryName = "Home"; 
  const PAGE_SIZE = 8;

  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // 🧠 Initial fetch with Random Start
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        setLoading(true);
        setProducts([]);
        setHasMore(true);

        const productsRef = collection(db, "products");

        // 1. Get total product count for the category
        const countQuery = query(
          productsRef,
          where("category", "==", categoryName)
        );
        const countSnapshot = await getDocs(countQuery);
        const totalProducts = countSnapshot.docs.length;

        if (totalProducts === 0) {
          setLoading(false);
          setHasMore(false);
          return;
        }

        // 2. Calculate Random Skip Count
        const maxSkip = totalProducts - PAGE_SIZE;
        const skipCount =
          totalProducts > PAGE_SIZE ? Math.floor(Math.random() * maxSkip) : 0;

        let startDoc = null;

        // 3. Fetch the document to start after (if skipping)
        if (skipCount > 0) {
          const startDocQuery = query(
            productsRef,
            where("category", "==", categoryName),
            orderBy("name"), // Must match the main query's orderBy
            limit(skipCount)
          );
          const startDocSnapshot = await getDocs(startDocQuery);
          startDoc = startDocSnapshot.docs[startDocSnapshot.docs.length - 1];
        }

        // 4. Main Initial Query
        let initialQuery = query(
          productsRef,
          where("category", "==", categoryName),
          orderBy("name"),
          limit(PAGE_SIZE)
        );

        if (startDoc) {
          // Apply startAfter if we are skipping
          initialQuery = query(
            productsRef,
            where("category", "==", categoryName),
            orderBy("name"),
            startAfter(startDoc),
            limit(PAGE_SIZE)
          );
        }

        const snapshot = await getDocs(initialQuery);
        const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(fetched);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

        // Check if all products were fetched
        if (snapshot.docs.length < PAGE_SIZE || totalProducts <= PAGE_SIZE)
          setHasMore(false);
      } catch (err) {
        console.error(`🔥 Error fetching ${categoryName}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, [categoryName]);

  // 🌀 Load More (Infinite Scroll Logic)
  const loadMore = useCallback(async () => {
    if (!lastVisible || loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const productsRef = collection(db, "products");
      const nextQuery = query(
        productsRef,
        where("category", "==", categoryName),
        orderBy("name"),
        startAfter(lastVisible), // Continue from the last document
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(nextQuery);
      const newProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (newProducts.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...newProducts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      if (snapshot.docs.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.error(`Error loading more ${categoryName}:`, err);
    } finally {
      setLoadingMore(false);
    }
  }, [lastVisible, loadingMore, hasMore, categoryName]);

  // 👁️ Intersection Observer
  const lastProductRef = useCallback(
    (node) => {
      if (loadingMore || loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      });
      if (node) observer.current.observe(node);
    },
    [loadMore, hasMore, loadingMore, loading]
  );

  // 🧩 Render
  return (
    <Container className="my-5 text-center">
      <h2 className="fw-bold mb-3" style={{ color: "#333", fontSize: "2rem", letterSpacing: "1px" }}>
        🖼️ {categoryName} Collection
      </h2>
      <p className="text-muted mb-5">
        Showcase your favourite memories with our stunning photo frames!
      </p>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" /> 
          <p className="mt-3 text-muted">Loading {categoryName}...</p>
        </div>
      ) : products.length > 0 ? (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {products.map((product, index) => {
              // Attach ref to the last product for infinite scroll only if hasMore is true
              const isLastElement = index === products.length - 1;
              const ref = isLastElement && hasMore ? lastProductRef : null;
              return (
                <div ref={ref} key={product.id}>
                  <ProductCard product={product} />
                </div>
              );
            })}
          </Row>

          {loadingMore && (
            <div className="text-center my-4">
              <Spinner animation="grow" variant="secondary" />
              <p className="text-muted">Loading more...</p>
            </div>
          )}

          {!hasMore && (
            <p className="text-muted mt-4 p-3 border-top">
              🎉 **You’ve reached the end of the {categoryName} catalog!**
            </p>
          )}
        </>
      ) : (
        <Alert variant="warning" className="p-4">
          <p className="text-warning fw-bold mb-0">No products found in {categoryName}.</p>
        </Alert>
      )}
    </Container>
  );
}

export default PhotoFrame;