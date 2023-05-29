import type { GuideParser, GuideRepository } from '@/domain/models/Guide';
import { Guide } from '@/domain/models/Guide';
import type {
  GetImageUrisFromHtml,
  ReplaceImageUrisInHtml,
} from '@/domain/models/RichText';
import { WpApiError } from '@/infrastructure/persistence/wp-api/WpApiError';
import type { WpApiErrorResponse } from '@/infrastructure/persistence/wp-api/WpApiErrorResponse';
import type { WpApiModifiedGmtResponse } from '@/infrastructure/persistence/wp-api/WpApiModifiedGmtResponse';
import type { WpApiPageResponse } from '@/infrastructure/persistence/wp-api/WpApiPageResponse';

class WpApiGuideRepository implements GuideRepository {
  private lastUpdatedTimestamp?: Promise<Date>;

  private html?: Promise<string>;

  constructor(
    private fetch: (url: string) => Promise<Response>,
    private wpApiHostUrl: string,
    private wpApiPageId: string,
    private wpApiKey: string,
    private guideParser: GuideParser,
    private getImageUrisFromHtml: GetImageUrisFromHtml,
    private replaceImageUrisInHtml: ReplaceImageUrisInHtml
  ) {}

  async get(): Promise<Guide> {
    const html = await this.getHtml();
    return new Guide(html, this.guideParser);
  }

  async getLastUpdatedTimestampFromApi(): Promise<Date> {
    const url = `${this.wpApiHostUrl}/wp-json/wp/v2/pages/${this.wpApiPageId}?_fields=modified_gmt`;
    const response = await this.fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new WpApiError(response.status, data as WpApiErrorResponse);
    }
    const apiLastUpdatedResponse = data as WpApiModifiedGmtResponse;
    let isoString = apiLastUpdatedResponse.modified_gmt;
    if (isoString.slice(-1) !== 'Z') isoString += 'Z';
    return new Date(isoString);
  }

  async getLastUpdatedTimestamp(): Promise<Date> {
    if (this.lastUpdatedTimestamp) return this.lastUpdatedTimestamp;
    this.lastUpdatedTimestamp = this.getLastUpdatedTimestampFromApi();
    return this.lastUpdatedTimestamp;
  }

  private async getHtml() {
    if (this.html) return this.html;
    this.html = this.getHtmlFromApi();
    return this.html;
  }

  private async getFromApi() {
    const url = `${this.wpApiHostUrl}/wp-json/wp/v2/pages/${this.wpApiPageId}?password=${this.wpApiKey}`;
    const response = await this.fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new WpApiError(response.status, data as WpApiErrorResponse);
    }
    return data as WpApiPageResponse;
  }

  private async getHtmlFromApi() {
    const apiResponse = await this.getFromApi();
    const html = apiResponse.content.rendered;
    return this.addHostUrlToImages(html);
  }

  private isFullUrl(uri: string) {
    return !!uri.match(/^https?:\/\//);
  }

  private addHostUrlToImages(html: string) {
    const imageUris = this.getImageUrisFromHtml(html);
    const imageUrls = imageUris.map((uri) => {
      if (this.isFullUrl(uri)) return uri;
      const hasSlash = uri.slice(0, 1) === '/';
      if (hasSlash) return this.wpApiHostUrl + uri;
      // NOTE: if there is no leading slash, it should be appended to the path of the article rather than host url
      // Should never encounter that situation
      return `${this.wpApiHostUrl}/${uri}`;
    });

    const uriMap = imageUris.reduce(
      (ag, v, i) => ({ ...ag, [v]: imageUrls[i] }),
      {} as Record<string, string>
    );
    return this.replaceImageUrisInHtml(html, uriMap);
  }
}

export { WpApiGuideRepository };
