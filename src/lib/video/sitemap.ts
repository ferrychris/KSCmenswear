import { config } from '@/config';

interface VideoSitemapEntry {
  loc: string;
  title: string;
  description: string;
  thumbnailLoc: string;
  contentLoc: string;
  playerLoc?: string;
  duration?: string;
  uploadDate: string;
  tags?: string[];
}

export class VideoSitemapGenerator {
  private static instance: VideoSitemapGenerator;
  private entries: VideoSitemapEntry[] = [];

  private constructor() {}

  static getInstance(): VideoSitemapGenerator {
    if (!VideoSitemapGenerator.instance) {
      VideoSitemapGenerator.instance = new VideoSitemapGenerator();
    }
    return VideoSitemapGenerator.instance;
  }

  addEntry(entry: VideoSitemapEntry): void {
    this.entries.push({
      ...entry,
      loc: `${config.baseUrl}${entry.loc}`,
    });
  }

  generateSitemap(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${this.entries.map(entry => `
  <url>
    <loc>${entry.loc}</loc>
    <video:video>
      <video:thumbnail_loc>${entry.thumbnailLoc}</video:thumbnail_loc>
      <video:title>${this.escapeXml(entry.title)}</video:title>
      <video:description>${this.escapeXml(entry.description)}</video:description>
      <video:content_loc>${entry.contentLoc}</video:content_loc>
      ${entry.playerLoc ? `<video:player_loc>${entry.playerLoc}</video:player_loc>` : ''}
      ${entry.duration ? `<video:duration>${entry.duration}</video:duration>` : ''}
      <video:publication_date>${entry.uploadDate}</video:publication_date>
      ${entry.tags?.map(tag => `<video:tag>${this.escapeXml(tag)}</video:tag>`).join('\n      ')}
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
  </url>
  `).join('')}
</urlset>`;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export const videoSitemapGenerator = VideoSitemapGenerator.getInstance();

// Add core videos
videoSitemapGenerator.addEntry({
  loc: '/wedding',
  title: 'Wedding Collection 2025 Preview',
  description: 'Explore our exclusive wedding collection for 2025. Premium suits and tuxedos for your special day.',
  thumbnailLoc: 'https://example.com/thumbnails/wedding-preview.jpg',
  contentLoc: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/b8b22c5f800cce8f5969ebe4f1eec173/manifest/video.m3u8',
  duration: '180',
  uploadDate: '2024-03-01',
  tags: ['wedding', 'suits', 'tuxedos', '2025 collection']
});

videoSitemapGenerator.addEntry({
  loc: '/prom',
  title: 'Prom 2025 Style Guide',
  description: 'Get inspired with our prom style guide for 2025. Featuring sparkle blazers, modern tuxedos, and unique accessories.',
  thumbnailLoc: 'https://example.com/thumbnails/prom-guide.jpg',
  contentLoc: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/6003e03beafc379e3f4fb5b81b703b84/manifest/video.m3u8',
  duration: '240',
  uploadDate: '2024-03-01',
  tags: ['prom', 'sparkle blazers', 'tuxedos', '2025 collection']
});