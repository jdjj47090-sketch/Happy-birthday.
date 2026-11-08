# ASOUGA — عالم اسوقة ♡

تجربة عيد ميلاد عربية RTL، مبنية بـ Next.js وTypeScript وCSS وCanvas. لا تستخدم صورًا؛ المشاهد والزخارف مرسومة في الواجهة. المحتوى الافتراضي موجود في `src/data/content.ts`.

## التشغيل

```sh
npm install
npm run dev
```

ثم افتحي http://localhost:3000. للإنتاج استخدمي `npm run typecheck` ثم `npm run build` ثم `npm start`.

## لوحة الإدارة

لتمكين لوحة الإدارة، أنشئي كلمة مرور قوية وولّدي hash وsalt من Node:

```sh
node -e "const c=require('node:crypto'); const s=c.randomBytes(24).toString('hex'); console.log('ADMIN_PASSWORD_SALT='+s); console.log('ADMIN_PASSWORD_HASH='+c.scryptSync('YOUR_PASSWORD',s,64).toString('hex'))"
```

ضعي `ADMIN_PASSWORD_HASH` و`ADMIN_PASSWORD_SALT` و`ADMIN_SESSION_SECRET` (سري عشوائي بطول 32 محرفًا على الأقل) في بيئة الخادم. لا تضعي كلمات المرور أو الأسرار في ملفات الواجهة أو Git. المثال موجود في `.env.example`؛ استبدلي القيم الوهمية قبل التشغيل.

من زر الإعدادات في الموقع سجلي الدخول لتحرير الاسم واللقب والرسالة والذكريات والأسئلة وردودها ورسائل النجوم والألوان والحركة وتفعيل المشاهد. يحفظ الخادم التعديلات في `data/asouga-content.json` بعد التحقق منها. هذا التخزين يحتاج نظام ملفات دائم؛ استخدمي قاعدة بيانات أو volume دائمًا في بيئات serverless أو المنصات ذات التخزين المؤقت.

## محتوى وخصوصية

- تقدم الألعاب محفوظ محليًا في `localStorage` على الجهاز الحالي.
- المحتوى الافتراضي لا يتضمن ذكريات شخصية مختلقة.
- واجهات الإدارة تتطلب جلسة خادم، وكلمة المرور لا تُخزن كنص صريح.
- `.env*` وملف المحتوى المحرر مستثنيان من Git.
- تدعم الواجهة RTL والهواتف و`prefers-reduced-motion`.
