import { siteConfig } from "../../config/siteConfig";
import { Helmet } from "react-helmet-async";

const SEO = ({ title = "", description = "", keywords = "", image = "", url = "" }) => {
  const siteTitle = siteConfig.name;
  const safeTitle = title || "";
  const fullTitle = safeTitle.includes(siteTitle) ? safeTitle : (safeTitle ? `${safeTitle} | ${siteTitle}` : siteTitle);

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Favicon */}
      {siteConfig.favicon && (
        <link 
          rel="icon" 
          type={siteConfig.favicon.endsWith('.png') ? "image/png" : "image/jpeg"} 
          href={siteConfig.favicon} 
        />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
