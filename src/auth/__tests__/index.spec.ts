import { ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthService } from "../auth.service";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const hashMock = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
const compareMock = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;

describe("AuthService", () => {
  const createdAt = new Date("2026-07-16T12:00:00.000Z");
  const safeUser = {
    id: "user-1",
    email: "alice@example.com",
    createdAt,
  };
  const storedUser = {
    ...safeUser,
    passwordHash: "hashed-password",
  };

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const setup = async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    return moduleRef.get(AuthService);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    hashMock.mockResolvedValue("hashed-password" as never);
    compareMock.mockResolvedValue(true as never);
    mockJwtService.signAsync.mockResolvedValue("signed-jwt");
  });

  it("hashes the password and returns a safe user payload", async () => {
    mockPrisma.user.create.mockResolvedValue(safeUser);

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
    expect(result).toEqual(safeUser);
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("throws ConflictException when email is already registered", async () => {
    mockPrisma.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
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

  it("returns a safe user when credentials are valid", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(storedUser);

    const service = await setup();
    const result = await service.validateUser(
      "alice@example.com",
      "secret123",
    );

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "alice@example.com" },
    });
    expect(compareMock).toHaveBeenCalledWith("secret123", "hashed-password");
    expect(result).toEqual(safeUser);
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("returns null when the email is unknown", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const service = await setup();
    const result = await service.validateUser(
      "missing@example.com",
      "secret123",
    );

    expect(compareMock).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("returns null when the password is invalid", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(storedUser);
    compareMock.mockResolvedValue(false as never);

    const service = await setup();
    const result = await service.validateUser(
      "alice@example.com",
      "wrong-password",
    );

    expect(result).toBeNull();
  });

  it("issues a JWT and returns the login payload", async () => {
    const service = await setup();
    const result = await service.login(safeUser);

    expect(mockJwtService.signAsync).toHaveBeenCalledWith({
      sub: "user-1",
      email: "alice@example.com",
    });
    expect(result).toEqual({
      accessToken: "signed-jwt",
      user: safeUser,
    });
    expect(result.user).not.toHaveProperty("passwordHash");
  });
});
