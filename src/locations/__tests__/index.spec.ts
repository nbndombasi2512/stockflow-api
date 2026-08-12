import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { LocationsService } from "../locations.service";

describe("LocationsService", () => {
  const createdAt = new Date("2026-08-12T12:00:00.000Z");
  const location = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Main Warehouse",
    notes: "Primary storage",
    archived: false,
    createdAt,
  };

  const mockPrisma = {
    location: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const setup = async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    return moduleRef.get(LocationsService);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a location", async () => {
    mockPrisma.location.create.mockResolvedValue(location);

    const service = await setup();
    const result = await service.create({
      name: "Main Warehouse",
      notes: "Primary storage",
    });

    expect(mockPrisma.location.create).toHaveBeenCalledWith({
      data: {
        name: "Main Warehouse",
        notes: "Primary storage",
      },
    });
    expect(result).toEqual(location);
  });

  it("lists active locations by default", async () => {
    mockPrisma.location.findMany.mockResolvedValue([location]);

    const service = await setup();
    const result = await service.findAll();

    expect(mockPrisma.location.findMany).toHaveBeenCalledWith({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
    });
    expect(result).toEqual([location]);
  });

  it("includes archived locations when requested", async () => {
    const archivedLocation = { ...location, archived: true };
    mockPrisma.location.findMany.mockResolvedValue([location, archivedLocation]);

    const service = await setup();
    const result = await service.findAll(true);

    expect(mockPrisma.location.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: { createdAt: "desc" },
    });
    expect(result).toHaveLength(2);
  });

  it("returns a location by id", async () => {
    mockPrisma.location.findUnique.mockResolvedValue(location);

    const service = await setup();
    const result = await service.findOne(location.id);

    expect(mockPrisma.location.findUnique).toHaveBeenCalledWith({
      where: { id: location.id },
    });
    expect(result).toEqual(location);
  });

  it("throws NotFoundException when location is missing", async () => {
    mockPrisma.location.findUnique.mockResolvedValue(null);

    const service = await setup();

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("archives a location via update", async () => {
    const archivedLocation = { ...location, archived: true };
    mockPrisma.location.findUnique.mockResolvedValue(location);
    mockPrisma.location.update.mockResolvedValue(archivedLocation);

    const service = await setup();
    const result = await service.update(location.id, { archived: true });

    expect(mockPrisma.location.update).toHaveBeenCalledWith({
      where: { id: location.id },
      data: {
        name: undefined,
        notes: undefined,
        archived: true,
      },
    });
    expect(result.archived).toBe(true);
  });

  it("throws NotFoundException when updating a missing location", async () => {
    mockPrisma.location.findUnique.mockResolvedValue(null);

    const service = await setup();

    await expect(
      service.update("missing-id", { name: "Updated" }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(mockPrisma.location.update).not.toHaveBeenCalled();
  });
});
