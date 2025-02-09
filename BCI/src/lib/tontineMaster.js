const Tontine = require("./tontine");

class TontineMaster {
    constructor(masterId) {
        this.masterId = masterId;
        this.tontines = {};
    }

    createTontine(name) {
        const tontineId = `tontine_${Date.now()}`;
        const tontine = new Tontine(tontineId, name, this.masterId);
        this.tontines[tontineId] = tontine;
        return tontine;
    }

    addUserToTontine(tontineId, userId, amount) {
        if (!this.tontines[tontineId]) {
            throw new Error("Tontine introuvable.");
        }
        this.tontines[tontineId].addMember(userId, amount);
    }

    removeUserFromTontine(tontineId, userId) {
        if (!this.tontines[tontineId]) {
            throw new Error("Tontine introuvable.");
        }
        this.tontines[tontineId].removeMember(userId);
    }

    validatePayments(tontineId) {
        if (!this.tontines[tontineId]) {
            throw new Error("Tontine introuvable.");
        }
        if (this.tontines[tontineId].checkAllPaid()) {
            this.tontines[tontineId].resetCycle();
            return "Cycle terminé, nouveau cycle commencé.";
        } else {
            return "Tous les membres n'ont pas payé.";
        }
    }
}

module.exports = TontineMaster;
