import { ModuleContext } from 'graphql-modules';
import { Request, Response } from 'express';

export type MyContext = ModuleContext<{
  request: Request;
  response?: Response;
}>;
