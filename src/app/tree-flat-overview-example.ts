import { FlatTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: "Fruit",
    children: [{ name: "Apple" }, { name: "Banana" }, { name: "Fruit loops" }]
  },
  {
    name: "Vegetables",
    children: [
      {
        name: "Green",
        children: [{ name: "Broccoli" }, { name: "Brussels sprouts" }]
      },
      {
        name: "Orange",
        children: [{ name: "Pumpkins" }, { name: "Carrots" }]
      }
    ]
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: "tree-flat-overview-example",
  templateUrl: "tree-flat-overview-example.html",
  styleUrls: ["tree-flat-overview-example.css"]
})
export class TreeFlatOverviewExample {
  movies = [
    "Episode 1 - The Phantom Menace",
    "Episode 2 - Attack of the Clones",
    "Episode 3 - Revenge of the Sith",
    "Episode 4 - A New Hope",
    "Episode 5 - The Empire Strikes Back",
    "Episode 6 - Return of the Jedi",
    "Episode 7 - The Force Awakens",
    "Episode 8 - The Last Jedi",
    "Episode 9 – The Rise of Skywalker",
    "Episode 5 - The Empire Strikes Back"
  ];

  canDrag = false;
  answers = [
    { id: "id_1", text: "A1", order: 0, isCorrect: true },
    { id: "id_2", text: "A2", order: 1, isCorrect: false },
    { id: "id_3", text: "A3", order: 2, isCorrect: false }
  ];

  newAnswer: string = "";
  addAnswer(newAnswer: string) {
    this.answers.push({
      id: "id_4",
      text: newAnswer,
      order: this.answers.length,
      isCorrect: false
    });
    this.newAnswer = "Enter new choice";
    console.log(this.answers);
  }

  removeAnswer(answer: any) {
    console.table(this.answers);
    if (this.answers.length <= 1) this.answers = [];
    else {
      this.answers.splice(answer.order, 1);
      var i = 0;
      for (i = 0; i < this.answers.length; i++) this.answers[i].order = i;
    }
    console.table(this.answers);
  }

  saveAnswers() {
    this.canDrag = false;
    var hasModelAnswer = false;
    if (this.answers.length >= 2) {
      this.answers.forEach(answer => {
        if (answer.isCorrect) hasModelAnswer = true;
      });
      if (!hasModelAnswer) {this.canDrag = true; console.log("hasModelAnswer is false")};
    } else {this.canDrag = true;console.log("you should add atleast two options :(")};
  }

  dropAnswer(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.answers, event.previousIndex, event.currentIndex);
    console.log(this.answers[event.currentIndex].order);
    console.log(this.answers[event.previousIndex].order);
    this.answers[event.currentIndex].order = event.currentIndex;
    this.answers[event.previousIndex].order = event.previousIndex;
    if (event.currentIndex != event.previousIndex) {
      var i = 0;
      for (i = 0; i < this.answers.length; i++) this.answers[i].order = i;
      console.table(this.answers);
      console.log("Go and update the database");
    } else console.log("Do nothing");
  }

  drop(event: CdkDragDrop<string[]>) {
    // console.log(event)
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  setMyStyles() {
    if (this.canDrag == false)
      return {
        border: "none",
        // "border-bottom": "1px dotted",
        background: "none",
        outline: "none",
        "line-height": "20px",
        "border-color": "#b7b7b7"
      };
    else {
      return {
        "border-radius": "5px",
        height: "27px",
        "align-content": "center",
        "padding-left": "10px",
        outline: "none",
        "border-color": "#b7b7b7",
        "border-width": "1px",
        "border-style": "dashed"
      };
    }
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  constructor(private _formBuilder: FormBuilder) {
    this.dataSource.data = TREE_DATA;

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}

/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
