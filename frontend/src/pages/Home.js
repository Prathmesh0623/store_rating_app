import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div className="text-center mt-5">
      <h1>Welcome to Store Rating</h1>
      <p>Rate and review your favorite stores!</p>
      <div className="mt-4">
        <Link to="/login" className="btn btn-primary me-2">Login</Link>
        <Link to="/register" className="btn btn-secondary">Register</Link>
      </div>
    </div>
  );
};

export default Home;