import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router لا يعيد التمرير لأعلى عند الانتقال بين الصفحات،
 * فكانت الصفحة الجديدة تُفتح من منتصفها أحياناً.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
