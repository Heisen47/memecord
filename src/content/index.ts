import { MeetController } from './meet-controller';

declare global {
  interface Window {
    __MEMEMEET_INITIALIZED__?: boolean;
    __MEMEMEET_CONTROLLER__?: MeetController;
  }
}

function initialize() {
  if (window.__MEMEMEET_INITIALIZED__) {
    console.log('[MemeMeet] Content script already initialized, skipping duplicate.');
    return;
  }

  window.__MEMEMEET_INITIALIZED__ = true;
  const controller = new MeetController();
  window.__MEMEMEET_CONTROLLER__ = controller;

  // Initialize once document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      controller.init();
    });
  } else {
    controller.init();
  }
}

initialize();
