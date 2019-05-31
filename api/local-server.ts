import { createServer, IncomingMessage, ServerResponse } from 'http'

const handler = (_: IncomingMessage, res: ServerResponse) => {
  res.end('Hello World!')
}

// process.env.IS_NOW is undefined locally,
if (!process.env.IS_NOW) {
  // so we have a server with the handler!
  createServer(handler).listen(3000)
}

// Either way, this is exported
// On Now, this is what gets invoked/called/executed.
export default handler