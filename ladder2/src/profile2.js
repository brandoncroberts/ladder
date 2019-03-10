import React from "React";
import { BioEditor } from "./bioeditor";
import ProfilePic from "./profilepic";
import Ladder from "./ladder";
import axios from "./axios";

import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Collapsible,
    Heading,
    Grommet,
    Layer,
    ResponsiveContext,
    Image,
    Paragraph,
    Meter
} from "grommet";
import { FormClose, Notification } from "grommet-icons";

const theme = {
    global: {
        colors: {
            brand: "#FFAA15",
            purple: "#7D4CDB",
            light1: "#F8F8F8",
            darkPurple: "#3D138D",
            accent1: "#6FFFB0",
            statusError: "#FF4040"
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

    componentDidMount() {
        axios.get("/user-ladder-wins-data").then(
            function(response) {
                console.log("responsewins!!!!!!!!!!!!!!!!!!!!", response.data);
                this.setState(() => ({ wins: response.data }));
            }.bind(this)
        );

        axios.get("/user-ladder-losses-data").then(
            function(response) {
                console.log(
                    "responselosses!!!!!!!!!!!!!!!!!!!!",
                    response.data
                );
                this.setState(() => ({ losses: response.data }));
            }.bind(this)
        );

        axios.get("/user-ladder-ranking-data").then(
            function(response) {
                if (response.data.length > 0) {
                    this.setState(() => ({
                        ranking: response.data.slice(-1).pop().ranking,
                        first: response.data.slice(-1).pop().first,
                        last: response.data.slice(-1).pop().last
                    }));
                }
            }.bind(this)
        );
    }
    render() {
        const { active } = this.state;

        const { showSidebar } = this.state;
        const wins = this.state.wins && this.state.wins.length;
        const losses = this.state.losses && this.state.losses.length;
        return (
            <Grommet theme={theme} full>
                <ResponsiveContext.Consumer>
                    {size => (
                        <Box fill>
                            <Box
                                background="white"
                                direction="row"
                                align="center"
                            >
                                <Heading margin="medium">
                                    CODE Ping-Pong Ladder
                                </Heading>
                                <Box
                                    margin="medium"
                                    height="small"
                                    width="small"
                                    background="url(/batandball.png)"
                                />

                                <Link to="/ladder">
                                    <Button label="Go to Ladder" />
                                </Link>
                            </Box>
                            <Box fill direction="row">
                                <Box
                                    background="purple"
                                    flex={{ grow: 1 }}
                                    align="center"
                                    justify="center"
                                >
                                    <Heading margin="medium">
                                        Dashboard:
                                        {/*                {"     " + this.state.first &&
                                                    this.state.first + " "}
                                                {this.state.last &&
                                                    this.state.last}*/}
                                    </Heading>
                                    <Box direction="row">
                                        <Box margin="medium">
                                            Wins:
                                            <Box
                                                height="50px"
                                                width="50px"
                                                background="accent1"
                                            />
                                        </Box>

                                        <Box margin="medium">
                                            Losses:
                                            <Box
                                                height="50px"
                                                width="50px"
                                                background="statusError"
                                            />
                                        </Box>
                                    </Box>

                                    <Meter
                                        type="circle"
                                        size="small"
                                        margin="medium"
                                        values={[
                                            {
                                                color: "accent1",
                                                label: "First",
                                                value:
                                                    (wins * 100) /
                                                    (wins + losses),
                                                highlight: active === "First",
                                                onHover: over => {
                                                    this.setState({
                                                        active: over
                                                            ? "First"
                                                            : undefined
                                                    });
                                                }
                                            },
                                            {
                                                color: "statusError",
                                                label: "Second",
                                                value:
                                                    (losses * 100) /
                                                    (wins + losses),
                                                highlight: active === "Second",
                                                onHover: over =>
                                                    this.setState({
                                                        active: over
                                                            ? "Second"
                                                            : undefined
                                                    })
                                            }
                                        ]}
                                    />
                                    <Box>
                                        <Paragraph>
                                            Total Matches Played:{" "}
                                            <strong>{wins + losses}</strong>
                                        </Paragraph>
                                        <Paragraph>
                                            Current Ranking:{" "}
                                            <strong>
                                                {this.state.ranking &&
                                                    this.state.ranking}
                                            </strong>
                                        </Paragraph>
                                        <Paragraph>
                                            Total Wins:{" "}
                                            <strong>
                                                {this.state.wins &&
                                                    this.state.wins.length}
                                            </strong>
                                        </Paragraph>
                                        <Paragraph>
                                            Total Losses:
                                            <strong>
                                                {this.state.losses &&
                                                    this.state.losses.length}
                                            </strong>
                                        </Paragraph>
                                        <Paragraph>
                                            Winning Percentage:
                                            <strong>
                                                {(wins * 100) / (wins + losses)}
                                                %
                                            </strong>
                                        </Paragraph>
                                    </Box>
                                </Box>

                                <Box background="darkPurple" flex={{ grow: 1 }}>
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
                        </Box>
                    )}
                </ResponsiveContext.Consumer>
            </Grommet>
        );
    }
}
