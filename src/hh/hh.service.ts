import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  API_URLS,
  NOT_FOUND_CLUSTER_ERROR,
  SALARY_CLUSTER_ID,
} from './hh.constants';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HhResponse } from './hh.models';

@Injectable()
export class HhService {
  token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.token = this.configService.get('HH_TOKEN') ?? '';
  }

  async getData(text: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<HhResponse>(API_URLS['vacancies'], {
            params: {
              text,
              clusters: true,
            },
            headers: {
              'User-Agent': 'OwlTop/1.0 (someemail@gmail.com)',
              Authorization: 'Bearer ' + this.token,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              Logger.error(error?.response?.data);
              throw error;
            }),
          ),
      );

      return this.parseData(data);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  private parseData(data: HhResponse) {
    const salaryClusters = data.clusters.find(
      (c) => c.id === SALARY_CLUSTER_ID,
    );

    if (!salaryClusters) {
      throw new Error(NOT_FOUND_CLUSTER_ERROR);
    }

    const juniorSalary = this.getSalaryFromString(
      salaryClusters?.items[0].name,
    );
    const middleSalary = this.getSalaryFromString(
      salaryClusters?.items[Math.ceil(salaryClusters.items.length / 2)].name,
    );
    const seniorSalary = this.getSalaryFromString(
      salaryClusters?.items[salaryClusters.items.length - 1].name,
    );

    return {
      count: data.found,
      juniorSalary,
      middleSalary,
      seniorSalary,
      updatedAt: new Date(),
    };
  }

  private getSalaryFromString(s: string): number {
    const numberRegEx = /(\d+)/g;
    const response = s.match(numberRegEx);

    if (!response) {
      return 0;
    }

    return Number(response[0]);
  }
}
