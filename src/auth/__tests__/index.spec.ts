import { ConflictException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthService } from "../auth.service";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

const hashMock = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;

describe("AuthService", () => {
  const mockPrisma = {
    user: {
      create: jest.fn(),
    },
  };

  const setup = async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    return moduleRef.get(AuthService);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    hashMock.mockResolvedValue("hashed-password" as never);
  });

  it("hashes the password and returns a safe user payload", async () => {
    const createdAt = new Date("2026-07-16T12:00:00.000Z");
    mockPrisma.user.create.mockResolvedValue({
      id: "user-1",
      email: "alice@example.com",
      createdAt,
    });

    const service = await setup();
    const result = await service.signup({
      email: "alice@example.com",
      password: "secret123",
    });

    expect(hashMock).toHaveBeenCalledWith("secret123", 10);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "alice@example.com",
        passwordHash: "hashed-password",
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
    expect(result).toEqual({
      id: "user-1",
      email: "alice@example.com",
      createdAt,
    });
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("throws ConflictException when email is already registered", async () => {
    mockPrisma.user.create.mockRejectedValue(
      new PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "6.19.2",
      }),
    );

    const service = await setup();

    await expect(
      service.signup({
        email: "alice@example.com",
        password: "secret123",
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
