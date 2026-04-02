# Firebase Phone OTP Troubleshooting

## Error: `auth/argument-error`

### What It Means:
Firebase rejected the phone authentication request due to misconfiguration or invalid setup.

### Root Causes & Solutions:

#### ❌ Problem 1: Firebase Phone Authentication Not Enabled

**Check:**
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select **shrmsetu** project
3. Go to **Authentication** → **Sign-in method**
4. Look for **Phone** - is it **Enabled**?

**Fix:**
- If **Disabled**: Click on **Phone** and toggle **Enable**
- Click **Save**

#### ❌ Problem 2: reCAPTCHA Not Configured

Firebase Phone Auth requires reCAPTCHA for security.

**Check:**
1. In Firebase Console → Authentication → Settings → Authorized domains
2. Make sure your Expo app domain is listed

**Fix:**
- In Firebase Console → Sign-in method → Phone
- Scroll down to **reCAPTCHA**
- For Expo (React Native): You don't always need config, but ensure:
  - Phone Auth is enabled
  - You've tested with a phone number in "Phone numbers for testing"

#### ❌ Problem 3: Phone Number Format Wrong

**Invalid Formats:**
- `8810616993` ❌ (missing country code)
- `+91-8810616993` ❌ (dashes/spaces)
- `+91 8810616993` ❌ (spaces)

**Valid Format:**
- `+918810616993` ✅ (country code + number, no spaces/dashes)

**Fix in Code:**
Ensure phone input adds country code:
```javascript
const phoneNumber = '+91' + userInput; // +918810616993
```

#### ❌ Problem 4: Firebase Credentials Wrong

**Check:**
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Go to **Project Settings** (gear icon)
3. Copy **API Key**
4. Compare with your `.env.local`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=...
   ```

**Fix:**
- Update `.env.local` with correct credentials
- Clear app cache: `npm run android` (reinstall app)
- Restart Expo

#### ❌ Problem 5: Auth Instance Not Ready

When using `USE_REAL_OTP = true`, Firebase might not be initialized yet.

**Check Console Logs:**
```
✅ Firebase Auth initialized with ...
```

**Fix:**
- Wait for initialization before calling sendOTP
- Current code has retry logic, but if still failing:
  - Try on a real device instead of emulator
  - Emulators sometimes have Firebase issues

### ✅ Solution: Step-by-Step

#### 1. **In Firebase Console:**

```
1. Authentication → Sign-in method → Phone → Enable
2. Authentication → Phone numbers for testing
3. Add phone: +918810616993
4. Add test OTP: 123456
5. Click Add
```

#### 2. **In Your App (.env.local):**

Verify all fields filled:
```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=shrmsetu.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=shrmsetu
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=shrmsetu.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=409985766488
EXPO_PUBLIC_FIREBASE_APP_ID=1:409985766488:android:6835eb64565f49fecba62d
```

#### 3. **Phone Number Format:**

When entering phone in app:
- Enter: `8810616993` (just the number)
- App converts to: `+918810616993` ✅
- Firebase receives: `+918810616993` ✅

#### 4. **Still Not Working?**

- **Option A:** Stay in **DEVELOPMENT MODE** (`USE_REAL_OTP = false`)
  - Check console for fake OTP
  - Test UI without real Firebase
  
- **Option B:** Test on Real Device
  - Emulators have Firebase issues sometimes
  - Real Android/iOS phone works better
  
- **Option C:** Use Expo Go (not prebuild)
  - Simpler, fewer issues
  - Firebase works better in Expo Go

### 🔍 Debug Checklist

- [ ] Phone Auth is **Enabled** in Firebase Console
- [ ] Test phone number is added to Firebase Console
- [ ] `.env.local` has correct Firebase credentials
- [ ] Phone number has country code: `+918810616993`
- [ ] No spaces/dashes in phone number
- [ ] Using real device (not emulator)
- [ ] Waited for "Firebase Auth initialized" log
- [ ] `USE_REAL_OTP = true` set in otpService.js

### 📝 Recommendation

**For now:** Keep `USE_REAL_OTP = false` for testing UI
**Later:** Enable real OTP after verified Firebase setup in console

When ready to enable:
1. Complete all Firebase Console steps
2. Set `USE_REAL_OTP = true`
3. Test with your phone number
4. You should receive SMS
