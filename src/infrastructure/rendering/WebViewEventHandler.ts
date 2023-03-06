import { WebViewError } from '@/infrastructure/rendering/WebViewError';
import type {
  ErrorEvent,
  LinkPressedEvent,
  WebViewEvent,
} from '@/infrastructure/rendering/WebViewEvent';

type Handlers = {
  handleLinkPressed?: (e: LinkPressedEvent) => void;
  handleError?: (e: ErrorEvent) => void;
};

class WebViewEventHandler {
  constructor(private handlers: Handlers) {}

  private handleEvent(e: WebViewEvent) {
    switch (e.type) {
      case 'linkpressed':
        this.handlers.handleLinkPressed?.(e);
        break;
      case 'error':
        if (!this.handlers.handleError)
          throw new WebViewError(e.data.name, e.data.message);
        this.handlers.handleError(e);
        break;
      default:
        break;
    }
  }

  handleMessage(json: string) {
    const event = JSON.parse(json) as WebViewEvent;
    this.handleEvent(event);
  }
}

export { WebViewEventHandler };
