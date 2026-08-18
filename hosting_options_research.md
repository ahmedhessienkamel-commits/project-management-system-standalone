# Hosting research snapshot

Checked 2026-08-18.

| Provider | Official source | Key finding |
|---|---|---|
| Supabase | https://supabase.com/docs/guides/platform/billing-on-supabase | Free plan: two free projects; 500 MB database per project; 1 GB storage; 5 GB egress; 50,000 monthly active users; 2 million realtime messages. It is primarily the database/auth/storage backend, not the complete app host. |
| Render | https://render.com/docs/free | Free web services spin down after 15 minutes idle and take about one minute to wake. Free Postgres is 1 GB, expires after 30 days, and has no backups; unsuitable for production financial data without a paid upgrade or external backup. |
| Vercel | https://vercel.com/docs/plans/hobby | Hobby is free for personal/small-scale use but restricted to non-commercial personal use; team collaboration/RBAC is not available on Hobby. Not the preferred host for a commercial ERP. |

Recommendation for the ERP: build and test the MVP first; select a production host only after confirming persistent database storage, automated backups, multi-user access, and commercial-use terms. Free tiers are suitable for prototyping, not as an unqualified promise of permanent financial-data hosting.
