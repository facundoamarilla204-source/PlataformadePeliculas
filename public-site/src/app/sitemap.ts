import { MetadataRoute } from 'next';
import { fetchCategories, fetchMoviesByCategory } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ];

  try {
    const categories = await fetchCategories();
    categories.forEach((cat: any) => {
      sitemapEntries.push({
        url: `${siteUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    const allMovies = await fetchMoviesByCategory();
    allMovies.forEach((movie: any) => {
      sitemapEntries.push({
        url: `${siteUrl}/movie/${movie.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return sitemapEntries;
}
