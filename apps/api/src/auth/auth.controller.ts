import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  AuthError,
  AuthErrorType,
} from '@shared';
import { UserModel } from '../models/user.model';
import { CityModel } from '../models/city.model'; // You'll need to create this too

export class AuthController {
  private readonly SALT_ROUNDS = 10;
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';

  async signup(req: Request<object, object, SignupCredentials>, res: Response) {
    try {
      const { email, password, username, cityId } = req.body;

      // Check if user exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          type: AuthErrorType.EMAIL_IN_USE,
          message: 'Email already in use',
        } as AuthError);
      }

      // Check username availability
      const existingUsername = await UserModel.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          type: AuthErrorType.USERNAME_IN_USE,
          message: 'Username already taken',
        } as AuthError);
      }

      // Verify city exists
      const city = await CityModel.findById(cityId);
      if (!city) {
        return res.status(400).json({
          message: 'Invalid city selected',
        });
      }

      // Hash password
      const hashedPassword = await hash(password, this.SALT_ROUNDS);

      // Create user
      const user = await UserModel.create({
        email,
        username,
        password: hashedPassword,
        cityId,
        friends: [],
      });

      // Generate tokens
      const authResponse = this.generateAuthResponse(user);

      return res.status(201).json(authResponse);
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Error creating user account' });
    }
  }

  async login(req: Request<object, object, LoginCredentials>, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await UserModel.findOne({ email })
        .select('+password') // Include password field
        .lean();

      if (!user) {
        return res.status(401).json({
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Invalid credentials',
        } as AuthError);
      }

      // Verify password
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Invalid credentials',
        } as AuthError);
      }

      // Update last login
      await User.findByIdAndUpdate(user.id, {
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      });

      // Generate tokens
      const authResponse = this.generateAuthResponse(user);

      return res.status(200).json(authResponse);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Error during login' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
      }

      // Verify refresh token
      const payload = verify(refreshToken, this.JWT_REFRESH_SECRET) as {
        userId: string;
      };

      // Get user
      const user = await User.findById(payload.userId);
      if (!user) {
        return res.status(401).json({
          type: AuthErrorType.USER_NOT_FOUND,
          message: 'User not found',
        } as AuthError);
      }

      // Generate new tokens
      const authResponse = this.generateAuthResponse(user);

      return res.status(200).json(authResponse);
    } catch (error) {
      return res.status(401).json({
        type: AuthErrorType.INVALID_TOKEN,
        message: 'Invalid refresh token',
      } as AuthError);
    }
  }

  private generateAuthResponse(user: User): AuthResponse {
    // Create access token
    const accessToken = sign(
      { userId: user.id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );

    // Create refresh token
    const refreshToken = sign({ userId: user.id }, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });

    // Calculate friend count
    const friendCount = user.friends?.length || 0;

    // Prepare user data without sensitive information
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      cityId: user.cityId,
      friendCount,
      profile: user.profile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    };

    return {
      accessToken,
      refreshToken,
      user: userData,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
