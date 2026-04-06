# Renaming Project: T3 Code → bigCode

**Status**: Planned  
**Priority**: High  
**Estimated Effort**: 3-4 hours  
**Last Updated**: April 6, 2026

## Table of Contents

1. [Rationale](#rationale)
2. [Scope of Changes](#scope-of-changes)
3. [Files to Update](#files-to-update)
4. [Logo & Asset Requirements](#logo--asset-requirements)
5. [Implementation Checklist](#implementation-checklist)
6. [Testing & Validation](#testing--validation)
7. [Rollback Plan](#rollback-plan)

---

## Rationale

### Why "bigCode"?

**bigCode** is a deliberate reference to the **Big Data** that powers the AI models behind all the coding agents used in this application.

**Conceptual Story**:

- **Big Data** → trained the AI models
- **Big Models** → power the coding agents
- **bigCode** → the tool that leverages them

### Brand Positioning

- **Enterprise-grade**: "Big" implies powerful, comprehensive, capable
- **AI-first**: Emphasizes the AI/ML foundation of the tool
- **Developer-focused**: Appeals to developers who understand the AI ecosystem
- **Narrative-driven**: The name tells the technology stack story

### Suggested Taglines

- "bigCode - Built on Big Data, Powered by AI"
- "bigCode - Where Big Models Meet Your Code"
- "bigCode - AI Coding, Big Data Powered"

---

## Scope of Changes

### What Changes

1. **Application name**: "T3 Code" → "bigCode"
2. **Display name**: "T3 Code (Alpha)" → "bigCode (Alpha)"
3. **Package names**: `@t3tools/*` → `@bigcode/*` (optional, can be done later)
4. **Documentation**: All references to "T3 Code" in docs
5. **Branding assets**: Logos, icons, favicons
6. **Window titles**: Browser tabs, desktop app windows
7. **User-facing strings**: Settings panels, about dialogs

### What Stays the Same (For Now)

1. **Repository name**: Can remain `t3code` (GitHub repo URL)
2. **Folder structure**: `/Users/youpele/DevWorld/t3code/` (no need to rename)
3. **Internal variable names**: `t3_*` metric names, etc. (can be updated later)
4. **Package scope**: `@t3tools` can remain for backward compatibility

---

## Files to Update

### 📊 **Summary**

- **Total files**: ~94 files
- **Critical files**: 3 files (must update)
- **Documentation**: 13 files
- **Test files**: 50+ files (lower priority)
- **Configuration/Scripts**: 20+ files
- **UI Components**: 10+ files

---

### 🔴 **Critical Files** (Must Update First)

#### 1. Main Branding File

**File**: `apps/web/src/branding.ts`

```typescript
// Before
export const APP_BASE_NAME = "T3 Code";
export const APP_STAGE_LABEL = import.meta.env.DEV ? "Dev" : "Alpha";
export const APP_DISPLAY_NAME = `${APP_BASE_NAME} (${APP_STAGE_LABEL})`;

// After
export const APP_BASE_NAME = "bigCode";
export const APP_STAGE_LABEL = import.meta.env.DEV ? "Dev" : "Alpha";
export const APP_DISPLAY_NAME = `${APP_BASE_NAME} (${APP_STAGE_LABEL})`;
```

**Impact**: Updates all UI references automatically

---

#### 2. Desktop App Product Name

**File**: `apps/desktop/package.json`

```json
// Before
{
  "productName": "T3 Code (Alpha)"
}

// After
{
  "productName": "bigCode (Alpha)"
}
```

**Impact**: Desktop app window title, macOS menu bar, Windows taskbar

---

#### 3. Web App HTML Title

**File**: `apps/web/index.html`

```html
<!-- Before -->
<title>T3 Code (Alpha)</title>

<!-- After -->
<title>bigCode (Alpha)</title>
```

**Impact**: Browser tab title

---

### 📄 **Documentation Files** (13 files)

Update all references to "T3 Code" in:

1. **`README.md`** - Main project readme
2. **`AGENTS.md`** - Agent development guide
3. **`REMOTE.md`** - Remote development docs
4. **`CONTRIBUTING.md`** - Contribution guidelines (if exists)
5. **`KEYBINDINGS.md`** - Keybindings documentation
6. **`TODO.md`** - Project TODO list
7. **`docs/constants-refactoring.md`** - Constants refactoring plan
8. **`docs/observability.md`** - Observability documentation
9. **`docs/release.md`** - Release process
10. **`.docs/scripts.md`** - Scripts documentation
11. **`.docs/codex-prerequisites.md`** - Codex setup guide
12. **`apps/marketing/src/lib/releases.ts`** - Release notes
13. **Any other markdown files in `docs/`**

**Search & Replace Pattern**:

- "T3 Code" → "bigCode"
- "T3Code" → "bigCode"
- "t3code" → "bigcode" (in prose, not paths)
- "t3-code" → "bigcode"

---

### 🎨 **UI Component Files** (10+ files)

Files with user-facing "T3 Code" strings:

1. **`apps/web/src/routes/__root.tsx`** - Root layout
2. **`apps/web/src/main.tsx`** - Main entry point
3. **`apps/web/src/components/ChatView.browser.tsx`** - Chat view
4. **`apps/web/src/components/settings/SettingsPanels.tsx`** - Settings panel
5. **`apps/web/src/components/desktopUpdate.logic.ts`** - Update notifications
6. **`apps/web/src/hooks/useSettings.ts`** - Settings hook
7. **`apps/web/src/uiStateStore.ts`** - UI state management
8. **`apps/web/src/rpc/serverState.test.ts`** - Server state tests

**Action**: Search for `"T3 Code"` string literals and replace with `"bigCode"`

---

### 🔧 **Configuration & Script Files** (20+ files)

1. **`turbo.json`** - Turbo build configuration
2. **`scripts/dev-runner.ts`** - Development runner
3. **`scripts/build-desktop-artifact.ts`** - Desktop build script
4. **`scripts/release-smoke.ts`** - Release smoke tests
5. **`scripts/merge-mac-update-manifests.test.ts`** - Update manifest merger
6. **`scripts/mock-update-server.ts`** - Mock update server
7. **`apps/desktop/src/main.ts`** - Desktop app main process
8. **`apps/server/src/cli.ts`** - CLI tool
9. **`apps/server/src/cli-config.test.ts`** - CLI config tests
10. **`apps/server/src/telemetry/Layers/AnalyticsService.ts`** - Analytics
11. **`apps/server/src/telemetry/Layers/AnalyticsService.test.ts`** - Analytics tests

**Note**: Many of these contain "t3code" in paths or test fixtures. Update user-facing strings, but paths can remain as-is.

---

### 🧪 **Test Files** (50+ files - Lower Priority)

Test files with "t3code" in test data or assertions:

- `apps/server/src/git/Layers/GitManager.test.ts` (74 matches)
- `apps/server/src/git/Layers/GitCore.test.ts` (20 matches)
- `apps/server/src/cli-config.test.ts` (25 matches)
- `apps/server/src/terminal/Layers/Manager.test.ts` (7 matches)
- `apps/server/src/workspace/Layers/WorkspaceEntries.test.ts` (9 matches)
- `apps/web/src/composerDraftStore.test.ts`
- `apps/web/src/uiStateStore.test.ts`
- `apps/web/src/projectScripts.test.ts`
- `packages/shared/src/shell.test.ts` (14 matches)
- And 40+ more test files

**Action**: Update test fixtures and assertions that reference "T3 Code" in user-facing contexts. Path references can stay as "t3code".

---

### 📦 **Package Names** (Optional - Phase 2)

**Current**: `@t3tools/*`  
**Future**: `@bigcode/*`

Files to update if changing package scope:

1. **`package.json`** (root) - `"name": "@t3tools/monorepo"`
2. **`apps/desktop/package.json`** - `"name": "@t3tools/desktop"`
3. **`apps/server/package.json`** - `"name": "t3"`
4. **`apps/web/package.json`** - `"name": "@t3tools/web"`
5. **`apps/marketing/package.json`** - `"name": "@t3tools/marketing"`
6. **`packages/contracts/package.json`** - `"name": "@t3tools/contracts"`
7. **`packages/shared/package.json`** - `"name": "@t3tools/shared"`
8. All import statements: `from "@t3tools/contracts"` → `from "@bigcode/contracts"`

**Recommendation**: Keep `@t3tools` for now to avoid breaking changes. Rename in a separate PR later.

---

## Logo & Asset Requirements

### 🎨 **Assets You Need to Create**

#### **Source Asset** (Create This First)

**Master Logo**: 1024x1024 PNG with transparent background

- High resolution, clean design
- Works well at small sizes (16x16) and large sizes (1024x1024)
- Represents "bigCode" brand identity
- Consider: Data visualization elements, code symbols, "big data" aesthetic

---

### **Desktop App Icons** (High Priority)

#### 1. macOS Icons

**Files to Replace**:

- `apps/desktop/resources/icon.png` (1024x1024 PNG)
- `assets/prod/black-macos-1024.png` (1024x1024 PNG)
- `assets/prod/black-universal-1024.png` (1024x1024 PNG)

**Format**: PNG, 1024x1024px, transparent background

**Build Process**: Electron builder automatically converts PNG to `.icns` format

---

#### 2. Windows Icons

**Files to Replace**:

- `apps/desktop/resources/icon.ico` (multi-size ICO)
- `assets/prod/t3-black-windows.ico` (multi-size ICO)

**Format**: ICO file containing multiple sizes:

- 16x16
- 32x32
- 48x48
- 64x64
- 128x128
- 256x256

**Tool**: Use online converter or ImageMagick:

```bash
convert icon-1024.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

---

#### 3. iOS Icons (If Applicable)

**Files to Replace**:

- `assets/prod/black-ios-1024.png` (1024x1024 PNG)

**Format**: PNG, 1024x1024px, no transparency (solid background)

---

### **Web App Icons** (High Priority)

#### 4. Favicons

**Files to Replace**:

**Main Web App**:

- `apps/web/public/favicon.ico` (multi-size: 16, 32, 48px)
- `apps/web/public/favicon-16x16.png`
- `apps/web/public/favicon-32x32.png`
- `apps/web/public/apple-touch-icon.png` (180x180px)

**Marketing Site**:

- `apps/marketing/public/favicon.ico`
- `apps/marketing/public/icon.png`
- `apps/marketing/public/apple-touch-icon.png`
- `apps/marketing/public/favicon-16x16.png`
- `apps/marketing/public/favicon-32x32.png`

**Generation Commands**:

```bash
# From 1024x1024 source PNG
convert icon-1024.png -resize 16x16 favicon-16x16.png
convert icon-1024.png -resize 32x32 favicon-32x32.png
convert icon-1024.png -resize 180x180 apple-touch-icon.png
convert icon-1024.png -define icon:auto-resize=48,32,16 favicon.ico
```

---

#### 5. Vector Logo (Optional but Recommended)

**File to Replace**:

- `assets/prod/logo.svg`

**Format**: SVG (Scalable Vector Graphics)

**Benefits**:

- Infinite scalability
- Small file size
- Can be used in marketing materials
- Easy to modify colors/styling

---

### **Development Assets** (Optional)

The `assets/dev/` folder contains blueprint-style development icons. These can be updated later or kept as-is since they're only used in development mode.

**Files**:

- `assets/dev/blueprint-ios-1024.png`
- `assets/dev/blueprint-macos-1024.png`
- `assets/dev/blueprint-universal-1024.png`
- `assets/dev/blueprint-web-apple-touch-180.png`
- `assets/dev/blueprint-web-favicon-16x16.png`
- `assets/dev/blueprint-web-favicon-32x32.png`
- `assets/dev/blueprint-web-favicon.ico`
- `assets/dev/blueprint-windows.ico`

---

### 📋 **Asset Creation Checklist**

- [ ] Create master 1024x1024 PNG logo
- [ ] Generate 16x16 PNG favicon
- [ ] Generate 32x32 PNG favicon
- [ ] Generate 180x180 PNG apple-touch-icon
- [ ] Generate multi-size favicon.ico (16, 32, 48px)
- [ ] Generate multi-size Windows icon.ico (16-256px)
- [ ] Copy master PNG for macOS (1024x1024)
- [ ] Create SVG vector logo (optional)
- [ ] Update all files in `apps/web/public/`
- [ ] Update all files in `apps/desktop/resources/`
- [ ] Update all files in `apps/marketing/public/`
- [ ] Update all files in `assets/prod/`

---

### 🛠️ **Recommended Tools**

**Icon Generation**:

- **ImageMagick**: Command-line tool for batch conversion
- **Favicon Generator**: https://realfavicongenerator.net/
- **ICO Converter**: https://convertio.co/png-ico/
- **Figma/Sketch**: For designing the master logo

**Installation**:

```bash
# macOS
brew install imagemagick

# Linux
apt-get install imagemagick

# Windows
choco install imagemagick
```

---

## Implementation Checklist

### Phase 1: Critical Branding (30 minutes)

- [ ] Update `apps/web/src/branding.ts`
  - [ ] Change `APP_BASE_NAME` to "bigCode"
- [ ] Update `apps/desktop/package.json`
  - [ ] Change `productName` to "bigCode (Alpha)"
- [ ] Update `apps/web/index.html`
  - [ ] Change `<title>` to "bigCode (Alpha)"
- [ ] Test: Run dev server and verify name appears correctly
- [ ] Test: Build desktop app and verify window title

---

### Phase 2: Documentation (1 hour)

- [ ] Update `README.md`
- [ ] Update `AGENTS.md`
- [ ] Update `REMOTE.md`
- [ ] Update `KEYBINDINGS.md`
- [ ] Update `TODO.md`
- [ ] Update `docs/constants-refactoring.md`
- [ ] Update `docs/observability.md`
- [ ] Update `docs/release.md`
- [ ] Update `.docs/scripts.md`
- [ ] Update `.docs/codex-prerequisites.md`
- [ ] Update any other markdown files in `docs/`
- [ ] Search for remaining "T3 Code" references: `grep -r "T3 Code" docs/`

---

### Phase 3: UI Components (1 hour)

- [ ] Search for "T3 Code" in `apps/web/src/`: `grep -r "T3 Code" apps/web/src/`
- [ ] Update `apps/web/src/routes/__root.tsx`
- [ ] Update `apps/web/src/main.tsx`
- [ ] Update `apps/web/src/components/ChatView.browser.tsx`
- [ ] Update `apps/web/src/components/settings/SettingsPanels.tsx`
- [ ] Update `apps/web/src/components/desktopUpdate.logic.ts`
- [ ] Update any other UI components with user-facing strings
- [ ] Test: Run web app and check all UI text

---

### Phase 4: Configuration & Scripts (30 minutes)

- [ ] Update `turbo.json` (if contains user-facing strings)
- [ ] Update `scripts/dev-runner.ts`
- [ ] Update `scripts/build-desktop-artifact.ts`
- [ ] Update `scripts/release-smoke.ts`
- [ ] Update `apps/desktop/src/main.ts`
- [ ] Update `apps/server/src/cli.ts`
- [ ] Update analytics/telemetry display names
- [ ] Test: Run build scripts to ensure no errors

---

### Phase 5: Logo & Assets (2-3 hours)

**Design Phase**:

- [ ] Design master 1024x1024 PNG logo
- [ ] Review and approve design
- [ ] Export final PNG

**Generation Phase**:

- [ ] Generate all required icon sizes
- [ ] Generate favicon.ico files
- [ ] Generate Windows .ico files
- [ ] Create SVG vector logo (optional)

**Replacement Phase**:

- [ ] Replace icons in `apps/web/public/`
- [ ] Replace icons in `apps/desktop/resources/`
- [ ] Replace icons in `apps/marketing/public/`
- [ ] Replace icons in `assets/prod/`
- [ ] Update dev icons in `assets/dev/` (optional)

**Testing Phase**:

- [ ] Test web app favicon in browser
- [ ] Test desktop app icon on macOS
- [ ] Test desktop app icon on Windows
- [ ] Test desktop app icon on Linux (if applicable)
- [ ] Test apple-touch-icon on iOS Safari
- [ ] Verify all icons look crisp at different sizes

---

### Phase 6: Test Files (1 hour - Optional)

- [ ] Search for "T3 Code" in test files: `grep -r "T3 Code" apps/*/src/**/*.test.ts`
- [ ] Update test fixtures with user-facing "T3 Code" references
- [ ] Keep path references as "t3code" (no need to change)
- [ ] Run test suite: `bun run test`
- [ ] Fix any failing tests

---

### Phase 7: Package Names (Optional - Future PR)

**Only if renaming package scope from `@t3tools` to `@bigcode`**:

- [ ] Update root `package.json`
- [ ] Update all workspace `package.json` files
- [ ] Update all import statements across codebase
- [ ] Update `turbo.json` filters
- [ ] Update CI/CD configuration
- [ ] Test: Full build and test suite
- [ ] Publish packages to npm (if applicable)

**Recommendation**: Do this in a separate PR to minimize risk

---

## Testing & Validation

### Manual Testing Checklist

#### Web App

- [ ] Open web app in browser
- [ ] Verify browser tab title shows "bigCode (Alpha)"
- [ ] Verify favicon displays correctly
- [ ] Check settings panel for any "T3 Code" references
- [ ] Check about dialog (if exists)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)

#### Desktop App

- [ ] Build desktop app: `bun run build:desktop`
- [ ] Launch desktop app
- [ ] Verify window title shows "bigCode (Alpha)"
- [ ] Verify app icon in dock/taskbar
- [ ] Check macOS menu bar name
- [ ] Check Windows taskbar name
- [ ] Check Linux app menu name (if applicable)
- [ ] Test app updates (if update mechanism exists)

#### Documentation

- [ ] Read through updated README.md
- [ ] Verify all links still work
- [ ] Check for any missed "T3 Code" references
- [ ] Ensure branding is consistent

---

### Automated Validation

#### Search for Remaining References

```bash
# Search for "T3 Code" in source files
grep -r "T3 Code" apps/ packages/ --include="*.ts" --include="*.tsx"

# Search for "T3Code" (no space)
grep -r "T3Code" apps/ packages/ --include="*.ts" --include="*.tsx"

# Search for "t3code" in prose (not paths)
grep -r "t3code" docs/ --include="*.md"

# Search in HTML files
grep -r "T3 Code" apps/ --include="*.html"
```

#### Build & Test

```bash
# Type checking
bun typecheck

# Linting
bun lint

# Tests
bun run test

# Build all packages
bun run build

# Build desktop app
bun run build:desktop

# Desktop smoke test
bun run test:desktop-smoke
```

---

### Success Criteria

- [ ] All builds complete successfully
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Web app displays "bigCode" in browser tab
- [ ] Desktop app displays "bigCode" in window title
- [ ] All icons display correctly
- [ ] No "T3 Code" references in user-facing strings
- [ ] Documentation is consistent and accurate

---

## Rollback Plan

### If Issues Arise

1. **Git Revert**:

   ```bash
   git revert <commit-hash>
   ```

2. **Restore from Backup**:
   - Keep a backup of original assets in `assets/backup/t3-original/`
   - Copy back if needed

3. **Incremental Rollback**:
   - Revert specific files rather than entire commit
   - Fix issues and re-apply changes

### Backup Strategy

**Before Starting**:

```bash
# Create backup branch
git checkout -b backup/pre-bigcode-rename

# Create asset backup
mkdir -p assets/backup/t3-original
cp -r apps/web/public/*.{png,ico} assets/backup/t3-original/
cp -r apps/desktop/resources/icon.* assets/backup/t3-original/
cp -r assets/prod/*.{png,ico,svg} assets/backup/t3-original/
```

---

## Post-Rename Tasks

### Immediate (After Merge)

- [ ] Update GitHub repository description
- [ ] Update GitHub repository topics/tags
- [ ] Update any external documentation links
- [ ] Notify team members of the rename
- [ ] Update CI/CD pipeline names (if applicable)

### Short-term (Within 1 Week)

- [ ] Update social media profiles (if applicable)
- [ ] Update website/landing page
- [ ] Create announcement blog post/release notes
- [ ] Update any third-party integrations
- [ ] Search for external references and update

### Long-term (Future PRs)

- [ ] Rename package scope from `@t3tools` to `@bigcode`
- [ ] Rename internal metrics from `t3_*` to `bigcode_*`
- [ ] Consider renaming repository from `t3code` to `bigcode`
- [ ] Update any published npm packages
- [ ] Migrate any cloud resources (if named with "t3")

---

## Notes for Implementation

### Best Practices

1. **Commit Frequently**: Make small, focused commits for each phase
2. **Test After Each Phase**: Don't wait until the end to test
3. **Keep Backups**: Maintain backups of original assets
4. **Document Changes**: Update this document as you discover edge cases
5. **Communicate**: Keep team informed of progress

### Common Pitfalls

1. **Case Sensitivity**: "bigCode" vs "bigcode" vs "BigCode"
   - **Recommendation**: Use "bigCode" (camelCase) consistently
2. **Path References**: Don't rename paths like `/t3code/` in file systems
   - **Keep**: Repository paths, folder names
   - **Change**: User-facing strings only

3. **Package Names**: Changing `@t3tools` scope is a breaking change
   - **Recommendation**: Do this separately, with proper deprecation

4. **Icon Sizes**: Ensure icons look good at all sizes
   - **Test**: 16x16, 32x32, 48x48, 128x128, 256x256, 512x512, 1024x1024

### Time Estimates

- **Phase 1 (Critical)**: 30 minutes
- **Phase 2 (Docs)**: 1 hour
- **Phase 3 (UI)**: 1 hour
- **Phase 4 (Config)**: 30 minutes
- **Phase 5 (Assets)**: 2-3 hours (including design)
- **Phase 6 (Tests)**: 1 hour
- **Phase 7 (Packages)**: 2-3 hours (optional, separate PR)

**Total**: 3-4 hours (excluding package rename)

---

## Appendix: File List by Category

### Critical Branding (3 files)

1. `apps/web/src/branding.ts`
2. `apps/desktop/package.json`
3. `apps/web/index.html`

### Documentation (13 files)

1. `README.md`
2. `AGENTS.md`
3. `REMOTE.md`
4. `KEYBINDINGS.md`
5. `TODO.md`
6. `docs/constants-refactoring.md`
7. `docs/observability.md`
8. `docs/release.md`
9. `.docs/scripts.md`
10. `.docs/codex-prerequisites.md`
11. `CONTRIBUTING.md` (if exists)
12. `apps/marketing/src/lib/releases.ts`
13. Other markdown files in `docs/`

### UI Components (10+ files)

1. `apps/web/src/routes/__root.tsx`
2. `apps/web/src/main.tsx`
3. `apps/web/src/components/ChatView.browser.tsx`
4. `apps/web/src/components/settings/SettingsPanels.tsx`
5. `apps/web/src/components/desktopUpdate.logic.ts`
6. `apps/web/src/hooks/useSettings.ts`
7. `apps/web/src/uiStateStore.ts`
8. `apps/web/src/rpc/serverState.test.ts`
9. Other components with user-facing strings

### Configuration & Scripts (20+ files)

1. `turbo.json`
2. `scripts/dev-runner.ts`
3. `scripts/build-desktop-artifact.ts`
4. `scripts/release-smoke.ts`
5. `scripts/merge-mac-update-manifests.test.ts`
6. `scripts/mock-update-server.ts`
7. `apps/desktop/src/main.ts`
8. `apps/server/src/cli.ts`
9. `apps/server/src/cli-config.test.ts`
10. `apps/server/src/telemetry/Layers/AnalyticsService.ts`
11. `apps/server/src/telemetry/Layers/AnalyticsService.test.ts`
12. Other script and config files

### Test Files (50+ files)

- See "Testing & Validation" section for search commands
- Update user-facing strings in test fixtures
- Keep path references as-is

### Logo & Icon Assets (30+ files)

- See "Logo & Asset Requirements" section for complete list

---

**Document Version**: 1.0  
**Last Updated**: April 6, 2026  
**Author**: bigCode Team  
**Status**: Ready for Implementation
