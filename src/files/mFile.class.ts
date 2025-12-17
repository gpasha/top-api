/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export class MFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: Express.Multer.File | MFile) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
  }
}
