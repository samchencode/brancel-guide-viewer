import sanitizeHtml from 'sanitize-html';

function customSanitizeHtml(dirtyHtml: string) {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [],
  });
}

export { customSanitizeHtml as sanitizeHtml };
