# Last Light at the Night Market · 夜市最後一盞燈

A short, bilingual Three.js puzzle. Aim two lamps across a Taiwanese food stall and help the vendor close. Drag the miniature to inspect the hanging menu. Tap the lamps or use the buttons. Focus the scene for keyboard orbit with the arrows and press R to restore the opening view.

Serve this folder with `python3 -m http.server 8000` and open http://localhost:8000. Runtime dependencies are included. No account, backend or network assets required.

## Diorama pilot

The scene uses the upstream orbit module and an adapted frozen-frame capture harness from [Diorama](https://github.com/sloemo01/diorama/tree/c790df5007be54cccb6c083f7743fae120c89cf4). Three.js and OrbitControls are r160. Both upstream MIT notices are in vendor/. Stall geometry, lettering, lighting and game logic are authored for this pilot.

The two lamp positions and elapsed time since solving identify a reproducible frame. Lighting checks use actual cone angles and ray intersections with the hanging menu. The browser checks exercise the nine configurations, keyboard orbit and reset, completing and reopening the stall, language switching, and rendering the same closing frame after jumping backward in time. The capture harness records the blocked, closing and closed states at three viewport sizes.

For a local QA run, serve the game on port 4180, install playwright-core 1.56.1, and set CHROME_PATH to a Chromium executable. Run node qa/play.mjs and then SHOTS='-1:blocked,1.5:cloth,3:closed' node qa/shoot.mjs. The pull request workflow runs these steps and retains its screenshots as an artifact.
