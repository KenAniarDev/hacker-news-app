import { setupServer } from "msw/node";
import {
  rest,
  MockedRequest,
  DefaultBodyType,
  ResponseComposition,
  RestContext,
} from "msw";

/* istanbul ignore file */

export type HandlerConfigType = {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  res: (
    req: MockedRequest<DefaultBodyType>,
    res: ResponseComposition<any>,
    ctx: RestContext
  ) => any;
};

export function createServer(handlerConfig: HandlerConfigType[]) {
  const handlers = handlerConfig.map((config) => {
    return rest[config.method || "get"](config.path, (req, res, ctx) => {
      return res(ctx.json(config.res(req, res, ctx)));
    });
  });
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
  });
}
