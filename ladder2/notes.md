1. Server
    * three routes
        1. GET /friends-and-wannabes
            * use query [here](https://gist.github.com/friedmandavid/9a7e8b1090eb0b28017a090d9a3c642c)
        2. POST for accepting friend reque
            * you probably already have a perfectly suitable one)
        3. POST for ending a friendship
            * you probably already have a perfectly suiatable one
2. Client
    * start.js
        * Import stuff:
            1. `createStore`, `applyMiddleware` from redux
            2. `reduxPromise` from redux-promise
            3. Your reducer from reducers.js
            4. `Provider` from react-redux
            5. `composeWithDevTools` from redux-devtools-extension
        * Call `createStore` and pass it your reducer as well as the result of calling `composeWithDevTools` and passing the result of calling `applyMiddleware` and passing it `reduxPromise`
        * Wrap `App` in `Provider` and pass `Provider` the store created by calling `createStore`
    * app.js
        * Import the connected component created in friends.js
        * Create a new `Route` and set its `component` prop to the connected component exported by friends.js
    * actions.js
        * Three action creator functions
            1. `receiveFriendsWannabes` - makes ajax GET request to retrieve list of friends an wannabes. The resolved value is an action with a property containing the list that was retrieved.
            2. `acceptFriendRequest` - makes ajax POST request to accept friendship. The resolved value is an action with the id of the wannabe
            3. `unfriend` - makes ajax POST request to end friendship. The resolved value is an action with the id of the friend
    * reducers.js
        * export a function that expects to receive the current state object as the first argument and an action as the second.
        * function must return a state object
        * Three conditionals that check the `type` property of the action
            1. `"RECEIVE_FRIENDS_WANNABES"` - return a new object that has all of the properties that the current state object has but with a new property containing the list of friends and wannabes added.
            2. `"ACCEPT_FRIEND_REQUEST"` -
            return a new object that has all of the properties that the current state object has but the array of friends and wannabes is replaced with a new array that has all of the objects that were in the old list of friends and wannabes except one of them is replaced with a whole new object that has all of the properties of the old object except that its `accepted` property is set to `true`.
            3. `"UNFRIEND"` - return a new object that has all of the properties that the current state object has but the array of friends and wannabes is replaced with a new array that has all of the objects that were in the old list of friends and wannabes except one is filtered out
    * friends.js
        * Import
            1. all three action creators from actions.js
            2. `connect` from react-redux
        * Make a `Friends` component that
            * dispatches the action to receive friends and wannabes when it mounts
            * renders two lists that it receives as props: `friends` and `wannabes`
            * for each wannabe it renders adds a button with click handler that dispatches the action to accept the friend request
            * for each friend it renders adds a button with a click handler that dispatches the action to unfriend
        * Make a `mapStateToProps` function that splits the list of friends and wannabes that are in the redux state object into two lists
        * call `connect`, passing it your `mapStateToProps` and call the function it returns and pass it your `Friends` component. Export the result.
            ```
            export default connect(mapStateToProps)(Friends);
            ```