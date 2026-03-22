import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { db } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPayload {
    userId: string;
    email: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export const generateTokens = async (payload: TokenPayload): Promise<Tokens> => {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
    
    const refreshTokenId = uuidv4();
    const refreshToken = jwt.sign(
        { ...payload, tokenId: refreshTokenId },
        JWT_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    );

    // Store refresh token hash in database
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.query(
        'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
        [refreshTokenId, payload.userId, tokenHash, expiresAt]
    );

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload & { tokenId: string };
    
    // Check if token exists and is not revoked
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const storedToken = await db.queryOne(
        'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()',
        [tokenHash]
    );

    if (!storedToken) {
        throw new Error('Invalid refresh token');
    }

    return payload;
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await db.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?',
        [tokenHash]
    );
};

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
    await db.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL',
        [userId]
    );
};
