import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
    },
    {
        path: 'tasks',
        loadChildren: () => import('./features/task/task.routes').then(m => m.TASK_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'user'
    }
];
