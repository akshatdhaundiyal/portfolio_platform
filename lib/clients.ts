import { initialClients, type ClientItem } from "./data/clients";

// Runtime memory store with initial seeded clients
let memoryClients: ClientItem[] = [...initialClients];

export async function getAllClients(): Promise<ClientItem[]> {
  return memoryClients;
}

export async function getClientById(id: string): Promise<ClientItem | null> {
  return memoryClients.find((c) => c.id === id) || null;
}

export async function createClient(data: Partial<ClientItem>): Promise<ClientItem> {
  const newClient: ClientItem = {
    id: data.id || `client-${Date.now()}`,
    company: data.company || "New Enterprise Partner",
    contactName: data.contactName || "Technical Director",
    email: data.email || "contact@client.org",
    role: data.role || "Lead Architect",
    status: data.status || "Active",
    assignedProjects: data.assignedProjects || [],
    totalBilled: data.totalBilled || "$0",
    notes: data.notes || "",
    createdAt: new Date().toISOString().split("T")[0],
  };

  memoryClients.unshift(newClient);
  return newClient;
}

export async function updateClient(id: string, updates: Partial<ClientItem>): Promise<ClientItem | null> {
  const idx = memoryClients.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  memoryClients[idx] = {
    ...memoryClients[idx],
    ...updates,
  };
  return memoryClients[idx];
}

export async function deleteClient(id: string): Promise<boolean> {
  const initialLen = memoryClients.length;
  memoryClients = memoryClients.filter((c) => c.id !== id);
  return memoryClients.length < initialLen;
}
