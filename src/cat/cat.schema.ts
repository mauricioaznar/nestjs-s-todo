import {SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {Cat} from "./cat.dto";

export type CatDocument = Cat & Document;
export const CatSchema = SchemaFactory.createForClass(Cat);
