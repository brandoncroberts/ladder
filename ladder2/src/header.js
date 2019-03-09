import React from 'react';
import {Logo} from "./logo"


export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (<div className="header">
            <Logo></Logo>
            </div>);
    }
}
 