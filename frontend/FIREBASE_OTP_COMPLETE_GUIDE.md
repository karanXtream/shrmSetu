# Complete Firebase Phone OTP Setup for Expo + React Native

## Problem Summary

- ❌ `auth/argument-error` when attempting to send OTP
- ❌ "Firebase Phone Auth is not properly configured" message
- ❌ OTP flow fails with TanStack Query mutation
- ❌ Unclear reCAPTCHA requirements for Expo

---

## Root Causes

This error occurs when **one or more** of these are missing:

1. **Firebase Phone Auth provider NOT enabled** in Firebase Console
2. **SMS region policy set to "Deny"** (blocks SMS to your country)
3. **Phone numbers for testing NOT configured** in Firebase
4. **Firebase credentials in .env.local are incorrect or incomplete**
5. **reCAPTCHA not enabled** (required for phone auth)
6. **App not restarted** after Firebase configuration changes

---

## Complete Setup Guide (Step-by-Step)

### PART 1: Firebase Console Configuration (10 minutes)

#### Step 1.1: Enable Phone Authentication Provider

```
1. Open: https://console.firebase.google.com/
2. Select: "shrmsetu" project
3. Click: "Authentication" (left sidebar)
4. Tab: "Sign-in method" (at the top)
5. Find: "Phone" in the provider list
6. Click: "Phone" to open settings
7. Toggle: Click the switch to turn it ON (blue)
8. Click: "Save" button
```

**Result:** Phone Auth provider is now ENABLED ✅

---

#### Step 1.2: Configure SMS Region Policy

```
1. Still in: Authentication → Settings tab
2. Scroll down to: "SMS region policy" section
3. Radio button: Select "Allow" (not "Deny")
4. Dropdown: "List of regions"
5. Click: "Select regions"
6. Search/Select: "India" (or your country)
7. Click: "Save"
```

**Why:** Blocks SMS delivery if set to "Deny" for your region.

**Result:** SMS can be sent to India ✅

---

#### Step 1.3: Enable reCAPTCHA

```
1. Still in: Authentication → Settings
2. Scroll to: "Fraud prevention" section
3. Click: "reCAPTCHA"
4. Toggle: Turn ON (blue)
5. Click: "Save"
```

**Why:** Firebase requires reCAPTCHA for phone authentication security.

**Result:** reCAPTCHA is enabled ✅

---

#### Step 1.4: Add Test Phone Numbers

```
1. Still in: Authentication → Settings
2. Scroll to: "Phone numbers for testing" section
3. Click: "Add phone number for testing" button
4. Enter:
   - Phone number: +918810616993 (replace with yours)
   - Test OTP: 123456 (any 6-digit code)
5. Click: "Add"
6. Verify: You should see the number listed with a green checkmark
```

**Why:** Firebase whitelists test numbers and auto-verifies with test OTP during development.

**Result:** Your phone is registered for testing ✅

---

### PART 2: App Configuration

#### Step 2.1: Verify .env.local

Create or open `frontend/.env.local` with ALL these fields:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:5000

# Firebase Configuration (EXACT values from Firebase Console)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCB-mviQWMBby4sWnWAgkJ-WLn6YeqYslY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=shrmsetu.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=shrmsetu
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=shrmsetu.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=409985766488
EXPO_PUBLIC_FIREBASE_APP_ID=1:409985766488:android:6835eb64565f49fecba62d

# Environment
EXPO_PUBLIC_ENV=development
```

**Critical:** Every field must have a real value (not blank, not "undefined")

**Get credentials from:** Firebase Console → Project Settings (gear icon) → General tab

---

#### Step 2.2: Verify Firebase Configuration Code

File: `frontend/config/firebase.js`

```javascript
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate config
const validateFirebaseConfig = () => {
  const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missing = required.filter(field => !firebaseConfig[field]);
  
  if (missing.length > 0) {
    console.warn('❌ Missing Firebase config:', missing);
    return false;
  }
  console.log('✅ Firebase config validated');
  return true;
};

validateFirebaseConfig();

// Initialize app
const app = initializeApp(firebaseConfig);

// Initialize auth with persistence
let auth;

try {
  const isReactNative = Platform.OS !== 'web' && Platform.OS !== undefined;
  
  if (isReactNative) {
    try {
      auth = getAuth(app);
      console.log('✅ Firebase Auth initialized (React Native)');
    } catch {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
      console.log('✅ Firebase Auth initialized with AsyncStorage');
    }
  } else {
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn('⚠️ Persistence setup:', err.message);
    });
    console.log('✅ Firebase Auth initialized (Web)');
  }
} catch (error) {
  console.error('❌ Firebase Auth error:', error.message);
  auth = getAuth(app);
}

export const onAuthStateChange = (callback) => {
  return auth.onAuthStateChanged(user => {
    if (user) {
      console.log('✅ User logged in:', user.phoneNumber);
      callback({
        isSignedIn: true,
        user: {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
        },
      });
    } else {
      callback({ isSignedIn: false, user: null });
    }
  });
};

export { app, auth, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, signOut };
export default app;
```

---

#### Step 2.3: Verify OTP Service

File: `frontend/services/otpService.js`

Key configuration at the top:

```javascript
// Set to false for development (fake OTP in console)
// Set to true for production (real Firebase SMS)
const USE_REAL_OTP = true;
```

**For testing:** `USE_REAL_OTP = true` will use real Firebase Phone Auth.

---

### PART 3: Testing the OTP Flow

#### Test Scenario: Real OTP via SMS

**Prerequisites:**
- ✅ All Firebase Console steps completed
- ✅ Phone Auth provider ENABLED
- ✅ SMS region policy set to ALLOW for your country
- ✅ Your phone number added to test numbers
- ✅ .env.local has all credentials
- ✅ `USE_REAL_OTP = true` in otpService.js

**Test Steps:**

1. **Kill and restart the app:**
   ```bash
   # Close Expo completely
   # Then reopen or run:
   npm run android
   ```

2. **Create Profile → Step 2: Phone + OTP**

3. **Enter phone number:**
   - Field: `8810616993` (app adds country code)
   - Or: `+918810616993` (manual entry)

4. **Click "Send OTP"**
   - Watch console: Should see `✅ OTP sent via Firebase`
   - **📱 Check phone for SMS** from Firebase
   - SMS contains 6-digit code (e.g., `342891`)

5. **Enter OTP**
   - Paste the code from SMS
   - OR use test code: `123456` (if configured)

6. **Click "Verify OTP"**
   - Should see: `✅ OTP verified, user logged in`
   - User is now authenticated

---

#### Expected Console Output

**When sending OTP:**
```
[OTP Service] Sending OTP to: +918810616993
[OTP Service] Starting real Firebase OTP for: +918810616993
✅ [OTP Service] OTP sent via Firebase, verification ID: ...
📱 Check your phone for the SMS OTP
```

**When verifying:**
```
✅ [OTP Service] OTP verified, user logged in: +918810616993
```

---

### PART 4: Troubleshooting

#### Problem: Still Getting `auth/argument-error`

**Checklist (in order):**

- [ ] **Phone Auth provider toggle is BLUE (enabled)** in Firebase Console
- [ ] **SMS region policy is "Allow"** (not "Deny")
- [ ] **Your country is in "List of regions"** for SMS
- [ ] **Your test phone number is added** with test OTP
- [ ] **All .env.local fields are filled** (not blank/undefined)
- [ ] **App is restarted** after Firebase changes
- [ ] **`USE_REAL_OTP = true`** (not false)

If all are checked and still failing:

1. **Verify credentials:**
   - Go to Firebase Console → Project Settings
   - Copy each value exactly
   - Paste into .env.local
   - Match character-for-character

2. **Clear app cache:**
   ```bash
   npx expo start --clear
   ```

3. **Test on real device:**
   - Emulators sometimes have Firebase issues
   - Real Android/iOS phone is more reliable

---

#### Problem: No SMS Received

**Possible causes:**

- ❌ SMS region policy is still "Deny"
- ❌ Your country not selected in regions list
- ❌ SMS quota exceeded (100/day free tier)
- ❌ reCAPTCHA not enabled
- ❌ Phone number registered but not in test numbers list

**Solutions:**

1. Verify SMS region policy is "Allow" with your country selected
2. Wait until next day (SMS quota resets daily)
3. Check reCAPTCHA is enabled in Firebase Console
4. Try using test OTP code instead: `123456`

---

#### Problem: `auth/invalid-phone-number`

**Wrong phone format used.**

- ✅ Correct: `+918810616993` (with + and country code)
- ❌ Wrong: `918810616993` (missing +)
- ❌ Wrong: `8810616993` (missing country code)
- ❌ Wrong: `+91-8810616993` (dashes not allowed)

**App converts:** `8810616993` → `+918810616993` automatically

---

### PART 5: Development vs Production Modes

| Mode | USE_REAL_OTP | OTP Source | SMS Sent | Use Case |
|------|-------------|-----------|----------|----------|
| **Development** | `false` | Console log | ❌ No | Test UI without Firebase |
| **Production** | `true` | Real Firebase | ✅ Yes | Test with real SMS |

**For development testing:**
```javascript
const USE_REAL_OTP = false;
// OTP appears in console: [DEV MODE] OTP for testing: 342891
```

**For production testing:**
```javascript
const USE_REAL_OTP = true;
// Real SMS sent via Firebase to your phone
```

---

### PART 6: Code Examples

#### Sending OTP

```javascript
import { useSendOTP } from '@/services/otpQueries';

export function PhoneVerification() {
  const sendOTP = useSendOTP();
  const [phone, setPhone] = useState('');

  const handleSendOTP = async () => {
    try {
      // Format phone with country code
      const phoneNumber = phone.startsWith('+') 
        ? phone 
        : '+91' + phone;

      // Send OTP
      const result = await sendOTP.mutateAsync(phoneNumber);
      
      console.log('✅ OTP sent');
      // Show OTP input screen
      setShowOtpInput(true);
    } catch (error) {
      console.error('❌ Failed to send OTP:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <>
      <TextInput
        placeholder="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Button
        title={sendOTP.isPending ? 'Sending...' : 'Send OTP'}
        onPress={handleSendOTP}
        disabled={sendOTP.isPending}
      />
    </>
  );
}
```

#### Verifying OTP

```javascript
import { useVerifyOTP } from '@/services/otpQueries';

export function OtpVerification({ confirmationResult }) {
  const verifyOTP = useVerifyOTP();
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    try {
      if (otp.length !== 6) {
        Alert.alert('Error', 'OTP must be 6 digits');
        return;
      }

      // Verify OTP
      const user = await verifyOTP.mutateAsync({
        confirmationResult,
        otp,
      });

      console.log('✅ OTP verified, user:', user.phoneNumber);
      // Navigate to next step
      router.push('/(tabs)');
    } catch (error) {
      console.error('❌ Failed to verify OTP:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <>
      <TextInput
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />
      <Button
        title={verifyOTP.isPending ? 'Verifying...' : 'Verify OTP'}
        onPress={handleVerifyOTP}
        disabled={verifyOTP.isPending}
      />
    </>
  );
}
```

---

### PART 7: Expo-Specific Considerations

#### Why Expo Go Works for Phone Auth

- ✅ Firebase Web SDK works in Expo Go
- ✅ AsyncStorage available for persistence
- ✅ SMS works on real device (not all emulators)
- ❌ reCAPTCHA requires workaround in some cases

#### Testing on Different Devices

| Device | Works? | Notes |
|--------|--------|-------|
| **Expo Go (real device)** | ✅ Yes | Recommended for testing |
| **Android Emulator** | ⚠️ Sometimes | May have SMS issues |
| **iOS Simulator** | ❌ No | Can't receive SMS |
| **Real Android Phone** | ✅ Yes | Most reliable |
| **Real iPhone** | ✅ Yes | Most reliable |

**Recommendation:** Test on a real device first.

---

### PART 8: Firebase Quotas & Costs

**Free Tier:**
- 100 SMS per day (combined for all users)
- After limit, SMSs fail until next day

**Standard Pricing:**
- ~$0.06 per SMS (varies by country)
- Set budget alerts in Firebase Console

**To check usage:**
- Firebase Console → Authentication → Usage & quotas

---

## Summary Checklist

Before testing, verify ALL of these:

**Firebase Console:**
- [ ] Phone Auth provider is ENABLED (blue toggle)
- [ ] SMS region policy is "Allow"
- [ ] Your country in region list
- [ ] reCAPTCHA is ENABLED
- [ ] Test phone number added (+918810616993 + test OTP)

**App Code:**
- [ ] .env.local has ALL Firebase credentials
- [ ] `firebase.js` initializes auth correctly
- [ ] `otpService.js` has `USE_REAL_OTP = true`
- [ ] `otpQueries.js` has hooks for mutations

**Testing:**
- [ ] App restarted after Firebase changes
- [ ] Real device used (not emulator if possible)
- [ ] Console shows `✅ OTP sent via Firebase`
- [ ] SMS received on phone

---

## Next Steps

1. **Complete all Firebase Console steps** above
2. **Update .env.local** with credentials
3. **Set `USE_REAL_OTP = true`**
4. **Restart app** completely
5. **Test OTP flow** end-to-end
6. **Monitor console** for success/error messages

Good luck! 🚀📱
