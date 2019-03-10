import React from "React";
import axios from "./axios";

import {
    Box,
    Button,
    Collapsible,
    Heading,
    Grommet,
    Layer,
    ResponsiveContext,
    Image,
    TextInput,
    Paragraph
} from "grommet";

import { FormClose, Notification, ContactInfo, AddCircle } from "grommet-icons";

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

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.updateFriendship = this.updateFriendship.bind(this);
        this.state = {
            buttonText: "Make Friend Request"
        };
    }

    componentDidMount() {
        axios
            .get("/get-initial-status/" + this.props.otherUserId)
            .then(resp => {
                console.log("state", this.state.buttonText);

                console.log("response!axios", resp);

                if (resp.data.data.length == 0) {
                    this.setState(() => {
                        return { buttonText: "Add Friend" };
                    });
                } else if (resp.data.data[0].accepted === true) {
                    this.setState(() => {
                        return { buttonText: "Unfriend" };
                    });
                } else if (
                    resp.data.data[0].accepted === false &&
                    resp.data.data[0].sender_id === resp.data.user
                ) {
                    this.setState(() => {
                        return { buttonText: "Cancel Friend Request" };
                    });
                } else if (
                    resp.data.data[0].accepted === false &&
                    resp.data.data[0].sender_id != resp.data.user
                ) {
                    this.setState(() => {
                        return { buttonText: "Confirm" };
                    });
                }
            });
    }

    updateFriendship() {
        if (this.state.buttonText == "Add Friend") {
            axios
                .post(
                    "/get-initial-status/" +
                        this.props.otherUserId +
                        "/add-friend"
                )
                .then(resp => {});
            this.setState(() => {
                return { buttonText: "Cancel Friend Request" };
            });
        } else if (this.state.buttonText == "Unfriend") {
            axios
                .post(
                    "/get-initial-status/" +
                        this.props.otherUserId +
                        "/unfriend"
                )
                .then(resp => {});
            this.setState(() => {
                return { buttonText: "Add Friend" };
            });
        } else if (this.state.buttonText == "Cancel Friend Request") {
            axios
                .post(
                    "/get-initial-status/" +
                        this.props.otherUserId +
                        "/cancel-friend-request"
                )
                .then(resp => {});
            this.setState(() => {
                return { buttonText: "Add Friend" };
            });
        } else if (this.state.buttonText == "Confirm") {
            axios
                .post(
                    "/get-initial-status/" + this.props.otherUserId + "/confirm"
                )
                .then(resp => {});
            this.setState(() => {
                return { buttonText: "Unfriend" };
            });
        }
    }
    render() {
        return (
            <Grommet>
                <Button
                    onClick={this.updateFriendship}
                    label={this.state.buttonText}
                />
            </Grommet>
        );
    }
}
