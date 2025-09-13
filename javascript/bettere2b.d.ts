/**
 * Your E2B Clone SDK - TypeScript Definitions
 * 
 * Drop-in replacement for @e2b/code-interpreter
 * with dynamic subdomain support!
 */

export interface SandboxOptions {
  /** Sandbox name */
  name?: string;
  /** Runtime type (static, react, python, etc.) */
  runtime?: string;
  /** Sandbox description */
  description?: string;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Server URL (default: http://localhost:8083) */
  serverUrl?: string;
  /** API key for authentication */
  apiKey?: string;
}

export interface ExecutionResult {
  /** Output text from code execution */
  text: string;
  /** Execution logs */
  logs: {
    stdout: string[];
    stderr: string[];
  };
  /** Error message if execution failed */
  error?: string | null;
  /** Exit code */
  exitCode: number;
  /** Execution time in milliseconds */
  executionTime: number;
}

export interface SandboxUrls {
  /** Preview URL */
  preview: string;
  /** Sandbox URL */
  sandbox: string;
  /** Live URL (if applicable) */
  live?: string | null;
  /** Vite URL (if applicable) */
  vite?: string | null;
  /** Dynamic subdomain URL */
  subdomain: string;
  /** Path-based URL */
  path: string;
  /** Redirect information */
  redirect: string;
}

export interface DynamicSubdomain {
  /** Format string */
  format: string;
  /** Example URL */
  example: string;
  /** Port-ID combination */
  portId: string;
}

export interface SandboxData {
  /** Sandbox ID */
  sandboxId: string;
  /** Sandbox name */
  name: string;
  /** Sandbox description */
  description: string;
  /** Success status */
  success: boolean;
  /** Runtime type */
  runtime: string;
  /** Sandbox status */
  status: string;
  /** Port number */
  port?: number | null;
  /** Current server port */
  currentServerPort: number;
  /** Available URLs */
  urls: SandboxUrls;
  /** Dynamic subdomain configuration */
  dynamicSubdomain: DynamicSubdomain;
}

export interface FileInfo {
  /** File name */
  name: string;
  /** File path */
  path: string;
  /** File size */
  size: number;
  /** Is directory */
  isDirectory: boolean;
  /** Last modified timestamp */
  lastModified: number;
}

export interface InstallResult {
  /** Success status */
  success: boolean;
  /** Installed packages */
  packages: string[];
  /** Package manager used */
  manager: string;
  /** Installation output */
  output: string;
  /** Error message if failed */
  error?: string;
}

export interface WriteFileResult {
  /** Success status */
  success: boolean;
  /** File path */
  filePath: string;
  /** File size */
  size: number;
  /** Error message if failed */
  error?: string;
}

export interface SandboxStatus {
  /** Success status */
  success: boolean;
  /** Sandbox ID */
  sandboxId: string;
  /** Sandbox status */
  status: string;
  /** Runtime type */
  runtime: string;
  /** Port number */
  port?: number | null;
  /** Created timestamp */
  createdAt: number;
  /** Last used timestamp */
  lastUsed?: number | null;
}

export interface SubdomainConfig {
  /** Success status */
  success: boolean;
  /** Port-ID combination */
  portId: string;
  /** Port number */
  port: number;
  /** Sandbox ID */
  sandboxId: string;
  /** Available URLs */
  urls: SandboxUrls;
  /** Format string */
  format: string;
  /** Example URL */
  example: string;
}

export declare class Sandbox {
  /** Sandbox ID */
  readonly sandboxId: string;
  /** Server URL */
  readonly serverUrl: string;
  /** Sandbox options */
  readonly options: SandboxOptions;
  /** Timeout in milliseconds */
  timeout: number;
  /** Created timestamp */
  readonly createdAt: number;
  /** Dynamic subdomain configuration */
  dynamicSubdomain?: DynamicSubdomain;
  /** Available URLs */
  urls?: SandboxUrls;

  /**
   * Create a new sandbox
   * @param options - Sandbox options
   * @returns Promise<Sandbox> New sandbox instance
   */
  static create(options?: SandboxOptions): Promise<Sandbox>;

  /**
   * Execute code in the sandbox
   * @param code - Code to execute
   * @param language - Programming language (python, javascript, bash)
   * @returns Promise<ExecutionResult> Execution result
   */
  runCode(code: string, language?: string): Promise<ExecutionResult>;

  /**
   * Get sandbox host URL (equivalent to E2B's getHost)
   * @param port - Port number (optional)
   * @returns string Host URL
   */
  getHost(port?: number): string;

  /**
   * Get dynamic subdomain URL
   * @returns string | null Dynamic subdomain URL or null
   */
  getSubdomainUrl(): string | null;

  /**
   * Get path-based URL
   * @returns string | null Path-based URL or null
   */
  getPathUrl(): string | null;

  /**
   * Set sandbox timeout
   * @param timeoutMs - Timeout in milliseconds
   */
  setTimeout(timeoutMs: number): void;

  /**
   * Extend sandbox timeout
   * @param extensionMs - Extension in milliseconds
   */
  extendTimeout(extensionMs: number): Promise<void>;

  /**
   * Install packages in the sandbox
   * @param packages - Package name(s) to install
   * @param manager - Package manager (pip, npm, yarn)
   * @returns Promise<InstallResult> Installation result
   */
  install(packages: string | string[], manager?: string): Promise<InstallResult>;

  /**
   * Write file to sandbox
   * @param filePath - File path
   * @param content - File content
   * @returns Promise<WriteFileResult> Write result
   */
  writeFile(filePath: string, content: string): Promise<WriteFileResult>;

  /**
   * Read file from sandbox
   * @param filePath - File path
   * @returns Promise<string> File content
   */
  readFile(filePath: string): Promise<string>;

  /**
   * List files in sandbox
   * @param directory - Directory path (optional)
   * @returns Promise<FileInfo[]> File list
   */
  listFiles(directory?: string): Promise<FileInfo[]>;

  /**
   * Kill/terminate the sandbox
   * @returns Promise<object> Kill result
   */
  kill(): Promise<object>;

  /**
   * Get sandbox status
   * @returns Promise<SandboxStatus> Sandbox status
   */
  getStatus(): Promise<SandboxStatus>;

  /**
   * Get dynamic subdomain configuration
   * @returns Promise<SubdomainConfig> Subdomain configuration
   */
  getSubdomainConfig(): Promise<SubdomainConfig>;
}

export declare class ExecutionResult {
  /** Output text from code execution */
  readonly text: string;
  /** Execution logs */
  readonly logs: {
    stdout: string[];
    stderr: string[];
  };
  /** Error message if execution failed */
  readonly error: string | null;
  /** Exit code */
  readonly exitCode: number;
  /** Execution time in milliseconds */
  readonly executionTime: number;

  constructor(data: {
    text?: string;
    logs?: { stdout: string[]; stderr: string[] };
    error?: string | null;
    exitCode?: number;
    executionTime?: number;
  });
}

// Default export
export default Sandbox;
