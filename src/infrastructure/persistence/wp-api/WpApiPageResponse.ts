export type WpApiPageResponse = {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish';
  type: 'page';
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: false;
  };
  excerpt: {
    rendered: string;
    protected: false;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: 'closed' | 'open';
  ping_status: 'open';
  template: '';
  meta: never;
  _links: never;
};
