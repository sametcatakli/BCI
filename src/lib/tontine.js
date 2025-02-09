class Tontine {
    constructor(id, name, masterId) {
        this.id = id;
        this.name = name;
        this.masterId = masterId;
        this.members = {};
        this.cycleState = "active"; // Peut être "active", "completed"
        this.atmCycle = 0;
    }

    addMember(userId, amount) {
        if (this.members[userId]) {
            throw new Error("L'utilisateur est déjà membre.");
        }
        this.members[userId] = { amount, hasPaid: false };
    }

    removeMember(userId) {
        if (!this.members[userId]) {
            throw new Error("L'utilisateur n'est pas membre.");
        }
        delete this.members[userId];
    }

    markPayment(userId) {
        if (!this.members[userId]) {
            throw new Error("L'utilisateur n'est pas membre.");
        }
        this.members[userId].hasPaid = true;
    }

    checkAllPaid() {
        return Object.values(this.members).every(member => member.hasPaid);
    }

    resetCycle() {
        this.atmCycle += 1;
        Object.keys(this.members).forEach(userId => {
            this.members[userId].hasPaid = false;
        });
    }
}

module.exports = Tontine;
