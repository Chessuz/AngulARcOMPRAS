import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { TabsCompraComponent } from "./tabs-compra.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [];

@NgModule({
    imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [TabsCompraComponent],
    exports: [TabsCompraComponent]
})
export class TabsCompraComponentModule {}
