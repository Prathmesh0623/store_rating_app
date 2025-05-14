import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserStoreList = () => {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
        let fetchedStores = Array.isArray(storeResponse.data) ? storeResponse.data : [];

        const ratingResponse = await axios.get(`${process.env.REACT_APP_API_URL}/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userRatings = Array.isArray(ratingResponse.data) ? ratingResponse.data : [];
        setRatings(userRatings);

        fetchedStores = fetchedStores.map(store => {
          const storeRatings = userRatings.filter(r => r.storeId === store.id);
          const overallRating = storeRatings.length
            ? (storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length).toFixed(1)
            : 'N/A';
          return { ...store, overallRating };
        });

        if (searchName) {
          fetchedStores = fetchedStores.filter(store =>
            store.name.toLowerCase().includes(searchName.toLowerCase())
          );
        }
        if (searchAddress) {
          fetchedStores = fetchedStores.filter(store =>
            store.address.toLowerCase().includes(searchAddress.toLowerCase())
          );
        }

        fetchedStores.sort((a, b) => {
          const fieldA = a[sortField]?.toString().toLowerCase() || '';
          const fieldB = b[sortField]?.toString().toLowerCase() || '';
          if (sortOrder === 'asc') {
            return fieldA > fieldB ? 1 : -1;
          }
          return fieldA < fieldB ? 1 : -1;
        });

        setStores(fetchedStores);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          setError('Authentication failed. Please log in again.');
          localStorage.removeItem('token');
        } else if (status === 404) {
          setError('Stores endpoint not found. Please check the server configuration.');
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.response?.data?.message || 'Failed to load stores');
        }
      }
    };
    fetchData();
  }, [searchName, searchAddress, sortField, sortOrder]);

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

  const handleRateStore = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }
      const method = ratings.some(r => r.storeId === selectedStoreId) ? 'put' : 'post';
      const url = method === 'put'
        ? `${process.env.REACT_APP_API_URL}/ratings/${ratings.find(r => r.storeId === selectedStoreId).id}`
        : `${process.env.REACT_APP_API_URL}/ratings`;

      await axios({
        method,
        url,
        data: { storeId: selectedStoreId, rating: Number(rating), review },
        headers: { Authorization: `Bearer ${token}` },
      });

      const ratingResponse = await axios.get(`${process.env.REACT_APP_API_URL}/ratings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings(Array.isArray(ratingResponse.data) ? ratingResponse.data : []);

      setRating(0);
      setReview('');
      setSelectedStoreId(null);
      alert(method === 'put' ? 'Rating updated!' : 'Rating submitted!');
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('token');
      } else {
        setError(err.response?.data?.message || 'Failed to submit rating');
      }
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
      <h2>Stores</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by Address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select mb-2"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="address">Sort by Address</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select mb-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      {stores.length === 0 && !error ? (
        <p>No stores available to rate.</p>
      ) : (
        <div className="row">
          {stores.map((store) => {
            const userRating = ratings.find(r => r.storeId === store.id);
            return (
              <div key={store.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{store.name}</h5>
                    <p className="card-text">Address: {store.address}</p>
                    <p className="card-text">Overall Rating: {store.overallRating}</p>
                    {userRating ? (
                      <>
                        <p className="card-text">
                          Your Rating: {userRating.rating} - {userRating.review}
                        </p>
                        <button
                          className="btn btn-primary btn-sm mt-2"
                          onClick={() => {
                            setSelectedStoreId(store.id);
                            setRating(userRating.rating);
                            setReview(userRating.review);
                          }}
                        >
                          Update Rating
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="card-text">You haven't rated this store yet.</p>
                        <button
                          className="btn btn-primary btn-sm mt-2"
                          onClick={() => setSelectedStoreId(store.id)}
                        >
                          Rate
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedStoreId && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rate Store</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedStoreId(null)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleRateStore}>
                  <div className="mb-3">
                    <label className="form-label">Rating (1-5 stars)</label>
                    <div>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          style={{ cursor: 'pointer', fontSize: '24px', color: star <= rating ? 'gold' : 'gray' }}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="review" className="form-label">Review</label>
                    <textarea
                      className="form-control"
                      id="review"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Rating</button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setSelectedStoreId(null)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStoreList;