import { Alert } from "react-native";

export const showError = (msg: string) => Alert.alert("Error", msg);

export async function safe<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch (err: any) {
    console.log(err);
    const msg = err.response?.data?.error?.message;
    showError(msg);
    return null;
  }
}
