import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import prisma from './prismaService';


export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        res.status(200).json({ message: 'User authenticated' });
    } catch (error) {
        next(error);
    }
};

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, name, surname, email, accessRole } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
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
        });

        res.status(201).json({ message: 'User registered' });
    } catch (error) {
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

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

