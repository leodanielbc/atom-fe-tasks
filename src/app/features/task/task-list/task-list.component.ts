import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TaskService, Task } from '../../../core/services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private readonly TOKEN_KEY = environment.auth_token;

  constructor(private router: Router) { }

  displayedColumns: string[] = ['title', 'description', 'completed', 'actions'];
  tasks: Task[] = [];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data: any) => (this.tasks = data.tasks),
      error: () => this.showMessage('Error cargando tareas')
    });
  }

  createTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.createTask(result).subscribe({
          next: () => {
            this.showMessage('Tarea creada');
            this.loadTasks();
          }
        });
      }
    });
  }

  editTask(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.taskService.updateTask(task.id, result).subscribe({
          next: () => {
            this.showMessage('Tarea actualizada');
            this.loadTasks();
          }
        });
      }
    });
  }

  deleteTask(task: Task) {
    if (confirm(`¿Eliminar tarea "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.showMessage('Tarea eliminada');
          this.loadTasks();
        }
      });
    }
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/user']);
  }

  private showMessage(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
  }
}
