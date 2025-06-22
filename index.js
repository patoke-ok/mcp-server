import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { calculateSumTool } from './tools/calculateSum.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Lista de herramientas disponibles
const tools = [calculateSumTool]

// Endpoint MCP oficial: POST /tools/list
app.post('/tools/list', (req, res) => {
  res.json({
    tools: tools.map(({ run, ...meta }) => meta)
  })
})

// Endpoint MCP oficial: POST /tools/call
app.post('/tools/call', async (req, res) => {
  const { name, arguments: args } = req.body
  const tool = tools.find(t => t.name === name)

  if (!tool) {
    return res.json({
      isError: true,
      content: [{ type: "text", text: `Tool '${name}' no encontrada.` }]
    })
  }

  try {
    const result = await tool.run(args)
    return res.json(result)
  } catch (e) {
    return res.json({
      isError: true,
      content: [{ type: "text", text: `Error: ${e.message}` }]
    })
  }
})

app.listen(PORT, () => {
  console.log(`✅ MCP Server corriendo en http://localhost:${PORT}`)
})
