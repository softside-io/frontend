import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, ReplaySubject, from, switchMap, take } from 'rxjs';

export enum StorageMethodEnum {
	SET = 'set',
	GET = 'get',
	REMOVE = 'remove',
	CLEAR = 'clear',
}
@Injectable({
	providedIn: 'root',
})
export class SecureStorageService {
	private _storage: Storage | null = null;
	private ready: ReplaySubject<boolean> = new ReplaySubject<boolean>();
	private storage = inject(Storage);

	constructor() {
		this.init()
			.pipe(take(1))
			.subscribe({
				next: () => this.ready.next(true),
			});
	}

	init(): Observable<Storage> {
		const storageCreation = this.storage.create().then((storage) => {
			this._storage = storage;

			return storage;
		});

		return from(storageCreation);
	}

	// Create or update data
	set<T>(key: string, value: T): Observable<T> {
		return this.ready.pipe(
			switchMap(() => {
				const setPromise = this._storage?.set(key, value).then(() => value);

				return from(setPromise as Promise<T>);
			}),
		);
	}

	// Read data
	get<T>(key: string): Observable<T | null> {
		return this.ready.pipe(
			switchMap(() => {
				const getPromise = this._storage?.get(key).then((value) => value as T | null);

				return from(getPromise as Promise<T | null>);
			}),
		);
	}

	// Delete data
	remove(key: string): Observable<void> {
		return this.ready.pipe(
			switchMap(() => {
				const removePromise = this._storage?.remove(key);

				return from(removePromise as Promise<void>);
			}),
		);
	}

	// Clear all data
	clear(): Observable<void> {
		return this.ready.pipe(
			switchMap(() => {
				const clearPromise = this._storage?.clear();

				return from(clearPromise as Promise<void>);
			}),
		);
	}
}
