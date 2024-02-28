import { Injectable, inject, signal } from '@angular/core';
import { ToggleCustomEvent } from '@ionic/angular/standalone';

import { SecureStorageService } from '@softside/ui-sdk/lib/shared';
import { Helpers } from '@softside/ui-sdk/lib/_utils';

import { SessionService } from './session.service';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	storage = inject(SecureStorageService);
	isDarkMode = signal(false);
	authService = inject(SessionService);
	initialColors = this.getRandomColor();

	constructor() {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
		prefersDark.addEventListener('change', (mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));

		Helpers.takeOne(this.storage.get<boolean>('theme'), (theme) => {
			if (theme === null) {
				this.toggleDarkTheme(prefersDark.matches);

				return;
			}

			this.toggleDarkTheme(theme);
		});
	}

	toggleChange(ev: Event): void {
		this.toggleDarkTheme((ev as ToggleCustomEvent).detail.checked);
	}

	toggleDarkTheme(isDark: boolean): void {
		this.isDarkMode.set(isDark);
		Helpers.takeOne(this.storage.set('theme', isDark));

		if (isDark) {
			document.body.classList.remove('light');
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
			document.body.classList.add('light');
		}
	}

	getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
	}

	private getRandomColor(): { backgroundColor: string; textColor: string } {
		const hue = Math.floor(Math.random() * 360);
		const backgroundColor = `hsl(${hue}, 85%, 65%)`; // Light background color
		const textColor = `hsl(${hue}, 85%, 28%)`; // Darker text color

		return { backgroundColor, textColor };
	}
}
