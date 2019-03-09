import React from "React";
import axios from "./axios";

import {
    Box,
    Button,
    Image,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
    Paragraph,
    Select
} from "grommet";

import { AddCircle } from "grommet-icons";

const theme = {
    global: {
        colors: {
            brand: "#FFAA15",
            purple: "#7D4CDB"
        },
        font: {
            family: "Roboto",
            size: "14px",
            height: "20px"
        },
        overflow: "auto"
    }
};

class Rungs extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeWinner = this.handleChangeWinner.bind(this);
        this.handleChangeWinnerScore = this.handleChangeWinnerScore.bind(this);
        this.handleChangeLoserScore = this.handleChangeLoserScore.bind(this);
        this.postScore = this.postScore.bind(this);

        this.state = {
            ladderUsers: [],
            rung: "",
            winner: "",
            winnerScore: "",
            loserScore: ""
        };
    }

    componentDidMount() {
        console.log("this.props!!", this.props);

        axios
            .get(
                "/result-data-1/" +
                    this.props.user1_id +
                    "/" +
                    this.props.user2_id
            )
            .then(
                function(response) {
                    console.log("response!!!!", response.data[0]);
                    this.setState({
                        result:
                            response.data[0].winner_first +
                            " won " +
                            response.data[0].winner_score +
                            " to " +
                            response.data[0].loser_score
                    });
                }.bind(this)
            );
    }

    handleChangeWinner(e) {
        console.log(e.value);

        this.setState({ winner: e.value });

        if (e.value == this.props.user1) {
            this.setState({
                winnerId: this.props.user1_id,
                loserId: this.props.user2_id,
                companyId: this.props.company_id
            });
        } else if (e.value == this.props.user2) {
            this.setState({
                winnerId: this.props.user2_id,
                loserId: this.props.user1_id,
                companyId: this.props.company_id
            });
        }
    }
    handleChangeWinnerScore(e) {
        console.log(e.value);

        this.setState({ winnerScore: e.value });
        console.log("winnerState", this.state);
    }
    handleChangeLoserScore(e) {
        console.log(e.value);

        this.setState({ loserScore: e.value });
    }

    postScore(rung) {
        if (
            !this.state.winner ||
            !this.state.winnerScore ||
            !this.state.loserScore
        ) {
            return this.setState({
                result: "Please Fill in all fields before submitting"
            });
        }
        axios
            .post("/post-score", {
                winnerFirst: this.state.winner,
                winnerId: this.state.winnerId,
                loserId: this.state.loserId,
                companyId: this.state.companyId,
                winnerScore: this.state.winnerScore,
                loserScore: this.state.loserScore
            })
            .then(({ data }) => {});

        this.setState({
            result:
                this.state.winner +
                " won " +
                this.state.winnerScore +
                " to " +
                this.state.loserScore
        });
    }
    render() {
        return (
            <Box
                pad="medium"
                direction="row"
                align="center"
                justify="center"
                round="xlarge"
            >
                <Box height="small" width="small">
                    <Image fit="contain" src="/ladder.png" />
                </Box>
                {/**eventually enter rung names here */}
                <Box overflow="hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell scope="col" border="bottom">
                                    Picture
                                </TableCell>
                                <TableCell scope="col" border="bottom">
                                    #
                                </TableCell>
                                <TableCell scope="col" border="bottom">
                                    Name
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell scope="row">
                                    <strong>
                                        <Box
                                            round="full"
                                            height="75px"
                                            width="75px"
                                            background={
                                                this.props.user1_url
                                                    ? `url(${
                                                          this.props.user1_url
                                                      })`
                                                    : ""
                                            }
                                        />
                                    </strong>
                                </TableCell>
                                <TableCell scope="row">
                                    <strong>
                                        {this.props &&
                                            this.props.ranking1 &&
                                            this.props.ranking1}
                                    </strong>
                                </TableCell>
                                <TableCell>
                                    {this.props &&
                                        this.props.user1 &&
                                        this.props.user1}
                                    {this.props &&
                                        this.props.user1 &&
                                        " " + this.props.user1_last}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell scope="row">
                                    <strong>
                                        <Box
                                            round="full"
                                            height="75px"
                                            width="75px"
                                            background={
                                                this.props.user2_url
                                                    ? `url(${
                                                          this.props.user2_url
                                                      })`
                                                    : ""
                                            }
                                        />
                                    </strong>
                                </TableCell>
                                <TableCell scope="row">
                                    <strong>
                                        {this.props &&
                                            this.props.ranking2 &&
                                            this.props.ranking2}
                                    </strong>
                                </TableCell>
                                <TableCell>
                                    {this.props &&
                                        this.props.user2 &&
                                        this.props.user2}
                                    {this.props &&
                                        this.props.user2 &&
                                        " " + this.props.user2_last}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
                <Box>
                    <Select
                        options={[
                            this.props && this.props.user1 && this.props.user1,
                            this.props && this.props.user2 && this.props.user2
                        ]}
                        value={this.state.winner}
                        placeholder="Select Winner"
                        onChange={this.handleChangeWinner}
                    />
                    <Paragraph>won with a score of</Paragraph>
                    <Select
                        options={[
                            "0",
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "10",
                            "11",
                            "12",
                            "13",
                            "14",
                            "15",
                            "16",
                            "17",
                            "18",
                            "19",
                            "20",
                            "21",
                            "22",
                            "23",
                            "24",
                            "25",
                            "26",
                            "27",
                            "28",
                            "29",
                            "30",
                            "31",
                            "32",
                            "33"
                        ]}
                        value={this.state.winnerScore}
                        placeholder="WINNERS score"
                        onChange={this.handleChangeWinnerScore}
                    />
                    to
                    <Select
                        options={[
                            "0",
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "10",
                            "11",
                            "12",
                            "13",
                            "14",
                            "15",
                            "16",
                            "17",
                            "18",
                            "19",
                            "20",
                            "21",
                            "22",
                            "23",
                            "24",
                            "25",
                            "26",
                            "27",
                            "28",
                            "29",
                            "30",
                            "31",
                            "32",
                            "33"
                        ]}
                        placeholder="LOSERS Score"
                        value={this.state.loserScore}
                        onChange={this.handleChangeLoserScore}
                    />
                </Box>
                <Box pad="large">
                    <Button
                        onClick={this.postScore}
                        icon={<AddCircle />}
                        label="Submit"
                    />

                    <Paragraph>
                        {this.state.result && this.state.result}
                    </Paragraph>
                </Box>
                <Box />
            </Box>
        );
    }
}

export default Rungs;
