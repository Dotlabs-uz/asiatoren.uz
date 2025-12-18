# asiatoren.uz

Монорепозиторий проекта asiatoren.uz, включающий frontend и admin panel.

## Структура проекта
```
asiatoren.uz/
├── frontend/          # Основной сайт (Next.js)
└── admin-panel/       # Панель администратора (Next.js)
```

## Быстрый старт

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Admin Panel
```bash
cd admin-panel
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере (или другой порт, если frontend уже запущен).

## Технологии

- **Framework:** [Next.js](https://nextjs.org)
- **Package Manager:** npm / yarn / pnpm / bun
- **Font Optimization:** [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) с [Geist](https://vercel.com/font)

## Разработка

После изменений в `app/page.tsx` страница автоматически обновится благодаря Hot Reload.

## Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

## Деплой

Рекомендуется использовать [Vercel Platform](https://vercel.com/new) для деплоя обоих приложений.

Подробнее: [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)