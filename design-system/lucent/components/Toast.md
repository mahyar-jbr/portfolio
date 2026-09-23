# Toast

A short confirmation in a clear glass capsule. It drops in from the top edge with a squash, stays for `dur-toast`, then floats up and fades. Tap to dismiss early.

**Call.** `Lucent.toast('Email copied')`, or declaratively `<button data-toast="Email copied" data-copy="me@example.com">Copy email</button>` (copies to the clipboard, then toasts). Options: `{ duration, icon: false }`. Announced politely to screen readers.

**Copy.** Past tense, two or three words: "Email copied", "Message sent". One toast at a time is the norm; they stack if needed.
**Don't** put actions or errors in a toast; errors belong next to the thing that failed.
