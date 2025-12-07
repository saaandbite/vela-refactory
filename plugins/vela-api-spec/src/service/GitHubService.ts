import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
}

interface GitHubFile {
  path: string;
  content: string;
  message: string;
  branch?: string;
  sha?: string;
}

interface GitHubFileResponse {
  content: string;
  sha: string;
  path: string;
  url: string;
}

/**
 * Service untuk integrasi dengan GitHub API
 * Menyediakan fungsi untuk menyimpan dan membaca konfigurasi dari GitHub repository
 */
export class GitHubService {
  private readonly baseUrl = 'https://api.github.com';
  private config: GitHubConfig;

  constructor(config: Config) {
    const token = config.getOptionalString('vela.github.token');
    const owner = config.getOptionalString('vela.github.owner');
    const repo = config.getOptionalString('vela.github.repo');
    const branch = config.getOptionalString('vela.github.branch') || 'main';

    console.log('GitHubService config:', {
      hasToken: !!token,
      tokenPrefix: token?.substring(0, 10),
      owner,
      repo,
      branch,
    });

    if (!token || !owner || !repo) {
      throw new InputError(
        'GitHub configuration missing. Please set vela.github.token, vela.github.owner, and vela.github.repo in app-config.yaml',
      );
    }

    this.config = { token, owner, repo, branch };
  }

  /**
   * Menyimpan file ke GitHub repository
   */
  async saveFile(file: GitHubFile): Promise<GitHubFileResponse> {
    const { path, content, message, branch, sha } = file;
    const targetBranch = branch || this.config.branch;

    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

    const body: any = {
      message,
      content: Buffer.from(content).toString('base64'),
      branch: targetBranch,
    };

    // Jika ada SHA, berarti update file yang sudah ada
    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to save file to GitHub: ${error}`);
    }

    const result = await response.json();
    return {
      content: result.content.content,
      sha: result.content.sha,
      path: result.content.path,
      url: result.content.html_url,
    };
  }

  /**
   * Membaca file dari GitHub repository
   */
  async getFile(path: string, branch?: string): Promise<GitHubFileResponse> {
    const targetBranch = branch || this.config.branch;
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${targetBranch}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new InputError(`File not found: ${path}`);
      }
      const error = await response.text();
      throw new Error(`Failed to get file from GitHub: ${error}`);
    }

    const result = await response.json();
    return {
      content: Buffer.from(result.content, 'base64').toString('utf-8'),
      sha: result.sha,
      path: result.path,
      url: result.html_url,
    };
  }

  /**
   * List files dalam direktori
   */
  async listFiles(
    path: string = '',
    branch?: string,
  ): Promise<Array<{ name: string; path: string; type: string; sha: string }>> {
    const targetBranch = branch || this.config.branch;
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${targetBranch}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to list files from GitHub: ${error}`);
    }

    const result = await response.json();
    return Array.isArray(result)
      ? result.map(item => ({
          name: item.name,
          path: item.path,
          type: item.type,
          sha: item.sha,
        }))
      : [];
  }

  /**
   * Hapus file dari repository
   */
  async deleteFile(
    path: string,
    message: string,
    sha: string,
    branch?: string,
  ): Promise<void> {
    const targetBranch = branch || this.config.branch;
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sha,
        branch: targetBranch,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete file from GitHub: ${error}`);
    }
  }

  /**
   * Get repository info
   */
  async getRepoInfo(): Promise<{
    name: string;
    owner: string;
    branch: string;
    url: string;
  }> {
    const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get repository info: ${error}`);
    }

    const result = await response.json();
    return {
      name: result.name,
      owner: result.owner.login,
      branch: this.config.branch || 'main',
      url: result.html_url,
    };
  }
}
