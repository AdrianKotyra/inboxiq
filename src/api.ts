import type { Lead, Message } from "./types";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

async function sendJson<T>(
  url: string,
  options: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  listMessages: () =>
    getJson<Message[]>("/api/messages"),

  getMessage: (messageId: string) =>
    getJson<Message>(
      `/api/messages/${encodeURIComponent(messageId)}`,
    ),

  listLeads: () =>
    getJson<Lead[]>("/api/leads"),

  extractLead: (messageId: string) =>
    sendJson<{
      product?: string;
      quantity?: number | null;
      material?: string | null;
      budget?: number | null;
    }>("/api/ai/extract", {
      method: "POST",
      body: JSON.stringify({ messageId }),
    }),

  createLead: (data: {
    sourceMessageId: string;
    product: string;
    quantity: number;
    material?: string | null;
    budget?: number | null;
  }) =>
    sendJson<Lead>("/api/leads", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateLeadStatus: (leadId: string, status: "CONTACTED") =>
    sendJson<Lead>(
      `/api/leads/${encodeURIComponent(leadId)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    ),
};