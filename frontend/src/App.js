import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import UserStoreList from './components/UserStoreList';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !role || !allowedRoles.includes(role)) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="container-fluid p-0">
        {localStorage.getItem('token') && (
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
              <span className="navbar-brand">Store Rating App</span>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                  {role === 'ADMIN' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/admin">Dashboard</Link>
                      </li>
                      <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          id="addNewDropdown"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Add New
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="addNewDropdown">
                          <li>
                            <Link className="dropdown-item" to="/admin" onClick={() => document.getElementById('createUserForm')?.scrollIntoView()}>
                              User/Admin
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" to="/admin" onClick={() => document.getElementById('createStoreForm')?.scrollIntoView()}>
                              Store
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          id="viewListsDropdown"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          View Lists
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="viewListsDropdown">
                          <li>
                            <Link className="dropdown-item" to="/admin" onClick={() => document.getElementById('usersSection')?.scrollIntoView()}>
                              Users
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" to="/admin" onClick={() => document.getElementById('storesSection')?.scrollIntoView()}>
                              Stores
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}
                  {role === 'USER' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/stores">Store List</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/stores" onClick={() => document.getElementById('passwordUpdateForm')?.scrollIntoView()}>
                          Password Update
                        </Link>
                      </li>
                    </>
                  )}
                  {role === 'STORE_OWNER' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/owner">Dashboard</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/owner" onClick={() => document.getElementById('passwordUpdateForm')?.scrollIntoView()}>
                          Password Update
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
                <button className="btn btn-danger" onClick={() => setShowLogoutModal(true)}>
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserStoreList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Logout</h5>
                  <button type="button" className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to logout?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;