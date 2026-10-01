import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export type FeatureFlagScope = 'GLOBAL' | 'ORG' | 'WORKSPACE';

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  scope: FeatureFlagScope;
  targetId?: string;
  description?: string;
}

export class FeatureFlagSystem {
  private static flags: Map<string, boolean> = new Map();

  static async loadFlags(orgId?: string, workspaceId?: string) {
    const flagsCollection = collection(db, 'feature_flags');
    
    // Load global flags
    const globalQuery = query(flagsCollection, where('scope', '==', 'GLOBAL'));
    const globalSnap = await getDocs(globalQuery);
    globalSnap.forEach(doc => {
      const data = doc.data() as FeatureFlag;
      this.flags.set(data.key, data.enabled);
    });

    // Load org flags
    if (orgId) {
      const orgQuery = query(flagsCollection, where('scope', '==', 'ORG'), where('targetId', '==', orgId));
      const orgSnap = await getDocs(orgQuery);
      orgSnap.forEach(doc => {
        const data = doc.data() as FeatureFlag;
        this.flags.set(`${data.key}:${orgId}`, data.enabled);
      });
    }

    // Load workspace flags
    if (workspaceId) {
      const wsQuery = query(flagsCollection, where('scope', '==', 'WORKSPACE'), where('targetId', '==', workspaceId));
      const wsSnap = await getDocs(wsQuery);
      wsSnap.forEach(doc => {
        const data = doc.data() as FeatureFlag;
        this.flags.set(`${data.key}:${workspaceId}`, data.enabled);
      });
    }
  }

  static isEnabled(key: string, orgId?: string, workspaceId?: string): boolean {
    // Check hierarchy: Workspace > Org > Global
    if (workspaceId && this.flags.has(`${key}:${workspaceId}`)) {
      return this.flags.get(`${key}:${workspaceId}`)!;
    }
    if (orgId && this.flags.has(`${key}:${orgId}`)) {
      return this.flags.get(`${key}:${orgId}`)!;
    }
    return this.flags.get(key) || false;
  }
}
