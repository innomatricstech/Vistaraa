  // src/pages/Footwears.jsx
  import React, { useState, useEffect, useRef, useCallback } from "react";
  import { Container, Spinner, Row, Col, Card, Alert } from "react-bootstrap";
  import { db } from "../../firebase";
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

  const extractColorFromDescription = (description) => {
    if (!description || typeof description !== "string") return "N/A";
    const match = description.match(/color:\s*([a-zA-Z]+)/i);
    return match ? match[1] : "N/A";
  };

  const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const productColor =
      product.color || extractColorFromDescription(product.description);

    return (
      <Col>
        <Link
          to={`/product/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card
            style={{
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
            }}
            className="h-100"
          >
            <div
              style={{
                height: "250px",
                backgroundColor: "#f8f9fa",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Card.Img
                variant="top"
                src={
                  product.images ||
                  product.image ||
                  "https://via.placeholder.com/250x300.png?text=No+Image"
                }
                alt={product.name || "Unnamed Footwear"}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                  transition: "transform 0.4s ease",
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                }}
              />
            </div>
            <Card.Body className="p-3 text-center">
              <Card.Title className="fs-6 fw-semibold text-dark text-truncate">
                {product.name || "Unnamed Footwear"}
              </Card.Title>
              <Card.Text className="text-secondary small mb-2">
                Color:{" "}
                <strong style={{ color: productColor !== "N/A" ? "black" : "grey" }}>
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

  function Footwears() {
    const categoryName = "Footwears"; // ✅ FIXED - MATCHES FIRESTORE
    const PAGE_SIZE = 8;

    const [products, setProducts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();

    useEffect(() => {
      const fetchInitialProducts = async () => {
        try {
          setLoading(true);
          const productsRef = collection(db, "products");

          const q = query(
            productsRef,
            where("category", "==", categoryName),
            orderBy("name"),
            limit(PAGE_SIZE)
          );

          const snapshot = await getDocs(q);
          const fetched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setProducts(fetched);
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

          if (snapshot.docs.length < PAGE_SIZE) setHasMore(false);
        } catch (err) {
          console.error("Error fetching Footwears:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchInitialProducts();
    }, []);

    const loadMore = useCallback(async () => {
      if (!lastVisible || loadingMore || !hasMore) return;

      try {
        setLoadingMore(true);

        const nextQuery = query(
          collection(db, "products"),
          where("category", "==", categoryName),
          orderBy("name"),
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );

        const snapshot = await getDocs(nextQuery);
        const newProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (newProducts.length === 0) {
          setHasMore(false);
          return;
        }

        setProducts((prev) => [...prev, ...newProducts]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      } catch (err) {
        console.log("Error loading more:", err);
      } finally {
        setLoadingMore(false);
      }
    }, [lastVisible, loadingMore, hasMore]);

    const lastProductRef = useCallback(
      (node) => {
        if (loadingMore || loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) loadMore();
        });

        if (node) observer.current.observe(node);
      },
      [loadMore, loadingMore, loading, hasMore]
    );

    return (
      <Container className="my-5 text-center">
        <h2 className="fw-bold text-warning mb-3">👟 Footwears Collection</h2>

        {loading ? (
          <Spinner animation="border" variant="warning" className="my-5" />
        ) : products.length > 0 ? (
          <>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {products.map((product, index) => {
                const isLast = index === products.length - 1;
                return (
                  <div key={product.id} ref={isLast ? lastProductRef : null}>
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </Row>

            {loadingMore && (
              <div className="my-4">
                <Spinner animation="grow" />
                <p>Loading more...</p>
              </div>
            )}
          </>
        ) : (
          <Alert variant="warning">No Footwears found!</Alert>
        )}
      </Container>
    );
  }

  export default Footwears;
