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
    phone: ""
  },
  created() {
    this.getPersonsFromApi();
  },
  methods: {
    toggleFormClean () {
      this.overlayForm = !this.overlayForm
      this.name = "",
      this.phone = ""
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
