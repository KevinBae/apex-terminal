---
name: Vite Build and Review
description: A skill to run 'npm run build' in a Vite-based (React/HTML) project and review the results for correctness.
---

# Vite Build and Review Skill

This skill allows the agent to verify the integrity and correctness of changes by running the production build process. It focuses on ensuring that the build completes successfully and that the output artifacts match expectations.

## Prerequisites
- The project must use **Vite** as its build tool (HTML, React, etc.).
- A `package.json` with a `build` script (e.g., `"build": "vite build"`) must be present in the root directory.
- `npm` or `yarn` installed.

## Execution Steps

### 1. Execute Build
Run the build command from the project root:
```powershell
npm run build
```

### 2. Analyze Output
- **Build Status**: Check if the command exited with code 0.
- **Error Logs**: If the build failed, review the console output meticulously. Look for:
    - **Syntax Errors**: Incorrect JS/JSX/TSX syntax.
    - **Import Errors**: Missing dependencies or incorrect paths.
    - **Linting/Types**: If `eslint` or `tsc` are part of the build, check for violations.
- **Warnings**: Review warnings (e.g., "Circular dependency", "Large chunks") that might indicate architectural issues.

### 3. Verify Build Artifacts
Inspect the `dist/` directory to confirm the build produced the expected files:
- `index.html` (entry point)
- `assets/` (JS/CSS/Images/Fonts)
- Check that the generated `index.html` correctly references the hashed JS/CSS files.

### 4. Logic Review
Beyond the build success, review the specific changes made in the code:
- Compare the logic changes against the user requirements.
- Ensure that the build doesn't just "pass" but also incorporates the intended features.

## Success Criteria
- [ ] Build completes without errors (Exit Code 0).
- [ ] Dist folder populated with valid assets.
- [ ] No critical console warnings.
- [ ] Code changes are logically consistent with build output.

## Troubleshooting
- **"NPM script not found"**: Verify the project structure and `package.json`.
- **"Module not found"**: Run `npm install` and verify the import paths.
- **"Typescript errors"**: If using TS, the build might fail on type mismatch. Review the `.ts`/`.tsx` files.
