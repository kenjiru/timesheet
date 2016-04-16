import * as _ from "lodash";
import { expect } from "chai";

import Dropbox, { IFolderEntry, IListFolderResponse, IDownloadResponse, IUploadResponse } from "../src/utils/Dropbox";

describe("Dropbox", () => {
    let dropbox: Dropbox;

    before(() => {
        dropbox = new Dropbox("XQKe16VoqRkAAAAAAAAHbyrQBeBJLeHLk9Bqdj5c8nm0dBLltxLFf9vU13_3YysV");
    });

    describe("#listFolder()", () => {
        let NO_ITEMS: number = 4;
        let NO_FILES: number = 3;
        let NO_FOLDERS: number = 1;
        let listFolderResponse: IListFolderResponse;

        before((done) => {
            dropbox.listFolder("/dropbox-v2-api-test").then(
                (response: IListFolderResponse) => {
                    listFolderResponse = response;
                    done();
                },
                (error: any) => {
                    done(error);
                });
        });

        it(`should contain ${NO_ITEMS} items in total`, (done) => {
            expect(listFolderResponse.entries).length(NO_ITEMS);
            done();
        });

        it(`should contain ${NO_FILES} files`, (done) => {
            let noFiles = countEntries(listFolderResponse.entries, "file");
            expect(noFiles).to.equal(NO_FILES);
            done();
        });

        it(`should contain ${NO_FOLDERS} folder`, (done) => {
            let noFolders = countEntries(listFolderResponse.entries, "folder");
            expect(noFolders).to.equal(NO_FOLDERS);
            done();
        });

    });

    describe("#download()", () => {
        let downloadResponse: IDownloadResponse;
        
        before((done) => {
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
        
        it("should have valid headers", (done) => {
            expect(downloadResponse.apiResult.name).to.equal("Foo.txt");
            expect(downloadResponse.apiResult.path_lower).to.equal("/dropbox-v2-api-test/foo.txt");
            done();
        });

        it("should have valid contents", (done) => {
            expect(downloadResponse.apiResult.size).to.equal(16);
            done();
        });
    });

    describe("#upload()", () => {
        let uploadResponse: IUploadResponse;

        before((done) => {
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

        it("should have valid headers", (done) => {
            expect(uploadResponse.apiResult.name).to.equal("foo.txt");
            expect(uploadResponse.apiResult.path_lower).to.equal("/dropbox-v2-api-test/upload/foo.txt");
            done();
        });

        it("should have valid contents", (done) => {
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
