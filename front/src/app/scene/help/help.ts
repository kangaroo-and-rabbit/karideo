import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArianeService } from '../../service/ariane';

@Component({
  selector: 'app-help',
  templateUrl: './help.html',
  styleUrls: ['./help.less']
})
export class HelpComponent implements OnInit {

	constructor(private route: ActivatedRoute,
	            private arianeService: ArianeService) { }
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
	}

}
