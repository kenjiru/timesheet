import * as rest from "rest";
import * as pathPrefix from "rest/interceptor/pathPrefix";
import * as mime from "rest/interceptor/mime";
import * as errorCode from "rest/interceptor/errorCode";
import { Response } from "rest";
import { Promise } from "when";
import * as _ from "lodash";

const restClient: rest.Client = rest.wrap(mime).wrap(errorCode)
    .wrap<pathPrefix.Config>(pathPrefix, { prefix: "https://api.dropboxapi.com" });

const contentRestClient: rest.Client = rest.wrap(errorCode)
    .wrap<pathPrefix.Config>(pathPrefix, { prefix: "https://content.dropboxapi.com" });

class Dropbox {
    private accessToken: string = null;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    public revokeToken(): Promise<any> {
        return restClient({
            path: "/2/auth/token/revoke",
            method: "POST",
            entity: null,
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "Content-Type": "application/json"
            }
        });
    }

    public getCurrentAccount(): Promise<IGetCurrentAccountResponse> {
        return restClient({
            path: "/2/users/get_current_account",
            method: "POST",
            entity: null,
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "Content-Type": "application/json"
            }
        }).then((response: Response) => {
            return response.entity as IGetCurrentAccountResponse;
        });
    }

    public listFolder(path: string, recursive?: boolean, includeMediaInfo?: boolean,
                      includeDeleted?: boolean): Promise<IListFolderResponse> {
        return restClient({
            path: "/2/files/list_folder",
            method: "POST",
            // _.merge() will skip the undefined fields
            entity: _.merge({}, {
                path,
                recursive,
                include_media_info: includeMediaInfo,
                include_deleted: includeDeleted
            }),
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "Content-Type": "application/json"
            }
        }).then((response: Response) => {
            return response.entity as IListFolderResponse;
        });
    }

    public download(path: string, rev?: string): Promise<IDownloadResponse> {
        return contentRestClient({
            path: "/2/files/download",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "Dropbox-API-Arg": JSON.stringify(_.merge({}, {
                    path,
                    rev
                }))
            }
        }).then((response: Response) => {
            let apiResult: string = response.headers["Dropbox-Api-Result"];

            return {
                fileContents: response.entity,
                apiResult: JSON.parse(apiResult)
            };
        });
    }

    public upload(path: string, data: any, mode?: "overwrite"|"add"|"update", autoRename?: boolean,
                  clientModified?: string, mute?: boolean): Promise<IUploadResponse> {

        return contentRestClient({
            path: "/2/files/upload",
            method: "POST",
            entity: data,
            headers: {
                "Authorization": "Bearer " + this.accessToken,
                "Content-Type": "application/octet-stream",
                "Dropbox-API-Arg": JSON.stringify(_.merge({}, {
                    path,
                    mode,
                    autorename: autoRename,
                    client_modified: clientModified,
                    mute
                }))
            }
        }).then((response: Response) => {
            let apiResult: string = response.entity;

            return {
                apiResult: JSON.parse(apiResult)
            };
        });
    }
}

export interface IListFolderResponse {
    entries: IFolderEntry[];
    cursor: string;
    had_more: boolean;
}

export interface IFolderEntry {
    ".tag": "file"|"folder";
    name: string;
    path_lower: string;
    path_display: string;
    id: string;
    client_modified: Date;
    server_modified: Date;
    rev: string;
    size: number;
}

export interface IDownloadResponse {
    fileContents: any;
    apiResult: IApiResult;
}

export interface IUploadResponse {
    apiResult: IApiResult;
}

export interface IApiResult {
    name: string;
    path_lower: string;
    path_display: string;
    id: string;
    client_modified: string;
    server_modified: string;
    rev: string;
    size: number;
}

export interface IGetCurrentAccountResponse {
    "account_id": string;
    "name": {
        "given_name": string;
        "surname": string;
        "familiar_name": string;
        "display_name": string;
    };
    "email": string;
    "email_verified": boolean;
    "disabled": boolean;
    "country": string;
    "locale": string;
    "referral_link": string;
    "is_paired": boolean;
    "account_type": {
        ".tag": string
    };
}

export default Dropbox;
