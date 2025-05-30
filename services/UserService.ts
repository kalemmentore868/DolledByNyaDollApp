import { safe } from "@/utils/errors";
import { customAuthFetch } from "./utils";

import { CreateUser, UpdateUser, User } from "@/types/User";

export class UserService {
  /* 1. POST /users – create */
  static async create(user: CreateUser) {
    return safe<string>(customAuthFetch<string>("users", "POST", user));
  }

  /* 2. GET /users/{clerkId} */
  static async getByClerkId(clerkId: string) {
    return safe<User>(customAuthFetch<User>(`users/${clerkId}`, "GET"));
  }

  /* 3. PUT /users/{id} – update */
  static async update(id: string, update: UpdateUser) {
    return safe<User>(customAuthFetch<User>(`users/${id}`, "PUT", update));
  }

  /* 4. DELETE /users/{id} */
  static async remove(id: string) {
    return safe<void>(customAuthFetch<void>(`users/${id}`, "DELETE"));
  }
}
