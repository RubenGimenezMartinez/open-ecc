import * as fs from 'fs';
import * as path from 'path';

interface AgentContentInput {
  description: string;
  model: string;
  agentName?: string;
}

export class AgentContentGenerator {
  private agentsDir: string;

  constructor(agentsDir?: string) {
    this.agentsDir = agentsDir || path.resolve(__dirname, '../../../../../agents');
  }

  generateContent(agentName: string, input: AgentContentInput): string {
    const agentFilePath = path.join(this.agentsDir, `${agentName}.md`);

    if (!fs.existsSync(agentFilePath)) {
      return '';
    }

    const fileContent = fs.readFileSync(agentFilePath, 'utf-8');
    const content = this.extractContentAfterFrontmatter(fileContent);

    return this.replaceTemplateVariables(content, {
      ...input,
      agentName,
    });
  }

  private extractContentAfterFrontmatter(fileContent: string): string {
    const frontmatterRegex = /^---[\s\S]*?^---$/m;
    const withoutFrontmatter = fileContent.replace(frontmatterRegex, '').trim();

    if (!withoutFrontmatter) {
      return fileContent.trim();
    }

    return withoutFrontmatter;
  }

  private replaceTemplateVariables(
    content: string,
    variables: Record<string, string>,
  ): string {
    let result = content;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }

    return result;
  }
}
