import { getPersonsDefault, getPersonsSearch, postPerson, updatePerson } from "./axios/index.js";
import styles from './styles.css';

var app = new Vue({
  el: "#app",
  data: {
    loading: false,
    persons: [],
    search: "",
    overlayForm: false,
    name: "",
    phone: "",
    action: "",
    id: null,
    formTitle: ""
  },
  created() {
    this.getPersonsFromApi();
  },
  methods: {
    toggleFormClean () {
      this.formTitle = "Add Contact";
      this.overlayForm = !this.overlayForm
      this.action = "POST";
      this.name = "";
      this.phone = "";
    },
    toggleFormUpdate (name, phone, id){  
      this.formTitle = "Update Contact";
      this.overlayForm = !this.overlayForm;
      this.action = "PUT";
      this.name = name;
      this.phone = phone;
      this.id = id;
    },
    handleSubmit() {
      this.overlayForm = !this.overlayForm;
      this.loading = true;
      if (this.action==='POST'){
        postPerson({
          name:this.name,
          phone:this.phone
        },this.getPersonsFromApi);
      }
      else if (this.action==='PUT'){
        updatePerson({
          name:this.name,
          phone:this.phone,
          id:this.id
        },this.getPersonsFromApi);
      }
    },
    getPersonsFromApi() {
      this.loading = true;
      getPersonsDefault()
        .then(response => {
          this.loading = false;
          this.persons = response.data.data;
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchPersons() {
      this.loading = true;
      if (this.search==='') {
        this.getPersonsFromApi();
      } else {
        getPersonsSearch(this.search)
          .then(response => {
            this.loading = false;
            this.persons = response.data.data;
            console.log(response);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
});
