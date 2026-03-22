import { db } from '../../config/database';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateTokens, revokeRefreshToken, revokeAllUserTokens } from '../../utils/jwt';
import { RegisterInput, LoginInput } from '../../utils/validation';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
}

export const createUser = async (input: RegisterInput): Promise<User> => {
    const { email, password, name } = input;
    
    // Check if user exists
    const existingUser = await db.queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
        throw Object.assign(new Error('User already exists'), { statusCode: 409 });
    }

    const passwordHash = await hashPassword(password);
    
    const result = await db.query(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
        [email, passwordHash, name]
    );

    const user = await db.queryOne<{ id: string; email: string; name: string; avatar_url: string | null }>(
        'SELECT id, email, name, avatar_url FROM users WHERE email = ?',
        [email]
    );

    if (!user) {
        throw new Error('Failed to create user');
    }

    // Initialize gamification data
    await db.query('INSERT INTO user_xp (user_id) VALUES (?)', [user.id]);
    await db.query('INSERT INTO user_streaks (user_id) VALUES (?)', [user.id]);

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url || undefined,
    };
};

export const authenticateUser = async (input: LoginInput) => {
    const { email, password } = input;

    const user = await db.queryOne<{
        id: string;
        email: string;
        name: string;
        password_hash: string;
        avatar_url: string | null;
    }>('SELECT id, email, name, password_hash, avatar_url FROM users WHERE email = ?', [email]);

    if (!user) {
        throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
        throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const tokens = await generateTokens({ userId: user.id, email: user.email });

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar_url: user.avatar_url || undefined,
        },
        tokens,
    };
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
    await revokeRefreshToken(refreshToken);
};

export const logoutAllDevices = async (userId: string): Promise<void> => {
    await revokeAllUserTokens(userId);
};

export const getUserById = async (userId: string): Promise<User | null> => {
    const user = await db.queryOne<{
        id: string;
        email: string;
        name: string;
        avatar_url: string | null;
    }>('SELECT id, email, name, avatar_url FROM users WHERE id = ?', [userId]);

    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url || undefined,
    };
};
