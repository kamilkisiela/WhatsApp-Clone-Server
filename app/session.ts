import { InjectionToken, Provider, Scope, CONTEXT } from 'graphql-modules';
import { Request, Response } from 'express';
import { MyContext } from '../context';

export const REQUEST = new InjectionToken<Request>('request');
export const RESPONSE = new InjectionToken<Response>('response');

export function provideSession(): Provider[] {
  return [
    {
      scope: Scope.Operation,
      provide: REQUEST,
      useFactory(context: MyContext) {
        return context.request;
      },
      deps: [CONTEXT],
    },
    {
      scope: Scope.Operation,
      provide: RESPONSE,
      useFactory(context: MyContext) {
        return context.response;
      },
      deps: [CONTEXT],
    },
  ];
}
