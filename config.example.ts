interface Config {
    BOT_TOKEN: string;
    CLIENT_ID: string;
    GUILD_ID: string;
    MONGO_URI: string;
    ADMIN_IDs: string[];
    claims: Claim[]
}

interface Claim {
    name: string;
    discordRoleId: string,
}

export const config: Config = {
    BOT_TOKEN: '',
    CLIENT_ID: '',
    GUILD_ID: '',
    MONGO_URI: 'mongodb://localhost:27017/discordbot',
    ADMIN_IDs: ['258018973696655364', ''],
    claims: [
        {name: 'patreon1', discordRoleId: ''},
        {name: 'patreon2', discordRoleId: ''},
    ]
};

export default config;