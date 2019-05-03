import { Component, OnInit, Input } from '@angular/core';
import { Species , Category} from '../../models';
import { UtilityService} from '../../services';
import { Router } from '@angular/router';
import { AppRoutes, AppRoutesParams} from '../../constants/app-routes.enum';
@Component({
  selector: 'app-species-table',
  templateUrl: './species-table.component.html',
  styleUrls: ['./species-table.component.css']
})

export class SpeciesTableComponent implements OnInit {
  // Species array
  @Input() models: Species[];
  @Input() categories: Category[];

  // Filtering
  selectedCategory?: Category;
  selectedCategoryId?: String;

  // Sort flags
  sortAscending = false;
  sortingByName = false;
  sortingByLatinName = false;
  sortingByCategory = false;
  sortingByIntroductionDate = false;

  /* Setup Functions */
  constructor() {
    this.fetchData();
  }

  async fetchSpecies() {
  }

  async fetchCategories() {
  }

  fetchData() {
    this.fetchSpecies();
    this.fetchCategories();
    this.selectedCategory = this.getAllCategoriesOption();
    this.selectedCategoryId = this.getAllCategoriesOption().id;
  }

  ngOnInit() {}

  /* Filtering Functions */

  getAllCategoriesOption() {
    let allCatsOption: Category = {
      id: "all",
      name: "All Categories",
      icon: "",
    };
    return allCatsOption;
  }

  getCategory(withId: String) {
    for (let category of this.categories) {
      if (category.id == withId) {
        return category;
      }
    }
  }

  async selectCategory(id: String) {
    
  }

  /* Sorting Functions*/

  sortByName() {
    // If aready sorting by this criteria, 
    // Flip between ascending and descending
    if (this.sortingByName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false
    }

    // Set sort flags
    this.sortingByName = true;
    this.sortingByLatinName = false;
    this.sortingByCategory = false;
    this.sortingByIntroductionDate = false;
    
    // Sort objects
    this.models.sort((left, right): number => {
      if (left.name < right.name) {
        if (this.sortAscending) {
          return 1
        } else {
          return -1;
        }
      }
      if (left.name > right.name) {
        if (this.sortAscending) {
          return -1
        } else {
          return 1;
        }
      }
      return 0;
    }); 
  }

  sortByLatinName() {
    // If aready sorting by this criteria, 
    // Flip between ascending and descending
    if (this.sortingByLatinName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false
    }

    // Set sort flags
    this.sortingByLatinName = true
    this.sortingByName = false;
    this.sortingByCategory = false;
    this.sortingByIntroductionDate = false;

    // Sort objects
    this.models.sort((left, right): number => {
      if (left.latin < right.latin) {
        if (this.sortAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.latin > right.latin) {
        if (this.sortAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
  }

  sortByCategory() {
    // If aready sorting by this criteria, 
    // Flip between ascending and descending
    if (this.sortingByCategory) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false
    }

    // Set sort flags
    this.sortingByCategory = true
    this.sortingByName = false;
    this.sortingByLatinName = false;
    this.sortingByIntroductionDate = false;

    // Sort objects
    this.models.sort((left, right): number => {
      if (left.category < right.category) {
        if (this.sortAscending) {
          return 1
        } else {
          return -1;
        }
      }
      if (left.category > right.category) {
        if (this.sortAscending) {
          return -1
        } else {
          return 1;
        }
      }
      return 0;
    }); 
  }

  sortByIntroductionDate() {
    // If aready sorting by this criteria, 
    // Flip between ascending and descending
    if (this.sortingByIntroductionDate) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false
    }

    // Set sort flags
    this.sortingByIntroductionDate = true
    this.sortingByName = false;
    this.sortingByLatinName = false;
    this.sortingByCategory = false;

    // Sort objects
    this.models.sort((left, right): number => {
      if (left.introduction < right.introduction) {
        if (this.sortAscending) {
          return -1
        } else {
          return 1;
        }
      }
      if (left.introduction > right.introduction) {
        if (this.sortAscending) {
          return 1
        } else {
          return -1;
        }
      }
      return 0;
    }); 
  }

  /* Action functions */
  async delete(species) {
  }

  edit(species) {
    console.log("Edit " + species.name)
  }

  view(species) {
    console.log("View " + species.name)
  }

  create() {
  }
}
