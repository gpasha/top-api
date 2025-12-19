import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  // Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import {
  // CRON_NAME,
  NOT_FOUND_PAGE_ERROR,
} from './top-page.constants';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { HhService } from 'src/hh/hh.service';
import {
  // Cron, CronExpression,
  SchedulerRegistry,
} from '@nestjs/schedule';

@Controller('top-page')
export class TopPageController {
  constructor(
    private readonly topPageService: TopPageService,
    private readonly hhSevice: HhService,
    private readonly scheduleRegistry: SchedulerRegistry,
  ) {}

  @UseGuards(JWTGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.createPage(dto);
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id);

    if (!page) {
      throw new NotFoundException(NOT_FOUND_PAGE_ERROR);
    }

    return page;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias);

    if (!page) {
      throw new NotFoundException(NOT_FOUND_PAGE_ERROR);
    }

    return page;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto);
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.topPageService.findByText(text);
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.deleteById(id);

    if (!page) {
      throw new NotFoundException(NOT_FOUND_PAGE_ERROR);
    }

    return page;
  }

  @UseGuards(JWTGuard)
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const page = await this.topPageService.updateById(id, dto);

    if (!page) {
      throw new NotFoundException(NOT_FOUND_PAGE_ERROR);
    }

    return page;
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: CRON_NAME })
  @Post('test')
  async test() {
    // Logger.log('Cron!');
    // const job = this.scheduleRegistry.getCronJob(CRON_NAME);
    const data = await this.topPageService.findForHhUpdate(new Date());

    for (const page of data) {
      const hhData = await this.hhSevice.getData(page.category);
      page.hh = hhData;
      await this.topPageService.updateById(page._id, page);
    }
  }
}
