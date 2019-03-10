import React from "React";
import axios from "./axios";
import Rungs from "./rungs";

import { Box, Heading, Grommet, ResponsiveContext } from "grommet";

import {} from "grommet-icons";

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

class Ladder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ladderUsers: [],
            rung: "",
            winner: "",
            winnerScore: "",
            loserScore: ""
        };
    }

    componentDidMount() {
        axios.get("/ladder-data-1").then(
            function(response) {
                response.data.forEach(ladderUser => {
                    this.setState(prevState => ({
                        ladderUsers: prevState.ladderUsers.concat(ladderUser)
                    }));
                });

                const rungs = [[]];
                let cur = 0;
                this.state.ladderUsers.forEach((user, i) => {
                    rungs[cur].push(user);
                    if (rungs[cur].length == 2) {
                        cur++;
                        if (i != this.state.ladderUsers.length - 1) {
                            rungs.push([]);
                        }
                    }
                });
                this.setState(() => ({ rungs: rungs }));
                console.log("rungs!!", rungs);
            }.bind(this)
        );
    }

    render() {
        console.log("ladderUsers", this.state.ladderUsers);
        console.log("rungs", this.state.rungs);

        return (
            <Grommet theme={theme} full>
                <ResponsiveContext.Consumer>
                    {size => (
                        <Box
                            background="purple"
                            direction="column"
                            align="center"
                            justify="start"
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
                            <Box>
                                {this.state.rungs &&
                                    this.state.rungs.map(rung => {
                                        return (
                                            <Rungs
                                                user1={rung[0] && rung[0].first}
                                                user1_last={
                                                    rung[0] && rung[0].last
                                                }
                                                user1_id={
                                                    rung[0] && rung[0].users_id
                                                }
                                                user1_url={
                                                    rung[0] && rung[0].url
                                                }
                                                user2_url={
                                                    rung[1] && rung[1].url
                                                }
                                                user2={rung[1] && rung[1].first}
                                                user2_last={
                                                    rung[1] && rung[1].last
                                                }
                                                user2_id={
                                                    rung[1] && rung[1].users_id
                                                }
                                                ranking1={
                                                    rung[0] && rung[0].ranking
                                                }
                                                ranking2={
                                                    rung[1] && rung[1].ranking
                                                }
                                                company_id={
                                                    rung[0] &&
                                                    rung[0].company_id
                                                }
                                            />
                                        );
                                    })}
                            </Box>
                        </Box>
                    )}
                </ResponsiveContext.Consumer>
            </Grommet>
        );
    }
}

export default Ladder;
