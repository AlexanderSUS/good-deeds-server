import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeedGuard } from 'src/auth/guards/deed.guard';
import RequestWithUser from 'src/auth/interface/reuestWithUser.interface';
import { ValidateMongoId } from 'src/pipes/validate-mongo-id.pipe';
import { DeedsService } from './deeds.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';

@Controller('deeds')
export class DeedsController {
  constructor(private readonly deedsService: DeedsService) {}

  @Post()
  create(
    @Body() createDeedDto: CreateDeedDto,
    @Req() { user: { _id } }: RequestWithUser,
  ) {
    return this.deedsService.create(createDeedDto, _id);
  }

  @Get()
  findAll() {
    return this.deedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string) {
    return this.deedsService.findOne(id);
  }

  @UseGuards(DeedGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateDeedDto: UpdateDeedDto,
  ) {
    return this.deedsService.update(id, updateDeedDto);
  }

  @UseGuards(DeedGuard)
  @Delete(':id')
  remove(@Param('id', ValidateMongoId) id: string) {
    return this.deedsService.remove(id);
  }
}
