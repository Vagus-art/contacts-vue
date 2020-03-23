import { getPersonsDefault, getPersonsSearch } from "./axios/index.js";
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
    id: null
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
