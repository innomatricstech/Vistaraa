// src/pages/OrderConformPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Modal,
  ListGroup,
  Table,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function OrderConformPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Expecting these values from Checkout: paymentMethod, total, itemsCount, billingDetails, cartItems, sellerid
  const { paymentMethod, total, itemsCount, billingDetails, cartItems = [], sellerid } = location.state || {};

  const defaultBillingDetails = {
    fullName: "N/A",
    address: "Details not available",
    city: "N/A",
    pincode: "N/A",
    phone: "N/A",
  };

  const initialBillingDetails = billingDetails
    ? {
        fullName: billingDetails.fullName || defaultBillingDetails.fullName,
        address: billingDetails.address || defaultBillingDetails.address,
        city: billingDetails.city || defaultBillingDetails.city,
        pincode: billingDetails.pincode || defaultBillingDetails.pincode,
        phone: billingDetails.phone || defaultBillingDetails.phone,
      }
    : defaultBillingDetails;

  // Generate order ID consistent with other pages (ORD-...)
  const [orderInfo] = useState({
    orderId: `ORD-${Date.now()}`,
    billingDetails: initialBillingDetails,
    // Dynamic delivery date: current date + 3 to 4 days randomly
    expectedDeliveryDate: (() => {
      const today = new Date();
      const deliveryDays = Math.floor(Math.random() * 2) + 3; // 3 or 4 days
      today.setDate(today.getDate() + deliveryDays);
      return today.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    })(),
  });

  const [showModal, setShowModal] = useState(false);

  // nice currency formatter
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(val || 0));

  // Save to localStorage once, avoid duplicates by orderId
  useEffect(() => {
    window.scrollTo(0, 0);

    if (paymentMethod && total !== undefined) {
      const newOrder = {
        id: orderInfo.orderId,
        date: new Date().toLocaleString("en-IN"),
        total: Number(total),
        formattedTotal: formatCurrency(total),
        paymentMethod,
        itemsCount: itemsCount || cartItems.length || 0,
        shippingAddress: orderInfo.billingDetails,
        expectedDeliveryDate: orderInfo.expectedDeliveryDate,
        sellerid: sellerid ?? null,
        products: cartItems,
      };

      try {
        const existingOrders = JSON.parse(localStorage.getItem("userOrders")) || [];

        // prevent duplicates: check if same orderId already exists
        const exists = existingOrders.some((o) => o.id === newOrder.id);
        if (!exists) {
          existingOrders.unshift(newOrder);
          localStorage.setItem("userOrders", JSON.stringify(existingOrders));
        } else {
          console.log("Order already saved in localStorage:", newOrder.id);
        }

        setShowModal(true); // Show modal after saving order (first load)
      } catch (error) {
        console.error("Error saving order:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, total, orderInfo]);

  if (!paymentMethod) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">Order details not found. Please check your order history.</Alert>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go to Homepage
        </Button>
      </Container>
    );
  }

  // Download a simple text receipt
  const handleDownloadReceipt = () => {
    const receiptLines = [
      `Order ID: ${orderInfo.orderId}`,
      `Date: ${new Date().toLocaleString("en-IN")}`,
      `Payment Method: ${paymentMethod}`,
      `Total: ${formatCurrency(total)}`,
      `Buyer: ${orderInfo.billingDetails.fullName}`,
      `Address: ${orderInfo.billingDetails.address}, ${orderInfo.billingDetails.city} - ${orderInfo.billingDetails.pincode}`,
      `Phone: ${orderInfo.billingDetails.phone}`,
      `Seller ID(s): ${Array.isArray(sellerid) ? sellerid.join(", ") : sellerid || "N/A"}`,
      "",
      "Products:",
      ...(cartItems.length
        ? cartItems.map((it, idx) => `  ${idx + 1}. ${it.title || it.name || "Product"} x${it.quantity || 1} - ${formatCurrency((it.price || 0) * (it.quantity || 1))}`)
        : ["  (no product data)"]),
    ];

    const blob = new Blob([receiptLines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orderInfo.orderId}_receipt.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={9}>
          {/* SUCCESS POPUP MODAL */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" size="md" className="text-center">
            <Modal.Body>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
                <i className="fas fa-check-circle mb-3" style={{ fontSize: "4rem", color: "#28a745" }} />
                <h4 className="fw-bold text-success">Order Placed Successfully!</h4>
                <p className="text-muted mb-3">Thank you for shopping with us 🎁</p>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => {
                      setShowModal(false);
                      navigate("/orders");
                    }}
                  >
                    View My Orders
                  </Button>
                  <Button
                    variant="outline-dark"
                    onClick={() => {
                      setShowModal(false);
                      navigate("/");
                    }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </motion.div>
            </Modal.Body>
          </Modal>

          {/* ORDER SUMMARY CARD */}
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <Card className="shadow-lg mb-4 border-success">
              <Card.Header className="bg-light py-3 border-success">
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle me-3" style={{ color: "#28a745", fontSize: "1.8rem" }} />
                  <div>
                    <h4 className="mb-0 text-success fw-bold">ORDER CONFIRMATION</h4>
                    <small className="text-muted">Your order has been successfully placed.</small>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="text-center">
                  <Col md={4} className="border-end">
                    <p className="mb-1 fw-semibold text-secondary">Order ID</p>
                    <h5 className="fw-bold text-dark">{orderInfo.orderId}</h5>
                  </Col>
                  <Col md={4} className="border-end">
                    <p className="mb-1 fw-semibold text-secondary">Total Amount</p>
                    <h5 className="fw-bold text-danger">{formatCurrency(total)}</h5>
                  </Col>
                  <Col md={4}>
                    <p className="mb-1 fw-semibold text-secondary">Payment Mode</p>
                    <h5 className="fw-bold text-primary">{paymentMethod}</h5>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* DELIVERY DETAILS */}
            <Card className="shadow-sm mb-4">
              <Card.Header className="fw-bold bg-light">
                <i className="fas fa-truck me-2 text-warning" /> DELIVERY DETAILS
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="border-end">
                    <h6 className="fw-bold text-success mb-2">Expected Delivery</h6>
                    <p className="mb-1">
                      <i className="far fa-calendar-alt me-2" />
                      Expected by: <b>{orderInfo.expectedDeliveryDate}</b>
                    </p>
                    <p className="text-muted small">You will receive {itemsCount || cartItems.length || "your"} item(s) by this date.</p>
                    <p className="mt-3 small text-muted">Seller ID(s): <b>{Array.isArray(sellerid) ? sellerid.join(", ") : sellerid || "N/A"}</b></p>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold mb-2">Shipping Address</h6>
                    <p className="mb-1 fw-bold">{orderInfo.billingDetails.fullName}</p>
                    <p className="mb-1 text-muted small">
                      {orderInfo.billingDetails.address}, {orderInfo.billingDetails.city} - {orderInfo.billingDetails.pincode}
                    </p>
                    <p className="mb-0 text-muted small">Phone: {orderInfo.billingDetails.phone}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ORDER ITEMS */}
            <Card className="shadow-sm mb-4">
              <Card.Header className="fw-bold bg-light">
                <i className="fas fa-box-open me-2 text-info" /> ITEMS IN THIS ORDER
              </Card.Header>
              <Card.Body>
                {cartItems && cartItems.length ? (
                  <Table responsive bordered hover className="mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Seller ID</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((it, idx) => (
                        <tr key={`${it.id || idx}-${idx}`}>
                          <td>{idx + 1}</td>
                          <td>{it.title || it.name || "Product"}</td>
                          <td>{it.sellerId || it.sellerid || it.seller || "N/A"}</td>
                          <td>{it.quantity || 1}</td>
                          <td>{formatCurrency(it.price || 0)}</td>
                          <td>{formatCurrency((it.price || 0) * (it.quantity || 1))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted mb-0">No item details available.</p>
                )}
              </Card.Body>
              <Card.Body className="text-center">
                <Button variant="outline-primary" className="fw-bold me-3" onClick={() => navigate("/orders")}>
                  View Order Details
                </Button>
                <Button variant="warning" className="fw-bold me-3" onClick={handleDownloadReceipt}>
                  Download Receipt
                </Button>
                <Button variant="success" className="fw-bold" onClick={() => navigate("/")}>
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default OrderConformPage;
  