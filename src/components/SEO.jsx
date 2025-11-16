import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * Reusable SEO component.
 * Props:
 *  - title: Full page title.
 *  - description: Meta description (160 chars ideal).
 *  - canonical: Absolute canonical URL.
 *  - image: Social preview image URL.
 *  - type: og:type (default website).
 *  - isHome: If true, inject organization JSON-LD.
 */
export default function SEO({
  title = "Backslash Designs",
  description = "Backslash Designs delivers scalable, reliable, and secure IT, media, and support services.",
  canonical,
  image,
  type = "website",
  isHome = false,
  imageAlt = "Backslash Designs — Scalable, Reliable, Secure",
  imageWidth = 1200,
  imageHeight = 630,
}) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://backslash-designs.github.io";
  const resolvedImage = image || `${origin}/og-cover.png`;
  const jsonLd = isHome
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Backslash Designs",
        url: "https://backslash-designs.github.io/",
        description,
        logo: "https://backslash-designs.github.io/backslash-icon-square-trans-light.png",
        sameAs: [
          "https://www.linkedin.com/company/backslash-designs",
          "https://github.com/Backslash-Designs"
        ],
      }
    : null;

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {/* OG */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {resolvedImage && <meta property="og:image" content={resolvedImage} />} 
      {resolvedImage && <meta property="og:image:alt" content={imageAlt} />}
      {imageWidth && <meta property="og:image:width" content={String(imageWidth)} />}
      {imageHeight && <meta property="og:image:height" content={String(imageHeight)} />}
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {resolvedImage && <meta name="twitter:image" content={resolvedImage} />}
      {resolvedImage && <meta name="twitter:image:alt" content={imageAlt} />}
      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}