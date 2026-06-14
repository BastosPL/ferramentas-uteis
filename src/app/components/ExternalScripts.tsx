"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ExternalScripts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XQ780P1HLG"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XQ780P1HLG');`}
      </Script>
    </>
  );
}
