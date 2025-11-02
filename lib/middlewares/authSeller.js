import prisma from "@/lib/prisma";

/**
 * Middleware to verify if user is a seller (has an approved store)
 * @param {string} userId - Clerk user ID
 * @returns {Promise<string|null>} Store ID if user is seller, null otherwise
 */
export default async function authSeller(userId) {
  if (!userId) {
    return null;
  }

  try {
    const store = await prisma.store.findFirst({
      where: {
        userId: userId,
        status: "approved",
      },
      select: {
        id: true,
      },
    });

    return store ? store.id : null;
  } catch (error) {
    console.error("Error in authSeller middleware:", error);
    return null;
  }
}

/**
 * Get store by userId (any status)
 * @param {string} userId - Clerk user ID
 * @returns {Promise<object|null>} Store object if found, null otherwise
 */
export async function getStoreByUserId(userId) {
  if (!userId) {
    return null;
  }

  try {
    const store = await prisma.store.findFirst({
      where: { userId },
    });

    return store;
  } catch (error) {
    console.error("Error in getStoreByUserId:", error);
    return null;
  }
}

/**
 * Check if user is admin
 * @param {string} userId - Clerk user ID
 * @returns {Promise<boolean>} True if admin, false otherwise
 */
export async function isAdmin(userId) {
  if (!userId) {
    return false;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    return user?.isAdmin || false;
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return false;
  }
}
