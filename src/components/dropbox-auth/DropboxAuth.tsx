import * as React from "react";
import * as _ from "lodash";
import * as storage from "store";
import { Button } from "react-bootstrap";

import Dropbox, { IGetCurrentAccountResponse } from "../../utils/Dropbox";
import WindowUtil from "../../utils/WindowUtil";

class DropboxAuth extends React.Component<IDropboxAuthProps, IDropboxAuthState> {
    private dropboxAuthWindow: Window;

    constructor(props: IDropboxAuthProps) {
        super(props);

        this.state = this.readStateFromLocalStore();
    }

    public componentDidMount(): void {
        window.addEventListener("message", this.onMessage.bind(this));
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="dropbox-auth">
                { this.renderAuthenticateButton() }
                { this.renderRevokeButton() }
            </div>
        );
    }

    private renderAuthenticateButton(): React.ReactElement<any> {
        if (this.isAuthenticated()) {
            return;
        }

        return (
            <div className="not-authenticated">
                Not authenticated:
                <Button onClick={this.openDropboxAuth.bind(this)}>Authenticate</Button>
            </div>
        );
    }

    private renderRevokeButton(): React.ReactElement<any> {
        if (this.isAuthenticated() === false) {
            return;
        }

        return (
            <div className="not-authenticated">
                Authenticated as: {this.state.userName}
                <Button onClick={this.revokeAuthentication.bind(this)}>Revoke</Button>
            </div>
        );
    }

    private openDropboxAuth(): void {
        let appKey: string = "6dfasskq63da4wj";
        let responseType: string = "token";
        let state: string = "1234";
        let redirectUri: string = "http://localhost:8080/dropbox-auth.html";

        let oauth2Url: string = "https://www.dropbox.com/oauth2/authorize?" +
            `client_id=${appKey}&response_type=${responseType}&state=${state}&redirect_uri=${redirectUri}`;
        let windowOptions: string = "width=800,height=600,scrollbars=yes,location=no";

        this.dropboxAuthWindow = WindowUtil.openWindow(oauth2Url, windowOptions);
    }

    private onMessage(event: MessageEvent): void {
        if (this.dropboxAuthWindow) {
            this.dropboxAuthWindow.close();
        }

        new Dropbox(event.data.accessToken).getCurrentAccount().then((response: IGetCurrentAccountResponse) => {
            this.setState({
                accessToken: event.data.accessToken,
                uid: event.data.uid,
                userName: response.name.display_name
            }, () => {
                this.writeStateToLocalStore();
            });
        });
    }

    private revokeAuthentication(): void {
        new Dropbox(this.state.accessToken).revokeToken().then(() => {
            this.setState({
                accessToken: null,
                uid: null,
                userName: null
            }, () => {
                this.writeStateToLocalStore();
            });
        });
    }

    private readStateFromLocalStore(): IDropboxAuthState {
        let dropboxAuth: IDropboxAuthState = storage.get("dropbox-auth");

        if (_.isNil(dropboxAuth)) {
            return {};
        }

        return dropboxAuth;
    }

    private writeStateToLocalStore(): void {
        storage.set("dropbox-auth", {
            accessToken: this.state.accessToken,
            uid: this.state.uid,
            userName: this.state.userName
        });
    }

    private isAuthenticated(): boolean {
        return _.isNil(this.state.accessToken) === false && _.isNil(this.state.uid) === false;
    }
}

interface IDropboxAuthProps {}

interface IDropboxAuthState {
    uid?: string;
    userName?: string;
    accessToken?: string;
}

export default DropboxAuth;
