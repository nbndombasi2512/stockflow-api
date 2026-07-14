import { Test } from "@nestjs/testing";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";

describe("PrismaModule", () => {
  it("provides and exports PrismaService", async () => {
    const connect = jest
      .spyOn(PrismaService.prototype, "$connect")
      .mockResolvedValue(undefined);
    const disconnect = jest
      .spyOn(PrismaService.prototype, "$disconnect")
      .mockResolvedValue(undefined);

    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    const prismaService = moduleRef.get(PrismaService);

    expect(prismaService).toBeDefined();
    expect(typeof prismaService.$connect).toBe("function");

    await moduleRef.init();
    expect(connect).toHaveBeenCalled();

    await moduleRef.close();
    expect(disconnect).toHaveBeenCalled();

    connect.mockRestore();
    disconnect.mockRestore();
  });
});
