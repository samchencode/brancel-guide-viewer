export type LinkPressedEvent = {
  type: 'linkpressed';
  data: {
    href: string;
  };
};

export type ErrorEvent = {
  type: 'error';
  data: {
    name: string;
    message: string;
  };
};

export type WebViewEvent = LinkPressedEvent | ErrorEvent;
