import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import prisma from './prismaService';
import User from '../models/User';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;

    try {
        console.log('🔑 Authenticating user:', username);
        const user = await prisma.user.findUnique({
            where: { username },
        }) as User | null;

        if (!user) {
            console.log('❌ Invalid username or password');
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('❌ Invalid username or password');
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        console.log('✅ User authenticated successfully');
        res.status(200).json({ message: 'User authenticated' });
    } catch (error) {
        console.error('❌ Error during authentication:', error);
        next(error);
    }
};

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, name, surname, email, accessRole } = req.body;

    try {
        console.log('📝 Registering new user:', username);
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: { username }
        }) as User | null;

        if (existingUser) {
            console.log('⚠️ Username already exists:', username);
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                firstName: name,
                lastName: surname,
                email,
                accessLevel: accessRole,
            },
        }) as User;

        console.log('✅ User registered successfully');
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.error('❌ Error during registration:', error);
        next(error);
    }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                accessLevel: true,
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

