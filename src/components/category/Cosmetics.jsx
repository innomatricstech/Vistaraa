import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

function Cosmetics() {
  // ✅ Using the simplified structure from the Book component
  const categoryName = "Cosmetics";
  const fetchLimit = 100; // Limits the number of products fetched (Same as Book/Electronics)

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCosmeticsData = async () => {
      try {
        const productsRef = collection(db, "products");

        // 🔹 Simplified Query: Filter 'products' collection directly by 'category' field
        const productsQuery = query(
          productsRef,
          where("category", "==", categoryName), // Assumes products have a 'category' field
          limit(fetchLimit)
        );

        const productSnapshot = await getDocs(productsQuery);

        if (productSnapshot.empty) {
          console.warn(`No products found for category: ${categoryName}`);
        }

        const fetchedProducts = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("🔥 Error fetching cosmetics:", err);
        // Using a generalized, user-friendly error message
        setError(`Failed to load ${categoryName} products. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchCosmeticsData();
  }, []);

  // 🌀 Loading UI
  if (loading) {
    return (
      <Container className="text-center my-5">
        {/* Using a distinct variant for visual difference */}
        <Spinner animation="border" variant="secondary" /> 
        <p>Loading {categoryName} Products...</p>
      </Container>
    );
  }

  // ⚠️ Error UI
  if (error) {
    return (
      <Container className="text-center my-5 text-danger">
        <p>Error: {error}</p>
      </Container>
    );
  }

  // ✅ Success UI
  return (
    <Container className="my-5 text-center">
      <h2 className="fw-bold text-dark mb-4">{categoryName} Collection 💄</h2>

      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  // Assuming 'image' field for Cosmetics (like Book)
                  src={product.image || "https://via.placeholder.com/150"} 
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-truncate">
                    {product.name || 'Untitled Cosmetic Product'}
                  </Card.Title>
                  {/* Using success color for prices (consistent with Book) */}
                  <Card.Text className="text-success fw-bold">
                    {product.price ? `₹${product.price}` : "Price N/A"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        // Using a distinct background/text color for the "No products" message
        <div className="p-4 bg-secondary bg-opacity-10 rounded"> 
          <p className="text-secondary fw-bold mb-0">
            No products found for the {categoryName} category yet.
          </p>
        </div>
      )}
    </Container>
  );
}

export default Cosmetics;