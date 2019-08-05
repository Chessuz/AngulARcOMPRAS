import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ComprarPage } from "./comprar.page";
import { TabsCompraComponentModule } from "src/app/components/tabs-compra/tabs-compra.component-module";

const routes: Routes = [
    {
        path: "",
        component: ComprarPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TabsCompraComponentModule
    ],
    declarations: [ComprarPage]
})
export class ComprarPageModule {}
