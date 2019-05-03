import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppRoutes, AppRoutesParams} from '../../constants';
import { Species, SpeciesDetails, Category, SpeciesPost, RemoteAPIStatus} from '../../models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import * as data from './image.json';
const TitleNew = 'Create New Library Item';
const SubTitleNew = 'Please add new species detail here';
const TitleExisting = 'Invasive Species Details';
const SubTitleExisting = 'Edit Species details';
const SelectCategoryText = 'Please select category';
const AddNewSpecies = 'Add New Species';
const EditeSpecies = 'Edit Species';
const Logo = data.image;
const SelectDateText = 'Please select date';

@Component({
  selector: 'app-species-details',
  templateUrl: './species-details.component.html',
  styleUrls: ['./species-details.component.css']
})
export class SpeciesDetailsComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  action: AppRoutesParams = AppRoutesParams.DetailAdd;
  id: any = '';
  categories: Category[] = [];
  selectedCategory?: Category;
  selectedCategoryName = SelectCategoryText;
  selectedDate = SelectDateText;
  pickerConfig: object = {
    format: 'YYYY-MM-DD'
  };
  isEditable = true;
  isEditMode = false;
  actionButtonTitle = AddNewSpecies;
  image: SafeResourceUrl;
  title = TitleNew;
  subTitle = SubTitleNew;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private _sanitizer: DomSanitizer) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      latin: ['', Validators.required],
      description: ['', [Validators.required]]
    });
    this.image = _sanitizer.bypassSecurityTrustResourceUrl(Logo);
  }
  get f() { return this.registerForm.controls; }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.action = params.action;
      this.id = +params.id;
      // console.log(`SpeciesDetailsComponent: Action: ${this.action}`);
      // console.log(`SpeciesDetailsComponent: id: ${this.id}`);
      this.isEditable = this.action === AppRoutesParams.DetailView ? false : true;
      this.isEditMode = this.action === AppRoutesParams.DetailEdit ? true : false;
      this.actionButtonTitle = this.isEditMode ? EditeSpecies : AddNewSpecies;
      if (this.isEditMode || !this.isEditable) {
        this.title = TitleExisting;
        this.subTitle = SubTitleExisting;
      } else {
        this.title = TitleNew;
        this.subTitle = SubTitleNew;
        this.selectedCategory = this.categories[0];
        this.selectedCategoryName = this.selectedCategory.name || SelectCategoryText;
        this.image = this._sanitizer.bypassSecurityTrustResourceUrl(this.selectedCategory.icon);
      }
      if (this.id !== -1) {
        this.fetchSpecies();
      }

    });
    
  }

  async fetchSpecies() {
    
  }

  selectCategory(input: string) {
    this.selectedCategory = this.categories.filter((c) =>  c.name === `${input}`)[0];
    this.selectedCategoryName = this.selectedCategory.name || SelectCategoryText;
    this.image = this._sanitizer.bypassSecurityTrustResourceUrl(this.selectedCategory.icon);
  }

  onCategorySelect(input: any) {
    // console.log(`get value: ${input}`);
    // console.dir(input);
    this.selectCategory(input);
  }

  onTimePickFrom(event: any) {
    this.selectedDate = event.format('YYYY-MM-DD');
    // console.log(`Date Selected: ${this.selectedDate}`);
  }

  async create() {
   
    this.router.navigate(['/']);
  }

  async update() {
    
  }

  clear() {
    this.zone.run(() => {
      this.registerForm = this.formBuilder.group({
        name: ['', Validators.required],
        latin: ['', Validators.required],
        description: ['', [Validators.required]]
      });
      this.selectedDate = '';
      this.selectedCategory = this.categories[0];
      this.selectedCategoryName = SelectCategoryText;
    });
  }

  get dateValid(): boolean {
    const check: boolean = this.selectedDate !== undefined && this.selectedDate !== '' && this.selectedDate !== SelectDateText;
    return check;
  }

  get formValid(): boolean {
    const case1 = this.registerForm.controls['name'].value !== '';
    const case2 = this.registerForm.controls['latin'].value !== '';
    const case3 = this.registerForm.controls['description'].value !== '';
    return case1 && case2 && case3;
  }

  validate() {
    if (!this.formValid) {
      alert('Please add name, latin name and description');
      return false;
    }
    if (!this.selectedCategory) {
      alert('Please select category');
      return false;
    }
    if (!this.dateValid) {
      alert('Please select introduction date');
      return false;
    }
    return true;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.validate()) {
      return;
    }

    if (this.isEditMode) {
      this.update();
    } else {
      this.create();
    }
  }
}
