"use client";

import { useEffect, useState } from "react";

export default function IntroAnimation() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <video
      autoPlay
      muted
      playsInline
      className={`absolute w-[700px] md:w-[900px] opacity-90 pointer-events-none transition-opacity duration-1000 ${
        hide ? "opacity-0" : "opacity-100"
      }`}
    >
      <source src="/videos/intro.mp4" type="video/mp4" />
    </video>
  );
}