import { OCPPVersion } from '../types';
import ChargePointMessage, { ChargePointAction } from './cp';
import CentralSystemMessage, { CentralSystemAction } from './cs';

export type ActionName<V extends OCPPVersion = OCPPVersion> = ChargePointAction<V> | CentralSystemAction<V>;

type ReqRes<T extends ActionName<V>, V extends OCPPVersion = OCPPVersion> =
  T extends ChargePointAction<V>
  ? ChargePointMessage<V>[T]
  : T extends CentralSystemAction<V>
  ? CentralSystemMessage<V>[T]
  : never;

/**
 * @example
 * import { Request } from '@plugoinc/ts-ocpp';
 *
 * type ChargeRelatedRequest = Request<'StartTransaction' | 'StopTransaction'>;
 *
 * @category Message Type
 */ // @ts-ignore, TS somehow doesn't recognize that there is a request property
export type Request<T extends ActionName<V>, V extends OCPPVersion = OCPPVersion> = ReqRes<T, V>['request'];

/**
 * @example
 * import { Response } from '@plugoinc/ts-ocpp';
 *
 * type ChargeRelatedResponse = Response<'StartTransaction' | 'StopTransaction'>;
 *
 * @category Message Type
 */ // @ts-ignore, TS somehow doesn't recognize that there is a response property
export type Response<T extends ActionName<V>, V extends OCPPVersion = OCPPVersion> = ReqRes<T, V>['response'];


type Result<T> = Promise<T> | T;

/**
 * TS is still not very good with dependent-typing
 * (i.e. making the return type differ on the input type)
 * so when using this it is advisable to do type assertions.
 *
 * @category Handler
 */
export type RequestHandler<T extends ActionName<V>, Metadata = undefined, V extends OCPPVersion = OCPPVersion> =
  /**
 * Returning `false` signals that the handler will respond later (no CALLRESULT is sent automatically).
   * `messageId` is the id from the incoming message, useful when sending a deferred response.
   */
  (request: Request<T, V>, extra: Metadata, messageId?: string) => Result<Response<T, V> | false>;
