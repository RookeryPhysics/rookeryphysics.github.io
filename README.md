# rookeryphysics.github.io
Web browser game engine.

## Jump Pads Feature
Enable in `Developer ▾` panel by checking `Jump Pads`. Once enabled and after picking up the gun:

- Desktop: Press `8` or click `Jump Pad(8)` mode button, then left-click a surface to spawn a green pressure plate.
- Mobile: (Currently dev options hidden; use desktop to enable or extend UI later.)

Behavior:
- Landing on a pad auto launches you (no need to press jump) with a strong upward boost.
- Pressing jump while already on a pad behaves like a normal jump; the pad will re-launch once you land again (cooldown ~0.35s).
- Pads can be destroyed by direct projectile hits (Shoot mode) or missile explosions.
- Pads are independent entities (not terrain blocks) and are cleared when regenerating the world (new seed or load).

## Notes
- Pads won't spawn inside the player volume.
- Noclip flying ignores pad launches.
- Double-jump is still available; pad launches have their own brief cooldown.
- Pads are destructible by projectiles and explosions.
