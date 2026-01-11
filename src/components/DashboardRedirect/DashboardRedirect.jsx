import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import OverviewPage from '../../Pages/Dashboard/User/OverviewPage';

const DashboardRedirect = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && user.role) {
      if (user.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (user.role === 'staff') {
        navigate('/dashboard/staff', { replace: true });
      }
      // Regular users stay here and see OverviewPage
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-green-600"></div>
      </div>
    );
  }

  // For regular users, show the OverviewPage
  if (user && (user.role === 'user' || !user.role || user.role === 'citizen')) {
    return <OverviewPage />;
  }

  return null;
};

export default DashboardRedirect;