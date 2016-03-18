import * as rest from "rest";
import pathPrefix from "rest/interceptor/pathPrefix";
import template from "rest/interceptor/template";
import mime from "rest/interceptor/mime";
import errorCode from "rest/interceptor/errorCode";

export { Client as RestClient, Request, Response, ResponsePromise } from "rest";
export { Promise, all } from "when";

export function createRestClient(): rest.Client {
    return rest.wrap(mime).wrap(errorCode);
}

export function createPrefixedRestClient(config: IRestClientConfig): rest.Client {
    return createRestClient().wrap<pathPrefix.Config>(pathPrefix, {
        prefix: config.prefix
    });
}

export function createTemplateRestClient(config: IRestClientConfig): rest.Client {
    return createPrefixedRestClient(config).wrap(template);
}

interface IRestClientConfig {
    prefix: string;
}
