# Firebase Configuration Diagnostic

## The Error Means One of These:
1. ❌ Phone Auth provider NOT enabled in Firebase Console
2. ❌ Test phone numbers NOT added to Firebase Console
3. ❌ .env.local credentials are WRONG or INCOMPLETE

## Quick Diagnostic: Check Your .env.local

Open `frontend/.env.local` and verify ALL these are filled (not blank, not "undefined"):

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCB-mviQWMBby4sWnWAgkJ-WLn6YeqYslY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=shrmsetu.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=shrmsetu
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=shrmsetu.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=409985766488
EXPO_PUBLIC_FIREBASE_APP_ID=1:409985766488:android:6835eb64565f49fecba62d
```

If ANY line is missing or blank → **That's the problem!**

Replace with actual values from Firebase.

---

## Fastest Solution: Use DEVELOPMENT MODE First

Since Firebase setup is tricky, let me suggest a better approach:

### Step 1: Revert to Development Mode (Temporarily)

This lets you test your app UI immediately without Firebase configuration:

Edit `frontend/services/otpService.js`:
```javascript
// Change this:
const USE_REAL_OTP = true;

// To this:
const USE_REAL_OTP = false;  // Back to development
```

### Step 2: Restart App

```bash
npm run android
# Or kill Expo and reopen
```

### Step 3: Test OTP Flow in App

1. Enter phone: `8810616993`
2. Click **Send OTP**
3. **Check console** for fake OTP (e.g., `842244`)
4. Enter that OTP in app
5. Click **Verify OTP**
6. Should show: **"Phone verified!"** ✅

**Now you know your app UI works!**

---

## Then Enable Real OTP (Step by Step)

Once UI is working, enable real OTP with proper Firebase setup:

### In Firebase Console - DO THIS EXACTLY:

1. **Go to:** https://console.firebase.google.com/ → select **shrmsetu**

2. **Enable Phone Auth:**
   - Click **Authentication** (left menu)
   - Tab: **Sign-in method**
   - Find **Phone** in the provider list
   - Click the toggle to turn it **ON** (blue)
   - Click **Save**

3. **Set SMS Region:**
   - Tab: **Settings** (same Authentication page)
   - Scroll to **"SMS region policy"**
   - Radio button: Select **"Allow"**
   - Dropdown: Select **"India"**
   - Click **Save**

4. **Add Test Phone:**
   - Tab: **Settings**
   - Scroll to **"Phone numbers for testing"**
   - Click **"Add phone number for testing"**
   - Phone: `+918810616993`
   - OTP: `123456`
   - Click **Add**

5. **Check Screenshot:**
   - You should see your number listed with a green checkmark

---

## Then in Your App - DO THIS:

1. Edit `frontend/services/otpService.js`:
   ```javascript
   const USE_REAL_OTP = true;  // Enable real Firebase OTP
   ```

2. Kill the app completely and reopen

3. Try sending OTP again

---

## If STILL Getting Error:

### Option A: Check Credentials
Compare your `.env.local` with Firebase Console:
- **Project Settings** (gear icon in Firebase)
- Copy each credential and verify it matches `.env.local`

### Option B: Clear Everything and Restart
```bash
# Kill Expo
# Clear cache
npx expo start --clear

# Or
npm run android
```

### Option C: Phone Auth Might Need reCAPTCHA
- Go to **Authentication** → **Settings**
- Find **reCAPTCHA** section
- Toggle it **ON**
- Click **Save**

---

## Minimal Test

Try this to verify Firebase works at all:

Edit `frontend/config/firebase.js`, add this after initialization:

```javascript
console.log('🔥 Firebase Config Check:');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('API Key starts with:', firebaseConfig.apiKey?.substring(0, 10) + '...');
console.log('Auth instance:', auth ? '✅ Ready' : '❌ Not initialized');
```

Restart app and watch console. You should see:
```
🔥 Firebase Config Check:
Project ID: shrmsetu
Auth Domain: shrmsetu.firebaseapp.com
API Key starts with: AIzaSyCB...
Auth instance: ✅ Ready
```

If any of these are wrong → That's your problem!

---

## My Recommendation

1. **For now:** Set `USE_REAL_OTP = false`
2. **Test UI:** Verify OTP flow works in development mode
3. **Then carefully:** Follow the Firebase setup steps above
4. **Finally:** Set `USE_REAL_OTP = true` and test real SMS

This way you isolate whether the problem is:
- App code (development mode will show it works)
- Firebase config (real OTP will show misconfiguration)

Want me to help you check `.env.local`? Share the content and I'll verify it has all correct credentials! 📱
