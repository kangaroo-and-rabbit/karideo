import { Component} from '@angular/core';

@Component({
	selector: 'app-upload-file',
	templateUrl: './upload-file.html',
	styleUrls: ['./upload-file.less']
})

export class UploadFileComponent {
	files: any = [];
	uploadFile(event) {
		for (let index = 0; index < event.length; index++) {
			const element = event[index];
			this.files.push(element.name)
		}
	}
	deleteAttachment(index) {
		this.files.splice(index, 1)
	}
}
