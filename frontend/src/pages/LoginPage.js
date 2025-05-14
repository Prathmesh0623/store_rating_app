import React from 'react';
import Login from '../components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;