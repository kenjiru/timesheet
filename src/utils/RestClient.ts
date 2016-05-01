import * as rest from "rest";
import * as pathPrefix from "rest/interceptor/pathPrefix";
import * as template from "rest/interceptor/template";
import * as mime from "rest/interceptor/mime";
import * as errorCode from "rest/interceptor/errorCode";
import * as defaultRequest from "rest/interceptor/defaultRequest";

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

export function createDefaultRestClient(prefix: string, defaultOptions: Object): rest.Client {
    return createPrefixedRestClient({
        prefix: prefix
    }).wrap(defaultRequest, defaultOptions);
}

export function createTemplateRestClient(config: IRestClientConfig): rest.Client {
    return createPrefixedRestClient(config).wrap(template);
}

interface IRestClientConfig {
    prefix: string;
}
