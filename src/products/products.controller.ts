import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { ListProductsQueryDto } from "./dto/list-products-query.dto";
import { ProductResponseDto } from "./dto/product-response.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService, type ProductResult } from "./products.service";

@ApiTags("products")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Missing or invalid JWT" })
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a product" })
  @ApiCreatedResponse({ type: ProductResponseDto })
  @ApiConflictResponse({ description: "SKU already exists" })
  create(@Body() dto: CreateProductDto): Promise<ProductResult> {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List products" })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  findAll(@Query() query: ListProductsQueryDto): Promise<ProductResult[]> {
    return this.productsService.findAll(query.includeArchived ?? false);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a product by id" })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiNotFoundResponse({ description: "Product not found" })
  findOne(@Param("id", ParseUUIDPipe) id: string): Promise<ProductResult> {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update or archive a product" })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiNotFoundResponse({ description: "Product not found" })
  @ApiConflictResponse({ description: "SKU already exists" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResult> {
    return this.productsService.update(id, dto);
  }
}
