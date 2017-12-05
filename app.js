new Vue ({
    el: '#app',
    data: {
        playerHP: 100,
        monsterHP: 100,
        playerMP: 100,
        isRunning: false,
        turns: [],
    },
    methods: {
        startGame() {
            this.isRunning = true;
            this.playerHP = 100;
            this.playerMP = 100;
            this.monsterHP = 100;
        },
        dmgCalc(min, max) {
            return Math.max(Math.floor(Math.random() * max) + 1, min);
        },
        checkWin() {
            if (this.monsterHP <= 0) {
                confirm('You won! Start a New Game?') ? this.startGame() : this.isRunning = false;
                return true; 
            } else if (this.playerHP <= 0) {
                confirm('You lost! Start a New Game?') ? this.startGame() : this.isRunning = false;
                return true; 
            }
            return false;
        },
        checkMana(cost) {
            return this.playerMP - cost >= 0;
        },
        monsterAtk() {
            let dmg = this.dmgCalc(5, 12);
            this.playerHP -= dmg;
            this.turns.unshift({
                isPlayer: false,
                message: 'Monster attacked player for ' + dmg + ' damage.'
            });
            if (this.playerMP <= 95) {
                this.playerMP += 5;
            }
            else {
                this.playerMP += 100 - this.playerMP;
            }
            this.checkWin();
        },
        regularAtk() {
            let dmg = this.dmgCalc(3, 10);
            this.monsterHP -= dmg;
            this.turns.unshift({
                isPlayer: true,
                message: 'Player attacked monster for ' + dmg + ' damage.'
            });
            if (this.checkWin()) {
                return;
            }
            this.monsterAtk();
        },
        specialAtk() {
            if (this.checkMana(25)) {
                this.playerMP -= 25;
                let dmg = this.dmgCalc(1, 20);
                this.monsterHP -= dmg;
                this.turns.unshift({
                    isPlayer: true,
                    message: 'Player attacked monster for ' + dmg + ' special damage.'
                });
                if (this.checkWin()) {
                    return;
                }
                this.monsterAtk();
            } else {
                alert('Not enough mana.');
            }
        },
        heal() {
            if (this.checkMana(15)) {
                this.playerMP -= 15;    
                let health = 0;
                this.playerHP <= 90 ? health = 10 : health = 100 - this.playerHP;
                this.playerHP += health;
                this.turns.unshift({
                    isPlayer: true,
                    message: 'Player healed self for ' + health + ' health.'
                });
                this.monsterAtk();
            } else {
                alert('Not enough mana.');
            }
        },
        giveUp() {
            this.isRunning = false;
        }
    }
});