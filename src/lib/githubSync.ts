import { db } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  default_branch: string;
}

export class GitHubSyncService {
  private static GITHUB_API = 'https://api.github.com';

  static async fetchUserRepos(accessToken: string): Promise<GitHubRepo[]> {
    const res = await fetch(`${this.GITHUB_API}/user/repos?sort=updated`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch GitHub repositories');
    return res.json();
  }

  static async syncRepoToVFS(accessToken: string, repo: GitHubRepo, userId: string) {
    // 1. Fetch repo content (recursive)
    const res = await fetch(`${this.GITHUB_API}/repos/${repo.full_name}/contents?ref=${repo.default_branch}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const contents = await res.json();

    // 2. Map to VFS nodes in Firestore
    for (const item of contents) {
      const nodeId = `gh_${repo.id}_${item.path.replace(/\//g, '_')}`;
      await setDoc(doc(db, 'files', nodeId), {
        id: nodeId,
        name: item.name,
        type: item.type === 'dir' ? 'folder' : 'file',
        parentId: 'root', // For simplified demo, we put them in root or a specific GH folder
        content: item.type === 'file' ? `[GITHUB_REF:${item.sha}]` : '',
        ownerId: userId,
        mimeType: item.type === 'file' ? 'text/plain' : 'inode/directory',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          source: 'github',
          repoId: repo.id,
          sha: item.sha,
          download_url: item.download_url
        }
      });
    }
  }

  static async pushFileToGitHub(accessToken: string, repoFullName: string, path: string, content: string, sha: string, message: string) {
    const res = await fetch(`${this.GITHUB_API}/repos/${repoFullName}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        content: btoa(content), // GitHub expects base64
        sha
      })
    });
    if (!res.ok) throw new Error('Failed to push file to GitHub');
    return res.json();
  }
}
