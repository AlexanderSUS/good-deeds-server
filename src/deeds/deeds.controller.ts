import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import RequestWithUser from 'src/auth/interface/reuestWithUser.interface';
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
  findOne(@Param('id') id: string) {
    return this.deedsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeedDto: UpdateDeedDto) {
    return this.deedsService.update(id, updateDeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deedsService.remove(id);
  }
}
