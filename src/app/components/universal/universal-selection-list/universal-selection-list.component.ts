import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-universal-selection-list',
  templateUrl: './universal-selection-list.component.html',
  styleUrls: ['./universal-selection-list.component.scss']
})
export class UniversalSelectionListComponent implements OnInit {

  @Input() listData: ListData;

  public selectedElements: boolean[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * @description Generates an array of the IDs of selected elements. Used by buttons within the component which execute their given callback function, passing in the array of selected elements.
   * @returns {number[]} An array of the IDs of all selected elements
   */
  public findSelectedElementsForCallback(): number[] {
    const output: number[] = this.listData.listElements.filter( // Filter to only selected elements
      (el: ListElement, i: number) => {
        return !!this.selectedElements[i]; // double negated so that if it's undefined it will return false
      }
    ).map(el => el.uniqueId); // map to just the IDs

    this.selectedElements = [];

    return output;
  }

  /**
   * @description Used in the html for processing when an element is clicked. Finds the selected element and toggles the state in the boolean array of selectedElements.
   * @param {number} index The index of the selected element, as passed in by the ngFor loop
   * @returns {void}
   */
  public onSelectElement(index: number): void {
    if (!this.listData.canMultiSelect) {
      for (let i = 0; i < this.selectedElements.length; i++) {
        if (i !== index) {
          this.selectedElements[i] = false;
        }
      }
    }
    this.selectedElements[index] = !this.selectedElements[index];

  }

}

export type ListData = {
  canMultiSelect: boolean,
  listElements: ListElement[],
  topText?: string,
  buttons: ButtonData[]
}

export type ListElement = {
  text: string,
  uniqueId: number,
  description?: string,
}

export type ButtonData = {
  bootstrapButtonClass: string,
  text: string,
  callback: (selectedElements: number[]) => void
}

// export enum ButtonTypes {
//   ClearAll,
//   SelectAll,
// }