import * as _ from "lodash";
import * as moment from "moment";

import { Promise } from "./RestClient";
import Dropbox, { IListFolderResponse, IFolderEntry } from "./Dropbox";

class DropboxUtil {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    public findMostRecentFile(folderPath: string): Promise<IFolderEntry> {
        let dropboxClient: Dropbox = new Dropbox(this.accessToken);

        return dropboxClient.listFolder(folderPath).then((response: IListFolderResponse) => {
            return this.findMostRecent(response.entries);
        });
    }

    private findMostRecent(entries: IFolderEntry[]): IFolderEntry {
        let mostRecent: IFolderEntry = null;

        _.each(entries, (entry: IFolderEntry) => {
            if (this.isFirstMoreRecent(entry, mostRecent)) {
                mostRecent = entry;
            }
        });

        return mostRecent;
    }

    private isFirstMoreRecent(entry: IFolderEntry, mostRecent: IFolderEntry): boolean {
        if (entry[".tag"] !== "file") {
            return false;
        }

        if (mostRecent === null) {
            return true;
        }

        return moment(entry.server_modified).isAfter(mostRecent.server_modified);
    }
}

export default DropboxUtil;
