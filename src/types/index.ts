// AI Provider types
export interface AIProvider {
  name: string;
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  tools: Tool[];
  metadata?: Record<string, any>;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  handler: (input: any) => Promise<any>;
}

// MCP types
export interface MCPRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: string;
  id: string | number;
  result?: any;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

// Editor types
export interface EditorTab {
  id: string;
  filePath: string;
  content: string;
  isDirty: boolean;
  language: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  toolName: string;
  input: any;
  result?: any;
  error?: string;
}
