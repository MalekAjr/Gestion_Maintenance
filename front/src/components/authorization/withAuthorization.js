import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuthorization = (allowedRoles) => (WrappedComponent) => {
  const WithAuthorizationWrapper = (props) => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
      if (!allowedRoles.includes(role)) {
        // Redirect to a different page if not authorized
        navigate('/admin/unauthorized');
      }
    }, [role, navigate, allowedRoles]);

    return <WrappedComponent {...props} />;
  };

  return WithAuthorizationWrapper;
};

export default withAuthorization;
