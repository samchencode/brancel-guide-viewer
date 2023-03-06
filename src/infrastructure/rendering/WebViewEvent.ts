export type LinkPressedEvent = {
  type: 'linkpressed';
  data: {
    href: string;
  };
};

export type IndexPressedEvent = {
  type: 'indexpressed';
  data: Record<string, never>;
};

export type TableOfContentsPressedEvent = {
  type: 'tableofcontentspressed';
  data: Record<string, never>;
};

export type ErrorEvent = {
  type: 'error';
  data: {
    name: string;
    message: string;
  };
};

export type WebViewEvent =
  | LinkPressedEvent
  | ErrorEvent
  | IndexPressedEvent
  | TableOfContentsPressedEvent;
