import { CreateUser, UpdateUser, User } from "@/types/User";
import { safe } from "@/utils/errors";
import { customAuthFetch } from "./utils";

export class UserService {
  /* 1. POST /users – create */
  static async create(user: CreateUser) {
    const res = await safe<{ data: User }>(
      customAuthFetch("users", "POST", user)
    );
    return res?.data ?? null;
  }

  /* 2. GET /users/{clerkId} */
  static async getByClerkId(clerkId: string) {
    const res = await safe<{ data: User }>(
      customAuthFetch(`users/${clerkId}`, "GET")
    );
    return res?.data ?? null;
  }

  /* 3. PUT /users/{id} – update */
  static async update(id: string, update: UpdateUser) {
    const res = await safe<{ data: User }>(
      customAuthFetch(`users/${id}`, "PUT", update)
    );
    return res?.data ?? null;
  }

  /* 4. DELETE /users/{id} */
  static async remove(id: string) {
    return safe<void>(customAuthFetch(`users/${id}`, "DELETE"));
  }

  /* 5. GET /users/login – login */
  static async login() {
    const res = await safe<{ data: User }>(
      customAuthFetch(`users/login`, "GET")
    );
    return res?.data ?? null;
  }
}
