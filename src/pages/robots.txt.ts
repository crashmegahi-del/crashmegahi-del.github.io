import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() ?? 'https://kuhni-v-orenburge.ru';
  const sitemapUrl = `${baseUrl.replace(/\/$/, '')}/sitemap.xml`;

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
