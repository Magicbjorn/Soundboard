import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import classnames from "classnames";

import { Sounds } from "../api/sounds.js";

// Sound component - represents a single todo item
export default class Sound extends Component {
	toggleChecked() {
		// Set the checked property to the opposite of its current value
		Meteor.call("sounds.setChecked", this.props.sound._id, !this.props.sound.checked);
	}

	deleteThisSound() {
		Meteor.call("sounds.remove", this.props.sound._id);
	}

	togglePrivate() {
		Meteor.call("sounds.setPrivate", this.props.sound._id, !this.props.sound.private);
	}

	render() {
		// Give sounds a different className when they are checked off,
		// so that we can style them nicely in CSS
		const soundClassName = classnames({
			checked: this.props.sound.checked,
			private: this.props.sound.private
		});

		return (
			<li className={soundClassName}>
				<button className="delete" onClick={this.deleteThisSound.bind(this)}>
					&times;
				</button>

				<input type="checkbox" readOnly checked={!!this.props.sound.checked} onClick={this.toggleChecked.bind(this)} />
				{this.props.showPrivateButton ? (
					<button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
						{this.props.sound.private ? "Private" : "Public"}
					</button>
				) : (
					""
				)}
				<span className="text">
					<strong>{this.props.sound.username}</strong>: {this.props.sound.text}
				</span>
			</li>
		);
	}
}
