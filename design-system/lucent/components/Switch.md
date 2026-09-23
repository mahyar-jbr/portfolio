# Switch

On/off control whose knob stretches as it slides and swells while you hold it, then settles with a small wobble.

**Markup.** `<label class="lu-switch-row"><button class="lu-switch" role="switch" aria-checked="false" aria-label="Dark mode"></button>Dark mode</label>`. `Lucent.auto()` adds the knob and listens for clicks; it fires a `change` event with `detail.checked`.

**Theme toggle.** Call `Lucent.setTheme('dark' | 'light')` in the change handler: the page cross-fades to the new theme in about 320ms (instant where unsupported or with reduced motion).

**Do** give it a visible label or `aria-label`. Track is `control-off` when off and `accent` when on; knob is always white.
**Don't** use a switch for choices that need a Save button; use it for settings that apply immediately.
