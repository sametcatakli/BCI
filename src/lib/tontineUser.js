class TontineUser {
    constructor(userId, name, email, walletAddress) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.walletAddress = walletAddress;
        this.tontines = [];
    }

    // Rejoindre une tontine
    joinTontine(tontineId) {
        if (this.tontines.includes(tontineId)) {
            throw new Error(`L'utilisateur est déjà membre de la tontine : ${tontineId}`);
        }
        this.tontines.push(tontineId);
    }

    // Quitter une tontine
    leaveTontine(tontineId) {
        this.tontines = this.tontines.filter(id => id !== tontineId);
    }

    // Lister les tontines de l'utilisateur
    listTontines() {
        return this.tontines;
    }
}

module.exports = TontineUser;
