# Flaming Word — Daily Devotional

A mobile-friendly devotional website and installable Progressive Web App starter for Pastor Emmanuel Adikwu.

## Included
- Public daily devotional page and searchable archive
- Full devotional reader: Body, Reflection, Takeaway and Prayer
- Share devotional and local bookmarks
- Admin login, create/edit/delete devotional content
- Draft, published and scheduled statuses
- PWA manifest, icon and service worker

## Important: connect the online database
The project is delivered as a starter. For public publishing across all readers and secure admin access, connect a Supabase project.

1. Create a free project at https://supabase.com/.
2. In the Supabase project, open **SQL Editor**, create a query, paste all contents of `supabase-schema.sql`, and run it.
3. Open **Project Settings → API**. Copy the Project URL and the `anon` / publishable key.
4. Open `app.js` and replace:
   - `YOUR_SUPABASE_PROJECT_URL`
   - `YOUR_SUPABASE_ANON_KEY`
5. In Supabase **Authentication → Providers**, ensure Email is enabled. Turn off public sign-ups.
6. In **Authentication → Users**, add the administrator email and set a strong password. Only trusted administrators should have accounts.
7. Host the folder on a static host such as Netlify or Vercel. Upload the project files and enable HTTPS.
8. Open the hosted HTTPS address on Android Chrome, use the browser menu and choose **Install app** or **Add to Home screen**.

## Scheduling
Create a devotional in the admin dashboard, choose a future date/time and select **Scheduled**. The public site will show it once the publication time has arrived. The browser uses the visitor's device time zone to display dates.

## Demo mode
Before Supabase is configured, the website displays a sample devotional so you can preview the design. Demo-mode changes are stored only in that browser and are not shared with readers. Do not use demo mode for real publishing.

## Security notes
- Never put a Supabase `service_role` key in browser code.
- The supplied SQL policies assume every authenticated account is a trusted administrator. Keep public sign-up disabled and create admin accounts manually.
- For multiple roles or a public contributor system, strengthen the database policies before launch.

## Next production improvements
Push notifications, email subscriptions, analytics, Bible translation licensing/selection, and administrator role management can be added in a later phase.
