//import Vue from "vue";
import { getPersonsDefault, getPersonsSearch } from "./axios/index.js";

var app = new Vue({
  el: "#app",
  data: {
    loading: false,
    persons: [],
    search: ""
  },
  created() {
    this.getPersonsFromApi();
  },
  methods: {
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
