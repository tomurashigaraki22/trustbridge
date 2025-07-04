"use client"

import { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    const Tawk_API = (window as any).Tawk_API || {};
    const Tawk_LoadStart = new Date();

    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6867cc85df81b119146519b4/1ivandqq3';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    const s0 = document.getElementsByTagName('script')[0];
    if (s0?.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
  }, []);

  return null;
};

export default TawkToWidget;
