import { inngest } from "./client";
import prisma from "../lib/prisma";

// function to save user data to the database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const data = event.data;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      },
    });
  }
);

// inngest function to update user data to the database
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const data = event.data;
    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      },
    });
  }
);

// inngest function to delete user data from the database
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const data = event.data;
    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);
