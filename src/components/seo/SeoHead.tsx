import React, { useEffect } from 'react';

export interface SeoHeadProps {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  robots?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonical,
  keywords,
  robots = 'index, follow',
  ogType = 'website',
  ogImage = 'https://crystallography.netlify.app/icon-512.png',
  jsonLd
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setMetaTag('name', 'robots', robots);

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'CrystalloGraphy');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:url', canonical);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data Schema
    let scriptTag = document.getElementById('seo-route-schema') as HTMLScriptElement;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'seo-route-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    // Window scroll to top on route navigation for clean UX
    window.scrollTo(0, 0);

  }, [title, description, canonical, keywords, robots, ogType, ogImage, jsonLd]);

  return null;
};
