import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Task } from "./task.model";
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: "root" })
export class TasksService {
  private tasks: Task[] = [];
  private tasksUpdated = new Subject<Task[]>();

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  getTasks() {
    const userData: { email: string, password: string, access_token: string, tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'))
    var access_token = userData.access_token;
    console.log(access_token)
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + access_token);
    this.http
      .get<any>("https://nestjs-authentication.herokuapp.com/task",
      {
        headers : headers_object
      })
      .pipe(
        map(taskData => {
          console.log(taskData)
          return taskData.map(task => {
            console.log(task)
            return {
              title: task.title,
              description: task.description,
              id: task._id
            };
          });
        })
      )
      .subscribe(transformedTasks => {
        this.tasks = transformedTasks;
        this.tasksUpdated.next([...this.tasks]);
      });
  }

  getTaskUpdateListener() {
    return this.tasksUpdated.asObservable();
  }

  getTask(id: string) {
    // return this.http.get<{ _id: string; title: string; content: string }>(
    //   "https://nestjs-authentication.herokuapp.com/api/tasks/" + id
    // );
  }

  addTask(title: string, description: string) {
    const task: Task = { id: null, title: title, description: description };
    const userData: { email: string, password: string, access_token: string, tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'))
    var access_token = userData.access_token;
    console.log(access_token)
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + access_token);
    this.http
      .post<{ message: string; taskId: string }>(
        "https://nestjs-authentication.herokuapp.com/task",
        task,
        {
          headers : headers_object
        }
      )
      .subscribe(responseData => {
        const id = responseData.taskId;
        task.id = id;
        this.tasks.push(task);
        this.tasksUpdated.next([...this.tasks]);
        this.router.navigate(["/"]);
      });
  }

  updateTask(id: string, title: string, description: string) {
    const task: Task = { id: id, title: title, description: description };
    this.http
      .post("https://nestjs-authentication.herokuapp.com/task/" + id, task)
      .subscribe(response => {
        const updatedTasks = [...this.tasks];
        const oldTaskIndex = updatedTasks.findIndex(p => p.id === task.id);
        updatedTasks[oldTaskIndex] = task;
        this.tasks = updatedTasks;
        this.tasksUpdated.next([...this.tasks]);
        this.router.navigate(["/"]);
      });
  }

  deleteTask(taskId: string) {
  //   this.http
  //     .delete("https://nestjs-authentication.herokuapp.com/api/tasks/" + taskId)
  //     .subscribe(() => {
  //       const updatedTasks = this.tasks.filter(task => task.id !== taskId);
  //       this.tasks = updatedTasks;
  //       this.tasksUpdated.next([...this.tasks]);
  //     });
  // }
}
}
