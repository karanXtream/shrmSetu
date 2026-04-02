# Firebase Phone Authentication - Complete Setup

## Error: `auth/argument-error`

This means Phone Authentication is **not enabled** or **not properly configured** in your Firebase project.

---

## Fix: Step-by-Step Setup (10 minutes)

### STEP 1: Enable Phone Authentication Provider

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select **shrmsetu** project
3. Click **Authentication** (left sidebar)
4. Click **Sign-in method** tab (top)
5. Find **Phone** in the list
6. Click on **Phone**
7. Toggle the switch to **ON** (it will turn blue)
8. Click **Save** button

✅ **Phone Authentication is now ENABLED**

---

### STEP 2: Set SMS Region Policy to Allow

1. Still in **Authentication**
2. Click **Settings** tab (top)
3. Scroll down to find **SMS region policy**
4. Select **"Allow"** (instead of "Deny")
5. Click **"Select regions"** dropdown
6. Choose **India** (and any other regions you want)
7. Click **Save**

✅ **SMS can now be sent to India**

---

### STEP 3: Enable reCAPTCHA (Important for Production)

1. In **Authentication** → **Settings**
2. Scroll to **Fraud prevention** section
3. Click **reCAPTCHA**
4. Toggle **Enable** (if it's off)
5. Click **Save**

✅ **reCAPTCHA is now enabled**

---

### STEP 4: Add Your Phone Number to Test List

1. In **Authentication** → **Settings**
2. Scroll down to **"Phone numbers for testing"** section
3. Click **"Add phone number for testing"** button
4. Enter your details:
   - **Phone number:** `+918810616993`
   - **Test OTP:** `123456`
5. Click **Add**
6. You should see your number listed

✅ **Your phone is whitelisted for testing**

---

### STEP 5: Restart Your App

1. **Close the Expo app** completely
2. **Reopen it** or run `npm run android` again
3. Wait for it to fully load

✅ **App has reloaded Firebase config**

---

### STEP 6: Test Again

1. In your app → **Create Profile** (Onboarding)
2. **Step 2: Phone + OTP**
3. Enter phone: `8810616993` (or `+918810616993`)
4. Click **Send OTP**

**Expected result:**
- You should see in console: `✅ OTP sent via Firebase`
- SMS will arrive on your phone with 6-digit code
- Or use test code: `123456`

---

## ✅ Verification Checklist

Go through **Firebase Console** and verify EACH of these:

- [ ] **Authentication** → **Sign-in method** → **Phone** is **ENABLED** (blue toggle)
- [ ] **Authentication** → **Settings** → **SMS region policy** is **Allow**
- [ ] **Authentication** → **Settings** → **SMS region policy** → regions includes **India**
- [ ] **Authentication** → **Settings** → **reCAPTCHA** is **ENABLED**
- [ ] **Authentication** → **Settings** → **Phone numbers for testing** has your number: `+918810616993`
- [ ] **Authentication** → **Settings** → **Phone numbers for testing** test OTP: `123456`

---

## 🔧 If Still Not Working

### Check SMS Region Policy is Really "Allow"

The setting can confuse users. Make sure:
- ✅ **"Allow"** is selected (not "Deny")
- ✅ **"List of regions"** has **India** selected

If **"Deny"** is selected, NO SMS will be sent to India!

### Clear App Cache

Sometimes the app caches old Firebase config:

```bash
# Clear Expo cache
npx expo start --clear

# Or rebuild completely
npm run android
```

### Check Phone Format

When entering phone in app:
- ✅ `8810616993` (app adds +91 automatically)
- ✅ `+918810616993` (manual country code)
- ❌ `918810616993` (missing +)
- ❌ `+91-8810616993` (dashes)

---

## 📊 Expected Console Output

**When sending OTP:**
```
[OTP Service] Sending OTP to: +918810616993
[OTP Service] Starting real Firebase OTP for: +918810616993
✅ [OTP Service] OTP sent via Firebase, verification ID: [long-id-here]
📱 Check your phone for the SMS OTP
```

**When verifying:**
```
✅ [OTP Service] OTP verified, user logged in: +918810616993
```

---

## 🚨 Common Mistakes

| Mistake | Result |
|---------|--------|
| Phone Auth **not enabled** | `auth/argument-error` (won't send) |
| SMS region policy **"Deny"** | No SMS to your country |
| Wrong phone format | `auth/invalid-phone-number` |
| reCAPTCHA not enabled | Issues with real phone auth |
| Not restarting app | Uses old Firebase config |

---

## 💡 Pro Tips

1. **Test with Test OTP first:** If you set test OTP as `123456`, you can verify with `123456` without waiting for SMS
2. **Check Firebase Usage:** Go to Firebase → **Authentication** → **Usage & Quotas** to see if there are issues
3. **Use Real Device:** Emulators sometimes have SMS issues. Real device is more reliable
4. **Check Phone SMS Settings:** Make sure your phone isn't blocking Firebase SMS

---

## Still Having Issues?

Try this troubleshooting order:

1. **Restart app completely** (kill and reopen)
2. **Check every item in the verification checklist** above
3. **Verify SMS region policy is "Allow"** for your country
4. **Try with different phone number** (if available)
5. **Check Firebase quotas:** You get ~100 SMS/day free. After that, SMS won't send until next day
6. **Use test OTP code** instead of waiting for SMS: Enter `123456` (if you configured it)

Good luck! 🚀
