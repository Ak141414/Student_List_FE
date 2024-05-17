import { useState, useEffect } from 'react';

const useIsSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 970);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 970);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isSmallScreen;
};

export default useIsSmallScreen;
