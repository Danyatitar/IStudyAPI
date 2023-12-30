import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { Readable } from 'stream';
@Injectable()
export class FileService {
  private gridFSBucket;

  constructor(@InjectConnection() private connection: Connection) {
    this.gridFSBucket = new mongoose.mongo.GridFSBucket(this.connection.db);
  }

  async storeFile(file: Express.Multer.File): Promise<string> {
    console.log(file);
    const uploadStream = this.gridFSBucket.openUploadStream(file.originalname, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    uploadStream.write(file.buffer);

    return new Promise((resolve, reject) => {
      uploadStream.end(() => {
        resolve(uploadStream.id.toString());
      });
    });
  }

  // async getFileStream(
  //   fileId: mongoose.Types.ObjectId,
  // ): Promise<{ stream: Readable; filename: string }> {
  //   const downloadStream = this.gridFSBucket.openDownloadStream(
  //     new mongoose.Types.ObjectId(fileId),
  //   );
  //   const fileMetadata = await this.connection.db
  //     .collection('fs.files')
  //     .findOne({
  //       _id: new mongoose.Types.ObjectId(fileId),
  //     });

  //   if (!fileMetadata) {
  //     throw new BadRequestException('File not found');
  //   }
  //   return { stream: downloadStream, filename: fileMetadata.filename };
  // }

  async getFileById(
    id: mongoose.Types.ObjectId,
  ): Promise<{ filename: string; stream: any; contentType: string }> {
    const file = await this.gridFSBucket.find({ _id: id }).toArray();

    if (file.length === 0) {
      throw new NotFoundException('File not found');
    }

    const stream = this.gridFSBucket.openDownloadStream(id);
    const contentType =
      file[0].metadata.contentType || 'application/octet-stream';

    return {
      filename: file[0].filename,
      stream,
      contentType,
    };
  }

  async deleteFileById(id: mongoose.Types.ObjectId): Promise<void> {
    try {
      await this.gridFSBucket.delete(id);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
