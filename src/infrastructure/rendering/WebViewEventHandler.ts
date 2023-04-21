import { WebViewError } from '@/infrastructure/rendering/WebViewError';
import type {
  ErrorEvent,
  IndexPressedEvent,
  LinkPressedEvent,
  LogEvent,
  TableOfContentsPressedEvent,
  WebViewEvent,
} from '@/infrastructure/rendering/WebViewEvent';

type Handlers = {
  handleLinkPressed?: (e: LinkPressedEvent) => void;
  handleError?: (e: ErrorEvent) => void;
  handleIndexPressed?: (e: IndexPressedEvent) => void;
  handleTableOfContentsPressed?: (e: TableOfContentsPressedEvent) => void;
};

class WebViewEventHandler {
  constructor(private handlers: Handlers) {}

  private handleLinkPressed(e: LinkPressedEvent) {
    this.handlers.handleLinkPressed?.(e);
  }

  private handleError(e: ErrorEvent) {
    if (!this.handlers.handleError)
      throw new WebViewError(e.data.name, e.data.message);
    this.handlers.handleError(e);
  }

  private handleIndexPressed(e: IndexPressedEvent) {
    this.handlers.handleIndexPressed?.(e);
  }

  private handleTableOfContentsPressed(e: TableOfContentsPressedEvent) {
    this.handlers.handleTableOfContentsPressed?.(e);
  }

  private handleLog(e: LogEvent) {
    // eslint-disable-next-line no-console
    console.log(e.data.message);
  }

  private handleEvent(e: WebViewEvent) {
    switch (e.type) {
      case 'linkpressed':
        this.handleLinkPressed(e);
        break;
      case 'error':
        this.handleError(e);
        break;
      case 'indexpressed':
        this.handleIndexPressed(e);
        break;
      case 'tableofcontentspressed':
        this.handleTableOfContentsPressed(e);
        break;
      case 'log':
        this.handleLog(e);
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
