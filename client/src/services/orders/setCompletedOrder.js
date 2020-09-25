import axios from "axios";

export default async function setCompletedOrder(idOrder) {
  return axios
    .put(`${process.env.API}/orders/${idOrder}/finalized`)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return undefined;
    });
}

// TODO - importante para usar - PONE UNA ORDEN COMO FINALIZADA