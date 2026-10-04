import { DEFAULT_SETTINGS } from '../shared/config';

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[MemeMeet] Extension installed/updated, reason:', details.reason);

  try {
    const existing = await chrome.storage.local.get('mememeet_settings');
    if (!existing || !existing.mememeet_settings) {
      await chrome.storage.local.set({ mememeet_settings: DEFAULT_SETTINGS });
      console.log('[MemeMeet] Default settings seeded in storage.');
    }
  } catch (err) {
    console.error('[MemeMeet] Failed to seed storage on install:', err);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'PONG' });
    return true;
  }
  return false;
});
