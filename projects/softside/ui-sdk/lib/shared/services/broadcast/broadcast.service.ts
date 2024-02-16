import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum BroadcastEventEnum {
	LOGIN = 'LOGIN',
	LOGOUT = 'LOGOUT',
	SESSION = 'SESSION',
}
export type BroadcastMessage<T = unknown> = {
	action: BroadcastEventEnum;
	data?: {
		session?: T;
	};
};
export enum BroadcastChannels {
	AUTH_CHANNEL = 'AUTH_CHANNEL',
}
/**
 * Service for handling communication across different broadcast channels.
 * Allows creating, sending messages, receiving messages, and closing individual or all channels.
 */
@Injectable({
	providedIn: 'root',
})
export class BroadcastService {
	private channels: Map<string, BroadcastChannel> = new Map();
	private messageSubjects: Map<string, Subject<BroadcastMessage>> = new Map();

	/**
	 * Initializes the broadcast service.
	 * @param ngZone NgZone service for executing work inside Angular's zone.
	 */
	constructor(private readonly ngZone: NgZone) {}

	/**
	 * Initializes a new broadcast channel and its corresponding subject.
	 * @param channelName The name of the channel to be initialized.
	 * @private
	 */
	private initializeChannel(channelName: BroadcastChannels): void {
		const channel = new BroadcastChannel(channelName);
		const subject = new Subject<BroadcastMessage>();
		this.channels.set(channelName, channel);
		this.messageSubjects.set(channelName, subject);

		channel.onmessage = (event: MessageEvent): void => {
			this.ngZone.run(() => {
				subject.next(event.data);
			});
		};

		channel.onmessageerror = (event): void => {
			this.ngZone.run(() => {
				subject.error(event);
			});
		};
	}

	/**
	 * Creates a new channel with the provided name if it doesn't already exist.
	 * @param channelName The name of the channel to create.
	 */
	public createChannel(channelName: BroadcastChannels): boolean {
		if (!this.channels.has(channelName)) {
			this.initializeChannel(channelName);

			return true;
		}

		return false;
	}

	public listActiveChannels(): string[] {
		return Array.from(this.channels.keys());
	}

	/**
	 * Sends a message through the specified channel.
	 * @param channelName The name of the channel to send the message through.
	 * @param message The message to be sent.
	 * @param selfTrigger If true, the message will also be emitted to the subject of the channel.
	 */
	public sendMessage(channelName: BroadcastChannels, message: BroadcastMessage, selfTrigger = true): void {
		const channel = this.channels.get(channelName);

		if (!channel) {
			throw new Error(`Channel ${channelName} not found`);
		}

		try {
			channel.postMessage(message);

			if (selfTrigger) {
				const subject = this.messageSubjects.get(channelName);

				subject?.next(message);
			}
		} catch (error) {
			throw new Error(`Error sending message on channel ${channelName}: ${error}`);
		}
	}

	/**
	 * Returns an Observable that emits messages from the specified channel.
	 * @param channelName The name of the channel to receive messages from.
	 * @returns An Observable of messages from the specified channel.
	 * @throws Error if the specified channel does not exist.
	 */
	public getMessage(channelName: string): Observable<BroadcastMessage> {
		const subject = this.messageSubjects.get(channelName);

		if (subject) {
			return subject.asObservable();
		}

		throw new Error(`Channel '${channelName}' does not exist`);
	}

	/**
	 * Closes a specified channel or all channels if no name is provided.
	 * @param channelName The name of the channel to be closed. If omitted, all channels are closed.
	 */
	public closeChannel(channelName?: string): void {
		const closeAndCleanup = (name: string): void => {
			const channel = this.channels.get(name);
			channel?.close();
			this.messageSubjects.get(name)?.unsubscribe();
			this.channels.delete(name);
			this.messageSubjects.delete(name);
		};

		if (channelName) {
			closeAndCleanup(channelName);
		} else {
			this.channels.forEach((_, name) => closeAndCleanup(name));
		}
	}
}
