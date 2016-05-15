import * as _ from "lodash";
import { expect } from "chai";

import Dropbox, {
    IFolderEntry, IListFolderResponse, IDownloadResponse, IUploadResponse, IGetCurrentAccountResponse
} from "../../src/utils/Dropbox";

describe("Dropbox", () => {
    let dropbox: Dropbox;

    before(() => {
        dropbox = new Dropbox("XQKe16VoqRkAAAAAAAAHi-R7wySlFyN-Mbcjmy2HZq89tGOx2RwmUsPE6_AwIuSw");
    });

    describe("#getCurrentAccount()", () => {
        const GIVEN_NAME: string = "kenjiru";
        const SURNAME: string = "kun";
        let getCurrentAccountResponse: IGetCurrentAccountResponse;

        before((done: Function) => {
            dropbox.getCurrentAccount().then(
                (response: IGetCurrentAccountResponse) => {
                    getCurrentAccountResponse = response;
                    done();
                },
                (error: any) => {
                    done(error);
                });
        });

        it(`should show the correct logged in as ${GIVEN_NAME} ${SURNAME}`, () => {
            expect(getCurrentAccountResponse.name.given_name).equal(GIVEN_NAME);
            expect(getCurrentAccountResponse.name.surname).equal(SURNAME);
        });
    });

    describe("#listFolder()", () => {
        let NO_ITEMS: number = 4;
        let NO_FILES: number = 3;
        let NO_FOLDERS: number = 1;
        let listFolderResponse: IListFolderResponse;

        before((done: Function) => {
            dropbox.listFolder("/dropbox-v2-api-test").then(
                (response: IListFolderResponse) => {
                    listFolderResponse = response;
                    done();
                },
                (error: any) => {
                    done(error);
                });
        });

        it(`should contain ${NO_ITEMS} items in total`, (done: Function) => {
            expect(listFolderResponse.entries).length(NO_ITEMS);
            done();
        });

        it(`should contain ${NO_FILES} files`, (done: Function) => {
            let noFiles: number = countEntries(listFolderResponse.entries, "file");
            expect(noFiles).to.equal(NO_FILES);
            done();
        });

        it(`should contain ${NO_FOLDERS} folder`, (done: Function) => {
            let noFolders: number = countEntries(listFolderResponse.entries, "folder");
            expect(noFolders).to.equal(NO_FOLDERS);
            done();
        });

    });

    describe("#download()", () => {
        let downloadResponse: IDownloadResponse;

        before((done: Function) => {
            dropbox.download("/dropbox-v2-api-test/Foo.txt").then(
                (response: IDownloadResponse) => {
                    // console.log(response);
                    downloadResponse = response;
                    done();
                },
                (error: any) => {
                    done(error);
                });
        });

        it("should have valid headers", (done: Function) => {
            expect(downloadResponse.apiResult.name).to.equal("Foo.txt");
            expect(downloadResponse.apiResult.path_lower).to.equal("/dropbox-v2-api-test/foo.txt");
            done();
        });

        it("should have valid contents", (done: Function) => {
            expect(downloadResponse.apiResult.size).to.equal(16);
            done();
        });
    });

    describe("#upload()", () => {
        let uploadResponse: IUploadResponse;

        before((done: Function) => {
            dropbox.upload("/dropbox-v2-api-test/upload/foo.txt", "lorem ipsum").then(
                (response: IUploadResponse) => {
                    // console.log(response);
                    uploadResponse = response;
                    done();
                },
                (error: any) => {
                    console.log(error);
                    done(error);
                });
        });

        it("should have valid headers", (done: Function) => {
            expect(uploadResponse.apiResult.name).to.equal("foo.txt");
            expect(uploadResponse.apiResult.path_lower).to.equal("/dropbox-v2-api-test/upload/foo.txt");
            done();
        });

        it("should have valid contents", (done: Function) => {
            expect(uploadResponse.apiResult.size).to.equal(11);
            done();
        });
    });
});

function countEntries(entries: IFolderEntry[], entryType: "file"|"folder"): number {
    return _.reduce(entries, (sum: number, entry: IFolderEntry) => {
        if (entry[".tag"] === entryType) {
            return ++sum;
        }

        return sum;
    }, 0);
}
