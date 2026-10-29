# Android APK releases

Every push to `main` runs `.github/workflows/android-apk.yml`. You can also
start it from Actions > Android APK > Run workflow. No extra branch is used.

The workflow installs the lockfile with Node 22, uses Java 21 and the Android
SDK, builds Vite in `android` mode, generates the native project from Capacitor,
syncs plugins and bundles assets, and builds a release APK with the generated
Gradle wrapper. The native project is intentionally not committed.

The publish job signs and verifies the APK, creates a versioned GitHub Release,
and marks it latest. The stable download address is:

https://github.com/artibala866-cmd/CsyPhone/releases/latest/download/CsyPhone.apk

This address follows the latest successful release while the repository and
asset name remain available. Failed builds leave the previous release intact.
The release includes a SHA-256 checksum. Unsigned intermediate artifacts expire
after seven days; Release assets do not use Actions artifact retention.

## Signing

Repository Actions Secret `ANDROID_SIGNING` contains JSON with `keystore`
(base64-encoded JKS) and `password`. The key alias is `csyphone`. The signing job
temporarily decodes it on the runner and removes the temporary files on exit.
Never commit the secret, keystore, password, or a local environment file.
Keep the same signing key for future builds so Android can install updates.
Do not delete the Secret without securely preserving the original key.

## Credentials and backend features

The APK does not embed `VITE_CSYOS_BACKEND_TOKEN` or API credentials. Storing a
token in Actions Secrets and passing it to a Vite build would still expose it
in the distributed JavaScript, so this workflow explicitly leaves it empty.
The public backend URL is taken from `.env.production.example`; backend
features that require authentication need a runtime token/configuration or a
separately implemented per-user authentication flow. The APK build does not
deploy Cloudflare Functions or change the backend.

The original website production build and its environment checks are retained.
The original `LICENSE` and Required Notice are included in the APK assets.
