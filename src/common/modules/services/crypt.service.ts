import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private readonly algorithm = process.env.ENCRYPTION_ALGORITHM;
  private readonly iterations = parseInt(process.env.ENCRYPTION_ITERATIONS, 10);
  private readonly keyLength = parseInt(process.env.ENCRYPTION_KEY_LENGTH, 10);
  private readonly digest = process.env.ENCRYPTION_DIGEST;
  private readonly secret = process.env.ENCRYPTION_SECRET;

  // Encrypt any data (string, number, array, object)
  encrypt(data: any, encryptWholeObject: boolean = false): any {
    const salt = crypto.randomBytes(16); // Generate a random salt for each encryption
    const key = this.generateKey(salt);

    if (encryptWholeObject && typeof data === 'object' && data !== null) {
      return this.encryptWholeObject(data, key, salt); // Encrypt the whole object as a single value
    }

    if (
      typeof data === 'string' ||
      typeof data === 'number' ||
      typeof data === 'boolean'
    ) {
      return this.encryptValue(String(data), key, salt);
    } else if (Array.isArray(data)) {
      return data.map((item) => this.encrypt(item, encryptWholeObject)); // Recursively encrypt each item in the array
    } else if (typeof data === 'object' && data !== null) {
      return this.encryptObjectValues(data, key, salt); // Encrypt individual values in the object
    }

    throw new Error('Unsupported data type for encryption');
  }

  // Decrypt any type of data (string, number, array, object)
  decrypt(data: any): any {
    if (typeof data === 'string' && this.isEncrypted(data)) {
      return this.decryptValue(data);
    } else if (Array.isArray(data)) {
      return data.map((item) => this.decrypt(item));
    } else if (typeof data === 'object' && data !== null) {
      const decryptedObject: Record<string, any> = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          decryptedObject[key] = this.decrypt(data[key]);
        }
      }
      return decryptedObject;
    }
    return data; // Return as is if not encrypted
  }

  // New password hashing function
  hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a 16-byte random salt
    const hash = crypto
      .pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest)
      .toString('hex'); // Hash the password using PBKDF2
    return { hash, salt }; // Return the hash and salt as a pair
  }

  // Password verification function
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest)
      .toString('hex');
    return hashedPassword === hash; // Compare hashed password with stored hash
  }
  // Generate key using PBKDF2 with salt
  private generateKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      this.secret,
      salt,
      this.iterations,
      this.keyLength,
      this.digest,
    );
  }

  // Encrypt the whole object into a single encrypted value
  private encryptWholeObject(
    object: Record<string, any>,
    key: Buffer,
    salt: Buffer,
  ): string {
    const serializedObject = JSON.stringify(object); // Serialize the object to a string
    return this.encryptValue(serializedObject, key, salt); // Encrypt the serialized string
  }

  // Encrypt individual values in the object
  private encryptObjectValues(
    object: Record<string, any>,
    key: Buffer,
    salt: Buffer,
  ): Record<string, any> {
    const encryptedObject: Record<string, any> = {};
    for (const prop in object) {
      if (object.hasOwnProperty(prop)) {
        encryptedObject[prop] = this.encrypt(object[prop], false); // Encrypt individual values
      }
    }
    return encryptedObject;
  }

  // Encrypt a string value with a key and salt
  private encryptValue(value: string, key: Buffer, salt: Buffer): string {
    const iv = crypto.randomBytes(16); // Random IV for each encryption
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return encrypted data with salt and IV, encoded in hex
    return `${encrypted}:${iv.toString('hex')}:${salt.toString('hex')}`;
  }

  // Decrypt a string value
  private decryptValue(encryptedValue: string): string {
    const [encrypted, ivHex, saltHex] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const salt = Buffer.from(saltHex, 'hex');
    const key = this.generateKey(salt);

    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Helper to check if a string is encrypted (basic check)
  private isEncrypted(data: string): boolean {
    return data.includes(':'); // Simple check if the data has ':' (used in encryption format)
  }
}
