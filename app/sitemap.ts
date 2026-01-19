import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://lezmarket.vercel.app';

    // Public pages
    const routes = [
        '',
        '/pricing',
        '/login',
        '/signup',
        '/about',
        '/blog',
        '/contact',
        '/docs',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
