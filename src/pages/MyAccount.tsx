import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyAccount() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the account profile tab by default
    navigate('/my-account/profile', { replace: true });
  }, [navigate]);

  return null; // This component will redirect immediately
}