/**
 * In-memory user store for authentication.
 * NOTE: Will be replaced with a real database + bcrypt password hashing.
 *
 * For now we store a plain array and simulate async DB calls
 * so the service layer code doesn't need to change when the DB is added.
 */

const { v4: uuidv4 } = require("uuid");

/** @type {Map<string, {id:string, name:string, avatar:string, passwordHash:string, createdAt:string}>} */
const users = new Map();

/**
 * Find user by name (case-insensitive).
 * @param {string} name
 * @returns {object|undefined}
 */
function findByName(name) {
  for (const user of users.values()) {
    if (user.name.toLowerCase() === name.toLowerCase()) return user;
  }
  return undefined;
}

/**
 * Find user by id.
 * @param {string} id
 * @returns {object|undefined}
 */
function findById(id) {
  return users.get(id);
}

/**
 * Create a new user.
 * NOTE: In a real app, password is hashed before saving.
 * @param {string} name
 * @param {string} password   plain text (will be hashed when DB layer is added)
 * @param {string} avatarSeed
 * @returns {object}
 */
function create(name, password, avatarSeed) {
  const id = uuidv4();
  const user = {
    id,
    name,
    // Store as-is for now. DB teammate will add bcrypt.
    passwordHash: password,
    avatar: `https://api.dicebear.com/8.x/bottts/svg?seed=${avatarSeed}`,
    createdAt: new Date().toISOString(),
  };
  users.set(id, user);
  return user;
}

/**
 * Verify password (placeholder – will use bcrypt.compare when DB is added).
 * @param {string} plain
 * @param {string} hash
 * @returns {boolean}
 */
function verifyPassword(plain, hash) {
  return plain === hash;
}

/**
 * Return a safe public user object (no password).
 * @param {object} user
 * @returns {object}
 */
function toPublic(user) {
  const { passwordHash, ...pub } = user;
  return pub;
}

module.exports = { findByName, findById, create, verifyPassword, toPublic };
