// src/pages/CashOnDelivery.jsx
import React, { useState, useEffect } from "react";
// UI
import { Container, Row, Col, Card, Button, Spinner, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/cartSlice";
// Firestore + Auth
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase";

function CashOnDelivery() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Data from Checkout -> COD page
  const billingDetails = location.state?.billingDetails || {};
  const cartItems = location.state?.cartItems || [];
  const productSkus = location.state?.productSkus || {};
  const totalPrice = location.state?.totalPrice || 0;
  const coordinates = location.state?.coordinates || { lat: null, lng: null };

  // Local state
  const [userId, setUserId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Helper popup
  const showPopup = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  // Auth listener to get userId
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  // ---------- Helper: determine seller id from item ----------
  const getSellerIdForCartItem = (item) => {
    // Check many possible fields where seller id may be stored
    return (
      item.sellerId ||
      item.sellerid ||
      item.seller ||
      item.vendorId ||
      item.vendor_id ||
      item.sellersid ||
      item.storeId ||
      item.merchantId ||
      "default_seller"
    );
  };

  // ---------- Save order to sellers/{sellerId}/orders ----------
  const saveOrderToSellerCollections = async (orderData, orderDocId) => {
    try {
      const productsBySeller = {};
      (orderData.products || []).forEach((product) => {
        const sellerId = product.sellerId || "default_seller";
        if (!productsBySeller[sellerId]) productsBySeller[sellerId] = [];
        productsBySeller[sellerId].push(product);
      });

      for (const [sellerId, sellerProducts] of Object.entries(productsBySeller)) {
        const sellerOrdersRef = collection(db, "sellers", sellerId, "orders");
        const sellerSubtotal = sellerProducts.reduce((t, p) => t + (p.totalAmount || p.price * p.quantity || 0), 0);

        const sellerOrderData = {
          orderId: orderData.orderId,
          orderDocId,
          userId: orderData.userId,
          products: sellerProducts,
          totalAmount: sellerSubtotal,
          shippingCharges: orderData.shippingCharges || 0,
          paymentMethod: orderData.paymentMethod || null,
          orderStatus: orderData.orderStatus || "Pending",
          createdAt: serverTimestamp(),
          orderDate: serverTimestamp(),
          customerName: orderData.name || null,
          customerPhone: orderData.phoneNumber || null,
          address: orderData.address || null,
          latitude: orderData.latitude || null,
          longitude: orderData.longitude || null,
          sellerId,
        };

        // Add doc to sellers/{sellerId}/orders
        await addDoc(sellerOrdersRef, sellerOrderData);
      }
    } catch (err) {
      console.error("Error in saveOrderToSellerCollections:", err);
      // non-fatal — continue
    }
  };

  // ---------- Update each seller root doc with summary ----------
  const updateSellerDocuments = async (sellerIds, orderDocId, orderData) => {
    try {
      for (const sellerId of sellerIds) {
        if (!sellerId) continue;
        const sellerRef = doc(db, "sellers", sellerId);

        // compute seller-specific subtotal/products
        const sellerProducts = (orderData.products || []).filter((p) => p.sellerId === sellerId);
        const sellerSubtotal = sellerProducts.reduce((t, p) => t + (p.totalAmount || p.price * p.quantity || 0), 0);

        const orderSummary = {
          orderId: orderData.orderId,
          orderDocId,
          customerName: orderData.name,
          customerPhone: orderData.phoneNumber,
          totalAmount: sellerSubtotal,
          orderDate: serverTimestamp(),
          orderStatus: orderData.orderStatus,
          products: sellerProducts,
          address: orderData.address,
        };

        // Ensure seller doc exists (create minimal if missing)
        const sellerSnap = await getDoc(sellerRef);
        if (!sellerSnap.exists()) {
          await updateDoc(sellerRef, {
            createdAt: serverTimestamp(),
            sellerId,
            orders: [],
            totalSales: 0,
            lastOrderDate: serverTimestamp(),
          }).catch((err) => {
            // If update fails because doc doesn't exist, fallback to set via addDoc is not needed here;
            // updateDoc with merge will create the doc when it doesn't exist in server SDK, but if your rules block it maybe fail.
            console.warn("Could not initialize seller doc:", sellerId, err);
          });
        }

        // Append order summary & increment totalSales
        await updateDoc(sellerRef, {
          orders: arrayUnion(orderSummary),
          lastOrderDate: serverTimestamp(),
          totalSales: increment(sellerSubtotal),
          updatedAt: serverTimestamp(),
        }).catch((err) => {
          console.warn("Could not update seller document:", sellerId, err);
        });
      }
    } catch (err) {
      console.error("Error in updateSellerDocuments:", err);
    }
  };

  // ---------- Main: Save order to Firestore (users/{uid}/orders) and related places ----------
  const saveOrderToFirestore = async (paymentMethod, status = "Pending", paymentId = null) => {
    if (!userId) {
      showPopup("Authentication Required", "You must be logged in to place an order.");
      return false;
    }

    try {
      // Build sellerIds array from cart items
      const sellerIdsInOrder = [...new Set((cartItems || []).map((it) => getSellerIdForCartItem(it)))].filter(Boolean);
      console.log("DEBUG sellerIdsInOrder:", sellerIdsInOrder);

      // Build products payload (include sellerId per product)
      const products = (cartItems || []).map((item) => {
        const hasVariantData = item.stock || item.weight || item.width || item.height;
        const sizevariants =
          hasVariantData || item.color || item.size
            ? {
                sku: item.sku !== "N/A" ? item.sku : null,
                stock: item.stock || null,
                weight: item.weight || null,
                width: item.width || null,
                height: item.height || null,
              }
            : undefined;
        const finalSku = productSkus[item.id] || (item.sku !== "N/A" ? item.sku : item.id);
        const sellerId = getSellerIdForCartItem(item);

        return {
          productId: item.id,
          name: item.title || item.name || "Unnamed Product",
          price: item.price || 0,
          quantity: item.quantity || 1,
          sku: finalSku,
          brandName: item.brandName || null,
          category: item.category || null,
          color: item.color || null,
          size: item.size || null,
          images: item.images || [],
          sellerId,
          ...(sizevariants && { sizevariants }),
          totalAmount: (item.price || 0) * (item.quantity || 1),
        };
      });

      // Determine sellerid field exactly as you asked: single string when one seller, else array
      const selleridField = sellerIdsInOrder.length === 1 ? sellerIdsInOrder[0] : sellerIdsInOrder;

      const orderId = `ORD-${Date.now()}`;

      const orderData = {
        userId,
        orderId,
        orderStatus: status,
        totalAmount: totalPrice,
        paymentMethod,
        phoneNumber: billingDetails.phone || null,
        createdAt: serverTimestamp(),
        orderDate: serverTimestamp(),
        address: `${billingDetails.address || ""} ,${billingDetails.city || ""} ,${billingDetails.pincode || ""} ,Karnataka`,
        latitude: coordinates.lat || null,
        longitude: coordinates.lng || null,
        name: billingDetails.fullName || null,

        // <-- EXACT KEY 'sellerid' requested by you
        sellerid: selleridField,

        products,
        paymentId,
        shippingCharges: 0,
      };

      console.log("DEBUG final orderData (COD):", orderData);

      // 1) Save to users/{uid}/orders
      const ordersRef = collection(db, "users", userId, "orders");
      const userOrderDocRef = await addDoc(ordersRef, orderData);
      console.log("Saved COD order to users/{uid}/orders, docId:", userOrderDocRef.id);

      // 2) Optional: save a copy to top-level 'orders' collection (makes it easy to view admin console)
      try {
        const rootOrdersRef = collection(db, "orders");
        const rootDocRef = await addDoc(rootOrdersRef, { ...orderData, originalUserOrdersDocId: userOrderDocRef.id });
        console.log("Saved copy to top-level orders, id:", rootDocRef.id);
      } catch (err) {
        console.warn("Could not save to top-level orders collection:", err);
      }

      // 3) Save order separately for each seller & update seller docs
      try {
        await saveOrderToSellerCollections(orderData, userOrderDocRef.id);
        await updateSellerDocuments(Array.isArray(sellerIdsInOrder) ? sellerIdsInOrder : [sellerIdsInOrder].filter(Boolean), userOrderDocRef.id, orderData);
        console.log("Seller collections & docs updated for:", sellerIdsInOrder);
      } catch (err) {
        console.warn("Warning: seller save/update failed", err);
      }

      return { success: true, docId: userOrderDocRef.id, sellerid: selleridField };
    } catch (error) {
      console.error("Error saving COD order:", error);
      showPopup("Order Error", "Failed to save order details to the database. Please try again.");
      return { success: false, error };
    }
  };

  // Final placement (called after confirm modal)
  const handleFinalOrderPlacement = async () => {
    if (isSaving) return;
    setShowConfirmModal(false);
    setIsSaving(true);

    const result = await saveOrderToFirestore("Cash on Delivery", "Pending", null);

    if (result && result.success) {
      // Clear cart in redux
      dispatch(clearCart());

      // navigate to confirmation page and pass sellerid and other details for display
      navigate("/order-confirm", {
        state: {
          paymentMethod: "Cash on Delivery",
          total: formatPrice(totalPrice),
          itemsCount: cartItems.length,
          billingDetails,
          cartItems,
          sellerid: result.sellerid,
          orderDocId: result.docId,
        },
      });
    }
    setIsSaving(false);
  };

  const handleConfirmOrder = () => {
    if (isSaving || !userId) return;
    setShowConfirmModal(true);
  };

  const handleBack = () => {
    navigate("/checkout", {
      state: {
        cartItems,
        billingDetails,
        productSkus,
        totalPrice,
        coordinates,
      },
    });
  };

  // If user not logged in or cart empty
  if (!userId || cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-danger">Error</h2>
        <p>Order data is missing or you are not logged in. Please return to checkout.</p>
        <Button onClick={handleBack} variant="primary">
          Go back to Checkout
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4">Cash on Delivery Order Confirmation</h2>

          <Card className="mb-4 shadow-sm p-4">
            <h5 className="mb-3">Billing Information</h5>
            <p>
              <strong>Name:</strong> {billingDetails.fullName || "-"}
            </p>
            <p>
              <strong>Email:</strong> {billingDetails.email || "-"}
            </p>
            <p>
              <strong>Phone:</strong> {billingDetails.phone || "-"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {billingDetails.address
                ? `${billingDetails.address}, ${billingDetails.city} - ${billingDetails.pincode}`
                : "-"}
            </p>

            {coordinates.lat && coordinates.lng && (
              <small className="d-block text-success fw-bold">
                Location Verified: Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
              </small>
            )}
          </Card>

          <Card className="mb-4 shadow-sm p-4">
            <h5 className="mb-3">Order Summary</h5>
            {cartItems.map((item, index) => (
              <div
                key={item.id + (item.sku || "") + index}
                className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2"
              >
                <div>
                  <p className="mb-0">{item.title || item.name || "Unnamed Product"}</p>
                  <small className="d-block text-muted">Quantity: {item.quantity}</small>
                  <small className="d-block text-muted">Seller: {getSellerIdForCartItem(item)}</small>
                </div>
                <span className="fw-bold">{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
              </div>
            ))}

            <hr />
            <p className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>{formatPrice(totalPrice)}</span>
            </p>
            <p className="d-flex justify-content-between mb-2">
              <span>Shipping:</span>
              <span className="text-success fw-semibold">Free</span>
            </p>
            <h5 className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </h5>
          </Card>

          <Button variant="warning" className="w-100 py-2 fw-semibold" onClick={handleConfirmOrder} disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Placing Order...
              </>
            ) : (
              "Confirm Cash on Delivery Order"
            )}
          </Button>
        </Col>
      </Row>

      {/* Informational modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title className={modalTitle.includes("Error") || modalTitle.includes("Required") ? "text-danger" : "text-warning"}>
            {modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Confirm Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to confirm your Cash on Delivery order?</p>
          <p className="fw-bold">Total Amount: {formatPrice(totalPrice)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleFinalOrderPlacement} disabled={isSaving}>
            Yes, Confirm Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CashOnDelivery;
