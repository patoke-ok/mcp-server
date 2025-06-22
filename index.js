import { Server } from "@modelcontextprotocol/sdk/server"
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types"
import { calculateSumTool } from "./tools/calculateSum.js"

const tools = [calculateSumTool]

const server = new Server(
  {
    name: "Dataso MCP",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
)

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(({ run, ...meta }) => meta)
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  const tool = tools.find(t => t.name === name)

  if (!tool) {
    return {
      isError: true,
      content: [{ type: "text", text: `Tool '${name}' no encontrada.` }]
    }
  }

  try {
    return await tool.run(args)
  } catch (e) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error: ${e.message}` }]
    }
  }
})

// Iniciar el servidor HTTP
const port = process.env.PORT || 3000
server.listenHttp({ port }).then(() => {
  console.log(`✅ MCP server oficial corriendo en http://localhost:${port}`)
})
