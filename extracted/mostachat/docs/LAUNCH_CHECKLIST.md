# Launch checklist

## Code and GitHub
- [ ] `npm run ci` passes
- [ ] No secrets in Git history
- [ ] Main branch protected
- [ ] CI and CodeQL required
- [ ] Issues and PR templates working
- [ ] Dependabot enabled

## SQL Server
- [ ] Database ONLINE
- [ ] Encrypted connection works
- [ ] Least-privilege application user
- [ ] Schema applied
- [ ] `/api/health` reports SQL up
- [ ] Backup completed and verified
- [ ] Restore test completed
- [ ] Agent jobs and Database Mail checked

## Meta and WhatsApp
- [ ] Business portfolio and app prepared
- [ ] App ID and secret stored only in secret manager
- [ ] WABA and phone-number IDs stored
- [ ] Production access token stored securely
- [ ] HTTPS webhook verifies
- [ ] Signature verification passes
- [ ] Inbound and outbound messages tested
- [ ] Duplicate webhook test passes
- [ ] Delivery/read/failure statuses tested
- [ ] Approved message templates tested

## Payments
- [ ] QR image belongs to the company
- [ ] Amount, plan and transaction reference required
- [ ] Receipt stored privately
- [ ] Authorized employee approves/rejects
- [ ] Approval creates audit log and confirmation email
- [ ] Stripe/PayPal webhooks verified server-side
- [ ] No payment-card data stored

## Product
- [ ] Customer and employee login
- [ ] Inbox claim and reply
- [ ] Channel ON/OFF, remove and delete
- [ ] Voice permission and recording
- [ ] Reports, export and import preview
- [ ] Profile picture and logout
- [ ] Footer and white-label rules
