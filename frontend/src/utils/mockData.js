export const schemes = [
  {
    scheme_id: 1,
    scheme_name: "Free Laptop Scheme",
    description: "For students scoring above 80%",
    status: "Active"
  },
  {
    scheme_id: 2,
    scheme_name: "Healthcare Support Scheme",
    description: "Financial help for medical treatment",
    status: "Active"
  },
  {
    scheme_id: 3,
    scheme_name: "Farmer Subsidy Program",
    description: "Subsidy for fertilizers and seeds",
    status: "Active"
  }
];

export let applications = [];

export const addApplication = (app) => {
  applications.push(app);
};