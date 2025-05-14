import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (isRegistering) {
      if (name.length < 20 || name.length > 60) {
        errors.name = 'Name must be between 20 and 60 characters';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email format';
      }
      if (address.length > 400) {
        errors.address = 'Address must not exceed 400 characters';
      }
      if (password.length < 8 || password.length > 16) {
        errors.password = 'Password must be between 8 and 16 characters';
      } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
        errors.password = 'Password must contain at least one uppercase letter and one special character';
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email format';
      }
      if (!password) {
        errors.password = 'Password is required';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [name, email, address, password, isRegistering]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      console.log('Sending login request:', { email, password });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.user.role);
      if (response.data.user.role === 'USER') {
        window.location.href = '/stores';
      } else if (response.data.user.role === 'STORE_OWNER') {
        window.location.href = '/owner';
      } else if (response.data.user.role === 'ADMIN') {
        window.location.href = '/admin';
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      console.log('API URL:', process.env.REACT_APP_API_URL);
      console.log('Sending registration request:', { name, email, address, password, role: 'USER' });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        name,
        email,
        address,
        password,
        role: 'USER',
      });
      console.log('Registration response:', response.data);
      setIsRegistering(false);
      setError(''); // Clear error on success
      setName('');
      setAddress('');
      setEmail('');
      setPassword('');
      setFormErrors({});
      alert('Registration successful! Please log in.');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4 shadow-sm">
            <h2 className="card-title text-center">{isRegistering ? 'Register' : 'Login'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {isRegistering ? (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name (20-60 characters)</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address (max 400 characters)</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password (8-16 chars, 1 uppercase, 1 special)</label>
                  <input
                    type="password"
                    className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100">Register</button>
                <button
                  type="button"
                  className="btn btn-link w-100 mt-2"
                  onClick={() => {
                    setIsRegistering(false);
                    setError(''); // Clear error when switching to login
                  }}
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
                <button
                  type="button"
                  className="btn btn-link w-100 mt-2"
                  onClick={() => {
                    setIsRegistering(true);
                    setError(''); // Clear error when switching to register
                  }}
                >
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;