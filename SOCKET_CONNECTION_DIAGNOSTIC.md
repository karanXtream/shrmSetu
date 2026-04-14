# Socket Connection Error Diagnostic

## Problem
Socket.IO connection failing to `192.168.0.226:5000` (websocket error).

## Root Cause
- Socket service was using hardcoded IP instead of reading `.env`
- **FIXED**: Updated socketService.js to read `EXPO_PUBLIC_API_URL` from .env

## Diagnostic Steps

### Step 1: Verify Backend is Running
```bash
# In the backend directory
cd backend
npm run dev
```
Expected output: `🔌 Socket.IO server running on port 5000`

### Step 2: Check Your Backend Machine IP
Run on the backend machine:
```bash
ipconfig
```
Find your "IPv4 Address" under your network adapter. Example: `192.168.0.221`

### Step 3: Update Frontend .env
Verify frontend has the CORRECT IP:
```
EXPO_PUBLIC_API_URL=http://192.168.0.221:5000
```
Should match the IP from Step 2.

### Step 4: Test Backend Connectivity
From your development machine (where the app runs):
```bash
cd backend
node test-socket-setup.js
```
Expected output: `✅ Server is reachable` and version info

### Step 5: Verify Network Connectivity
Ping the backend machine from your device:
```bash
ping 192.168.0.221
```
Should get responses, not "unreachable"

### Step 6: Restart Frontend
After .env changes:
```bash
cd frontend
npm start
```
Watch for: `🔌 Connecting socket to: http://192.168.0.221:5000`

---

## Common Issues

### Issue: "websocket error"
**Likely causes:**
- Backend not running
- Wrong IP address in .env
- Network unreachable
- Firewall blocking port 5000

**Check:**
1. Is backend running? (`npm run dev`)
2. Is IP correct? (`ipconfig` on backend, update .env)
3. Can you ping backend machine? (`ping 192.168.x.x`)
4. Is port 5000 open? (Check firewall settings)

### Issue: Connection times out
- Likely a network or IP issue
- Verify IP address is correct for your network
- Check firewall ports

### Issue: "Connection refused"
- Backend is not running
- Wrong port
- Wrong IP address

---

## Debug Command Reference

**In frontend console/debugger:**
```javascript
// Check socket status
import socketService from '../services/socketService';
socketService.diagnostics && socketService.diagnostics.getSocketStatus()

// Or check the print output from socketService initialization
// Look for: "🔌 Connecting socket to: <IP>"
```

**In backend console:**
- Look for `✅ User connected:` when client connects
- Look for `❌ Socket connection error:` to catch failures

---

## IPV4 Addresses

**Backend Machine:** 192.168.0.221 (example - verify with `ipconfig`)
**Frontend/App:** Should connect to same IP

Both must be on same network!

---

## Fixed in This Session
✅ socketService.js now properly reads `EXPO_PUBLIC_API_URL` from .env
✅ Added platform-specific handling (Android emulator, localhost, etc.)
✅ Service logs which URL it's connecting to for easier debugging
