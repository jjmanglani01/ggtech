import resolversQueries from "./resolvers-queries";
import resolversMutations from "./resolvers-mutations";
import resolversTypes from "./resolvers-types";

export default [...resolversQueries, ...resolversMutations, ...resolversTypes];
