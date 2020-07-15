import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CrcComponent } from './aufgaben/crc/crc.component';
import { IpAddressComponent } from './aufgaben/ip-address/ip-address.component';
import { RoutingComponent } from './aufgaben/routing/routing.component';


const routes: Routes = [
  { path: '', component:HomeComponent},
  { path: 'crc', component:CrcComponent},
  { path: 'ip-address', component:IpAddressComponent},
  {path: 'routing', component:RoutingComponent},
  { path: '*', component:HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
