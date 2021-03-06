import { expect } from "chai";

import { IFolderEntry } from "../../src/utils/Dropbox";
import DropboxUtil from "../../src/utils/DropboxUtil";

describe("DropboxUtil", () => {
    let dropboxUtil: DropboxUtil;

    before(() => {
        dropboxUtil = new DropboxUtil("XQKe16VoqRkAAAAAAAAHi-R7wySlFyN-Mbcjmy2HZq89tGOx2RwmUsPE6_AwIuSw");
    });

    describe("#findMostRecentFile()", () => {
        let mostRecent: IFolderEntry;

        before((done: Function) => {
            dropboxUtil.findMostRecentFile("/dropbox-v2-api-test").then(
                (response: IFolderEntry) => {
                    // console.log(response);
                    mostRecent = response;
                    done();
                },
                (error: any) => {
                    console.log(error);
                    done(error);
                });
        });

        it("should find the correct file", (done: Function) => {
            expect(mostRecent.name).to.equal("Bar.txt");
            done();
        });
    });
});
