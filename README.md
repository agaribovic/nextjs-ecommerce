## Folder Structure

<!-- START_FOLDER_STRUCTURE -->
```bash
.
├── __tests__
│   ├── components
│   │   ├── Modal.test.tsx
│   │   └── Sort.test.tsx
│   ├── slices
│   │   ├── cakeDataSlice.test.ts
│   │   └── modalSlice.test.ts
│   ├── utils
│   │   ├── formatDateBS.test.ts
│   │   └── sortCakes.test.ts
│   └── mockCakes.ts
├── app
│   ├── about
│   │   └── page.tsx
│   ├── api
│   │   ├── admin
│   │   │   └── route.ts
│   │   ├── cakes
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   ├── utils
│   │   │   │   ├── cookies.ts
│   │   │   │   └── fileupload.ts
│   │   │   └── route.ts
│   │   └── mailer
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── Card
│   │   └── Card.tsx
│   ├── Footer
│   │   └── Footer.tsx
│   ├── Form
│   │   └── Form.tsx
│   ├── Header
│   │   └── Header.tsx
│   ├── Modal
│   │   └── Modal.tsx
│   ├── Overlay
│   │   └── Overlay.tsx
│   ├── Sort
│   │   └── Sort.tsx
│   └── Spinner
│       └── Spinner.tsx
├── prisma
│   ├── dev.db
│   ├── prisma.ts
│   └── schema.prisma
├── redux
│   ├── api
│   │   ├── adminApi.ts
│   │   ├── cakeApi.ts
│   │   └── mailerApi.ts
│   ├── slices
│   │   ├── authSlice.ts
│   │   ├── cakeDataSlice.ts
│   │   └── modalSlice.ts
│   ├── ReduxProvider.tsx
│   └── store.ts
├── styles
│   └── globals.css
├── utils
│   ├── formatDate.ts
│   ├── reviews.ts
│   ├── sortCakes.ts
│   └── useInfiniteScroll.ts
├── README.md
├── jest.config.ts
├── jest.setup.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── structure.txt
├── tailwind.config.ts
├── talwind.config.ts
└── tsconfig.json
```
<!-- END_FOLDER_STRUCTURE -->
