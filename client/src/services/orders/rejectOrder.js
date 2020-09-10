import axios from 'axios';

export default async function rejectOrder(idOrder, address){
	return
	       axios.put(`http://localhost:3001/orders/${idOrder}/rejected`, { address })
	       .then((response)=>{
	       	return response.data;
	       })
	       .catch(()=>{
	       	return undefined;
	       })
}