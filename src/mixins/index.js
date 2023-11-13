import Moment from "moment";
export const Loading = {
  methods: {
    showLoading(message) {
      this.$q.loading.show({
        message: message
      });
    },
    hideLoading() {
      this.$q.loading.hide();
    }
  }
};
export const Noty = {
  methods: {
    Noty(type, message, position = "top") {
      switch (type) {
        case "success":
          this.$q.notify({
            type: "positive",
            message,
            position
          });
          break;
        case "warning":
          this.$q.notify({
            type: "warning",
            message,
            position
          });
          break;
        case "error":
          this.$q.notify({
            type: "negative",
            message,
            position
          });
          break;
        case "info":
          this.$q.notify({
            type: "info",
            message,
            position
          });
          break;
      }
    }
  }
};

export const Filters = {
  filters: {
    currency(value) {
      if (value) {
        if (value !== undefined) {
          return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        }
      }
      return "0";
    },
    date(value) {
      return Moment(value).format("YYYY-MM-DD");
    },
    dateFormat(value) {
      return Moment(value).format("DD-MM-YYYY");
    },
    hourFormat(value) {
      return Moment(value).format("LT");
    },
    diffDate(date, now = Moment()) {
      if (date) {
        const before = Moment(date);
        return now.diff(before, "minutes");
      }
      return "";
    },
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
};

export const Scroll = {
  methods: {
    toId(id) {
      var element = document.getElementById(id);
      if (element) {
        element.scrollIntoView(true);
        window.scrollBy(0, -30);
      }
    }
  }
};

export const Utils = {
  methods: {
    isNumero(val) {
      if (!isNaN(val)) {
        return false;
      }
      return true;
    }
  }
};
