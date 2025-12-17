import { Injectable } from '@nestjs/common';
import { FileElementResponseDto } from './dto/file-element.response';
import { format } from 'date-fns/format';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { MFile } from './mFile.class';
import sharp from 'sharp';

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponseDto[]> {
    const dateFolder = format(new Date(), 'YYYY-MM-DD');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);
    const responce: FileElementResponseDto[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      responce.push({
        url: `${dateFolder}/${file.originalname}`,
        name: file.originalname,
      });
    }

    return responce;
  }

  convertToWebP(file: Buffer) {
    return sharp(file).webp().toBuffer();
  }
}
