import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ImageUploadService {
	uploadImage(_image: File, _path: string): Observable<string> {
		// const storageRef = ref(this.storage, path);
		// const uploadTask = from(uploadBytes(storageRef, image));
		// return uploadTask.pipe(
		// 	take(1),
		// 	switchMap((result: UploadResult): Observable<string> => {
		// 		return from(getDownloadURL(result.ref));
		// 	}),
		// );
		return of('');
	}

	deleteImage(_path: string): Observable<void> {
		// const storageRef = ref(this.storage, path);
		// return from(deleteObject(storageRef)).pipe(take(1));
		return of(undefined);
	}
}
