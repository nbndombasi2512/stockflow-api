import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateProductDto } from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";

export interface ProductResult {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  unit: string;
  reorderThreshold: number | null;
  imageUrl: string | null;
  archived: boolean;
  createdAt: Date;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<ProductResult> {
    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name,
          sku: dto.sku,
          description: dto.description,
          category: dto.category,
          unit: dto.unit,
          reorderThreshold: dto.reorderThreshold,
          imageUrl: dto.imageUrl,
        },
      });
    } catch (error) {
      this.rethrowSkuConflict(error);
    }
  }

  findAll(includeArchived = false): Promise<ProductResult[]> {
    return this.prisma.product.findMany({
      where: includeArchived ? undefined : { archived: false },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string): Promise<ProductResult> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResult> {
    await this.findOne(id);

    try {
      return await this.prisma.product.update({
        where: { id },
        data: {
          name: dto.name,
          sku: dto.sku,
          description: dto.description,
          category: dto.category,
          unit: dto.unit,
          reorderThreshold: dto.reorderThreshold,
          imageUrl: dto.imageUrl,
          archived: dto.archived,
        },
      });
    } catch (error) {
      this.rethrowSkuConflict(error);
    }
  }

  private rethrowSkuConflict(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("SKU already exists");
    }

    throw error;
  }
}
