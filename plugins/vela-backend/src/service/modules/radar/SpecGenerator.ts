import { Config } from '@backstage/config';

export interface GenerationRequest {
  content: string;
  type: 'requirements' | 'design' | 'tasks';
  model: string;
  context?: {
    requirements?: string;
    design?: string;
  };
}

export interface GenerationResponse {
  document: string;
  model: string;
  tokensUsed: number;
}

export class SpecGenerator {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    this.apiKey =
      config.getOptionalString('vela.openrouter.apiKey') ||
      process.env.OPENROUTER_API_KEY ||
      '';
    this.baseUrl = 'https://openrouter.ai/api/v1';

    console.log('SpecGenerator initialized');
    console.log(
      'OpenRouter API Key:',
      this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT FOUND',
    );
  }

  private async callOpenRouter(
    prompt: string,
    model: string,
    maxTokens: number = 4000,
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    console.log('Calling OpenRouter with model:', model);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/vela-platform',
        'X-Title': 'VELA Platform - OpenSpec Generator',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter API error:', response.status, err);
      throw new Error(`OpenRouter API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received');

    return {
      content: data.choices?.[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens || 0,
    };
  }

  private getRequirementsPrompt(content: string): string {
    return `You are a technical requirements analyst. Based on the following content extracted from a website or documentation, generate a comprehensive Requirements Document.

The requirements document should follow this structure:

# Requirements Document

## Introduction
[Brief overview of what the system/feature does]

## Glossary
- **Term**: Definition
[Define all technical terms and system names]

## Requirements

### Requirement 1
**User Story:** As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria
1. WHEN [event] THEN the system SHALL [response]
2. WHILE [state] THE system SHALL [response]
3. IF [condition] THEN the system SHALL [response]
[Continue with more criteria]

[Continue with more requirements...]

---

Content to analyze:
${content.substring(0, 8000)}

Generate a well-structured requirements document with clear user stories and EARS-compliant acceptance criteria.`;
  }

  private getDesignPrompt(content: string, requirements?: string): string {
    const contextSection = requirements
      ? `\n\nExisting Requirements Document:\n${requirements.substring(0, 4000)}\n`
      : '';

    return `You are a software architect. Based on the following content${requirements ? ' and requirements document' : ''}, generate a comprehensive Design Document.

The design document should follow this structure:

# Design Document

## Overview
[High-level description of the system architecture]

## Architecture
[Describe the overall architecture with diagrams if applicable]

## Components and Interfaces
[Detail each major component and their interfaces]

## Data Models
[Define data structures and relationships]

## Error Handling
[Describe error handling strategy]

## Testing Strategy
[Outline testing approach]

---

Content to analyze:
${content.substring(0, 6000)}${contextSection}

Generate a detailed design document with clear architecture and component descriptions.`;
  }

  private getTasksPrompt(
    content: string,
    requirements?: string,
    design?: string,
  ): string {
    const contextSection = `
${requirements ? `\nRequirements Document:\n${requirements.substring(0, 3000)}\n` : ''}
${design ? `\nDesign Document:\n${design.substring(0, 3000)}\n` : ''}
`;

    return `You are a technical project manager. Based on the following content, requirements, and design, generate an Implementation Plan with actionable tasks.

The implementation plan should follow this structure:

# Implementation Plan

- [ ] 1. Task name
  - Detailed description
  - Specific files or components to create/modify
  - _Requirements: X.X, Y.Y_

- [ ] 2. Another task
  - [ ] 2.1 Sub-task
    - Details
    - _Requirements: X.X_
  - [ ] 2.2 Another sub-task
    - Details
    - _Requirements: Y.Y_

[Continue with more tasks...]

---

Content to analyze:
${content.substring(0, 4000)}${contextSection}

Generate a comprehensive task list with clear, actionable items that can be executed by a development team. Focus on implementation tasks (writing code, creating components, etc.).`;
  }

  async generateSpec(
    request: GenerationRequest,
  ): Promise<GenerationResponse> {
    let prompt: string;
    let maxTokens = 4000;

    switch (request.type) {
      case 'requirements':
        prompt = this.getRequirementsPrompt(request.content);
        maxTokens = 4000;
        break;
      case 'design':
        prompt = this.getDesignPrompt(
          request.content,
          request.context?.requirements,
        );
        maxTokens = 5000;
        break;
      case 'tasks':
        prompt = this.getTasksPrompt(
          request.content,
          request.context?.requirements,
          request.context?.design,
        );
        maxTokens = 4000;
        break;
      default:
        throw new Error(`Unknown generation type: ${request.type}`);
    }

    const result = await this.callOpenRouter(prompt, request.model, maxTokens);

    return {
      document: result.content,
      model: request.model,
      tokensUsed: result.tokensUsed,
    };
  }
}
