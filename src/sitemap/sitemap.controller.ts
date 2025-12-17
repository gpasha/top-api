import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format, subDays } from 'date-fns';
import { TopPageService } from 'src/top-page/top-page.service';
import { Builder } from 'xml2js';
import { CATEGORY_URL } from './sitemap.constant';

@Controller('sitemap')
export class SitemapController {
  domain: string;

  constructor(
    private readonly topPageService: TopPageService,
    private readonly configService: ConfigService,
  ) {
    this.domain = this.configService.get('DOMAIN') ?? '';
  }

  @Get('xml')
  @Header('content-type', 'text/xml')
  async generateSiteMap() {
    const formatString = "yyyy-MM-dd'T'HH:mm:00.000xxx";
    const staticPages = [
      {
        loc: this.domain,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        loc: `${this.domain}/courses`,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'daily',
        priority: '1.0',
      },
    ];

    const dynamicPages = (await this.topPageService.findAll()) ?? [];

    const response = staticPages.concat(
      dynamicPages.map((page) => ({
        loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'weekly',
        priority: '0.7',
      })),
    );

    const builder = new Builder({
      xmldec: { version: '1.0', encoding: 'UTF-8' },
    });

    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'https://sitemaps.org/schemas/sitemap/0.9',
        },
        url: response,
      },
    });
  }
}
