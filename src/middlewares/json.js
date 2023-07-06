export async function json(req, res) {
  const buffers = []

  /**
   *  Usando a sintaxe de async/await para iterar sobre o stream de entrada (req) e armazenar os chunks em um array (buffers) para depois concatenar e
   *  transformar em string (fullStreamContent) e enviar como resposta (res.end) para o cliente (fake-upload-to-http-stream.js)
   **/
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch (error) {
    req.body = null
  }

  res.setHeader('Content-Type', 'application/json')

}