import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [newStore, setNewStore] = useState({ name: '', address: '' });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [sortField, setSortField] = useState('rating');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in again.');
          return;
        }

        const storeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/stores`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ownerStores = Array.isArray(storeResponse.data) ? storeResponse.data : [];
        setStores(ownerStores);

        const ratingResponse = await axios.get(`${process.env.REACT_APP_API_URL}/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let fetchedRatings = Array.isArray(ratingResponse.data) ? ratingResponse.data : [];
        fetchedRatings = fetchedRatings.filter(rating =>
          ownerStores.some(store => store.id === rating.storeId)
        );

        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUsers = Array.isArray(userResponse.data) ? userResponse.data : [];
        setUsers(fetchedUsers);

        fetchedRatings = fetchedRatings.map(rating => {
          const user = fetchedUsers.find(u => u.id === rating.userId);
          return { ...rating, userName: user?.name || 'Unknown', userEmail: user?.email || 'Unknown' };
        });

        fetchedRatings.sort((a, b) => {
          const fieldA = a[sortField]?.toString().toLowerCase() || '';
          const fieldB = b[sortField]?.toString().toLowerCase() || '';
          if (sortOrder === 'asc') {
            return fieldA > fieldB ? 1 : -1;
          }
          return fieldA < fieldB ? 1 : -1;
        });

        setRatings(fetchedRatings);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          setError('Authentication failed. Please log in again.');
          localStorage.removeItem('token');
        } else {
          setError(err.response?.data?.message || 'Failed to load data');
        }
      }
    };
    fetchData();
  }, [sortField, sortOrder]);

  const validatePasswordForm = () => {
    const errors = {};
    if (!oldPassword) {
      errors.oldPassword = 'Old password is required';
    }
    if (newPassword.length < 8 || newPassword.length > 16) {
      errors.newPassword = 'New password must be between 8 and 16 characters';
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
      errors.newPassword = 'New password must contain at least one uppercase letter and one special character';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (showPasswordForm) {
      validatePasswordForm();
    }
  }, [oldPassword, newPassword, showPasswordForm]);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/stores`,
        newStore,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const storeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(Array.isArray(storeResponse.data) ? storeResponse.data : []);
      setNewStore({ name: '', address: '' });
      alert('Store created!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(stores.filter(store => store.id !== id));
      setRatings(ratings.filter(rating => rating.storeId !== id));
      alert('Store deleted!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete store');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOldPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
      setFormErrors({});
      alert('Password updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const getAverageRating = (storeId) => {
    const storeRatings = ratings.filter(r => r.storeId === storeId);
    return storeRatings.length
      ? (storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length).toFixed(1)
      : 'N/A';
  };

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <div id="passwordUpdateForm" className="mb-5">
        <h3>Password Update</h3>
        <button
          className="btn btn-secondary mb-3"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? 'Cancel' : 'Update Password'}
        </button>
        {showPasswordForm && (
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label">Old Password</label>
              <input
                type="password"
                className={`form-control ${formErrors.oldPassword ? 'is-invalid' : ''}`}
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              {formErrors.oldPassword && <div className="invalid-feedback">{formErrors.oldPassword}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                className={`form-control ${formErrors.newPassword ? 'is-invalid' : ''}`}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {formErrors.newPassword && <div className="invalid-feedback">{formErrors.newPassword}</div>}
            </div>
            <button type="submit" className="btn btn-primary">Update Password</button>
          </form>
        )}
      </div>
      <h2>Store Owner Dashboard</h2>
      <h3>Create Store</h3>
      <form onSubmit={handleCreateStore}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="storeName" className="form-label">Store Name</label>
            <input
              type="text"
              className="form-control"
              id="storeName"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="storeAddress" className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              id="storeAddress"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Create Store</button>
      </form>
      <h3 className="mt-4">Your Stores</h3>
      {stores.length === 0 ? (
        <p>No stores created yet.</p>
      ) : (
        stores.map(store => (
          <div key={store.id} className="card mb-3">
            <div className="card-body">
              <h4>{store.name} - {store.address}</h4>
              <p>Average Rating: {getAverageRating(store.id)}</p>
              <h5>Ratings:</h5>
              {ratings.filter(r => r.storeId === store.id).length === 0 ? (
                <p>No ratings yet.</p>
              ) : (
                <>
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <strong
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSortField('userName');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Name {sortField === 'userName' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </strong>
                    </div>
                    <div className="col-md-4">
                      <strong
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSortField('userEmail');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Email {sortField === 'userEmail' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </strong>
                    </div>
                    <div className="col-md-4">
                      <strong
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSortField('rating');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Rating {sortField === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </strong>
                    </div>
                  </div>
                  {ratings.filter(r => r.storeId === store.id).map(rating => (
                    <div key={rating.id} className="row border-top py-2">
                      <div className="col-md-4">{rating.userName}</div>
                      <div className="col-md-4">{rating.userEmail}</div>
                      <div className="col-md-4">{rating.rating} - {rating.review}</div>
                    </div>
                  ))}
                </>
              )}
              <button
                className="btn btn-danger mt-2"
                onClick={() => handleDeleteStore(store.id)}
              >
                Delete Store
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerDashboard;