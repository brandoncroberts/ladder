import React from "React";
import axios from "./axios";
import { connect } from "react-redux";
import { receiveFriendsWannabes, acceptFriendship } from "./actions";
import { unfriend } from "./actions";

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

class Friends extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonText: "Make Friend Request",
            friendId: ""
        };
    }

    componentDidMount() {
        console.log("mounted");

        this.props.dispatch(receiveFriendsWannabes());
    }

    render() {
        const { friends, wannabes } = this.props;

        if (!friends) {
            return null;
        }

        const myFriends = (
            <div className="friends">
                {friends.map(friend => {
                    return (
                        <div className="chatContainer">
                            <img className="profilePic" src={friend.url} />
                            <p>{friend.first} </p> <p>{friend.last}</p>
                            <button
                                onClick={() =>
                                    this.props.dispatch(unfriend(friend.id))
                                }
                            >
                                Unfriend
                            </button>
                        </div>
                    );
                })}
            </div>
        );

        const myWannabes = (
            <div className="wannabes">
                {wannabes.map(friend => {
                    return (
                        <div className="friend">
                            <img className="profilePic" src={friend.url} />
                            <p>{friend.first} </p> <p>{friend.last}</p>
                            <button
                                onClick={() =>
                                    this.props.dispatch(
                                        acceptFriendship(friend.id)
                                    )
                                }
                            >
                                Confirm
                            </button>
                        </div>
                    );
                })}
            </div>
        );
        console.log("myfriends", friends);
        console.log("wannabes", wannabes);

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
                                    <h2>Friends</h2>
                                    <br />
                                    {friends.length > 0
                                        ? myFriends
                                        : "you are a loner"}
                                    <h2>Friend Requests</h2>
                                    <br />
                                    {wannabes.length > 0
                                        ? myWannabes
                                        : "No Friend Requests"}
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

const mapStateToProps = function(state) {
    return {
        friends:
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter(friend => friend.accepted == true),
        wannabes:
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter(friend => friend.accepted == false)
    };
};

export default connect(mapStateToProps)(Friends);
