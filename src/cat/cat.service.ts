import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat as CatSchema, CatDocument } from './cat.schema';
import { Model } from 'mongoose';
import { CatInput } from './cat.dto';

@Injectable()
export class CatService {
  constructor(@InjectModel(CatSchema.name) private catModel: Model<CatDocument>) {}

  async findAll(): Promise<CatSchema[]> {
    return this.catModel.find().exec();
  }

  async create(createCatDto: CatInput): Promise<CatSchema> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async update(id: string, updateCatDto: CatInput): Promise<CatSchema> {
    return this.catModel.findByIdAndUpdate(id, updateCatDto);
  }

  async delete(id: string): Promise<CatSchema> {
    return this.catModel.findByIdAndDelete(id);
  }
}
