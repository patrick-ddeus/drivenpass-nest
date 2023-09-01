import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export class Crypto {
  private readonly key: Promise<Buffer>;
  private readonly iv: Buffer;

  constructor(secret: string) {
    this.key = promisify(scrypt)(secret, 'salt', 32) as Promise<Buffer>;
    this.iv = randomBytes(16);
  }

  async encryptor(password: string) {
    const cipher = createCipheriv('aes-256-ctr', await this.key, this.iv);
    const encryptedPassword = Buffer.concat([
      cipher.update(password),
      cipher.final(),
    ]);
    return encryptedPassword;
  }

  async decryptor(password: Buffer) {
    const decipher = createDecipheriv('aes-256-ctr', await this.key, this.iv);
    const decryptedPassword = Buffer.concat([
      decipher.update(password),
      decipher.final(),
    ]);
    return decryptedPassword.toString();
  }
}
