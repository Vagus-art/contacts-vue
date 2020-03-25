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
  created() {
    this.getPersonsFromApi();
  },
  mounted() {
    this.handleDebouncedScroll = debounce(this.handleScroll, 100);
    this.$refs.contactList.addEventListener(
      "scroll",
      this.handleDebouncedScroll
    );
  },
  beforeDestroy() {
    // I switched the example from `destroyed` to `beforeDestroy`
    // to exercise your mind a bit. This lifecycle method works too.
    this.$refs.contactList.removeEventListener(
      "scroll",
      this.handleDebouncedScroll
    );
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
    handleScroll(event) {
      // Any code to be executed when the window is scrolled
      if (
        this.$refs.contactList.scrollTop ===
        this.$refs.contactList.scrollHeight -
          this.$refs.contactList.offsetHeight
      ) {
        this.pushMoreContacts();
      }
    },
    pushMoreContacts() {
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
        this.$refs.contactList.removeEventListener(
          "scroll",
          this.handleDebouncedScroll
        );
      }
    }
  }
});
