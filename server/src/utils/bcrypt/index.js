const { hash, compare } = require('bcrypt')

const { SALT } = require('../../constants')

/**
 * Returns hashed password by hash password.
 *
 * @remarks
 * This method is part of the {@link utils/password}.
 *
 * @param password - 1st input number
 * @returns The hashed password mean of `password`
 *
 * @beta
 */
const hashPassword = async (password) => {
	return await hash(password, SALT)
}

/**
 * Returns boolean by compare password.
 *
 * @remarks
 * This method is part of the {@link utils/password}.
 *
 * @param password - 1st input number
 * @param hash - The second input number
 * @returns The boolean mean of `password` and `hash`
 *
 * @beta
 */
const comparePassword = async (password, hash) => {
	return await compare(password, hash)
}

module.exports = {
	hashPassword,
	comparePassword
}
