import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private prismaService: PrismaService
  ) { }

  async createUser(userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
  }): Promise<any> {
    const existingUser = await this.prismaService.users.findUnique({
      where: { username: userData.username },
    });

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Check if the email already exists (optional but common)
    const existingEmail = await this.prismaService.users.findUnique({
      where: { email: userData.email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Check if the phone number already exists (optional but common)
    const existingPhoneNumber = await this.prismaService.users.findUnique({
      where: { phone_number: userData.phoneNumber },
    });

    if (existingPhoneNumber) {
      throw new BadRequestException('Phone number already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create the user in the database
    return this.prismaService.users.create({
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username,
        email: userData.email,
        phone_number: userData.phoneNumber,
        password: hashedPassword,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        email: true,
        phone_number: true,
      },
    });
  }

  async login(user: any) {
    // Ensure the user is valid
    if (!user) {
      throw new Error('User not found');
    }

    const userFind = await this.findByUsername(
      user.usernameOrEmail,
    );

    // Create the payload for the JWT
    const payload = { username: userFind.username, sub: userFind.id };

    // Generate the access token using the payload
    const accessToken = this.jwtService.sign(payload);

    // Exclude the password field from the user data
    const { password, ...userData } = userFind; // Destructure to exclude password

    // Return the access token along with user data (excluding password)
    return {
      accessToken,
      user: userFind.id, // Return user data without the password field
    };
  }

  async getUserById(id: number) {
    const user = this.prismaService.users.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validateUser(username: string, password: string): Promise<any | null> {
    const user = await this.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async findByUsername(username?: string): Promise<any | null> {
    return this.prismaService.users.findUnique({
      where: { username },
    });
  }
}