import React from 'react';
import { Helmet } from 'react-helmet-async';

const DOMAIN = 'https://saynarelec.com';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/q6lr90ky/image/upload/v1787783960/byntvhslvv75kzdgjr7c.jpg';

export default function SEO({
  title = "Saynarelec — Électricien & Entreprise d'Électricité en Belgique",
  description = "Saynarelec est votre entreprise d'électricité générale et solaire en Belgique. Rénovation électrique, mise en conformité RGIE, dépannage et pose de panneaux solaires.",
  canonical = '/',
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  lang = 'fr',
  schema = null,
}) {
  const canonicalUrl = canonical.startsWith('http') ? canonical : `${DOMAIN}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${DOMAIN}${ogImage}`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content="Saynarelec" />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:locale" content={lang === 'nl' ? 'nl_BE' : lang === 'en' ? 'en_GB' : 'fr_BE'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
