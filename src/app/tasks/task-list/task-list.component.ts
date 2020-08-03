import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Task } from "../task.model";
import { TasksService } from "../tasks.service";

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.css"]
})
export class TaskListComponent implements OnInit, OnDestroy {
  // tasks = [
  //   { title: "First Task", content: "This is the first task's content" },
  //   { title: "Second Task", content: "This is the second task's content" },
  //   { title: "Third Task", content: "This is the third task's content" }
  // ];
  tasks: Task[] = [];
  isLoading = false;
  private tasksSub: Subscription;

  constructor(public tasksService: TasksService) {}

  ngOnInit() {
    this.isLoading = true;
    this.tasksService.getTasks();
    this.tasksSub = this.tasksService.getTaskUpdateListener()
      .subscribe((tasks: Task[]) => {
        this.isLoading = false;
        this.tasks = tasks;
      });
  }

  onDelete(taskId: string) {
    this.tasksService.deleteTask(taskId);
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
  }
}
