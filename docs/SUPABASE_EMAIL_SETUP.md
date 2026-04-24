# Supabase email template setup

The designed FindMeRx signup email is saved here:

```text
supabase/email-templates/confirm-signup.html
```

Supabase does not automatically read this file from a deployed Next.js app. Paste this HTML into Supabase Dashboard → Authentication → Email Templates → Confirm Signup.

Subject:

```text
Confirm your FindMeRx account
```

The template uses Supabase's required confirmation variable:

```html
{{ .ConfirmationURL }}
```

The signup API now redirects confirmed users to `/auth/confirmed`.

Add these in Supabase URL Configuration:

```text
Site URL: http://localhost:3000
Redirect URLs: http://localhost:3000/auth/confirmed
Redirect URLs: https://your-production-domain.com/auth/confirmed
```

For a free setup, leave custom SMTP empty and let Supabase send the auth emails.

## Verification page after signup

The signup API now always sends new users to `/check-email` after account creation. This prevents users from going straight to the dashboard before they understand that the account needs email verification.

Important Supabase setting:

1. Go to Supabase → Authentication → Providers → Email.
2. Turn on **Confirm email** if you want users to truly verify before signing in.
3. Go to Authentication → URL Configuration.
4. Add your app URL to Site URL / Redirect URLs, for example:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/confirmed`
   - your production domain later.

After clicking the email confirmation link, users land on `/auth/confirmed`, then they can sign in.
