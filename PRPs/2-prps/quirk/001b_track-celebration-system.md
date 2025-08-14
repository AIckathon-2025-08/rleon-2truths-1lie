# PRP-001B: Celebration System Track (Parallel Independent)

**Track**: B - Confetti, Avatars & Sound Effects  
**Parent PRP**: [`001_uiux-charm-enhancement.md`](./001_uiux-charm-enhancement.md)  
**Parallel Track**: [`001a_track-theme-system.md`](./001a_track-theme-system.md) (can run simultaneously)  
**Integration Track**: [`001c_track-integration.md`](./001c_track-integration.md) (requires this track completed)  
**Dependency**: None - Can work independently  
**Estimated Effort**: 3-4 hours  
**Files Affected**: 3-4 files  

## Implementation Scope

### Files to Create
1. `frontend/src/components/CelebrationEffect.jsx` - Single celebration component
2. `frontend/src/components/PlayerAvatar.jsx` - Simple DiceBear API integration  
3. `frontend/src/components/SoundEffect.jsx` - Victory sound component
4. `frontend/src/utils/avatarUtils.js` - Avatar generation helpers

### KISS Implementation Strategy

**One-File Celebration System**:
```jsx
// CelebrationEffect.jsx - All celebration logic in one place
import Confetti from 'react-confetti';

const CelebrationEffect = ({ winners, onComplete }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    // Auto-stop confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
      onComplete?.();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <>
      {showConfetti && (
        <Confetti 
          numberOfPieces={100}
          recycle={false}
          colors={['#1E40AF', '#0891B2', '#10B981']} // TestIO colors
        />
      )}
      
      <div className="winners-display space-y-2">
        {winners.map(winner => (
          <div key={winner.id} className="winner-badge animate-bounce bg-testio-blue text-white px-4 py-2 rounded-full">
            🏆 {winner.name} nailed it!
          </div>
        ))}
      </div>
    </>
  );
};
```

**Simple Avatar Component**:
```jsx
// PlayerAvatar.jsx - DiceBear API integration
const PlayerAvatar = ({ playerName, size = 32 }) => {
  const avatarUrl = useMemo(() => {
    const seed = btoa(playerName || 'anonymous').replace(/[^a-zA-Z0-9]/g, '');
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=1e40af,0891b2&size=${size}`;
  }, [playerName, size]);
  
  return (
    <img 
      src={avatarUrl}
      alt={`${playerName} avatar`}
      className={`rounded-full border-2 border-testio-teal w-${size} h-${size}`}
      loading="lazy"
    />
  );
};
```

**Simple Sound Effect**:
```jsx
// SoundEffect.jsx - HTML5 audio with user permission
const SoundEffect = ({ trigger, soundType = 'victory' }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  useEffect(() => {
    if (trigger && audioEnabled) {
      const audio = new Audio('/sounds/victory-chime.mp3');
      audio.volume = 0.3; // Keep it subtle
      audio.play().catch(() => {
        // User hasn't interacted yet - that's fine
        console.log('Audio requires user interaction first');
      });
    }
  }, [trigger, audioEnabled]);
  
  return (
    <button 
      onClick={() => setAudioEnabled(!audioEnabled)}
      className="text-xs text-gray-500 hover:text-testio-blue"
    >
      🔊 {audioEnabled ? 'Sound On' : 'Sound Off'}
    </button>
  );
};
```

**Avatar Utilities**:
```javascript
// avatarUtils.js - Helper functions
export const generateAvatarUrl = (playerName, options = {}) => {
  const { size = 64, style = 'adventurer' } = options;
  const seed = btoa(playerName || 'anonymous').replace(/[^a-zA-Z0-9]/g, '');
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=1e40af,0891b2&size=${size}`;
};

export const getWinnerList = (votes, correctAnswer, voters) => {
  return voters
    .filter(voter => voter.vote === correctAnswer)
    .map(voter => ({
      id: voter.sessionId,
      name: voter.playerName || 'Anonymous'
    }));
};
```

## Success Criteria

**Functional Requirements**:
- [ ] Confetti displays when winners are revealed (3-second duration)
- [ ] Player avatars generate consistently from names using DiceBear API
- [ ] Victory sound plays when user enables audio (respects user preference)
- [ ] Winner badges display correctly with TestIO styling

**Competition Appeal**:
- [ ] Visual celebrations are impressive and fun  
- [ ] Avatar personalities add quirky charm
- [ ] Sound effects enhance excitement (when enabled)
- [ ] TestIO brand colors maintained throughout celebrations

## Testing Strategy

**Independent Component Testing**:
```jsx
// Test CelebrationEffect in isolation
const testWinners = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' }
];

<CelebrationEffect winners={testWinners} onComplete={() => console.log('Done!')} />
```

**Avatar Testing**:
```jsx
// Test avatar generation
<PlayerAvatar playerName="John Doe" size={64} />
<PlayerAvatar playerName="Jane Smith" size={32} />
```

**No Integration Testing Required**:
- Components work independently
- No Socket.io dependencies  
- No backend changes needed
- Can be developed in complete isolation

## Dependencies

**NPM Package Required**:
```bash
npm install react-confetti
```

**External Dependencies**:
- DiceBear API (free, no auth required)
- Victory sound file: `public/sounds/victory-chime.mp3`

**No Coordination Dependencies**:
- No theme system dependencies
- No existing component modifications  
- No backend changes required
- Can be developed completely independently

## Related Files & Next Steps

**Parallel Development**:
- 🎨 **Run simultaneously**: [`001a_track-theme-system.md`](./001a_track-theme-system.md)
- 📋 **Parent context**: [`001_uiux-charm-enhancement.md`](./001_uiux-charm-enhancement.md)

**After Completion**:
- 🔗 **Integration required**: [`001c_track-integration.md`](./001c_track-integration.md) (needs this + Track A)

**Theme Coordination**:
- Celebration colors should work with both light/dark themes from Track A
- TestIO brand colors: `#1E40AF` (blue), `#0891B2` (teal), `#10B981` (green)

**Execution Command**:
```bash
/execute-prp @PRPs/2-prps/quirk/001b_track-celebration-system.md
```

**Ready for parallel development!** 🎉