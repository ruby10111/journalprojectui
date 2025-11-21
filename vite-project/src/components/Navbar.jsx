import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRoles');
    navigate('/login');
  };

  return (
    <nav>
      {roles.includes('ADMIN') && <Link to="/admin">Admin</Link>}


    </nav>
  );
};

export default Navbar;