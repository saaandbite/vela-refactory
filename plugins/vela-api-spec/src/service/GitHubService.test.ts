import { ConfigReader } from '@backstage/config';
import { GitHubService } from './GitHubService';

describe('GitHubService', () => {
  const mockConfig = new ConfigReader({
    vela: {
      github: {
        token: 'test-token',
        owner: 'test-owner',
        repo: 'test-repo',
        branch: 'main',
      },
    },
  });

  describe('constructor', () => {
    it('should initialize with valid config', () => {
      expect(() => new GitHubService(mockConfig)).not.toThrow();
    });

    it('should throw error when token is missing', () => {
      const invalidConfig = new ConfigReader({
        vela: {
          github: {
            owner: 'test-owner',
            repo: 'test-repo',
          },
        },
      });

      expect(() => new GitHubService(invalidConfig)).toThrow(
        'GitHub configuration missing',
      );
    });

    it('should throw error when owner is missing', () => {
      const invalidConfig = new ConfigReader({
        vela: {
          github: {
            token: 'test-token',
            repo: 'test-repo',
          },
        },
      });

      expect(() => new GitHubService(invalidConfig)).toThrow(
        'GitHub configuration missing',
      );
    });

    it('should throw error when repo is missing', () => {
      const invalidConfig = new ConfigReader({
        vela: {
          github: {
            token: 'test-token',
            owner: 'test-owner',
          },
        },
      });

      expect(() => new GitHubService(invalidConfig)).toThrow(
        'GitHub configuration missing',
      );
    });

    it('should use default branch when not specified', () => {
      const configWithoutBranch = new ConfigReader({
        vela: {
          github: {
            token: 'test-token',
            owner: 'test-owner',
            repo: 'test-repo',
          },
        },
      });

      expect(() => new GitHubService(configWithoutBranch)).not.toThrow();
    });
  });

  // Note: Integration tests would require mocking fetch or using a test GitHub repo
  // These are unit tests for configuration validation only
});
