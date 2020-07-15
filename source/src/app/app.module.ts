import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { CrcComponent } from './aufgaben/crc/crc.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//angular material
import { MaterialModule } from './material-module';
import { FormsModule } from '@angular/forms';
import { IpAddressComponent } from './aufgaben/ip-address/ip-address.component';
import { RoutingComponent } from './aufgaben/routing/routing.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationMenuComponent,
    CrcComponent,
    IpAddressComponent,
    RoutingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
