# Debug Flow for Abhi Onboarding

## Complete Navigation Test Path

### 1. Welcome Screen (phase: 'welcome')
- **URL**: http://localhost:5173
- **Expected**: Welcome screen with "Get Started" and "Skip Setup" buttons
- **Action**: Click "Get Started"
- **Next**: Privacy modal should appear

### 2. Privacy Modal
- **Expected**: Modal with privacy information
- **Action**: Click "Accept & Continue"
- **State Change**: `currentPhase` should change from 'welcome' to 'interview'
- **Next**: Should see Chat Interface

### 3. Chat Interface (phase: 'interview')
- **Expected**:
  - Abhi's greeting message visible
  - Input field at bottom
  - Status panel at bottom showing "Getting to Know You"
- **Action**: Type message and send (e.g., "I will use this for gaming")
- **Next**: AI should respond

### 4. After 3 User Messages
- **Expected**: Automatic transition to persona detection
- **State Change**: `currentPhase` changes to 'persona-detection'

### 5. Persona Detection (phase: 'persona-detection')
- **Expected**: Animated progress bar, then persona reveal
- **Action**: Click "Continue to App Recommendations"
- **Next**: App selection screen

### 6. App Recommendations (phase: 'app-recommendations')
- **Expected**:
  - Grid of recommended apps
  - Top 5 pre-selected
  - Status panel shows detected persona
- **Action**: Click "Continue Setup"
- **Next**: Installation screen

### 7. Installation (phase: 'installation')
- **Expected**:
  - Installation progress for each app
  - Status panel shows active tasks
  - Progress bars animate
- **Auto-advance**: When all apps complete
- **Next**: Setup complete screen

### 8. Setup Complete (phase: 'complete')
- **Expected**:
  - Success checkmark
  - Summary of apps installed
  - Duration displayed
- **Action**: Click "Finish Setup"

## Debugging Tips

If you see a blank screen:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab - should see successful requests
4. In Console, type: `window.location.reload()` to force refresh

If chat doesn't load after privacy:
1. Check DevTools Console for errors
2. Look for any useEffect dependency warnings
3. Verify state.currentPhase changed to 'interview'

## Common Issues Fixed

✅ Duplicate messages - property mismatch fixed (sender → role)
✅ useEffect dependency loops - simplified dependencies
✅ Switch statement indentation - all cases properly aligned
✅ Navigation flow - all phase transitions working
