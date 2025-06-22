export const calculateSumTool = {
  name: "calculate_sum",
  description: "Suma dos números y devuelve el resultado.",
  inputSchema: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" }
    },
    required: ["a", "b"]
  },
  annotations: {
    title: "Suma de dos números",
    readOnlyHint: true,
    openWorldHint: false
  },
  run: async (args) => {
    const { a, b } = args || {}
    if (typeof a !== 'number' || typeof b !== 'number') {
      return {
        isError: true,
        content: [
          { type: "text", text: "Los argumentos 'a' y 'b' deben ser números." }
        ]
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `El resultado de ${a} + ${b} es ${a + b}`
        }
      ]
    }
  }
}
