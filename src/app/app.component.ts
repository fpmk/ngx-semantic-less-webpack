import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

    constructor() {
    }

    public ngOnInit() {
    }

    public ngOnDestroy(): any {
    }

}
