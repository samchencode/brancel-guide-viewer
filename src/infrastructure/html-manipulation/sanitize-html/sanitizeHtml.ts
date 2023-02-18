import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';
import { sanitizeHtml as sanitize } from '@/vendor/sanitizeHtml';

export const sanitizeHtml: SanitizeHtml = sanitize;
