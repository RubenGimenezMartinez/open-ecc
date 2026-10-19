import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { AgentContentGenerator } from './agentContentGenerator';

vi.mock('fs', () => {
  const actual = vi.importActual<typeof fs>('fs');
  return {
    ...actual,
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  };
});

const mockReadFileSync = vi.mocked(fs.readFileSync);
const mockExistsSync = vi.mocked(fs.existsSync);

const plannerContent = `---
name: planner
description: Expert planning specialist
---
You are an expert planning specialist. Create a detailed implementation plan for the project described below.

Project: {{description}}
Model: {{model}}

Please generate a comprehensive plan with phases, steps, and deliverables.
`;

const architectContent = `---
name: architect
description: Software architecture specialist
---
You are a senior software architect. Design the architecture for the project.

Project: {{description}}
Model: {{model}}

Provide architecture decisions, component responsibilities, and technical stack recommendations.
`;

const codeReviewerContent = `---
name: code-reviewer
description: Expert code review specialist
---
You are a senior code reviewer. Review the implementation plan and architecture for the project.

Project: {{description}}
Model: {{model}}

Provide code quality recommendations, security considerations, and best practices.
`;

const tddGuideContent = `---
name: tdd-guide
description: TDD specialist
---
You are a TDD specialist. Create a test-driven development plan for the project.

Project: {{description}}
Model: {{model}}

Define test strategy, coverage targets, and test types needed.
`;

const securityReviewerContent = `---
name: security-reviewer
description: Security vulnerability detection specialist
---
You are a security specialist. Review the project for security vulnerabilities.

Project: {{description}}
Model: {{model}}

Identify security risks, recommend mitigations, and provide a security checklist.
`;

const buildErrorResolverContent = `---
name: build-error-resolver
description: Build error resolution specialist
---
You are a build error resolver. Anticipate and resolve potential build issues.

Project: {{description}}
Model: {{model}}

Identify potential TypeScript errors, dependency issues, and configuration problems.
`;

const e2eRunnerContent = `---
name: e2e-runner
description: E2E testing specialist
---
You are an E2E testing specialist. Create end-to-end test scenarios for the project.

Project: {{description}}
Model: {{model}}

Define critical user journeys, test scenarios, and automation strategy.
`;

describe('AgentContentGenerator', () => {
  let generator: AgentContentGenerator;

  beforeEach(() => {
    vi.clearAllMocks();
    generator = new AgentContentGenerator();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate planner content from agent definition', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(plannerContent);

    const result = generator.generateContent('planner', {
      description: 'Calculadora para Windows',
      model: 'nemotron-3.5-super-vl',
    });

    expect(result).toContain('Calculadora para Windows');
    expect(result).toContain('nemotron-3.5-super-vl');
    expect(result).toContain('implementation plan');
  });

  it('should generate architect content from agent definition', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(architectContent);

    const result = generator.generateContent('architect', {
      description: 'Calculadora para Windows',
      model: 'nemotron-3.5-super-vl',
    });

    expect(result).toContain('Calculadora para Windows');
    expect(result).toContain('architecture');
  });

  it('should generate code-reviewer content from agent definition', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(codeReviewerContent);

    const result = generator.generateContent('code-reviewer', {
      description: 'Calculadora para Windows',
      model: 'nemotron-3.5-super-vl',
    });

    expect(result).toContain('Calculadora para Windows');
    expect(result).toContain('code quality');
  });

  it('should generate tdd-guide content from agent definition', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(tddGuideContent);

    const result = generator.generateContent('tdd-guide', {
      description: 'Calculadora para Windows',
      model: 'nemotron-3.5-super-vl',
    });

    expect(result).toContain('Calculadora para Windows');
    expect(result).toContain('test');
  });

  it('should generate security-reviewer content from agent definition', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(securityReviewerContent);

    const result = generator.generateContent('security-reviewer', {
      description: 'Calculadora para Windows',
      model: 'nemotron-3.5-super-vl',
    });

    expect(result).toContain('Calculadora para Windows');
    expect(result).toContain('security');
  });

  it('should generate build-error-resolver content from agent definition', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(buildErrorResolverContent);

    const result = generator.generateContent('build-error-resolver', {
      description: 'Calculadora para Windows',
      model: 'nemotron-3.5-super-vl',
    });

    expect(result).toContain('Calculadora para Windows');
    expect(result).toContain('build');
  });

  it('should generate e2e-runner content from agent definition', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(e2eRunnerContent);

    const result = generator.generateContent('e2e-runner', {
      description: 'Calculadora para Windows',
      model: 'nemotron-3.5-super-vl',
    });

    expect(result).toContain('Calculadora para Windows');
    expect(result).toContain('E2E');
  });

  it('should return empty string when agent file does not exist', () => {
    mockExistsSync.mockReturnValue(false);

    const result = generator.generateContent('nonexistent-agent', {
      description: 'Test',
      model: 'test-model',
    });

    expect(result).toBe('');
  });

  it('should read agent file from agents directory', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(plannerContent);

    generator.generateContent('planner', {
      description: 'Test',
      model: 'test',
    });

    expect(mockReadFileSync).toHaveBeenCalledWith(
      expect.stringContaining(path.join('agents', 'planner.md')),
      'utf-8',
    );
  });

  it('should replace all template variables in content', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      'Project: {{description}}\nModel: {{model}}\nAgent: {{agentName}}',
    );

    const result = generator.generateContent('planner', {
      description: 'Mi proyecto',
      model: 'mi-modelo',
      agentName: 'planner',
    });

    expect(result).toContain('Project: Mi proyecto');
    expect(result).toContain('Model: mi-modelo');
    expect(result).toContain('Agent: planner');
  });
});
