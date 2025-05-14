import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
  const [newStore, setNewStore] = useState({ name: '', address: '', ownerId: '' });
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in again.');
          return;
        }

        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let fetchedUsers = Array.isArray(userResponse.data) ? userResponse.data : [];

        const storeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/stores`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let fetchedStores = Array.isArray(storeResponse.data) ? storeResponse.data : [];

        const ratingResponse = await axios.get(`${process.env.REACT_APP_API_URL}/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedRatings = Array.isArray(ratingResponse.data) ? ratingResponse.data : [];
        setRatings(fetchedRatings);

        fetchedStores = fetchedStores.map(store => {
          const storeRatings = fetchedRatings.filter(r => r.storeId === store.id);
          const overallRating = storeRatings.length
            ? (storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length).toFixed(1)
            : 'N/A';
          return { ...store, overallRating };
        });

        if (filterName) {
          fetchedUsers = fetchedUsers.filter(user =>
            user.name.toLowerCase().includes(filterName.toLowerCase())
          );
        }
        if (filterEmail) {
          fetchedUsers = fetchedUsers.filter(user =>
            user.email.toLowerCase().includes(filterEmail.toLowerCase())
          );
        }
        if (filterAddress) {
          fetchedUsers = fetchedUsers.filter(user =>
            user.address.toLowerCase().includes(filterAddress.toLowerCase())
          );
        }
        if (filterRole) {
          fetchedUsers = fetchedUsers.filter(user => user.role === filterRole);
        }

        fetchedUsers.sort((a, b) => {
          const fieldA = a[sortField]?.toString().toLowerCase() || '';
          const fieldB = b[sortField]?.toString().toLowerCase() || '';
          if (sortOrder === 'asc') {
            return fieldA > fieldB ? 1 : -1;
          }
          return fieldA < fieldB ? 1 : -1;
        });

        setUsers(fetchedUsers);
        setStores(fetchedStores);
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
  }, [filterName, filterEmail, filterAddress, filterRole, sortField, sortOrder]);

  const validateUserForm = () => {
    const errors = {};
    if (newUser.name.length < 20 || newUser.name.length > 60) {
      errors.name = 'Name must be between 20 and 60 characters';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = 'Invalid email format';
    }
    if (newUser.address.length > 400) {
      errors.address = 'Address must not exceed 400 characters';
    }
    if (newUser.password.length < 8 || newUser.password.length > 16) {
      errors.password = 'Password must be between 8 and 16 characters';
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newUser.password)) {
      errors.password = 'Password must contain at least one uppercase letter and one special character';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validateUserForm();
  }, [newUser]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(userResponse.data) ? userResponse.data : []);
      setNewUser({ name: '', email: '', address: '', password: '', role: 'USER' });
      setFormErrors({});
      alert('User created!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

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
      setNewStore({ name: '', address: '', ownerId: '' });
      alert('Store created!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== id));
      setSelectedUser(null);
      alert('User deleted!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
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
      setSelectedStore(null);
      alert('Store deleted!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete store');
    }
  };

  const getAverageRatingForOwner = (ownerId) => {
    const ownerStores = stores.filter(s => s.ownerId === ownerId);
    const ownerRatings = ratings.filter(r => ownerStores.some(s => s.id === r.storeId));
    return ownerRatings.length
      ? (ownerRatings.reduce((sum, r) => sum + r.rating, 0) / ownerRatings.length).toFixed(1)
      : 'N/A';
  };

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Admin Dashboard</h2>
      <h3>Statistics</h3>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Total Users</h5>
              <p>{users.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Total Stores</h5>
              <p>{stores.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Total Ratings</h5>
              <p>{ratings.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div id="createUserForm" className="mb-5">
        <h3>Create User</h3>
        <form onSubmit={handleCreateUser}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="userName" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                id="userName"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
              {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="userEmail" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                id="userEmail"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="userAddress" className="form-label">Address</label>
              <input
                type="text"
                className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                id="userAddress"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                required
              />
              {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="userPassword" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                id="userPassword"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
              {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="userRole" className="form-label">Role</label>
              <select
                className="form-select"
                id="userRole"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Create User</button>
        </form>
      </div>
      <div id="createStoreForm" className="mb-5">
        <h3>Create Store</h3>
        <form onSubmit={handleCreateStore}>
          <div className="row">
            <div className="col-md-4 mb-3">
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
            <div className="col-md-4 mb-3">
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
            <div className="col-md-4 mb-3">
              <label htmlFor="ownerId" className="form-label">Owner ID (Store Owner)</label>
              <input
                type="number"
                className="form-control"
                id="ownerId"
                value={newStore.ownerId}
                onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Create Store</button>
        </form>
      </div>
      <div id="usersSection" className="mb-5">
        <h3>Users</h3>
        <div className="row mb-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by Email"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by Address"
              value={filterAddress}
              onChange={(e) => setFilterAddress(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Filter by Role</option>
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-3">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortField('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </strong>
          </div>
          <div className="col-md-3">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortField('email');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
            </strong>
          </div>
          <div className="col-md-3">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortField('address');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Address {sortField === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}
            </strong>
          </div>
          <div className="col-md-3">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortField('role');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Role {sortField === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
            </strong>
          </div>
        </div>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="row border-top py-2">
              <div className="col-md-3">{user.name}</div>
              <div className="col-md-3">{user.email}</div>
              <div className="col-md-3">{user.address}</div>
              <div className="col-md-3">
                {user.role}
                <button
                  className="btn btn-info btn-sm ms-2"
                  onClick={() => setSelectedUser(user)}
                >
                  Details
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div id="storesSection">
        <h3>Stores</h3>
        <div className="row mb-2">
          <div className="col-md-3">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortField('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </strong>
          </div>
          <div className="col-md-3">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortField('email');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Owner Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
            </strong>
          </div>
          <div className="col-md-3">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortField('address');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Address {sortField === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}
            </strong>
          </div>
          <div className="col-md-3">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSortField('overallRating');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Rating {sortField === 'overallRating' && (sortOrder === 'asc' ? '↑' : '↓')}
            </strong>
          </div>
        </div>
        {stores.length === 0 ? (
          <p>No stores found.</p>
        ) : (
          stores.map(store => (
            <div key={store.id} className="row border-top py-2">
              <div className="col-md-3">{store.name}</div>
              <div className="col-md-3">{users.find(u => u.id === store.ownerId)?.email || 'N/A'}</div>
              <div className="col-md-3">{store.address}</div>
              <div className="col-md-3">
                {store.overallRating}
                <button
                  className="btn btn-info btn-sm ms-2"
                  onClick={() => setSelectedStore(store)}
                >
                  Details
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteStore(store.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Address:</strong> {selectedUser.address}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                {selectedUser.role === 'STORE_OWNER' && (
                  <p><strong>Average Rating:</strong> {getAverageRatingForOwner(selectedUser.id)}</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Store Details Modal */}
      {selectedStore && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Store Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedStore(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {selectedStore.name}</p>
                <p><strong>Owner Email:</strong> {users.find(u => u.id === selectedStore.ownerId)?.email || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedStore.address}</p>
                <p><strong>Overall Rating:</strong> {selectedStore.overallRating}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedStore(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;