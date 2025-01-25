import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface VideoSEOProps {
  video: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string;
    contentUrl: string;
    embedUrl?: string;
    tags?: string[];
  };
  pageUrl: string;
}

export function VideoSEO({ video, pageUrl }: VideoSEOProps) {
  // Video Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    publisher: {
      '@type': 'Organization',
      name: 'KCT Menswear',
      logo: {
        '@type': 'ImageObject',
        url: `${config.baseUrl}/logo.png`
      }
    }
  };

  return (
    <Helmet>
      {/* Video Meta Tags */}
      <meta property="og:video" content={video.contentUrl} />
      <meta property="og:video:secure_url" content={video.contentUrl} />
      <meta property="og:video:type" content="application/x-mpegURL" />
      <meta property="og:video:width" content="1920" />
      <meta property="og:video:height" content="1080" />
      
      {/* Twitter Video Card */}
      <meta name="twitter:card" content="player" />
      <meta name="twitter:title" content={video.name} />
      <meta name="twitter:description" content={video.description} />
      <meta name="twitter:image" content={video.thumbnailUrl} />
      {video.embedUrl && (
        <>
          <meta name="twitter:player" content={video.embedUrl} />
          <meta name="twitter:player:width" content="1920" />
          <meta name="twitter:player:height" content="1080" />
        </>
      )}

      {/* Video Sitemap Tags */}
      <meta name="video:duration" content={video.duration} />
      <meta name="video:upload_date" content={video.uploadDate} />
      <meta name="video:thumbnail_loc" content={video.thumbnailUrl} />
      {video.tags?.map(tag => (
        <meta key={tag} name="video:tag" content={tag} />
      ))}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(videoSchema)}
      </script>
    </Helmet>
  );
}