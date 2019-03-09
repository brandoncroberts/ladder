import React from "react";
import { Registration2 } from "./registration2";

import { Uploader } from "./uploader";
import { HashRouter, Route } from "react-router-dom";
import { Login2 } from "./login2";

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

export class Welcome2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSidebar: false
        };
    }

    render() {
        const { showSidebar } = this.state;

        return (
            <div>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration2} />
                        <Route path="/login" component={Login2} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}
