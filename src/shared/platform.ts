export const isMac =
  typeof navigator !== 'undefined' &&
  (/Mac|iPhone|iPod|iPad/i.test(navigator.platform || '') ||
    /Macintosh|Mac OS X/i.test(navigator.userAgent || ''));

export const getToggleShortcutText = (): string => {
  return isMac ? '⌥⇧M' : 'Alt+M';
};

export const getToggleShortcutFullLabel = (): string => {
  return isMac ? '⌥⇧M (Option+Shift+M)' : 'Alt+M';
};

export const isToggleShortcutPressed = (e: KeyboardEvent): boolean => {
  const isKeyM = e.code === 'KeyM' || e.key.toLowerCase() === 'm' || e.key === 'µ';
  if (!isKeyM) return false;

  if (isMac) {
    // On Mac: Option+Shift+M, Option+M (catches 'µ' and KeyM), Ctrl+Shift+M, or Cmd+Shift+M
    // Explicitly avoids plain Cmd+M without shift which minimizes macOS browser windows
    const optionShiftM = e.altKey && e.shiftKey;
    const optionM = e.altKey && !e.metaKey && !e.ctrlKey;
    const ctrlShiftM = e.ctrlKey && e.shiftKey;
    const cmdShiftM = e.metaKey && e.shiftKey;
    return Boolean(optionShiftM || optionM || ctrlShiftM || cmdShiftM);
  }

  // Windows / Linux: Alt+M, Alt+Shift+M, or Ctrl+Shift+M
  return Boolean(e.altKey || (e.ctrlKey && e.shiftKey));
};
