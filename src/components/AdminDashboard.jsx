import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white p-3">
        <h3 className="text-warning mb-4">Admin Panel</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a href="#" className="nav-link text-white">Dashboard</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">Orders</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">Products</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">Customers</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">Reports</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">Settings</a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h2>Dashboard Overview</h2>
          <div className="d-flex align-items-center">
            <input type="text" className="form-control me-2 search-input" placeholder="Search..." />
            <button className="btn btn-warning">Search</button>
          </div>
        </header>

        {/* Stats Section */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card stat-card">
              <div className="card-body">
                <h5>Sales</h5>
                <p className="stat-value">$12,340</p>
                <small className="text-success">+5.4% since last week</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card">
              <div className="card-body">
                <h5>Orders</h5>
                <p className="stat-value">1,245</p>
                <small className="text-success">+3.1% since last week</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card">
              <div className="card-body">
                <h5>Customers</h5>
                <p className="stat-value">854</p>
                <small className="text-danger">-1.2% since last week</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card">
              <div className="card-body">
                <h5>Products</h5>
                <p className="stat-value">312</p>
                <small className="text-muted">Stable</small>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card table-card">
          <div className="card-header bg-warning text-dark fw-bold">Recent Orders</div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#1001</td>
                  <td>John Doe</td>
                  <td>2025-10-01</td>
                  <td>$120.00</td>
                  <td><span className="badge bg-success">Delivered</span></td>
                </tr>
                <tr>
                  <td>#1002</td>
                  <td>Jane Smith</td>
                  <td>2025-10-03</td>
                  <td>$75.50</td>
                  <td><span className="badge bg-warning text-dark">Pending</span></td>
                </tr>
                <tr>
                  <td>#1003</td>
                  <td>Robert Brown</td>
                  <td>2025-10-05</td>
                  <td>$240.00</td>
                  <td><span className="badge bg-danger">Cancelled</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
