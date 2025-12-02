import React, { useState, useEffect } from 'react';
import { Container, Spinner, Card, Row, Col } from 'react-bootstrap';
import { collection, query, where, getDocs, limit } from 'firebase/firestore'; 
import { db } from '../../firebase'; // Assuming correct path

function Book() {
  // ✅ Using the same simplified structure as Electronics
  const categoryName = "Book"; 
  const fetchLimit = 100; // Limits the number of products fetched

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRef = collection(db, 'products');

        // Query products where the 'category' field equals "Book" and apply the limit
        // This assumes your product documents have a 'category' field with the value "Book"
        const productsQuery = query(
          productsRef,
          where('category', '==', categoryName),
          limit(fetchLimit)
        );
        
        const productsSnapshot = await getDocs(productsQuery);

        if (productsSnapshot.empty) {
          console.warn(`No products found for category: ${categoryName}`);
        }

        const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);

      } catch (err) {
        console.error(`Error fetching ${categoryName} data:`, err);
        setError(`Failed to load ${categoryName} products. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Runs once on mount

  if (loading) return (
    <Container className="text-center my-5">
      <Spinner animation="border" variant="primary" />
      <p>Loading {categoryName} Products...</p>
    </Container>
  );

  if (error) return (
    <Container className="text-center my-5 text-danger">
      <p>Error: {error}</p>
    </Container>
  );

  return (
    <Container className="my-5 text-center">
      {/* 📚 Updated emoji for Books */}
      <h2 className="fw-bold text-dark mb-4">{categoryName} Collection 📚</h2>

      {products.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map(product => (
            <Col key={product.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img 
                  variant="top" 
                  // Using 'image' here, assuming Book data might use a different key than Electronics ('images')
                  src={product.image || 'https://via.placeholder.com/150'} 
                  style={{ height: '150px', objectFit: 'cover' }} 
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-truncate">{product.name || 'Untitled Book'}</Card.Title>
                  {/* Using success color for book prices */}
                  <Card.Text className="text-success fw-bold">
                    {product.price ? `₹${product.price}` : 'Price N/A'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="p-4 bg-primary bg-opacity-10 rounded">
          <p className="text-primary fw-bold mb-0">No products found for the {categoryName} category yet.</p>
        </div>
      )}
    </Container>
  );
}

export default Book;