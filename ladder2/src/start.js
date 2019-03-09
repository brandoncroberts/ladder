import React from "react";
import ReactDOM from "react-dom";
import { Welcome2 } from "./welcome2";

import { Logo } from "./logo";
import App from "./app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { initSocket } from "./socket";
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let thingToRender;

if (location.pathname == "/welcome") {
    thingToRender = <Welcome2 />;
} else {
    thingToRender = (initSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    ));
}

ReactDOM.render(thingToRender, document.querySelector("main"));
