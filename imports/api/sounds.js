import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Sounds = new Mongo.Collection("sounds");

if (Meteor.isServer) {
	// Only publish sounds that are public or belong to the current user
	Meteor.publish("sounds", function soundsPublication() {
		return Sounds.find({
			$or: [{ private: { $ne: true } }, { owner: this.userId }]
		});
	});
}

Meteor.methods({
	"sounds.insert"(text) {
		check(text, String);

		// Make sure the user is logged in before inserting a sound
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		Sounds.insert({
			text,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username
		});
	},
	"sounds.remove"(soundId) {
		check(soundId, String);

		const sound = Sounds.findOne(soundId);

		if (sound.private && sound.owner !== this.userId) {
			// If the sound is private, make sure only the owner can delete it
			throw new Meteor.Error("not-authorized");
		}

		Sounds.remove(soundId);
	},
	"sounds.setChecked"(soundId, setChecked) {
		check(soundId, String);
		check(setChecked, Boolean);

		const sound = Sounds.findOne(soundId);
		if (sound.private && sound.owner !== this.userId) {
			// If the sound is private, make sure only the owner can check it off
			throw new Meteor.Error("not-authorized");
		}

		Sounds.update(soundId, { $set: { checked: setChecked } });
	},
	"sounds.setPrivate"(soundId, setToPrivate) {
		check(soundId, String);
		check(setToPrivate, Boolean);

		const sound = Sounds.findOne(soundId);

		// Make sure only the sound owner can make a sound private
		if (sound.owner !== this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		Sounds.update(soundId, { $set: { private: setToPrivate } });
	}
});
