class RichText {
  constructor(
    private readonly sanitizeHtml: (html: string) => string,
    public readonly html: string
  ) {}

  getText() {
    return this.sanitizeHtml(this.html);
  }

  toString() {
    return this.html;
  }
}

export { RichText };
