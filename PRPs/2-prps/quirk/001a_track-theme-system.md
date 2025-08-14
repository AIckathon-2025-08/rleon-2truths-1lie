# PRP-001A: Theme System Track (Parallel Independent)

**Track**: A - Dark Mode Implementation  
**Parent PRP**: [`001_uiux-charm-enhancement.md`](./001_uiux-charm-enhancement.md)  
**Parallel Track**: [`001b_track-celebration-system.md`](./001b_track-celebration-system.md) (can run simultaneously)  
**Integration Track**: [`001c_track-integration.md`](./001c_track-integration.md) (requires this track completed)  
**Dependency**: None - Can work independently  
**Estimated Effort**: 3-4 hours  
**Files Affected**: 3 files  

## Implementation Scope

### Files to Create/Modify
1. `frontend/src/hooks/useTheme.js` - Simple theme toggle hook
2. `frontend/src/components/ThemeToggle.jsx` - Dark/light switch component  
3. `frontend/src/index.css` - Add dark mode CSS variables

### KISS Implementation Strategy

**Simple Dark Mode CSS**:
```css
/* Add to index.css - extend existing --color-testio-* variables */
.dark {
  --color-testio-blue: #3b82f6;
  --color-testio-teal: #06b6d4; 
  --color-background: #1e293b;
  --color-surface: #334155;
  --color-text: #f8fafc;
  --color-text-muted: #cbd5e1;
}

/* Ensure all existing components respect these variables */
.card, .btn-primary, .btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-text);
}
```

**Simple Theme Hook**:
```jsx
// useTheme.js - No complex context, just localStorage + state
export const useTheme = () => {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'light'
  );
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };
  
  return { theme, toggleTheme };
};
```

**Simple Toggle Component**:
```jsx
// ThemeToggle.jsx - Truth/Lie themed toggle
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="btn-secondary"
    >
      {theme === 'light' ? '🌙 Lies in the Dark' : '☀️ Truth in the Light'}
    </button>
  );
};
```

## Success Criteria

**Functional Requirements**:
- [ ] Theme toggle switches between light/dark modes
- [ ] Theme preference persists in localStorage
- [ ] All existing components work with new CSS variables
- [ ] TestIO brand colors maintain proper contrast in both themes

**Integration Requirements**:
- [ ] No changes to existing component logic required
- [ ] Theme system works with all existing TestIO styling
- [ ] Toggle can be placed in any component without complex setup

## Testing Strategy

**Manual Testing**:
1. Toggle between themes - all components should switch properly
2. Refresh page - theme preference should persist
3. Test all existing voting flow - everything should work normally

**No Complex Testing Required**:
- Simple CSS variables + localStorage  
- No Socket.io changes
- No backend changes
- No breaking changes to existing components

## Dependencies

**None** - This track is completely independent:
- No coordination with celebration system needed
- No backend changes required  
- No new NPM packages needed
- Can be developed and tested in isolation

## Related Files & Next Steps

**Parallel Development**:
- 🎉 **Run simultaneously**: [`001b_track-celebration-system.md`](./001b_track-celebration-system.md) 
- 📋 **Parent context**: [`001_uiux-charm-enhancement.md`](./001_uiux-charm-enhancement.md)

**After Completion**:
- 🔗 **Integration required**: [`001c_track-integration.md`](./001c_track-integration.md) (needs this + Track B)

**Execution Command**:
```bash
/execute-prp @PRPs/2-prps/quirk/001a_track-theme-system.md
```

**Ready for parallel development!** 🚀