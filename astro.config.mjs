import { defineConfig } from 'astro/config';

export default defineConfig({
  // Базовый домен сайта.
  // Потом обязательно заменить на реальный домен, чтобы sitemap и robots работали корректно.
  site: 'https://kuhni-v-orenburge.ru',

  // Если позже понадобится, здесь можно подключить интеграции:
  // integrations: [],
});