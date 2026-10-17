# UNSENT.EXE — Planning Document

> This file is the source of truth for the project plan, approved wording, decisions, and todo list. Keep locked copy unchanged unless a decision is explicitly updated in the decision log.

## 1. Project goal

Build a tiny, playful, subtly romantic pixel-art game website for someone the creator has liked since Grade 7. The experience should feel personal, funny, artsy, lightly flustering, and never pressuring.

The site should feel like a small secret game made specifically for her, while avoiding a conventional password form.

## 2. Access concept

The opening flow is a playful identity check with three multiple-choice questions. Answers never block access. If she answers anything incorrectly, the site shows a playful message suggesting that she is messing with the game, then lets her continue normally. After the questions, the site asks her to choose her own nickname.

Because wrong answers still allow access, this is recognition theater rather than real authentication. If the site must be private, use a separate server-side invite/session gate; the quiz itself is not security.

## 3. Identity check — approved copy

### Question 1 — placeholder

This remains intentionally undecided until a private shared-memory or inside-joke question is chosen.

**Question:** [FIRST QUESTION PLACEHOLDER]

- Correct answer: [CORRECT ANSWER PLACEHOLDER]
- Other choices: [WRONG CHOICE 1], [WRONG CHOICE 2], [WRONG CHOICE 3]

Do not use her initial unless there is a strong creative reason to do so. An initial is too easy to guess and feels less personal than a shared reference.

### Question 2 — locked wording

**How tall is the suspiciously adorable guest?**  
Correct: 5'2"  
Other choices: 5'20", one medium tree, approximately three cats.

### Question 3 — locked wording

**Can a capybara draw?**  
Correct: **Yes, he can!**  
Other choices: Only on weekends, no but he can judge your art, absolutely not because of paws.

### Wrong-answer notification — draft

Wrong answers should never block or restart the experience:`r`n`r`n> **NICE TRY**  `r`n> You are messing with me, aren't you?  `r`n> Fine. You may continue anyway.`r`n`r`nAfter showing this message, continue to the next question. Do not reveal a failure state.`r`n`r`n### Completion notification — draft`r`n`r`nContinue here regardless of the answer combination:

> **IDENTITY CONFIRMED**  
> You are, statistically and emotionally, the intended person for this game.  
> Welcome back.

### Nickname step — draft

> Before we continue, what should we call you in this very official transmission?

- She chooses the nickname herself.
- Nickname input is optional.
- If skipped, use “you” instead of a placeholder.
- Store it only in the active game session where possible.

## 4. Locked creative rules

- Keep the tone romantic but understated.
- Keep the experience funny, artsy, flirty, and slightly flustering.
- Do not pressure her to reciprocate.
- Do not ask “do you like me?”
- Do not use heart symbols in dialogue or UI text.
- Do not use a dramatic confession framing.
- Do not require a photo of her.
- Let the player choose her nickname.
- Keep approved dialogue exact once marked locked.

## 5. Proposed technology

### Core application

- Next.js with the App Router
- TypeScript
- React
- Tailwind CSS for layout and responsive styling
- CSS variables for the palette, spacing, borders, and pixel-art UI tokens

### Access and session

- Next.js Route Handlers or Server Actions for verification
- A signed, HTTP-only, secure session cookie
- Server-side validation of answers
- Protected game route that redirects unverified visitors to the identity check
- No plaintext password storage because this flow is intentionally a personal recognition game, not a user-account system

### Content and state

- TypeScript data files for dialogue and scene definitions
- React state for current scene, selected answer, nickname, visited objects, envelope state, and music state
- Server session for verification and nickname persistence during the visit
- No database for the first version unless persistent progress or multiple invitees becomes necessary

### Visuals and audio

- Pixel font for headings and system labels
- Readable sans-serif font for body copy
- Public-domain or permissively licensed pixel-art assets with license records
- Hand-authored doodles and palette adjustments for a cohesive look
- Supplied local MP3s in `public/assets/audio/` with browser-autoplay fallback behavior
- No unlicensed uploaded copyrighted audio

### Quality and delivery

- Responsive mobile and desktop layout
- Keyboard accessibility
- Large touch targets
- Reduced-motion support
- Loading, error, and fallback states
- Metadata and social preview image
- Deployment target to confirm later, likely Vercel if compatible with the final server-side session approach

## 6. Proposed project structure

```text
app/
  layout.tsx
  page.tsx                         # identity check
  game/page.tsx                    # protected game route
  api/verify/route.ts              # answer validation
  api/session/route.ts             # optional session status/logout
  globals.css
components/
  access/IdentityCheck.tsx
  access/NicknamePrompt.tsx
  game/GameShell.tsx
  game/SceneRenderer.tsx
  game/DialogueBox.tsx
  game/PixelCat.tsx
  game/ChoicePanel.tsx
  game/MusicPlayer.tsx
  game/MemoryPath.tsx
  game/SecretEnvelope.tsx
data/
  verification.ts
  dialogue.ts
  scenes.ts
lib/
  auth.ts
  session.ts
public/assets/
  sprites/
  backgrounds/
  doodles/
  audio/
```

## 7. Scene plan

1. **Boot Screen** — terminal-style opening, pixel cat, and `START GAME`.
2. **Flirting Simulator** — three funny choices with no dead ends.
3. **Old Save File** — earlier years and current reconnection memories, kept intentionally understated.
4. **Music and Doodle Room** — cozy bedroom, sketchbook, headphones, doodles, Japanese encouragement note, and user-controlled music.
5. **Unsent Message** — moonlit sky, envelope reveal, sincere message, and secret-keeping cat reaction.
6. **Final Screen** — exact ending wording and `PLAY AGAIN`.

## 8. What to confirm before implementation

### Required creative decisions

- [ ] Final Question 1 wording, correct answer, and three wrong answers.
- [x] Do not mention the hand-holding memory; keep the old-save-file scene general unless a better shared reference is provided.
- [ ] Final wording for the identity confirmation.
- [ ] Final wording for the nickname prompt.
- [ ] Whether the nickname can be changed later from a small settings button.
- [x] Make the game replayable from the final screen; nickname selection remains an opening-only action.

### Required privacy decisions

- [ ] Which three answers are safe to use and unlikely to be guessed by others.
- [x] Treat the quiz as playful recognition, not actual private access.`r`n- [ ] Decide whether a separate private invite/session gate is needed.
- [ ] Session lifetime: one visit, several hours, or several days.
- [ ] Whether incorrect attempts should be rate-limited.
- [ ] Whether any personal text should be kept server-side instead of shipped to the browser.

### Required asset decisions

- [ ] CC0/public-domain only, or attribution-required licenses acceptable.
- [ ] Which sprite pack or artist will provide the base cat.
- [x] Use the two supplied MP3s locally in `public/assets/audio/`, with user-initiated playback and fallback states.
- [x] Confirm the supplied MP3s are cleared for use in this project.
- [ ] Whether the creator wants to draw the simple player portrait manually.

### Required deployment decisions

- [ ] Final hosting platform.
- [ ] Domain or private URL plan.
- [ ] Whether the repository will be public or private.
- [ ] Whether environment secrets are available for signing sessions.

## 9. Things to be careful about

- A client-side quiz alone does not protect the site. Keep verification on the server if privacy matters.
- Do not put the complete answer key in a public client bundle.
- Do not use highly sensitive facts as quiz answers. Use recognizable shared references instead.
- Avoid making wrong answers humiliating or making failure feel like rejection.
- Keep every answer button usable on a phone and with a keyboard.
- Do not autoplay music. Start audio only after a user action.
- Confirm the music source is authorized before publishing.
- Confirm the supplied MP3 files are authorized for the project before publishing it publicly.
- Let visitors choose a track or mute/unmute, but do not expose a play/pause control.
- Record every asset license and attribution requirement.
- Check that pixel fonts remain readable and that body text does not become too small.
- Support reduced motion and avoid relying on animation to communicate meaning.
- Test refreshes, direct `/game` visits, incorrect answers, skipped nickname, music failure, and replay.
- Avoid exposing private relationship details in page metadata or social previews.

## 10. Suggestions

- Make Question 1 a shared micro-memory or inside joke rather than an initial.
- Use multiple-choice cards with small cat reactions after every answer.
- Give incorrect answers funny retry messages instead of a red error state.
- Let the cat say something different after each correct answer to create anticipation.
- Make the nickname prompt feel like a character-creation moment, not an account form.
- Use one cohesive muted palette across all scenes and recolor public sprites to match it.
- Keep the first version small: identity check, nickname, six scenes, one envelope interaction, and optional music.
- [x] Add a simple “replay” path after the final scene rather than saving complex progress.

## 11. Milestones

### Milestone 0 — Planning

- [x] Create this planning document.
- [x] Define the playful identity-check concept.
- [x] Lock the exact wording for Questions 2 and 3.
- [x] Finalize Question 1: “Are you really the one he intended this for?” with Yes / No / Probably / Definitely not.
- [ ] Confirm privacy and deployment decisions.

### Milestone 1 — Access prototype

- [x] Build the boot/startup screen.
- [x] Build the identity-check screen.
- [x] Add server-side answer validation.
- [x] Add playful wrong-answer feedback without blocking access.
- [x] Continue to the next question after every answer.
- [x] Ensure wrong answers do not restart the game or reveal a failure state.
- [x] Add identity confirmation.
- [x] Add nickname selection.
- [x] Protect the `/game` route.

### Milestone 2 — Game shell

- [x] Build scene progression.
- [x] Add dialogue panels and progress indicator.
- [x] Add keyboard and touch interaction.
- [x] Add the boot screen and final screen.

### Milestone 3 — Scenes and interactions

- [x] Build Flirting Simulator choices.
- [x] Build Old Save File.
- [x] Build Music and Doodle Room.
- [x] Build Unsent Message envelope reveal.
- [x] Insert the chosen nickname safely.

### Milestone 4 — Art, audio, and polish

- [ ] Add licensed sprites and backgrounds.
- [x] Add doodles and scene-specific details.
- [x] Add the supplied local MP3 tracks with loading/progress feedback and fallback states.
- [x] Add all supplied local tracks to the music selector, start fresh playthroughs on `Still With You`, and loop the selected track until the player switches songs.
- [x] Add reduced-motion behavior.
- [ ] Add metadata and deployment configuration.

### Milestone 5 — Verification

- [ ] Test every scene and branch.
- [ ] Test mobile and desktop layouts.
- [ ] Test keyboard navigation and screen-reader labels.
- [ ] Test protected-route behavior.
- [ ] Test music loading and failure states.
- [ ] Review all copy against this document before release.

## 12. Decision log

| Date | Decision |
|---|---|
| 2026-10-16 | Use a playful identity-check flow instead of a conventional password login. |
| 2026-10-16 | Let her choose the nickname herself. |
| 2026-10-16 | Lock Question 2 exactly as written. |
| 2026-10-16 | Lock Question 3 exactly as written, including `Yes, he can!`. |
| 2026-10-16 | Keep Question 1 as a placeholder until a better private shared-memory or inside-joke question is chosen. |
| 2026-10-16 | Wrong answers show a playful “you are messing with me” reaction but never block access. |`r`n| 2026-10-16 | The quiz is recognition theater, not authentication. |`r`n| 2026-10-16 | Plan first; do not start implementation until the creative and privacy decisions are confirmed. |
| 2026-10-16 | Keep the supplied MP3s local in `public/assets/audio/`; do not depend on a free third-party upload service. |

## 13. Requested improvement plan — 2026-10-17

This section records the next implementation pass requested by the creator. Do not mark an item complete until it has been implemented and tested in the browser.

### Phase A — Copy and interaction timing

- [x] Animate the startup terminal logs sequentially with persistent dots, keep the terminal box fixed-size, and reveal the complete error line with a subtle flash.
- [x] Replace the boot error copy with `ERROR 500: INTERNAL SERVER ERROR`.
- [x] Defer correct-answer feedback until the player clicks the question-step continuation button.
- [x] Defer wrong-answer feedback and use `NICE TRY — the cat has recorded your suspicious behavior. You may continue anyway.`.
- [x] Change Scene 02 title to `What does he do when your name appears on his screen?`
- [x] In Scene 02, selecting an option only stores/highlights the choice. Show its unique reaction only after the player clicks `CONTINUE`.
- [x] Give each Scene 02 choice a different funny reaction rather than reusing `The cat says: excellent. no notes.`.
- [x] Hide the Scene 02 reaction again when the player changes answers; show the new reaction only after the next `CONTINUE` click.

### Phase B — Old Save File level selection

- [x] Replace the current Scene 03 subtitle with `The save file is a little emotionally disorganized.`.
- [x] Replace the old Scene 03 level-header line with `Choose a memory to load. The archive is being weirdly specific.` and add balanced horizontal padding to the level rows.
- [x] Add a short, gentle save-loading sequence before applying a selected level, followed by a warm confirmation note.
- [x] Turn Level 07 into a 3×3 tap-to-sequence word puzzle with numbered active labels, removable selections, a Give Up action, and a full animated reveal after the correct order.
- [x] Add a concise Level 07 guide explaining that the word blocks should be tapped in sentence order and can be deselected.
- [x] Split the requested Level 07 wording into nine sentence fragments and keep the active-color treatment consistent.
- [x] Randomize the nine Level 07 tiles per attempt while keeping their answer order separate from their visual positions, with equal square sizing.
- [x] Turn Level 10 into a cat-rubbing interaction with a ten-second progress meter that decays when rubbing stops, followed by its own animated reveal.
- [x] Add a gentle cat shake and soft floating hearts while movement is advancing the Level 10 progress.
- [x] Replace the hand emoji with a cat interaction.
- [x] Turn the Secret Level into a ten-second waiting interaction with an `I'VE WAITED ENOUGH` gate and its own animated reveal.
- [x] Keep the wait button available from the start; early clicks close without clearing the level, while completed progress unlocks the reveal.
- [x] Add a half-speed preparation pause between 60% and 80% with a playful trouble message before the progress resumes.
- [x] Temporarily keep save-level completion and selection state in memory only while the mini-games are being tested; refresh resets them.
- [x] Make Level 07, Level 10, and the current save-file cards clickable while preserving their current visual style.
- [x] Add hover/focus states and keyboard-accessible modal triggers for all three cards.
- [x] Level 07 modal implies that interest was already present, but keeps it understated rather than explicitly confessing.
- [x] Level 10 modal references the first hand-holding memory as the moment the feeling became certain.
- [x] The current save-file modal makes the elapsed time funny, including the idea that it took about six years in total.
- [x] Each modal gets a `LOAD THIS LEVEL` action.
- [x] Loading a level closes the modal, highlights the selected card, and renames that selected card `CURRENT SAVE FILE`.
- [x] The original third card is labeled `SECRET LEVEL` so only the selected card receives the current-save label.
- [x] Persist completed Level 07, Level 10, and Secret Level progress locally for production, while keeping the active mini-game state temporary.

### Phase C — Music and Doodle Room interactions

- [x] Make the sketchbook card clickable and open a modal drawing canvas.
- [x] Provide a usable drawing surface with pointer, touch, and mouse input.
- [x] Include a clear/reset action and a finish/save action.
- [x] When finished, export the drawing as an image using the exact paper background and palette of the in-game sketchbook presentation.
- [x] Make the exported drawing downloadable on phones and laptops.
- [ ] Decide whether a creator-only copy should be uploaded. If enabled, add a server endpoint and private storage configuration; never expose a public gallery or the creator’s secret endpoint in the client.
- [ ] Track the player’s saved drawing event and drawing metadata per playthrough only if the creator configures private storage and accepts the privacy implications.
- [x] Remove the duplicate rectangular lucky-note text from Scene 04; keep only the three room items.
- [x] Make the lucky-note card clickable and open a styled modal containing the note.
- [x] Add a `KEEP IT` button that exports the note with its visual style, angle, and a white background.
- [x] Rename Scene 04 modal labels to `SPECIAL OBJECT` for a softer, less technical presentation.
- [x] Add an eraser, palette-matched ink colors, and brush-size choices to the sketchbook.
- [x] Keep the eraser thickness synchronized with the selected brush size, default to size 2, and include brown, matte green, and white ink.
- [x] Replace the browser-default music selector appearance with a palette-matched styled select/control while preserving keyboard usability.
- [x] Add the same lift-and-shadow hover animation to the music player card as the other Scene 04 cards.
- [x] Normalize all three Scene 04 card hover states to the same four-pixel lift while preserving their decorative offsets and rotations.
- [x] Give the sketchbook color palette its own row on narrow screens so it does not crowd the size controls.
- [x] Normalize the eraser, color, and size controls to a shared 22px control baseline for consistent alignment.
- [x] On mobile, align INK and SIZE as matching rows with labels and controls in consistent columns, keeping the color palette inside its own compact rectangular control.
- [x] Make the expanded color palette wrap naturally on mobile instead of forcing a fixed column count.
- [x] Add bounded undo/redo history for strokes, erasing, and clearing, and preserve the in-memory drawing when the modal closes and reopens.
- [x] Keep the fixed modal overlay behavior and make only the sketchbook modal internally scrollable below 640px viewport width.
- [x] Refine sketchbook control spacing, equalize action-button sizing, and stack the primary actions cleanly on small screens.
- [x] Loop the selected track continuously instead of stopping at the end.
- [x] Keep the music duration/progress bar visible after switching tracks and while the loop continues.
- [x] Keep the Scene 03 Continue action locked until all three save-file levels are cleared.
- [x] Make the Secret Level waiting game take 15 seconds, including its slowed 60–80% segment.

### Phase D — Envelope reveal

- [x] Remove the duplicate message text outside the envelope; keep the message inside the envelope only.
- [x] Make the envelope card itself clickable and equivalent to the `OPEN ENVELOPE` button.
- [x] Add hover/focus feedback to the envelope card.
- [x] Animate the envelope opening slowly and elegantly in place, keeping the scene layout stable instead of shifting the surrounding content.
- [x] Replace the envelope-opening scene button with a `SKIP FOR YOUR SANITY` action; only clicking the envelope opens it.
- [x] Preserve the envelope's initial size and reveal the full letter normally when it is opened.

### Phase E — Nickname tease and identity confirmation

- [x] Keep the nickname field empty on page load and add a dice button that randomly types `Nway Nway`, `Julia`, or `Capi`.
- [x] Animate existing letters away before typing the randomized name.
- [x] Lock the input, dice, and continuation button during the random-name animation.
- [x] Mark an empty submit with a red input border only; do not show a warning or trigger the randomizer from `OPEN THE FILE`.
- [x] Keep the dice control visually stable with a centered custom pixel die: cycle faces during the roll, use perspective X/Y/Z tumble and bounce on the die glyph, settle on a final face, fade the placeholder in after a short empty-field delay, and show a one-time hydration/loading screen before restoring local state on reload.
- [x] Keep normal hover still and 2D; preserve the real 3D cube only while an active roll is in progress. Name mapping: faces 1–2 Nway Nway, 3–4 Julia, 5–6 Capi.
- [x] Run the dice motion for a fixed 1-second duration, choose the random final face first, then stop on that physical face and use its simple mapped name; keep controls locked until both are complete.
- [x] Keep the dice dots stable during the roll so they do not flash with each typed character; change to the chosen final face only when the roll settles. Mapping: faces 1–2 Nway Nway, 3–4 Julia, 5–6 Capi.
- [x] Remove helper, tease, and warning messages from the nickname stage.
- [x] Require the nickname stage action before allowing `OPEN THE FILE` to continue.
- [x] Reject empty, whitespace-only, and untouched autofill nickname values while allowing Burmese and Japanese names.
- [x] For a wrong answer to Question 1, show only the self-identified-capybara reassurance in the identity-confirmed stage.
- [x] Preserve the existing nickname choice for the current playthrough and do not add an in-game nickname editor.

### Phase F — Local persistence and creator unlock

- [x] Persist the current mode/stage, question index, selected answers, nickname, scene index, simulator choice, envelope-open state, music track, mute state, selected save level, and completed save levels in local storage.
- [x] Restore the saved state after reload and return the player to the correct stage.
- [x] Keep creator-facing personal data out of public metadata and social previews.
- [x] Lock the `PLAY AGAIN` button by default.
- [x] When the locked button is clicked, show a joke explaining that replay requires talking to the person who made the website every day, while making clear that it is a joke.
- [x] Add a creator-controlled `UNSENT_REPLAY_UNLOCK` environment variable/configuration so the creator can enable replay without editing the interaction logic.
- [x] Use a server-side replay unlock endpoint; local progress remains local and the unlock is not stored as a client-controlled permission.
- [x] Route an unlocked `PLAY AGAIN` action through the existing loading screen before returning to the first page.

### Phase G — Verification

- [ ] Test all copy and timing changes for correct and wrong answer paths.
- [ ] Test all three save-file modals, level loading, highlighting, and reload restoration.
- [ ] Test canvas drawing with mouse, touch, mobile layout, export, and download.
- [ ] Test lucky-note export and envelope animation.
- [ ] Test local-storage restoration after reload at every major stage.
- [ ] Test locked replay behavior and the creator unlock configuration.
- [ ] Test keyboard navigation, focus visibility, modal close behavior, and reduced-motion behavior.
- [ ] Test music looping, selector styling, and failed-audio fallback.

### Decisions needed before implementation

- [x] Use `ERROR 500: INTERNAL SERVER ERROR` consistently.
- [x] Keep drawings download-only on the player’s device; do not upload them.
- [x] Save progress locally with no remote playthrough tracking. When creator replay is unlocked and used, clear the saved local playthrough data.
- [x] Allow the Level 10 modal to directly mention the hand-holding memory.
- [x] Use a server-side environment variable to control the locked `PLAY AGAIN` unlock.

### Approved implementation decisions

- [x] Use `UNSENT_REPLAY_UNLOCK` as the creator-controlled environment variable. Missing or false values keep replay locked; an explicit true value unlocks it.
- [x] Read the unlock setting server-side so the client never exposes the creator control as ordinary UI state.
- [x] Keep the local-storage cleanup tied to a successful unlocked replay action.
- [ ] Confirm the hosting provider’s environment-variable refresh behavior. Most providers require a restart or redeploy before a changed variable reaches the running server, even when no code changes are needed.


