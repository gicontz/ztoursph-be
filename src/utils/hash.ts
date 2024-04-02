import { randomUUID, createHash } from 'crypto';

export const uuidTo8Bits = (uuid = randomUUID()) => {
  // Hash the UUID using SHA-256
  const hash = createHash('sha256').update(uuid).digest('hex');
  // Take the first 8 characters of the hash
  const eightCharacterValue = hash.substring(0, 8);
  return eightCharacterValue;
};
