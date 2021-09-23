import http from "../http-common";
import axios from "axios";

class ExerciseDataService {
  getAll() {
    return axios.get("/api/exercises").then(res => dispatchEvent({payload:res.data}));
  }

  get(id) {
    return http.get(`/exercises/${id}`);
  }

  create(data) {
    return http.post("/exercises", data);
  }
}

export default new ExerciseDataService();