import React from "React";
import { connect } from "react-redux";
import { initSocket } from "./socket";

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

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);

        this.state = {};
    }

    handleChange(e) {
        // this.input = e.target.value
        this.input = e.target.value;
        console.log(this.input);
    }

    submit() {
        console.log("this!!!", this);
        // initSocket().emit('messageSubmitted', this.input);
        const io = initSocket();
        io.emit("messageSubmitted", {
            message: this.input
        });
        document.querySelector("input").value = "";
    }

    render() {
        console.log("this.message", this.message);

        console.log("this.props", this.props.chatMessages);

        const chatMessages = this.props.chatMessages;

        if (!chatMessages) {
            return null;
        }

        const myChatMessages = chatMessages.map(message => {
            return (
                <div className="messageContainer">
                    {message.url ? (
                        <img
                            className="profilePic"
                            src={message.url}
                            alt="no picture"
                        />
                    ) : (
                        <img
                            className="profilePic"
                            src="https://s3.amazonaws.com/spicedling/nTX2xXNwxGyjFeuVTTMpBPZyxEO8HLE1.png"
                        />
                    )}
                    <p>{message.first + "" + message.last}</p>
                    <p>{message.messages}</p>
                </div>
            );
        });

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
                                    <div>
                                        Chat Messages!
                                        <div className="messageContainer">
                                            {myChatMessages && myChatMessages}
                                        </div>
                                        <div>
                                            <input
                                                name="input"
                                                placeholder="Enter Message Here"
                                                onChange={this.handleChange}
                                            />{" "}
                                            <button onClick={this.submit}>
                                                Submit
                                            </button>
                                        </div>
                                    </div>
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
        chatMessages: state.chatMessages
    };
};

export default connect(mapStateToProps)(Chat);
