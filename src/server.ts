
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { LLMService } from './services/ai';
import { PERSONAS, PersonaType } from './services/persona';

const llmService = new LLMService();

const server = new Server(
  {
    name: "roastmaster-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
const ROAST_TOOL: Tool = {
  name: "roast_code",
  description: "Review and roast code with a specific persona",
  inputSchema: {
    type: "object",
    properties: {
      code: { type: "string", description: "The code to review" },
      filename: { type: "string", description: "The filename (for context)" },
      persona: { 
        type: "string", 
        enum: ["roast", "hype", "senior"],
        description: "The persona to use (roast, hype, senior)" 
      },
    },
    required: ["code", "filename"],
  },
};

const FIX_TOOL: Tool = {
  name: "fix_code",
  description: "Fix code with a specific persona",
  inputSchema: {
    type: "object",
    properties: {
      code: { type: "string", description: "The code to fix" },
      filename: { type: "string", description: "The filename (for context)" },
      persona: { 
        type: "string", 
        enum: ["roast", "hype", "senior"],
        description: "The persona to use (roast, hype, senior)" 
      },
    },
    required: ["code", "filename"],
  },
};

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [ROAST_TOOL, FIX_TOOL],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "roast_code") {
      // @ts-ignore
    const { code, filename, persona = "roast" } = args;
    const result = await llmService.analyzeCode(code, persona as PersonaType, filename);
    return {
      content: [{ type: "text", text: result }],
    };
  }
  
  if (name === "fix_code") {
      // @ts-ignore
    const { code, filename, persona = "roast" } = args;
    const result = await llmService.fixCode(code, persona as PersonaType, filename);
    return {
      content: [{ type: "text", text: result }],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RoastMaster MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
