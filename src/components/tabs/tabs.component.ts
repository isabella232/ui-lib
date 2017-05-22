import { Component, EventEmitter, Output, Input, ElementRef, OnChanges, HostListener } from '@angular/core';
import { Tab } from './tab.interface';

@Component({
    selector: 'ax-tabs',
    templateUrl: './tabs.component.html',
    styles: [ require('./_tabs.scss').toString() ]
})
export class TabsComponent implements OnChanges {
    public tabs: Tab[] = [];
    public indicatorPosition: { left: number; right: number; directionToLeft: boolean };
    public isMoving: boolean;

    @Output() public selected = new EventEmitter();
    @Input() public selectedTabKey: string;
    @Input() public navCenter: boolean = false;

    constructor(private myElement: ElementRef) {
    }

    public ngOnChanges() {
        setTimeout(() => {
            this.updateIndicatorPosition();
        }, 0)
    }

    public addTab(tab: Tab) {
        this.tabs.push(tab);
    }

    public removeTab(tab: Tab) {
        let index = this.tabs.indexOf(tab);
        if (index > -1) {
            this.tabs.splice(index, 1);
        }
    }

    public selectTab(event, tab: Tab) {
        // For animation
        this.isMoving = true;
        setTimeout(() => this.isMoving = false, 500);

        this.indicatorPosition = this.getIndicatorPosition(event.toElement.offsetParent, event.toElement);
        this.selectedTabKey = tab.tabKey;
        this.selected.emit({selectedTab: tab});
    }

    public isTabSelected(tab: Tab) {
        return tab.tabKey === this.selectedTabKey;
    }

    private updateIndicatorPosition() {
        let parentEl = this.myElement.nativeElement.querySelector('.tabs__nav');
        let el = parentEl.querySelector('.active');
        if (el && parentEl) {
            this.indicatorPosition = this.getIndicatorPosition(parentEl, el);
        }
    }

    private getIndicatorPosition(parentEl, el) {
        return {
            left: el.offsetLeft,
            right: parentEl.offsetWidth - el.offsetWidth - el.offsetLeft,
            directionToLeft: this.indicatorPosition && this.indicatorPosition && this.indicatorPosition.left > el.offsetLeft
        }
    }

    @HostListener('window:resize')
    private onResize() {
        this.updateIndicatorPosition();
    }
}
