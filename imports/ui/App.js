import React, { Component } from "react";
import ReactDOM from "react-dom";

import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import { Sounds } from "../api/sounds.js";

import Sound from "./Sound.js";
import AccountsUIWrapper from "./AccountsUIWrapper.js";

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Meteor.call("sounds.insert", text);

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = "";
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted
        });
    }

    renderSounds() {
        let filteredSounds = this.props.sounds;

        if (this.state.hideCompleted) {
            filteredSounds = filteredSounds.filter(sound => !sound.checked);
        }

        return filteredSounds.map(sound => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = sound.owner === currentUserId;

            return <Sound key={sound._id} sound={sound} showPrivateButton={showPrivateButton} />;
        });
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Sounds ({this.props.incompleteCount})</h1>
                    <label className="hide-completed">
                        <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
                        Hide Completed Sounds
                    </label>
                    <AccountsUIWrapper />
                    {this.props.currentUser ? (
                        <form className="new-sound" onSubmit={this.handleSubmit.bind(this)}>
                            <input type="text" ref="textInput" placeholder="Type to add new sounds" />
                        </form>
                    ) : (
                        ""
                    )}
                </header>

                <ul>{this.renderSounds()}</ul>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("sounds");

    return {
        sounds: Sounds.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Sounds.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user()
    };
})(App);
