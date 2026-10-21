# Start-to-end launch

1. Install Node.js 20 and Git.
2. Copy `.env.example` to `.env` and keep `DEMO_MODE=true`.
3. Run `npm install`, `npm run ci`, and `npm start`.
4. Test Home, both logins, Inbox, Channels, Payments, Reports, Import/Export and Settings.
5. Create a private GitHub repository. Replace the CODEOWNERS username.
6. Push the repository. Enable Issues, Actions, Dependabot, CodeQL and branch protection.
7. Prepare SQL Server, create a least-privilege login, run `schema.sql`, then `monitoring.sql`.
8. Fill `.env.production` in the hosting provider. Never commit it.
9. Deploy to Vercel. If direct SQL connectivity from serverless hosting is unavailable for your network, deploy the Node server on a host with private SQL connectivity and keep Vercel for the frontend/domain.
10. Add the final HTTPS domain before production Meta webhooks.
11. Create the Meta app, add WhatsApp, obtain App ID, App Secret, WABA ID, phone-number ID and access token.
12. Configure callback `https://YOUR_DOMAIN/api/meta/webhook`, verify token, subscriptions and app-secret signature validation.
13. Test inbound WhatsApp, outbound WhatsApp, duplicate events, delivery status and agent locking.
14. Add Facebook Page Messenger, then Instagram Professional messaging.
15. Configure QR payment receipt workflow first. Add Stripe and PayPal webhooks. Activate subscriptions only after trusted webhook confirmation or authorized manual receipt approval.
16. Add `PRODUCTION_HEALTH_URL` to GitHub Actions secrets.
17. Test backups and restore into an isolated database.
18. Run the launch checklist before every release.
