# Firebase Phone Authentication Setup Guide

## Complete Setup Instructions

### Step 1: Enable Phone Authentication in Firebase Console

1. **Open Firebase Console:**
   - Go to https://console.firebase.google.com/
   - Select your **shrmsetu** project

2. **Enable Phone Authentication:**
   - Click **Authentication** (left sidebar)
   - Click **Sign-in method** tab
   - Find **Phone** and click it
   - Toggle **Enable** (switch it ON)
   - Click **Save**

   ✅ Phone Auth is now enabled

### Step 2: Add Your Test Phone Number

**Why:** Firebase won't send real SMS to random numbers. You must add test numbers first.

1. **In Firebase Console:**
   - Go to **Authentication** → **Settings**
   - Scroll down to find **"Phone numbers for testing"** section
   - Click **Add phone number for testing**

2. **Add Your Phone:**
   - **Phone number:** `+918810616993` (replace with your number)
   - **Test OTP:** `123456` (you'll use this to verify)
   - Click **Add**

   ✅ Your phone number is now whitelisted for testing

### Step 3: Verify .env.local Has All Credentials

```bash
# frontend/.env.local should have:
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCB-mviQWMBby4sWnWAgkJ-WLn6YeqYslY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=shrmsetu.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=shrmsetu
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=shrmsetu.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=409985766488
EXPO_PUBLIC_FIREBASE_APP_ID=1:409985766488:android:6835eb64565f49fecba62d
```

✅ All credentials present

### Step 4: Enable Real OTP in App

Edit `frontend/services/otpService.js`:

```javascript
// Line ~28: Change this
const USE_REAL_OTP = true;  // ← Set to TRUE
```

### Step 5: Test the OTP Flow

**On your Expo app:**

1. **Enter phone number:**
   - Field: `8810616993` or `+918810616993`
   - Click **Send OTP**

2. **Check your phone for SMS:**
   - Firebase will send SMS to your number
   - SMS contains 6-digit OTP (e.g., `342891`)

3. **Enter OTP in app:**
   - Paste the code from SMS
   - Click **Verify OTP**

4. **Success!**
   - You should see: "Phone number verified!"
   - User is now logged in

## Firebase Test OTP (Auto-Verification)

If you configured Test OTP `123456` in Firebase Console:
- Any time you send OTP to `+918810616993`
- You can verify with the test OTP code you set
- Firebase auto-verifies it

**Example:**
```
Send OTP → +918810616993
Enter OTP → 123456
Result → Verified! (because it's test OTP)
```

## Real SMS vs Test OTP

| Mode | Phone Number | OTP Source | SMS Sent |
|------|-------------|-----------|----------|
| **Test OTP** | +918810616993 | Firebase Console | ✅ Yes, but accepts test code |
| **Real SMS** | Other number | Firebase | ❌ No SMS (not whitelisted) |

**Recommendation:** Use your actual number as test number, then:
- First time: Firebase sends real SMS + you enter the code
- Subsequent times: You can use the test OTP code for quick testing

## Troubleshooting

### ❌ "No SMS received"
- [ ] Check that phone number is added to test numbers in Firebase
- [ ] Restart the app after enabling Phone Auth
- [ ] Check phone is connected to network
- [ ] Check SMS app isn't blocking Firebase messages

### ❌ "Invalid OTP"
- [ ] Make sure you entered the exact code from SMS
- [ ] If using test OTP, enter the code you configured in Firebase Console
- [ ] OTP expires after 5 minutes - send new one if it's been too long

### ❌ "Firebase: Error (auth/argument-error)"
- [ ] Phone Auth not enabled in Firebase Console
- [ ] Credentials in .env.local are wrong
- [ ] Restart app completely (kill Expo and reopen)

### ❌ "Already initialized" warning
- Normal! The app tried both initialization methods, now using fallback
- Not an error, proceed with testing

## Testing Checklist

- [ ] Phone Auth **Enabled** in Firebase Console
- [ ] Your phone number added to **Test Numbers** in Firebase
- [ ] `USE_REAL_OTP = true` in `services/otpService.js`
- [ ] `.env.local` has all Firebase credentials
- [ ] App is running on your device or emulator
- [ ] Phone/emulator has working SMS (if real device)
- [ ] You're trying to log in on **Step 2: Phone + OTP Verification** of the onboarding

## Expected Console Logs

When you test, you should see in Expo console:

```
[OTP Service] Sending OTP to: +918810616993
[OTP Service] Starting real Firebase OTP for: +918810616993
✅ [OTP Service] OTP sent via Firebase, verification ID: [verification-id]
📱 Check your phone for the SMS OTP
```

Then after entering OTP and verifying:

```
✅ [OTP Service] OTP verified, user logged in: +918810616993
✅ [DEV MODE] OTP verified successfully (placeholder)
```

Good luck! 🎉
