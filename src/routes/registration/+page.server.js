export const actions = {
	sendFormRegistration: async ({ request }) => {
		try {
			const formData = await request.formData();
			const data = Object.fromEntries(formData);
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	}
};
