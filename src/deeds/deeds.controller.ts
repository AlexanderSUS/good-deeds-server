import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  ApiForbiddenResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { DeedGuard } from 'src/auth/guards/deed.guard';
import { BadRequestDto } from 'src/common/dto/bad-request.dto';
import { ForbiddenDto } from 'src/common/dto/forbidden.dto';
import { NotFoundDto } from 'src/common/dto/not-found.dto';
import { ValidateMongoId } from 'src/pipes/validate-mongo-id.pipe';
import { DeedsService } from './deeds.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { DeedDto } from './dto/deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';

@ApiTags('deeds')
@ApiCookieAuth()
@Controller('users/:userId/deeds')
export class DeedsController {
  constructor(private readonly deedsService: DeedsService) {}

  @Post()
  @ApiCreatedResponse({ type: DeedDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  create(
    @Param('userId', ValidateMongoId) userId: string,
    @Body() createDeedDto: CreateDeedDto,
  ) {
    return this.deedsService.create(createDeedDto, userId);
  }

  @Get()
  @ApiOkResponse({ type: [DeedDto] })
  findAll(@Param('userId', ValidateMongoId) userId: string) {
    return this.deedsService.findAll(userId);
  }

  @Get(':id')
  @ApiOkResponse({ type: DeedDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse({ type: BadRequestDto })
  findOne(
    @Param('userId', ValidateMongoId) userId: string,
    @Param('id', ValidateMongoId) id: string,
  ) {
    return this.deedsService.findOne(id);
  }

  @UseGuards(DeedGuard)
  @Patch(':id')
  @ApiBody({
    type: UpdateDeedDto,
  })
  @ApiOkResponse({ type: DeedDto })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @ApiNotFoundResponse({ type: NotFoundDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  update(
    @Param('userId', ValidateMongoId) userId: string,
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
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async remove(
    @Param('userId', ValidateMongoId) userId: string,
    @Param('id', ValidateMongoId) id: string,
  ) {
    await this.deedsService.remove(id);
  }
}
