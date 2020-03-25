import {
  getPersonsDefault,
  getPersonsSearch,
  getPersonsWithOffset,
  postPerson,
  updatePerson
} from "./axios/index.js";

import debounce from "lodash/debounce";

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
    name: "",
    phone: "",
    action: "",
    id: null,
    formTitle: "",
    offset: 0,
    isDBEnd: false
  },
  mounted() {
    this.handleDebouncedScroll = debounce(this.handleScroll, 100);
    this.getPersonsFromApi();
  },
  beforeDestroy() {
    this.removeListScrollListener();
  },
  methods: {
    addListScrollListener(){
      this.$refs.contactList.addEventListener(
        "scroll",
        this.handleDebouncedScroll
      );
    },
    removeListScrollListener(){
      this.$refs.contactList.removeEventListener(
        "scroll",
        this.handleDebouncedScroll
      );
    },
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
          this.addListScrollListener();
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchPersons() {
      this.loading = true;
      this.removeListScrollListener();
      if (this.search === "") {
        this.getPersonsFromApi();
      } else {
        this.removeListScrollListener();
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
    handleScroll(event) {
      if (
        this.$refs.contactList.scrollTop ===
        this.$refs.contactList.scrollHeight -
          this.$refs.contactList.offsetHeight
      ) {
        this.pushMorePersons();
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
      } else {
        this.removeListScrollListener();
      }
    }
  }
});
