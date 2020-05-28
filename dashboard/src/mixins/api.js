import { Api, ENDPOINTS } from '@/core/Api';

export default {
	data(){
		return {
			ENDPOINTS
		}
	},
    methods:{
        async getData(resource, options) {
			const response = await Api.call(resource, options);
			if (response.confirmation.toLowerCase() !== "success") {
				this.$toasted.error(response.message);
				return;
			}
			return response.results;
		},
    }
}