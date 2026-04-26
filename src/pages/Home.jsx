import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import News from '../components/News/News';
import MenuGrid from '../components/MenuGrid/MenuGrid';
import Quality from '../components/Quality/Quality';
import AppPromo from '../components/AppPromo/AppPromo';

const Home = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <News />
      <MenuGrid />
      <Quality />
      <AppPromo />
    </>
  );
};

export default Home;
