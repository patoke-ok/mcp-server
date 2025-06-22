import { Server } from '@modelcontextprotocol/sdk/server';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types';
const tools = [
    {
        name: 'calculate_sum',
        description: 'Suma dos números',
        inputSchema: {
            type: 'object',
            properties: {
                a: { type: 'number' },
                b: { type: 'number' }
            },
            required: ['a', 'b']
        },
        annotations: {
            title: 'Calcular suma',
            readOnlyHint: true,
            openWorldHint: false
        },
        run: async ({ a, b }) => {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Resultado: ${a + b}`
                    }
                ]
            };
        }
    }
];
const server = new Server({
    name: 'Dataso MCP',
    version: '1.0.0'
}, {
    capabilities: {
        tools: {}
    }
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: tools.map(({ run, ...meta }) => meta)
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find(t => t.name === request.params.name);
    if (!tool) {
        return {
            isError: true,
            content: [{ type: 'text', text: `Tool '${request.params.name}' no encontrada.` }]
        };
    }
    try {
        return await tool.run(request.params.arguments);
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: 'text', text: `Error interno: ${err.message}` }]
        };
    }
});
server.listenHttp({ port: process.env.PORT || 3000 });
