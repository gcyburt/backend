import neo4j from 'neo4j-driver';

export default class Neo4jService {
    private driver: neo4j.Driver;

    constructor() {
        this.driver = neo4j.driver(process.env.NEO4J_URI || '', neo4j.auth.basic(process.env.NEO4J_USERNAME || '', process.env.NEO4J_PASSWORD || ''));
    }

    async query(query: string, params: any) {
        const session = this.driver.session();
        const result = await session.run(query, params);
        await session.close();
        return result;
    }

    async close() {
        await this.driver.close();
    }
}
