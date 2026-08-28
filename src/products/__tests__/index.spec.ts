import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { ProductsService } from "../products.service";

describe("ProductsService", () => {
  const createdAt = new Date("2026-08-27T12:00:00.000Z");
  const product = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Widget",
    sku: "WDG-001",
    description: "Standard widget for warehouse stock",
    category: "Hardware",
    unit: "each",
    reorderThreshold: 10,
    imageUrl: "https://cdn.example.com/widget.jpg",
    archived: false,
    createdAt,
  };

  const createDto = {
    name: "Widget",
    sku: "WDG-001",
    description: "Standard widget for warehouse stock",
    category: "Hardware",
    unit: "each",
    reorderThreshold: 10,
    imageUrl: "https://cdn.example.com/widget.jpg",
  };

  const mockPrisma = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const setup = async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    return moduleRef.get(ProductsService);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a product", async () => {
    mockPrisma.product.create.mockResolvedValue(product);

    const service = await setup();
    const result = await service.create(createDto);

    expect(mockPrisma.product.create).toHaveBeenCalledWith({
      data: createDto,
    });
    expect(result).toEqual(product);
  });

  it("throws ConflictException when SKU already exists", async () => {
    mockPrisma.product.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "6.19.2",
      }),
    );

    const service = await setup();

    await expect(service.create(createDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("lists active products by default", async () => {
    mockPrisma.product.findMany.mockResolvedValue([product]);

    const service = await setup();
    const result = await service.findAll();

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
    });
    expect(result).toEqual([product]);
  });

  it("includes archived products when requested", async () => {
    const archivedProduct = { ...product, archived: true };
    mockPrisma.product.findMany.mockResolvedValue([product, archivedProduct]);

    const service = await setup();
    const result = await service.findAll(true);

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: { createdAt: "desc" },
    });
    expect(result).toHaveLength(2);
  });

  it("returns a product by id", async () => {
    mockPrisma.product.findUnique.mockResolvedValue(product);

    const service = await setup();
    const result = await service.findOne(product.id);

    expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: product.id },
    });
    expect(result).toEqual(product);
  });

  it("throws NotFoundException when product is missing", async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);

    const service = await setup();

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("archives a product via update", async () => {
    const archivedProduct = { ...product, archived: true };
    mockPrisma.product.findUnique.mockResolvedValue(product);
    mockPrisma.product.update.mockResolvedValue(archivedProduct);

    const service = await setup();
    const result = await service.update(product.id, { archived: true });

    expect(mockPrisma.product.update).toHaveBeenCalledWith({
      where: { id: product.id },
      data: {
        name: undefined,
        sku: undefined,
        description: undefined,
        category: undefined,
        unit: undefined,
        reorderThreshold: undefined,
        imageUrl: undefined,
        archived: true,
      },
    });
    expect(result.archived).toBe(true);
  });

  it("throws NotFoundException when updating a missing product", async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);

    const service = await setup();

    await expect(
      service.update("missing-id", { name: "Updated" }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(mockPrisma.product.update).not.toHaveBeenCalled();
  });

  it("throws ConflictException when updating to a duplicate SKU", async () => {
    mockPrisma.product.findUnique.mockResolvedValue(product);
    mockPrisma.product.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "6.19.2",
      }),
    );

    const service = await setup();

    await expect(
      service.update(product.id, { sku: "WDG-002" }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
