import React from "React";
import axios from "./axios";

import Uploader from "./uploader";
import { Profile2 } from "./profile2";
import { Route } from "react-router-dom";

import { BrowserRouter } from "react-router-dom";
import OtherProfile from "./otherprofile";
import Friends from "./friends";
import Online from "./online.js";
import Chat from "./chat";
import Ladder from "./ladder";

export default class App extends React.Component {
    constructor() {
        super();
        this.handleShowUploader = this.handleShowUploader.bind(this);
        this.handleHideUploader = this.handleHideUploader.bind(this);
        this.updateProfileUrl = this.updateProfileUrl.bind(this);
        this.updateProfileBio = this.updateProfileBio.bind(this);
        this.state = {
            uploaderIsVisible: false
        };
    }

    updateProfileUrl(url) {
        this.setState(() => {
            return {
                url: url
            };
        });
    }

    updateProfileBio(bio) {
        console.log("updateBio");
        this.setState(() => {
            return {
                bio: bio
            };
        });
    }

    handleShowUploader() {
        this.setState(() => {
            return {
                uploaderIsVisible: true
            };
        });
    }

    handleHideUploader() {
        this.setState(() => {
            return {
                uploaderIsVisible: false
            };
        });
    }

    componentDidMount() {
        axios.get("/user").then(
            function(response) {
                this.setState({
                    first: response.data[0].first,
                    last: response.data[0].last,
                    id: response.data[0].id,
                    url: response.data[0].url,
                    bio: response.data[0].bio
                });
            }.bind(this)
        );
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <div>
                                <Profile2
                                    first={this.state.first}
                                    last={this.state.last}
                                    id={this.state.id}
                                    url={this.state.url}
                                    bio={this.state.bio}
                                    handleShowUploader={this.handleShowUploader}
                                    updateProfileBio={this.updateProfileBio}
                                />
                                {this.state.uploaderIsVisible && (
                                    <Uploader
                                        handleHideUploader={
                                            this.handleHideUploader
                                        }
                                        updateProfileUrl={this.updateProfileUrl}
                                    />
                                )}
                            </div>
                        )}
                    />
                    <Route path="/friends" component={Friends} />

                    <Route path="/user/:id" component={OtherProfile} />

                    <Route path="/online" component={Online} />

                    <Route path="/chat" component={Chat} />
                    <Route path="/ladder" component={Ladder} />
                </div>
            </BrowserRouter>
        );
    }
}
