import React from 'react';
import Register from '../components/Register';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;