import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/analyze/',
                '/connections/',
                '/posts/',
                '/campaigns/',
                '/profile/',
                '/api/',
            ],
        },
        sitemap: 'https://lezmarket.io/sitemap.xml',
    };
}
