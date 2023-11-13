import ServiceApi from "../../helpers/ServiceApi";
export function getServiciosGlobal({ commit, state }) {
  return new Promise((resolve, reject) => {
    ServiceApi.post("/services/get/servicios", { filter: state.pagination })
      .then(response => {
        let data = response.data.servicios;
        commit("setTotalPage", response.data.pagi.lastPage);
        commit("setTotal", response.data.pagi.tota);
        commit("setPage", response.data.pagi.page);
        commit("setData", data);
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}
