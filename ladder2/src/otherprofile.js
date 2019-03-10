import React from "react";
import axios from "./axios";
import { Header } from "./header";
import FriendButton from "./friendbutton";

import {
    Box,
    Button,
    Collapsible,
    Heading,
    Grommet,
    Layer,
    ResponsiveContext,
    Paragraph
} from "grommet";

import { FormClose, Notification } from "grommet-icons";

const theme = {
    global: {
        colors: {
            brand: "#228BE6"
        },
        font: {
            family: "Roboto",
            size: "14px",
            height: "20px"
        }
    }
};

const AppBar = props => (
    <Box
        tag="header"
        direction="row"
        align="center"
        justify="between"
        background="brand"
        pad={{ left: "medium", right: "small", vertical: "small" }}
        elevation="medium"
        style={{ zIndex: "1" }}
        {...props}
    />
);

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios.get("/other/" + this.props.match.params.id).then(
            function(response) {
                console.log("hello", this.props.match.params.id);
                console.log("response!", response);

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
        const { showSidebar } = this.state;
        return (
            <Grommet theme={theme} full>
                <ResponsiveContext.Consumer>
                    {size => (
                        <Box fill>
                            <AppBar>
                                <Heading level="3" margin="none">
                                    My App
                                </Heading>
                                <Button
                                    icon={<Notification />}
                                    onClick={() =>
                                        this.setState(prevState => ({
                                            showSidebar: !prevState.showSidebar
                                        }))
                                    }
                                />
                            </AppBar>
                            <Box
                                direction="row"
                                flex
                                overflow={{ horizontal: "hidden" }}
                            >
                                <Box flex align="center" justify="center">
                                    <Box
                                        width="80%"
                                        border={{ size: "large" }}
                                        pad="medium"
                                        background="light-3"
                                        direction="row"
                                        align="center"
                                    >
                                        <Box pad="large">
                                            {this.state.url ? (
                                                <img
                                                    className="profilePic"
                                                    src={this.state.url}
                                                />
                                            ) : (
                                                <img
                                                    className="profilePic"
                                                    src="https://s3.amazonaws.com/spicedling/nTX2xXNwxGyjFeuVTTMpBPZyxEO8HLE1.png"
                                                />
                                            )}
                                        </Box>

                                        <Box flex direction="column">
                                            <h1>
                                                {this.state.first +
                                                    " " +
                                                    this.state.last}
                                            </h1>

                                            <h1>About Me:</h1>
                                        </Box>

                                        {this.state.bio ? (
                                            <Paragraph>
                                                {this.state.bio}
                                            </Paragraph>
                                        ) : (
                                            <Paragraph pad="large">
                                                "No Bio Given Yet"
                                            </Paragraph>
                                        )}

                                        <FriendButton
                                            otherUserId={
                                                this.props.match.params.id
                                            }
                                        />
                                    </Box>
                                </Box>
                                {!showSidebar || size !== "small" ? (
                                    <Collapsible
                                        direction="horizontal"
                                        open={showSidebar}
                                    >
                                        <Box
                                            flex
                                            width="medium"
                                            background="light-2"
                                            elevation="small"
                                            align="center"
                                            justify="center"
                                        >
                                            sidebar
                                        </Box>
                                    </Collapsible>
                                ) : (
                                    <Layer>
                                        <Box
                                            background="light-2"
                                            tag="header"
                                            justify="end"
                                            align="center"
                                            direction="row"
                                        >
                                            <Button
                                                icon={<FormClose />}
                                                onClick={() =>
                                                    this.setState({
                                                        showSidebar: false
                                                    })
                                                }
                                            />
                                        </Box>
                                        <Box
                                            fill
                                            background="light-2"
                                            align="center"
                                            justify="center"
                                        >
                                            sidebar
                                        </Box>
                                    </Layer>
                                )}
                            </Box>
                        </Box>
                    )}
                </ResponsiveContext.Consumer>
            </Grommet>
        );
    }
}
