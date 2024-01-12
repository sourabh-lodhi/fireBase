"use server";
import { cookies } from "next/dist/client/components/headers";
export async function getTokenFromCookies(name) {
  const cookiesToken = cookies().get(name);
  return cookiesToken;
}

export async function addItemInCookies(name, value) {
  cookies().set(name, value);
}

export async function deleteItemInCookies(name) {
  cookies().set({
    name,
    value: "",
    expires: 0,
    path: "/",
  });
}
