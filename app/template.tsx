/* Next remounts template.tsx on every navigation. The kit's page swap is
   Lucent.transition() (TransitionLink): a view transition where the old view
   fades out in dur-exit and the new one fades up 8px in dur-enter.

   This covers every route change that doesn't go through it — back/forward, a
   typed URL, a browser without view transitions — with the same arrival: fade
   up 8px in dur-enter. During a view transition html carries .lu-vt-page and
   this stays still, so the two never play at once. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="site-route">{children}</div>;
}
