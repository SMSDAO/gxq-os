import { AppID } from '../../types/os';

export interface PromptContext {
  user: {
    displayName: string | null;
    email: string | null;
    role: string;
    orgName?: string;
  };
  activeWindow?: {
    id: AppID;
    title: string;
  };
  systemStatus: {
    memoryUsage: string;
    diskSpace: string;
    uptime: string;
  };
  recentLogs?: string[];
  knowledgeBase?: string;
}

export type PromptMode = 'COPILOT' | 'CODE_ASSISTANT';

export class PromptEngine {
  private static templates = {
    system: `You are the Dragon Core OS AI Copilot (v16.0.0). 
You assist elite users with cloud desktop operations, security simulations, and code development.
Theme: Cyber-futuristic, professional, concise, and helpful.

CURRENT USER CONTEXT:
- Name: {{userName}}
- Role: {{userRole}}
- Organization: {{orgName}}

SYSTEM STATE:
- Active Module: {{activeModule}}
- Memory: {{memory}}
- Storage: {{storage}}
- Uptime: {{uptime}}

{{knowledgeSection}}

{{logsSection}}

Respond in the style of an advanced AI operative.`,

    codeAssistant: `You are the Dragon Core Code Studio AI Assistant.
Expertise: Systems programming (C, C++, Rust), Web (TypeScript, React), and Security Engineering.

PROJECT CONTEXT:
{{projectContext}}

VIRTUAL FILE SYSTEM STATE:
{{vfsState}}

TASK:
You are helping the user with their current codebase in Code Studio.
Provide clean, efficient, and secure code solutions.
Always explain your reasoning and potential security implications.`,

    userRequest: `[REQUEST] {{userInput}}`
  };

  static buildPrompt(userInput: string, context: PromptContext, mode: PromptMode = 'COPILOT'): string {
    let baseSystem = mode === 'CODE_ASSISTANT' ? this.templates.codeAssistant : this.templates.system;
    
    let prompt = baseSystem
      .replace('{{userName}}', context.user.displayName || 'Operative')
      .replace('{{userRole}}', context.user.role)
      .replace('{{orgName}}', context.user.orgName || 'Independent')
      .replace('{{activeModule}}', context.activeWindow?.title || 'Desktop Shell')
      .replace('{{memory}}', context.systemStatus.memoryUsage)
      .replace('{{storage}}', context.systemStatus.diskSpace)
      .replace('{{uptime}}', context.systemStatus.uptime);

    const knowledgeSection = context.knowledgeBase 
      ? `\nRETRIEVED KNOWLEDGE (RAG):\n${context.knowledgeBase}\n`
      : '';
    
    if (mode === 'COPILOT') {
      prompt = prompt.replace('{{knowledgeSection}}', knowledgeSection);
      const logsSection = context.recentLogs && context.recentLogs.length > 0
        ? `\nRECENT SYSTEM LOGS:\n${context.recentLogs.join('\n')}\n`
        : '';
      prompt = prompt.replace('{{logsSection}}', logsSection);
    } else {
      // For Code Assistant, we might want to inject file contents
      prompt = prompt.replace('{{projectContext}}', knowledgeSection || 'Main Dragon Core Repository');
      prompt = prompt.replace('{{vfsState}}', context.activeWindow?.title === 'Code Studio' ? 'Currently editing kernel_v16.c' : 'Idle');
    }

    return prompt + '\n\n' + this.templates.userRequest.replace('{{userInput}}', userInput);
  }
}
