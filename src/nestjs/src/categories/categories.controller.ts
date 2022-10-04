import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  CategoryOutput,
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './presenter/category.presenter';
import { WrapperDataInterceptor } from '../@share/interceptors/wrapper-data.interceptor';

@UseInterceptors(WrapperDataInterceptor)
@Controller('categories')
export class CategoriesController {
  // properties injection
  @Inject(CreateCategoryUseCase.UseCase)
  private createUseCase: CreateCategoryUseCase.UseCase;

  @Inject(UpdateCategoryUseCase.UseCase)
  private updateUseCase: UpdateCategoryUseCase.UseCase;

  @Inject(DeleteCategoryUseCase.UseCase)
  private deleteUseCase: DeleteCategoryUseCase.UseCase;

  @Inject(GetCategoryUseCase.UseCase)
  private getUseCase: GetCategoryUseCase.UseCase;

  @Inject(ListCategoriesUseCase.UseCase)
  private listUseCase: ListCategoriesUseCase.UseCase;

  // Ports from hexagonal architecture

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return CategoriesController.categoryToResponse(output);
  }

  @Get()
  async search(@Query() searchParams: SearchCategoryDto) {
    const output = await this.listUseCase.execute(searchParams);
    return new CategoryCollectionPresenter(output); // clean architecture
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUseCase.execute({ id });
    return CategoriesController.categoryToResponse(output);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateCategoryDto,
    });
    return CategoriesController.categoryToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute({ id });
  }

  static categoryToResponse(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}

// Controller tests
//  integration: sqlite in memory
//  end-to-end: more expensive, bureaucratic and longstanding
