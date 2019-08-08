import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class VariaveisService {
    private menuIsDisabled: boolean;
    private menuIsOpen: boolean;
    constructor() {
        this.menuIsDisabled = false;
        this.menuIsOpen = false;
    }

    SetMenuIsDisabled(enabled: boolean) {
        this.menuIsDisabled = enabled;
    }

    GetMenuIsDisabled(): boolean {
        return this.menuIsDisabled;
    }

    SetMenuIsOpen(open: boolean) {
        this.menuIsOpen = open;
    }

    GetMenuIsOpen(): boolean {
        return this.menuIsOpen;
    }
}
