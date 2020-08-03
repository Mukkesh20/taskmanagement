import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import { TasksService } from "../tasks.service";
import { Task } from "../task.model";

@Component({
  selector: "app-task-create",
  templateUrl: "./task-create.component.html",
  styleUrls: ["./task-create.component.css"]
})
export class TaskCreateComponent implements OnInit {
  enteredTitle = "";
  enteredDescription = "";
  task: Task;
  isLoading = false;
  private mode = "create";
  private taskId: string;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router : Router  ) {}

  ngOnInit() {
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   if (paramMap.has("taskId")) {
    //     this.mode = "edit";
    //     this.taskId = paramMap.get("taskId");
    //     this.isLoading = true;
    //     this.tasksService.getTask(this.taskId).subscribe(taskData => {
    //       this.isLoading = false;
    //       this.task = {id: taskData._id, title: taskData.title, description: taskData.description};
    //     });
    //   } else {
    //     this.mode = "create";
    //     this.taskId = null;
    //   }
    // });
  }

  onSaveTask(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.tasksService.addTask(form.value.title, form.value.description);
    } else {
      this.tasksService.updateTask(
        this.taskId,
        form.value.title,
        form.value.description
      );
    }
    form.resetForm();
    this.router.navigate(['../'])

  }

}
