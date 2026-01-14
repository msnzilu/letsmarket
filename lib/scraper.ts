// lib/scraper.ts

import axios from 'axios';

export async function scrapeWebsite(url: string): Promise<string> {
    try {
        // Using Jina AI Reader API - free and simple
        const jinaUrl = `https://r.jina.ai/${url}`;

        const response = await axios.get(jinaUrl, {
            headers: {
                'Accept': 'text/plain'
            },
            timeout: 30000 // 30 second timeout
        });

        return response.data;
    } catch (error) {
        console.error('Scraping error:', error);
        throw new Error('Failed to scrape website. Please check the URL and try again.');
    }
}

export function validateUrl(url: string): boolean {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

export function normalizeUrl(url: string): string {
    // Add https:// if no protocol specified
    if (!url.match(/^https?:\/\//)) {
        url = 'https://' + url;
    }

    // Remove trailing slash
    return url.replace(/\/$/, '');
}