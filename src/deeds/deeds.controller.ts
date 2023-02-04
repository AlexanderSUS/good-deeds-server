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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { DeedGuard } from 'src/auth/guards/deed.guard';
import RequestWithUser from 'src/auth/interface/reuestWithUser.interface';
import { BadRequestDto } from 'src/common/dto/bad-request.dto';
import { ValidateMongoId } from 'src/pipes/validate-mongo-id.pipe';
import { DeedsService } from './deeds.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { DeedDto } from './dto/deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';

@ApiTags('deeds')
@ApiCookieAuth()
@Controller('deeds')
export class DeedsController {
  constructor(private readonly deedsService: DeedsService) {}

  @Post()
  @ApiCreatedResponse({ type: DeedDto })
  create(
    @Body() createDeedDto: CreateDeedDto,
    @Req() { user: { _id } }: RequestWithUser,
  ) {
    return this.deedsService.create(createDeedDto, _id);
  }

  @Get()
  @ApiOkResponse({ type: [DeedDto] })
  findAll() {
    return this.deedsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: DeedDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse({ type: BadRequestDto })
  findOne(@Param('id', ValidateMongoId) id: string) {
    return this.deedsService.findOne(id);
  }

  @UseGuards(DeedGuard)
  @Patch(':id')
  @ApiBody({
    type: UpdateDeedDto,
  })
  @ApiOkResponse({ type: DeedDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateDeedDto: UpdateDeedDto,
  ) {
    return this.deedsService.update(id, updateDeedDto);
  }

  @UseGuards(DeedGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestDto })
  async remove(@Param('id', ValidateMongoId) id: string) {
    await this.deedsService.remove(id);
  }
}
