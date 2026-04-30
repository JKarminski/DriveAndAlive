/**
 * Auth service – registration, login logic.
 * NOTE: Password hashing will be added by the DB teammate (bcrypt).
 */

const userStore = require("../data/users");

/** Avatar seed options matching the frontend */
const AVATAR_SEEDS = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"];

/**
 * Register a new user.
 * @param {string} name
 * @param {string} password
 * @param {string} [avatarSeed="alpha"]
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
function register(name, password, avatarSeed = "alpha") {
  if (!name || !password) {
    return { success: false, error: "Name and password are required." };
  }
  if (name.length < 3 || name.length > 30) {
    return { success: false, error: "Name must be between 3 and 30 characters." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }
  if (userStore.findByName(name)) {
    return { success: false, error: "Name already taken." };
  }

  const seed = AVATAR_SEEDS.includes(avatarSeed) ? avatarSeed : "alpha";
  const user = userStore.create(name, password, seed);
  return { success: true, user: userStore.toPublic(user) };
}

/**
 * Login an existing user.
 * @param {string} name
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
function login(name, password) {
  if (!name || !password) {
    return { success: false, error: "Name and password are required." };
  }
  const user = userStore.findByName(name);
  if (!user) {
    return { success: false, error: "Invalid credentials." };
  }
  if (!userStore.verifyPassword(password, user.passwordHash)) {
    return { success: false, error: "Invalid credentials." };
  }
  return { success: true, user: userStore.toPublic(user) };
}

/**
 * Get public profile by id.
 * @param {string} id
 * @returns {object|null}
 */
function getProfile(id) {
  const user = userStore.findById(id);
  return user ? userStore.toPublic(user) : null;
}

module.exports = { register, login, getProfile };
