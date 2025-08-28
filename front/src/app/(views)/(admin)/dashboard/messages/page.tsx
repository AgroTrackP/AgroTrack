import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import MessagesClient from "./components/MessagesClient"; // <- Client Component

interface IMessage {
  id: string;
  email: string;
  description: string;
  createdAt: string;
}

async function getMessages(token: string): Promise<IMessage[]> {
  const res = await fetch("https://agrotrack-develop.onrender.com/contact", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar mensajes");
  return res.json();
}

export default async function MessagesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  let messages: IMessage[] = [];
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "Admin") redirect("/");

    messages = await getMessages(token);
  } catch (err) {
    console.error("Error al verificar token o cargar mensajes:", err);
    redirect("/login");
  }

  return <MessagesClient messages={messages} token={token} />;
}
