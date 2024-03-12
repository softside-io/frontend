import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, Subscription, catchError, take, throwError } from 'rxjs';

export class Helpers {
	public static camelize(text: string): string {
		return text
			.trim()
			.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/\s+/g, '');
	}

	public static takeOne<T>(
		observable: Observable<T>,
		next?: ((value: T) => void) | undefined,
		destroy?: DestroyRef,
		suppressError?: boolean,
	): Subscription {
		if (destroy === undefined) {
			return observable
				.pipe(
					take(1),
					catchError((error) => {
						if (suppressError) {
							return EMPTY;
						} else {
							return throwError(() => error);
						}
					}),
				)
				.subscribe({ next });
		} else {
			return observable
				.pipe(
					takeUntilDestroyed(destroy),
					catchError((error) => {
						if (suppressError) {
							return EMPTY;
						} else {
							return throwError(() => error);
						}
					}),
				)
				.subscribe({
					next,
				});
		}
	}
}
