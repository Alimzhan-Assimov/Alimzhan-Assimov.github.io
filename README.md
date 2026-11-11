# The Workshop — manga portfolio

A portfolio that looks like a manga volume. Tap the cover, flip through the chapters: one project per spread.
The longer a repo goes without a push, the dustier its page gets:

| days since last push | level | what you see |
|---|---|---|
| 0–7 | shining | glow, sparkles, animations at full speed |
| 8–30 | fresh | clean page |
| 31–90 | dusty | sepia, dust motes, smudges, animations slowed |
| 91–180 | cobwebs | corner cobwebs, more sepia |
| 181+ | forgotten | grey, frozen animation, spider, cracks, Zzz |

Each project gets a little hand-drawn animated scene (`js/scenes.js`): bridge-to-the-moon has a robot
walking girders out towards the Moon, project-lazy a sprout growing through a day-night cycle,
readtrack a book that keeps turning its pages. Unknown repos fall back to a controller, phone or terminal.

## Update the data

```sh
./tools/sync-projects.sh   # needs gh (logged in) + jq → writes data/projects.json
```

Private repos are included because the script uses your `gh` login. `data/extras.json` holds the
hand-written bits per repo: title, tagline, blurb, SFX word, scene type, screenshot, tags, `hidden`.

## Run locally

```sh
python3 -m http.server 8000     # then open http://localhost:8000
```

## Tricks

- `?today=2027-06-01` previews how the book will have aged by that date.
- Press **T** while the book is open for the time-machine slider.
- Arrow keys, Home/End, swipe on touch.

## Deploy

It is plain static files: push to GitHub and enable Pages (root), or drop the folder on any host.
Re-run the sync script and push whenever you want the dust to be recalculated against fresh commit dates
(the dust itself is computed in the browser from `pushedAt`, so it keeps aging on its own without a redeploy).
