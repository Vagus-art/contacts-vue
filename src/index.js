import {
  getPersonsDefault,
  getPersonsSearch,
  getPersonsWithOffset,
  postPerson,
  updatePerson,
  deletePerson
} from "./axios/index.js";

//styles are imported because webpack only injects them in the html if they are instanced in the js entry
import styles from "./styles.css";

const app = new Vue({
  el: "#app",
  data: {
    loading: false,
    loadingMore: false,
    persons: [],
    search: "",
    overlayForm: false,
    deleteWindow: false,
    aboutWindow: false,
    currentDeleteName: null,
    currentDeleteId: null,
    name: "",
    phone: "",
    action: "",
    id: null,
    formTitle: "",
    offset: 0,
    isDBEnd: false
  },
  mounted() {
    this.getPersonsFromApi();
  },
  methods: {
    toggleFormClean() {
      this.formTitle = "Add Contact";
      this.overlayForm = !this.overlayForm;
      this.action = "POST";
      this.name = "";
      this.phone = "";
    },
    toggleFormUpdate(name, phone, id) {
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
      if (this.action === "POST") {
        postPerson(
          {
            name: this.name,
            phone: this.phone
          },
          this.getPersonsFromApi
        );
      } else if (this.action === "PUT") {
        updatePerson(
          {
            name: this.name,
            phone: this.phone,
            id: this.id
          },
          this.getPersonsFromApi
        );
      }
    },
    getPersonsFromApi() {
      this.loading = true;
      this.isDBEnd = false;
      this.offset = 0;
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
      this.isDBEnd = true;
      if (this.search === "") {
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
    },
    pushMorePersons() {
      this.offset++;
      if (!this.isDBEnd) {
        this.loadingMore = true;
        getPersonsWithOffset(this.offset)
          .then(response => {
            this.loadingMore = false;
            this.persons.push(...response.data.data);
            if (response.data.data.length < 10) {
              this.isDBEnd = true;
            }
            console.log(response);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    toggleDelete(name,id){
      this.deleteWindow= !this.deleteWindow;
      this.currentDeleteName=name || null;
      this.currentDeleteId=id || null;
    },
    confirmDelete(){
      deletePerson(this.currentDeleteId).then(res=>this.getPersonsFromApi());
      this.toggleDelete();
    },
    toggleAbout(){
      this.aboutWindow = !this.aboutWindow;
    }
  }
});
