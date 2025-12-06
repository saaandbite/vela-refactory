/**
 * Utility functions to convert JSON to YAML format
 */

export class FormatConverter {
  /**
   * Convert JSON object to YAML string
   */
  static toYAML(obj: any, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    let yaml = '';

    if (obj === null || obj === undefined) {
      return 'null';
    }

    if (typeof obj !== 'object') {
      if (typeof obj === 'string') {
        // Handle multiline strings
        if (obj.includes('\n')) {
          return `|\n${spaces}  ${obj.split('\n').join(`\n${spaces}  `)}`;
        }
        // Escape special characters
        if (
          obj.includes(':') ||
          obj.includes('#') ||
          obj.includes('[') ||
          obj.includes(']')
        ) {
          return `"${obj.replace(/"/g, '\\"')}"`;
        }
        return obj;
      }
      return String(obj);
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return '[]';
      }
      obj.forEach(item => {
        if (typeof item === 'object' && !Array.isArray(item)) {
          yaml += `\n${spaces}- `;
          const itemYaml = this.toYAML(item, indent + 1);
          const lines = itemYaml.split('\n');
          yaml += lines[0];
          for (let i = 1; i < lines.length; i++) {
            yaml += `\n${spaces}  ${lines[i]}`;
          }
        } else {
          yaml += `\n${spaces}- ${this.toYAML(item, indent + 1)}`;
        }
      });
      return yaml;
    }

    // Handle objects
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      return '{}';
    }

    keys.forEach((key, index) => {
      const value = obj[key];
      const yamlValue = this.toYAML(value, indent + 1);

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        yaml += `${index > 0 ? '\n' : ''}${spaces}${key}:`;
        if (Object.keys(value).length > 0) {
          yaml += `\n${spaces}  ${yamlValue.split('\n').join(`\n${spaces}  `)}`;
        } else {
          yaml += ' {}';
        }
      } else if (Array.isArray(value)) {
        yaml += `${index > 0 ? '\n' : ''}${spaces}${key}:`;
        if (value.length > 0) {
          yaml += yamlValue;
        } else {
          yaml += ' []';
        }
      } else {
        yaml += `${index > 0 ? '\n' : ''}${spaces}${key}: ${yamlValue}`;
      }
    });

    return yaml;
  }

  /**
   * Format response with both JSON and YAML versions
   */
  static formatResponse(data: any): {
    json: any;
    yaml: string;
    jsonString: string;
  } {
    const jsonString = JSON.stringify(data, null, 2);
    const yaml = this.toYAML(data);

    return {
      json: data,
      yaml: yaml,
      jsonString: jsonString,
    };
  }

  /**
   * Create downloadable format response
   */
  static createDownloadableResponse(data: any, filename: string = 'output') {
    const formatted = this.formatResponse(data);
    return {
      ...formatted,
      downloads: {
        json: {
          filename: `${filename}.json`,
          content: formatted.jsonString,
          mimeType: 'application/json',
        },
        yaml: {
          filename: `${filename}.yaml`,
          content: formatted.yaml,
          mimeType: 'text/yaml',
        },
      },
    };
  }
}
