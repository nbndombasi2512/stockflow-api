import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateLocationDto } from "./dto/create-location.dto";
import type { UpdateLocationDto } from "./dto/update-location.dto";

export interface LocationResult {
  id: string;
  name: string;
  notes: string | null;
  archived: boolean;
  createdAt: Date;
}

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateLocationDto): Promise<LocationResult> {
    return this.prisma.location.create({
      data: {
        name: dto.name,
        notes: dto.notes,
      },
    });
  }

  findAll(includeArchived = false): Promise<LocationResult[]> {
    return this.prisma.location.findMany({
      where: includeArchived ? undefined : { archived: false },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string): Promise<LocationResult> {
    const location = await this.prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Location ${id} not found`);
    }

    return location;
  }

  async update(id: string, dto: UpdateLocationDto): Promise<LocationResult> {
    await this.findOne(id);

    return this.prisma.location.update({
      where: { id },
      data: {
        name: dto.name,
        notes: dto.notes,
        archived: dto.archived,
      },
    });
  }
}
