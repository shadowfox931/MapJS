/* global BigInt */
const { clearOtherSessions } = require('../session-store.js');

module.exports = async (client, oldPresence, newPresence) => {
    const rolesBefore = oldPresence.roles.cache
        .filter(x => BigInt(x.id).toString())
        .keyArray();
    const rolesAfter = newPresence.roles.cache
        .filter(x => BigInt(x.id).toString())
        .keyArray();
    const perms = Object.values(client.config.discord.perms)
        .map(x => x.roles)
        .reduce(x => [...x]);
    const roleDiff = rolesBefore
        .filter(x => !rolesAfter.includes(x))
        .concat(rolesAfter
            .filter(x => !rolesBefore.includes(x))
        );
    try {
        if (perms.includes(roleDiff[0])) {
            await clearOtherSessions(oldPresence.user.id, '');
        }
    } catch (e) {
        console.error(`Could not clear sessions for ${oldPresence.user.username}#${oldPresence.user.discriminator}`);
    }
};
