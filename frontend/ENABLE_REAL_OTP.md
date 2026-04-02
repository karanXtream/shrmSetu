# Enable Real SMS OTP with Firebase

## Prerequisites
- Firebase project already created (shrmsetu)
- Firebase Web SDK already installed

## Step 1: Enable Phone Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **shrmsetu** project
3. Go to **Authentication** → **Sign-in method**
4. Find **Phone** and click on it
5. Toggle **Enable** to ON
6. Click **Save**

## Step 2: Add Test Phone Numbers (Important!)

**Why?** Firebase requires test numbers for development to avoid hitting SMS quotas.

1. In Firebase Console, go to **Authentication** → **Phone numbers for testing**
2. Click **Add phone number for testing**
3. Enter your phone number:
   - **Phone number:** +918810616993 (your number)
   - **Test OTP:** 123456 (any 6-digit code you choose)
4. Click **Add**

Now Firebase will recognize this number and send SMS properly during testing.

## Step 3: Enable Real OTP Mode in Your App

✅ Already done! We've set:
```javascript
// In services/otpService.js
const USE_REAL_OTP = true;
```

## Step 4: Test the OTP Flow

1. **Open your app on Android/Emulator**
2. **Enter your phone number:** +918810616993
3. **Click "Send OTP"**
4. **Check your phone for SMS from Firebase**
5. **Enter the OTP code you received**
6. **Click "Verify OTP"**

## Common Issues & Solutions

### ❌ Issue: "No SMS received"

**Solution 1: Check Firebase Project ID**
- Your Firebase config has: `projectId: shrmsetu`
- Make sure this matches your Firebase Console project

**Solution 2: Check Phone Number Format**
- Must include country code: `+918810616993`
- Not valid: `8810616993` or `918810616993`

**Solution 3: Check .env.local**
- Ensure `EXPO_PUBLIC_FIREBASE_API_KEY` is correct
- All Firebase credentials from firebase config

**Solution 4: Quota Issues**
- Firebase free tier has SMS limits (~100/day)
- Check Firebase Console → Authentication → Usage

### ❌ Issue: "Invalid OTP" when you enter correct code

**Solution:** Make sure the OTP you entered matches exactly what Firebase sent via SMS

### ⚠️ Issue: "Too many requests"

**Solution:** Wait a few minutes before retrying. Firebase rate-limits OTP requests.

## Development vs Production

| Mode | OTP Source | SMS Sent | Use Case |
|------|-----------|---------|----------|
| `USE_REAL_OTP = false` | Generated in console | ❌ No | Testing UI without Firebase |
| `USE_REAL_OTP = true` | Real Firebase | ✅ Yes | Production testing with real phone |

## Reverting to Development Mode

If you want to go back to fake OTP testing:

```javascript
// In services/otpService.js
const USE_REAL_OTP = false; // Back to development
```

Then check console logs for the generated OTP.

## Firebase Quotas & Costs

**Free Tier:**
- 100 SMS per day (shared across all users)
- After limit, SMSs won't send until next day

**Costs (if you exceed free tier):**
- ~$0.06 per SMS (varies by country)
- Set budget alerts in Firebase Console

## Testing Without Real Phone

If you don't have a real phone, you can:

1. Use test phone number in Firebase Console
2. Use the test OTP code you configured
3. Firebase will accept it automatically

Example:
```
Phone: +918810616993
OTP (from Firebase settings): 123456
→ Will be accepted by Firebase automatically
```

## Next Steps

✅ If SMS now works:
- Test full OTP flow
- Verify user logs in successfully
- Test on both Android and iOS (if needed)

❌ If SMS still doesn't work:
- Check your phone's SMS settings
- Verify phone number format (+country code)
- Check Firebase Console for errors
- Ensure all Firebase credentials in .env.local are correct
