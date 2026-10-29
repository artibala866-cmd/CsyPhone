import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';

// Applied only to the generated CI Android project. Never writes signing secrets.
const gradlePath = 'android/app/build.gradle';
let gradle = readFileSync(gradlePath, 'utf8');
const runNumber = Number(process.env.GITHUB_RUN_NUMBER || 1);
const versionCode = 100000 + runNumber;
if (!Number.isSafeInteger(versionCode) || versionCode > 2100000000) {
  throw new Error('Invalid Android version code');
}
gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`)
  .replace(/versionName\s+"[^"]+"/, `versionName "1.0.${runNumber}"`);
writeFileSync(gradlePath, gradle, 'utf8');
// Retain upstream licensing and Required Notice in the distributed application.
mkdirSync('android/app/src/main/assets', { recursive: true });
copyFileSync('LICENSE', 'android/app/src/main/assets/LICENSE');
