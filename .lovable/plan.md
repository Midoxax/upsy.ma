

## Fix Missing Auth Translation Keys

### Bugs Found During Testing

1. **Apple Sign-In button** shows raw key `auth.continueWithApple` instead of "Continue with Apple" — the translation key is missing from all 3 locales.
2. **Sign-up toast description** shows raw key `auth.verifyEmailDesc` instead of the verification message — the translation key is missing from all 3 locales. (Note: `checkEmailDesc` exists but is for password reset, not signup verification.)

### Changes

**File: `src/lib/i18n/translations.ts`** — Add two missing keys to each locale's `auth` block:

| Key | EN | FR | AR |
|-----|----|----|-----|
| `continueWithApple` | Continue with Apple | Continuer avec Apple | المتابعة مع آبل |
| `verifyEmailDesc` | We sent a verification link to your email. Please confirm before signing in. | Nous avons envoyé un lien de vérification à votre e-mail. Veuillez confirmer avant de vous connecter. | لقد أرسلنا رابط تحقق إلى بريدك الإلكتروني. يرجى التأكيد قبل تسجيل الدخول. |

No other file changes needed — `Auth.tsx` already references these keys correctly with `||` fallbacks, but the fallbacks aren't working because `t()` returns the key string (which is truthy) rather than `undefined`.

### Technical Detail

The `t()` function in `LocaleContext.tsx` returns the key itself when a translation is not found (line 105: `return typeof value === 'string' ? value : key`). Since a string like `"auth.verifyEmailDesc"` is truthy, the `||` fallback in `Auth.tsx` never triggers. Adding the actual translation keys fixes both issues at the root.

