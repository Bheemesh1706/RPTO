import Dexie, { Table } from 'dexie';
import { Lead } from '../types/lead';

class RPTOLeadsDB extends Dexie {
  leads!: Table<Lead, string>;

  constructor() {
    super('RPTOLeadsDB');
    this.version(1).stores({
      leads: 'id, status, created_at, name, place, phone'
    });
  }
}

const db = new RPTOLeadsDB();

export async function getLeads(): Promise<Lead[]> {
  return await db.leads.toArray();
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<string> {
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  const newLead: Lead = {
    ...lead,
    id,
    created_at
  };
  await db.leads.add(newLead);
  return id;
}

export async function updateLead(id: string, updates: Partial<Omit<Lead, 'id' | 'created_at'>>): Promise<void> {
  await db.leads.update(id, updates);
}

export async function deleteLead(id: string): Promise<void> {
  await db.leads.delete(id);
}

export async function bulkInsertLeads(leads: Omit<Lead, 'id' | 'created_at'>[]): Promise<number> {
  const leadsWithIds = leads.map(lead => ({
    ...lead,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  }));
  await db.leads.bulkAdd(leadsWithIds);
  return leadsWithIds.length;
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  return await db.leads.get(id);
}

export { db };

