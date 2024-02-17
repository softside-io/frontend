import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription, take } from 'rxjs';

export class Helpers {
	public static camelize(text: string): string {
		return text
			.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/\s+/g, '');
	}

	public static takeOne<T>(
		observable: Observable<T>,
		next?: ((value: T) => void) | undefined,
		destroy?: DestroyRef,
	): Subscription {
		if (destroy === undefined) {
			return observable.pipe(take(1)).subscribe({ next });
		} else {
			return observable.pipe(takeUntilDestroyed(destroy)).subscribe({
				next,
			});
		}
	}
}
