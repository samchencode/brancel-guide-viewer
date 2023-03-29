class RichText {
  constructor(public readonly html: string) {}

  toString() {
    return this.html;
  }
}

export { RichText };
