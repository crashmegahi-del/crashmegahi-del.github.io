import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // Полный запрет индексации сайта всеми поисковыми роботами.
  const body = `User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
