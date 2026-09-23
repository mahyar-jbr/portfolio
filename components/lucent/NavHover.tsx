'use client';

import { useEffect, type RefObject } from 'react';
import { loadLucent } from '@/lib/lucent';

/**
 * The nav answers the pointer: a soft accent-tint pill (the kit's hover fill)
 * under the item the pointer is on, the way iPadOS and visionOS highlight a
 * control. It rides the nav lens's own springs (spring-lens for position,
 * spring-lens-width for width) and stretches a little with speed, so moving
 * along the capsule it glides from item to item — a quieter twin of the lens.
 * It fades in on the item where the pointer lands (never travelling in from
 * somewhere else) and fades out once the pointer leaves the capsule.
 *
 * It sits under the kit's ink lens (styles/site.css), so on the current item the
 * lens simply covers it. It only ever goes to an item, never to the pointer's
 * position: a hover response, not the cursor-following highlight the kit leaves
 * out. Fine pointers only. With reduced motion the springs jump and the pill
 * only fades.
 */
const FINE = '(hover: hover) and (pointer: fine)';

export default function NavHover({ nav }: { nav: RefObject<HTMLElement | null> }) {
  useEffect(() => {
    const root = nav.current;
    if (!root) return;
    let cancelled = false;
    let unwire = () => {};

    loadLucent()
      .then((L) => {
        if (cancelled) return;
        const fine = matchMedia(FINE);
        const pill = document.createElement('span');
        pill.className = 'site-nav-hover';
        pill.setAttribute('aria-hidden', 'true');
        root.prepend(pill);

        let x = 0;
        let w = 0;
        let vel = 0;
        /* the run of items: past either end the spring's overshoot is squeezed
           into the last few pixels, so the pill eases to a stop short of the
           capsule's rounded ends rather than swinging out past them or hitting
           a wall */
        let lo = 0;
        let hi = 0;
        const EDGE = 2;
        const give = (d: number) => EDGE * (1 - Math.exp(-d / EDGE));
        function paint() {
          /* the kit lens's stretch (lens() in bundle.js), at a quarter strength:
             enough to read as moving, without a pulse at every item it passes */
          const s = Math.min(Math.abs(vel) / 2600, 0.28) / 4;
          let left = x;
          if (x < lo) left = lo - give(lo - x);
          else if (x + w > hi) left = hi - w + give(x + w - hi);
          const sx = (1 + s * 0.35).toFixed(3);
          const sy = (1 - s).toFixed(3);
          pill.style.transform = `translateX(${left.toFixed(2)}px) scale(${sx}, ${sy})`;
          pill.style.width = `${Math.max(w, 0).toFixed(2)}px`;
        }
        const xs = L.spring(0, 'lens', (v, speed) => {
          x = v;
          vel = speed;
          paint();
        });
        const ws = L.spring(0, 'lens-width', (v) => {
          w = v;
          paint();
        });

        /* the item the pill is drawn on, kept while it fades out */
        let on: HTMLElement | null = null;
        let shown = false;
        let point: { x: number; y: number } | null = null;

        /* measured fresh every time, as the kit's lens does: compacting and the
           name coming or going both move the items */
        function place(item: HTMLElement, instant: boolean) {
          const cr = root!.getBoundingClientRect();
          const box = (el: Element) => {
            const r = el.getBoundingClientRect();
            return { x: r.left - cr.left - root!.clientLeft, w: r.width };
          };
          const items = root!.querySelectorAll('.lu-nav-item');
          const first = box(items[0]);
          const last = box(items[items.length - 1]);
          lo = first.x;
          hi = last.x + last.w;
          const m = box(item);
          on = item;
          xs.to(m.x, instant);
          ws.to(m.w, instant);
        }
        function show(item: HTMLElement, instant = false) {
          /* It fades in where the pointer lands instead of travelling in from
             somewhere else. Back before it has faded out, though, it glides on
             from where it still shows rather than jumping while half visible. */
          const appearing = !shown && +getComputedStyle(pill).opacity < 0.05;
          shown = true;
          place(item, instant || appearing);
          pill.classList.add('is-shown');
        }
        function hide() {
          shown = false;
          pill.classList.remove('is-shown');
        }

        /* On an item: go there. On the name: step aside. On the gaps and the
           capsule's rim: stay put, so crossing a gap reads as one glide. */
        function track(target: Element | null) {
          const item = target?.closest<HTMLElement>('.lu-nav-item');
          if (item) {
            if (!shown || item !== on) show(item);
          } else if (target?.closest('.lu-nav-brand')) {
            hide();
          }
        }
        const onPointer = (e: PointerEvent) => {
          if (e.pointerType === 'touch' || !fine.matches) return;
          point = { x: e.clientX, y: e.clientY };
          track(e.target instanceof Element ? e.target : null);
        };
        const onLeave = () => {
          point = null;
          hide();
        };
        const onFine = () => {
          if (!fine.matches) onLeave();
        };

        /* The capsule tightens while scrolling and the name opens in it, with the
           pointer resting where it was: look again at what is under it. Shown or
           still fading out, the pill keeps to its item as the items move. */
        const ro = new ResizeObserver(() => {
          if (!on) return;
          if (shown && point) {
            const under = document.elementFromPoint(point.x, point.y);
            const item = under?.closest<HTMLElement>('.lu-nav-item');
            if (item && root.contains(item)) on = item;
            else if (!under || !root.contains(under) || under.closest('.lu-nav-brand')) hide();
          }
          place(on, true);
        });

        root.addEventListener('pointerover', onPointer);
        root.addEventListener('pointermove', onPointer);
        root.addEventListener('pointerleave', onLeave);
        fine.addEventListener('change', onFine);
        ro.observe(root);

        unwire = () => {
          root.removeEventListener('pointerover', onPointer);
          root.removeEventListener('pointermove', onPointer);
          root.removeEventListener('pointerleave', onLeave);
          fine.removeEventListener('change', onFine);
          ro.disconnect();
          /* stop a glide in flight */
          xs.to(x, true);
          ws.to(w, true);
          pill.remove();
        };
      })
      .catch(() => {
        /* no runtime: the nav works as before, just without the hover pill */
      });

    return () => {
      cancelled = true;
      unwire();
    };
  }, [nav]);

  return null;
}
