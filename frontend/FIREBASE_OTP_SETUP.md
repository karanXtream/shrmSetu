# Firebase OTP Setup Guide

## Quick Start

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project" → Name: `shrmSetu`
3. Enable Google Analytics (optional)
4. Create project

### 2. Get Firebase Credentials
1. Go to **Settings** (gear icon) → **Project settings**
2. Scroll to "Your apps" section
3. Click "Web" app (or create if not exists)
4. Copy the following:
   - API Key → `EXPO_PUBLIC_FIREBASE_API_KEY`
   - Auth Domain → `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - Project ID → `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - Storage Bucket → `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - Messaging Sender ID → `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - App ID → `EXPO_PUBLIC_FIREBASE_APP_ID`

### 3. Enable Phone Authentication
1. Go to **Authentication** → **Sign-in method**
2. Click **Phone** 
3. Toggle **Enable** ✅
4. Add test phone numbers (optional for development):
   - `+91 9876543210` (for testing)

### 4. Setup Environment Variables
Create `frontend/.env.local`:

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `.env.local` and paste your Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=shrmsetu-abc123.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=shrmsetu-abc123
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=shrmsetu-abc123.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
```

### 5. Test Firebase Setup
In your app, test with:

```javascript
import { getCurrentUser, isAuthenticated } from '@/services/otpService';

// This will show if Firebase is configured
console.log('Firebase ready:', isAuthenticated());
```

---

## File Structure

```
frontend/
├── config/
│   └── firebase.js              ✅ Firebase initialization
├── services/
│   ├── otpService.js            ✅ OTP logic (TODO: API calls)
│   └── otpQueries.js            ✅ TanStack Query hooks
└── .env.example                 ✅ Updated with Firebase vars
```

---

## Usage Examples

### Send OTP
```javascript
import { useSendOTP } from '@/services/otpQueries';

export const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const sendOTP = useSendOTP();
  
  const handleSendOTP = async () => {
    try {
      const confirmationResult = await sendOTP.mutateAsync(phone);
      // Navigate to OTP verification screen
      // Pass confirmationResult to next screen
    } catch (error) {
      console.error('Send OTP failed:', error);
    }
  };
  
  return (
    <>
      <TextInput
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Button
        title={sendOTP.isPending ? 'Sending...' : 'Send OTP'}
        onPress={handleSendOTP}
        disabled={sendOTP.isPending}
      />
      {sendOTP.error && <Text>{sendOTP.error.message}</Text>}
    </>
  );
};
```

### Verify OTP
```javascript
import { useVerifyOTP } from '@/services/otpQueries';
import { useRouter } from 'expo-router';

export const OTPVerificationScreen = ({ confirmationResult }) => {
  const [otp, setOtp] = useState('');
  const verifyOTP = useVerifyOTP();
  const router = useRouter();
  
  const handleVerifyOTP = async () => {
    try {
      const user = await verifyOTP.mutateAsync({
        confirmationResult,
        otp,
      });
      
      // Save user data and navigate
      console.log('User logged in:', user.phoneNumber);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Verify OTP failed:', error);
    }
  };
  
  return (
    <>
      <TextInput
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />
      <Button
        title={verifyOTP.isPending ? 'Verifying...' : 'Verify OTP'}
        onPress={handleVerifyOTP}
        disabled={verifyOTP.isPending}
      />
      {verifyOTP.error && <Text>{verifyOTP.error.message}</Text>}
    </>
  );
};
```

### Check Auth State
```javascript
import { useAuthState } from '@/services/otpQueries';

export const HomeScreen = () => {
  const { data: authState, isLoading } = useAuthState();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!authState?.isSignedIn) {
    return <Text>Not logged in</Text>;
  }
  
  return <Text>Welcome {authState.user?.phoneNumber}</Text>;
};
```

---

## Testing with Development Placeholder

The setup includes placeholder functions that don't call Firebase yet:

```javascript
// In otpService.js
sendOTP: async (phoneNumber) => {
  return {
    verificationId: 'fake-id',
    confirm: async (otp) => ({
      user: { phoneNumber }
    })
  };
}
```

This lets you test UI without Firebase. When you're ready:

1. Uncomment the actual Firebase calls (marked with `TODO`)
2. Add real credentials to `.env.local`
3. Test on Expo Go

---

## Firebase Quotas & Costs

**Free Tier Limits:**
- ✅ 100 SMS per day (test mode)
- ✅ Unlimited verifications
- ⚠️ Additional SMS: ~$0.01 per SMS

**Set Quota:**
1. Go to **Firebase Console**
2. **Authentication** → **Quotas**
3. Set SMS quota to prevent surprise charges

---

## Common Issues

### "Missing Firebase config"
Check `.env.local` has all variables. Example:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=shrmsetu.firebaseapp.com
```

### reCAPTCHA Error
Firebase auto-detects phone verification on Expo.
- On Android/iOS: Uses app verification
- On web: Shows reCAPTCHA challenge

### OTP Not Received
1. Check phone number format: `+91XXXXXXXXXX`
2. Enable Phone auth in Firebase Console
3. Check SMS quotas aren't exceeded

---

## Next Steps

✅ Firebase project created
✅ Authentication enabled
✅ .env.local configured
✅ OTP service ready
✅ Query hooks prepared

⏳ When ready to enable real Firebase:
1. Uncomment `TODO:` lines in `services/otpService.js`
2. Test on Expo Go or device
3. Handle verification results

---

## Architecture

```
User Phone Input
    ↓
[useSendOTP] → otpService.sendOTP()
    ↓
Firebase sends SMS
    ↓
User enters OTP
    ↓
[useVerifyOTP] → otpService.verifyOTP()
    ↓
Firebase verifies code
    ↓
User logged in ✅
```

Both hooks work offline in development (placeholder mode).
