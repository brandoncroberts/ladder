import React from "React";
import { BioEditor } from "./bioeditor";
import ProfilePic from "./profilepic";

import {
    Box,
    Button,
    Collapsible,
    Heading,
    Grommet,
    Layer,
    ResponsiveContext
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

export class Profile2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSidebar: false
        };
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
                                    >
                                        <ProfilePic
                                            first={this.props.first}
                                            last={this.props.last}
                                            id={this.props.id}
                                            url={this.props.url}
                                            handleShowUploader={
                                                this.props.handleShowUploader
                                            }
                                        />

                                        <BioEditor
                                            bio={this.props.bio}
                                            updateProfileBio={
                                                this.props.updateProfileBio
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
                                        />
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
