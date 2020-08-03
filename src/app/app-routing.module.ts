import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { AgoraComponent } from './agora/agora.component';
import { AuthGuardService } from './auth/auth-guard.service';


const routes: Routes = [
  {path : '', pathMatch : 'full' , component: AgoraComponent, canActivate: [AuthGuardService]},
  {path : 'auth' , component: AuthComponent},
  { path: 'task', component: TaskListComponent , canActivate: [AuthGuardService]},
  { path: 'task/create', component: TaskCreateComponent, canActivate: [AuthGuardService] },
  { path: 'task/edit/:taskId', component: TaskCreateComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
