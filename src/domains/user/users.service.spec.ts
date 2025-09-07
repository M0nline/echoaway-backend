import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User, UserRole } from '../../entities';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  // Mock user data
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    firstname: 'John',
    name: 'Doe',
    avatar: 'https://example.com/avatar.jpg',
    role: UserRole.GUEST,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    accommodations: [],
    favorites: [],
    isAdmin: jest.fn(() => false),
    isHost: jest.fn(() => false),
    isGuest: jest.fn(() => true),
    isVisitor: jest.fn(() => false),
  };

  const mockUsers: User[] = [
    mockUser,
    {
      ...mockUser,
      id: 2,
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      isAdmin: jest.fn(() => true),
      isHost: jest.fn(() => true),
      isGuest: jest.fn(() => false),
      isVisitor: jest.fn(() => false),
    },
  ];

  beforeEach(async () => {
    // Mock repository methods
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      repository.find.mockResolvedValue(mockUsers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      repository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      // Arrange
      const userId = 1;
      repository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOne(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 999;
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOne(userId);

      // Assert
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      // Arrange
      const email = 'test@example.com';
      repository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      // Arrange
      const userData = {
        email: 'newuser@example.com',
        password: 'plainPassword123',
        firstname: 'Jane',
        name: 'Smith',
        role: UserRole.GUEST,
      };
      const hashedPassword = 'hashedPassword123';
      const createdUser = { 
        ...mockUser, 
        ...userData, 
        password: hashedPassword,
        isAdmin: jest.fn(() => false),
        isHost: jest.fn(() => false),
        isGuest: jest.fn(() => true),
        isVisitor: jest.fn(() => false),
      };

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      repository.create.mockReturnValue(createdUser as any);
      repository.save.mockResolvedValue(createdUser);

      // Act
      const result = await service.create(userData);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(repository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
        role: UserRole.GUEST,
      });
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should create a user with default VISITOR role when no role provided', async () => {
      // Arrange
      const userData = {
        email: 'newuser@example.com',
        password: 'plainPassword123',
        firstname: 'Jane',
        name: 'Smith',
      };
      const hashedPassword = 'hashedPassword123';
      const createdUser = { 
        ...mockUser, 
        ...userData, 
        password: hashedPassword, 
        role: UserRole.VISITOR,
        isAdmin: jest.fn(() => false),
        isHost: jest.fn(() => false),
        isGuest: jest.fn(() => false),
        isVisitor: jest.fn(() => true),
      };

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      repository.create.mockReturnValue(createdUser as any);
      repository.save.mockResolvedValue(createdUser);

      // Act
      const result = await service.create(userData);

      // Assert
      expect(repository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
        role: UserRole.VISITOR,
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      // Arrange
      const userId = 1;
      const updateData = { firstname: 'UpdatedName' };
      const updatedUser = { 
        ...mockUser, 
        ...updateData,
        isAdmin: jest.fn(() => false),
        isHost: jest.fn(() => false),
        isGuest: jest.fn(() => true),
        isVisitor: jest.fn(() => false),
      };

      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(userId, updateData);

      // Assert
      expect(repository.update).toHaveBeenCalledWith(userId, updateData);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(updatedUser);
    });

    it('should return null when user not found for update', async () => {
      // Arrange
      const userId = 999;
      const updateData = { firstname: 'UpdatedName' };

      repository.update.mockResolvedValue({ affected: 0 } as any);
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.update(userId, updateData);

      // Assert
      expect(repository.update).toHaveBeenCalledWith(userId, updateData);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      // Arrange
      const userId = 1;
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      // Act
      await service.remove(userId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith(userId);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      // Arrange
      const plainPassword = 'password123';
      const hashedPassword = 'hashedPassword123';
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      const result = await service.validatePassword(plainPassword, hashedPassword);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      // Arrange
      const plainPassword = 'wrongPassword';
      const hashedPassword = 'hashedPassword123';
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act
      const result = await service.validatePassword(plainPassword, hashedPassword);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      // Arrange
      const plainPassword = 'password123';
      const hashedPassword = 'hashedPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      // Act
      const result = await service.hashPassword(plainPassword);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(result).toBe(hashedPassword);
    });
  });
});
