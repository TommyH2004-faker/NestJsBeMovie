import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import cloudinary from './cloudinary.config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CLOUDINARY',
      useValue: cloudinary,
    },
  ],
  exports: ['CLOUDINARY'],
})
export class CloudinaryModule {}
