import axios from "axios";

export default async function remove(id) {
  return axios
    .delete(`http://localhost:3001/orders/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return undefined;
    });
}
