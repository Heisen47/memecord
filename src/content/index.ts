import { OverlayController } from './overlay-controller';

declare global {
  interface Window {
    __MEMECORD_INITIALIZED__?: boolean;
    __MEMECORD_CONTROLLER__?: OverlayController;
  }
}

function initialize() {
  if (window.__MEMECORD_INITIALIZED__) {
    return;
  }

  window.__MEMECORD_INITIALIZED__ = true;
  const controller = new OverlayController();
  window.__MEMECORD_CONTROLLER__ = controller;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      controller.init();
    });
  } else {
    controller.init();
  }
}

initialize();
