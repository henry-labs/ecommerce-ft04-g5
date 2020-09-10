import axios from 'axios';

export default async function prepareOrder(idOrder, address ){
	return
	       axios.put(`http://localhost:3001/orders/${idOrder}/preparing`, { address })
	       .then((response)=>{
	       	return response.data;
	       })
	       .catch(()=>{
	       	return undefined;
	       })
}